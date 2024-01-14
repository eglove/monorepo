package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func Setup() error {
	var err error
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017/")
	Client, err = mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		return err
	}

	err = Client.Ping(context.Background(), nil)

	if err != nil {
		return err
	}

	return nil
}

func ImageOptimization() *mongo.Database {
	return Client.Database("image-optimization")
}

func ImageCollection() *mongo.Collection {
	return ImageOptimization().Collection("images")
}
