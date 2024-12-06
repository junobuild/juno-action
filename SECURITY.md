  - uses: actions/setup-node@v4
    with:
      node-version: "20"

  - name: Install Dependencies
    run: npm ci

  - name: Build
    run: npm run build

  - name: Deploy to Juno
    uses: junobuild/juno-action@main
    with:
      args: deploy
    env:
      JUNO_TOKEN: ${{ secrets.JUNO_TOKEN }}name: Deploy to Juno

on:
  release:
    types: [released]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Juno
        uses: junobuild/juno-action@main
        with:
          args: deploy
        env:
          JUNO_TOKEN: ${{ secrets.JUNO_TOKEN }}# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 5.1.x   | :white_check_mark: |
| 5.0.x   | :x:                |
| 4.0.x   | :white_check_mark: |
| < 4.0   | :x:                |

## Reporting a Vulnerability

Use this section to tell people how to report a vulnerability.

Tell them where to go, how often they can expect to get an update on a
reported vulnerability, what to expect if the vulnerability is accepted or
declined, etc.
