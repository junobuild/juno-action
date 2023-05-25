#!/bin/bash

set -e

if [ -z "$JUNO_TOKEN" ]; then
  echo "A JUNO_TOKEN is required to run commands with the Juno cli"
  exit 126
fi

# https://github.com/sindresorhus/env-paths#pathsconfig
JUNO_LINUX_CONFIG_PATH="$HOME/.config/juno-nodejs/config.json"

echo "Storing JUNO_TOKEN in $JUNO_LINUX_CONFIG_PATH"
echo "{\"token\": $JUNO_TOKEN}" > "$JUNO_LINUX_CONFIG_PATH"

sh -c "juno $*"
