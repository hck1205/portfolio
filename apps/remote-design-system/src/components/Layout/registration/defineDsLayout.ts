import {
  LAYOUT_CONTENT_ELEMENT_NAME,
  LAYOUT_ELEMENT_NAME,
  LAYOUT_FOOTER_ELEMENT_NAME,
  LAYOUT_HEADER_ELEMENT_NAME,
  LAYOUT_SIDER_ELEMENT_NAME
} from "../constants/Layout.constants";
import { DsLayout } from "../Layout";
import { DsLayoutContent, DsLayoutFooter, DsLayoutHeader } from "../LayoutRegion";
import { DsLayoutSider } from "../LayoutSider";

export function defineDsLayout(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(LAYOUT_ELEMENT_NAME)) {
    elementRegistry.define(LAYOUT_ELEMENT_NAME, DsLayout);
  }

  if (!elementRegistry.get(LAYOUT_HEADER_ELEMENT_NAME)) {
    elementRegistry.define(LAYOUT_HEADER_ELEMENT_NAME, DsLayoutHeader);
  }

  if (!elementRegistry.get(LAYOUT_SIDER_ELEMENT_NAME)) {
    elementRegistry.define(LAYOUT_SIDER_ELEMENT_NAME, DsLayoutSider);
  }

  if (!elementRegistry.get(LAYOUT_CONTENT_ELEMENT_NAME)) {
    elementRegistry.define(LAYOUT_CONTENT_ELEMENT_NAME, DsLayoutContent);
  }

  if (!elementRegistry.get(LAYOUT_FOOTER_ELEMENT_NAME)) {
    elementRegistry.define(LAYOUT_FOOTER_ELEMENT_NAME, DsLayoutFooter);
  }
}

