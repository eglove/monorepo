package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func RegisterRoutes(server *gin.Engine) {
	imageGroup := server.Group("/")
	server.GET("/healthcheck", func(context *gin.Context) {
		context.JSON(http.StatusOK, "OK")
	})
	imageGroup.GET("/:filename", imageByFilename)
	imageGroup.GET("/:filename/info", imageInfoByFilename)
	imageGroup.GET("/", images)
	imageGroup.POST("/", createImage)
}
