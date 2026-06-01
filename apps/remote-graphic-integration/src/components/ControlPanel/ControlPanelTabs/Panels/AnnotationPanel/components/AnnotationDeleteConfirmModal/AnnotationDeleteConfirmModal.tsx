import { styles } from "./AnnotationDeleteConfirmModal.styled";
import type { AnnotationDeleteConfirmModalProps } from "./AnnotationDeleteConfirmModal.types";

export function AnnotationDeleteConfirmModal({
  onCancel,
  onConfirm
}: AnnotationDeleteConfirmModalProps) {
  return (
    <div
      aria-labelledby="annotation-delete-modal-title"
      aria-modal="true"
      className={styles.annotationDeleteModal}
      role="dialog"
    >
      <button
        aria-label="annotation 삭제 취소"
        className={styles.annotationDeleteModalMask}
        onClick={onCancel}
        type="button"
      />
      <div className={styles.annotationDeleteModalDialog}>
        <ds-typography
          as="h2"
          display="block"
          id="annotation-delete-modal-title"
          typo-name="UI/Label/5/Bold"
        >
          Annotation을 삭제할까요?
        </ds-typography>
        <ds-typography
          color="#4b5560"
          display="block"
          typo-name="UI/Footnote/4/Normal"
        >
          이 저장된 annotation을 정말 삭제할까요?
        </ds-typography>
        <div className={styles.annotationDeleteModalActions}>
          <button
            className={styles.annotationDeleteModalCancel}
            onClick={onCancel}
            type="button"
          >
            아니요
          </button>
          <button
            className={styles.annotationDeleteModalConfirm}
            onClick={onConfirm}
            type="button"
          >
            예
          </button>
        </div>
      </div>
    </div>
  );
}
