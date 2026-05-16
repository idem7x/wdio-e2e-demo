import allureReport from "utils/allure.report.util";
import EnvVariables from "data/env.variables";
import ExpectUtil from "utils/expect.util";
import LoginPage from "pageobjects/web/login.page";
import ApiDemosHomePage from "pageobjects/android/api.demos.home.page";
import { multiBrowserIt } from "modules/multi.browser";
import { BrowserType } from "types/browserType";

/**
 * Cross-platform smoke spec — illustrates how the mix harness binds
 * `global.browser` to either the Chrome session or the Android session
 * within a single Mocha `describe`. The same pattern in the real project
 * drives a workflow where a dispatcher creates a record on the web admin
 * and a paramedic processes it on the Android tablet, asserting end-to-end
 * state.
 *
 * Stubbed for the demo: each step is independent and just verifies the
 * respective surface is reachable. No cross-platform handoff is performed,
 * because the public sample apps don't share a backend.
 */
describe("Cross-platform smoke @mix", () => {
  allureReport.addFeature("Multi-browser orchestration demo");

  let loginPage: LoginPage;
  let androidHome: ApiDemosHomePage;

  before(() => {
    loginPage = new LoginPage();
    androidHome = new ApiDemosHomePage();
  });

  multiBrowserIt(
    BrowserType.WEB,
    "[Web] Admin can log into the web console",
    async () => {
      await loginPage.open();
      const inventoryPage = await loginPage.loginAs(
        EnvVariables.WEB_USERNAME,
        EnvVariables.WEB_PASSWORD
      );
      await ExpectUtil.equal(
        "Web inventory page reachable after login",
        await inventoryPage.isLoaded(),
        true
      );
    }
  );

  multiBrowserIt(
    BrowserType.ANDROID,
    "[Android] Field operator sees Views submenu",
    async () => {
      const views = await androidHome.tapViews();
      await ExpectUtil.equal(
        "Android Views submenu reachable",
        await views.isLoaded(),
        true
      );
    }
  );

  multiBrowserIt(
    BrowserType.WEB,
    "[Web] Admin adds an item to cart (illustrative cross-platform handoff)",
    async () => {
      await loginPage.open();
      const inventoryPage = await loginPage.loginAs(
        EnvVariables.WEB_USERNAME,
        EnvVariables.WEB_PASSWORD
      );
      await inventoryPage.addProductToCart("sauce-labs-backpack");
      await ExpectUtil.equal(
        "Cart badge should show 1 item",
        await inventoryPage.getCartBadgeCount(),
        1
      );
    }
  );
});
