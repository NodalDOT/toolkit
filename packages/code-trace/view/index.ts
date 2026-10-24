import { TAG_NAME } from "../constants.ts";
import { CodeTrace } from "./element.ts";

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, CodeTrace);
}

export { CodeTrace };

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CodeTrace;
  }
}
