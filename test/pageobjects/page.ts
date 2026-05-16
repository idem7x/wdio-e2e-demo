import allureReport from "utils/allure.report.util";
import EnvVariables from "data/env.variables";
import Selector from "modules/selector";
import { WaitTimeout } from "constants/wait.timeout";
import logger from "utils/logger";
import { Buffer } from "buffer";
import { Key } from "webdriverio";

/**
 * Base page object. All page classes (web + Android) extend this.
 * Centralises waits, clicks, attribute reads, screenshots, Allure step logging.
 */
export default class Page {
  protected static HOST = EnvVariables.HOST_WEB;
  protected pageUrl: string;
  protected pageElement: Selector;

  public getPageUrl(): string {
    return this.pageUrl;
  }

  public async open(path?: string): Promise<void> {
    await this.openUrl(`${Page.HOST}/${path ? path : this.pageUrl}`);
    await this.waitUntilTheHtmlIsLoad();
  }

  public async isPageLoad(): Promise<boolean> {
    if (!browser.isMobile) {
      await this.waitUntilTheHtmlIsLoad();
    }
    await this.waitForElementIsDisplayed(this.pageElement);
    return true;
  }

  protected async getUrl(): Promise<string> {
    return await browser.getUrl();
  }

  protected async openUrl(path: string): Promise<void> {
    await allureReport.addStep(`Open URL [${path}]`);
    await browser.url(path);
  }

  protected async waitForElementIsExist(
    selector: Selector,
    timeout?: number
  ): Promise<true | void> {
    const ms = timeout ? timeout * 1000 : browser.options.waitforTimeout!;
    return await selector.get().waitForExist({
      timeout: ms,
      timeoutMsg: `Element [${selector.getSelector()}] was not existing in time [${ms}] ms`
    });
  }

  protected async waitForElementIsNotExist(
    selector: Selector,
    timeout?: number
  ): Promise<true | void> {
    const ms = timeout ? timeout * 1000 : browser.options.waitforTimeout!;
    return await selector.get().waitForExist({
      timeout: ms,
      reverse: true,
      timeoutMsg: `Element [${selector.getSelector()}] still exists in time ${ms} ms`
    });
  }

  protected async waitForElementIsDisplayed(
    selector: Selector,
    timeout?: number
  ): Promise<true | void> {
    const ms = timeout ? timeout * 1000 : browser.options.waitforTimeout!;
    return await selector.get().waitForDisplayed({
      timeout: ms,
      timeoutMsg: `Element [${selector.getSelector()}] was not displayed in time [${ms}] ms`
    });
  }

  protected async waitForElementIsEnabled(
    selector: Selector,
    timeout?: number
  ): Promise<true | void> {
    const ms = timeout ? timeout * 1000 : browser.options.waitforTimeout!;
    return await selector.get().waitForEnabled({
      timeout: ms,
      timeoutMsg: `Element [${selector.getSelector()}] was not enabled in time [${ms}] ms`
    });
  }

  protected async waitForElementIsClickable(
    selector: Selector,
    timeout?: number
  ): Promise<true | void> {
    const ms = timeout ? timeout * 1000 : browser.options.waitforTimeout!;
    if (browser.isMobile) {
      // UiAutomator2 / XCUITest don't implement waitForClickable
      // (it relies on a JS execute under the hood). "Displayed + enabled"
      // is the native-app equivalent.
      await this.waitForElementIsDisplayed(selector, timeout);
      return await this.waitForElementIsEnabled(selector, timeout);
    }
    return await selector.get().waitForClickable({
      timeout: ms,
      timeoutMsg: `Element [${selector.getSelector()}] is not clickable in time [${ms}] ms`
    });
  }

  protected async waitUntilCondition(
    condition: () => Promise<boolean>,
    timeout: number,
    interval: number,
    timeoutMsg: string
  ): Promise<boolean> {
    return await browser.waitUntil(condition, {
      timeout: timeout,
      interval: interval,
      timeoutMsg: timeoutMsg
    });
  }

