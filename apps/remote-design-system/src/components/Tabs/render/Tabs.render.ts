import type { TabItemData, TabsPlacement, TabsSize, TabsType } from "../types/Tabs.types";
import { createAddIcon, createCloseIcon, createTabIcon } from "./Tabs.icons";

export type TabsElements = {
  listElement: HTMLElement;
  panelElement: HTMLElement;
  rootElement: HTMLElement;
};

type CreateTabsElementsOptions = {
  onAddClick: () => void;
  onCloseClick: (key: string) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onTabClick: (key: string) => void;
};

type SyncTabsElementsOptions = {
  activeKey: string;
  centered: boolean;
  editable: boolean;
  elements: TabsElements;
  hideAdd: boolean;
  items: TabItemData[];
  placement: TabsPlacement;
  size: TabsSize;
  type: TabsType;
};

export function createTabsElements({
  onAddClick,
  onCloseClick,
  onKeyDown,
  onTabClick
}: CreateTabsElementsOptions): TabsElements {
  const rootElement = document.createElement("div");
  const navElement = document.createElement("div");
  const listElement = document.createElement("div");
  const panelElement = document.createElement("div");
  const slotElement = document.createElement("slot");

  rootElement.className = "ds-tabs";
  navElement.className = "ds-tabs__nav";
  listElement.className = "ds-tabs__list";
  panelElement.className = "ds-tabs__panel";
  navElement.setAttribute("role", "tablist");
  listElement.addEventListener("click", (event) => {
    const closeElement = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-close-tab-key]");

    if (closeElement) {
      event.stopPropagation();
      onCloseClick(closeElement.dataset.closeTabKey ?? "");
      return;
    }

    const addElement = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-add-tab]");

    if (addElement) {
      onAddClick();
      return;
    }

    const tabElement = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-tab-key]");

    if (!tabElement || tabElement.disabled) {
      return;
    }

    onTabClick(tabElement.dataset.tabKey ?? "");
  });
  listElement.addEventListener("keydown", onKeyDown);
  panelElement.append(slotElement);
  navElement.append(listElement);
  rootElement.append(navElement, panelElement);

  return {
    listElement,
    panelElement,
    rootElement
  };
}

export function syncTabsElements({
  activeKey,
  centered,
  editable,
  elements,
  hideAdd,
  items,
  placement,
  size,
  type
}: SyncTabsElementsOptions) {
  elements.rootElement.dataset.centered = String(centered);
  elements.rootElement.dataset.editable = String(editable);
  elements.rootElement.dataset.placement = placement;
  elements.rootElement.dataset.size = size;
  elements.rootElement.dataset.type = type;
  elements.listElement.parentElement?.setAttribute(
    "aria-orientation",
    placement === "start" || placement === "end" ? "vertical" : "horizontal"
  );

  elements.listElement.replaceChildren(
    ...items.map((item) =>
      createTabItem({
        activeKey,
        editable,
        item
      })
    ),
    ...(editable && !hideAdd ? [createAddButton()] : [])
  );
}

function createTabItem({ activeKey, editable, item }: { activeKey: string; editable: boolean; item: TabItemData }) {
  const itemElement = document.createElement("span");
  const isActive = item.key === activeKey;

  itemElement.className = "ds-tabs__tab-item";
  itemElement.dataset.active = String(isActive);
  itemElement.dataset.disabled = String(item.disabled);
  itemElement.append(createTabButton({ activeKey, item }));

  if (editable && item.closable) {
    itemElement.append(createCloseButton(item.key));
  }

  return itemElement;
}

function createTabButton({ activeKey, item }: { activeKey: string; item: TabItemData }) {
  const buttonElement = document.createElement("button");
  const labelElement = document.createElement("span");

  buttonElement.className = "ds-tabs__tab";
  buttonElement.dataset.tabKey = item.key;
  buttonElement.disabled = item.disabled;
  buttonElement.id = getTabButtonId(item.key);
  buttonElement.setAttribute("aria-controls", getTabPanelId(item.key));
  buttonElement.setAttribute("aria-disabled", String(item.disabled));
  buttonElement.setAttribute("aria-selected", String(item.key === activeKey));
  buttonElement.setAttribute("role", "tab");
  buttonElement.tabIndex = item.key === activeKey && !item.disabled ? 0 : -1;
  labelElement.textContent = item.label;

  if (item.icon) {
    const iconElement = document.createElement("span");

    iconElement.className = "ds-tabs__icon";
    iconElement.setAttribute("aria-hidden", "true");
    iconElement.append(createTabIcon(item.icon));
    buttonElement.append(iconElement);
  }

  buttonElement.append(labelElement);

  return buttonElement;
}

function createCloseButton(key: string) {
  const buttonElement = document.createElement("button");

  buttonElement.className = "ds-tabs__close";
  buttonElement.dataset.closeTabKey = key;
  buttonElement.setAttribute("aria-label", "Close tab");
  buttonElement.type = "button";
  buttonElement.append(createCloseIcon());

  return buttonElement;
}

function createAddButton() {
  const buttonElement = document.createElement("button");

  buttonElement.className = "ds-tabs__add";
  buttonElement.dataset.addTab = "";
  buttonElement.setAttribute("aria-label", "Add tab");
  buttonElement.type = "button";
  buttonElement.append(createAddIcon());

  return buttonElement;
}

export function getTabButtonId(key: string) {
  return `ds-tab-button-${key}`;
}

export function getTabPanelId(key: string) {
  return `ds-tab-panel-${key}`;
}
