import {
  MENU_ITEM_CLICK_EVENT,
  MENU_ITEM_ELEMENT_NAME,
  MENU_ITEM_TOGGLE_EVENT,
  MENU_OBSERVED_ATTRIBUTES,
  MENU_OPEN_CHANGE_EVENT,
  MENU_SELECT_EVENT
} from "./constants/Menu.constants";
import {
  getMenuMode,
  getMenuTheme,
  normalizeBooleanAttribute,
  parseKeyList,
  serializeKeyList
} from "./dom/Menu.dom";
import { getNextMenuItem } from "./logic/Menu.keyboard";
import { getNextOpenKeys, getNextSelectedKeys } from "./logic/Menu.selection";
import { DsMenuItem } from "./MenuItem";
import {
  applyMenuStyles,
  createMenuElements,
  syncMenuElements,
  type MenuElements
} from "./render/Menu.render";
import type {
  MenuItemClickDetail,
  MenuItemToggleDetail,
  MenuMode,
  MenuOpenChangeDetail,
  MenuSelectDetail,
  MenuTheme
} from "./types/Menu.types";

export class DsMenu extends HTMLElement {
  static observedAttributes = MENU_OBSERVED_ATTRIBUTES;

  private elements?: MenuElements;
  private initializedDefaults = false;

  connectedCallback() {
    this.initializeDefaultState();
    this.render();
    this.addEventListener(MENU_ITEM_CLICK_EVENT, this.handleItemClick as EventListener);
    this.addEventListener(MENU_ITEM_TOGGLE_EVENT, this.handleItemToggle as EventListener);
  }

  disconnectedCallback() {
    this.removeEventListener(MENU_ITEM_CLICK_EVENT, this.handleItemClick as EventListener);
    this.removeEventListener(MENU_ITEM_TOGGLE_EVENT, this.handleItemToggle as EventListener);
  }

  attributeChangedCallback() {
    this.render();
  }

  get accordion() {
    return normalizeBooleanAttribute(this, "accordion", false);
  }

  set accordion(value: boolean) {
    this.toggleAttribute("accordion", value);
  }

  get inlineCollapsed() {
    return normalizeBooleanAttribute(this, "inline-collapsed", false);
  }

  set inlineCollapsed(value: boolean) {
    this.toggleAttribute("inline-collapsed", value);
  }

  get mode(): MenuMode {
    return getMenuMode(this);
  }

  set mode(value: MenuMode) {
    this.setAttribute("mode", value);
  }

  get multiple() {
    return normalizeBooleanAttribute(this, "multiple", false);
  }

  set multiple(value: boolean) {
    this.toggleAttribute("multiple", value);
  }

  get openKeys() {
    return parseKeyList(this.getAttribute("open-keys") ?? "");
  }

  set openKeys(value: string[]) {
    this.syncKeyListAttribute("open-keys", value);
  }

  get selectable() {
    return normalizeBooleanAttribute(this, "selectable", true);
  }

  set selectable(value: boolean) {
    this.toggleAttribute("selectable", value);
  }

  get selectedKeys() {
    return parseKeyList(this.getAttribute("selected-keys") ?? "");
  }

  set selectedKeys(value: string[]) {
    this.syncKeyListAttribute("selected-keys", value);
  }

  get theme(): MenuTheme {
    return getMenuTheme(this);
  }

  set theme(value: MenuTheme) {
    this.setAttribute("theme", value);
  }

  private handleItemClick = (event: CustomEvent<MenuItemClickDetail>) => {
    const item = event.target;

    if (!(item instanceof DsMenuItem) || !this.contains(item)) {
      return;
    }

    if (!this.selectable) {
      return;
    }

    const selectedKeys = getNextSelectedKeys({
      key: event.detail.key,
      multiple: this.multiple,
      selectedKeys: this.selectedKeys
    });

    this.selectedKeys = selectedKeys;
    this.dispatchEvent(
      new CustomEvent<MenuSelectDetail>(MENU_SELECT_EVENT, {
        bubbles: true,
        detail: {
          ...event.detail,
          selectedKeys
        }
      })
    );
  };

