import { COLLAPSE_ITEM_OBSERVED_ATTRIBUTES, COLLAPSE_TOGGLE_EVENT } from "../constants/Collapse.constants";
import { createCollapseId, normalizeBooleanAttribute } from "../dom/Collapse.dom";
import {
  applyCollapseItemStyles,
  createCollapseItemElements,
  syncCollapseItemElements,
  type CollapseItemElements
} from "./CollapseItem.render";
import type {
  CollapseCollapsible,
  CollapseExpandIconPlacement,
  CollapseHeadingLevel,
  CollapseToggleDetail
} from "../types/Collapse.types";

export class DsCollapseItem extends HTMLElement {
  static observedAttributes = COLLAPSE_ITEM_OBSERVED_ATTRIBUTES;

  private elements?: CollapseItemElements;
  private parentExpandIconPlacement: CollapseExpandIconPlacement = "start";
  private readonly panelId = createCollapseId("ds-collapse-panel");
  private readonly triggerId = createCollapseId("ds-collapse-trigger");

  /**
   * element가 DOM에 연결될 때 최초 렌더링을 수행합니다.
   *
   * Shadow DOM 안에 header와 body 구조를 만들고, 사용자가 작성한 light DOM content는
   * body 내부 slot으로 노출되도록 현재 attribute 값을 기준으로 상태를 동기화합니다.
   */
  connectedCallback() {
    this.render();
  }

  /**
   * 관찰 중인 attribute가 변경될 때 DOM 상태를 다시 동기화합니다.
   *
   * `label`, `open`, `disabled`, `extra`, `show-arrow` 같은 attribute 변경이
   * 즉시 화면과 접근성 속성에 반영되도록 render 흐름을 재실행합니다.
   */
  attributeChangedCallback() {
    this.render();
  }

  /**
   * item의 클릭 가능 영역 정책을 반환합니다.
   *
   * 유효하지 않은 attribute 값은 기본값인 `"header"`로 취급하여,
   * 별도 설정이 없으면 header 전체를 클릭해 토글할 수 있게 합니다.
   *
   * @returns `"header"`, `"icon"`, `"disabled"` 중 현재 collapsible 값입니다.
   */
  get collapsible(): CollapseCollapsible {
    const value = this.getAttribute("collapsible");

    if (value === "icon" || value === "disabled") {
      return value;
    }

    return "header";
  }

  /**
   * item의 클릭 가능 영역 정책을 attribute로 반영합니다.
   *
   * @param value 설정할 collapsible 정책입니다.
   */
  set collapsible(value: CollapseCollapsible) {
    this.setAttribute("collapsible", value);
  }

  /**
   * item이 비활성 상태인지 반환합니다.
   *
   * `disabled` attribute가 있거나 `collapsible="disabled"`인 경우 모두
   * 토글이 불가능한 상태로 판단합니다.
   *
   * @returns 비활성 상태이면 true입니다.
   */
  get disabled() {
    return this.hasAttribute("disabled") || this.collapsible === "disabled";
  }

  /**
   * item의 disabled attribute를 토글합니다.
   *
   * @param value true이면 disabled attribute를 추가하고, false이면 제거합니다.
   */
  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  /**
   * header에 표시할 보조 텍스트를 반환합니다.
   *
   * @returns extra attribute 값이며, 없으면 빈 문자열입니다.
   */
  get extra() {
    return this.getAttribute("extra") ?? "";
  }

  /**
   * header 보조 텍스트를 attribute로 반영합니다.
   *
   * @param value 표시할 보조 텍스트입니다.
   */
  set extra(value: string) {
    this.setAttribute("extra", value);
  }

  get headingLevel(): CollapseHeadingLevel {
    const value = Number(this.getAttribute("heading-level"));

    if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6) {
      return value;
    }

