import type {
  ViewerMaterialPresetChangeHandler,
  ViewerMaterialTintChangeHandler,
  ViewerControlChangeHandler,
  ViewerControlConfig,
  ViewerNumberControlChangeHandler,
  ViewerOptionControlChangeHandler
} from "../GraphicIntegrationWorkspace/GraphicIntegrationWorkspace.types";

export type ControlPanelProps = {
  collapsed: boolean;
  onMaterialPresetChange: ViewerMaterialPresetChangeHandler;
  onMaterialTintChange: ViewerMaterialTintChangeHandler;
  onViewerConfigChange: ViewerControlChangeHandler;
  onViewerNumberConfigChange: ViewerNumberControlChangeHandler;
  onViewerOptionConfigChange: ViewerOptionControlChangeHandler;
  onViewerScreenshot: () => void;
  viewerConfig: ViewerControlConfig;
};
