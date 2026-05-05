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
    group: undefined,
    search: ""
  },
  argTypes: {
    group: {
      control: "select",
      options: [undefined, ...iconGroups]
    },
    search: {
      control: "text"
    }
  },
  render: renderIconCatalog
};

export default meta;

type Story = StoryObj<IconCatalogArgs>;

function createAlphabetStory(group: string): Story {
  return {
    args: {
      group
    }
  };
}

export const All: Story = {};

export const A: Story = createAlphabetStory("A");
export const B: Story = createAlphabetStory("B");
export const C: Story = createAlphabetStory("C");
export const D: Story = createAlphabetStory("D");
export const E: Story = createAlphabetStory("E");
export const F: Story = createAlphabetStory("F");
export const G: Story = createAlphabetStory("G");
export const H: Story = createAlphabetStory("H");
export const I: Story = createAlphabetStory("I");
export const J: Story = createAlphabetStory("J");
export const K: Story = createAlphabetStory("K");
export const L: Story = createAlphabetStory("L");
export const M: Story = createAlphabetStory("M");
export const N: Story = createAlphabetStory("N");
export const O: Story = createAlphabetStory("O");
export const P: Story = createAlphabetStory("P");
export const Q: Story = createAlphabetStory("Q");
export const R: Story = createAlphabetStory("R");
export const S: Story = createAlphabetStory("S");
export const T: Story = createAlphabetStory("T");
export const U: Story = createAlphabetStory("U");
export const V: Story = createAlphabetStory("V");
export const W: Story = createAlphabetStory("W");
export const X: Story = createAlphabetStory("X");
export const Y: Story = createAlphabetStory("Y");
export const Z: Story = createAlphabetStory("Z");
