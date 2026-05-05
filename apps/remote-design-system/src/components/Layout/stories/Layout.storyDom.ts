import {
  Bell,
  Boxes,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Search,
  createElement as createLucideElement
} from "lucide";

import { createDsButton, setAttributes } from "../../shared/stories/storyElements";
import { contentCopy, headerItems, sideItems } from "./Layout.storyData";
import type { HeaderKey, LayoutStoryArgs, MenuKey, SideItem, SideKey, StoryIcon } from "./Layout.storyTypes";

export function createIcon(icon: StoryIcon) {
  return createLucideElement(icon, {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    width: 16,
    "stroke-width": 2.25
  });
}

export function resolveSideKey(key: MenuKey): SideKey {
  if (key.startsWith("archive-")) {
    return "documents";
  }

  return key as SideKey;
}

export function createPreview(modifier?: string) {
  const preview = document.createElement("div");

  preview.className = ["ds-layout-story-preview", modifier].filter(Boolean).join(" ");

  return preview;
}

export function createHeader(activeHeader: HeaderKey, onHeaderSelect: (key: HeaderKey) => void) {
  const header = document.createElement("ds-layout-header");
  const center = document.createElement("div");
  const actions = document.createElement("div");

  center.className = "ds-layout-story-header-center";
  actions.className = "ds-layout-story-header-actions";
  center.append(createHeaderNav(activeHeader, onHeaderSelect));
  actions.append(createHeaderAction("Search", Search), createHeaderAction("Notifications", Bell, true));
  header.append(createLogo(), center, actions);

  return header;
}

export function createFooter() {
  const footer = document.createElement("ds-layout-footer");

  footer.textContent = "Portfolio Design System Layout";

  return footer;
}

export function createSider(
  args: LayoutStoryArgs,
  activeKey: MenuKey,
  onSideSelect: (key: MenuKey) => void,
  options: { customTrigger?: boolean; long?: boolean; menu?: HTMLElement } = {}
) {
  const sider = document.createElement("ds-layout-sider");

  sider.setAttribute("theme", args.theme);
  sider.setAttribute("width", args.width);
  sider.setAttribute("collapsed-width", String(args.collapsedWidth));
  sider.toggleAttribute("collapsed", args.collapsed);
  sider.toggleAttribute("collapsible", args.collapsible);
  sider.toggleAttribute("reverse-arrow", args.reverseArrow);

  if (options.customTrigger) {
    sider.append(createCustomTrigger());
  }

  sider.append(options.menu ?? createSiderMenu(args, activeKey, onSideSelect, options.long));

  if (args.breakpoint) {
    sider.setAttribute("breakpoint", args.breakpoint);
  }

  return sider;
}

function createCustomTrigger() {
  const trigger = document.createElement("span");
  const collapseIcon = createIcon(ChevronsLeft);
  const expandIcon = createIcon(ChevronsRight);
  const label = document.createElement("span");

  trigger.slot = "trigger";
  trigger.className = "ds-layout-story-custom-trigger";
  collapseIcon.classList.add("ds-layout-story-custom-trigger-icon", "ds-layout-story-custom-trigger-icon--collapse");
  expandIcon.classList.add("ds-layout-story-custom-trigger-icon", "ds-layout-story-custom-trigger-icon--expand");
  label.className = "ds-layout-story-custom-trigger-label";
  label.textContent = "Navigation";
  trigger.append(collapseIcon, expandIcon, label);

  return trigger;
}

export function createContent(activeHeader: HeaderKey, activeSide: SideKey, long = false) {
  const content = document.createElement("ds-layout-content");
  const body = document.createElement("div");
  const eyebrow = document.createElement("p");
  const title = document.createElement("h2");
  const text = document.createElement("p");
  const grid = document.createElement("div");
  const selected = contentCopy[activeHeader][activeSide];

  body.className = "ds-layout-story-content";
  eyebrow.className = "ds-layout-story-eyebrow";
  eyebrow.textContent = `${activeHeader} / ${activeSide}`;
  title.textContent = selected.title;
  text.textContent = selected.body;
  grid.className = "ds-layout-story-card-grid";

  for (const label of ["Status", "Activity", "Owner", "Next step"]) {
    grid.append(createContentCard(label, `${selected.title} 영역의 ${label.toLowerCase()} 정보를 표시합니다.`));
  }

  if (long) {
    for (let index = 1; index <= 8; index += 1) {
      grid.append(
        createContentCard(
          `Scrollable block ${index}`,
          "긴 콘텐츠에서도 Sider와 Content의 스크롤 흐름을 분리해 확인할 수 있습니다."
        )
      );
    }
  }

  body.append(eyebrow, title, text, grid);
  content.append(body);

  return content;
}

