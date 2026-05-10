import { APP_ID, type AppId } from "../components/LiveApp/LiveApp.const";
import {
  axRemoteEntryUrl,
  designSystemUrl,
  graphicIntegrationRemoteUrl
} from "./urls";

export type NavigationStatus = "active" | "inactive" | "unknown";

export type NavigationItem = {
  id: AppId;
  label: string;
  live: boolean;
  status: NavigationStatus;
  statusCheckUrl?: string;
};

export const navigationItems: NavigationItem[] = [
  { id: APP_ID.OVERVIEW, label: "Overview", live: false, status: "active" },
  {
    id: APP_ID.MICRO_FRONTEND,
    label: "Micro Frontend",
    live: false,
    status: "inactive"
  },
  {
    id: APP_ID.AX,
    label: "AX (AI Transformation)",
    live: false,
    status: "unknown",
    statusCheckUrl: axRemoteEntryUrl
  },
  {
    id: APP_ID.PERFORMANCE_OPTIMIZATION,
    label: "Performance Optimization",
    live: false,
    status: "inactive"
  },
  {
    id: APP_ID.DESIGN_SYSTEM,
    label: "Design System",
    live: false,
    status: "unknown",
    statusCheckUrl: designSystemUrl
  },
  {
    id: APP_ID.GRAPHICS_INTEGRATION,
    label: "Graphics Integration",
    live: false,
    status: "unknown",
    statusCheckUrl: graphicIntegrationRemoteUrl
  },
  { id: APP_ID.APP, label: "APP", live: false, status: "inactive" }
];

export type ActiveNav = NavigationItem["id"];
