package mongo

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/gridfs"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
)

var Client *mongo.Client

func Setup() error {
	var err error
	connStr := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(connStr)
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

func ImageGridFs() (*gridfs.Bucket, error) {
	return gridfs.NewBucket(ImageOptimization())
}
