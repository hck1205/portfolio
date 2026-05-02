import type { StepItemData, StepsStatus } from "../types/Steps.types";

type ResolveStepStatusOptions = {
  current: number;
  index: number;
  rootStatus: StepsStatus;
  stepStatus?: StepsStatus;
};

export function resolveStepStatus({ current, index, rootStatus, stepStatus }: ResolveStepStatusOptions): StepsStatus {
  if (stepStatus) {
    return stepStatus;
  }

  if (index < current) {
    return "finish";
  }

  if (index === current) {
    return rootStatus;
  }

  return "wait";
}

export function clampCurrent(current: number, items: StepItemData[]) {
  if (items.length === 0) {
    return 0;
  }

  return Math.min(Math.max(current, 0), items.length - 1);
}
