import { APP_ID } from "../../../LiveApp/LiveApp.const";
import type { ActiveNav } from "../../../../lib/navigation";

export const navigationIcons = {
  [APP_ID.APP]: "monitor-smartphone",
  [APP_ID.AX]: "sparkles",
  [APP_ID.DESIGN_SYSTEM]: "component",
  [APP_ID.GRAPHICS_INTEGRATION]: "box",
  [APP_ID.MICRO_FRONTEND]: "panels-top-left",
  [APP_ID.OVERVIEW]: "home",
  [APP_ID.PERFORMANCE_OPTIMIZATION]: "gauge"
} satisfies Record<ActiveNav, string>;
