mod app_state;
mod db;
mod db_migration;
mod err;
mod frontend;
mod handlers;
mod schema;

use crate::app_state::AppState;
use crate::db::establish_connection;
use crate::db_migration::run_migrations;
use crate::err::Result;
use crate::handlers::{handle_jobs_get, handle_jobs_post};
use axum::{
    Router,
    extract::MatchedPath,
    http::{HeaderMap, Request},
    response::{Html, Response},
    routing::{get, post},
};
use dotenvy::dotenv;
use std::sync::{Arc, Mutex};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{info, warn};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                // axum logs rejections from built-in extractors with the `axum::rejection`
                // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                format!(
                    "{}=debug,tower_http=debug,axum::rejection=trace",
                    env!("CARGO_CRATE_NAME")
                )
                .into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let mut conn = establish_connection()?;
    run_migrations(&mut conn);
    info!("Ran database migrations");

    let host = std::env::var("HOST").unwrap_or(String::from("127.0.0.1"));
    let port = std::env::var("PORT").unwrap_or(String::from("3000"));
    let secret_key = std::env::var("SECRET_KEY").unwrap_or_else(|_| {
        let default_value = "brutjob_secret_key";
        warn!(
            "Using default value `{}` for secret key! Please change it in production environment!",
            default_value,
        );
        String::from(default_value)
    });

    let shared_state = Arc::new(Mutex::new(AppState { conn, secret_key }));
    let app = Router::new()
        .route("/api/v1/health", get(async || "alive!"))
        .route("/api/v1/jobs", get(handle_jobs_get))
        .route("/api/v1/jobs", post(handle_jobs_post))
        .fallback(frontend::static_handler)
        .layer(
            CorsLayer::new()
                .allow_methods(Any)
                .allow_origin(Any)
                .allow_headers(Any),
        )
        .layer(TraceLayer::new_for_http())
        .with_state(shared_state);

    let listener = tokio::net::TcpListener::bind(format!("{}:{}", host, port)).await?;

    info!("Listening on http://{}:{}", host, port);
    axum::serve(listener, app).await?;
    Ok(())
}
