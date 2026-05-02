import {
  DROPDOWN_ELEMENT_NAME,
  DROPDOWN_HOVER_CLOSE_DELAY,
  DROPDOWN_ITEM_CLICK_EVENT,
  DROPDOWN_ITEM_ELEMENT_NAME,
  DROPDOWN_OBSERVED_ATTRIBUTES,
  DROPDOWN_OPEN_CHANGE_EVENT,
  DROPDOWN_SELECT_EVENT
} from "./constants/Dropdown.constants";
import {
  getDropdownPlacement,
  getDropdownTrigger,
  isElementInside,
  normalizeBooleanAttribute
} from "./dom/Dropdown.dom";
import { getNextDropdownItem, isDropdownOpenKey } from "./logic/Dropdown.keyboard";
import {
  applyDropdownStyles,
  createDropdownElements,
  syncDropdownElements,
  type DropdownElements
} from "./render/Dropdown.render";
import { DsDropdownItem } from "./DropdownItem";
import type {
  DropdownItemClickDetail,
  DropdownOpenChangeDetail,
  DropdownOpenChangeSource,
  DropdownPlacement,
  DropdownSelectDetail,
  DropdownTrigger
} from "./types/Dropdown.types";

export class DsDropdown extends HTMLElement {
  static observedAttributes = DROPDOWN_OBSERVED_ATTRIBUTES;

  private closeTimer = 0;
  private documentListenerAttached = false;
  private elements?: DropdownElements;

  connectedCallback() {
    this.render();
    this.addEventListener(DROPDOWN_ITEM_CLICK_EVENT, this.handleItemClick as EventListener);
    this.addEventListener("contextmenu", this.handleHostContextMenu);
  }

  disconnectedCallback() {
    this.removeEventListener(DROPDOWN_ITEM_CLICK_EVENT, this.handleItemClick as EventListener);
    this.removeEventListener("contextmenu", this.handleHostContextMenu);
    this.detachDocumentListener();
    this.clearCloseTimer();
  }

  attributeChangedCallback() {
    this.render();
  }

  get arrow() {
    return normalizeBooleanAttribute(this, "arrow", false);
  }

  set arrow(value: boolean) {
    this.toggleAttribute("arrow", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get open() {
    return normalizeBooleanAttribute(this, "open", false);
  }

  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  get placement(): DropdownPlacement {
    return getDropdownPlacement(this);
  }

  set placement(value: DropdownPlacement) {
    this.setAttribute("placement", value);
  }

  get selectable() {
    return normalizeBooleanAttribute(this, "selectable", false);
  }

  set selectable(value: boolean) {
    this.toggleAttribute("selectable", value);
  }

  get selectedKey() {
    return this.getAttribute("selected-key") ?? "";
  }

  set selectedKey(value: string) {
    this.syncNullableAttribute("selected-key", value);
  }

  get trigger(): DropdownTrigger {
    return getDropdownTrigger(this);
  }

  set trigger(value: DropdownTrigger) {
    this.setAttribute("trigger", value);
  }

  private handleTriggerClick = (event: Event) => {
    if (this.trigger !== "click" || this.disabled) {
      return;
    }

    event.preventDefault();
    this.setOpen(!this.open, "trigger");
  };

  private handleTriggerContextMenu = (event: Event) => {
    if (this.trigger !== "context-menu" || this.disabled) {
      return;
    }

    event.preventDefault();
    this.setOpen(true, "trigger");
    this.focusFirstItem();
  };

  private handleHostContextMenu = (event: Event) => {
    if (this.isMenuEvent(event)) {
      return;
    }

    this.handleTriggerContextMenu(event);
  };

  private handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (this.disabled) {
      return;
    }

    if (isDropdownOpenKey(event.key)) {
      event.preventDefault();
      this.setOpen(true, "keyboard");
      this.focusFirstItem();
    }
  };

  private handleMouseEnter = () => {
    if (this.trigger !== "hover" || this.disabled) {
      return;
    }

    this.clearCloseTimer();
    this.setOpen(true, "trigger");
  };

  private handleMouseLeave = () => {
    if (this.trigger !== "hover") {
      return;
    }

    this.clearCloseTimer();
    this.closeTimer = window.setTimeout(() => {
      this.setOpen(false, "trigger");
    }, DROPDOWN_HOVER_CLOSE_DELAY);
  };

  private handleDocumentPointerDown = (event: PointerEvent) => {
    if (!this.open || isElementInside(this, event.target)) {
      return;
    }

    this.setOpen(false, "outside");
  };

  private handleItemClick = (event: CustomEvent<DropdownItemClickDetail>) => {
    const item = event.target;

    if (!(item instanceof DsDropdownItem) || !this.contains(item)) {
      return;
    }

    if (this.selectable) {
      this.selectedKey = event.detail.key;
    }

    this.dispatchEvent(
      new CustomEvent<DropdownSelectDetail>(DROPDOWN_SELECT_EVENT, {
        bubbles: true,
        detail: event.detail
      })
    );
    this.setOpen(false, "menu");
  };

  private isMenuEvent(event: Event) {
    return event.composedPath().some((target) => {
      return target instanceof HTMLElement && target.localName === DROPDOWN_ITEM_ELEMENT_NAME;
    });
  }

  private handlePopupKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      this.setOpen(false, "keyboard");
      this.focusTrigger();
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      this.focusAdjacentItem(event.key === "ArrowDown" ? 1 : -1);
    }
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

