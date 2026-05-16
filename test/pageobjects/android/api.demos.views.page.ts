import Page from "pageobjects/page";
import Selector from "modules/selector";
import {
  FindByAndroidUiAutomator,
  FindByAndroidUiAutomatorText
} from "modules/find.by";

/**
 * "Views" submenu of ApiDemos. Lists a long catalogue of Android views
 * (Animation, AutoComplete, Buttons, Calendar, etc.).
 */
class ApiDemosViewsPage extends Page {
  @FindByAndroidUiAutomator(
    "Views list",
    'new UiSelector().className("android.widget.ListView")'
  )
  protected pageElement: Selector;

  @FindByAndroidUiAutomatorText("Animation menu item", "Animation")
  private animationItem: Selector;

  @FindByAndroidUiAutomatorText("Buttons menu item", "Buttons")
  private buttonsItem: Selector;

  public async isLoaded(): Promise<boolean> {
    return await super.isPageLoad();
  }

  public async hasAnimationItem(): Promise<boolean> {
    return await super.isElementDisplayed(this.animationItem);
  }

  public async hasButtonsItem(): Promise<boolean> {
    return await super.isElementDisplayed(this.buttonsItem);
  }

  public async tapAnimation(): Promise<void> {
    await super.click(this.animationItem);
  }
}

export default ApiDemosViewsPage;
