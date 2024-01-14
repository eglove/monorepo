package routes

import (
	"ethang.dev/image-optimization/models"
	"ethang.dev/image-optimization/utils"
	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

func createImage(context *gin.Context) {
	var imageModel models.Image
	var imageRequestModel models.CreateImageRequest
	errorMap := utils.NewErrorMap()

	// Validate body
	err := context.ShouldBind(&imageRequestModel)
	if err != nil {
		response := utils.BindErrorFormat(err)
		context.JSON(http.StatusBadRequest, utils.NewResponseData(response, nil))
		return
	}
	imageModel.Name = imageRequestModel.Name
	imageModel.Description = imageRequestModel.Description
	imageModel.File = imageRequestModel.File

	// Read file
	file, _, err := context.Request.FormFile("file")
	if err != nil {
		errorMap["Image.File"] = "failed to read image"
		context.JSON(http.StatusInternalServerError, utils.NewResponseData(errorMap, nil))
		return
	}
	defer file.Close()

	// Parse file
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		errorMap["Image.File"] = "failed to parse image"
		context.JSON(
			http.StatusInternalServerError,
			utils.NewResponseData(errorMap, nil),
		)
		return
	}

	// Reset file read to start
	_, err = file.Seek(0, 0)
	if err != nil {
		errorMap["Image.File"] = "failed to reset image"
		context.JSON(
			http.StatusInternalServerError,
			utils.NewResponseData(errorMap, nil),
		)
		return
	}

	// Get file type
	filetype := http.DetectContentType(buffer)
	if !strings.HasPrefix(filetype, "image/") {
		errorMap["Image.File"] = "invalid format"
		context.JSON(http.StatusInternalServerError, utils.NewResponseData(errorMap, nil))
		return
	}

	// Get image dimensions
	img, err := imaging.Decode(file)
	if err != nil {
		errorMap["Image.File"] = "failed to decode image"
		context.JSON(http.StatusInternalServerError, utils.NewResponseData(errorMap, nil))
		return
	}
	imageModel.Width = int64(img.Bounds().Dx())
	imageModel.Height = int64(img.Bounds().Dy())
	imageModel.Quality = 100

	// Save image
	savedImage, err := imageModel.Save()
	if err != nil {
		errorMap["Image.File"] = "failed to save image"
		context.JSON(http.StatusInternalServerError, utils.NewResponseData(errorMap, nil))
		return
	}

	context.JSON(http.StatusOK, utils.NewResponseData(nil, savedImage))
}
