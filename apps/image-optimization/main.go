package main

import (
	"ethang.dev/image-optimization/mongo"
	"ethang.dev/image-optimization/routes"
	"fmt"
	"github.com/gin-gonic/gin"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	server := gin.Default()
	err := mongo.Setup()

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	routes.RegisterRoutes(server)

	fmt.Println("Running on http://localhost:8080")
	err = server.Run(":8080")
	if err != nil {
		fmt.Println(err)
	}
}
