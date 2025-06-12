## Commands

Here are a few useful Docker commands that can be used for local development. 

### Build

```bash
docker build . --file Dockerfile -t juno-action --progress=plain --no-cache
```

### Inspect size

```bash
docker images juno-action
docker image inspect 45c21d84fe24 --format='{{.Size}}' | awk '{printf "%.2f MB\n", $1/1024/1024}'
```

### Pin Base Image

```bash
docker pull node:22-slim
docker inspect --format='{{index .RepoDigests 0}}' node:22-slim
```