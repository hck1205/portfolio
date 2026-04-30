import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { iconGroups } from "./catalog/iconCatalog.data";
import { renderIconCatalog } from "./catalog/iconCatalog.render";
import type { IconCatalogArgs } from "./catalog/iconCatalog.types";

const meta: Meta<IconCatalogArgs> = {
  title: "Icons/Lucide",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Lucide icon catalog rendered from the package icon registry."
      }
    }
  },
  args: {
    group: undefined
  },
  argTypes: {
    group: {
      control: "select",
      options: [undefined, ...iconGroups]
    }
  },
  render: renderIconCatalog
};

export default meta;

type Story = StoryObj<IconCatalogArgs>;

export const All: Story = {};

export const A: Story = {
  args: {
    group: "A"
  }
};

export const C: Story = {
  args: {
    group: "C"
  }
};

export const M: Story = {
  args: {
    group: "M"
  }
};

export const S: Story = {
  args: {
    group: "S"
  }
};
