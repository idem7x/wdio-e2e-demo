/* eslint-disable @typescript-eslint/naming-convention */
import Selector from "./selector";

/**
 * Lazy property initialiser used by the @FindBy family of decorators.
 * Builds the Selector on first access, then replaces the getter with the
 * cached value so subsequent reads are free.
 */
function createCachedPropertyGetter<T>(
  target: object,
  propertyKey: string | symbol,
  initializer: () => T
): void {
  Object.defineProperty(target, propertyKey, {
    get: function (this: object) {
      const value = initializer.call(this);
      Object.defineProperty(this, propertyKey, {
        value,
        writable: true,
        enumerable: true,
        configurable: true
      });
      return value;
    },
    enumerable: true,
    configurable: true
  });
}

function FindBy(description: string, selector: string): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    createCachedPropertyGetter(target, propertyKey, () => {
      return new Selector().init(selector, description);
    });
  };
}

function FindAll(
  selectors: {
    description: string;
    selector: string;
  }[]
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    createCachedPropertyGetter(target, propertyKey, () =>
      selectors.map(({ description, selector }) => {
        return new Selector().init(selector, description);
      })
    );
  };
}

function FindByAndroidUiAutomator(
  description: string,
  selector: string
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    createCachedPropertyGetter(target, propertyKey, () =>
      new Selector().init(`android=${selector}`, description)
    );
  };
}

function FindByAndroidUiAutomatorText(
  description: string,
  selector: string
): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    createCachedPropertyGetter(target, propertyKey, () =>
      new Selector().init(
        `android=new UiSelector().text("${selector}")`,
        description
      )
    );
  };
}

export {
  FindBy,
  FindAll,
  FindByAndroidUiAutomator,
  FindByAndroidUiAutomatorText
};
