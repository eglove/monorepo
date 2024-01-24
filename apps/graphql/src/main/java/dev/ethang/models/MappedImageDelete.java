package dev.ethang.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.databind.JsonNode;
import dev.ethang.graphql.generated.types.ImageDelete;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MappedImageDelete extends ImageDelete {
    @JsonSetter("data")
    public void mapImageDelete(JsonNode data) {
        this.setDeletedCount(Integer.parseInt(data.get("DeletedCount").asText()));
    }
}
