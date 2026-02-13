import {isEmptyString} from '@dfinity/utils';
import {nextArg} from '@junobuild/cli-tools';
import type {JunoConfigEnv} from '@junobuild/config';
import type {ActorParameters} from '@junobuild/ic-client/actor';
import {readConfig} from './_config';
import {assertAndReadSatelliteId} from './_satellite';

export type Env = {
  oidcRequest: {
    url: string;
    token: string;
  };
  satelliteId: string;
} & Pick<ActorParameters, 'container'>;

const loadJunoEnv = (): JunoConfigEnv => {
  const [_, ...args] = process.argv.slice(2);

  const mode = nextArg({args, option: '-m'}) ?? nextArg({args, option: '--mode'});

  return {mode: mode ?? 'production'};
};

export const loadEnv = async (): Promise<
  | {
      result: 'success';
      env: Env;
    }
  | {result: 'skip'}
  | {result: 'error'}
> => {
  const env = loadJunoEnv();

  const maybeConfig = await readConfig(env);

  if ('err' in maybeConfig) {
    console.log('ℹ️  No juno.config found. Skipping automation authentication.');
    return {result: 'skip'};
  }

  const {
    ok: {satellite}
  } = maybeConfig;

  const {satelliteId} = assertAndReadSatelliteId({satellite, env});

  if (isEmptyString(satelliteId)) {
    console.log(`❌ A satellite ID for ${env.mode} must be set in your configuration.`);
    return {result: 'error'};
  }

  const tokenRequestUrl = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  const tokenRequestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;

  if (isEmptyString(tokenRequestUrl) || isEmptyString(tokenRequestToken)) {
    console.log('ℹ️  GitHub Actions OIDC token not available. Skipping automation authentication.');
    console.log(
      '💡 Ensure "id-token: write" permission is set in your workflow if this is unexpected.'
    );
    return {result: 'skip'};
  }

  return {
    result: 'success',
    env: {
      satelliteId,
      oidcRequest: {
        url: tokenRequestUrl,
        token: tokenRequestToken
      },
      // For simplicity reasons, we assume that currently no developers are actually using the emulator in GitHub Actions
      // with another URL than the default and for another Juno mode than development.
      ...(env.mode === 'development' && {container: true})
    }
  };
};
