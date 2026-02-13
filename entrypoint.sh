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
    (node /kit/token/src/cleanup.ts) || true
  fi
}

echo "1"

trap cleanup EXIT

echo "2"

if [ -z "$JUNO_TOKEN" ]; then
  echo "3"

  JUNO_TOKEN=$(node /kit/token/src/authenticate.ts)
  EXIT_CODE=$?

  case $EXIT_CODE in
    0)
      echo "::add-mask::$JUNO_TOKEN"
      export JUNO_TOKEN
      CLEANUP_TOKEN="true"
      ;;
    1)
      # An error happened
      exit 1
      ;;
    *)
      # Skip
      ;;
  esac

  echo "4"

fi

echo "5"

juno "$@" --headless

