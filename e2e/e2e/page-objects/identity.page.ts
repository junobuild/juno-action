import type {Browser, BrowserContext, Page} from '@playwright/test';
import {TestPage} from './_page';

export interface IdentityPageParams {
  page: Page;
  context: BrowserContext;
  browser: Browser;
}

export abstract class IdentityPage extends TestPage {
  protected readonly page: Page;
  protected readonly context: BrowserContext;
  protected readonly browser: Browser;

  protected constructor({page, context, browser}: IdentityPageParams) {
    super();

    this.page = page;
    this.context = context;
    this.browser = browser;
  }

  /**
   * @override
   */
  async close(): Promise<void> {
    await this.page.close();
  }
}
