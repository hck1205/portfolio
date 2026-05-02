---
name: remote-design-system-component
description: Build and refine components in apps/remote-design-system. Use when creating or reviewing DS Web Components one by one, especially for component folder structure, foundation token usage, semantic HTML, accessibility, performance, Storybook stories, docs, JSDoc, icons, bug prevention, and maintainable separation of concerns.
---

# Remote Design System Component Skill

Use this skill when building, refactoring, or reviewing a component in `apps/remote-design-system`.
The current reference pattern is `src/components/Collapse`: a Web Component with a root element,
item element, typed public API, Storybook stories, foundation-driven styles, semantic markup, and
explicit parent-child state sync.

## Goals

Build components that are:

- semantic by default
- accessible by keyboard and screen reader
- token-driven through foundation and DS aliases
- split by clear responsibility
- documented with useful JSDoc
- covered by Storybook stories and docs descriptions
- simple enough to maintain
- performant under repeated instances
- free of known behavioral bugs before handoff

## Workflow

1. Inspect the existing DS patterns before editing:
   - `src/components/Collapse`
   - `src/styles.css`
   - `src/foundation`
   - `src/components/index.ts`
   - `src/index.ts`

2. Define the component contract first:
   - custom element name
   - attributes and reflected properties
   - boolean defaults
   - event names and typed event detail
   - child/item elements if compound
   - states: default, hover, focus-visible, disabled, open/selected/checked, loading/error if applicable

3. Design semantic DOM before styling:
   - use native controls for interaction
   - define ARIA relationships only where native semantics are not enough
   - confirm heading, region, list, table, form, or navigation semantics

4. Implement in small files:
   - create DOM once
   - sync state separately
   - keep styles, types, constants, registration, and DOM helpers split when they grow

5. Add Storybook stories:
   - stories render the actual custom element
   - docs descriptions explain the variant in Korean
   - canvas should show the component, not duplicate explanatory text

6. Verify:
   - `corepack pnpm --filter @portfolio/remote-design-system typecheck`
   - `corepack pnpm --filter @portfolio/remote-design-system build:lib`
   - `git diff --check`

## Folder Structure

Use this structure for non-trivial components:

```text
src/components/{ComponentName}/
  index.ts
  {ComponentName}.tsx
  {ComponentName}.stories.ts
  constants/
    {ComponentName}.constants.ts
  dom/
    {ComponentName}.dom.ts
  item/
    {ComponentName}Item.tsx
    {ComponentName}Item.render.ts
    {ComponentName}Item.styles.ts
  registration/
    defineDs{ComponentName}.ts
  types/
    {ComponentName}.types.ts
```

Use fewer files for simple components. Split a file when it mixes multiple responsibilities or becomes hard to scan.

### File Responsibilities

- `{ComponentName}.tsx`: root custom element class, lifecycle, parent-level state, public getters/setters.
- `{ComponentName}Item.tsx`: child item custom element class, item state, item lifecycle.
- `*.render.ts`: DOM creation and DOM sync helpers. No business rules beyond rendering.
- `*.styles.ts`: component shadow styles or style maps. Prefer shared `CSSStyleSheet` for repeated instances.
- `*.types.ts`: public props, unions, and custom event detail types.
- `*.constants.ts`: element names, observed attributes, event names, stable default values.
- `*.dom.ts`: reusable DOM helpers such as id generation and boolean attribute normalization.
- `registration/define*.ts`: custom element registration with SSR-safe `customElements` guards.
- `index.ts`: public exports only.
  Prefer `export * from "./PublicModule"` in barrel files when the target module is already a public
  API boundary. Do not use `export *` for private helpers such as render, styles, DOM helpers,
  constants, or test/story-only data unless that folder has intentionally made them public.

## Reference Pattern: Collapse

Follow the Collapse decisions for similar compound/disclosure components:

- root element: `ds-collapse`
- child element: `ds-collapse-item`
- root controls item state through direct children only
- nested component events are ignored by ancestors that do not own them
- child emits a typed bubbling event such as `ds-collapse-toggle`
- parent syncs child state through an explicit method such as `syncFromParent`
- do not call lifecycle callbacks manually
- create internal DOM once, then sync text, ARIA, state attributes, and child order
- style Shadow DOM internals in component-local styles, not unreachable global CSS
- share repeated shadow styles with `adoptedStyleSheets` when available, with a `<style>` fallback
- expose heading semantics with a configurable level when the component can appear in many document contexts

## Semantic HTML Rules

Prefer real elements over ARIA recreations:

- click action: `<button type="button">`
- navigation: `<a href="...">`
- text input: `<input>` or `<textarea>`
- grouped form options: `<fieldset>` and `<legend>`
- list: `<ul>`, `<ol>`, `<li>`
- tabular data: `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- disclosure region: trigger button plus controlled panel

Disclosure-style pattern:

```html
<section>
  <div role="heading" aria-level="3">
    <button type="button" aria-expanded="true" aria-controls="panel-id" id="trigger-id">
      Panel title
    </button>
  </div>
  <div id="panel-id" role="region" aria-labelledby="trigger-id">
    Panel content
  </div>
