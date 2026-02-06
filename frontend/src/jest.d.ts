declare global {
  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: () => void | Promise<void>): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  function expect(actual: any): JestMatchers;
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;

  interface JestMatchers {
    toBeInTheDocument(): void;
    toBe(value: any): void;
    toEqual(value: any): void;
    toBeNull(): void;
    toBeUndefined(): void;
    toBeDefined(): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toContain(item: any): void;
    toHaveLength(length: number): void;
    toMatch(regexp: RegExp | string): void;
    toThrow(error?: string | RegExp | Error): void;
    not: JestMatchers;
  }
}

export {};
