import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { defineDsTabs, type TabsPlacement, type TabsSize, type TabsType } from ".";

type TabsStoryArgs = {
  activeKey: string;
  centered: boolean;
  editable: boolean;
  hideAdd: boolean;
  size: TabsSize;
  tabPlacement: TabsPlacement;
  type: TabsType;
};

type TabStoryData = {
  closable?: boolean;
  content: string;
  disabled?: boolean;
  icon?: string;
  itemKey: string;
  label: string;
};

const defaultTabs = [
  {
    content: "Content of Tab Pane 1",
    itemKey: "1",
    label: "Tab 1"
  },
  {
    content: "Content of Tab Pane 2",
    itemKey: "2",
    label: "Tab 2"
  },
  {
    content: "Content of Tab Pane 3",
    itemKey: "3",
    label: "Tab 3"
  }
] satisfies TabStoryData[];

const editableTabs = [
  {
    ...defaultTabs[0],
    closable: false
  },
  defaultTabs[1],
  defaultTabs[2]
] satisfies TabStoryData[];

const defaultArgs = {
  activeKey: "1",
  centered: false,
  editable: false,
  hideAdd: false,
  size: "medium",
  tabPlacement: "top",
  type: "line"
} satisfies TabsStoryArgs;

const editableCardArgs = {
  ...defaultArgs,
  activeKey: "2",
  editable: true,
  type: "card"
} satisfies TabsStoryArgs;

const storyDescriptions = {
  basic: "\uAE30\uBCF8 Tabs\uB294 \uCCAB \uBC88\uC9F8 \uD56D\uBAA9\uC744 \uD65C\uC131\uD654\uD558\uACE0, \uD0ED \uC804\uD658\uC73C\uB85C \uAD00\uB828\uB41C \uBDF0\uB97C \uBCF4\uC5EC\uC90D\uB2C8\uB2E4.",
  disabled: "\uBE44\uD65C\uC131 \uD0ED\uC740 \uC120\uD0DD\uD560 \uC218 \uC5C6\uC73C\uBA70 \uD0A4\uBCF4\uB4DC \uD0D0\uC0C9\uC5D0\uC11C\uB3C4 \uAC74\uB108\uB701\uB2C8\uB2E4.",
  centered: "centered \uC18D\uC131\uC740 \uC0C1\uB2E8 \uD0ED \uBAA9\uB85D\uC744 \uAC00\uC6B4\uB370 \uC815\uB82C\uD569\uB2C8\uB2E4.",
  icon: "icon \uC18D\uC131\uC740 \uD0ED \uB77C\uBCA8 \uC55E\uC5D0 \uC2E4\uC81C \uC544\uC774\uCF58\uC744 \uD568\uAED8 \uD45C\uC2DC\uD569\uB2C8\uB2E4.",
  size: "size \uC18D\uC131\uC73C\uB85C large, medium, small \uD0ED \uB192\uC774\uC640 \uAC04\uACA9\uC744 \uBE44\uAD50\uD569\uB2C8\uB2E4.",
  placement: "tab-placement \uC18D\uC131\uC73C\uB85C top, bottom, start, end \uBC30\uCE58\uB97C \uAD6C\uC5ED\uBCC4\uB85C \uD655\uC778\uD569\uB2C8\uB2E4.",
  card: "Card \uD0ED\uC740 \uAE30\uBCF8 card, \uD0ED \uB05D + \uCD94\uAC00 \uBC84\uD2BC, \uC0C1\uB2E8 Add \uBC84\uD2BC \uC2DC\uB098\uB9AC\uC624\uB97C \uD568\uAED8 \uBCF4\uC5EC\uC90D\uB2C8\uB2E4."
};

function ensureTabsDefined() {
  defineDsTabs();
}

function createTabs(args: TabsStoryArgs, tabs: TabStoryData[] = defaultTabs) {
  const element = document.createElement("ds-tabs");

  element.setAttribute("active-key", args.activeKey);
  element.setAttribute("size", args.size);
  element.setAttribute("tab-placement", args.tabPlacement);
  element.setAttribute("type", args.type);
  element.toggleAttribute("centered", args.centered);
  element.toggleAttribute("editable", args.editable);
  element.toggleAttribute("hide-add", args.hideAdd);
  element.append(...tabs.map(createTab));

  return element;
}

function createTab(tab: TabStoryData) {
  const element = document.createElement("ds-tab");

  element.setAttribute("item-key", tab.itemKey);
  element.setAttribute("label", tab.label);
  element.textContent = tab.content;

  if (tab.icon) {
    element.setAttribute("icon", tab.icon);
  }

  if (tab.closable === false) {
    element.setAttribute("closable", "false");
  }

  element.toggleAttribute("disabled", Boolean(tab.disabled));

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-tabs-story-frame";
  frame.append(...children);

  return frame;
}

