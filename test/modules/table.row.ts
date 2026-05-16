import Page from "pageobjects/page";
import Selector from "modules/selector";

class TableRow extends Page {
  private tableRow: Selector;

  public init(row: Selector): this {
    this.tableRow = row;
    return this;
  }

  public async getTextFromCell(index: number): Promise<string> {
    const tdXPath = this.tableRow.getSelector() + `//td[${index + 1}]`;
    const tdSelector = new Selector().init(tdXPath, "Select TD");
    return await super.getText(tdSelector);
  }

  public async clickOnLinkInCellByXPath(
    tdIndex: number,
    selector: string
  ): Promise<void> {
    const tdXPath = `${this.tableRow.getSelector()}//td[${tdIndex + 1}]${selector}`;
    await super.click(new Selector().init(tdXPath, "Select TD"));
  }
}

export default TableRow;
