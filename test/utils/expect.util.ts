import allureReport from "./allure.report.util";
import { expect } from "chai";

class ExpectUtil {
  public equal = async (message: string, actual: any, expected: any) => {
    await allureReport.step(
      `${message}, Actual [${actual}], Expected [${expected}]`,
      () => {
        expect(actual, message).to.equal(expected);
      }
    );
  };

  public contain = async (message: string, actual: any, expected: any) => {
    await allureReport.step(
      `${message}, Actual [${actual}], to contain Expected [${expected}]`,
      () => {
        expect(actual, message).to.include(expected);
      }
    );
  };

  public notContain = async (message: string, actual: any, expected: any) => {
    await allureReport.step(
      `${message}, Actual [${actual}], NOT to contain Expected [${expected}]`,
      () => {
        expect(actual, message).to.not.include(expected);
      }
    );
  };

  public fail = async (message: string) => {
    await allureReport.step(message, () => {
      expect.fail(message);
    });
  };
}

export default new ExpectUtil();
