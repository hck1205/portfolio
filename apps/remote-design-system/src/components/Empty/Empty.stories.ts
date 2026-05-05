import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Empty.stories.css";
import { defineDsEmpty } from ".";
import { renderComponentEmptyStates } from "./stories/Empty.componentStates";
import {
  defaultEmptyStoryArgs,
  emptyComponentDescription,
  emptySizeOptions,
  emptyStoryDescriptions
} from "./stories/Empty.storyData";
import { createDocsDescription, createEmpty, createFrame, createGrid, createPanel } from "./stories/Empty.storyDom";
import type { EmptyStoryArgs } from "./stories/Empty.storyTypes";

function renderDefault(args: EmptyStoryArgs) {
  defineDsEmpty();

  return createFrame([createEmpty(args)]);
}

function renderSimple() {
  defineDsEmpty();

  return createFrame([
    createGrid([
      createPanel(createEmpty({ ...defaultEmptyStoryArgs, image: "simple", size: "small" })),
      createPanel(createEmpty({ ...defaultEmptyStoryArgs, description: "데이터를 찾을 수 없습니다", image: "simple", size: "small" }))
    ])
  ]);
}

function renderCustomize() {
  defineDsEmpty();

  return createFrame([
    createEmpty(
      {
        description: "중요한 지표를 추적하려면 첫 대시보드를 만들어 보세요.",
        image: "default",
        size: "middle"
      },
      "Create Now"
    )
  ]);
}

const meta: Meta<EmptyStoryArgs> = {
  title: "Components/Data Display/Empty",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: emptyComponentDescription
      }
    }
  },
  argTypes: {
    description: { control: "text" },
    image: { control: "text" },
    size: {
      control: "inline-radio",
      options: emptySizeOptions
    }
  },
  args: defaultEmptyStoryArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<EmptyStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(emptyStoryDescriptions.default)
};

export const SimpleImage: Story = {
  render: renderSimple,
  parameters: createDocsDescription(emptyStoryDescriptions.simple)
};

export const Customize: Story = {
  render: renderCustomize,
  parameters: createDocsDescription(emptyStoryDescriptions.customize)
};

export const ComponentEmptyStates: Story = {
  name: "Component Empty States",
  render: renderComponentEmptyStates,
  parameters: createDocsDescription(emptyStoryDescriptions.components)
};

export const NoDescription: Story = {
  args: {
    description: "false",
    image: "simple"
  },
  parameters: createDocsDescription(emptyStoryDescriptions.noDescription)
};
