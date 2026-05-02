import type { Meta, StoryObj } from "@storybook/web-components-vite";

import { defineDsSteps } from ".";
import {
  defaultSteps,
  defaultStepsStoryArgs,
  panelSteps,
  stepsStoryDescriptions,
  type StepsStoryArgs,
  type StepStoryData
} from "./stories/Steps.storyData";

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
}

function attachMockTimer(frame: HTMLElement, stepsElement: HTMLElement, stepIndex = 1, startSeconds = 8) {
  const step = stepsElement.children.item(stepIndex);

  if (!(step instanceof HTMLElement)) {
    return frame;
  }

  let elapsedSeconds = startSeconds;
  step.setAttribute("sub-title", formatSeconds(elapsedSeconds));

  const timerId = window.setInterval(() => {
    elapsedSeconds += 1;
    step.setAttribute("sub-title", formatSeconds(elapsedSeconds));
  }, 1000);
  const observer = new MutationObserver(() => {
    if (!document.body.contains(frame)) {
      window.clearInterval(timerId);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return frame;
}

function ensureStepsDefined() {
  defineDsSteps();
}

function createSteps(args: StepsStoryArgs, steps: StepStoryData[] = defaultSteps) {
  const element = document.createElement("ds-steps");

  element.setAttribute("current", String(args.current));
  element.setAttribute("orientation", args.orientation);
  element.setAttribute("percent", String(args.percent));
  element.setAttribute("size", args.size);
  element.setAttribute("status", args.status);
  element.setAttribute("title-placement", args.titlePlacement);
  element.setAttribute("type", args.type);
  element.setAttribute("variant", args.variant);
  element.toggleAttribute("clickable", args.clickable);
  element.toggleAttribute("progress-dot", args.progressDot);
  element.append(...steps.map(createStep));

  return element;
}

function createStep(step: StepStoryData) {
  const element = document.createElement("ds-step");

  element.setAttribute("title", step.title);

  if (step.description) {
    element.setAttribute("description", step.description);
  }

  if (step.subTitle) {
    element.setAttribute("sub-title", step.subTitle);
  }

  if (step.status) {
    element.setAttribute("status", step.status);
  }

  if (step.icon) {
    element.setAttribute("icon", step.icon);
  }

  element.toggleAttribute("disabled", Boolean(step.disabled));

  return element;
}

function createFrame(children: HTMLElement[]) {
  const frame = document.createElement("div");

  frame.className = "ds-steps-story-frame";
  frame.append(...children);

  return frame;
}

function renderDefault(args: StepsStoryArgs) {
  ensureStepsDefined();

  const stepsElement = createSteps(args);

  return attachMockTimer(createFrame([stepsElement]), stepsElement);
}

function renderErrorStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps({
      ...defaultStepsStoryArgs,
      current: 1,
      status: "error"
    })
  ]);
}

function renderVerticalStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps({
      ...defaultStepsStoryArgs,
      orientation: "vertical"
    })
  ]);
}

function renderClickableStory() {
  ensureStepsDefined();
  const stepsElement = createSteps({
    ...defaultStepsStoryArgs,
    clickable: true
  });

  return attachMockTimer(createFrame([stepsElement]), stepsElement);
}

function renderPanelStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps(
      {
        ...defaultStepsStoryArgs,
        clickable: true,
        current: 0,
        type: "panel"
      },
      panelSteps
    ),
    createSteps(
      {
        ...defaultStepsStoryArgs,
        clickable: true,
        current: 0,
        size: "small",
        type: "panel",
        variant: "outlined"
      },
      panelSteps
    )
  ]);
}

function renderIconStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps(defaultStepsStoryArgs, [
      { description: "Login account information.", icon: "L", title: "Login" },
      { description: "Verify the security code.", icon: "V", title: "Verification" },
      { description: "Confirm payment details.", icon: "P", title: "Pay" },
      { description: "Complete the task.", icon: "D", title: "Done" }
    ])
  ]);
}

function renderProgressStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps({
      ...defaultStepsStoryArgs,
      percent: 60,
      titlePlacement: "vertical"
    })
  ]);
}

function renderDotStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps({
      ...defaultStepsStoryArgs,
      progressDot: true,
      titlePlacement: "vertical"
    })
  ]);
}

function renderNavigationStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps({
      ...defaultStepsStoryArgs,
      clickable: true,
      type: "navigation"
    })
  ]);
}

function renderInlineStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps(
      {
        ...defaultStepsStoryArgs,
        type: "inline"
      },
      [
        { title: "finish 1" },
        { title: "finish 2" },
        { title: "current" },
        { title: "waiting" }
      ]
    )
  ]);
}

function renderSizeStory() {
  ensureStepsDefined();

  return createFrame([
    createSteps({ ...defaultStepsStoryArgs, size: "medium" }),
    createSteps({ ...defaultStepsStoryArgs, size: "small" })
  ]);
}

const meta: Meta<StepsStoryArgs> = {
  title: "Components/Navigation/Steps",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Steps는 여러 단계로 나뉜 작업의 현재 진행 위치와 각 단계 상태를 안내하는 내비게이션 컴포넌트입니다."
      }
    }
  },
  argTypes: {
    current: {
      control: { min: 0, type: "number" }
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    percent: {
      control: { max: 100, min: 0, type: "range" }
    },
    size: {
      control: "inline-radio",
      options: ["medium", "small"]
    },
    status: {
      control: "inline-radio",
      options: ["wait", "process", "finish", "error"]
    },
    titlePlacement: {
      control: "inline-radio",
      options: ["horizontal", "vertical"]
    },
    type: {
      control: "select",
      options: ["default", "dot", "inline", "navigation", "panel"]
    },
    variant: {
      control: "inline-radio",
      options: ["filled", "outlined"]
    }
  },
  args: defaultStepsStoryArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<StepsStoryArgs>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.default
      }
    }
  }
};

export const ErrorStatus: Story = {
  render: renderErrorStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.error
      }
    }
  }
};

export const Vertical: Story = {
  render: renderVerticalStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.vertical
      }
    }
  }
};

export const Clickable: Story = {
  render: renderClickableStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.clickable
      }
    }
  }
};

export const Panel: Story = {
  render: renderPanelStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.panel
      }
    }
  }
};

export const WithIcon: Story = {
  render: renderIconStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.icon
      }
    }
  }
};

export const TitlePlacementAndProgress: Story = {
  render: renderProgressStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.progress
      }
    }
  }
};

export const DotStyle: Story = {
  render: renderDotStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.dot
      }
    }
  }
};

export const Navigation: Story = {
  render: renderNavigationStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.navigation
      }
    }
  }
};

export const Inline: Story = {
  render: renderInlineStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.inline
      }
    }
  }
};

export const Size: Story = {
  render: renderSizeStory,
  parameters: {
    docs: {
      description: {
        story: stepsStoryDescriptions.size
      }
    }
  }
};
