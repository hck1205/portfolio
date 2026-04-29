export type ButtonTone = "primary" | "neutral" | "danger";
export type ButtonSize = "sm" | "md";

export type ButtonProps = {
  tone?: ButtonTone;
  size?: ButtonSize;
  disabled?: boolean;
};

export class DsButton extends HTMLElement {
  static observedAttributes = ["disabled", "size", "tone"];

  connectedCallback() {
    this.syncAttributes();
    this.addEventListener("keydown", this.handleKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("keydown", this.handleKeydown);
  }

  attributeChangedCallback() {
    this.syncAttributes();
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get size(): ButtonSize {
    return this.getAttribute("size") === "sm" ? "sm" : "md";
  }

  set size(value: ButtonSize) {
    this.setAttribute("size", value);
  }

  get tone(): ButtonTone {
    const tone = this.getAttribute("tone");

    if (tone === "neutral" || tone === "danger") {
      return tone;
    }

    return "primary";
  }

  set tone(value: ButtonTone) {
    this.setAttribute("tone", value);
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (this.disabled || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    this.click();
  };

  private syncAttributes() {
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }

    if (!this.hasAttribute("tone")) {
      this.setAttribute("tone", "primary");
    }

    if (!this.hasAttribute("size")) {
      this.setAttribute("size", "md");
    }

    this.setAttribute("aria-disabled", String(this.disabled));
    this.tabIndex = this.disabled ? -1 : 0;
  }
}

export function defineDsButton(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get("ds-button")) {
    elementRegistry.define("ds-button", DsButton);
  }
}
