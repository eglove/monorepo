package dev.ethang.datasources;

import dev.ethang.models.MappedImageDetails;
import dev.ethang.models.MappedImage;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Component
public class ImageClient {
    private static final String IMAGE_API_URL = "http://image-optimization-cluster-ip.default:8080";

    private final RestClient client = RestClient.builder().baseUrl(IMAGE_API_URL).build();

    public MappedImageDetails imageDetailsRequest(String filename) {
        return client
                .get()
                .uri("/{fileName}/info", filename)
                .retrieve()
                .body(MappedImageDetails.class);
    }

    public MappedImage[] images() {
        return client.get().uri("/").retrieve().body(MappedImage[].class);
    }

    public MappedImage uploadImage(String name, String description, MultipartFile file) {
        MultiValueMap<String, Object> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("name", name);
        requestBody.add("description", description);
        requestBody.add("file", file.getResource());

        return client
                .post()
                .uri("/")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(requestBody)
                .retrieve()
                .body(MappedImage.class);
    }

    public MappedImage deleteImage(String name) {
        return client
                .delete()
                .uri("/{filename}", name)
                .retrieve()
                .body(MappedImage.class);
    }
}
