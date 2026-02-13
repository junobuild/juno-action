#!/bin/bash

set -e

if [ -n "$PROJECT_PATH" ]; then
  cd "$PROJECT_PATH"
fi

cleanup() {
  (cd ./kit/token && npm run clean 2>&1) || true
}

trap cleanup EXIT

if [ -z "$JUNO_TOKEN" ]; then
  JUNO_TOKEN=$(cd ./kit/token && npm run start 2>&1)
  echo "::add-mask::$JUNO_TOKEN"
  export JUNO_TOKEN
fi

juno "$@" --headless

