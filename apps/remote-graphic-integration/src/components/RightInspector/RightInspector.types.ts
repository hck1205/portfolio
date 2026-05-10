import type {
  ViewerMaterialTintChangeHandler,
  ViewerControlChangeHandler,
  ViewerControlConfig
} from "../GraphicIntegrationWorkspace/GraphicIntegrationWorkspace.types";

export type RightInspectorProps = {
  collapsed: boolean;
  onMaterialTintChange: ViewerMaterialTintChangeHandler;
  onViewerConfigChange: ViewerControlChangeHandler;
  viewerConfig: ViewerControlConfig;
};
