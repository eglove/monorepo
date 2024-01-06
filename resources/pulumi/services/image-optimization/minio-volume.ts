import * as k8s from '@pulumi/kubernetes';

export function minioVolume(mountPath: string) {
  new k8s.core.v1.PersistentVolume('minio-persistent-volume', {
    metadata: {
      name: 'minio-data-pv',
    },
    spec: {
      accessModes: ['ReadWriteOnce'],
      capacity: {
        storage: '1Gi',
      },
      hostPath: {
        path: `/mnt${mountPath}`,
      },
      persistentVolumeReclaimPolicy: 'Retain',
      storageClassName: 'storage-class',
    },
  });

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
        storageClassName: 'storage-class',
      },
    },
  );

  return {
    claimName: persistentVolumeClaim.metadata.name,
    name: 'minio-volume',
  };
}