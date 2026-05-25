import type { ReactNode } from "react";

import type {
  ViewerBooleanControlKey,
  ViewerControlChangeHandler,
  ViewerControlConfig,
  ViewerMaterialPresetChangeHandler,
  MaterialPresetId,
  ViewerMaterialTintChangeHandler,
  ViewerNumberControlChangeHandler,
  ViewerNumberControlKey
} from "../../GraphicIntegrationWorkspace/GraphicIntegrationWorkspace.types";

export type ControlPanelTabId = "config" | "annotation" | "comment";

export type ControlPanelTab = {
  icon: string;
  id: ControlPanelTabId;
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

export type ImplementedNumberControl = {
  type: "number";
  key: ViewerNumberControlKey;
  label: string;
  description: string;
  max: number;
  min: number;
  step: number;
};

export type ImplementedPresetControl = {
  type: "preset";
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
  | ImplementedNumberControl
  | ImplementedPresetControl
  | PendingConfigControl;

export type ConfigControlSection = {
  id: ConfigControlSectionId;
  title: string;
  description: string;
  controls: ConfigControl[];
};

export type ControlPanelTabsProps = {
  onMaterialPresetChange: ViewerMaterialPresetChangeHandler;
  onMaterialTintChange: ViewerMaterialTintChangeHandler;
  onViewerConfigChange: ViewerControlChangeHandler;
  onViewerNumberConfigChange: ViewerNumberControlChangeHandler;
  viewerConfig: ViewerControlConfig;
};

export type ConfigPanelProps = ControlPanelTabsProps;

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

export type SliderControlProps = {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
};

export type MaterialPresetOption = {
  label: string;
  value: MaterialPresetId;
};

export type SelectControlProps = {
  label: string;
  onChange: (value: MaterialPresetId) => void;
  options: MaterialPresetOption[];
  value: MaterialPresetId;
};

export type ControlRowProps = {
  children: ReactNode;
  description: string;
  label: string;
  layout?: "inline" | "stacked";
};
