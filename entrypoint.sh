#!/bin/bash

set -e

if [ -n "$PROJECT_PATH" ]; then
  cd "$PROJECT_PATH"
fi

CLEANUP_TOKEN=""

cleanup() {
  if [ -n "$CLEANUP_TOKEN" ]; then
    (cd ./kit/token && npm run clean 2>&1) || true
  fi
}

trap cleanup EXIT

if [ -z "$JUNO_TOKEN" ]; then
  JUNO_TOKEN=$(cd ./kit/token && npm run auth 2>&1)
  echo "::add-mask::$JUNO_TOKEN"
  export JUNO_TOKEN

  CLEANUP_TOKEN="true"
fi

juno "$@" --headless

