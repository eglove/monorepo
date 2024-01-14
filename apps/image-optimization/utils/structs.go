package utils

type ResponseData struct {
	Errors interface{} `json:"errors"`
	Data   interface{} `json:"data"`
}

func NewErrorMap() map[string]string {
	return make(map[string]string)
}

func NewResponseData(err map[string]string, data interface{}) *ResponseData {
	if len(err) == 0 {
		return &ResponseData{
			Errors: nil,
			Data:   data,
		}
	}

	return &ResponseData{
		Errors: err,
		Data:   data,
	}
}
