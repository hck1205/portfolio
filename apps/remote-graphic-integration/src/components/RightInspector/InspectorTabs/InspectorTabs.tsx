import { inspectorTabs } from "./InspectorTabs.constants";
import styles from "./InspectorTabs.module.css";
import { ConfigPanel, PlaceholderPanel } from "./Panels";
import type { InspectorTabId, InspectorTabsProps } from "./InspectorTabs.types";

export function InspectorTabs({
  onMaterialTintChange,
  onViewerConfigChange,
  viewerConfig
}: InspectorTabsProps) {
  const renderPanel = (tabId: InspectorTabId) => {
    if (tabId === "config") {
      return (
        <ConfigPanel
          onMaterialTintChange={onMaterialTintChange}
          onViewerConfigChange={onViewerConfigChange}
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
      {inspectorTabs.map((tab) => (
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
