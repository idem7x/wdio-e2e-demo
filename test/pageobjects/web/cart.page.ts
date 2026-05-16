import Page from "pageobjects/page";
import Selector from "modules/selector";
import { FindBy } from "modules/find.by";

class CartPage extends Page {
  protected pageUrl = "cart.html";

  @FindBy("Cart container", "[data-test='cart-contents-container']")
  protected pageElement: Selector;

  @FindBy("Cart items", ".cart_item")
  private cartItems: Selector;

  @FindBy("Cart item names", ".cart_item .inventory_item_name")
  private cartItemNames: Selector;

  @FindBy("Checkout button", "[data-test='checkout']")
  private checkoutButton: Selector;

  @FindBy("Continue shopping button", "[data-test='continue-shopping']")
  private continueShoppingButton: Selector;

  public async isLoaded(): Promise<boolean> {
    return await super.isPageLoad();
  }

  public async getCartItemsCount(): Promise<number> {
    return await this.cartItems.getAll().length;
  }

  public async getCartItemNames(): Promise<string[]> {
    const elements = this.cartItemNames.getAll();
    const length = await elements.length;
    const names: string[] = [];
    for (let i = 0; i < length; i++) {
      names.push(await elements[i].getText());
    }
    return names;
  }

  public async clickCheckout(): Promise<void> {
    await super.click(this.checkoutButton);
  }

  public async clickContinueShopping(): Promise<void> {
    await super.click(this.continueShoppingButton);
  }
}

export default CartPage;
