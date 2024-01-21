package routes

import (
	"ethang.dev/image-optimization/models"
	"ethang.dev/image-optimization/utils"
	"fmt"
	"github.com/disintegration/imaging"
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"net/http"
	"strings"
)

type ImageInfo struct {
	Src         string `json:"src"`
	Alt         string `json:"alt"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
	AspectRatio string `json:"aspectRatio"`
	SrcSet      string `json:"srcSet"`
	Sizes       string `json:"sizes"`
}

func imageInfoByFilename(context *gin.Context) {
	filename := context.Param("filename")
	var info ImageInfo

	var imageModel models.Image
	errorMap := utils.NewErrorMap()

	imageObject, err := imageModel.Get(filename)
	if err != nil {
		errorMap["Image.Name"] = "failed to find image"
		context.JSON(http.StatusNotFound, utils.NewResponseData(errorMap, nil))
		return
	}

	image, err := imageObject.GetFile(filename)
	if err != nil {
		errorMap["Image.Name"] = "failed to find image"
		context.JSON(http.StatusNotFound, utils.NewResponseData(errorMap, nil))
		return
	}

	ratio, err := utils.AspectRatio(image.Bytes())
	if err != nil {
		errorMap["Image.AspectRatio"] = "failed to get aspect ratio"
		context.JSON(http.StatusNotFound, utils.NewResponseData(errorMap, nil))
		return
	}

	info.Src = imageObject.Url
	info.Alt = imageObject.Description
	info.SrcSet = utils.SrcSet(imageObject.Url)
	info.Sizes = utils.Sizes()
	info.AspectRatio = ratio
	info.Width = int(imageObject.Width)
	info.Height = int(imageObject.Height)
	context.JSON(http.StatusOK, utils.NewResponseData(nil, info))
}

func imageByFilename(context *gin.Context) {
	filename := context.Param("filename")
	widthStr := context.Query("w")
	heightStr := context.Query("h")

	var imageModel models.Image
	errorMap := utils.NewErrorMap()

	image, err := imageModel.GetFile(filename)
	if err != nil {
		errorMap["Image.Name"] = "failed to find image"
		context.JSON(http.StatusNotFound, utils.NewResponseData(errorMap, nil))
		return
	}

	resized, err := utils.ResizeImage(image.Bytes(), widthStr, heightStr)

	if err != nil {
		errorMap["Image"] = "failed to resize image"
		context.JSON(http.StatusNotFound, utils.NewResponseData(errorMap, nil))
		return
	}

	contentType := http.DetectContentType(resized)
	context.Header("Content-Type", contentType)
	context.Data(http.StatusOK, contentType, resized)
}

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
	imageModel.Name = strings.ReplaceAll(imageRequestModel.Name, " ", "-")
	imageModel.Description = imageRequestModel.Description
	imageModel.File = imageRequestModel.File

	_, err = imageModel.Get(imageModel.Name)
	if err == nil {
		errorMap["Image"] = "image with that name already exists"
		context.JSON(http.StatusConflict, utils.NewResponseData(errorMap, nil))
		return
	}

	// Read file
	file, _, err := context.Request.FormFile("file")
	if err != nil {
		errorMap["Image.File"] = "failed to read image"
		context.JSON(http.StatusInternalServerError, utils.NewResponseData(errorMap, nil))
		return
	}
	defer func(file multipart.File) {
		err := file.Close()
		if err != nil {
			fmt.Println(err)
		}
	}(file)

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
	imageModel.Url = context.Request.Host + context.Request.URL.String() + imageModel.Name

	// Save image
	savedImage, err := imageModel.Save()
	if err != nil {
		errorMap["Image.File"] = "failed to save image"
		context.JSON(http.StatusInternalServerError, utils.NewResponseData(errorMap, nil))
		return
	}

	context.JSON(http.StatusOK, utils.NewResponseData(nil, savedImage))
}
