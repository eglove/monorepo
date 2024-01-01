import * as k8s from '@pulumi/kubernetes';
import * as docker from "@pulumi/docker";
import {userService, userServiceName} from "./user-service";

const userServicePod = userService();

const userServiceService = new k8s.core.v1.Service(`${userServiceName}-port`, {
    metadata: {
        name: `${userServiceName}-port`
    },
    spec: {
        type: "NodePort",
        ports: [{
            port: 3050,
            targetPort: userServicePod.spec.containers[0].ports[0].containerPort,
            nodePort: 31515,
        }],
        selector: {
            component: userServiceName
        }
    }
});
