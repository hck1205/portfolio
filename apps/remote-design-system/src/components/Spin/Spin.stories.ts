import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Spin.stories.css";
import {
  SPIN_COMPONENT_DESCRIPTION,
  SPIN_DEFAULT_ARGS,
  SPIN_SIZE_OPTIONS,
  SPIN_STORY_DESCRIPTIONS
} from "./stories/Spin.stories.constants";
import { createDocsDescription } from "./stories/Spin.stories.helpers";
import {
  renderCustomSemanticDomStyling,
  renderCustomSpinningIndicator,
  renderDefault,
  renderDelay,
  renderEmbeddedMode,
  renderFullscreen,
  renderProgress,
  renderSizes,
  renderTip
} from "./stories/Spin.stories.renderers";
import type { SpinStoryArgs } from "./stories/Spin.stories.types";

const meta: Meta<SpinStoryArgs> = {
  title: "Components/Feedback/Spin",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: SPIN_COMPONENT_DESCRIPTION
      }
    }
  },
  argTypes: {
    size: { control: "inline-radio", options: SPIN_SIZE_OPTIONS }
  },
  args: SPIN_DEFAULT_ARGS,
  render: renderDefault
};

export default meta;

type Story = StoryObj<SpinStoryArgs>;

export const Default: Story = { parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.default) };
export const Sizes: Story = { render: renderSizes, parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.sizes) };
export const EmbeddedMode: Story = {
  render: renderEmbeddedMode,
  parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.embeddedMode)
};
export const Tip: Story = { render: renderTip, parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.tip) };
export const Delay: Story = { render: renderDelay, parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.delay) };
export const CustomSpinningIndicator: Story = {
  render: renderCustomSpinningIndicator,
  parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.customSpinningIndicator)
};
export const Progress: Story = {
  render: renderProgress,
  parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.progress)
};
export const CustomSemanticDomStyling: Story = {
  render: renderCustomSemanticDomStyling,
  parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.customSemanticDomStyling)
};
export const Fullscreen: Story = {
  render: renderFullscreen,
  parameters: createDocsDescription(SPIN_STORY_DESCRIPTIONS.fullscreen)
};
