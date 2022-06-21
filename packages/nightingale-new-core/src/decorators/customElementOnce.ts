import { customElement } from "lit/decorators.js";

type Constructor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};
export interface ClassElement {
  kind: "field" | "method";
  key: PropertyKey;
  placement: "static" | "prototype" | "own";
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => void | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

interface ClassDescriptor {
  kind: "class";
  elements: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => void | Constructor<T>;
}
type CustomElementClass = Omit<typeof HTMLElement, "new">;

/**
 * Extending the decorator to define custom elements in porder to make sure only gets defined once.
 *
 * ```js
 * @customElementOnce('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The tag name of the custom element to define.
 */
const customElementOnce =
  (tagName: string) =>
  (classOrDescriptor: CustomElementClass | ClassDescriptor) => {
    if (!window.customElements.get(tagName))
      customElement(tagName)(classOrDescriptor);
  };

export default customElementOnce;
