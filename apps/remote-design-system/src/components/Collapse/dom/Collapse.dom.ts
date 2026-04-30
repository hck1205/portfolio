/**
 * Collapse 내부에서 사용할 고유한 DOM id를 생성합니다.
 *
 * trigger와 panel을 `aria-controls`, `aria-labelledby`로 연결해야 하므로
 * 한 페이지에 여러 Collapse가 렌더링되어도 id가 충돌하지 않도록 짧은
 * 난수 suffix를 붙입니다.
 *
 * @param prefix 생성될 id 앞에 붙일 namespace 성격의 문자열입니다.
 * @returns `${prefix}-${random}` 형태의 id 문자열입니다.
 */
export function createCollapseId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * HTML boolean-like attribute를 컴포넌트에서 쓰기 좋은 boolean 값으로 정규화합니다.
 *
 * Web Component에서는 `bordered="false"`처럼 문자열 attribute로 boolean 값을
 * 전달하는 경우가 있어, attribute 존재 여부만으로는 의도를 판단하기 어렵습니다.
 * 이 함수는 attribute가 없으면 기본값을 반환하고, 값이 정확히 `"false"`일 때만
 * false로 처리합니다.
 *
 * @param element attribute를 읽을 대상 HTMLElement입니다.
 * @param name 정규화할 attribute 이름입니다.
 * @param defaultValue attribute가 없을 때 사용할 기본 boolean 값입니다.
 * @returns 정규화된 boolean 값입니다.
 */
export function normalizeBooleanAttribute(
  element: HTMLElement,
  name: string,
  defaultValue: boolean
) {
  const value = element.getAttribute(name);

  if (value === null) {
    return defaultValue;
  }

  return value !== "false";
}
