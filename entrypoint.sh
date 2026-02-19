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

# Function like `juno functions build` are local only
requires_no_auth() {
  local args="$1"
  case "$args" in
    "functions build"* | "fn build"* | \
    "functions eject"* | "fn eject"* | \
    "functions init"* | "fn init"* | \
    "emulator start"* | "emulator stop"* | "emulator wait"* | \
    "version"*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# Some functions require Admin privileges which cannot be granted with the OIDC flow.
requires_token_only() {
  local args="$1"
  case "$args" in
    "start"* | "stop"* | "status"* | "upgrade"*)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

if requires_no_auth "$*"; then
  : # No auth needed
elif requires_token_only "$*"; then
  if [ -z "$JUNO_TOKEN" ]; then
    echo "This command requires a JUNO_TOKEN. OIDC authentication is not supported for administrative commands."
    exit 1
  fi
else
  if [ -z "$JUNO_TOKEN" ]; then
    JUNO_TOKEN=$(node /kit/token/src/authenticate.ts "$@")
    echo "::add-mask::$JUNO_TOKEN"
    export JUNO_TOKEN

    CLEANUP_TOKEN="true"
  fi
fi

juno "$@" --headless

