use crate::err::{Error, Result};
use diesel::expression::BoxableExpression;
use diesel::prelude::*;
use serde_derive::Serialize;
use serde_json::Value;
use snafu::ResultExt;
use std::env;

pub fn establish_connection() -> Result<SqliteConnection> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set either through environment variable or .env file");
    SqliteConnection::establish(&database_url)
        .with_whatever_context(|err| format!("Failed to connect to {}: {}", database_url, err))
}

#[derive(Queryable, Selectable, Insertable, Serialize)]
#[diesel(table_name = crate::schema::jobs)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
#[serde(rename_all = "camelCase")]
pub struct Job {
    pub id: Option<String>,
    pub title: Option<String>,
    pub company: Option<String>,
    pub location_type: Option<String>,
    pub location_country: Option<String>,
    pub level: Option<String>,
    pub domains: Option<String>,
    pub date_posted_timestamp_ms: Option<i32>,
    pub date_updated_timestamp_ms: Option<i32>,
}

pub fn select_jobs(
    conn: &mut SqliteConnection,
    from_timestamp_ms: Option<i32>,
    to_timestamp_ms: Option<i32>,
    limit: Option<i32>,
) -> Result<Vec<Job>> {
    use crate::schema::jobs::dsl::*;

    let mut query = jobs.into_boxed();
    if let Some(from_timestamp_ms) = from_timestamp_ms {
        query = query.filter(date_posted_timestamp_ms.ge(from_timestamp_ms));
    }
    if let Some(to_timestamp_ms) = to_timestamp_ms {
        query = query.filter(date_posted_timestamp_ms.ge(to_timestamp_ms));
    }
    if let Some(limit) = limit {
        query = query.limit(limit as i64);
    }
    query = query.order(date_posted_timestamp_ms.desc());
    let records = query.select(Job::as_select()).load(conn)?;

    Ok(records)
}
