export const APP_ID = {
  APP: "app",
  AX: "ax",
  DESIGN_SYSTEM: "design-system",
  GRAPHICS_INTEGRATION: "graphics-integration",
  MICRO_FRONTEND: "micro-frontend",
  OVERVIEW: "overview",
  PERFORMANCE_OPTIMIZATION: "performance-optimization"
} as const;

export type AppId = (typeof APP_ID)[keyof typeof APP_ID];
