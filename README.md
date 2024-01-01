## It's a monorepo that's not a monorepo.

After using NX, TurboRepo, and just plain workspaces, I find monorepos add unnecessary complexity that can be more
easily managed by custom CLIs.

### Pulumi

[Pulumi](https://www.pulumi.com/) is currently used to build and publish docker images and deploy to a local Kubernetes cluster.

### Current Services

| Repo Link                         | Container                                                                   |
|-----------------------------------|-----------------------------------------------------------------------------|
| [User Service](apps/user-service) | [Container](https://github.com/eglove/monorepo/pkgs/container/user-service) |

