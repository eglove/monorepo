package models

import (
	"context"
	"errors"
	"ethang.dev/image-optimization/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"mime/multipart"
)

type Image struct {
	Id          primitive.ObjectID    `bson:"_id,omitempty" form:"id"`
	Name        string                `form:"name" binding:"required"`
	Description string                `form:"description" binding:"required"`
	File        *multipart.FileHeader `form:"file" binding:"required"`
	Width       int64                 `form:"width"`
	Height      int64                 `form:"height"`
	Quality     int64                 `form:"quality"`
	ImageId     string                `form:"imageId"`
	UserId      string                `form:"userId"`
}

func (image *Image) Save() (*Image, error) {
	result, err := mongo.ImageCollection().InsertOne(context.Background(), image)

	if err != nil {
		return nil, err
	}

	objectId, ok := result.InsertedID.(primitive.ObjectID)

	if !ok {
		return nil, errors.New("error while decoding Mongo _id")
	}

	image.Id = objectId
	return image, nil
}
