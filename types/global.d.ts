/* eslint-disable no-var */
import { EmailReportUtil } from "test/utils/emailReportUtil";

declare global {
  var browser: WebdriverIO.Browser;
  var web: WebdriverIO.Browser;
  var android: WebdriverIO.Browser;
  var emailReportUtil: EmailReportUtil;
  var expect: Chai.ExpectStatic;
}

export {};
