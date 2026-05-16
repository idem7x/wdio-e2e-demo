import * as process from "process";
import { config } from "dotenv";

config();

class EnvVariables {
  public RETRY = process.env.RETRY!;
  public TIMEOUT = process.env.TIMEOUT!;
  public REPORTS_FOLDER = process.env.REPORTS_FOLDER!;

  public HOST_WEB = process.env.HOST_WEB!;
  public WEB_USERNAME = process.env.WEB_USERNAME!;
  public WEB_PASSWORD = process.env.WEB_PASSWORD!;

  public APPIUM_HOST = process.env.APPIUM_HOST!;
  public APPIUM_PORT = process.env.APPIUM_PORT!;
  public ANDROID_APK_DIR = process.env.ANDROID_APK_DIR!;
  public ANDROID_APK = process.env.ANDROID_APK!;
  public ANDROID_APP_PACKAGE = process.env.ANDROID_APP_PACKAGE!;
  public ANDROID_APP_ACTIVITY = process.env.ANDROID_APP_ACTIVITY!;

  public ALLURE_URL = process.env.ALLURE_URL!;

  public GMAIL_USER = process.env.GMAIL_USER!;
  public GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!;
  public EMAIL_MAIL_FROM = process.env.EMAIL_MAIL_FROM!;
  public EMAIL_MAIL_TO = process.env.EMAIL_MAIL_TO!;
}

export default new EnvVariables();
