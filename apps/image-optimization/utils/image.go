package utils

import (
	"bytes"
	"fmt"
	"github.com/disintegration/imaging"
	"net/http"
	"strconv"
)

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
