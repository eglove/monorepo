import * as k8s from '@pulumi/kubernetes';

export function minioVolume() {
  const persistentVolumeClaim = new k8s.core.v1.PersistentVolumeClaim(
    'minio-volume-claim',
    {
      metadata: {
        name: 'minio-data-pvc',
      },
      spec: {
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: '1Gi',
          },
        },
      },
    },
  );

  return {
    claimName: persistentVolumeClaim.metadata.name,
    name: 'minio-volume',
  };
}
