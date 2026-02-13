#!/bin/bash

set -e

echo "**********"
ls -la /kit/token
pwd
echo "**********"

if [ -n "$PROJECT_PATH" ]; then
  cd "$PROJECT_PATH"
fi

CLEANUP_TOKEN=""

cleanup() {
  if [ -n "$CLEANUP_TOKEN" ]; then
    (npm run clean --prefix /kit/token) || true
  fi
}

echo "1"

trap cleanup EXIT

echo "2"

if [ -z "$JUNO_TOKEN" ]; then
  echo "3"

  JUNO_TOKEN=$(npm run auth --prefix /kit/token)

  echo "4"

  echo "::add-mask::$JUNO_TOKEN"
  export JUNO_TOKEN

  CLEANUP_TOKEN="true"
fi

echo "5"

juno "$@" --headless