function createScenarioSection(label: string, tabsElement: HTMLElement) {
  const section = document.createElement("section");
  const heading = document.createElement("h3");

  section.className = "ds-tabs-placement-section";
  heading.className = "ds-tabs-placement-section__title";
  heading.textContent = label;
  section.append(heading, tabsElement);

  return section;
}

function addStoryTab(tabsElement: HTMLElement) {
  const nextIndex = tabsElement.querySelectorAll("ds-tab").length + 1;
  const nextKey = `external-tab-${nextIndex}`;

  tabsElement.append(
    createTab({
      content: `Content of Tab Pane ${nextIndex}`,
      itemKey: nextKey,
      label: `Tab ${nextIndex}`
    })
  );
  tabsElement.setAttribute("active-key", nextKey);
}

function createHeaderAddSection() {
  const tabsElement = createTabs(
    {
      ...editableCardArgs,
      hideAdd: true,
    },
    editableTabs
  );
  const section = createScenarioSection("Editable Card - 상단 Add 버튼", tabsElement);
  const toolbar = document.createElement("div");
  const button = document.createElement("button");

  toolbar.className = "ds-tabs-story-toolbar";
  button.className = "ds-tabs-story-add-button";
  button.type = "button";
  button.textContent = "Add";
  button.addEventListener("click", () => addStoryTab(tabsElement));
  toolbar.append(button);
  section.prepend(toolbar);

  return section;
}

function renderDefault(args: TabsStoryArgs) {
  ensureTabsDefined();

  return createFrame([createTabs(args)]);
}

function renderDisabledStory() {
  ensureTabsDefined();

  return createFrame([
    createTabs(defaultArgs, [
      defaultTabs[0],
      { ...defaultTabs[1], disabled: true },
      defaultTabs[2]
    ])
  ]);
}

function renderCenteredStory() {
  ensureTabsDefined();

  return createFrame([createTabs({ ...defaultArgs, centered: true })]);
}

function renderIconStory() {
  ensureTabsDefined();

  return createFrame([
    createTabs(defaultArgs, [
      { ...defaultTabs[0], icon: "apple" },
      { ...defaultTabs[1], icon: "chrome" },
      { ...defaultTabs[2], icon: "bot" }
    ])
  ]);
}

function renderSizeStory() {
  ensureTabsDefined();

  return createFrame([
    createTabs({ ...defaultArgs, size: "large" }),
    createTabs({ ...defaultArgs, size: "medium" }),
    createTabs({ ...defaultArgs, size: "small" })
  ]);
}

function renderPlacementStory() {
  ensureTabsDefined();

  return createFrame([
    createScenarioSection("Top", createTabs({ ...defaultArgs, tabPlacement: "top" })),
    createScenarioSection("Bottom", createTabs({ ...defaultArgs, tabPlacement: "bottom" })),
    createScenarioSection("Start", createTabs({ ...defaultArgs, tabPlacement: "start" })),
    createScenarioSection("End", createTabs({ ...defaultArgs, tabPlacement: "end" }))
  ]);
}

function renderCardStory() {
  ensureTabsDefined();

  return createFrame([
    createScenarioSection("Card", createTabs({ ...defaultArgs, type: "card" })),
    createScenarioSection(
      "Editable Card - 탭 끝 + 버튼",
      createTabs(
        editableCardArgs,
        editableTabs
      )
    ),
    createHeaderAddSection()
  ]);
}

const meta: Meta<TabsStoryArgs> = {
  title: "Components/Navigation/Tabs",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Tabs\uB294 \uAC19\uC740 \uCF58\uD150\uCE20 \uC601\uC5ED \uC548\uC5D0\uC11C \uC5EC\uB7EC \uAD00\uB828 \uBDF0\uB97C \uBE60\uB974\uAC8C \uC804\uD658\uD558\uB294 \uB0B4\uBE44\uAC8C\uC774\uC158 \uCEF4\uD3EC\uB10C\uD2B8\uC785\uB2C8\uB2E4."
      }
    }
  },
  argTypes: {
    activeKey: {
      control: "text"
    },
    centered: {
      control: "boolean"
    },
    editable: {
      control: "boolean"
    },
    hideAdd: {
      control: "boolean"
    },
    size: {
      control: "inline-radio",
      options: ["large", "medium", "small"]
    },
    tabPlacement: {
      control: "inline-radio",
      options: ["top", "bottom", "start", "end"]
    },
    type: {
      control: "inline-radio",
      options: ["line", "card"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<TabsStoryArgs>;

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.basic
      }
    }
  }
};

export const Disabled: Story = {
  render: renderDisabledStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.disabled
      }
    }
  }
};

export const Centered: Story = {
  render: renderCenteredStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.centered
      }
    }
  }
};

export const Icon: Story = {
  render: renderIconStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.icon
      }
    }
  }
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.size
      }
    }
  }
};

export const Placement: Story = {
  render: renderPlacementStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.placement
      }
    }
  }
};

export const CardType: Story = {
  render: renderCardStory,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.card
      }
    }
  }
};
