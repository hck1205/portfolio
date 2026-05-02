import {
  TAB_CHANGE_EVENT,
  TAB_ELEMENT_NAME,
  TABS_CHANGE_EVENT,
  TABS_EDIT_EVENT,
  TABS_OBSERVED_ATTRIBUTES
} from "./constants/Tabs.constants";
import { getTabsPlacement, getTabsSize, getTabsType, normalizeBooleanAttribute } from "./dom/Tabs.dom";
import { getActiveKeyAfterTabRemove, getDefaultActiveKey, getKeyboardNavigationTabKey } from "./logic/Tabs.logic";
import {
  createTabsElements,
  getTabButtonId,
  getTabPanelId,
  syncTabsElements,
  type TabsElements
} from "./render/Tabs.render";
import { applyTabsStyles } from "./render/Tabs.stylesheet";
import { DsTab } from "./Tab";
import type {
  TabItemData,
  TabsChangeDetail,
  TabsEditDetail,
  TabsPlacement,
  TabsSize,
  TabsType
} from "./types/Tabs.types";

export class DsTabs extends HTMLElement {
  static observedAttributes = TABS_OBSERVED_ATTRIBUTES;

  private elements?: TabsElements;
  private hasAppliedDefaultActiveKey = false;
  private internalActiveKey = "";
  private tabObserver?: MutationObserver;

  connectedCallback() {
    this.addEventListener(TAB_CHANGE_EVENT, this.handleTabChange);
    this.observeTabChanges();
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener(TAB_CHANGE_EVENT, this.handleTabChange);
    this.tabObserver?.disconnect();
  }

  attributeChangedCallback() {
    this.render();
  }

  get activeKey() {
    return this.getAttribute("active-key") ?? "";
  }

  set activeKey(value: string) {
    this.setAttribute("active-key", value);
  }

  get centered() {
    return normalizeBooleanAttribute(this, "centered", false);
  }

  set centered(value: boolean) {
    this.toggleAttribute("centered", value);
  }

  get defaultActiveKey() {
    return this.getAttribute("default-active-key") ?? "";
  }

  set defaultActiveKey(value: string) {
    this.setAttribute("default-active-key", value);
  }

  get editable() {
    return normalizeBooleanAttribute(this, "editable", false);
  }

  set editable(value: boolean) {
    this.toggleAttribute("editable", value);
  }

  get hideAdd() {
    return normalizeBooleanAttribute(this, "hide-add", false);
  }

  set hideAdd(value: boolean) {
    this.toggleAttribute("hide-add", value);
  }

  get size(): TabsSize {
    return getTabsSize(this);
  }

  set size(value: TabsSize) {
    this.setAttribute("size", value);
  }

  get tabPlacement(): TabsPlacement {
    return getTabsPlacement(this);
  }

  set tabPlacement(value: TabsPlacement) {
    this.setAttribute("tab-placement", value);
  }

  get type(): TabsType {
    return getTabsType(this);
  }

  set type(value: TabsType) {
    this.setAttribute("type", value);
  }

  private handleTabChange = (event: Event) => {
    if (event.target instanceof DsTab && event.target.parentElement === this) {
      this.render();
    }
  };

  private handleTabClick = (key: string) => {
    this.activateTab(key);
  };

  private handleAddClick = () => {
    const tabs = this.tabs;
    const nextIndex = tabs.length + 1;
    const nextKey = `new-tab-${Date.now()}`;
    const tab = document.createElement(TAB_ELEMENT_NAME) as DsTab;

    tab.itemKey = nextKey;
    tab.label = `New Tab ${nextIndex}`;
    tab.textContent = `Content of new tab ${nextIndex}`;
    this.append(tab);
    this.activateTab(nextKey);
    this.dispatchTabsEdit({
      action: "add",
      key: nextKey
    });
  };

