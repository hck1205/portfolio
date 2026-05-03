import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./Calendar.stories.css";
import { defineDsCalendar, type CalendarMode, type CalendarNotice } from ".";
import { CALENDAR_SELECT_EVENT } from "./constants/Calendar.constants";

type CalendarStoryArgs = {
  defaultValue: string;
  fullscreen: boolean;
  mode: CalendarMode;
  notices: string;
  showWeek: boolean;
  value: string;
};

const defaultArgs = {
  defaultValue: "",
  fullscreen: true,
  mode: "month",
  notices: "",
  showWeek: false,
  value: ""
} satisfies CalendarStoryArgs;

const noticeCalendarData = [
  { date: "2026-04-08", type: "warning", content: "확인이 필요한 일정입니다." },
  { date: "2026-04-08", type: "success", content: "완료된 일정입니다." },
  { date: "2026-04-10", type: "warning", content: "검토 예정 일정입니다." },
  { date: "2026-04-10", type: "success", content: "정상 진행 일정입니다." },
  { date: "2026-04-10", type: "error", content: "지연된 일정입니다." },
  { date: "2026-04-15", type: "warning", content: "릴리즈 체크" },
  { date: "2026-04-15", type: "success", content: "긴 일정명도 한 줄로 말줄임 처리됩니다." },
  { date: "2026-04-15", type: "error", content: "장애 대응 1차" },
  { date: "2026-04-15", type: "error", content: "장애 대응 2차" },
  { date: "2026-04-15", type: "error", content: "장애 대응 3차" },
  { date: "2026-04-15", type: "error", content: "장애 대응 4차" },
  { month: "2026-09", count: 1394, label: "누적 백로그" }
] satisfies CalendarNotice[];

const storyDescriptions = {
  basic: "날짜 형태의 데이터를 월 단위 패널로 표시하는 기본 Calendar 예시입니다.",
  card: "제한된 영역 안에서 사용하는 카드형 Calendar 예시입니다. 연도와 월은 드롭다운으로, 패널 모드는 라디오형 버튼으로 전환합니다.",
  notice: "날짜 셀에는 이벤트 목록을, 월 셀에는 집계 정보를 표시하는 Notice Calendar 예시입니다.",
  selectable: "날짜를 선택하면 선택한 날짜 문구와 value가 함께 갱신되는 선택형 Calendar 예시입니다.",
  showWeek: "show-week 속성으로 주차 정보를 함께 표시하는 Calendar 예시입니다.",
  year: "월 단위 패널에서 월을 선택할 수 있는 Calendar 예시입니다."
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
  syncOptionalAttribute(calendar, "notices", mergedArgs.notices);
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

function renderSelectableStory(args: CalendarStoryArgs) {
  ensureCalendarDefined();

  const selectedValue = args.defaultValue || args.value || "2026-03-25";
  const selectedDate = document.createElement("p");
  const calendar = createCalendar({ ...args, defaultValue: selectedValue, fullscreen: false });

  selectedDate.className = "ds-calendar-story-selection";
  selectedDate.textContent = `선택한 날짜: ${selectedValue}`;
  calendar.addEventListener(CALENDAR_SELECT_EVENT, (event) => {
    const { value } = (event as CustomEvent<{ value: string }>).detail;

    selectedDate.textContent = `선택한 날짜: ${value}`;
  });

  return createFrame([selectedDate, calendar], true);
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
          "Calendar는 일정, 날짜별 데이터, 가격표처럼 날짜 형태의 정보를 월 또는 연 단위로 보여주는 Data Display 컴포넌트입니다. Ant Design의 기본, 카드형, 주차 표시, 선택형, Notice Calendar 패턴을 Web Component API로 제공합니다."
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

export const NoticeCalendar: Story = {
  args: {
    defaultValue: "2026-04-08",
    notices: JSON.stringify(noticeCalendarData)
  },
  parameters: createDocsDescription(storyDescriptions.notice)
};

export const Selectable: Story = {
  args: { defaultValue: "2026-03-25" },
  render: renderSelectableStory,
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
