package dev.ethang.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MappedImageCollection {
    List<MappedImage> images;

    @JsonSetter("data")
    public void mapImages(JsonNode data) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        this.images = mapper.readValue(data.traverse(), new TypeReference<List<MappedImage>>(){});
    }

    public List<MappedImage> getImages() {
        return this.images;
    }
}