export function createSiderMenu(args: LayoutStoryArgs, activeKey: MenuKey, onSelect: (key: MenuKey) => void, long = false) {
  const menu = document.createElement("ds-menu");

  menu.className = "ds-layout-story-side-menu";
  setAttributes(menu, {
    "aria-label": "Side menu",
    "default-open-keys": getOpenGroupKeys(activeKey).join(","),
    "inline-collapsed": args.collapsed,
    mode: "inline",
    selectable: true,
    "selected-keys": activeKey,
    theme: args.theme
  });
  menu.append(
    createMenuItemElement(sideItems[0]),
    createMenuItemElement(sideItems[1]),
    createMenuGroupElement("workspace-group", "Workspace", sideItems.slice(2, 5)),
    createMenuGroupElement("operations-group", "Operations", sideItems.slice(5))
  );

  if (long) {
    for (let index = 1; index <= 10; index += 1) {
      menu.append(createMenuItemElement({ icon: Boxes, key: `archive-${index}`, label: `Archive ${index}` }));
    }
  }

  menu.addEventListener("ds-menu-select", (event) => {
    const { key } = (event as CustomEvent<{ key: MenuKey }>).detail;
    onSelect(key);
  });

  return menu;
}

function createLogo() {
  const logo = document.createElement("span");

  logo.className = "ds-layout-story-logo";
  logo.textContent = "DS";

  return logo;
}

function createHeaderNav(activeHeader: HeaderKey, onSelect: (key: HeaderKey) => void) {
  const nav = document.createElement("ds-menu");

  nav.className = "ds-layout-story-topnav";
  setAttributes(nav, {
    "aria-label": "Primary sections",
    mode: "horizontal",
    selectable: true,
    "selected-keys": activeHeader
  });

  for (const item of headerItems) {
    nav.append(createMenuItemElement(item));
  }

  nav.addEventListener("ds-menu-select", (event) => {
    const { key } = (event as CustomEvent<{ key: HeaderKey }>).detail;
    onSelect(key);
  });

  return nav;
}

function createHeaderAction(label: string, icon: StoryIcon, hasIndicator = false) {
  const button = createDsButton({ label: "", type: "text" });
  const iconElement = createIcon(icon);

  button.className = "ds-layout-story-header-action";
  button.setAttribute("ghost", "");
  button.setAttribute("shape", "circle");
  button.setAttribute("aria-label", label);
  iconElement.slot = "icon";
  button.append(iconElement);

  if (hasIndicator) {
    const indicator = document.createElement("span");

    indicator.className = "ds-layout-story-header-action-indicator";
    indicator.setAttribute("aria-hidden", "true");
    button.append(indicator);
  }

  return button;
}

function createMenuGroupElement(key: string, label: string, items: SideItem[]) {
  const group = createMenuItemElement({ icon: LayoutDashboard, key, label }, "submenu");

  group.append(...items.map((item) => createMenuItemElement(item)));

  return group;
}

function createMenuItemElement(
  item: { icon?: StoryIcon; key: HeaderKey | MenuKey | string; label: string },
  type: "item" | "submenu" = "item"
) {
  const element = document.createElement("ds-menu-item");

  setAttributes(element, {
    "item-key": item.key,
    label: item.label,
    type
  });

  if (item.icon) {
    const icon = createIcon(item.icon);

    icon.slot = "icon";
    element.append(icon);
  }

  return element;
}

function getOpenGroupKeys(activeKey: MenuKey) {
  const openKeys: string[] = [];

  if (sideItems.slice(2, 5).some((item) => item.key === activeKey)) {
    openKeys.push("workspace-group");
  }

  if (sideItems.slice(5).some((item) => item.key === activeKey) || activeKey.startsWith("archive-")) {
    openKeys.push("operations-group");
  }

  return openKeys;
}

function createContentCard(title: string, body: string) {
  const card = document.createElement("section");
  const heading = document.createElement("h3");
  const paragraph = document.createElement("p");

  heading.textContent = title;
  paragraph.textContent = body;
  card.append(heading, paragraph);

  return card;
}
