import Page from "pageobjects/page";
import Selector from "modules/selector";

class TableCell extends Page {
  private tableCell: Selector;

  public init(row: Selector): this {
    this.tableCell = row;
    return this;
  }

  public async getTextFromCell(): Promise<string> {
    return await super.getText(this.tableCell);
  }
}

export default TableCell;
