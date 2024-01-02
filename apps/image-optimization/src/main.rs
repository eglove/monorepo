mod validate_token;

use actix_multipart::form::MultipartForm;
use actix_multipart::form::tempfile::{TempFile};
use aws_sdk_s3;
use actix_web::{web, App, HttpResponse, HttpServer, Responder, Error, get};
use actix_web_httpauth::middleware::HttpAuthentication;
use dotenv::dotenv;
use validate_token::validate_token;

#[derive(Debug, MultipartForm)]
struct UploadForm {
    #[multipart(rename = "file")]
    files: Vec<TempFile>,
}

async fn save_files(
    MultipartForm(form): MultipartForm<UploadForm>,
) -> Result<impl Responder, Error> {
    // for f in form.files {
    //     let file_name = f.file_name.unwrap();
    //     let path = format!("./img_tmp/{}", file_name);
    //     f.file.persist(&path).unwrap();
    //
    //     aws_config::load_defaults(BehaviorVersion::latest()).await;
    //     let config = aws_config::load_from_env().await;
    //     let client = aws_sdk_s3::Client::new(&config);
    //     let bucket_name = "ethang-image-service-f1499c2";
    //
    //     if let Ok(_response) = client.head_bucket().bucket(bucket_name).send().await {
    //         let body = ByteStream::from_path(&path).await;
    //
    //         client.put_object().bucket(bucket_name).key(file_name).body(body.unwrap()).send().await.expect("Failed to upload");
    //
    //         fs::remove_file(&path).expect("Failed to delete temporary file");
    //     } else {
    //         return Ok(HttpResponse::NotFound());
    //     }
    // }

    Ok(HttpResponse::Ok())
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
            .wrap(HttpAuthentication::bearer(validate_token))
            .service(web::resource("/upload").route(web::post().to(save_files)))
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}