  private handleCloseClick = (key: string) => {
    const tabs = this.tabs;
    const targetIndex = tabs.findIndex((tab) => tab.itemKey === key);
    const targetTab = tabs[targetIndex];

    if (!targetTab || !targetTab.closable) {
      return;
    }

    const items = this.getTabItems();
    const activeKey = this.getResolvedActiveKey(items);
    const nextActiveKey = getActiveKeyAfterTabRemove(items, key, activeKey);

    targetTab.remove();

    if (activeKey === key) {
      this.setActiveKey(nextActiveKey);
      this.dispatchTabsChange(nextActiveKey, activeKey);
    }

    this.render();
    this.dispatchTabsEdit({
      action: "remove",
      key
    });
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    const items = this.getTabItems();
    const activeKey = this.getResolvedActiveKey(items);
    const orientation = this.isVerticalPlacement() ? "vertical" : "horizontal";
    const nextKey = getKeyboardNavigationTabKey(items, activeKey, event.key, orientation);

    if (!nextKey) {
      return;
    }

    event.preventDefault();
    this.activateTab(nextKey);
    this.elements?.listElement.querySelector<HTMLElement>(`[data-tab-key="${CSS.escape(nextKey)}"]`)?.focus();
  };

  private activateTab(key: string) {
    const items = this.getTabItems();
    const nextItem = items.find((item) => item.key === key);

    if (!nextItem || nextItem.disabled) {
      return;
    }

    const previousActiveKey = this.getResolvedActiveKey(items);

    if (previousActiveKey === key) {
      return;
    }

    this.setActiveKey(key);

    this.dispatchTabsChange(key, previousActiveKey);
  }

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncStructure();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createTabsElements({
      onAddClick: this.handleAddClick,
      onCloseClick: this.handleCloseClick,
      onKeyDown: this.handleKeyDown,
      onTabClick: this.handleTabClick
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyTabsStyles(shadowRoot);
  }

  private observeTabChanges() {
    if (this.tabObserver) {
      return;
    }

    this.tabObserver = new MutationObserver(() => {
      this.render();
    });
    this.tabObserver.observe(this, {
      childList: true
    });
  }

  private syncStructure() {
    if (!this.elements) {
      return;
    }

    const items = this.getTabItems();
    const activeKey = this.getResolvedActiveKey(items);

    syncTabsElements({
      activeKey,
      centered: this.centered,
      editable: this.editable,
      elements: this.elements,
      hideAdd: this.hideAdd,
      items,
      placement: this.tabPlacement,
      size: this.size,
      type: this.type
    });

    for (const tab of this.tabs) {
      const itemKey = tab.itemKey;

      tab.syncFromParent({
        active: itemKey === activeKey,
        buttonId: getTabButtonId(itemKey),
        panelId: getTabPanelId(itemKey)
      });
    }
  }

  private getResolvedActiveKey(items: TabItemData[]) {
    const requestedKey = this.hasAttribute("active-key")
      ? this.activeKey
      : this.hasAppliedDefaultActiveKey
        ? this.internalActiveKey
        : this.defaultActiveKey;
    const activeKey = getDefaultActiveKey(items, requestedKey);

    if (!this.hasAttribute("active-key")) {
      this.internalActiveKey = activeKey;
    }

    this.hasAppliedDefaultActiveKey = true;

    return activeKey;
  }

  private get tabs() {
    return Array.from(this.children).filter((child): child is DsTab => child.localName === TAB_ELEMENT_NAME);
  }

  private isVerticalPlacement() {
    return this.tabPlacement === "start" || this.tabPlacement === "end";
  }

  private setActiveKey(key: string) {
    if (this.hasAttribute("active-key")) {
      this.activeKey = key;
      return;
    }

    this.internalActiveKey = key;
    this.render();
  }

  private getTabItems(): TabItemData[] {
    return this.tabs.map((tab, index) => {
      if (!tab.itemKey) {
        tab.itemKey = `tab-${index + 1}`;
      }

      return {
        disabled: tab.disabled,
        closable: tab.closable,
        icon: tab.icon,
        key: tab.itemKey,
        label: tab.label || `Tab ${index + 1}`
      };
    });
  }

  private dispatchTabsEdit(detail: TabsEditDetail) {
    this.dispatchEvent(
      new CustomEvent<TabsEditDetail>(TABS_EDIT_EVENT, {
        bubbles: true,
        detail
      })
    );
  }

  private dispatchTabsChange(activeKey: string, previousActiveKey: string) {
    this.dispatchEvent(
      new CustomEvent<TabsChangeDetail>(TABS_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          activeKey,
          previousActiveKey
        }
      })
    );
  }
}
