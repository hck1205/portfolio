import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Calendar.stories.css";
import { defineDsCalendar, type CalendarMode } from ".";

type CalendarStoryArgs = {
  defaultValue: string;
  fullscreen: boolean;
  mode: CalendarMode;
  showWeek: boolean;
  value: string;
};

const defaultArgs = {
  defaultValue: "",
  fullscreen: true,
  mode: "month",
  showWeek: false,
  value: ""
} satisfies CalendarStoryArgs;

const storyDescriptions = {
  basic: "Calendar는 날짜 형태의 데이터를 월 또는 연 단위 패널로 표시합니다.",
  card: "fullscreen=false에서는 제한된 영역에 들어가는 card calendar로 표시됩니다.",
  selectable: "날짜를 선택하면 value 변경 이벤트와 select 이벤트를 발생시킵니다.",
  showWeek: "show-week 속성으로 주차를 함께 표시합니다.",
  year: "year 모드에서는 월 선택 패널을 제공합니다."
};

function ensureCalendarDefined() {
  defineDsCalendar();
}

function createCalendar(args: Partial<CalendarStoryArgs> = {}) {
  const mergedArgs = { ...defaultArgs, ...args };
  const calendar = document.createElement("ds-calendar");

  calendar.setAttribute("fullscreen", String(mergedArgs.fullscreen));
  calendar.setAttribute("mode", mergedArgs.mode);
  calendar.setAttribute("show-week", String(mergedArgs.showWeek));
  syncOptionalAttribute(calendar, "default-value", mergedArgs.defaultValue);
  syncOptionalAttribute(calendar, "value", mergedArgs.value);

  return calendar;
}

function createFrame(children: HTMLElement[], card = false) {
  const frame = document.createElement("div");

  frame.className = card ? "ds-calendar-story-frame ds-calendar-story-card" : "ds-calendar-story-frame";
  frame.append(...children);

  return frame;
}

function createDocsDescription(story: string) {
  return {
    docs: {
      description: {
        story
      }
    }
  };
}

function renderDefault(args: CalendarStoryArgs) {
  ensureCalendarDefined();

  return createFrame([createCalendar(args)]);
}

function renderCardStory() {
  ensureCalendarDefined();

  return createFrame([createCalendar({ fullscreen: false })], true);
}

function syncOptionalAttribute(element: HTMLElement, name: string, value: string) {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
}

const meta: Meta<CalendarStoryArgs> = {
  title: "Components/Data Display/Calendar",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Calendar는 일정, 날짜별 데이터, 가격표처럼 날짜 형태의 정보를 월/연 단위로 보여주는 Data Display 컴포넌트입니다. Ant Design의 month/year 전환, card calendar, show week, selectable calendar 패턴을 Web Component API로 제공합니다."
      }
    }
  },
  argTypes: {
    mode: {
      control: "inline-radio",
      options: ["month", "year"]
    }
  },
  args: defaultArgs,
  render: renderDefault
};

export default meta;

type Story = StoryObj<CalendarStoryArgs>;

export const Default: Story = {
  parameters: createDocsDescription(storyDescriptions.basic)
};

export const Card: Story = {
  render: renderCardStory,
  parameters: createDocsDescription(storyDescriptions.card)
};

export const Selectable: Story = {
  args: { defaultValue: "2026-03-25" },
  parameters: createDocsDescription(storyDescriptions.selectable)
};

export const ShowWeek: Story = {
  args: { showWeek: true },
  parameters: createDocsDescription(storyDescriptions.showWeek)
};

export const Year: Story = {
  args: { mode: "year" },
  parameters: createDocsDescription(storyDescriptions.year)
};
