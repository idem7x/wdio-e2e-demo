# WebdriverIO E2E Demo — Web + Android + Mixed

A cross-platform end-to-end testing framework built with **TypeScript**, **WebdriverIO 9**, **Appium 3**, and **Mocha**. Demonstrates the patterns I use day-to-day on production E2E suites: a decorator-driven Page Object Model, reusable UI component wrappers, Allure step logging, BiDi-based browser monitoring, and a multi-browser harness that runs Chrome and Android in the same Mocha process.

This repo is a sanitised, runnable distillation of the framework I architected for a multi-service production platform (medical dispatch — web console + ruggedised Android tablet app). Production-specific layers (database fixtures, Keycloak auth, feature-flag toggling, CI K8s orchestration) have been stripped; the architecture and the patterns are intact.

---

## What's inside

| Suite | Target | Demonstrates |
|---|---|---|
| `test:web` | [saucedemo.com](https://www.saucedemo.com) | POM, decorators, Allure step logging, soft asserts, BiDi console/network monitoring |
| `test:android` | Appium [`ApiDemos`](https://github.com/appium/appium/tree/master/packages/appium/sample-code/apps) APK | Android UiAutomator selectors via decorators, native page objects |
| `test:mix` | Both, in one Mocha process | `multiBrowserIt` switches `global.browser` between Chrome and Appium per step |

---

## Tech stack

- **Language:** TypeScript (strict, decorators enabled)
- **Runner:** WebdriverIO 9 + Mocha
- **Mobile:** Appium 3 + UiAutomator2 driver
- **Reporting:** Allure + optional Gmail HTML summary
- **Monitoring:** WebDriver BiDi for browser console errors + 4xx/5xx network responses
- **Lint/format:** ESLint + Prettier

---

## Architecture highlights

### 1. Decorator-driven Page Object Model

Element selectors are declared as cached property decorators. The `description` argument flows straight into Allure as a human-readable step label — no separate translation layer.

```ts
class LoginPage extends Page {
  @FindBy("Username input", "[data-test='username']")
  private usernameInput: Selector;

  @FindBy("Login button", "[data-test='login-button']")
  private loginButton: Selector;

  public async loginAs(user: string, pass: string): Promise<InventoryPage> {
    await super.sendKeys(this.usernameInput, user);
    await super.sendKeys(this.passwordInput, pass);
    await super.click(this.loginButton);
    return new InventoryPage();
  }
}
```

Available decorators:

- `@FindBy(description, selector)` — CSS/XPath
- `@FindAll([{description, selector}, ...])` — multiple elements
- `@FindByAndroidUiAutomator(description, selector)` — auto-prefixes `android=`
- `@FindByAndroidUiAutomatorText(description, text)` — shortcut for text-based UiSelectors

Each decorator builds the `Selector` lazily on first access and then caches it.

### 2. Reusable module wrappers

`test/modules/` provides typed wrappers for non-trivial UI components — `Table`, `Selector`, `Checkbox`, `Radio`, `TableRow`, `TableCell`. Specs and page objects depend on these abstractions instead of raw WebdriverIO chains.

### 3. Multi-browser orchestration

`multiBrowserIt(BrowserType.WEB | ANDROID, name, fn)` swaps `global.browser` between the Chrome and Appium sessions before the step runs. This lets a single spec drive a workflow that hops between web and mobile (real use case: dispatcher creates a record on the web console, paramedic processes it on the Android tablet, both surfaces are asserted end-to-end).

```ts
multiBrowserIt(BrowserType.WEB, "[Web] Admin creates record", async () => { /* ... */ });
multiBrowserIt(BrowserType.ANDROID, "[Android] Operator picks it up", async () => { /* ... */ });
```

### 4. Allure step logging is automatic

Every interaction on the base `Page` class (`click`, `sendKeys`, `clear`, `moveTo`, screenshots, waits) emits a named Allure step using the element's `description`. The resulting reports read like prose:

```
> Open URL [https://www.saucedemo.com]
> Send text [standard_user] to input [Username input]
> Send text [secret_sauce] to input [Password input]
> Click on [Login button]
```

### 5. BiDi-based runtime monitoring (web)

On every web test the framework subscribes via WebDriver BiDi to `log.entryAdded` and `network.responseCompleted` events. Browser console `error` entries and any 4xx/5xx HTTP responses are auto-attached to the current Allure test and surfaced as warnings in the email report — no code in the spec.

### 6. Soft assertions

`SoftAssertUtil` collects failures during a test and reports them all at the end, while still failing the test. Useful for form-heavy flows where you want to see every broken field, not just the first.

### 7. Email summary report

After the run, an HTML report (per-suite breakdown, pass/fail/retry/warnings) can be emailed via Gmail SMTP. Skipped automatically if `EMAIL_MAIL_TO` is not set.

---

## Project layout

```
test/
├── config/              # WebdriverIO configs — shared, web, android, mix
├── constants/           # Wait timeouts, enums
├── data/                # env.variables singleton
├── helpers/             # Cross-cutting helpers (browser, …)
├── loggers/             # BiDi monitoring (console + network errors)
├── modules/             # Reusable UI wrappers + decorators
│   ├── find.by.ts       # @FindBy decorator family
│   ├── selector.ts      # Wraps a CSS/XPath/Android locator
│   ├── multi.browser.ts # multiBrowserIt + step + runTest
│   ├── table.ts, table.row.ts, table.cell.ts
│   ├── checkbox.ts, radio.ts
├── pageobjects/
│   ├── page.ts          # Base class — waits, clicks, allure steps
│   ├── web/             # saucedemo POs
│   └── android/         # ApiDemos POs
├── specs/
│   ├── web/             # 1 web spec
│   ├── android/         # 1 Android spec
│   └── mix/             # 1 mixed spec
└── utils/               # Allure, expect, soft-assert, email, logger
types/                   # Ambient declarations (globals, types)
```

---

## Running

```bash
# Install
npm install
cp .env.example .env

# Web (Chrome headless, no extra setup needed)
npm run test:web

# Android (requires the ApiDemos APK + Appium running)
curl -L -o test/resources/apk/ApiDemos-debug.apk \
  https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk
npm run test:android

# Mixed (both browsers in the same process)
npm run test:mix

# Open Allure
npm run allure:open
```

Required env vars are documented in [`.env.example`](.env.example).

---

## License

MIT. The framework patterns are mine; the sample apps used as test targets (saucedemo, ApiDemos) belong to their respective owners.
