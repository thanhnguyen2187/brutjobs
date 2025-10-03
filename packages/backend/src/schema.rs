// @generated automatically by Diesel CLI.

diesel::table! {
    jobs (id) {
        id -> Nullable<Text>,
        title -> Nullable<Text>,
        company -> Nullable<Text>,
        location_type -> Nullable<Text>,
        location_country -> Nullable<Text>,
        level -> Nullable<Text>,
        domains -> Nullable<Text>,
        date_posted_timestamp_ms -> Nullable<BigInt>,
        date_updated_timestamp_ms -> Nullable<BigInt>,
    }
}
