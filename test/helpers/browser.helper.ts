import allureReportUtil from "utils/allure.report.util";

class BrowserHelper {
  public async clearLocalStorage(): Promise<void> {
    await browser.execute(() => {
      window.localStorage.clear();
    });
  }

  public async deleteCookies(): Promise<void> {
    await browser.deleteCookies();
  }

  public async refresh(): Promise<void> {
    await allureReportUtil.addStep(`Refresh page`);
    await browser.refresh();
  }

  public async sleep(seconds: number): Promise<void> {
    await browser.pause(seconds * 1000);
  }
}

export default new BrowserHelper();