    return 3;
  }

  set headingLevel(value: CollapseHeadingLevel) {
    this.setAttribute("heading-level", String(value));
  }

  /**
   * item을 식별하는 key를 반환합니다.
   *
   * Collapse parent가 accordion 동작과 active key 동기화에 사용합니다.
   * 명시적인 `item-key`가 없으면 element id를 fallback으로 사용합니다.
   *
   * @returns item 식별 key입니다.
   */
  get itemKey() {
    return this.getAttribute("item-key") ?? this.id;
  }

  /**
   * item 식별 key를 attribute로 반영합니다.
   *
   * @param value parent Collapse에서 active state를 비교할 key입니다.
   */
  set itemKey(value: string) {
    this.setAttribute("item-key", value);
  }

  /**
   * header에 표시할 label 텍스트를 반환합니다.
   *
   * @returns label attribute 값이며, 없으면 빈 문자열입니다.
   */
  get label() {
    return this.getAttribute("label") ?? "";
  }

  /**
   * header label 텍스트를 attribute로 반영합니다.
   *
   * @param value header에 표시할 텍스트입니다.
   */
  set label(value: string) {
    this.setAttribute("label", value);
  }

  /**
   * item의 펼침 상태를 반환합니다.
   *
   * @returns `open` attribute가 있으면 true입니다.
   */
  get open() {
    return this.hasAttribute("open");
  }

  /**
   * item의 펼침 상태를 attribute로 반영합니다.
   *
   * @param value true이면 panel을 열고, false이면 닫습니다.
   */
  set open(value: boolean) {
    this.toggleAttribute("open", value);
  }

  /**
   * arrow icon 표시 여부를 반환합니다.
   *
   * attribute가 없을 때는 기본적으로 icon을 표시하며,
   * `show-arrow="false"`일 때만 숨김 처리합니다.
   *
   * @returns arrow icon을 보여주면 true입니다.
   */
  get showArrow() {
    return normalizeBooleanAttribute(this, "show-arrow", true);
  }

  /**
   * arrow icon 표시 여부를 attribute로 반영합니다.
   *
   * @param value true이면 icon을 표시하고, false이면 숨깁니다.
   */
  set showArrow(value: boolean) {
    this.setAttribute("show-arrow", String(value));
  }

  syncFromParent({
    expandIconPlacement
  }: {
    expandIconPlacement: CollapseExpandIconPlacement;
  }) {
    this.parentExpandIconPlacement = expandIconPlacement;
    this.render();
  }

  /**
   * trigger 버튼 클릭을 item toggle 흐름으로 연결합니다.
   *
   * arrow function으로 선언해 DOM event listener에 전달되어도
   * `this`가 현재 `DsCollapseItem` instance를 가리키도록 유지합니다.
   */
  private handleToggle = () => {
    this.toggleOpen();
  };

  /**
   * item의 open 상태를 반전하고 parent Collapse에 변경 이벤트를 전달합니다.
   *
   * disabled 상태이거나 `collapsible="icon"`인데 icon이 숨겨져 실제 클릭 가능한
   * trigger가 없는 경우에는 상태를 바꾸지 않습니다. 정상적으로 토글되면
   * parent가 accordion 규칙을 적용할 수 있도록 bubbling custom event를 발생시킵니다.
   */
  private toggleOpen() {
    if (this.disabled || (this.collapsible === "icon" && !this.showArrow)) {
      return;
    }

    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent<CollapseToggleDetail>(COLLAPSE_TOGGLE_EVENT, {
        bubbles: true,
        detail: {
          itemKey: this.itemKey,
          open: this.open
        }
      })
    );
  }

  /**
   * item의 DOM 생성과 상태 동기화를 조율합니다.
   *
   * `item-key`가 비어 있으면 임시 key를 생성하고, 내부 DOM 구조가 없으면 최초 생성합니다.
   * 이후에는 현재 attribute 값을 이미 생성된 DOM node에 반영합니다.
   */
  private render() {
    if (!this.itemKey) {
      this.itemKey = createCollapseId("item");
    }

    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncStructure();
  }

  /**
   * item 내부 DOM 구조를 최초 1회 생성합니다.
   *
   * light DOM children은 소비자가 제공한 content로 유지하고, section, heading, trigger,
   * label, extra, icon, body node는 Shadow DOM 안에 생성해 slot으로 content를 표시합니다.
   */
  private initializeStructure() {
    this.elements = createCollapseItemElements({
      onToggle: this.handleToggle,
      panelId: this.panelId,
      triggerId: this.triggerId
    });

    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    shadowRoot.replaceChildren(this.elements.sectionElement);
    applyCollapseItemStyles(shadowRoot);
  }

  /**
   * 현재 attribute 값을 item 내부 DOM 구조에 반영합니다.
   *
   * open 상태, aria 속성, disabled 상태, label/extra 텍스트, icon 위치를
   * 렌더 helper에 위임해 클래스 내부의 상태 흐름과 DOM 배치 책임을 분리합니다.
   */
  private syncStructure() {
    if (!this.elements) {
      return;
    }

    syncCollapseItemElements({
      collapsible: this.collapsible,
      disabled: this.disabled,
      elements: this.elements,
      expandIconPlacement: this.parentExpandIconPlacement,
      extra: this.extra,
      headingLevel: this.headingLevel,
      label: this.label,
      open: this.open,
      panelId: this.panelId,
      showArrow: this.showArrow
    });
  }
}
