import { APP_ID } from "../components/LiveApp/LiveApp.const";

export const navigationItems = [
  { id: APP_ID.OVERVIEW, label: "Overview", live: false },
  {
    id: APP_ID.MICRO_FRONTEND,
    label: "Micro Frontend",
    live: false
  },
  { id: APP_ID.AX, label: "AX (AI Transformation)", live: true },
  {
    id: APP_ID.PERFORMANCE_OPTIMIZATION,
    label: "Performance Optimization",
    live: false
  },
  {
    id: APP_ID.DESIGN_SYSTEM,
    label: "Design System",
    live: true
  },
  {
    id: APP_ID.GRAPHICS_INTEGRATION,
    label: "Graphics Integration",
    live: false
  },
  { id: APP_ID.APP, label: "APP", live: false }
] as const;

export type ActiveNav = (typeof navigationItems)[number]["id"];
