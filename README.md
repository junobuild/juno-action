# Juno Action

This GitHub Action for [Juno] enables arbitrary actions with the [command-line client]((https://github.com/junobuild/cli)).

## Environment variables

- `JUNO_TOKEN`: The token to use for authentication. It can be generated through Juno's [console](https://console.juno.build). Prefer a controller with "Read-write" permission rather than administrator.

## Example

To deploy a release of your dapp to Juno with a GitHub Action:

```yaml
name: Deploy to Juno

on:
  release:
    types: [released]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Juno
        uses: buildwithjuno/juno-action@main
        with:
          args: deploy
        env:
          JUNO_TOKEN: ${{ secrets.JUNO_TOKEN }}
```

## License

MIT © [David Dal Busco](mailto:david.dalbusco@outlook.com)

## Credits

This project is a fork of [w9jds/firebase-action ](https://github.com/w9jds/firebase-action)

[juno]: https://juno.build
