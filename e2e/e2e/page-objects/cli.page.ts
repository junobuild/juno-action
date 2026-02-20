import {assertNonNullish, notEmptyString} from '@dfinity/utils';
import type {PrincipalText} from '@dfinity/zod-schemas';
import {execute, spawn} from '@junobuild/cli-tools';
import {statSync} from 'node:fs';
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {TestPage} from './_page';

// TODO: diff with CLI
const DEV = false; // (process.env.NODE_ENV ?? 'production') === 'development';

const JUNO_CONFIG = join(process.cwd(), 'juno.config.ts');

const JUNO_TEST_ARGS = ['--mode', 'development', '--headless'];

const {command: JUNO_CMD, args: JUNO_CDM_ARGS} = DEV
  ? {command: 'node', args: ['dist/index.js']}
  : {command: 'juno', args: []};

const buildArgs = (args: string[]): string[] => [...JUNO_CDM_ARGS, ...args, ...JUNO_TEST_ARGS];

export interface CliPageParams {
  satelliteId: PrincipalText;
}

export class CliPage extends TestPage {
  #satelliteId: PrincipalText;

  private constructor({satelliteId}: CliPageParams) {
    super();

    this.#satelliteId = satelliteId;
  }

  static async initWithoutLogin(params: CliPageParams): Promise<CliPage> {
    return new CliPage(params);
  }

  static async initWithEmulatorLogin(params: CliPageParams): Promise<CliPage> {
    const cliPage = new CliPage(params);

    await cliPage.initConfig();

    await cliPage.loginWithEmulator();

    await cliPage.applyConfig();

    return cliPage;
  }

  protected async initConfig(): Promise<void> {
    let content = await readFile(JUNO_CONFIG, 'utf-8');
    content = content.replace('<DEV_SATELLITE_ID>', this.#satelliteId);
    await writeFile(JUNO_CONFIG, content, 'utf-8');
  }

  // TODO: public different than in CLI
  async revertConfig(): Promise<void> {
    let content = await readFile(JUNO_CONFIG, 'utf-8');
    content = content.replace(this.#satelliteId, '<DEV_SATELLITE_ID>');
    await writeFile(JUNO_CONFIG, content, 'utf-8');
  }

  async toggleSatelliteId({satelliteId}: {satelliteId: PrincipalText}): Promise<void> {
    await this.revertConfig();
    this.#satelliteId = satelliteId;
    await this.initConfig();
  }

  protected async loginWithEmulator(): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['login', '--emulator'])
    });
  }

  async applyConfig(): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['config', 'apply', '--force'])
    });
  }

  private async logout(): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['logout'])
    });
  }

  async clearHosting(): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['hosting', 'clear'])
    });
  }

  async deployHosting({clear}: {clear: boolean}): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['hosting', 'deploy', ...(clear ? ['--clear'] : [])])
    });
  }

  async createSnapshot({
    target
  }: {
    target: 'satellite' | 'orbiter' | 'mission-control';
  }): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['snapshot', 'create', '--target', target])
    });
  }

  async restoreSnapshot({
    target
  }: {
    target: 'satellite' | 'orbiter' | 'mission-control';
  }): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['snapshot', 'restore', '--target', target])
    });
  }

  async deleteSnapshot({
    target
  }: {
    target: 'satellite' | 'orbiter' | 'mission-control';
  }): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['snapshot', 'delete', '--target', target])
    });
  }

  async downloadSnapshot({
    target
  }: {
    target: 'satellite' | 'orbiter' | 'mission-control';
  }): Promise<{snapshotFolder: string}> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['snapshot', 'download', '--target', target])
    });

    return await this.getSnapshotFsFolder();
  }

  // Retrieve where the snapshot was created
  async getSnapshotFsFolder(): Promise<{snapshotFolder: string}> {
    const snapshotsFolder = join(process.cwd(), '.snapshots');

    const folders = await readdir(snapshotsFolder, {withFileTypes: true});

    const [snapshotFolder] = folders
      .filter((d) => d.isDirectory())
      .map(({name}) => {
        const path = join(snapshotsFolder, name);
        const {birthtimeMs: time} = statSync(path);
        return {path, time};
      })
      .sort((a, b) => b.time - a.time);

    assertNonNullish(snapshotFolder);

    return {snapshotFolder: snapshotFolder.path};
  }

  async uploadSnapshot({
    target,
    folder
  }: {
    target: 'satellite' | 'orbiter' | 'mission-control';
    folder: string;
  }): Promise<void> {
    await execute({
      command: JUNO_CMD,
      args: buildArgs(['snapshot', 'upload', '--target', target, '--dir', folder])
    });
  }

  async listSnapshot({
    target
  }: {
    target: 'satellite' | 'orbiter' | 'mission-control';
  }): Promise<{snapshotId: string | undefined}> {
    let output = '';

    await spawn({
      command: JUNO_CMD,
      args: buildArgs(['snapshot', 'list', '--target', target]),
      stdout: (o) => (output += o),
      silentErrors: true
    });

    const [_, snapshotId] = output.split('Snapshot found:');
    return {snapshotId: notEmptyString(snapshotId) ? snapshotId.trim() : undefined};
  }

  async whoami(): Promise<{accessKey: string}> {
    let output = '';

    await spawn({
      command: JUNO_CMD,
      args: buildArgs(['whoami']),
      stdout: (o) => (output += o),
      silentErrors: true
    });

    const [_, __, ___, text] = output.split(' ');
    const [value] = text.split('\n');
    const accessKey = value.replace('\x1B[32m', '').replace('\x1B[39m', '');

    return {accessKey: accessKey.trim()};
  }

  /**
   * @override
   */
  async close(): Promise<void> {
    // TODO: different than CLI
    // await this.revertConfig();
    await this.logout();
  }
}
