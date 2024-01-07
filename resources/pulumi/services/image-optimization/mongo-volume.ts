import * as k8s from '@pulumi/kubernetes';

export function mongoVolume() {
  const persistentVolumeClaim = new k8s.core.v1.PersistentVolumeClaim(
    'mongodb-claim',
    {
      metadata: {
        name: 'mongo-data-pvc',
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
    name: 'mongo-volume',
  };
}
