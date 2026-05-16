import Page from "pageobjects/page";
import Selector from "./selector";

class Radio extends Page {
  private radio: Selector;

  public init(selector: Selector): this {
    this.radio = selector;
    return this;
  }

  public async isSelected(): Promise<boolean> {
    return await this.radio.get().isSelected();
  }

  public async check(): Promise<void> {
    if (!(await this.isSelected())) {
      await super.clickElement(this.radio);
    }
  }
}

export default Radio;
