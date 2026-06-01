import { useAnnotationStrokeController } from "./AnnotationToolbar.hook";
import { styles } from "./AnnotationToolbar.styled";
import type { AnnotationToolbarProps } from "./AnnotationToolbar.types";
import {
  annotationToolbarItems,
  getAnnotationStrokeIconWidth,
  getNormalizedAnnotationStrokeWidth
} from "./AnnotationToolbar.utils";

export function AnnotationToolbar({
  activeStrokeColor,
  activeStrokeWidth,
  activeTool,
  onClear,
  onSave,
  onStrokeColorChange,
  onStrokeWidthChange,
  onToolChange
}: AnnotationToolbarProps) {
  const {
    closeStrokeController,
    isStrokeControllerOpen,
    strokeControlRef,
    toggleStrokeController
  } = useAnnotationStrokeController();
  const normalizedStrokeWidth =
    getNormalizedAnnotationStrokeWidth(activeStrokeWidth);
  const strokeIconWidth = getAnnotationStrokeIconWidth(normalizedStrokeWidth);

  return (
    <div
      aria-label="Annotation drawing tools"
      className={styles.annotationToolbar}
      role="toolbar"
    >
      {annotationToolbarItems.map((item) => (
        <button
          aria-label={item.label}
          aria-pressed={activeTool === item.tool}
          className={styles.annotationToolButton}
          key={item.tool}
          onClick={() => {
            closeStrokeController();
            onToolChange(item.tool);
          }}
          title={item.label}
          type="button"
        >
          <ds-icon icon={item.icon} size="17" />
        </button>
      ))}
      <span className={styles.annotationToolbarDivider} />
      <label className={styles.annotationColorControl} title="Annotation color">
        <input
          aria-label="Annotation color"
          onChange={(event) => {
            closeStrokeController();
            onStrokeColorChange(event.currentTarget.value);
          }}
          type="color"
          value={activeStrokeColor}
        />
      </label>
      <div className={styles.annotationStrokeControl} ref={strokeControlRef}>
        <button
          aria-expanded={isStrokeControllerOpen}
          aria-label="Adjust stroke width"
          className={styles.annotationStrokeValueButton}
          onClick={toggleStrokeController}
          title="Adjust stroke width"
          type="button"
        >
          <ds-icon
            icon="minus"
            size="19"
            stroke-width={strokeIconWidth}
          />
        </button>
        {isStrokeControllerOpen ? (
          <div className={styles.annotationStrokeController}>
            <input
              aria-label="Stroke width"
              max="16"
              min="1"
              onChange={(event) =>
                onStrokeWidthChange(Number(event.currentTarget.value))
              }
              step="1"
              type="range"
              value={normalizedStrokeWidth}
            />
            <span className={styles.annotationStrokePreview}>
              <span
                style={{
                  height: `${normalizedStrokeWidth}px`,
                  width: `${Math.max(24, normalizedStrokeWidth * 3)}px`
                }}
              />
            </span>
          </div>
        ) : null}
      </div>
      <span className={styles.annotationToolbarDivider} />
      <button
        aria-label="Save annotation"
        className={styles.annotationToolButton}
        onClick={() => {
          closeStrokeController();
          onSave();
        }}
        title="Save annotation"
        type="button"
      >
        <ds-icon icon="save" size="17" />
      </button>
      <button
        aria-label="Clear annotations"
        className={styles.annotationToolButton}
        onClick={() => {
          closeStrokeController();
          onClear();
        }}
        title="Clear annotations"
        type="button"
      >
        <ds-icon icon="refresh-ccw" size="17" />
      </button>
    </div>
  );
}
