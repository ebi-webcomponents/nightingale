import { customElement } from "lit/decorators.js";
import { CustomElementDecorator } from "lit/decorators";

type Constructor<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
};

type CustomElementClass = Omit<typeof HTMLElement, "new">;

/**
 * Extending the decorator to define custom elements in order to make sure only gets defined once.
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
export const customElementOnce =
  (tagName: string): CustomElementDecorator =>
  (
    classOrTarget: CustomElementClass | Constructor<HTMLElement>,
    context?: ClassDecoratorContext<Constructor<HTMLElement>>,
  ) => {
    if (!window.customElements.get(tagName))
      if (context) customElement(tagName)(classOrTarget, context);
      else customElement(tagName)(classOrTarget);
  };

export default customElementOnce;
