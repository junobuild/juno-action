import type {JunoConfig, JunoConfigEnv, JunoConfigFnOrObject} from '@junobuild/config';
import {type ConfigFilename, readJunoConfig as readJunoConfigTools} from '@junobuild/config-loader';

const JUNO_CONFIG_FILENAME = 'juno.config'; // .json | .js | .cjs | .mjs | .ts

const JUNO_CONFIG_FILE: {filename: ConfigFilename} = {
  filename: JUNO_CONFIG_FILENAME
};

const readJunoConfig = async (env: JunoConfigEnv): Promise<JunoConfig> => {
  const config = (userConfig: JunoConfigFnOrObject): JunoConfig =>
    typeof userConfig === 'function' ? userConfig(env) : userConfig;

  return await readJunoConfigTools({
    ...JUNO_CONFIG_FILE,
    config
  });
};

export const readConfig = async (
  env: JunoConfigEnv
): Promise<{ok: JunoConfig} | {err: unknown}> => {
  try {
    const config = await readJunoConfig(env);
    return {ok: config};
  } catch (err: unknown) {
    return {err};
  }
};
