import allureReport from "./allure.report.util";
import { expect } from "chai";

class SoftAssertUtil {
  private errors: string[] = [];

  public equal = async (message: string, actual: any, expected: any) => {
    await allureReport.step(
      `${message}, Actual [${actual}], Expected [${expected}]`,
      () => {
        const fullMessage = `${message}, Actual [${actual}], to equal Expected [${expected}]`;
        if (expected === null || expected === undefined) {
          this.addError("Expected result is empty!");
        } else if (actual === null || actual === undefined) {
          this.addError("Actual result is empty!");
        } else if (actual !== expected) {
          this.addError(fullMessage);
        }
      }
    );
  };

  public contain = async (message: string, actual: any, expected: any) => {
    await allureReport.step(
      `${message}, Actual [${actual}], to contain Expected [${expected}]`,
      () => {
        const fullMessage = `${message}, Actual [${actual}], to contain Expected [${expected}]`;
        if (expected === null || expected === undefined) {
          this.addError("Expected result is empty!");
        } else if (actual === null || actual === undefined) {
          this.addError("Actual result is empty!");
        } else if (!actual.includes(expected)) {
          this.addError(fullMessage);
        }
      }
    );
  };

  public addError = async (message: string) => {
    this.errors.push(message);
    await allureReport.step(message, () => {
      expect.fail(message);
    });
  };

  public assertAll = async (message?: string) => {
    if (this.errors.length > 0) {
      const failureMessage = message || "Soft assertion failures detected";
      const allErrors = this.errors.join("\n- ");
      const fullMessage = `${failureMessage}:\n- ${allErrors}`;

      await allureReport.step(
        `${failureMessage} (${this.errors.length} failures)`,
        () => {
          expect.fail(fullMessage);
        }
      );
      this.clearErrors();
    }
  };

  public clearErrors = () => {
    this.errors = [];
  };
}

export default new SoftAssertUtil();