</section>
```

Use `role="heading"` with configurable `aria-level` when a fixed `h2` or `h3` would break the host page outline.

## Accessibility Rules

- Every interactive element must be keyboard reachable.
- Prefer native controls so Enter, Space, focus, disabled behavior, and forms work naturally.
- Use `:focus-visible` and ensure a visible token-based focus ring.
- Use `aria-expanded` and `aria-controls` for disclosure triggers.
- Use `aria-labelledby` or `aria-describedby` when visual labels or descriptions exist.
- Disabled controls must communicate disabled state visually and semantically.
- Do not hide focus outlines without replacement.
- Do not put interactive controls inside other interactive controls.

## Foundation-First Styling

Never invent visual values before checking foundation.

Check:

- `src/foundation/color`
- `src/foundation/spacing`
- `src/foundation/radius`
- `src/foundation/shadow`
- `src/foundation/font`
- `src/foundation/breakpoint`
- `src/styles.css` aliases in `@theme static`, `:root`, and theme blocks

Use existing aliases first:

- color: `--color-ds-*`, `--color-background-*`, `--color-content-*`, `--color-border-*`, `--color-action-*`
- spacing: `--spacing-*`, `--spacing-ds-*`
- radius: `--radius-*`, `--radius-ds-*`
- shadow: `--shadow-*`, `--shadow-ds-*`
- type: `--font-*`, `--text-ds-*`, `--leading-ds-*`
- focus: `--ds-focus-ring-width`, `--ds-focus-ring-offset`, `--color-ds-primary`

Allowed component-local styles:

- layout of internal slots such as header, trigger, body, item, panel
- state selectors such as `[open]`, `[disabled]`, `[data-variant]`
- small behavior-specific transitions
- Shadow DOM internal styles

Avoid:

- hardcoded colors
- hardcoded spacing where a token exists
- `transition: all`
- global CSS that targets Shadow DOM internals
- component styles that duplicate the same rules in two places

## Performance Rules

- Create DOM structure once; update only changed attributes, text, hidden state, and ARIA.
- Avoid full re-render on every attribute change when a targeted sync is enough.
- Use direct children for parent-child coordination unless descendants are intentionally included.
- Ignore bubbled child events from nested components not owned by the current parent.
- Remove global event listeners, observers, timers, and subscriptions in `disconnectedCallback`.
- Use `MutationObserver` only for the narrow subtree needed.
- Share heavy styles across instances with constructable stylesheets when possible.
- Avoid repeated query selectors inside tight loops when references can be stored.
- Avoid layout thrashing: do not alternate reads and writes repeatedly.

## JSDoc Rules

Add JSDoc where it helps future component authors understand behavior, not where it repeats code.

Document:

- custom element lifecycle methods with component-specific intent
- non-obvious getters/setters and boolean attribute defaults
- custom event detail and when events fire
- parent-child sync rules
- accessibility decisions
- helpers whose behavior is easy to misuse

Keep JSDoc concise. Prefer:

```ts
/**
 * Syncs parent-controlled settings into the item without relying on lifecycle callbacks.
 */
syncFromParent(options: SyncOptions) {
  ...
}
```

Avoid comments like "sets the value" when the assignment is obvious.

## Icon Rules

- Use an existing icon package already installed in the project, such as `lucide`, before creating custom SVG.
- Icons inside buttons should be decorative unless they are the only label.
- Set decorative icons to `aria-hidden="true"` and `focusable="false"`.
- Icon-only buttons must have an accessible name through `aria-label`.
- Use `currentColor` behavior so icons inherit token-driven text color.
- Keep icon size token-driven.

## Storybook Rules

Every component should include stories for:

- `Default`
- key variants
- sizes if supported
- disabled/read-only if applicable
- controlled or initial state if applicable
- compound/item usage if applicable
- edge cases that could break layout or accessibility

Story rules:

- title format: `Components/{ComponentName}`
- render actual custom elements, not approximations
- map controls to public API only
- write component and story Docs descriptions in Korean
- keep explanatory text in Docs descriptions, not inside every story canvas
- keep stories deterministic and small
- use `.stories.ts` when no JSX is needed

## Docs Rules

For component docs:

- explain purpose and when to use in Korean
- document attributes/properties in Korean
- document custom events and `detail` in Korean
- document slots or child elements in Korean
- document accessibility behavior in Korean
- document known constraints in Korean

Docs should complement stories. Do not duplicate long descriptions inside the rendered component preview.

## Public API and Exports

Each component must expose:

- root custom element class
- item/subcomponent classes when public
- `defineDs{ComponentName}` registration function
- public types

Update:

- component folder `index.ts`
- `src/components/index.ts`
- root `src/index.ts`
- `defineDesignSystemElements()`

Barrel export convention:

- Component folder `index.ts` files should use `export *` from public modules only: the root element,
  public child/subcomponent elements, registration function, and public types.
- `src/components/index.ts`, `src/foundation/index.ts`, and root `src/index.ts` should prefer
  `export * from "./..."` instead of manually repeating every exported symbol.
- Keep `defineDesignSystemElements()` imports explicit because those runtime functions are executed,
  not only re-exported.
- Do not export private render helpers, stylesheets, constants, DOM helpers, or test-only data from
  public barrels.

Do not export private render helpers, internal styles, or test-only data.

## Bug Prevention Checklist

Before finishing, verify:

- no lifecycle callback is called manually
- no nested component is accidentally controlled by an ancestor
- boolean attributes handle missing, present, and `"false"` values intentionally
- default attributes do not cause infinite `attributeChangedCallback` loops
- custom events are typed and named `ds-{component}-{action}`
- IDs used for ARIA are unique per instance
- disconnected components clean up listeners and observers
- Shadow DOM styles are reachable and not duplicated in global CSS
- focus-visible styles are present
- disabled state blocks interaction
- keyboard behavior works
- Storybook controls reflect public API
- Storybook Docs descriptions are written in Korean
- docs descriptions are not duplicated in story canvas
- typecheck and build pass

## Completion Criteria

A DS component is complete only when:

- implementation follows existing repository patterns
- semantics and accessibility are intentionally designed
- foundation tokens are used wherever possible
- component concerns are split when complexity warrants it
- JSDoc explains non-obvious behavior
- icons are accessible and token-driven
- stories cover main variants and interactions
- docs explain usage and events
- typecheck passes
- library build passes
- no known bugs remain unaddressed
