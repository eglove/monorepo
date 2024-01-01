import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";

export const userServiceName = 'user-service';

export function userService() {
    const userServiceImage = new docker.Image(`${userServiceName}-image`, {
        build: {
            platform: 'linux/amd64',
            context: '../../apps/user-service',
            dockerfile: "../../apps/user-service/Dockerfile"
        },
        imageName: 'docker.io/eglove/user-service:1.0.0',
    });

    return new k8s.core.v1.Pod(`${userServiceName}-pod`, {
        metadata: {
            name: `${userServiceName}-pod`,
            labels: {
                component: userServiceName,
            },
        },
        spec: {
            containers: [{
                name: userServiceName,
                image: userServiceImage.imageName,
                ports: [{
                    containerPort: 3000,
                }],
            }],
        },
    });
}


