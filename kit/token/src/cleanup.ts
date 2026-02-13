import {isEmptyString} from '@dfinity/utils';
import {Ed25519KeyIdentity} from '@icp-sdk/core/identity';
import {deleteController} from './_controller';
import {loadEnv} from './_env';
import {logError} from './_error';
import {decodeToken} from './_token';

const maybeEnv = await loadEnv();

if (maybeEnv.result !== 'success') {
  process.exit(0);
}

const envToken = process.env.JUNO_TOKEN;

if (isEmptyString(envToken)) {
  process.exit(0);
}

const maybeToken = decodeToken(envToken);

if ('err' in maybeToken) {
  console.log('Cannot parse token provided as an environment variable.');

  const {err} = maybeToken;
  logError(err);

  process.exit(1);
}

const {token} = maybeToken;
const identity = Ed25519KeyIdentity.fromParsedJson(token);

const {env} = maybeEnv;

const result = await deleteController({identity, env});

if (result.result === 'error') {
  console.log(`An unexpected error occurred while cleaning up the automation access key 😫.`);

  const {err} = result;
  logError(err);

  process.exit(1);
}

console.log(`🗑️  Removed automation access key ${identity.getPrincipal().toText()}`);
