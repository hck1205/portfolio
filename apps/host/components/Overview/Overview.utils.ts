import type { OverviewStatusItem } from "./Overview.types";

export function createOverviewItems(): OverviewStatusItem[] {
  return [
    { label: "Host", value: "ready" },
    { label: "Remote apps", value: "partial" },
    { label: "UI package", value: "ready" }
  ];
}
