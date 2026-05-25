import type {
  ViewerMaterialPresetChangeHandler,
  ViewerMaterialTintChangeHandler,
  ViewerControlChangeHandler,
  ViewerControlConfig,
  ViewerNumberControlChangeHandler
} from "../GraphicIntegrationWorkspace/GraphicIntegrationWorkspace.types";

export type ControlPanelProps = {
  collapsed: boolean;
  onMaterialPresetChange: ViewerMaterialPresetChangeHandler;
  onMaterialTintChange: ViewerMaterialTintChangeHandler;
  onViewerConfigChange: ViewerControlChangeHandler;
  onViewerNumberConfigChange: ViewerNumberControlChangeHandler;
  viewerConfig: ViewerControlConfig;
};
