declare module "allure-commandline" {
  import { ChildProcess } from "child_process";
  function allure(args: string[]): ChildProcess;

  export = allure;
}
