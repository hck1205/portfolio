import { controlPanelTabs } from "./ControlPanelTabs.constants";
import styles from "./ControlPanelTabs.module.css";
import { ConfigPanel, PlaceholderPanel } from "./Panels";
import type {
  ControlPanelTabId,
  ControlPanelTabsProps
} from "./ControlPanelTabs.types";

export function ControlPanelTabs({
  onMaterialPresetChange,
  onMaterialTintChange,
  onViewerConfigChange,
  onViewerNumberConfigChange,
  viewerConfig
}: ControlPanelTabsProps) {
  const renderPanel = (tabId: ControlPanelTabId) => {
    if (tabId === "config") {
      return (
        <ConfigPanel
          onMaterialPresetChange={onMaterialPresetChange}
          onMaterialTintChange={onMaterialTintChange}
          onViewerConfigChange={onViewerConfigChange}
          onViewerNumberConfigChange={onViewerNumberConfigChange}
          viewerConfig={viewerConfig}
        />
      );
    }

    return <PlaceholderPanel />;
  };

  return (
    <ds-tabs
      centered=""
      className={styles.tabs}
      default-active-key="config"
      full-width=""
      size="medium"
      type="line"
    >
      {controlPanelTabs.map((tab) => (
        <ds-tab
          icon={tab.icon}
          icon-only=""
          item-key={tab.id}
          key={tab.id}
          label={tab.label}
          tooltip={tab.label}
        >
          {renderPanel(tab.id)}
        </ds-tab>
      ))}
    </ds-tabs>
  );
}
