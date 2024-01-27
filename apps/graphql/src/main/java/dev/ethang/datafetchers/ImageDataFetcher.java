package dev.ethang.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsMutation;
import com.netflix.graphql.dgs.DgsQuery;
import com.netflix.graphql.dgs.InputArgument;
import dev.ethang.datasources.ImageClient;
import dev.ethang.graphql.generated.types.Image;
import dev.ethang.graphql.generated.types.ImageDetails;
import dev.ethang.models.MappedImage;
import dev.ethang.models.MappedImageCollection;
import dev.ethang.models.MappedImageDelete;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @DgsQuery
    public List<MappedImage> images() {
        MappedImageCollection response = imageClient.images();

        return response.getImages();
    }

    @DgsMutation
    public Image createImage(DataFetchingEnvironment dfe, @InputArgument String name, @InputArgument String description) {
        MultipartFile file = dfe.getArgument("file");

        return this.imageClient.uploadImage(name, description, file);
    }

    @DgsMutation
    public MappedImageDelete deleteImage(@InputArgument String name) {
        return this.imageClient.deleteImage(name);
    }
}
