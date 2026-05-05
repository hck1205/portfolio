export function createSemanticContent() {
  const content = document.createElement("div");
  const kicker = document.createElement("div");
  const copy = document.createElement("p");
  const list = document.createElement("dl");

  content.className = "ds-modal-story-custom-content";
  kicker.className = "ds-modal-story-custom-kicker";
  copy.className = "ds-modal-story-custom-copy";
  list.className = "ds-modal-story-custom-list";

  kicker.textContent = "배포 준비 완료";
  copy.textContent = "검토가 끝난 변경사항을 사용자에게 적용하기 전에 마지막으로 확인합니다.";
  list.append(
    createDefinitionItem("변경 범위", "디자인 토큰, 피드백 컴포넌트, 접근성 상태"),
    createDefinitionItem("예상 영향", "다음 릴리즈부터 모든 원격 앱에 반영")
  );
  content.append(kicker, copy, list);

  return content;
}

function createDefinitionItem(term: string, description: string) {
  const item = document.createElement("div");
  const termElement = document.createElement("dt");
  const descriptionElement = document.createElement("dd");

  termElement.textContent = term;
  descriptionElement.textContent = description;
  item.append(termElement, descriptionElement);

  return item;
}
