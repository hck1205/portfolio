import { defaultLayoutArgs } from "./Layout.storyData";
import {
  createContent,
  createFooter,
  createHeader,
  createPreview,
  createSider,
  createSiderMenu,
  resolveSideKey
} from "./Layout.storyDom";
import type { HeaderKey, LayoutStoryArgs, MenuKey, SideKey } from "./Layout.storyTypes";

export function renderApplication(args: LayoutStoryArgs) {
  const preview = createPreview();

  preview.append(createAppShell(args));

  return preview;
}

export function renderHeaderContentFooter(args: LayoutStoryArgs) {
  const preview = createPreview();
  const layout = document.createElement("ds-layout");
  const { content, footer, header } = createStaticMainParts();

  layout.append(header, content, footer);
  preview.append(layout);

  return preview;
}

export function renderHeaderLeftSiderContentFooter(args: LayoutStoryArgs) {
  const preview = createPreview();
  const rootLayout = document.createElement("ds-layout");
  const bodyLayout = document.createElement("ds-layout");
  const { content, footer, header, sider } = createStaticShellParts(args);

  bodyLayout.append(sider, content);
  rootLayout.append(header, bodyLayout, footer);
  preview.append(rootLayout);

  return preview;
}

export function renderHeaderContentRightSiderFooter(args: LayoutStoryArgs) {
  const preview = createPreview();
  const rootLayout = document.createElement("ds-layout");
  const bodyLayout = document.createElement("ds-layout");
  const { content, footer, header, sider } = createStaticShellParts(args, { rightSider: true });

  bodyLayout.append(content, sider);
  rootLayout.append(header, bodyLayout, footer);
  preview.append(rootLayout);

  return preview;
}

export function renderSiderContent(args: LayoutStoryArgs) {
  const preview = createPreview();
  const layout = document.createElement("ds-layout");
  const { content, sider } = createStaticSiderContentParts(args);

  layout.append(sider, content);
  preview.append(layout);

  return preview;
}

export function renderLeftSiderHeaderContentFooter(args: LayoutStoryArgs) {
  const preview = createPreview();
  const rootLayout = document.createElement("ds-layout");
  const mainLayout = document.createElement("ds-layout");
  const { content, footer, header, sider } = createStaticShellParts(args);

  mainLayout.append(header, content, footer);
  rootLayout.append(sider, mainLayout);
  preview.append(rootLayout);

  return preview;
}

export function renderResponsive() {
  const preview = createPreview("ds-layout-story-preview--responsive");

  preview.append(
    createAppShell({
      ...defaultLayoutArgs,
      breakpoint: "md",
      collapsed: true,
      collapsedWidth: 64
    })
  );

  return preview;
}

export function renderScrollableSider(args: LayoutStoryArgs) {
  const preview = createPreview();

  preview.append(createAppShell(args, { longContent: true, longMenu: true }));

  return preview;
}

export function renderCustomTrigger(args: LayoutStoryArgs) {
  const preview = createPreview();

  preview.append(createAppShell(args, { customTrigger: true }));

  return preview;
}

function createAppShell(
  args: LayoutStoryArgs,
  options: { customTrigger?: boolean; longContent?: boolean; longMenu?: boolean } = {}
) {
  let activeHeader: HeaderKey = "overview";
  let activeSide: SideKey = "home";
  let activeMenu: MenuKey = "home";

  const rootLayout = document.createElement("ds-layout");
  const bodyLayout = document.createElement("ds-layout");
  const contentLayout = document.createElement("ds-layout");
  let siderMenu = createSiderMenu(activeMenu, updateSide, options.longMenu);
  const sider = createSider(args, activeMenu, updateSide, {
    customTrigger: options.customTrigger,
    long: options.longMenu,
    menu: siderMenu
  });

  function renderContent() {
    contentLayout.replaceChildren(createContent(activeHeader, activeSide, options.longContent), createFooter());
  }

  function updateHeader(key: HeaderKey) {
    activeHeader = key;
    rootLayout.replaceChildren(createHeader(activeHeader, updateHeader), bodyLayout);
    renderContent();
  }

  function updateSide(key: MenuKey) {
    activeMenu = key;
    activeSide = resolveSideKey(key);
    const nextSiderMenu = createSiderMenu(activeMenu, updateSide, options.longMenu);

    siderMenu.replaceWith(nextSiderMenu);
    siderMenu = nextSiderMenu;
    renderContent();
  }

  contentLayout.append(createContent(activeHeader, activeSide, options.longContent), createFooter());
  bodyLayout.append(sider, contentLayout);
  rootLayout.append(createHeader(activeHeader, updateHeader), bodyLayout);

  return rootLayout;
}

function createStaticMainParts() {
  const activeHeader: HeaderKey = "overview";
  const activeSide: SideKey = "home";
  const noopHeader = () => undefined;

  return {
    content: createContent(activeHeader, activeSide),
    footer: createFooter(),
    header: createHeader(activeHeader, noopHeader)
  };
}

function createStaticSiderContentParts(args: LayoutStoryArgs, options: { rightSider?: boolean } = {}) {
  const activeHeader: HeaderKey = "overview";
  const activeSide: SideKey = "home";
  const activeMenu: MenuKey = "home";
  const noopSide = () => undefined;
  const sider = createSider(
    {
      ...args,
      reverseArrow: options.rightSider ? true : args.reverseArrow
    },
    activeMenu,
    noopSide
  );

  return {
    content: createContent(activeHeader, activeSide),
    sider
  };
}

function createStaticShellParts(args: LayoutStoryArgs, options: { rightSider?: boolean } = {}) {
  const { content, sider } = createStaticSiderContentParts(args, options);
  const activeHeader: HeaderKey = "overview";
  const noopHeader = () => undefined;

  return {
    content,
    footer: createFooter(),
    header: createHeader(activeHeader, noopHeader),
    sider
  };
}
