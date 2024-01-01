import * as k8s from '@pulumi/kubernetes';

const userServicePod = new k8s.core.v1.Pod("user-service-pod", {
    metadata: {
        name: "user-service-pod",
        labels: {
            component: "user-service",
        },
    },
    spec: {
        containers: [{
            name: "user-service",
            image: "eglove/user-service:1.0.0",
            ports: [{
                containerPort: 3000,
            }],
        }],
    },
});

const userServiceService = new k8s.core.v1.Service("user-service-port", {
    metadata: {
        name: "user-service-port"
    },
    spec: {
        type: "NodePort",
        ports: [{
            port: 3050,
            targetPort: userServicePod.spec.containers[0].ports[0].containerPort,
            nodePort: 31515,
        }],
        selector: {
            component: "user-service"
        }
    }
});
