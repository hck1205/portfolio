import { useEffect, useRef } from "react";

import { controlPanelTabs } from "./ControlPanelTabs.constants";
import styles from "./ControlPanelTabs.module.css";
import { AnnotationPanel, ConfigPanel, PlaceholderPanel } from "./Panels";
import type {
  ControlPanelTabId,
  ControlPanelTabsProps
} from "./ControlPanelTabs.types";

export function ControlPanelTabs({
  activeTabId,
  annotationSaves,
  onActiveTabChange,
  onAnnotationSaveDelete,
  onAnnotationSaveSelect,
  onMaterialPresetChange,
  onMaterialTintChange,
  onViewerConfigChange,
  onViewerNumberConfigChange,
  onViewerOptionConfigChange,
  onViewerScreenshot,
  viewerConfig
}: ControlPanelTabsProps) {
  const tabsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const tabsElement = tabsRef.current;

    if (!tabsElement) {
      return;
    }

    const handleTabsChange = (event: Event) => {
      const { activeKey } = (event as CustomEvent<{ activeKey: string }>).detail;

      if (isControlPanelTabId(activeKey)) {
        onActiveTabChange(activeKey);
      }
    };

    tabsElement.addEventListener("ds-tabs-change", handleTabsChange);

    return () => {
      tabsElement.removeEventListener("ds-tabs-change", handleTabsChange);
    };
  }, [onActiveTabChange]);

  const renderPanel = (tabId: ControlPanelTabId) => {
    if (tabId === "config") {
      return (
        <ConfigPanel
          onMaterialPresetChange={onMaterialPresetChange}
          onMaterialTintChange={onMaterialTintChange}
          onViewerConfigChange={onViewerConfigChange}
          onViewerNumberConfigChange={onViewerNumberConfigChange}
          onViewerOptionConfigChange={onViewerOptionConfigChange}
          onViewerScreenshot={onViewerScreenshot}
          viewerConfig={viewerConfig}
        />
      );
    }

    if (tabId === "annotation") {
      return (
        <AnnotationPanel
          annotationSaves={annotationSaves}
          onAnnotationSaveDelete={onAnnotationSaveDelete}
          onAnnotationSaveSelect={onAnnotationSaveSelect}
        />
      );
    }

    return <PlaceholderPanel />;
  };

  return (
    <ds-tabs
      active-key={activeTabId}
      centered=""
      className={styles.tabs}
      default-active-key="config"
      full-width=""
      ref={tabsRef}
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

function isControlPanelTabId(value: string): value is ControlPanelTabId {
  return controlPanelTabs.some((tab) => tab.id === value);
}
