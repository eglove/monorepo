import { apiDeployment } from './api-deployment';
import { apiImage } from './api-image';
import { apiService } from './api-service';
import { mongo } from './mongo';

export const imageOptimizationServiceName = 'image-optimization';

export function imageOptimization() {
  const apiPort = 8080;
  const minioPort1 = 9000;
  const minioPort2 = 9001;

  const image = apiImage();

  const clusterService = apiService(apiPort, minioPort1, minioPort2);

  const mongoItems = mongo();

  apiDeployment(
    image.imageName,
    apiPort,
    mongoItems.container,
    mongoItems.volumes,
  );

  return { apiPort, clusterService };
}
