import type { NavigationItem, NavigationStatus } from "../../../lib/navigation";

export type NavigationStatusEntry = readonly [
  NavigationItem["id"],
  NavigationStatus
];

export type NavigationStatusById = Partial<
  Record<NavigationItem["id"], NavigationStatus>
>;
