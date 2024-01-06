import { userServiceDeployment } from './user-service-deployment';
import { userServiceImage } from './user-service-image';
import { userServiceService } from './user-service-service';

export const userServiceName = 'user-service';

export function userService() {
  const port = 3000;

  const image = userServiceImage();

  const clusterService = userServiceService(port);

  userServiceDeployment(image.imageName, port);

  return { clusterService, port };
}
