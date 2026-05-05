function isDrawerOpen(drawer: HTMLElement) {
  return drawer.getAttribute("open") === "true";
}

function getBoundedDrawerWidth(width: number) {
  const maxWidth = Math.max(280, window.innerWidth - 48);

  return Math.min(Math.max(width, 280), maxWidth);
}

function getDrawerWidth(drawer: HTMLElement) {
  return getBoundedDrawerWidth(Number.parseFloat(drawer.getAttribute("width") ?? "420") || 420);
}

export function createResizeEdge(drawer: HTMLElement) {
  const edge = document.createElement("div");

  edge.ariaLabel = "드로어 너비 조절";
  edge.className = "ds-drawer-story-resize-edge";
  edge.hidden = true;
  edge.role = "separator";
  edge.tabIndex = 0;
  edge.setAttribute("aria-orientation", "vertical");

  const syncEdge = () => {
    const width = getDrawerWidth(drawer);

    edge.hidden = !isDrawerOpen(drawer);
    edge.style.insetInlineEnd = `${width - 5}px`;
  };

  const setDrawerWidth = (width: number) => {
    drawer.setAttribute("width", `${getBoundedDrawerWidth(width)}px`);
    syncEdge();
  };

  edge.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    edge.setPointerCapture(event.pointerId);
    edge.dataset.resizing = "true";
  });

  edge.addEventListener("pointermove", (event) => {
    if (edge.dataset.resizing !== "true") {
      return;
    }

    setDrawerWidth(window.innerWidth - event.clientX);
  });

  edge.addEventListener("pointerup", (event) => {
    if (edge.hasPointerCapture(event.pointerId)) {
      edge.releasePointerCapture(event.pointerId);
    }

    delete edge.dataset.resizing;
  });

  edge.addEventListener("pointercancel", () => {
    delete edge.dataset.resizing;
  });

  edge.addEventListener("keydown", (event) => {
    const currentWidth = getDrawerWidth(drawer);

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setDrawerWidth(currentWidth + 24);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setDrawerWidth(currentWidth - 24);
    }
  });

  const drawerObserver = new MutationObserver(syncEdge);
  const cleanupObserver = new MutationObserver(() => {
    if (drawer.isConnected) {
      return;
    }

    drawerObserver.disconnect();
    cleanupObserver.disconnect();
    window.removeEventListener("resize", syncEdge);
    edge.remove();
  });

  drawerObserver.observe(drawer, {
    attributeFilter: ["open", "width"],
    attributes: true
  });
  document.body.append(edge);
  cleanupObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
  window.addEventListener("resize", syncEdge);
  syncEdge();
}
