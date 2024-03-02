#!/bin/bash

set -e

if [ -z "$JUNO_TOKEN" ]; then
  echo "A JUNO_TOKEN is required to run commands with the Juno cli"
  exit 126
fi

if [ -n "$PROJECT_PATH" ]; then
  cd "$PROJECT_PATH"
fi

sh -c "juno $*"
