package models

import (
	"bytes"
	"context"
	"ethang.dev/image-optimization/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"mime/multipart"
)

type CreateImageRequest struct {
	Name        string                `form:"name" binding:"required" json:"name"`
	Description string                `form:"description" binding:"required" json:"description"`
	File        *multipart.FileHeader `form:"file" binding:"required" json:"file"`
}

type Image struct {
	Id          primitive.ObjectID    `bson:"_id,omitempty" form:"id" json:"id"`
	Name        string                `form:"name" binding:"required" json:"name"`
	Description string                `form:"description" binding:"required" json:"description"`
	File        *multipart.FileHeader `form:"file" binding:"required" json:"file"`
	Width       int64                 `form:"width" json:"width"`
	Height      int64                 `form:"height" json:"height"`
	Quality     int64                 `form:"quality" json:"quality"`
	ImageId     string                `form:"imageId" json:"imageId"`
	UserId      string                `form:"userId" json:"userId"`
	Url         string                `json:"url"`
}

func (image *Image) Save() (*Image, error) {
	bucket, err := mongo.ImageGridFs()

	if err != nil {
		return nil, err
	}

	data, err := image.File.Open()

	if err != nil {
		return nil, err
	}
	defer data.Close()

	imageId, err := bucket.UploadFromStream(image.Name, data)
	if err != nil {
		return nil, err
	}

	image.ImageId = imageId.Hex()
	result, err := mongo.ImageCollection().InsertOne(context.Background(), image)

	if err != nil {
		return nil, err
	}

	image.Id = result.InsertedID.(primitive.ObjectID)

	return image, nil
}

func (image *Image) Get(filename string) (*bytes.Buffer, error) {
	encoded := mongo.ImageCollection().FindOne(context.Background(), bson.D{{"name", filename}})

	var img Image
	err := encoded.Decode(&img)

	if err != nil {
		return nil, err
	}

	imageId, err := primitive.ObjectIDFromHex(img.ImageId)

	if err != nil {
		return nil, err
	}

	bucket, err := mongo.ImageGridFs()

	if err != nil {
		return nil, err
	}

	fileBuffer := bytes.NewBuffer(nil)
	if _, err := bucket.DownloadToStream(imageId, fileBuffer); err != nil {
		return nil, err
	}

	return fileBuffer, nil
}
