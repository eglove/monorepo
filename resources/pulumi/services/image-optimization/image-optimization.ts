import { apiDeployment } from './api-deployment';
import { apiImage } from './api-image';
import { apiService } from './api-service';
import { minio } from './minio';

export const imageOptimizationServiceName = 'image-optimization';

export function imageOptimization() {
  const apiPort = 8080;
  const minioPort1 = 9000;
  const minioPort2 = 9001;

  const image = apiImage();

  apiService(apiPort, minioPort1, minioPort2);

  const minioItems = minio();

  apiDeployment(
    image.imageName,
    apiPort,
    minioItems.container,
    minioItems.volumes,
  );
}
