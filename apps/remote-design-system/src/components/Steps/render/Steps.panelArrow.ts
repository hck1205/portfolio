export function createPanelArrowElement() {
  const namespace = "http://www.w3.org/2000/svg";
  const svgElement = document.createElementNS(namespace, "svg");
  const pathElement = document.createElementNS(namespace, "path");

  svgElement.classList.add("ds-steps__panel-arrow");
  svgElement.setAttribute("aria-hidden", "true");
  svgElement.setAttribute("focusable", "false");
  svgElement.setAttribute("preserveAspectRatio", "none");
  svgElement.setAttribute("viewBox", "0 0 42 100");
  pathElement.setAttribute("d", "M0 0 L42 50 L0 100");
  svgElement.append(pathElement);

  return svgElement;
}
