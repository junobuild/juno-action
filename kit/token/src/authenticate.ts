import {authenticate} from './_authenticate.ts';
import {loadEnv} from './_env.ts';
import {logError} from './_error.ts';
import {encodeToken} from './_token.ts';

const maybeEnv = await loadEnv();

switch (maybeEnv.result) {
  case 'skip':
    process.exit(2);
    break;
  case 'error':
    process.exit(1);
}

const {env} = maybeEnv;

const result = await authenticate(env);

if (result.result === 'error') {
  console.error(`An unexpected error happened while trying to authenticate the workflow 😫.`);

  const {err} = result;
  logError(err);

  process.exit(1);
}

const {token, id} = result;

console.warn(`🔑 Automation authenticated with key ${id.toString()}`);

// Create a base64 representation of the token (identity key) and print it to the console.
// The caller - the action - will take care of injecting in the process while hiding it from the logs of the action.
const junoToken = encodeToken(token);
console.log(junoToken);
