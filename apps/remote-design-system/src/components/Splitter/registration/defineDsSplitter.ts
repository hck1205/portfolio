import { SPLITTER_ELEMENT_NAME, SPLITTER_PANEL_ELEMENT_NAME } from "../constants/Splitter.constants";
import { DsSplitter } from "../Splitter";
import { DsSplitterPanel } from "../SplitterPanel";

export function defineDsSplitter(registry?: CustomElementRegistry) {
  const elementRegistry = registry ?? (typeof window !== "undefined" ? window.customElements : undefined);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(SPLITTER_ELEMENT_NAME)) {
    elementRegistry.define(SPLITTER_ELEMENT_NAME, DsSplitter);
  }

  if (!elementRegistry.get(SPLITTER_PANEL_ELEMENT_NAME)) {
    elementRegistry.define(SPLITTER_PANEL_ELEMENT_NAME, DsSplitterPanel);
  }
}
