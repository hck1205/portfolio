import {
  MENU_ITEM_CLICK_EVENT,
  MENU_ITEM_OBSERVED_ATTRIBUTES,
  MENU_ITEM_TOGGLE_EVENT
} from "./constants/Menu.constants";
import { getMenuItemType, normalizeBooleanAttribute } from "./dom/Menu.dom";
import {
  applyMenuItemStyles,
  createMenuItemElements,
  syncMenuItemElements,
  type MenuItemElements
} from "./render/Menu.render";
import type { MenuItemClickDetail, MenuItemToggleDetail, MenuItemType, MenuMode } from "./types/Menu.types";

export class DsMenuItem extends HTMLElement {
  static observedAttributes = MENU_ITEM_OBSERVED_ATTRIBUTES;

  private elements?: MenuItemElements;
  private collapsed = false;
  private menuMode: MenuMode = "vertical";
  private open = false;
  private selected = false;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get danger() {
    return normalizeBooleanAttribute(this, "danger", false);
  }

  set danger(value: boolean) {
    this.toggleAttribute("danger", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get extra() {
    return this.getAttribute("extra") ?? "";
  }

  set extra(value: string) {
    this.syncNullableAttribute("extra", value);
  }

  get href() {
    return this.getAttribute("href") ?? "";
  }

  set href(value: string) {
    this.syncNullableAttribute("href", value);
  }

  get itemKey() {
    return this.getAttribute("item-key") ?? this.label;
  }

  set itemKey(value: string) {
    this.syncNullableAttribute("item-key", value);
  }

  get label() {
    return this.getAttribute("label") ?? "";
  }

  set label(value: string) {
    this.syncNullableAttribute("label", value);
  }

  get target() {
    return this.getAttribute("target") ?? "";
  }

  set target(value: string) {
    this.syncNullableAttribute("target", value);
  }

  get type(): MenuItemType {
    return getMenuItemType(this);
  }

  set type(value: MenuItemType) {
    this.setAttribute("type", value);
  }

  focusControl() {
    this.elements?.controlElement.focus();
  }

  syncFromMenu({
    mode,
    collapsed,
    open,
    selected
  }: {
    collapsed: boolean;
    mode: MenuMode;
    open: boolean;
    selected: boolean;
  }) {
    if (this.collapsed === collapsed && this.menuMode === mode && this.open === open && this.selected === selected) {
      return;
    }

    this.collapsed = collapsed;
    this.menuMode = mode;
    this.open = open;
    this.selected = selected;
    this.render();
  }

  private handleClick = (event: Event) => {
    const nativeEvent = event as MouseEvent | KeyboardEvent;

    if (this.disabled || this.type === "divider" || this.type === "group") {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (this.type === "submenu") {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent<MenuItemToggleDetail>(MENU_ITEM_TOGGLE_EVENT, {
          bubbles: true,
          composed: true,
          detail: {
            key: this.itemKey,
            open: !this.open
          }
        })
      );
      return;
    }

    this.dispatchEvent(
      new CustomEvent<MenuItemClickDetail>(MENU_ITEM_CLICK_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          key: this.itemKey,
          keyPath: this.getKeyPath(),
          nativeEvent
        }
      })
    );
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createMenuItemElements({
      href: this.href,
      onClick: this.handleClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyMenuItemStyles(shadowRoot);
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    this.toggleAttributeIfChanged("data-open", this.open);
    this.toggleAttributeIfChanged("data-selected", this.selected);
    this.toggleAttributeIfChanged("aria-disabled", this.disabled);
    this.setAttributeIfChanged("data-menu-mode", this.menuMode);
    this.setAttributeIfChanged("data-type", this.type);

    this.elements = syncMenuItemElements({
      disabled: this.disabled,
      elements: this.elements,
      extra: this.extra,
      href: this.href,
      label: this.label,
      collapsed: this.collapsed,
      mode: this.menuMode,
      onClick: this.handleClick,
      open: this.open,
      selected: this.selected,
      target: this.target,
      type: this.type
    });
  }

  private getKeyPath() {
    const keyPath: string[] = [];
    let parentItem = this.parentElement?.closest("ds-menu-item");

    while (parentItem) {
      const parentKey = parentItem.getAttribute("item-key");

      if (parentKey) {
        keyPath.unshift(parentKey);
      }

      parentItem = parentItem.parentElement?.closest("ds-menu-item") ?? null;
    }

    return [...keyPath, this.itemKey];
  }

  private syncNullableAttribute(name: string, value: string) {
    if (value) {
      this.setAttributeIfChanged(name, value);
      return;
    }

    this.removeAttribute(name);
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }

  private toggleAttributeIfChanged(name: string, force: boolean) {
    if (this.hasAttribute(name) !== force) {
      this.toggleAttribute(name, force);
    }
  }
}
