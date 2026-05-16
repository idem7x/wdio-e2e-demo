import TableRow from "./table.row";
import allureReportUtil from "utils/allure.report.util";
import Page from "pageobjects/page";
import Selector from "modules/selector";

/**
 * Lightweight wrapper for HTML tables. Find rows by column name + cell text,
 * read header indices, and so on — without leaking xpath strings into specs.
 */
class Table extends Page {
  private tableSelector: Selector;

  public async init(selector: Selector): Promise<this> {
    this.tableSelector = selector;
    await this.tableSelector.get().waitForClickable();
    return this;
  }

  public async getRowCount(): Promise<number> {
    return this.tableSelector.get().$$("tbody tr").length;
  }

  public async waitForTableIsNotEmpty(): Promise<boolean> {
    const notEmptyTableCondition = async () => (await this.getRowCount()) > 0;
    return await super.waitUntilCondition(
      notEmptyTableCondition,
      browser.options.waitforTimeout!,
      1000,
      `Table is empty!`
    );
  }

  public async getCellData(
    rowNumber: number,
    columnNumber: number
  ): Promise<string> {
    if (rowNumber === 0) {
      throw new Error("Row number should start from 1");
    }
    rowNumber = rowNumber + 1;
    const tableTd =
      this.tableSelector.getSelector() +
      `//tr[${rowNumber}]/td[${columnNumber}]`;
    return await super.getText(new Selector().init(tableTd, "td"));
  }

  public async goToRowByTextInColumn(
    columnName: string,
    textInColumn: string
  ): Promise<TableRow> {
    const columnIndex: number = await this.getColumnIndex(columnName);
    let rowIndexWithNeededCell = -1;
    await this.waitForTableIsNotEmpty();
    const bodyTrs = this.tableSelector.getSelector() + "//tbody//tr";
    const bodyElement = new Selector().init(bodyTrs, "tr").getAll();

    for (let rowIndex = 1; rowIndex <= (await bodyElement.length); rowIndex++) {
      const bodyTdXPath = bodyTrs + `[${rowIndex}]//td[${columnIndex}]`;
      const tdElement = new Selector().init(bodyTdXPath, "td");
      if ((await super.getText(tdElement)) === textInColumn) {
        rowIndexWithNeededCell = rowIndex;
        await allureReportUtil.addStep(
          `Found text [${textInColumn}] in column [${columnName}] at row [${rowIndexWithNeededCell}]`
        );
        break;
      }
    }
    if (rowIndexWithNeededCell === -1) {
      throw new Error(
        `Row that contains text [${textInColumn}] in column [${columnName}] does not exist!`
      );
    }
    const tableRowXPath =
      this.tableSelector.getSelector() +
      `/tbody//tr[${rowIndexWithNeededCell}]`;
    return new TableRow().init(new Selector().init(tableRowXPath, "Row"));
  }

  public async getColumnIndex(columnName: string): Promise<number> {
    const headerSelector = this.tableSelector.getSelector() + "//thead//tr";
    const headerRow = new Selector().init(headerSelector, "tr");
    const cells = headerRow.get().$$("th, td");
    const cellsLength = await cells.length;

    for (let i = 0; i < cellsLength; i++) {
      const cellText = await cells[i].getText();
      if (cellText.trim() === columnName) {
        return i + 1;
      }
    }
    throw new Error(`Column [${columnName}] does not exist in this table!`);
  }
}

export default Table;
