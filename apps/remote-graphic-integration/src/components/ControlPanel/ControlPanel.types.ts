import type {
  AnnotationSaveEntry,
  ViewerMaterialPresetChangeHandler,
  ViewerMaterialTintChangeHandler,
  ViewerControlChangeHandler,
  ViewerControlConfig,
  ViewerNumberControlChangeHandler,
  ViewerOptionControlChangeHandler
} from "../GraphicIntegrationWorkspace/GraphicIntegrationWorkspace.types";
import type { ControlPanelTabId } from "./ControlPanelTabs/ControlPanelTabs.types";

export type ControlPanelProps = {
  activeTabId: ControlPanelTabId;
  annotationSaves: AnnotationSaveEntry[];
  collapsed: boolean;
  onActiveTabChange: (tabId: ControlPanelTabId) => void;
  onAnnotationSaveDelete: (saveId: string) => void;
  onMaterialPresetChange: ViewerMaterialPresetChangeHandler;
  onMaterialTintChange: ViewerMaterialTintChangeHandler;
  onAnnotationSaveSelect: (save: AnnotationSaveEntry) => void;
  onViewerConfigChange: ViewerControlChangeHandler;
  onViewerNumberConfigChange: ViewerNumberControlChangeHandler;
  onViewerOptionConfigChange: ViewerOptionControlChangeHandler;
  onViewerScreenshot: () => void;
  viewerConfig: ViewerControlConfig;
};