    this.elements = createDropdownElements({
      onKeyDown: this.handlePopupKeyDown
    });
    this.elements.triggerElement.addEventListener("click", this.handleTriggerClick);
    this.elements.triggerElement.addEventListener("contextmenu", this.handleTriggerContextMenu);
    this.elements.triggerElement.addEventListener("keydown", this.handleTriggerKeyDown);
    this.elements.rootElement.addEventListener("mouseenter", this.handleMouseEnter);
    this.elements.rootElement.addEventListener("mouseleave", this.handleMouseLeave);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyDropdownStyles(shadowRoot);
  }

  private syncAttributes() {
    if (!this.elements) {
      return;
    }

    if (this.disabled && this.open) {
      this.open = false;
    }

    this.setAttributeIfChanged("placement", this.placement);
    this.setAttributeIfChanged("trigger", this.trigger);
    syncDropdownElements({
      arrow: this.arrow,
      disabled: this.disabled,
      elements: this.elements,
      open: this.open,
      placement: this.placement
    });
    this.syncDocumentListener();
  }

  private syncItems() {
    for (const item of this.getDropdownItems()) {
      item.syncFromDropdown({
        selectable: this.selectable,
        selected: this.selectable && item.itemKey === this.selectedKey
      });
    }
  }

  private setOpen(open: boolean, source: DropdownOpenChangeSource) {
    if (this.disabled && open) {
      return;
    }

    if (this.open === open) {
      return;
    }

    this.open = open;
    this.dispatchEvent(
      new CustomEvent<DropdownOpenChangeDetail>(DROPDOWN_OPEN_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          open,
          source
        }
      })
    );
  }

  private focusFirstItem() {
    window.requestAnimationFrame(() => {
      this.getEnabledItems()[0]?.focusControl();
    });
  }

  private focusAdjacentItem(direction: 1 | -1) {
    const items = this.getEnabledItems();

    if (!items.length) {
      return;
    }

    getNextDropdownItem(items, direction)?.focusControl();
  }

  private focusTrigger() {
    this.elements?.fallbackTriggerElement.focus();
  }

  private getEnabledItems() {
    return this.getDropdownItems().filter((item) => !item.disabled && item.type !== "divider");
  }

  private getDropdownItems() {
    return Array.from(this.querySelectorAll(DROPDOWN_ITEM_ELEMENT_NAME)).filter(
      (item): item is DsDropdownItem => item instanceof DsDropdownItem
    );
  }

  private clearCloseTimer() {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = 0;
    }
  }

  private syncDocumentListener() {
    if (this.open && !this.documentListenerAttached) {
      document.addEventListener("pointerdown", this.handleDocumentPointerDown);
      this.documentListenerAttached = true;
      return;
    }

    if (!this.open) {
      this.detachDocumentListener();
    }
  }

  private detachDocumentListener() {
    if (!this.documentListenerAttached) {
      return;
    }

    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.documentListenerAttached = false;
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
}

declare global {
  interface HTMLElementTagNameMap {
    [DROPDOWN_ELEMENT_NAME]: DsDropdown;
  }
}
