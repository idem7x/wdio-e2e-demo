import Page from "pageobjects/page";
import Selector from "modules/selector";
import {
  FindByAndroidUiAutomator,
  FindByAndroidUiAutomatorText
} from "modules/find.by";
import ApiDemosViewsPage from "./api.demos.views.page";

/**
 * Top-level menu of the Appium ApiDemos sample APK.
 * Public APK: https://github.com/appium/appium/tree/master/packages/appium/sample-code/apps
 */
class ApiDemosHomePage extends Page {
  @FindByAndroidUiAutomator(
    "ApiDemos list",
    'new UiSelector().className("android.widget.ListView")'
  )
  protected pageElement: Selector;

  @FindByAndroidUiAutomatorText("Views menu item", "Views")
  private viewsMenuItem: Selector;

  @FindByAndroidUiAutomatorText("Accessibility menu item", "Accessibility")
  private accessibilityMenuItem: Selector;

  public async isLoaded(): Promise<boolean> {
    return await super.isPageLoad();
  }

  public async tapViews(): Promise<ApiDemosViewsPage> {
    await super.click(this.viewsMenuItem);
    return new ApiDemosViewsPage();
  }

  public async isAccessibilityVisible(): Promise<boolean> {
    return await super.isElementDisplayed(this.accessibilityMenuItem);
  }
}

export default ApiDemosHomePage;
