## Commands

Here are a few useful Docker commands that can be used for local development. 

### Build

```bash
docker build . --file Dockerfile.slim -t juno-action --progress=plain --no-cache
docker build . --file Dockerfile.full -t juno-action --progress=plain --no-cache --platform=linux/amd64
```

### Inspect Size

```bash
docker images juno-action
docker image inspect 45c21d84fe24 --format='{{.Size}}' | awk '{printf "%.2f MB\n", $1/1024/1024}'
```

### Pin Base Image

```bash
docker pull node:24-slim
docker inspect --format='{{index .RepoDigests 0}}' node:24-slim
```

## Run Locally

`juno --version`:

```bash
docker run --rm -e JUNO_TOKEN=eyJ0b2tlbiI6WyIzMDJhMzAwNTA2MDMyYjY1NzAwMzIxMDA0Y2E0NzhjNmEzMmVkZTgzMmU5OWY3ODBiNjM3ZWE4NDk4MzdhYTY1YTI5YTRlOWNmYmRkYjU1Njc1NGFlNjkwIiwiZjYwMGJhNzRiN2JmYjJiODIzY2VkMWYzYjkzMTY0YzE1NDM2MDBjOTZlZmZmODFhMmU0YmUxZTYxNTU5NGRkYyJdfQ== juno-action --version
```

`juno dev build`:

```bash
docker run --rm \
 -e JUNO_TOKEN=eyJ0b2tlbiI6WyIzMDJhMzAwNTA2MDMyYjY1NzAwMzIxMDA0Y2E0NzhjNmEzMmVkZTgzMmU5OWY3ODBiNjM3ZWE4NDk4MzdhYTY1YTI5YTRlOWNmYmRkYjU1Njc1NGFlNjkwIiwiZjYwMGJhNzRiN2JmYjJiODIzY2VkMWYzYjkzMTY0YzE1NDM2MDBjOTZlZmZmODFhMmU0YmUxZTYxNTU5NGRkYyJdfQ==  \
 -v "$(pwd)":/project \
 -w /project \
 juno-action dev build
```

### References

This project is inspired by [w9jds/firebase-action](https://github.com/w9jds/firebase-action)
