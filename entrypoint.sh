#!/bin/bash

set -e

if [ -n "$PROJECT_PATH" ]; then
  cd "$PROJECT_PATH"
fi

CLEANUP_TOKEN=""

cleanup() {
  if [ -n "$CLEANUP_TOKEN" ]; then
    (node /kit/token/src/cleanup.ts) || true
  fi
}

trap cleanup EXIT

if [ -z "$JUNO_TOKEN" ]; then
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
    42)
      # Skip
      ;;
    *)
      # Unexpected error
      exit 1
      ;;
  esac
fi

juno "$@" --headless