  private handleItemToggle = (event: CustomEvent<MenuItemToggleDetail>) => {
    const item = event.target;

    if (!(item instanceof DsMenuItem) || !this.contains(item)) {
      return;
    }

    const openKeys = getNextOpenKeys({
      accordion: this.accordion,
      key: event.detail.key,
      open: event.detail.open,
      openKeys: this.openKeys
    });

    this.openKeys = openKeys;
    this.dispatchEvent(
      new CustomEvent<MenuOpenChangeDetail>(MENU_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          key: event.detail.key,
          open: event.detail.open,
          openKeys
        }
      })
    );
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const items = this.getInteractiveItems();
    getNextMenuItem(items, event.key === "ArrowDown" ? 1 : -1)?.focusControl();
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
    this.syncItems();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createMenuElements();
    this.elements.rootElement.addEventListener("keydown", this.handleKeyDown);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyMenuStyles(shadowRoot);
  }

  private initializeDefaultState() {
    if (this.initializedDefaults) {
      return;
    }

    this.initializedDefaults = true;

    if (!this.hasAttribute("selected-keys")) {
      this.selectedKeys = parseKeyList(this.getAttribute("default-selected-keys") ?? "");
    }

    if (!this.hasAttribute("open-keys")) {
      this.openKeys = parseKeyList(this.getAttribute("default-open-keys") ?? "");
    }
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    this.setAttributeIfChanged("mode", this.inlineCollapsed ? "inline" : this.mode);
    this.setAttributeIfChanged("theme", this.theme);
    syncMenuElements({
      collapsed: this.inlineCollapsed,
      elements: this.elements,
      mode: this.mode,
      theme: this.theme
    });
  }

  private syncItems() {
    const selectedKeySet = new Set(this.selectedKeys);
    const openKeySet = new Set(this.openKeys);

    for (const item of this.getMenuItems()) {
      const nestedInMenuItem = this.isNestedMenuItem(item);

      item.syncFromMenu({
        collapsed: !nestedInMenuItem && this.inlineCollapsed,
        mode: this.mode === "horizontal" && nestedInMenuItem ? "vertical" : this.mode,
        open: openKeySet.has(item.itemKey),
        selected: selectedKeySet.has(item.itemKey)
      });
    }
  }

  private isNestedMenuItem(item: DsMenuItem) {
    return Boolean(item.parentElement?.closest(MENU_ITEM_ELEMENT_NAME));
  }

  private getInteractiveItems() {
    const openKeySet = new Set(this.openKeys);

    return this.getMenuItems().filter(
      (item) =>
        !item.disabled &&
        item.type !== "divider" &&
        item.type !== "group" &&
        this.isReachableMenuItem(item, openKeySet)
    );
  }

  private isReachableMenuItem(item: DsMenuItem, openKeySet: Set<string>) {
    let parentItem = item.parentElement?.closest(MENU_ITEM_ELEMENT_NAME);

    while (parentItem instanceof DsMenuItem) {
      if (parentItem.type === "submenu" && !openKeySet.has(parentItem.itemKey)) {
        return false;
      }

      parentItem = parentItem.parentElement?.closest(MENU_ITEM_ELEMENT_NAME);
    }

    return true;
  }

  private getMenuItems() {
    return Array.from(this.querySelectorAll(MENU_ITEM_ELEMENT_NAME)).filter(
      (item): item is DsMenuItem => item instanceof DsMenuItem
    );
  }

  private syncKeyListAttribute(name: string, value: string[]) {
    const serializedValue = serializeKeyList(value);

    if (serializedValue) {
      this.setAttributeIfChanged(name, serializedValue);
      return;
    }

    this.removeAttribute(name);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
