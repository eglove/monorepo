import type * as k8s from '@pulumi/kubernetes';

import { mongoVolume } from './mongo-volume';

export function mongo() {
  const mongoPort = 27_017;
  const mountPath = '/data/db';

  const { claimName, name } = mongoVolume();

  const container: k8s.types.input.core.v1.Container = {
    image: 'mongo',
    name: 'mongodb',
    ports: [{ containerPort: mongoPort }],
    volumeMounts: [
      {
        mountPath,
        name,
      },
    ],
  };

  const volumes: k8s.types.input.core.v1.Volume[] = [
    {
      name,
      persistentVolumeClaim: {
        claimName,
      },
    },
  ];

  return { container, volumes };
}
