import { applyLayoutStyles, createLayoutRegionElements } from "./render/Layout.render";

type LayoutRegionName = "header" | "content" | "footer";

abstract class DsLayoutRegion extends HTMLElement {
  protected abstract readonly region: LayoutRegionName;
  private elements?: ReturnType<typeof createLayoutRegionElements>;

  connectedCallback() {
    if (this.elements) {
      return;
    }

    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createLayoutRegionElements(this.region);
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyLayoutStyles(shadowRoot, "region");
  }
}

export class DsLayoutHeader extends DsLayoutRegion {
  protected readonly region = "header";
}

export class DsLayoutContent extends DsLayoutRegion {
  protected readonly region = "content";
}

export class DsLayoutFooter extends DsLayoutRegion {
  protected readonly region = "footer";
}

