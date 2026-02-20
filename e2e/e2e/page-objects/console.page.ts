import {notEmptyString} from '@dfinity/utils';
import {PrincipalText, PrincipalTextSchema} from '@dfinity/zod-schemas';
import {expect} from '@playwright/test';
import {TIMEOUT_AVERAGE, TIMEOUT_SHORT} from '../constants/e2e.constants';
import {testIds} from '../constants/test-ids.constants';
import {IdentityPage, type IdentityPageParams} from './identity.page';
import {SatellitePage} from './satellite.page';

export class ConsolePage extends IdentityPage {
  private constructor(params: IdentityPageParams) {
    super(params);
  }

  static async initWithSignIn(params: IdentityPageParams): Promise<ConsolePage> {
    const consolePage = new ConsolePage(params);

    await consolePage.goto();

    await consolePage.signIn();

    return consolePage;
  }

  async goto({path}: {path: string} = {path: '/'}): Promise<void> {
    await this.page.goto(path);
  }

  private async signIn(): Promise<void> {
    await expect(this.page.getByTestId(testIds.auth.switchDevAccount)).toBeVisible(TIMEOUT_AVERAGE);

    await this.page.getByTestId(testIds.auth.switchDevAccount).click();

    await expect(this.page.getByTestId(testIds.auth.inputDevIdentifier)).toBeVisible();

    await this.page
      .getByTestId(testIds.auth.inputDevIdentifier)
      .fill(crypto.randomUUID().replaceAll('-', ''));

    await expect(this.page.getByTestId(testIds.auth.continueDevAccount)).toBeVisible();

    await this.page.getByTestId(testIds.auth.continueDevAccount).click();
  }

  async createSatellite(params: {kind: 'website' | 'application'}): Promise<void> {
    await expect(this.page.getByTestId(testIds.launchpad.launch)).toBeVisible(TIMEOUT_AVERAGE);

    await this.page.getByTestId(testIds.launchpad.launch).click();

    await this.createSatelliteWizard(params);
  }

  async openCreateAdditionalSatelliteWizard(params: {
    kind: 'website' | 'application';
  }): Promise<void> {
    await expect(this.page.getByTestId(testIds.launchpad.actions)).toBeVisible(TIMEOUT_AVERAGE);

    await this.page.getByTestId(testIds.launchpad.actions).click();

    await expect(this.page.getByTestId(testIds.launchpad.launchExtraSatellite)).toBeVisible(
      TIMEOUT_AVERAGE
    );

    await this.page.getByTestId(testIds.launchpad.launchExtraSatellite).click();

    await this.createSatelliteWizard(params);
  }

  private async createSatelliteWizard({kind}: {kind: 'website' | 'application'}): Promise<void> {
    await expect(this.page.getByTestId(testIds.createSatellite.create)).toBeVisible({
      timeout: 15000
    });

    await this.page.getByTestId(testIds.createSatellite.input).fill('Test');
    await this.page.getByTestId(testIds.createSatellite[kind]).click();

    await this.page.getByTestId(testIds.createSatellite.create).click();

    await expect(this.page.getByTestId(testIds.createSatellite.continue)).toBeVisible(
      TIMEOUT_AVERAGE
    );

    await this.page.getByTestId(testIds.createSatellite.continue).click();
  }

  async visitSatelliteSite(
    {title}: {title: string} = {title: 'Juno / Satellite'}
  ): Promise<SatellitePage> {
    await expect(this.page.getByTestId(testIds.satelliteOverview.visit)).toBeVisible(
      TIMEOUT_AVERAGE
    );

    const satellitePagePromise = this.context.waitForEvent('page');

    await this.page.getByTestId(testIds.satelliteOverview.visit).click();

    const satellitePage = await satellitePagePromise;

    await expect(satellitePage).toHaveTitle(title);

    return new SatellitePage({
      page: satellitePage,
      browser: this.browser,
      context: this.context
    });
  }

  async getCycles(): Promise<void> {
    await expect(this.page.getByTestId(testIds.navbar.openWallet)).toBeVisible();

    await this.page.getByTestId(testIds.navbar.openWallet).click();

    await expect(this.page.getByTestId(testIds.navbar.getCycles)).toBeVisible();

    await this.page.getByTestId(testIds.navbar.getCycles).click();

    await expect(this.page.getByText('330.010 TCycles')).toBeVisible({timeout: 65000});
  }

  async copySatelliteID(): Promise<string> {
    await expect(this.page.getByTestId(testIds.satelliteOverview.copySatelliteId)).toBeVisible();

    await this.page.getByTestId(testIds.satelliteOverview.copySatelliteId).click();

    const satelliteId = await this.page.evaluate(() => navigator.clipboard.readText());

    expect(notEmptyString(satelliteId)).toBeTruthy();
    expect(PrincipalTextSchema.safeParse(satelliteId).success).toBeTruthy();

    return satelliteId;
  }

  async addSatelliteAdminAccessKey({
    satelliteId,
    accessKey
  }: {
    satelliteId: PrincipalText;
    accessKey: string;
  }): Promise<void> {
    await this.goto({path: `/satellite/?s=${satelliteId}&tab=setup`});

    const btnLocator = this.page.locator('button', {hasText: 'Add an access key'});
    await expect(btnLocator).toBeVisible(TIMEOUT_SHORT);
    await btnLocator.click();

    const form = this.page.locator('form');

    await form.getByRole('radio', {name: /enter one manually/i}).check();

    const keyField = form.getByLabel('Access Key ID');
    await expect(keyField).toBeEnabled();
    await keyField.fill(accessKey);

    await form.locator('select[name="scope"]').selectOption('admin');

    const submitLocator = form.getByRole('button', {name: /^submit$/i});
    await expect(submitLocator).toBeEnabled();
    await submitLocator.click();

    await expect(this.page.getByText('Access Key Added')).toBeVisible(TIMEOUT_SHORT);
  }
}
