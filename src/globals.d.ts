export interface JestNativeMatchers<R> {
  toBeDisabled(): R;
  toBeEmptyElement(): R;
  toBeEnabled(): R;
  toBeVisible(): R;
  toContainElement(element: ReactTestInstance | null): R;
  toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
  toHaveProp(attr: string, value?: unknown): R;
  toHaveStyle(style: StyleProp<ViewStyle | TextStyle | ImageStyle>): R;
  toHaveAccessibilityState(state: AccessibilityState): R;
  toHaveAccessibilityValue(state: AccessibilityValueMatcher): R;

  /** @deprecated This function has been renamed to `toBeEmptyElement`. */
  toBeEmpty(): R;
}

// implicit jest globals
declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> extends JestNativeMatchers<R> {}
  }
}

// explicit jest globals
declare module '@jest/expect' {
  interface Matchers<R extends void | Promise<void>> extends JestNativeMatchers<R> {}
}
