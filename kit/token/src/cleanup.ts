import {isEmptyString} from '@dfinity/utils';
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
const {
  env: {satelliteId}
} = maybeEnv;

await deleteController({token, satelliteId});

console.log('🗑️  Access key used for automation cleaned.');
