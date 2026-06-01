import { AnnotationDeleteConfirmModal } from "./components/AnnotationDeleteConfirmModal";
import { AnnotationSaveCard } from "./components/AnnotationSaveCard";
import { useAnnotationPanel } from "./AnnotationPanel.hook";
import { styles } from "./AnnotationPanel.styled";
import type { AnnotationPanelProps } from "./AnnotationPanel.types";
import { formatAnnotationSaveIndex } from "./AnnotationPanel.utils";

export function AnnotationPanel({
  annotationSaves,
  onAnnotationSaveDelete,
  onAnnotationSaveSelect
}: AnnotationPanelProps) {
  const {
    closeDeleteModal,
    confirmDelete,
    deleteTarget,
    setDeleteTarget
  } = useAnnotationPanel(onAnnotationSaveDelete);

  return (
    <section className={styles.tabPanel}>
      <div className={styles.sectionBody}>
        {annotationSaves.length > 0 ? (
          <ol className={styles.annotationSaveList}>
            {annotationSaves.map((save, index) => (
              <li className={styles.annotationSaveItem} key={save.id}>
                <AnnotationSaveCard
                  indexLabel={formatAnnotationSaveIndex(index + 1)}
                  onDelete={setDeleteTarget}
                  onSelect={onAnnotationSaveSelect}
                  save={save}
                />
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.annotationEmptyState}>
            <ds-typography
              color="#4b5560"
              display="block"
              typo-name="UI/Footnote/4/Normal"
            >
              저장된 Annotation이 없습니다.
            </ds-typography>
          </div>
        )}
      </div>
      {deleteTarget ? (
        <AnnotationDeleteConfirmModal
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      ) : null}
    </section>
  );
}
