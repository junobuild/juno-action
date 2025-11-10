# Juno Action

This GitHub Action for [Juno] enables arbitrary actions with the [command-line client]((https://github.com/junobuild/cli)).

## Environment variables

- `JUNO_TOKEN`: The token to use for authentication. It can be generated through Juno's [console](https://console.juno.build). Prefer a controller with "Read-write" permission rather than administrator.

- `PROJECT_PATH` - **Optional**. The path to the folder containing `juno.config.ts|js|json` if it doesn't exist at the root of your repository. e.g. `./my-app`.

## Example

To deploy a release of your dapp to Juno with a GitHub Action:

```yaml
name: Deploy to Juno

on:
  workflow_dispatch:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          registry-url: "https://registry.npmjs.org"

      - name: Install Dependencies
        run: npm ci

      - name: Deploy to Juno
        uses: junobuild/juno-action
        with:
          args: deploy
        env:
          JUNO_TOKEN: ${{ secrets.JUNO_TOKEN }}
```

## Available Action Versions

You can choose from several action variants depending on your needs:

| Version tag          | Description                                                         |
|----------------------|---------------------------------------------------------------------|
| `@main` or no tag    | Defaults to the **slim** image                                      |
| `@slim`              | Explicitly use the **slim** image                                   |
| `@full`              | Use the **full** image                                              |
| `@vX.Y.Z`            | Specific version tag for **slim**                                   |
| `@vX.Y.Z-slim`       | Versioned **slim** image                                            |
| `@vX.Y.Z-full`       | Versioned **full** image                                            |

The **slim** image does not include the Rust toolchain or tools required to build serverless functions. It is smaller in size and suitable for most CLI use cases.

The **full** image includes the Rust toolchain and all necessary tools for building serverless functions, resulting in a larger image size.

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

[juno]: https://juno.build
