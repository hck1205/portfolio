import { formatAnnotationSavedAt } from "../../AnnotationPanel.utils";
import { styles } from "./AnnotationSaveCard.styled";
import type { AnnotationSaveCardProps } from "./AnnotationSaveCard.types";

export function AnnotationSaveCard({
  save,
  indexLabel,
  onDelete,
  onSelect
}: AnnotationSaveCardProps) {
  const savedAtLabel = formatAnnotationSavedAt(save);

  return (
    <div className={styles.annotationSaveButton}>
      <span className={styles.annotationSaveContent}>
        <span className={styles.annotationSavePreviewFrame}>
          <button
            aria-label={`Restore annotation ${indexLabel}, saved at ${savedAtLabel}`}
            className={styles.annotationSavePreviewButton}
            onClick={() => {
              onSelect(save);
            }}
            type="button"
          >
            {save.thumbnailDataUrl ? (
              <img
                alt=""
                className={styles.annotationSaveThumbnail}
                src={save.thumbnailDataUrl}
              />
            ) : (
              <span
                aria-label="No thumbnail"
                className={styles.annotationSaveThumbnailPlaceholder}
              >
                <ds-icon icon="image-off" size="18" />
              </span>
            )}
          </button>
          <span
            aria-label={`annotation ${indexLabel}`}
            className={styles.annotationSaveIndex}
          >
            {indexLabel}
          </span>
          <span className={styles.annotationSaveHeader}>
            <ds-typography
              color="#ffffff"
              display="block"
              typo-name="UI/Footnote/4/Normal"
            >
              {savedAtLabel}
            </ds-typography>
            <button
              aria-label={`Delete annotation ${indexLabel}, saved at ${savedAtLabel}`}
              className={styles.annotationSaveDeleteButton}
              onClick={() => {
                onDelete(save);
              }}
              type="button"
            >
              <ds-icon icon="Trash2" size="14" />
            </button>
          </span>
        </span>
      </span>
    </div>
  );
}
