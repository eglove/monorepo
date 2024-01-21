import { createGraphqlDeployment } from './create-graphql-deployment';
import { createGraphqlImage } from './create-graphql-image';
import { createGraphqlService } from './create-graphql-service';

export const graphqlServiceName = 'graphql';

export function graphql() {
  const graphqlPort = 8080;

  const image = createGraphqlImage();

  const graphqlService = createGraphqlService(graphqlPort);

  createGraphqlDeployment(image.imageName, graphqlPort);

  return { graphqlPort, graphqlService };
}
