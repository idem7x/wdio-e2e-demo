import Page from "pageobjects/page";
import Selector from "modules/selector";

class Checkbox extends Page {
  private checkbox: Selector;

  public init(selector: Selector): this {
    this.checkbox = selector;
    return this;
  }

  public async isSelected(): Promise<boolean> {
    return await this.checkbox.get().isSelected();
  }

  public async check(): Promise<void> {
    if (!(await this.isSelected())) {
      await super.clickElement(this.checkbox);
    }
  }

  public async uncheck(): Promise<void> {
    if (await this.isSelected()) {
      await super.clickElement(this.checkbox);
    }
  }
}

export default Checkbox;
