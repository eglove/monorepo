package dev.ethang.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.JsonNode;
import dev.ethang.spotifydemo.generated.types.ImageUpload;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MappedImageUpload extends ImageUpload {
    @JsonSetter("data")
    public void mapImageUpload(JsonNode data) {
        this.setId(data.get("id").asText());
        this.setName(data.get("name").asText());
        this.setDescription(data.get("description").asText());
        this.setWidth(data.get("width").asInt());
        this.setHeight(data.get("height").asInt());
        this.setQuality(data.get("quality").asInt());
        this.setImageId(data.get("imageId").asText());
        this.setUrl(data.get("url").asText());
    }

    public MappedImageUpload getImageUpload() {
        return this;
    }
}
