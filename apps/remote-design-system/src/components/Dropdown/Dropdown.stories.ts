import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Dropdown.stories.css";
import { defineDsDropdown, type DropdownPlacement, type DropdownTrigger } from ".";

type DropdownStoryArgs = {
  arrow: boolean;
  disabled: boolean;
  placement: DropdownPlacement;
  selectable: boolean;
  selectedKey: string;
  trigger: DropdownTrigger;
};

const storyDescriptions = {
  default:
    "기본 Dropdown 예시입니다. trigger를 클릭하면 메뉴가 열리고, 메뉴 항목을 선택하면 `ds-dropdown-select` 이벤트를 발생시킨 뒤 닫힙니다.",
  placement:
    "지원하는 placement를 한 화면에서 비교하는 예시입니다. top, bottom과 좌우 정렬에 따라 popup 위치와 arrow 위치가 함께 바뀝니다.",
  triggerMode:
    "click, hover, context-menu trigger를 비교하는 예시입니다. 터치 환경에서는 hover보다 click trigger 사용을 권장합니다.",
  otherElements:
    "divider, disabled, danger, 보조 라벨 label을 포함한 메뉴 예시입니다.",
  selectable:
    "selectable 메뉴 예시입니다. 선택된 item은 `selected-key`와 동기화되고 menuitemcheckbox semantics를 사용합니다."
};

function ensureDropdownElementsDefined() {
  defineDsDropdown();
}

function createTrigger(label: string) {
  const trigger = document.createElement("button");

  trigger.className = "ds-dropdown-story-trigger";
  trigger.slot = "trigger";
  trigger.type = "button";
  trigger.textContent = label;

  return trigger;
}

function createItem(
  itemKey: string,
  label: string,
  options: {
    danger?: boolean;
    disabled?: boolean;
    shortcut?: string;
    type?: "item" | "divider";
  } = {}
) {
  const item = document.createElement("ds-dropdown-item");

  item.setAttribute("item-key", itemKey);
  item.setAttribute("label", label);

  if (options.danger) {
    item.setAttribute("danger", "true");
  }

  if (options.disabled) {
    item.setAttribute("disabled", "true");
  }

  if (options.shortcut) {
    item.setAttribute("shortcut", options.shortcut);
  }

  if (options.type) {
    item.setAttribute("type", options.type);
  }

  return item;
}

function createMenuItems() {
  return [
    createItem("new", "New file", { shortcut: "⌘N" }),
    createItem("duplicate", "Duplicate", { shortcut: "⌘D" }),
    createItem("divider-1", "", { type: "divider" }),
    createItem("archive", "Archive"),
    createItem("delete", "Delete", { danger: true })
  ];
}

function createDropdown(args: DropdownStoryArgs, label = "Actions") {
  const dropdown = document.createElement("ds-dropdown");

  dropdown.setAttribute("placement", args.placement);
  dropdown.setAttribute("trigger", args.trigger);
  dropdown.toggleAttribute("arrow", args.arrow);
  dropdown.toggleAttribute("disabled", args.disabled);
  dropdown.toggleAttribute("selectable", args.selectable);

  if (args.selectedKey) {
    dropdown.setAttribute("selected-key", args.selectedKey);
  }

  dropdown.append(createTrigger(label), ...createMenuItems());

  return dropdown;
}

function renderDefault(args: DropdownStoryArgs) {
  ensureDropdownElementsDefined();

  const frame = document.createElement("div");
  frame.className = "ds-dropdown-story-frame";
  frame.append(createDropdown(args));

  return frame;
}

function renderPlacement(args: DropdownStoryArgs) {
  ensureDropdownElementsDefined();

  const frame = document.createElement("div");
  const placements: DropdownPlacement[] = ["bottom-left", "bottom", "bottom-right", "top-left", "top", "top-right"];

  frame.className = "ds-dropdown-story-placement-grid";

  for (const placement of placements) {
    frame.append(
      createDropdown(
        {
          ...args,
          arrow: true,
          placement
        },
        placement
      )
    );
  }

  return frame;
}

function renderTriggerMode(args: DropdownStoryArgs) {
  ensureDropdownElementsDefined();

  const frame = document.createElement("div");
  const triggers: DropdownTrigger[] = ["click", "hover", "context-menu"];

  frame.className = "ds-dropdown-story-frame";

  for (const trigger of triggers) {
    frame.append(
      createDropdown(
        {
          ...args,
          trigger
        },
        trigger === "context-menu" ? "Right click" : trigger
      )
    );
  }

  return frame;
}

function renderOtherElements(args: DropdownStoryArgs) {
  ensureDropdownElementsDefined();

  const frame = document.createElement("div");
  const dropdown = createDropdown(args, "More");

  dropdown.replaceChildren(
    createTrigger("More"),
    createItem("profile", "Profile"),
    createItem("billing", "Billing", { disabled: true }),
    createItem("divider-1", "", { type: "divider" }),
    createItem("settings", "Settings", { shortcut: "Admin" }),
    createItem("remove", "Remove workspace", { danger: true })
  );
  frame.className = "ds-dropdown-story-frame";
  frame.append(dropdown);

  return frame;
}

function renderSelectable(args: DropdownStoryArgs) {
  return renderDefault({
    ...args,
    selectable: true,
    selectedKey: args.selectedKey || "duplicate"
  });
}

const meta: Meta<DropdownStoryArgs> = {
  title: "Components/Navigation/Dropdown",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Dropdown은 trigger 주변에 선택 가능한 메뉴를 표시하는 Web Component입니다. 메뉴가 많거나 보조 액션을 접어두고 싶을 때 사용하며, click, hover, context-menu trigger와 여러 placement를 지원합니다."
      }
    }
  },
  argTypes: {
    placement: {
      control: "select",
      options: ["bottom-left", "bottom", "bottom-right", "top-left", "top", "top-right"]
    },
    selectedKey: {
      control: "select",
      options: ["", "new", "duplicate", "archive", "delete"]
    },
    trigger: {
      control: "inline-radio",
      options: ["click", "hover", "context-menu"]
    }
  },
  args: {
    arrow: false,
    disabled: false,
    placement: "bottom-left",
    selectable: false,
    selectedKey: "",
    trigger: "click"
  },
  render: renderDefault
};

export default meta;

type Story = StoryObj<DropdownStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.default
      }
    }
  }
};

export const Placement: Story = {
  render: renderPlacement,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.placement
      }
    }
  }
};

export const TriggerMode: Story = {
  render: renderTriggerMode,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.triggerMode
      }
    }
  }
};

export const OtherElements: Story = {
  render: renderOtherElements,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.otherElements
      }
    }
  }
};

export const Selectable: Story = {
  render: renderSelectable,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.selectable
      }
    }
  }
};
