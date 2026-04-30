# Remote Design System Component Skill

이 문서는 `apps/remote-design-system`에서 컴포넌트를 만들거나 수정할 때 반드시 따르는 작업 규칙이다.
목표는 semantic HTML, 명확한 관심사 분리, 일관된 폴더 구조, 유지 보수하기 쉬운 Web Components 기반 디자인 시스템을 만드는 것이다.

## Core Principles

### 1. Semantic HTML first

컴포넌트는 시각적 모양보다 문서 구조와 의미를 먼저 설계한다.

- 클릭 가능한 동작은 가능한 한 실제 `<button>`을 사용한다.
- 링크 이동은 실제 `<a>`를 사용한다.
- 목록은 `<ul>`, `<ol>`, `<li>`를 사용한다.
- 표 데이터는 `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`를 사용한다.
- 독립적인 콘텐츠 묶음은 `<section>`, `<article>`, `<header>`, `<footer>` 등을 검토한다.
- 제목이 필요한 영역은 heading tag (`h1`-`h6`)를 사용한다.
- 접힘/펼침 영역은 trigger와 content가 `aria-controls`, `aria-expanded`, `aria-labelledby`, `role="region"`으로 연결되어야 한다.
- 단순히 스타일을 주기 위해 `div`와 `span`만 남발하지 않는다.
- ARIA는 native semantic tag로 표현할 수 없을 때만 보완적으로 사용한다.

잘못된 예:

```html
<div class="trigger" onclick="...">Open</div>
```

좋은 예:

```html
<button type="button" aria-expanded="false" aria-controls="panel-id">
  Open
</button>
```

### 2. Design with behavior, states, and tokens

컴포넌트는 foundation token을 사용하는 디자인 단위다. 새 색상, spacing, radius, shadow 값을 임의로 만들지 않는다.

- 색상은 semantic color custom property 또는 기존 DS alias를 사용한다.
- spacing은 `--spacing-*` 또는 `--spacing-ds-*` 기반 클래스를 사용한다.
- radius는 foundation radius token 또는 DS radius alias를 사용한다.
- shadow는 foundation shadow token을 사용한다.
- hover, focus-visible, disabled, selected, open, loading 같은 상태를 반드시 고려한다.
- keyboard interaction을 설계한다. 특히 button, disclosure, menu, tab, dialog 류는 키보드 접근성이 필수다.
- component가 light/dark theme에서 깨지지 않도록 semantic token을 우선 사용한다.

### 3. Scope and concern separation

컴포넌트는 반드시 scope와 관심사별 folder로 나눈다.

- 모든 컴포넌트는 `src/components/{componentName}/` 아래에 둔다.
- `{componentName}` folder는 camelCase를 사용한다.
- component folder 밖에 컴포넌트 구현 파일을 직접 두지 않는다.
- root `src/components/index.ts`는 component barrel export만 담당한다.
- component folder의 `index.ts`는 해당 컴포넌트의 public API만 export한다.
- 구현, 타입, 스타일, 유틸, Storybook 코드를 필요에 따라 분리한다.

## Required Folder Structure

기본 구조:

```text
src/components/
  index.ts
  collapse/
    index.ts
    Collapse.tsx
    Collapse.stories.ts
```

컴포넌트가 커질 때 권장 구조:

```text
src/components/
  {componentName}/
    index.ts
    {Name}.tsx
    {Name}.stories.ts
    {Name}.types.ts
    {Name}.utils.ts
    {Name}.styles.ts
```

예시:

```text
src/components/
  collapse/
    index.ts
    Collapse.tsx
    Collapse.stories.ts
    Collapse.types.ts
    Collapse.utils.ts
    Collapse.styles.ts
```

## File Responsibilities

### `index.ts`

해당 folder의 public API만 export한다.

```ts
export { defineDsCollapse, DsCollapse, DsCollapseItem } from "./Collapse";
export type {
  CollapseCollapsible,
  CollapseExpandIconPlacement,
  CollapseItemProps,
  CollapseProps,
  CollapseSize
} from "./Collapse";
```

규칙:

