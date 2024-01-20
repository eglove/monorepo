package utils

import (
	"bytes"
	"fmt"
	"github.com/disintegration/imaging"
	"net/http"
	"strconv"
)

func greatestCommonDivisor(x int, y int) int {
	for y != 0 {
		x, y = y, x%y
	}

	return x
}

func WidthHeight(file []byte) (int, int, error) {
	imagingFile, err := imaging.Decode(bytes.NewReader(file))

	if err != nil {
		return 0, 0, err
	}

	bounds := imagingFile.Bounds()
	width, height := bounds.Max.X, bounds.Max.Y

	return width, height, nil
}

func AspectRatio(file []byte) (string, error) {
	width, height, err := WidthHeight(file)

	if err != nil {
		return "", err
	}

	divisor := greatestCommonDivisor(width, height)

	return fmt.Sprintf("%d / %d", width/divisor, height/divisor), nil
}

func ResizeImage(file []byte, widthStr string, heightStr string) ([]byte, error) {
	imagingFile, err := imaging.Decode(bytes.NewReader(file))

	if err != nil {
		return nil, err
	}

	width := 0
	height := 0

	if widthStr != "" {
		width, err = strconv.Atoi(widthStr)
		if err != nil {
			return nil, err
		}
	}

	if heightStr != "" {
		width, err = strconv.Atoi(heightStr)
		if err != nil {
			return nil, err
		}
	}

	resized := imaging.Resize(imagingFile, width, height, imaging.Lanczos)

	buffer := new(bytes.Buffer)
	contentType := http.DetectContentType(file)
	switch contentType {
	case "image/jpeg":
		err = imaging.Encode(buffer, resized, imaging.JPEG)
	case "image/png":
		err = imaging.Encode(buffer, resized, imaging.PNG)
	case "image/gif":
		err = imaging.Encode(buffer, resized, imaging.GIF)
	case "image/tiff":
		err = imaging.Encode(buffer, resized, imaging.TIFF)
	case "image/bmp":
		err = imaging.Encode(buffer, resized, imaging.BMP)
	default:
		err = fmt.Errorf("unsupported content type: %s", contentType)
	}

	if err != nil {
		return nil, err
	}

	return buffer.Bytes(), nil
}

func SrcSet(imageUrl string) string {
	viewPorts := []int{500, 1000, 1500, 2000, 2500, 3000, 3500, 4000}

	var srcSet string
	for _, viewport := range viewPorts {
		srcSet += fmt.Sprintf("%s?w=%d %dw,", imageUrl, viewport, viewport)
	}

	srcSet = srcSet[:len(srcSet)-1]

	return srcSet
}

func Sizes() string {
	viewPorts := []int{500, 1000, 1500, 2000, 2500, 3000, 3500, 4000}

	var sizes string
	for _, viewport := range viewPorts {
		sizes += fmt.Sprintf("(max-width: %dpx) %dpx,", viewport, viewport)
	}

	sizes = sizes[:len(sizes)-1]

	return sizes
}
