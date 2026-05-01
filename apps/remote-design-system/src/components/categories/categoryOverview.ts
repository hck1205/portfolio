export function createCategoryOverview({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  const section = document.createElement("section");
  const heading = document.createElement("h2");
  const body = document.createElement("p");

  section.className = "ds-component-category-overview";
  heading.textContent = title;
  body.textContent = description;
  section.append(heading, body);

  return section;
}
