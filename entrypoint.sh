#!/bin/bash

set -e

if [ -n "$PROJECT_PATH" ]; then
  cd "$PROJECT_PATH"
fi

if [ -z "$JUNO_TOKEN" ]; then
  JUNO_TOKEN=$(cd /token && npm run start 2>&1)
  echo "::add-mask::$JUNO_TOKEN"
  export JUNO_TOKEN
fi

# TODO: trap cleanup
# TODO: docker integration

exec juno "$@" --headless
