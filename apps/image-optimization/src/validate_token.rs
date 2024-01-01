use std::fmt::Debug;
use actix_web::dev::{ServiceRequest};
use actix_web::{Error};
use actix_web_httpauth::extractors::bearer::{BearerAuth};
use jsonwebtoken::{Algorithm, decode, DecodingKey, Validation};
use awc::{Client};
use jsonwebtoken::jwk::Jwk;
use std::io::{Error as StdError, ErrorKind};

#[derive(Debug, serde::Deserialize, serde::Serialize)]
struct Claims {
    email: String,
    exp: usize,
    iat: usize,
}

pub async fn validate_token(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (Error, ServiceRequest)> {
    let token_value = credentials.token();

    let client = Client::default();
    let response = client.get("http://localhost:31515/well-known/jwks.json")
        .insert_header(("User-Agent", "Actix-web"))
        .send()
        .await;

    if response.is_err() {
        return Err((Error::from(StdError::new(ErrorKind::InvalidData, "Could not validate token")), req));
    }

    let jwk = response.unwrap()
        .json::<Jwk>()
        .await;

    if jwk.is_err() {
        return Err((Error::from(StdError::new(ErrorKind::InvalidData, "Could not validate token")), req));
    }

    let validation = Validation::new(Algorithm::PS256);
    let key = &DecodingKey::from_jwk(&jwk.unwrap());

    if key.is_err() {
        return Err((Error::from(StdError::new(ErrorKind::InvalidData, "Invalid token")), req));
    }

    let token = decode::<Claims>(token_value, &key.as_ref().unwrap(), &validation);

    if token.is_err() {
        return Err((Error::from(StdError::new(ErrorKind::InvalidData, "Invalid token")), req));
    }

    Ok(req)
}