- private helper는 export하지 않는다.
- Storybook 전용 값은 export하지 않는다.
- 외부 사용자가 import할 클래스, define 함수, 타입만 export한다.

### `{Name}.tsx`

컴포넌트의 주요 구현 파일이다.

담당:

- custom element class 정의
- lifecycle (`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback`)
- attribute/property getter/setter
- DOM 생성과 업데이트
- event wiring
- public define 함수

규칙:

- DOM 생성은 semantic tag를 우선한다.
- event listener를 추가했다면 필요 시 `disconnectedCallback`에서 제거한다.
- attribute 변경 시 전체 DOM을 무작정 다시 만들기보다 생성과 sync/update를 구분한다.
- boolean attribute는 `"false"` 문자열 처리 여부를 명확히 정의한다.
- custom element 이름은 `ds-{component-name}` 형식으로 쓴다.
- 복합 컴포넌트 item은 `ds-{component-name}-item`처럼 명확히 연결한다.

### `{Name}.stories.ts`

Storybook story 파일이다.

담당:

- default state
- 주요 variant
- 주요 interaction state
- edge case 또는 accessibility state

규칙:

- Story title은 `Components/{Name}` 형식을 사용한다.
- story는 실제 custom element를 렌더링한다.
- controls는 public API와 맞춘다.
- 문서 설명 텍스트로 UI 사용법을 과하게 적지 않는다.
- JSX를 쓰지 않으면 `.stories.ts`를 사용한다.
- JSX가 필요하면 `.stories.tsx`를 사용할 수 있다.

### `{Name}.types.ts`

타입이 많아지면 반드시 분리한다.

분리 기준:

- prop type이 3개 이상 생긴다.
- discriminated union이 생긴다.
- item/subcomponent type이 생긴다.
- callback detail type이 외부 API가 된다.
- 다른 파일에서 타입을 재사용한다.

예시:

```ts
export type CollapseSize = "large" | "middle" | "small";
export type CollapseExpandIconPlacement = "start" | "end";
export type CollapseCollapsible = "header" | "icon" | "disabled";
```

### `{Name}.utils.ts`

순수 helper를 분리한다.

분리 기준:

- 문자열 변환, key 생성, attribute normalize 같은 helper가 2개 이상이다.
- helper가 테스트 또는 재사용 대상이 될 수 있다.
- 구현 파일의 가독성을 흐린다.

예시:

```ts
export function normalizeBooleanAttribute(
  element: HTMLElement,
  name: string,
  defaultValue: boolean
) {
  const value = element.getAttribute(name);
  return value === null ? defaultValue : value !== "false";
}
```

### `{Name}.styles.ts`

현재 `remote-design-system`은 compiled CSS와 Tailwind layer를 중심으로 스타일을 관리한다.
다만 컴포넌트가 복잡해지고 JS에서 class name 조합이 필요해지면 styles 파일을 둔다.

사용 기준:

- state별 class name mapping이 복잡하다.
- slot 이름을 코드에서 공유해야 한다.
- component 내부에서 class name을 계산해야 한다.

CSS custom element selector와 Tailwind `@layer components`만으로 충분하면 `src/styles.css`에 작성할 수 있다.
단, styles가 커지면 component별 CSS 분리 전략을 별도로 수립한다.

## Component Design Checklist

새 컴포넌트를 만들기 전 아래를 먼저 결정한다.

1. 이 컴포넌트의 semantic root는 무엇인가?
   - `section`, `article`, `nav`, `form`, `fieldset`, `ul`, `table`, `dialog`, `div` 중 어떤 것이 맞는가?

2. 사용자가 상호작용하는 element는 native control인가?
   - click이면 `button`
   - navigation이면 `a`
   - text input이면 `input` 또는 `textarea`
   - choice면 `input type="checkbox"`, `radio`, `select` 검토

3. 상태는 무엇인가?
   - default
   - hover
   - focus-visible
   - disabled
   - selected/open/checked/expanded
   - loading/error/success

4. keyboard interaction이 필요한가?
   - Enter
   - Space
   - Escape
   - Arrow keys
   - Tab order

5. ARIA 연결이 필요한가?
   - `aria-expanded`
   - `aria-controls`
   - `aria-labelledby`
   - `aria-describedby`
   - `aria-disabled`
   - `role`

