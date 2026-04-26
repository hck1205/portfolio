export type SurfaceCardProps = {
  eyebrow?: string;
  heading?: string;
};

export class DsSurfaceCard extends HTMLElement {
  static observedAttributes = ["eyebrow", "heading"];

  private eyebrowElement?: HTMLParagraphElement;
  private headingElement?: HTMLHeadingElement;
  private contentElement?: HTMLDivElement;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get eyebrow() {
    return this.getAttribute("eyebrow") ?? "";
  }

  set eyebrow(value: string) {
    this.setAttribute("eyebrow", value);
  }

  get heading() {
    return this.getAttribute("heading") ?? "";
  }

  set heading(value: string) {
    this.setAttribute("heading", value);
  }

  private render() {
    if (!this.contentElement) {
      const existingContent = Array.from(this.childNodes);

      this.eyebrowElement = document.createElement("p");
      this.eyebrowElement.className = "ds-surface-card__eyebrow";

      this.headingElement = document.createElement("h2");
      this.headingElement.className = "ds-surface-card__title";

      this.contentElement = document.createElement("div");
      this.contentElement.className = "ds-surface-card__content";
      this.contentElement.append(...existingContent);

      this.replaceChildren(this.eyebrowElement, this.headingElement, this.contentElement);
    }

    const eyebrow = this.eyebrow;

    if (this.eyebrowElement) {
      this.eyebrowElement.hidden = !eyebrow;
      this.eyebrowElement.textContent = eyebrow;
    }

    if (this.headingElement) {
      this.headingElement.textContent = this.heading;
    }
  }
}

export function defineDsSurfaceCard(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get("ds-surface-card")) {
    elementRegistry.define("ds-surface-card", DsSurfaceCard);
  }
}
