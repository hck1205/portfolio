import { COLLAPSE_OBSERVED_ATTRIBUTES, COLLAPSE_TOGGLE_EVENT } from "./constants/Collapse.constants";
import { normalizeBooleanAttribute } from "./dom/Collapse.dom";
import { DsCollapseItem } from "./item/CollapseItem";
import type { CollapseExpandIconPlacement, CollapseSize, CollapseToggleDetail } from "./types/Collapse.types";

export class DsCollapse extends HTMLElement {
  static observedAttributes = COLLAPSE_OBSERVED_ATTRIBUTES;

  private hasAppliedDefaultActiveKey = false;
  private itemObserver?: MutationObserver;

  /**
   * element가 DOM에 연결될 때 Collapse parent의 초기 상태를 설정합니다.
   *
   * item에서 발생하는 toggle custom event를 수신하기 시작하고,
   * parent attribute의 기본값과 child item의 open 상태를 동기화합니다.
   */
  connectedCallback() {
    this.addEventListener(COLLAPSE_TOGGLE_EVENT, this.handleCollapseToggle);
    this.observeItemChanges();
    this.syncAttributes();
    this.syncItems();
  }

  /**
   * element가 DOM에서 제거될 때 등록한 이벤트 리스너를 해제합니다.
   *
   * custom element가 재사용되거나 제거될 때 불필요한 listener 참조가 남지 않도록 합니다.
   */
  disconnectedCallback() {
    this.removeEventListener(COLLAPSE_TOGGLE_EVENT, this.handleCollapseToggle);
    this.itemObserver?.disconnect();
  }

  /**
   * 관찰 중인 parent attribute가 변경될 때 parent와 child 상태를 재동기화합니다.
   *
   * `accordion`, `active-key`, `bordered`, `ghost`, `size`,
   * `expand-icon-placement` 같은 값이 바뀌면 dataset과 item open 상태에 반영합니다.
   */
  attributeChangedCallback() {
    this.syncAttributes();
    this.syncItems();
  }

  /**
   * 한 번에 하나의 item만 열 수 있는 accordion 모드인지 반환합니다.
   *
   * @returns accordion attribute가 true로 해석되면 true입니다.
   */
  get accordion() {
    return normalizeBooleanAttribute(this, "accordion", false);
  }

  /**
   * accordion 모드 여부를 attribute로 반영합니다.
   *
   * @param value true이면 accordion 모드를 활성화합니다.
   */
  set accordion(value: boolean) {
    this.setAttribute("accordion", String(value));
  }

  /**
   * 제어 모드에서 현재 열려야 하는 item key를 반환합니다.
   *
   * @returns active-key attribute 값이며, 없으면 빈 문자열입니다.
   */
  get activeKey() {
    return this.getAttribute("active-key") ?? "";
  }

  /**
   * 제어 모드에서 열 item key를 attribute로 반영합니다.
   *
   * @param value 열어둘 item의 key입니다.
   */
  set activeKey(value: string) {
    this.setAttribute("active-key", value);
  }

  /**
   * Collapse 외곽 border를 표시할지 반환합니다.
   *
   * attribute가 없으면 기본값 true로 처리해 일반적인 bordered 스타일을 사용합니다.
   *
   * @returns border를 표시하면 true입니다.
   */
  get bordered() {
    return normalizeBooleanAttribute(this, "bordered", true);
  }

  /**
   * Collapse 외곽 border 표시 여부를 attribute로 반영합니다.
   *
   * @param value true이면 bordered 스타일을 사용합니다.
   */
  set bordered(value: boolean) {
    this.setAttribute("bordered", String(value));
  }

  /**
   * 비제어 초기 렌더링에서 기본으로 열 item key를 반환합니다.
   *
   * @returns default-active-key attribute 값이며, 없으면 빈 문자열입니다.
   */
  get defaultActiveKey() {
    return this.getAttribute("default-active-key") ?? "";
  }

  /**
   * 비제어 초기 렌더링에서 기본으로 열 item key를 attribute로 반영합니다.
   *
   * @param value 최초 동기화 때 열어둘 item의 key입니다.
   */
  set defaultActiveKey(value: string) {
    this.setAttribute("default-active-key", value);
  }

  /**
   * expand icon을 header의 어느 쪽에 배치할지 반환합니다.
   *
   * 유효하지 않은 값은 기본값 `"start"`로 처리합니다.
   *
   * @returns `"start"` 또는 `"end"`입니다.
   */
  get expandIconPlacement(): CollapseExpandIconPlacement {
    return this.getAttribute("expand-icon-placement") === "end" ? "end" : "start";
  }

  /**
   * expand icon 배치 방향을 attribute로 반영합니다.
   *
   * @param value icon을 label 앞에 둘지 뒤에 둘지 나타냅니다.
   */
  set expandIconPlacement(value: CollapseExpandIconPlacement) {
    this.setAttribute("expand-icon-placement", value);
  }

