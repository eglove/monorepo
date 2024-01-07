use actix_web::{web, Error, HttpResponse};
use awc::http::StatusCode;
use mongodb::Client;
use mongodb::options::GridFsBucketOptions;
use futures_util::io::AsyncReadExt;
use mongodb::bson::{Bson, doc, Document};
use crate::controllers::save_file::Image;

const MONGO_DB_URL: &str = "mongodb://localhost:27017";
const DB_NAME: &str = "images";
const COLLECTION_NAME: &str = "images";

async fn download_image(bucket: &mongodb::gridfs::GridFsBucket, id: &Bson) -> Result<HttpResponse, std::io::Error> {
    let mut buf = Vec::new();
    let mut download_stream = bucket.open_download_stream(Bson::from(id)).await;
    download_stream.read_to_end(&mut buf).await.unwrap();
    Ok(HttpResponse::build(StatusCode::OK).content_type("image/png").body(buf))
}

pub(crate) async fn serve_image(info: web::Path<(String, )>) -> Result<HttpResponse, Error> {
    let client = Client::with_uri_str(MONGO_DB_URL).await.unwrap();
    let db = client.database(DB_NAME);
    let collection: mongodb::Collection<Image> = db.collection(COLLECTION_NAME);
    let bucket = db.gridfs_bucket(GridFsBucketOptions::default());
    let passed_id = (&info.0).parse();

    if passed_id.is_err() {
        return Ok(HttpResponse::from(HttpResponse::InternalServerError()));
    }

    let id_string = passed_id.unwrap();
    let id = Bson::ObjectId(id_string);
    let filter = doc! { "_id": &id };

    if let Ok(Some(value)) = collection.find_one(filter, None).await {
        match download_image(&bucket, &Bson::from(&value.file_id)).await {
            Ok(response) => Ok(response),
            Err(_) => Ok(HttpResponse::from(HttpResponse::InternalServerError())),
        }
    } else {
        return Ok(HttpResponse::build(StatusCode::NOT_FOUND).body(""));
    }.expect("Something went wrong");

    Ok(HttpResponse::build(StatusCode::NOT_FOUND).body(""))
}