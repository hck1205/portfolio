import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { BarChart3, FolderKanban, Home, Settings, Users, createElement as createLucideElement } from "lucide";

import { defineDsMenu, type MenuMode, type MenuTheme } from ".";

type MenuStoryArgs = {
  accordion: boolean;
  defaultOpenKeys: string;
  defaultSelectedKeys: string;
  mode: MenuMode;
  multiple: boolean;
  selectable: boolean;
  theme: MenuTheme;
};

const storyDescriptions = {
  default: "세로 방향의 기본 Menu 예시입니다. selected key와 submenu open key가 root menu에서 관리됩니다.",
  horizontal: "상단 navigation에 사용하는 horizontal Menu 예시입니다. 항목들이 가로로 배치되고 선택 상태가 유지됩니다.",
  inline: "side navigation에 사용하는 inline Menu 예시입니다. submenu가 같은 흐름 안에서 펼쳐집니다.",
  accordion: "submenu를 하나만 열어 compact하게 유지하는 예시입니다. 새 submenu를 열면 이전 submenu가 닫힙니다.",
  theme: "dark theme Menu 예시입니다. root menu의 theme이 item 스타일에 함께 전달됩니다.",
  groupAndDivider: "group, divider, disabled, danger, extra label을 포함한 Menu 예시입니다.",
  withIcons: "icon slot을 사용해 각 메뉴 항목 앞에 아이콘을 배치한 Menu 예시입니다."
};

const storyIcons = {
  billing: BarChart3,
  dashboard: Home,
  settings: Settings,
  team: Users,
  workspace: FolderKanban
};

function ensureMenuElementsDefined() {
  defineDsMenu();
}

function createMenuItem(
  itemKey: string,
  label: string,
  options: {
    danger?: boolean;
    disabled?: boolean;
    extra?: string;
    href?: string;
    type?: "item" | "submenu" | "group" | "divider";
  } = {}
) {
  const item = document.createElement("ds-menu-item");

  item.setAttribute("item-key", itemKey);
  item.setAttribute("label", label);

  if (options.danger) {
    item.setAttribute("danger", "true");
  }

  if (options.disabled) {
    item.setAttribute("disabled", "true");
  }

  if (options.extra) {
    item.setAttribute("extra", options.extra);
  }

  if (options.href) {
    item.setAttribute("href", options.href);
  }

  if (options.type) {
    item.setAttribute("type", options.type);
  }

  return item;
}

function appendIcon(item: HTMLElement, icon: keyof typeof storyIcons) {
  const iconElement = createLucideElement(storyIcons[icon], {
    "aria-hidden": "true",
    focusable: "false",
    height: 16,
    slot: "icon",
    width: 16,
    "stroke-width": 2.25
  });

  item.append(iconElement);

  return item;
}

function createMenu(args: MenuStoryArgs) {
  const menu = document.createElement("ds-menu");

  menu.setAttribute("default-open-keys", args.defaultOpenKeys);
  menu.setAttribute("default-selected-keys", args.defaultSelectedKeys);
  menu.setAttribute("mode", args.mode);
  menu.setAttribute("theme", args.theme);
  menu.toggleAttribute("accordion", args.accordion);
  menu.toggleAttribute("multiple", args.multiple);
  menu.toggleAttribute("selectable", args.selectable);
  menu.append(
    createMenuItem("dashboard", "Dashboard"),
    createMenuItem("workspace", "Workspace", { type: "submenu" }),
    createMenuItem("team", "Team"),
    createMenuItem("billing", "Billing"),
    createMenuItem("settings", "Settings")
  );

  const workspace = menu.querySelector<HTMLElement>('ds-menu-item[item-key="workspace"]');
  workspace?.append(createMenuItem("projects", "Projects"), createMenuItem("reports", "Reports"));

  return menu;
}

function createFlatMenu(args: MenuStoryArgs) {
  const menu = document.createElement("ds-menu");

  menu.setAttribute("default-selected-keys", args.defaultSelectedKeys);
  menu.setAttribute("mode", args.mode);
  menu.setAttribute("theme", args.theme);
  menu.toggleAttribute("multiple", args.multiple);
  menu.toggleAttribute("selectable", args.selectable);
  menu.append(
    createMenuItem("dashboard", "Dashboard"),
    createMenuItem("workspace", "Workspace"),
    createMenuItem("team", "Team"),
    createMenuItem("billing", "Billing"),
    createMenuItem("settings", "Settings")
  );

  return menu;
}

