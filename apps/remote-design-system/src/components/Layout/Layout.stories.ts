import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { defineDsButton } from "../Button";
import { defineDsLayout } from ".";
import { defaultLayoutArgs, storyDescriptions } from "./stories/Layout.storyData";
import {
  renderApplication,
  renderCustomTrigger,
  renderHeaderContentFooter,
  renderHeaderContentRightSiderFooter,
  renderHeaderLeftSiderContentFooter,
  renderLeftSiderHeaderContentFooter,
  renderResponsive,
  renderScrollableSider,
  renderSiderContent
} from "./stories/Layout.storyLayouts";
import type { LayoutStoryArgs } from "./stories/Layout.storyTypes";

function ensureLayoutDefined() {
  defineDsButton();
  defineDsLayout();
}

function renderWithDefinitions(renderer: (args: LayoutStoryArgs) => HTMLElement) {
  return (args: LayoutStoryArgs) => {
    ensureLayoutDefined();

    return renderer(args);
  };
}

function renderResponsiveWithDefinitions() {
  ensureLayoutDefined();

  return renderResponsive();
}

const meta: Meta<LayoutStoryArgs> = {
  title: "Components/Layout/Layout",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Layout은 Header, Sider, Content, Footer를 조합하는 애플리케이션 셸입니다. Header nav와 Sider menu는 active/inactive 상태를 표현하고 선택 상태에 따라 Content를 갱신합니다."
      }
    }
  },
  argTypes: {
    breakpoint: {
      control: "select",
      options: [undefined, "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"]
    },
    theme: {
      control: "inline-radio",
      options: ["dark", "light"]
    }
  },
  args: defaultLayoutArgs,
  render: renderWithDefinitions(renderApplication)
};

export default meta;

type Story = StoryObj<LayoutStoryArgs>;

export const ApplicationShell: Story = {
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.application
      }
    }
  }
};

export const HeaderContentFooter: Story = {
  render: renderWithDefinitions(renderHeaderContentFooter),
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.headerContentFooter
      }
    }
  }
};

export const HeaderLeftSiderContentFooter: Story = {
  render: renderWithDefinitions(renderHeaderLeftSiderContentFooter),
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.headerLeftSiderContentFooter
      }
    }
  }
};

export const HeaderContentRightSiderFooter: Story = {
  render: renderWithDefinitions(renderHeaderContentRightSiderFooter),
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.headerContentRightSiderFooter
      }
    }
  }
};

export const SiderContent: Story = {
  render: renderWithDefinitions(renderSiderContent),
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.siderContent
      }
    }
  }
};

export const LeftSiderHeaderContentFooter: Story = {
  render: renderWithDefinitions(renderLeftSiderHeaderContentFooter),
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.leftSiderHeaderContentFooter
      }
    }
  }
};

export const Responsive: Story = {
  render: renderResponsiveWithDefinitions,
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.responsive
      }
    }
  }
};

export const ScrollableSider: Story = {
  render: renderWithDefinitions(renderScrollableSider),
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.scrollableSider
      }
    }
  }
};

export const CustomTriggerIcon: Story = {
  render: renderWithDefinitions(renderCustomTrigger),
  parameters: {
    docs: {
      description: {
        story: storyDescriptions.customTriggerIcon
      }
    }
  }
};
