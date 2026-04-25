# Shell App and UI Package Management

## Summary

This document records the current management rules for the shell, live apps, the design system remote, and the shared UI package.

## App Ownership

- `apps/shell` owns the navigation surface and shell-only screens.
- `apps/remote-ax` is a live Module Federation remote.
- `apps/remote-design-system` is the live Storybook/design-system app shown through an iframe.
- `packages/ui` owns reusable UI components and is prepared as an npm package.

`Overview` is not a standalone app. It is part of the shell and lives under:

```txt
apps/shell/components/Overview/
```

## Live State

Navigation items use `live` to describe whether the shell can render a real injected app.

- `live: true` means the shell renders a real app surface, such as a Module Federation remote or iframe.
- `live: false` means the shell shows `not live`.
- `Overview` is shell-owned, so it does not display a live state in the nav.

## Shell Component Pattern

Shell-owned feature components should use this file shape:

```txt
ComponentName/
  ComponentName.tsx
  ComponentName.view.tsx
  ComponentName.styled.ts
  ComponentName.utils.ts
  ComponentName.types.ts
  index.ts
```

- `ComponentName.tsx` owns business logic and data preparation.
- `ComponentName.view.tsx` owns UI rendering.
- `ComponentName.styled.ts` owns class name constants.
- `ComponentName.utils.ts` owns local helpers.
- `ComponentName.types.ts` owns local types.
- `index.ts` only re-exports the public component.

## Live App Injection

Live injected apps are handled by:

```txt
apps/shell/components/LiveApp/
```

`LiveApp.const.ts` owns the app id constants. `LiveApp.tsx` uses a `switch` statement to map live app ids to their injection method.

Current live injection methods:

- `AX`: Module Federation remote.
- `Design System`: iframe.

## UI Package

`packages/ui` is the npm-package boundary for reusable UI.

It builds to `dist` with:

- ESM output
- CJS output
- Type declarations
- CSS output

Consumers should import it like this:

```ts
import { Button, SurfaceCard } from "@portfolio/ui";
import "@portfolio/ui/styles.css";
```

The design system app consumes `@portfolio/ui`; it does not own the reusable component source.
