import { SKELETON_STYLES } from "../Skeleton.styles";

let skeletonStyleSheet: CSSStyleSheet | undefined;

export function applySkeletonStyles(shadowRoot: ShadowRoot) {
  if (canAdoptStyleSheets()) {
    if (!skeletonStyleSheet) {
      skeletonStyleSheet = new CSSStyleSheet();
      skeletonStyleSheet.replaceSync(SKELETON_STYLES);
    }

    if (!shadowRoot.adoptedStyleSheets.includes(skeletonStyleSheet)) {
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, skeletonStyleSheet];
    }

    return;
  }

  const styleElement = document.createElement("style");

  styleElement.textContent = SKELETON_STYLES;
  shadowRoot.prepend(styleElement);
}

function canAdoptStyleSheets() {
  return "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype;
}
