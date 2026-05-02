import {
  DROPDOWN_ITEM_CLICK_EVENT,
  DROPDOWN_ITEM_OBSERVED_ATTRIBUTES
} from "./constants/Dropdown.constants";
import { getDropdownItemType, normalizeBooleanAttribute } from "./dom/Dropdown.dom";
import {
  applyDropdownItemStyles,
  createDropdownItemElements,
  syncDropdownItemElements,
  type DropdownItemElements
} from "./render/Dropdown.render";
import type { DropdownItemClickDetail, DropdownItemType } from "./types/Dropdown.types";

export class DsDropdownItem extends HTMLElement {
  static observedAttributes = DROPDOWN_ITEM_OBSERVED_ATTRIBUTES;

  private elements?: DropdownItemElements;
  private selectable = false;
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

  get shortcut() {
    return this.getAttribute("shortcut") ?? "";
  }

  set shortcut(value: string) {
    this.syncNullableAttribute("shortcut", value);
  }

  get target() {
    return this.getAttribute("target") ?? "";
  }

  set target(value: string) {
    this.syncNullableAttribute("target", value);
  }

  get type(): DropdownItemType {
    return getDropdownItemType(this);
  }

  set type(value: DropdownItemType) {
    this.setAttribute("type", value);
  }

  focusControl() {
    this.elements?.controlElement.focus();
  }

  syncFromDropdown({ selectable, selected }: { selectable: boolean; selected: boolean }) {
    if (this.selectable === selectable && this.selected === selected) {
      return;
    }

    this.selectable = selectable;
    this.selected = selected;
    this.render();
  }

  private handleClick = (event: Event) => {
    const nativeEvent = event as MouseEvent;

    if (this.disabled || this.type === "divider") {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent<DropdownItemClickDetail>(DROPDOWN_ITEM_CLICK_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          href: this.href,
          key: this.itemKey,
          label: this.label,
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

    this.elements = createDropdownItemElements({
      href: this.href,
      onClick: this.handleClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyDropdownItemStyles(shadowRoot);
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    this.toggleAttributeIfChanged("data-selected", this.selected);
    this.toggleAttributeIfChanged("aria-disabled", this.disabled);
    this.setAttributeIfChanged("data-type", this.type);

    this.elements = syncDropdownItemElements({
      disabled: this.disabled,
      elements: this.elements,
      href: this.href,
      label: this.label,
      onClick: this.handleClick,
      role: this.selectable ? "menuitemcheckbox" : "menuitem",
      selected: this.selected,
      shortcut: this.shortcut,
      target: this.target,
      type: this.type
    });
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
