import { UPLOAD_ELEMENT_NAME } from "../constants/Upload.constants";
import { DsUpload } from "../Upload";

export function defineDsUpload(registry: CustomElementRegistry = customElements) {
  if (!registry.get(UPLOAD_ELEMENT_NAME)) {
    registry.define(UPLOAD_ELEMENT_NAME, DsUpload);
  }
}
