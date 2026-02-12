import {nonNullish} from '@dfinity/utils';
import {AgentError} from '@icp-sdk/core/agent';

export const logError = (err: unknown) => {
  const prettifyError = (err: unknown): string | undefined =>
    typeof err === 'string'
      ? err
      : err instanceof AgentError
        ? err.code.toErrorMessage()
        : err instanceof Error
          ? err.message
          : undefined;

  const message = prettifyError(err);

  if (nonNullish(message)) {
    console.log(message);
  }
};
