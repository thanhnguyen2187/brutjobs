use crate::app_state::AppState;
use crate::db::{Job, create_job, select_jobs};
use crate::err::{Error, Result};
use axum::Json;
use axum::extract::{Query, State};
use axum::http::HeaderMap;
use chrono::format::Fixed::TimezoneOffset;
use chrono::{DateTime, NaiveDateTime, Utc};
use chrono::{FixedOffset, TimeZone};
use diesel::{Connection, SqliteConnection};
use serde_derive::{Deserialize, Serialize};
use serde_json::{Value, json};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tracing::info;
use uuid::{Timestamp, Uuid};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "kebab-case")]
pub struct ParamsJobsGet {
    from_timestamp: Option<i64>,
    to_timestamp: Option<i64>,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct JobDisplay {
    pub id: String,
    pub title: String,
    pub company: String,
    pub location_type: String,
    pub location_country: String,
    pub level: String,
    pub domains: Vec<String>,
    pub date_posted_timestamp_ms: i64,
}

impl From<Job> for JobDisplay {
    fn from(job: Job) -> Self {
        JobDisplay {
            id: job.id.unwrap_or(String::from("")),
            title: job.title.unwrap_or(String::from("")),
            company: job.company.unwrap_or(String::from("")),
            location_type: job.location_type.unwrap_or(String::from("")),
            location_country: job.location_country.unwrap_or(String::from("")),
            level: job.level.unwrap_or(String::from("")),
            domains: job
                .domains
                .unwrap_or(String::from(""))
                .split(',')
                .map(|s| s.to_string())
                .collect(),
            date_posted_timestamp_ms: job.date_posted_timestamp_ms.unwrap_or(0),
        }
    }
}

impl From<PayloadJobsPost> for Job {
    fn from(payload: PayloadJobsPost) -> Self {
        Job {
            id: None,
            title: Some(payload.title),
            company: Some(payload.company),
            location_type: Some(payload.location_type),
            location_country: Some(payload.location_country),
            level: Some(payload.level),
            domains: Some(payload.domains),
            date_posted_timestamp_ms: Some(payload.date_posted_timestamp_ms),
            date_updated_timestamp_ms: Some(Utc::now().timestamp_millis()),
        }
    }
}

impl From<JobDisplay> for Job {
    fn from(job: JobDisplay) -> Self {
        Job {
            id: Some(job.id),
            title: Some(job.title),
            company: Some(job.company),
            location_type: Some(job.location_type),
            location_country: Some(job.location_country),
            level: Some(job.level),
            domains: Some(job.domains.join(",")),
            date_posted_timestamp_ms: Some(job.date_posted_timestamp_ms),
            date_updated_timestamp_ms: Some(Utc::now().timestamp_millis()),
        }
    }
}

pub async fn handle_jobs_get(
    Query(params): Query<ParamsJobsGet>,
    State(state_arc): State<Arc<Mutex<AppState>>>,
) -> Result<Json<Value>> {
    if let Ok(mut state) = state_arc.lock() {
        let from_timestamp_ms = params.from_timestamp;
        let to_timestamp_ms = params.to_timestamp;
        let jobs = select_jobs(
            &mut state.conn,
            from_timestamp_ms,
            to_timestamp_ms,
            Some(30),
        )?;
        let jobs_display: Vec<JobDisplay> = jobs.into_iter().map(JobDisplay::from).collect();

        return Ok(Json(json!({"data": jobs_display})));
    }

    Err(Error::StateLock {})
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PayloadJobsPost {
    pub title: String,
    pub company: String,
    pub location_type: String,
    pub location_country: String,
    pub level: String,
    pub domains: String,
    pub date_posted_timestamp_ms: i64,
}

pub async fn handle_jobs_post(
    headers: HeaderMap,
    State(state_arc): State<Arc<Mutex<AppState>>>,
    Json(payload): Json<PayloadJobsPost>,
) -> Result<Json<Value>> {
    if let Ok(mut state) = state_arc.lock() {
        if let Some(secret_key) = headers.get("X-Secret-Key") {
            let secret_key = secret_key.to_str()?;
            info!("secret key: {}", secret_key);
            if secret_key != state.secret_key {
                return Err(Error::SecretKeyInvalid);
            }
        } else {
            return Err(Error::SecretKeyInvalid);
        }

        let mut job: Job = payload.into();
        job.id = Some(Uuid::now_v7().to_string());
        create_job(&mut state.conn, &job)?;

        return Ok(Json(json!({"success": true})));
    }

    Err(Error::StateLock {})
}
