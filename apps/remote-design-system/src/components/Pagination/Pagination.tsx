import {
  PAGINATION_CHANGE_EVENT,
  PAGINATION_OBSERVED_ATTRIBUTES,
  PAGINATION_PAGE_SIZE_CHANGE_EVENT
} from "./constants/Pagination.constants";
import {
  clampPage,
  getCurrentPage,
  getNonNegativeIntegerAttribute,
  getPageCount,
  getPageSize,
  getPageSizeOptions,
  getPaginationAlign,
  getPaginationSize,
  getPositiveIntegerAttribute,
  normalizeBooleanAttribute
} from "./dom/Pagination.dom";
import { createPaginationItems } from "./logic/Pagination.logic";
import {
  applyPaginationStyles,
  createPaginationElements,
  syncPaginationElements,
  type PaginationElements
} from "./render/Pagination.render";
import type {
  PaginationAlign,
  PaginationChangeDetail,
  PaginationPageSizeChangeDetail,
  PaginationSize
} from "./types/Pagination.types";

export class DsPagination extends HTMLElement {
  static observedAttributes = PAGINATION_OBSERVED_ATTRIBUTES;

  private elements?: PaginationElements;

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get align(): PaginationAlign {
    return getPaginationAlign(this);
  }

  set align(value: PaginationAlign) {
    this.setAttribute("align", value);
  }

  get current() {
    return getCurrentPage(this, this.pageCount);
  }

  set current(value: number) {
    this.setPage(value);
  }

  get defaultCurrent() {
    return getPositiveIntegerAttribute(this, "default-current", 1);
  }

  set defaultCurrent(value: number) {
    this.setPositiveNumberAttribute("default-current", value);
  }

  get defaultPageSize() {
    return getPositiveIntegerAttribute(this, "default-page-size", 10);
  }

  set defaultPageSize(value: number) {
    this.setPositiveNumberAttribute("default-page-size", value);
  }

  get disabled() {
    return normalizeBooleanAttribute(this, "disabled", false);
  }

  set disabled(value: boolean) {
    this.toggleAttribute("disabled", value);
  }

  get hideOnSinglePage() {
    return normalizeBooleanAttribute(this, "hide-on-single-page", false);
  }

  set hideOnSinglePage(value: boolean) {
    this.toggleAttribute("hide-on-single-page", value);
  }

  get pageSize() {
    return getPageSize(this);
  }

  set pageSize(value: number) {
    this.setPageSize(value);
  }

  get pageSizeOptions() {
    return getPageSizeOptions(this, this.pageSize);
  }

  set pageSizeOptions(value: number[]) {
    this.setAttribute("page-size-options", value.join(","));
  }

  get showLessItems() {
    return normalizeBooleanAttribute(this, "show-less-items", false);
  }

  set showLessItems(value: boolean) {
    this.toggleAttribute("show-less-items", value);
  }

  get showQuickJumper() {
    return normalizeBooleanAttribute(this, "show-quick-jumper", false);
  }

  set showQuickJumper(value: boolean) {
    this.toggleAttribute("show-quick-jumper", value);
  }

  get showSizeChanger() {
    return normalizeBooleanAttribute(this, "show-size-changer", false);
  }

  set showSizeChanger(value: boolean) {
    this.toggleAttribute("show-size-changer", value);
  }

  get simple() {
    return normalizeBooleanAttribute(this, "simple", false);
  }

  set simple(value: boolean) {
    this.toggleAttribute("simple", value);
  }

  get size(): PaginationSize {
    return getPaginationSize(this);
  }

  set size(value: PaginationSize) {
    this.setAttribute("size", value);
  }

  get total() {
    return getNonNegativeIntegerAttribute(this, "total", 0);
  }

  set total(value: number) {
    this.setNonNegativeNumberAttribute("total", value);
  }

  private get pageCount() {
    return getPageCount(this.total, this.pageSize);
  }

  private handlePageClick = (page: number) => {
    this.setPage(page);
  };

  private handlePageSizeChange = (pageSize: number) => {
    this.setPageSize(pageSize);
  };

  private handleQuickJump = (page: number) => {
    if (Number.isInteger(page) && page > 0) {
      this.setPage(page);
    }
  };

  private render() {
    if (!this.elements) {
      this.initializeStructure();
    }

    this.syncAttributes();
  }

  private initializeStructure() {
    const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    this.elements = createPaginationElements({
      onPageClick: this.handlePageClick,
      onPageSizeChange: this.handlePageSizeChange,
      onQuickJump: this.handleQuickJump
    });
    shadowRoot.replaceChildren(this.elements.rootElement);
    applyPaginationStyles(shadowRoot);
  }

  private syncAttributes() {
    const pageCount = this.pageCount;
    const current = this.current;

    this.setAttributeIfChanged("align", this.align);
    this.setAttributeIfChanged("size", this.size);
    this.toggleAttribute("hidden", this.hideOnSinglePage && pageCount <= 1);

    if (!this.elements) {
      return;
    }

    syncPaginationElements({
      current,
      disabled: this.disabled,
      elements: this.elements,
      items: createPaginationItems({
        current,
        pageCount,
        showLessItems: this.showLessItems
      }),
      pageCount,
      pageSize: this.pageSize,
      pageSizeOptions: this.pageSizeOptions,
      showQuickJumper: this.showQuickJumper,
      showSizeChanger: this.showSizeChanger,
      simple: this.simple
    });
  }

  private setPage(page: number) {
    if (this.disabled) {
      return;
    }

    const nextPage = clampPage(page, this.pageCount);

    if (nextPage === this.current) {
      return;
    }

    this.setPositiveNumberAttribute("current", nextPage);
    this.dispatchChangeEvent();
  }

  private setPageSize(pageSize: number) {
    if (this.disabled || !Number.isInteger(pageSize) || pageSize <= 0) {
      return;
    }

    const previousPageSize = this.pageSize;

    if (pageSize === previousPageSize) {
      return;
    }

    this.setPositiveNumberAttribute("page-size", pageSize);
    this.setPositiveNumberAttribute("current", clampPage(this.current, this.pageCount));
    this.dispatchEvent(
      new CustomEvent<PaginationPageSizeChangeDetail>(PAGINATION_PAGE_SIZE_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          current: this.current,
          pageSize,
          previousPageSize,
          total: this.total
        }
      })
    );
    this.dispatchChangeEvent();
  }

  private dispatchChangeEvent() {
    this.dispatchEvent(
      new CustomEvent<PaginationChangeDetail>(PAGINATION_CHANGE_EVENT, {
        bubbles: true,
        detail: {
          current: this.current,
          pageSize: this.pageSize,
          total: this.total
        }
      })
    );
  }

  private setPositiveNumberAttribute(name: string, value: number) {
    if (Number.isFinite(value)) {
      this.setAttributeIfChanged(name, String(Math.max(1, Math.floor(value))));
    }
  }

  private setNonNegativeNumberAttribute(name: string, value: number) {
    if (Number.isFinite(value)) {
      this.setAttributeIfChanged(name, String(Math.max(0, Math.floor(value))));
    }
  }

  private setAttributeIfChanged(name: string, value: string) {
    if (this.getAttribute(name) !== value) {
      this.setAttribute(name, value);
    }
  }
}
