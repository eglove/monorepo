package utils

import (
	"errors"
	"github.com/go-playground/validator/v10"
	"strings"
)

func BindErrorFormat(err error) map[string]string {
	var errs validator.ValidationErrors
	errors.As(err, &errs)
	resp := make(map[string]string)

	for _, v := range errs {
		message := v.Error()
		resp[v.Namespace()] = message[strings.Index(message, "Error:")+6:]
	}

	return resp
}
