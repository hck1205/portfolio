import {
  Bell,
  Boxes,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Home,
  LayoutDashboard,
  Search,
  createElement as createLucideElement
} from "lucide";

import { contentCopy, headerItems, sideItems } from "./Layout.storyData";
import type { HeaderKey, LayoutStoryArgs, MenuKey, SideKey, StoryIcon } from "./Layout.storyTypes";

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

  sider.append(options.menu ?? createSiderMenu(activeKey, onSideSelect, options.long));

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

export function createSiderMenu(activeKey: MenuKey, onSelect: (key: MenuKey) => void, long = false) {
  const menu = document.createElement("nav");

  menu.className = "ds-layout-story-side-menu";
  menu.setAttribute("aria-label", "Side menu");
  menu.append(
    createMenuButton(sideItems[0], activeKey, onSelect),
    createMenuButton(sideItems[1], activeKey, onSelect),
    createMenuGroup("Workspace", sideItems.slice(2, 5), activeKey, onSelect),
    createMenuGroup("Operations", sideItems.slice(5), activeKey, onSelect)
  );

  if (long) {
    for (let index = 1; index <= 10; index += 1) {
      menu.append(createMenuButton({ icon: Boxes, key: `archive-${index}`, label: `Archive ${index}` }, activeKey, onSelect));
    }
  }

  return menu;
}

function createLogo() {
  const logo = document.createElement("span");

  logo.className = "ds-layout-story-logo";
  logo.textContent = "DS";

  return logo;
}

function createHeaderNav(activeHeader: HeaderKey, onSelect: (key: HeaderKey) => void) {
  const nav = document.createElement("nav");

  nav.className = "ds-layout-story-topnav";
  nav.setAttribute("aria-label", "Primary sections");

  for (const item of headerItems) {
    const button = document.createElement("button");
    const isActive = item.key === activeHeader;

    button.type = "button";
    button.textContent = item.label;
    button.setAttribute("aria-pressed", String(isActive));
    button.dataset.active = String(isActive);
    button.addEventListener("click", () => {
      onSelect(item.key);
    });
    nav.append(button);
  }

  return nav;
}

function createHeaderAction(label: string, icon: StoryIcon, hasIndicator = false) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "ds-layout-story-header-action";
  button.setAttribute("aria-label", label);
  button.append(createIcon(icon));

  if (hasIndicator) {
    const indicator = document.createElement("span");

    indicator.className = "ds-layout-story-header-action-indicator";
    indicator.setAttribute("aria-hidden", "true");
    button.append(indicator);
  }

  return button;
}

function createMenuButton(
  item: { icon: StoryIcon; key: MenuKey; label: string },
  activeKey: MenuKey,
  onSelect: (key: MenuKey) => void
) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "ds-layout-story-menu-item";
  button.dataset.active = String(item.key === activeKey);
  button.setAttribute("aria-pressed", String(item.key === activeKey));
  button.append(createIcon(item.icon), createMenuLabel(item.label));
  button.addEventListener("click", () => {
    onSelect(item.key);
  });

  return button;
}

function createMenuLabel(label: string) {
  const span = document.createElement("span");

  span.className = "ds-layout-story-menu-label";
  span.textContent = label;

  return span;
}

function createMenuGroup(
  label: string,
  items: Array<{ icon: StoryIcon; key: MenuKey; label: string }>,
  activeKey: MenuKey,
  onSelect: (key: MenuKey) => void
) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const list = document.createElement("div");

  details.className = "ds-layout-story-menu-group";
  details.open = items.some((item) => item.key === activeKey);
  summary.append(createIcon(LayoutDashboard), createMenuLabel(label), createIcon(ChevronDown));
  list.className = "ds-layout-story-menu-group-list";

  for (const item of items) {
    list.append(createMenuButton(item, activeKey, onSelect));
  }

  details.append(summary, list);

  return details;
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
