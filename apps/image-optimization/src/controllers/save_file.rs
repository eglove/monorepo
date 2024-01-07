use actix_multipart::Multipart;
use std::io::Error;
use futures_util::{AsyncWriteExt, StreamExt, TryStreamExt};
use image::GenericImageView;
use mongodb::Client;
use mongodb::options::{ClientOptions, GridFsBucketOptions};

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct FormData {
    description: String,
    image: Vec<u8>,
}

#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub(crate) struct Image {
    pub(crate) file_id: String,
    file_name: String,
    description: String,
    width: u32,
    height: u32,
    pub(crate) mime_type: String,
}

pub(crate) async fn save_file(mut payload: Multipart) -> Result<(), Error> {
    let mut form_data: FormData = FormData {
        description: String::from(""),
        image: vec![],
    };

    let mut filename = String::new();

    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();
        let name = content_disposition.get_name().unwrap();
        match name {
            "description" => {
                while let Some(chunk) = field.next().await {
                    let data = chunk.unwrap();
                    form_data.description = String::from_utf8(data.to_vec()).unwrap();
                }
            }
            "image" => {
                filename = content_disposition.get_filename().unwrap().to_string();
                while let Some(chunk) = field.next().await {
                    let data = chunk.unwrap();
                    form_data.image.extend(data.to_vec());
                }
            }
            _ => {}
        }
    }

    let mongo_db_url = "mongodb://localhost:27017";
    let client_options = ClientOptions::parse(mongo_db_url).await;
    let img = image::load_from_memory(&form_data.image);
    let format = image::guess_format(&form_data.image).unwrap().to_mime_type();

    if let Ok(i) = img {
        let (width, height) = i.dimensions();

        if !client_options.is_err() {
            let client = Client::with_options(client_options.unwrap());

            match client {
                Ok(client) => {
                    let db = client.database("images");
                    let collection = db.collection("images");
                    let bucket_options = GridFsBucketOptions::default();
                    let bucket = db.gridfs_bucket(bucket_options);

                    let mut upload_stream = bucket.open_upload_stream(&filename, None);
                    upload_stream.write_all(&form_data.image).await?;

                    let image_doc = Image {
                        file_name: filename.to_string(),
                        file_id: upload_stream.id().to_string(),
                        description: form_data.description.to_string(),
                        width,
                        height,
                        mime_type: format.to_string()
                    };

                    collection.insert_one(image_doc, None).await.err();

                    upload_stream.close().await?;
                }
                Err(err) => {
                    println!("Error creating MongoDB client: {}", err);
                }
            }
        }
    }

    return Ok(());
}
