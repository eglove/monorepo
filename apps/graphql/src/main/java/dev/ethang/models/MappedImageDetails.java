package dev.ethang.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.JsonNode;
import dev.ethang.graphql.generated.types.ImageDetails;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MappedImageDetails extends ImageDetails {
    @JsonSetter("data")
    public void mapDetails(JsonNode data) {
        this.setSrc(data.get("src").asText());
        this.setAlt(data.get("alt").asText());
        this.setWidth(data.get("width").asInt());
        this.setHeight(data.get("height").asInt());
        this.setAspectRatio(data.get("aspectRatio").asText());
        this.setSrcSet(data.get("srcSet").asText());
        this.setSizes(data.get("sizes").asText());
    }

    public ImageDetails getImageDetails() {
        return this;
    }
}
