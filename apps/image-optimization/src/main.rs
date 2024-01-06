mod validate_token;

use actix_multipart::form::MultipartForm;
use actix_multipart::form::tempfile::{TempFile};
use actix_multipart::Multipart;
use aws_sdk_s3;
use actix_web::{App, HttpResponse, HttpServer, Responder, Error, get, post};
use dotenv::dotenv;
use futures::{StreamExt, TryStreamExt};
use image::{GenericImageView};
use std::io::Write;
use actix_http::StatusCode;

#[derive(Debug, MultipartForm)]
struct UploadForm {
    #[multipart(rename = "image")]
    files: Vec<TempFile>,
}

#[post("/upload")]
async fn upload(mut payload: Multipart) -> Result<HttpResponse, Error> {
    while let Some(field_result) = payload.next().await {
        let mut field = field_result?;

        let mut bytes = Vec::new();
        while let Some(chunk) = field.next().await {
            let data = chunk?;
            bytes.extend_from_slice(&data);
        }

        let content_disposition = field.content_disposition();
        let filename = content_disposition.get_filename().unwrap();

        let img = image::load_from_memory(&bytes)
            .map_err(|e| { Error::from(actix_web::error::InternalError::new(e, StatusCode::INTERNAL_SERVER_ERROR)) })?;

        // Vector of desired sizes
        let sizes = vec![100, 200, 300];

        for size in sizes {
            // Create a new image with size x size pixels
            let resized = img.resize_to_fill(size, size, image::imageops::FilterType::Triangle);
            // Here you can push the resized image to the storage
            // For this example, I'll just output a message about new image size
            println!("New image size for {}: {}x{}", filename, resized.width(), resized.height());
        }
    }

    Ok(HttpResponse::Ok().finish())
}

#[get("/healthcheck")]
async fn healthcheck() -> impl Responder {
    HttpResponse::Ok().body("OK")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    HttpServer::new(|| {
        App::new()
            .service(healthcheck)
            // .wrap(HttpAuthentication::bearer(validate_token))
            .service(upload)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}