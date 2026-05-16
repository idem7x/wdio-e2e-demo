class Selector {
  private id: string;
  private description: string;

  public init(id: string, description: string): this {
    this.id = id;
    this.description = description;
    return this;
  }

  public getSelector(): string {
    return this.id;
  }

  public get(): ChainablePromiseElement {
    return browser.$(this.id);
  }

  public getAll(): ChainablePromiseArray {
    return browser.$$(this.id);
  }

  public getDescription(): string {
    return this.description;
  }
}

export default Selector;
