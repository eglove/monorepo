import type * as k8s from '@pulumi/kubernetes';

import { minioVolume } from './minio-volume';

export function minio() {
  const minioPort1 = 9000;
  const minioPort2 = 9001;
  const mountPath = '/data';

  const { claimName, name } = minioVolume();

  const container: k8s.types.input.core.v1.Container = {
    args: ['server', mountPath, '--console-address', `:${minioPort2}`],
    env: [
      { name: 'MINIO_ROOT_USER', value: 'admin' },
      { name: 'MINIO_ROOT_PASSWORD', value: 'password' },
    ],
    image: 'quay.io/minio/minio',
    name: 'minio',
    ports: [{ containerPort: minioPort1 }, { containerPort: minioPort2 }],
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
