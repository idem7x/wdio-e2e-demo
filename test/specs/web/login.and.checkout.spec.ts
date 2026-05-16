import allureReport from "utils/allure.report.util";
import EnvVariables from "data/env.variables";
import ExpectUtil from "utils/expect.util";
import LoginPage from "pageobjects/web/login.page";
import { step } from "modules/multi.browser";

describe("Saucedemo @web — login and add to cart", () => {
  allureReport.addFeature("Saucedemo login + cart flow");

  let loginPage: LoginPage;

  before(async () => {
    loginPage = new LoginPage();
  });

  step("Valid credentials land on inventory page", async () => {
    await loginPage.open();
    const inventoryPage = await loginPage.loginAs(
      EnvVariables.WEB_USERNAME,
      EnvVariables.WEB_PASSWORD
    );
    await ExpectUtil.equal(
      "Inventory page should be loaded after login",
      await inventoryPage.isLoaded(),
      true
    );
  });

  step("Adding two products updates cart badge and cart contents", async () => {
    await loginPage.open();
    const inventoryPage = await loginPage.loginAs(
      EnvVariables.WEB_USERNAME,
      EnvVariables.WEB_PASSWORD
    );

    await inventoryPage.addProductToCart("sauce-labs-backpack");
    await inventoryPage.addProductToCart("sauce-labs-bike-light");

    await ExpectUtil.equal(
      "Cart badge should show 2 items",
      await inventoryPage.getCartBadgeCount(),
      2
    );

    const cartPage = await inventoryPage.openCart();
    await ExpectUtil.equal(
      "Cart page should be loaded",
      await cartPage.isLoaded(),
      true
    );
    await ExpectUtil.equal(
      "Cart should contain 2 items",
      await cartPage.getCartItemsCount(),
      2
    );

    const names = await cartPage.getCartItemNames();
    await ExpectUtil.contain(
      "Cart should contain Sauce Labs Backpack",
      names,
      "Sauce Labs Backpack"
    );
    await ExpectUtil.contain(
      "Cart should contain Sauce Labs Bike Light",
      names,
      "Sauce Labs Bike Light"
    );
  });

  step("Locked-out user sees error message on login", async () => {
    await loginPage.open();
    await loginPage.loginWithBadCredentials(
      "locked_out_user",
      EnvVariables.WEB_PASSWORD
    );
    await ExpectUtil.contain(
      "Expected locked-out error",
      await loginPage.getErrorMessage(),
      "locked out"
    );
  });
});
