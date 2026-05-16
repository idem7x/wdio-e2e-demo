import allureReport from "utils/allure.report.util";
import ExpectUtil from "utils/expect.util";
import ApiDemosHomePage from "pageobjects/android/api.demos.home.page";
import { step } from "modules/multi.browser";

describe("ApiDemos @android — navigation", () => {
  allureReport.addFeature("ApiDemos sample APK navigation");

  let home: ApiDemosHomePage;

  before(async () => {
    home = new ApiDemosHomePage();
  });

  step("[Android] Home menu loads with expected items", async () => {
    await ExpectUtil.equal(
      "Home menu should be loaded",
      await home.isLoaded(),
      true
    );
    await ExpectUtil.equal(
      "Accessibility menu item should be visible",
      await home.isAccessibilityVisible(),
      true
    );
  });

  step("[Android] Tapping Views opens the Views submenu", async () => {
    const viewsPage = await home.tapViews();
    await ExpectUtil.equal(
      "Views submenu should be loaded",
      await viewsPage.isLoaded(),
      true
    );
    await ExpectUtil.equal(
      "Views submenu should contain Animation item",
      await viewsPage.hasAnimationItem(),
      true
    );
    await ExpectUtil.equal(
      "Views submenu should contain Buttons item",
      await viewsPage.hasButtonsItem(),
      true
    );
  });
});