6. public API는 attribute로 충분한가?
   - string attribute
   - boolean attribute
   - reflected property
   - custom event detail

7. Storybook에서 무엇을 보여줘야 하는가?
   - default
   - size
   - variant
   - disabled
   - controlled-like state
   - accessibility/edge case

## Naming Conventions

### Folder and files

- folder: camelCase
  - `collapse`
  - `iconButton`
  - `toggleSwitch`
- main file: PascalCase
  - `Collapse.tsx`
  - `IconButton.tsx`
  - `ToggleSwitch.tsx`
- story file:
  - `Collapse.stories.ts`
  - `IconButton.stories.ts`
- optional files:
  - `Collapse.types.ts`
  - `Collapse.utils.ts`
  - `Collapse.styles.ts`

### Custom element names

- root: `ds-{component-name}`
- child/item: `ds-{component-name}-item`
- examples:
  - `ds-collapse`
  - `ds-collapse-item`
  - `ds-toggle-switch`

### Types

- props: `{Name}Props`
- item props: `{Name}ItemProps`
- size union: `{Name}Size`
- variant union: `{Name}Variant`
- state union: `{Name}State`
- custom event detail: `{Name}ChangeDetail`, `{Name}ToggleDetail`

### CSS classes

Use BEM-like classes scoped by component name:

```text
ds-collapse
ds-collapse-item
.ds-collapse__item
.ds-collapse__heading
.ds-collapse__trigger
.ds-collapse__body
```

Rules:

- class prefix must match the component.
- avoid generic classes like `.title`, `.content`, `.button`.
- slot-like internal elements should use `__`.
- state should prefer attributes on the custom element when possible:
  - `ds-collapse[data-ghost]`
  - `ds-collapse-item[open]`
  - `.ds-collapse__trigger[data-icon-only="true"]`

## Accessibility Rules

### Native controls

Prefer native HTML controls over recreated controls.

- Use `<button type="button">` for non-submit click actions.
- Use `<a href="...">` for navigation.
- Use `<input>` for editable fields.
- Use `<label>` to connect form labels.

### Keyboard support

If a native button is used, Enter and Space are handled by the browser.
If a native control cannot be used, manually implement keyboard behavior and set correct ARIA.

Avoid creating interactive `div` unless there is no native alternative.

### Focus

- Every interactive element must have visible focus state.
- Use `:focus-visible`, not only `:focus`.
- Disabled elements must not be focusable unless the pattern intentionally requires it.

### Regions and relationships

For disclosure/collapse-like components:

```html
<section>
  <h3>
    <button aria-expanded="true" aria-controls="panel-id" id="trigger-id">
      Panel title
    </button>
  </h3>
  <div id="panel-id" role="region" aria-labelledby="trigger-id">
    Panel content
  </div>
</section>
```

## Styling Rules

### Use existing tokens

Use existing foundation and DS aliases:

- color:
  - `--color-background-*`
  - `--color-content-*`
  - `--color-border-*`
  - `--color-action-*`
  - `--ds-color-*`
- font:
  - `--font-family-interface`
  - `--font-size-*`
  - `--ds-font-size-*`
- spacing:
  - `--spacing-*`
  - `--spacing-ds-*`
- radius:
  - `--radius-*`
  - `--radius-ds-*`
- shadow:
  - `--shadow-*`

Do not introduce one-off hardcoded colors unless there is a clear temporary reason.
If a new token is needed, add it to foundation first.

### Foundation-first styling workflow

When adding or changing component styles, always inspect the foundation layer first.
Component styling must be completed with existing foundation values whenever possible.

Before writing new component CSS, check:

- `src/foundation/color`
- `src/foundation/spacing`
- `src/foundation/radius`
- `src/foundation/shadow`
- `src/foundation/font`
- `src/foundation/breakpoint`
- `src/styles.css` theme aliases under `@theme static`
- `:root`, `[data-theme="light"]`, and `[data-theme="dark"]` CSS custom properties

Required order:

