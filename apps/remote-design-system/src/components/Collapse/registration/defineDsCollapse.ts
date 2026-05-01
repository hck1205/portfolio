import { COLLAPSE_ELEMENT_NAME, COLLAPSE_ITEM_ELEMENT_NAME } from "../constants/Collapse.constants";
import { DsCollapse } from "../Collapse";
import { DsCollapseItem } from "../item/CollapseItem";

/**
 * Collapse 관련 custom element를 브라우저 registry에 등록합니다.
 *
 * `ds-collapse`와 `ds-collapse-item`은 한 번만 등록되어야 하므로,
 * 이미 같은 이름의 element가 registry에 존재하면 재등록하지 않습니다.
 * Storybook, 테스트, SSR 경계처럼 `customElements`가 없을 수 있는 환경에서는
 * 조용히 반환하여 모듈 import 자체가 실패하지 않도록 합니다.
 *
 * @param registry 등록에 사용할 CustomElementRegistry입니다. 전달하지 않으면
 * 브라우저 전역 `customElements`를 사용합니다.
 */
export function defineDsCollapse(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get(COLLAPSE_ELEMENT_NAME)) {
    elementRegistry.define(COLLAPSE_ELEMENT_NAME, DsCollapse);
  }

  if (!elementRegistry.get(COLLAPSE_ITEM_ELEMENT_NAME)) {
    elementRegistry.define(COLLAPSE_ITEM_ELEMENT_NAME, DsCollapseItem);
  }
}
