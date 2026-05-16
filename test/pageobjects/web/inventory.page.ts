import Page from "pageobjects/page";
import Selector from "modules/selector";
import { FindBy } from "modules/find.by";
import CartPage from "./cart.page";

class InventoryPage extends Page {
  protected pageUrl = "inventory.html";

  @FindBy("Inventory container", "[data-test='inventory-container']")
  protected pageElement: Selector;

  @FindBy("Shopping cart link", ".shopping_cart_link")
  private cartLink: Selector;

  @FindBy("Cart badge", ".shopping_cart_badge")
  private cartBadge: Selector;

  @FindBy("Product sort", "[data-test='product-sort-container']")
  private sortDropdown: Selector;

  public async isLoaded(): Promise<boolean> {
    return await super.isPageLoad();
  }

  public async addProductToCart(productSlug: string): Promise<void> {
    await super.click(this.addToCartButton(productSlug));
  }

  public async removeProductFromCart(productSlug: string): Promise<void> {
    await super.click(this.removeButton(productSlug));
  }

  public async getCartBadgeCount(): Promise<number> {
    if (!(await super.isElementExisting(this.cartBadge))) {
      return 0;
    }
    return Number(await super.getText(this.cartBadge));
  }

  public async openCart(): Promise<CartPage> {
    await super.click(this.cartLink);
    return new CartPage();
  }

  public async sortBy(value: "az" | "za" | "lohi" | "hilo"): Promise<void> {
    await super.click(this.sortDropdown);
    await this.sortDropdown.get().selectByAttribute("value", value);
  }

  private addToCartButton(productSlug: string): Selector {
    return new Selector().init(
      `[data-test='add-to-cart-${productSlug}']`,
      `Add to cart [${productSlug}]`
    );
  }

  private removeButton(productSlug: string): Selector {
    return new Selector().init(
      `[data-test='remove-${productSlug}']`,
      `Remove [${productSlug}]`
    );
  }
}

export default InventoryPage;
