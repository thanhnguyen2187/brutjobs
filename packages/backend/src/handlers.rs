use crate::app_state::AppState;
use crate::db::{Job, select_jobs};
use crate::err::{Error, Result};
use axum::Json;
use axum::extract::{Query, State};
use chrono::format::Fixed::TimezoneOffset;
use chrono::{DateTime, NaiveDateTime, Utc};
use chrono::{FixedOffset, TimeZone};
use diesel::{Connection, SqliteConnection};
use serde_derive::{Deserialize, Serialize};
use serde_json::{Value, json};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tracing::info;
use uuid::Uuid;

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "kebab-case")]
pub struct ParamsGetJobs {
    from_timestamp: Option<i64>,
    to_timestamp: Option<i64>,
}

pub async fn handle_jobs_get(
    Query(params): Query<ParamsGetJobs>,
    State(state_arc): State<Arc<Mutex<AppState>>>,
) -> Result<Json<Value>> {
    if let Ok(mut state) = state_arc.lock() {
        let from_timestamp_ms = params
            .from_timestamp
            .and_then(|value| i32::try_from(value).ok());
        let to_timestamp_ms = params
            .to_timestamp
            .and_then(|value| i32::try_from(value).ok());
        let jobs = select_jobs(
            &mut state.conn,
            from_timestamp_ms,
            to_timestamp_ms,
            Some(30),
        )?;

        return Ok(Json(json!({"data": jobs})));
    }

    Err(Error::StateLock {})
}
