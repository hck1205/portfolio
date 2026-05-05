export class DrawerPortalController {
  private isPortalMove = false;
  private portalAnchor?: Comment;
  private portalCleanupFrame = 0;

  constructor(private readonly host: HTMLElement) {}

  get isMoving() {
    return this.isPortalMove;
  }

  private get isHostOpen() {
    const open = this.host.getAttribute("open");

    return open === "" || open === "true";
  }

  mount() {
    const body = this.host.ownerDocument.body;

    if (!body || this.host.parentElement === body) {
      this.startPortalCleanup();
      return;
    }

    const parent = this.host.parentNode;

    if (!parent) {
      return;
    }

    if (!this.portalAnchor) {
      this.portalAnchor = this.host.ownerDocument.createComment("ds-drawer-anchor");
      parent.insertBefore(this.portalAnchor, this.host.nextSibling);
    }

    this.moveForPortal(() => body.append(this.host));
    this.startPortalCleanup();
  }

  restore() {
    this.cancelPortalCleanup();

    if (!this.portalAnchor) {
      return;
    }

    const anchor = this.portalAnchor;
    const parent = anchor.parentNode;

    if (parent) {
      this.moveForPortal(() => parent.insertBefore(this.host, anchor));
    } else if (this.host.parentElement === this.host.ownerDocument.body) {
      this.host.remove();
    }

    anchor.remove();
    this.portalAnchor = undefined;
  }

  disconnect() {
    this.cancelPortalCleanup();

    if (this.isPortalMove) {
      return;
    }

    this.portalAnchor?.remove();
    this.portalAnchor = undefined;
  }

  private moveForPortal(move: () => void) {
    this.isPortalMove = true;

    try {
      move();
    } finally {
      this.isPortalMove = false;
    }
  }

  private startPortalCleanup() {
    if (!this.portalAnchor || this.portalCleanupFrame) {
      return;
    }

    const scheduleFrame =
      this.host.ownerDocument.defaultView?.requestAnimationFrame.bind(this.host.ownerDocument.defaultView) ?? requestAnimationFrame;

    const watchAnchor = () => {
      if (!this.portalAnchor || !this.host.isConnected || !this.isHostOpen) {
        this.portalCleanupFrame = 0;
        return;
      }

      if (!this.portalAnchor.isConnected) {
        this.host.remove();
        return;
      }

      this.portalCleanupFrame = scheduleFrame(watchAnchor);
    };

    this.portalCleanupFrame = scheduleFrame(watchAnchor);
  }

  private cancelPortalCleanup() {
    if (!this.portalCleanupFrame) {
      return;
    }

    const cancelFrame =
      this.host.ownerDocument.defaultView?.cancelAnimationFrame.bind(this.host.ownerDocument.defaultView) ?? cancelAnimationFrame;

    cancelFrame(this.portalCleanupFrame);
    this.portalCleanupFrame = 0;
  }
}