1. Find an existing foundation token that expresses the design need.
2. Use the token through a CSS custom property, DS alias, or Tailwind utility already wired to the token.
3. If no suitable token exists, decide whether the missing value is a reusable foundation decision or a component-only style.
4. If it is reusable across components, add or update the foundation token first.
5. If it is specific to one component, add the minimum necessary component style in `src/styles.css` or the component's `{Name}.styles.ts`.

Do not skip directly to hardcoded CSS values.

Allowed component-local styles:

- Layout structure that belongs only to the component.
- Semantic DOM slot styling, such as header/body/item/trigger layout.
- State selectors, such as `[open]`, `[disabled]`, `[data-ghost]`, `[data-borderless]`.
- Small visual details that are part of the component behavior and not reusable foundation decisions.

Examples:

```css
/* Good: uses DS/foundation aliases */
.ds-collapse__body {
  background: var(--color-background-surface);
  border-top: 1px solid var(--color-border-default);
  padding: var(--spacing-ds-4) var(--spacing-ds-5);
}
```

```css
/* Avoid unless there is no foundation token and the value is intentionally component-local */
.ds-collapse__heading {
  background: rgba(17, 19, 22, 0.02);
}
```

If a component is modeled after a reference system such as Ant Design, first translate the reference values into this design system's foundation tokens.
For example, Ant Design Collapse has header background, header padding, content background, content padding, border, radius, and icon motion.
Those should be mapped to foundation color, spacing, radius, and motion-like transition values before adding any new component CSS.

### States

At minimum, consider:

- default
- hover
- focus-visible
- disabled
- selected/open/expanded
- compact/large size variants if the component supports size

## Web Component Rules

### Registration

Every component must expose a define function.

```ts
export function defineDsCollapse(registry?: CustomElementRegistry) {
  const elementRegistry =
    registry ?? (typeof customElements === "undefined" ? undefined : customElements);

  if (!elementRegistry) {
    return;
  }

  if (!elementRegistry.get("ds-collapse")) {
    elementRegistry.define("ds-collapse", DsCollapse);
  }
}
```

The package root should call all component define functions through `defineDesignSystemElements()`.

### Attribute and property sync

- Public attributes should have matching getters/setters when useful.
- Boolean attributes must document default behavior.
- Avoid infinite loops in `attributeChangedCallback`.
- Keep initial DOM creation separate from state sync when the component grows.

### Custom events

Use custom events for meaningful state changes.

```ts
this.dispatchEvent(
  new CustomEvent("ds-collapse-toggle", {
    bubbles: true,
    detail: {
      itemKey: this.itemKey,
      open: this.open
    }
  })
);
```

Rules:

- Event name starts with `ds-{component-name}-`.
- Event bubbles when parent components need to react.
- `detail` should be typed.

## Storybook Rules

Stories must help verify the component surface, not just show a happy path.

Every component should include:

- `Default`
- primary size or variant stories
- disabled/read-only state if applicable
- interaction state if applicable
- composition story if the component has item/child elements

Story title:

```ts
title: "Components/Collapse"
```

Story args should map to public attributes and properties.

## Build and Verification

After component work, run:

```bash
corepack pnpm --filter @portfolio/remote-design-system typecheck
corepack pnpm --filter @portfolio/remote-design-system build:lib
git diff --check
```

When Storybook behavior is changed, also consider:

```bash
corepack pnpm --filter @portfolio/remote-design-system dev:storybook
```

## Review Checklist

Before finishing component work, verify:

- The component lives under `src/components/{componentName}/`.
- The folder has `index.ts`.
- The main implementation is `{Name}.tsx`.
- Storybook file is `{Name}.stories.ts` or `{Name}.stories.tsx`.
- Optional concerns are split into `.types.ts`, `.utils.ts`, `.styles.ts` when needed.
- The DOM uses semantic tags where possible.
- Interactive elements are native controls.
- ARIA relationships are present and correct.
- Keyboard behavior works.
- Focus-visible styling exists.
- Styling was written after checking foundation tokens and DS aliases first.
- New component-only CSS is minimal and scoped to the component.
- Root `src/components/index.ts` exports the component.
- Root `src/index.ts` re-exports the component and registers it.
- Typecheck and build pass.
