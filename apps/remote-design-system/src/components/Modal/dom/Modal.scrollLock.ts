type ModalScrollLockState = {
  bodyOverflow: string;
  bodyPaddingInlineEnd: string;
  count: number;
  rootOverflow: string;
};

const modalScrollLocks = new WeakMap<Document, ModalScrollLockState>();

function getScrollbarWidth(document: Document) {
  const view = document.defaultView;

  if (!view) {
    return 0;
  }

  return Math.max(0, view.innerWidth - document.documentElement.clientWidth);
}

export function lockModalDocumentScroll(document: Document) {
  const body = document.body;
  const root = document.documentElement;

  if (!body || !root) {
    return;
  }

  const currentLock = modalScrollLocks.get(document);

  if (currentLock) {
    currentLock.count += 1;
    return;
  }

  const scrollbarWidth = getScrollbarWidth(document);
  const computedPaddingInlineEnd = document.defaultView?.getComputedStyle(body).paddingInlineEnd ?? "0";
  const paddingInlineEnd = Number.parseFloat(computedPaddingInlineEnd) || 0;

  modalScrollLocks.set(document, {
    bodyOverflow: body.style.overflow,
    bodyPaddingInlineEnd: body.style.paddingInlineEnd,
    count: 1,
    rootOverflow: root.style.overflow
  });

  root.style.overflow = "hidden";
  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    body.style.paddingInlineEnd = `${paddingInlineEnd + scrollbarWidth}px`;
  }
}

export function unlockModalDocumentScroll(document: Document) {
  const body = document.body;
  const root = document.documentElement;
  const currentLock = modalScrollLocks.get(document);

  if (!body || !root || !currentLock) {
    return;
  }

  currentLock.count -= 1;

  if (currentLock.count > 0) {
    return;
  }

  root.style.overflow = currentLock.rootOverflow;
  body.style.overflow = currentLock.bodyOverflow;
  body.style.paddingInlineEnd = currentLock.bodyPaddingInlineEnd;
  modalScrollLocks.delete(document);
}
