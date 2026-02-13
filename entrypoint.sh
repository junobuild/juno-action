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

  OUTPUT=$(npm run auth --prefix /kit/token)

  RESULT=$(echo "$OUTPUT" | tail -n 1)
  STATUS=$(echo "$RESULT" | jq -r '.status')

  case "$STATUS" in
    success)
      JUNO_TOKEN=$(echo "$RESULT" | jq -r '.token')
      echo "::add-mask::$JUNO_TOKEN"
      export JUNO_TOKEN
      CLEANUP_TOKEN="true"
      ;;
    error)
      exit 1
      ;;
    *)
      # skip - continue without token
      ;;
  esac

  echo "4"
fi

echo "5"

juno "$@" --headless

