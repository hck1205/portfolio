import type {
  StepsOrientation,
  StepsSize,
  StepsStatus,
  StepsTitlePlacement,
  StepsType,
  StepsVariant
} from "../types/Steps.types";

export type StepsStoryArgs = {
  clickable: boolean;
  current: number;
  orientation: StepsOrientation;
  percent: number;
  progressDot: boolean;
  size: StepsSize;
  status: StepsStatus;
  titlePlacement: StepsTitlePlacement;
  type: StepsType;
  variant: StepsVariant;
};

export type StepStoryData = {
  description?: string;
  disabled?: boolean;
  icon?: string;
  status?: StepsStatus;
  subTitle?: string;
  title: string;
};

export const stepsStoryDescriptions = {
  default: "기본 Steps는 여러 단계의 진행 상태를 순서대로 보여줍니다.",
  error: "status 속성으로 현재 단계의 오류 상태를 강조합니다.",
  vertical: "Vertical Steps는 좁은 영역이나 긴 설명이 있는 흐름에 적합합니다.",
  clickable: "clickable 속성을 사용하면 각 단계를 선택해 현재 위치를 변경할 수 있습니다.",
  panel: "Panel Steps는 단계 자체가 선택 영역인 패널형 진행 내비게이션입니다.",
  icon: "icon 속성으로 각 단계의 인디케이터에 사용자 지정 값을 표시합니다.",
  progress: "percent와 title-placement를 함께 사용해 현재 단계의 진행률을 원형 라인으로 표시합니다.",
  dot: "progress-dot 속성은 숫자 대신 작은 점으로 단계를 간결하게 표시합니다.",
  navigation: "Navigation Steps는 단계 이동 자체가 주요 탐색 흐름일 때 사용합니다.",
  inline: "Inline Steps는 목록 내부에서 객체의 처리 상태를 간결하게 보여줄 때 사용합니다.",
  size: "size 속성으로 기본 크기와 작은 크기를 선택할 수 있습니다."
};

export const defaultStepsStoryArgs = {
  clickable: false,
  current: 1,
  orientation: "horizontal",
  percent: 0,
  progressDot: false,
  size: "medium",
  status: "process",
  titlePlacement: "horizontal",
  type: "default",
  variant: "filled"
} satisfies StepsStoryArgs;

export const defaultSteps = [
  {
    description: "과정 정보를 입력했습니다.",
    title: "Finished"
  },
  {
    description: "승인 정보를 확인하는 중입니다.",
    subTitle: "00:00:08",
    title: "In Progress"
  },
  {
    description: "마지막 확인을 기다리고 있습니다.",
    title: "Waiting"
  }
] satisfies StepStoryData[];

export const panelSteps = [
  {
    description: "This is a content.",
    subTitle: "00:00",
    title: "Step 1"
  },
  {
    description: "This is a content.",
    status: "error",
    title: "Step 2"
  },
  {
    description: "This is a content.",
    title: "Step 3"
  }
] satisfies StepStoryData[];
