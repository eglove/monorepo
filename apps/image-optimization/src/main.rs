mod validate_token;

use actix_multipart::Multipart;
use actix_web::{App, HttpResponse, HttpServer, Responder, Error, get, post};
use dotenv::dotenv;
use futures::{StreamExt};
use minio::s3::client::Client;
use minio::s3::args::{GetObjectArgs, MakeBucketArgs, UploadObjectArgs};
use minio::s3::creds::StaticProvider;
use minio::s3::http::BaseUrl;

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

        let base_url = "localhost:9000".parse::<BaseUrl>().unwrap();
        let provider = StaticProvider::new("admin", "password", None);
        let minio_client = Client::new(base_url.clone(), Some(Box::new(provider)), None, None).unwrap();
        let bucket_name = "test_bucket";
        let exists = minio_client.make_bucket(&MakeBucketArgs::new(&bucket_name).unwrap()).await;

        if exists.is_err() {
            minio_client.make_bucket(&MakeBucketArgs::new(&bucket_name).unwrap()).await.unwrap();
        }

        minio_client.upload_object(
            &mut UploadObjectArgs::new(
                &bucket_name,
                filename,
                filename,
            )
                .unwrap(),
        )
            .await
            .unwrap();

        let object = minio_client.get_object(&GetObjectArgs{
            extra_headers: None,
            extra_query_params: None,
            region: None,
            bucket: "test_bucket",
            object: filename,
            version_id: None,
            ssec: None,
            offset: None,
            length: None,
            match_etag: None,
            not_match_etag: None,
            modified_since: None,
            unmodified_since: None,
        }).await;

        if let Ok(obj) = object {
            match obj.text().await {
                Ok(obj_str) => println!("{}", obj_str),
                Err(_) => println!("Failed to read object"),
            }
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
        .bind(("0.0.0.0", 8080))?
        .run()
        .await
}