type DrawerScrollLockState = {
  bodyOverflow: string;
  bodyPaddingInlineEnd: string;
  count: number;
  rootOverflow: string;
};

const drawerScrollLocks = new WeakMap<Document, DrawerScrollLockState>();

function getScrollbarWidth(document: Document) {
  const view = document.defaultView;

  if (!view) {
    return 0;
  }

  return Math.max(0, view.innerWidth - document.documentElement.clientWidth);
}

export function lockDrawerDocumentScroll(document: Document) {
  const body = document.body;
  const root = document.documentElement;

  if (!body || !root) {
    return;
  }

  const currentLock = drawerScrollLocks.get(document);

  if (currentLock) {
    currentLock.count += 1;
    return;
  }

  const scrollbarWidth = getScrollbarWidth(document);
  const computedPaddingInlineEnd = document.defaultView?.getComputedStyle(body).paddingInlineEnd ?? "0";
  const paddingInlineEnd = Number.parseFloat(computedPaddingInlineEnd) || 0;

  drawerScrollLocks.set(document, {
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

export function unlockDrawerDocumentScroll(document: Document) {
  const body = document.body;
  const root = document.documentElement;
  const currentLock = drawerScrollLocks.get(document);

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
  drawerScrollLocks.delete(document);
}
