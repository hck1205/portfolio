import type { ReactNode } from "react";

import type {
  ViewerBooleanControlKey,
  ViewerControlChangeHandler,
  ViewerControlConfig,
  ViewerMaterialTintChangeHandler
} from "../../GraphicIntegrationWorkspace/GraphicIntegrationWorkspace.types";

export type InspectorTabId = "config" | "annotation" | "comment";

export type InspectorTab = {
  icon: string;
  id: InspectorTabId;
  label: string;
};

export type ConfigControlSectionId =
  | "material"
  | "texture"
  | "lighting"
  | "display"
  | "interaction";

export type ImplementedBooleanControl = {
  type: "boolean";
  key: ViewerBooleanControlKey;
  label: string;
  description: string;
};

export type ImplementedColorControl = {
  type: "color";
  label: string;
  description: string;
};

export type PendingConfigControl = {
  type: "pending";
  label: string;
  description: string;
};

export type ConfigControl =
  | ImplementedBooleanControl
  | ImplementedColorControl
  | PendingConfigControl;

export type ConfigControlSection = {
  id: ConfigControlSectionId;
  title: string;
  description: string;
  controls: ConfigControl[];
};

export type InspectorTabsProps = {
  onMaterialTintChange: ViewerMaterialTintChangeHandler;
  onViewerConfigChange: ViewerControlChangeHandler;
  viewerConfig: ViewerControlConfig;
};

export type ConfigPanelProps = InspectorTabsProps;

export type SwitchControlProps = {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export type ColorControlProps = {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
};

export type ControlRowProps = {
  children: ReactNode;
  description: string;
  label: string;
};
