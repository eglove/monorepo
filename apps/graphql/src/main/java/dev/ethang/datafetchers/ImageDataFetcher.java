package dev.ethang.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import dev.ethang.datasources.ImageClient;
import dev.ethang.spotifydemo.generated.types.ImageDetails;
import dev.ethang.spotifydemo.generated.types.ImageUpload;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

@DgsComponent
public class ImageDataFetcher {
    private final ImageClient imageClient;

    @Autowired
    public ImageDataFetcher(ImageClient imageClient) {
        this.imageClient = imageClient;
    }

    @DgsQuery
    public ImageDetails imageDetails(@InputArgument String filename) {
        return this.imageClient.imageDetailsRequest(filename);
    }

    @DgsMutation
    public ImageUpload createImage(DataFetchingEnvironment dfe, @InputArgument String name, @InputArgument String description) {
        MultipartFile file = dfe.getArgument("file");

        return this.imageClient.uploadImage(name, description, file);
    }
}
