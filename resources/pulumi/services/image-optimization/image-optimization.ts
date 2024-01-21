import { apiDeployment } from './api-deployment';
import { apiImage } from './api-image';
import { apiService } from './api-service';
import { mongo } from './mongo';

export const imageOptimizationServiceName = 'image-optimization';

export function imageOptimization() {
  const apiPort = 8080;
  const mongoPort = 27_017;

  const image = apiImage();

  const clusterService = apiService(apiPort, mongoPort);

  const mongoItems = mongo(mongoPort);

  apiDeployment(
    image.imageName,
    apiPort,
    mongoItems.container,
    mongoItems.volumes,
  );

  return { apiPort, clusterService };
}
