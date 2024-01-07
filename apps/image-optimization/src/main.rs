mod controllers;

use actix_multipart::Multipart;
use actix_web::{App, HttpResponse, HttpServer, Responder, Error, get, post, web};
use dotenv::dotenv;

#[post("/upload")]
async fn upload(payload: Multipart) -> Result<HttpResponse, Error> {
    controllers::save_file::save_file(payload).await?;

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
            .route("/images/{id}", web::get().to(controllers::serve_image::serve_image))
    })
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}