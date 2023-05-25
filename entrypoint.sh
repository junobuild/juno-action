#!/bin/bash

set -e

if [ -z "$JUNO_TOKEN" ]; then
  echo "A JUNO_TOKEN is required to run commands with the Juno cli"
  exit 126
fi

# https://github.com/sindresorhus/env-paths#pathsconfig
JUNO_LINUX_CONFIG_PATH="$HOME/.config/juno-nodejs"
JUNO_LINUX_CONFIG_FILE="$JUNO_LINUX_CONFIG_PATH/config.json"

if [ ! -d "$JUNO_LINUX_CONFIG_PATH" ]; then
  mkdir -p "$JUNO_LINUX_CONFIG_PATH"
fi

echo "Storing JUNO_TOKEN in $JUNO_LINUX_CONFIG_FILE"
echo "{\"token\": $JUNO_TOKEN}" > "$JUNO_LINUX_CONFIG_FILE"

sh -c "juno $*"
