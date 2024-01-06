import { minioVolume } from './minio-volume';

export function minio() {
  const minioPort1 = 9000;
  const minioPort2 = 9001;

  const { claimName, name, mountPath } = minioVolume();

  const container = {
    args: ['server', '/data', '--console-address', ':9001'],
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

  const volumes = [
    {
      name,
      persistentVolumeClaim: {
        claimName,
      },
    },
  ];

  return { container, volumes };
}