function renderDefault(args: MenuStoryArgs) {
  ensureMenuElementsDefined();

  const frame = document.createElement("div");
  frame.className = "ds-menu-story-frame";
  frame.append(createMenu(args));

  return frame;
}

function renderHorizontal(args: MenuStoryArgs) {
  ensureMenuElementsDefined();

  const frame = document.createElement("div");
  frame.className = "ds-menu-story-frame ds-menu-story-frame--horizontal";
  frame.append(
    createFlatMenu({
      ...args,
      mode: "horizontal"
    })
  );

  return frame;
}

function renderInline(args: MenuStoryArgs) {
  return renderDefault({
    ...args,
    defaultOpenKeys: "workspace",
    mode: "inline"
  });
}

function renderAccordion(args: MenuStoryArgs) {
  return renderDefault({
    ...args,
    accordion: true,
    defaultOpenKeys: "workspace",
    mode: "inline"
  });
}

function renderTheme(args: MenuStoryArgs) {
  return renderDefault({
    ...args,
    defaultOpenKeys: "workspace",
    mode: "inline",
    theme: "dark"
  });
}

function renderSubmenu(args: MenuStoryArgs) {
  return renderDefault({
    ...args,
    defaultOpenKeys: "workspace",
    mode: "vertical"
  });
}

function renderGroupAndDivider(args: MenuStoryArgs) {
  ensureMenuElementsDefined();

  const frame = document.createElement("div");
  const menu = createMenu({
    ...args,
    defaultSelectedKeys: "profile",
    mode: "inline"
  });

  menu.replaceChildren(
    createMenuItem("account-group", "Account", { type: "group" }),
    createMenuItem("profile", "Profile", { extra: "New" }),
    createMenuItem("security", "Security", { disabled: true }),
    createMenuItem("divider-1", "", { type: "divider" }),
    createMenuItem("danger-zone", "Danger zone", { danger: true })
  );
  frame.className = "ds-menu-story-frame";
  frame.append(menu);

  return frame;
}

function renderWithIcons(args: MenuStoryArgs) {
  ensureMenuElementsDefined();

  const frame = document.createElement("div");
  const menu = document.createElement("ds-menu");

  menu.setAttribute("default-selected-keys", args.defaultSelectedKeys);
  menu.setAttribute("mode", "vertical");
  menu.setAttribute("theme", args.theme);
  menu.toggleAttribute("selectable", args.selectable);
  menu.append(
    appendIcon(createMenuItem("dashboard", "Dashboard"), "dashboard"),
    appendIcon(createMenuItem("workspace", "Workspace"), "workspace"),
    appendIcon(createMenuItem("team", "Team"), "team"),
    appendIcon(createMenuItem("billing", "Billing"), "billing"),
    appendIcon(createMenuItem("settings", "Settings"), "settings")
  );
  frame.className = "ds-menu-story-frame";
  frame.append(menu);

  return frame;
}

const meta: Meta<MenuStoryArgs> = {
  title: "Components/Navigation/Menu",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Menu는 사이트나 앱의 주요 이동 경로를 표현하는 navigation Web Component입니다. vertical, horizontal, inline mode와 submenu open state, selected state를 지원합니다."
      }
    }
  },
  argTypes: {
    defaultOpenKeys: {
      control: "text"
    },
    defaultSelectedKeys: {
      control: "text"
    },
    mode: {
      control: "inline-radio",
      options: ["vertical", "horizontal", "inline"]
    },
    theme: {
      control: "inline-radio",
      options: ["light", "dark"]
    }
  },
  args: {
    accordion: false,
    defaultOpenKeys: "",
    defaultSelectedKeys: "dashboard",
    mode: "vertical",
    multiple: false,
    selectable: true,
    theme: "light"
  },
  render: renderDefault
};

export default meta;

type Story = StoryObj<MenuStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Horizontal: Story = {
  render: renderHorizontal,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.horizontal
      }
    }
  }
};

export const Inline: Story = {
  render: renderInline,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.inline
      }
    }
  }
};

export const Submenu: Story = {
  render: renderSubmenu,
  parameters: {
    docs: {
      description: {
        story: "submenu를 포함한 vertical Menu 예시입니다. submenu open state와 nested item 선택을 확인합니다."
      }
    }
  }
};

export const Accordion: Story = {
  render: renderAccordion,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.accordion
      }
    }
  }
};

export const DarkTheme: Story = {
  render: renderTheme,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.theme
      }
    }
  }
};

export const GroupAndDivider: Story = {
  render: renderGroupAndDivider,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.groupAndDivider
      }
    }
  }
};

export const WithIcons: Story = {
  render: renderWithIcons,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.withIcons
      }
    }
  }
};