  protected async getText(element: Selector): Promise<string> {
    return await element.get().getText();
  }

  protected async clear(element: Selector): Promise<void> {
    await allureReport.addStep(`Clear element [${element.getDescription()}]`);
    await this.waitForElementIsEnabled(element);
    await element.get().clearValue();
  }

  protected async sendKeys(element: Selector, text: string): Promise<void> {
    await allureReport.addStep(
      `Send text [${text}] to input [${element.getDescription()}]`
    );
    await this.waitForElementIsEnabled(element);
    await element.get().setValue(text);
  }

  protected async clickClearField(element: Selector): Promise<void> {
    await allureReport.addStep(`Clear [${element.getDescription()}] field`);
    await element.get().click();
    await browser.keys([Key.Ctrl, "a"]);
    await browser.keys(Key.Delete);
  }

  protected async click(selector: Selector): Promise<void> {
    await this.waitForElementIsClickable(selector);
    await this.clickElement(selector);
  }

  protected async clickElement(selector: Selector): Promise<void> {
    await allureReport.addStep(`Click on [${selector.getDescription()}]`);
    await selector.get().click();
  }

  protected async moveTo(selector: Selector): Promise<void> {
    await allureReport.addStep(
      `Move cursor to element [${selector.getDescription()}]`
    );
    await selector.get().moveTo({});
  }

  protected async getValue(selector: Selector): Promise<string> {
    return selector.get().getValue();
  }

  protected async getAttribute(
    selector: Selector,
    attribute: string
  ): Promise<string> {
    return await selector.get().getAttribute(attribute);
  }

  protected async getCSSProperty(
    selector: Selector,
    cssProperty: string
  ): Promise<string> {
    const value = (await selector.get().getCSSProperty(cssProperty)).value;
    return String(value ?? "");
  }

  protected async sleep(seconds: number): Promise<void> {
    const time = seconds * 1000;
    await allureReport.addStep(`Sleep for [${seconds}] seconds...`);
    await browser.pause(time);
  }

  protected async back(): Promise<void> {
    await allureReport.addStep(`Click back`);
    await browser.back();
  }

  protected async saveScreenshot(
    selector: Selector,
    filePath: string
  ): Promise<Buffer> {
    await allureReport.addStep(
      `Save screenshot on [${selector.getDescription()}] on filepath [${filePath}]`
    );
    return selector.get().saveScreenshot(filePath);
  }

  protected async scrollIntoView(element: Selector): Promise<void> {
    await element.get().scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }

  protected async isElementExisting(selector: Selector): Promise<boolean> {
    await allureReport.addStep(
      `Check [${selector.getDescription()}] is existing!`
    );
    return await selector.get().isExisting();
  }

  protected async isElementDisplayed(selector: Selector): Promise<boolean> {
    await allureReport.addStep(
      `Check [${selector.getDescription()}] is displayed!`
    );
    return await selector.get().isDisplayed();
  }

  protected async isElementClickable(selector: Selector): Promise<boolean> {
    await allureReport.addStep(
      `Check [${selector.getDescription()}] is clickable!`
    );
    return await selector.get().isClickable();
  }

  /**
   * Wait for the DOM to stop mutating before continuing — useful for
   * SPA pages that keep re-rendering after the initial load event.
   */
  protected async waitUntilTheHtmlIsLoad(
    timeout: number = WaitTimeout.LONG
  ): Promise<void> {
    const checkDurationMsecs = WaitTimeout.EXTRA_SHORT;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
      const currentHTMLSize = await browser.execute(() => {
        return document.documentElement.outerHTML.length;
      });
      if (lastHTMLSize !== 0 && currentHTMLSize === lastHTMLSize) {
        countStableSizeIterations++;
      } else {
        countStableSizeIterations = 0;
      }
      if (countStableSizeIterations >= minStableSizeIterations) {
        logger.info(`The "${this.getPageUrl()}" page rendered fully.`);
        break;
      }
      lastHTMLSize = currentHTMLSize;
      await browser.pause(checkDurationMsecs);
    }
  }
}
