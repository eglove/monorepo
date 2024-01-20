package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func RegisterRoutes(server *gin.Engine) {
	server.GET("/healthcheck", func(context *gin.Context) {
		context.JSON(http.StatusOK, "OK")
	})

	imageGroup := server.Group("/image")
	imageGroup.GET("/:filename", imageByFilename)
	imageGroup.GET("/:filename/info", imageInfoByFilename)
	imageGroup.POST("/", createImage)
}
