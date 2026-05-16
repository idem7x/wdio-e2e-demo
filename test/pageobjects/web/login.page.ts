import Page from "pageobjects/page";
import Selector from "modules/selector";
import { FindBy } from "modules/find.by";
import EnvVariables from "data/env.variables";
import InventoryPage from "./inventory.page";

class LoginPage extends Page {
  protected pageUrl = "";

  @FindBy("Username input", "[data-test='username']")
  private usernameInput: Selector;

  @FindBy("Password input", "[data-test='password']")
  private passwordInput: Selector;

  @FindBy("Login button", "[data-test='login-button']")
  private loginButton: Selector;

  @FindBy("Login error message", "[data-test='error']")
  private errorMessage: Selector;

  public async open(): Promise<void> {
    await super.openUrl(EnvVariables.HOST_WEB);
    await super.waitForElementIsDisplayed(this.usernameInput);
  }

  public async loginAs(
    username: string,
    password: string
  ): Promise<InventoryPage> {
    await super.sendKeys(this.usernameInput, username);
    await super.sendKeys(this.passwordInput, password);
    await super.click(this.loginButton);
    return new InventoryPage();
  }

  public async loginWithBadCredentials(
    username: string,
    password: string
  ): Promise<void> {
    await super.sendKeys(this.usernameInput, username);
    await super.sendKeys(this.passwordInput, password);
    await super.click(this.loginButton);
  }

  public async getErrorMessage(): Promise<string> {
    await super.waitForElementIsDisplayed(this.errorMessage);
    return await super.getText(this.errorMessage);
  }
}

export default LoginPage;