  /**
   * ghost 스타일 사용 여부를 반환합니다.
   *
   * @returns ghost attribute가 true로 해석되면 true입니다.
   */
  get ghost() {
    return normalizeBooleanAttribute(this, "ghost", false);
  }

  /**
   * ghost 스타일 사용 여부를 attribute로 반영합니다.
   *
   * @param value true이면 ghost 스타일을 활성화합니다.
   */
  set ghost(value: boolean) {
    this.setAttribute("ghost", String(value));
  }

  /**
   * Collapse의 시각적 크기 값을 반환합니다.
   *
   * `"large"`와 `"small"`만 명시적으로 허용하고,
   * 그 외 값이나 누락된 경우 기본값 `"middle"`을 반환합니다.
   *
   * @returns 현재 size 값입니다.
   */
  get size(): CollapseSize {
    const value = this.getAttribute("size");

    if (value === "large" || value === "small") {
      return value;
    }

    return "middle";
  }

  /**
   * Collapse 크기 값을 attribute로 반영합니다.
   *
   * @param value 적용할 size 값입니다.
   */
  set size(value: CollapseSize) {
    this.setAttribute("size", value);
  }

  /**
   * child item에서 발생한 toggle event를 처리합니다.
   *
   * accordion 모드에서 새 item이 열리면 나머지 item을 닫고,
   * parent의 `active-key` attribute를 현재 열린 item key와 맞춥니다.
   *
   * @param event `ds-collapse-toggle` custom event입니다.
   */
  private handleCollapseToggle = (event: Event) => {
    const customEvent = event as CustomEvent<CollapseToggleDetail>;

    if (this.accordion && customEvent.detail.open) {
      for (const item of this.items) {
        if (item.itemKey !== customEvent.detail.itemKey) {
          item.open = false;
        }
      }
    }

    if (this.accordion) {
      this.activeKey = customEvent.detail.open ? customEvent.detail.itemKey : "";
    }
  };

  /**
   * 현재 Collapse 안에 있는 모든 direct/descendant item element를 반환합니다.
   *
   * parent가 child open 상태를 동기화하거나 accordion 규칙을 적용할 때 사용합니다.
   *
   * @returns `ds-collapse-item` element 배열입니다.
   */
  private get items() {
    return Array.from(this.querySelectorAll<DsCollapseItem>("ds-collapse-item"));
  }

  /**
   * parent Collapse 자체의 attribute 기본값과 스타일용 data attribute를 동기화합니다.
   *
   * `size`와 `expand-icon-placement`가 없으면 기본 attribute를 채우고,
   * CSS selector에서 사용하기 쉽도록 borderless/ghost 상태를 data attribute로 반영합니다.
   */
  private syncAttributes() {
    if (!this.hasAttribute("size")) {
      this.setAttribute("size", "middle");
    }

    if (!this.hasAttribute("expand-icon-placement")) {
      this.setAttribute("expand-icon-placement", "start");
    }

    this.toggleAttribute("data-borderless", !this.bordered);
    this.toggleAttribute("data-ghost", this.ghost);
  }

  /**
   * child item 추가/삭제를 감지해 parent와 item 상태를 다시 맞춥니다.
   *
   * Web Components renderer, 프레임워크 어댑터, plain DOM 조립처럼 parent element가 먼저
   * 연결되고 item children이 나중에 삽입되는 환경에서도 `default-active-key`와
   * accordion 상태가 정상 적용되도록 합니다.
   */
  private observeItemChanges() {
    if (this.itemObserver) {
      return;
    }

    this.itemObserver = new MutationObserver(() => {
      this.syncItems();
    });
    this.itemObserver.observe(this, {
      childList: true
    });
  }

  /**
   * parent의 active key 정책을 child item의 open 상태에 반영합니다.
   *
   * `active-key`가 있으면 제어 모드처럼 해당 key를 열고,
   * 없으면 최초 1회에 한해 `default-active-key`를 적용합니다.
   * accordion이 아닐 때는 comma-separated key 목록을 여러 open item으로 처리합니다.
   * 각 item의 attribute callback을 호출해 item 내부 DOM도 최신 상태로 맞춥니다.
   */
  private syncItems() {
    const items = this.items;

    if (items.length === 0) {
      return;
    }

    const activeKey = this.hasAttribute("active-key")
      ? this.activeKey
      : this.hasAppliedDefaultActiveKey
        ? ""
        : this.defaultActiveKey;
    const activeKeys = activeKey
      .split(",")
      .map((key) => key.trim())
      .filter(Boolean);
    const openItemKeys = new Set(this.accordion ? activeKeys.slice(0, 1) : activeKeys);

    for (const [index, item] of items.entries()) {
      if (!item.itemKey) {
        item.itemKey = `collapse-${index + 1}`;
      }

      if (openItemKeys.size > 0) {
        item.open = openItemKeys.has(item.itemKey);
      }

      item.attributeChangedCallback();
    }

    this.hasAppliedDefaultActiveKey = true;
  }
}
