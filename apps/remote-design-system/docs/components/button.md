# Button

`ds-button` triggers an operation. It follows Ant Design's Button model while staying native to the remote design system: semantic `<button>` by default, semantic `<a>` when `href` is present, foundation-backed tokens, accessible loading and disabled states, and icon support through a named slot.

## Attributes

| Attribute | Values | Default | Notes |
| --- | --- | --- | --- |
| `type` | `default`, `primary`, `dashed`, `text`, `link` | `default` | Syntactic sugar for common AntD-style appearances. |
| `color` | `default`, `primary`, `danger` | derived | Overrides `type` color when present. |
| `variant` | `outlined`, `dashed`, `solid`, `filled`, `text`, `link` | derived | Overrides `type` variant when present. |
| `size` | `small`, `middle`, `large` | `middle` | Controls height, padding, and text size. |
| `shape` | `default`, `round`, `circle` | `default` | `circle` is intended for icon-only buttons. |
| `icon-placement` | `start`, `end` | `start` | Places the named icon slot before or after content. |
| `block` | boolean | `false` | Makes the button fill its parent width. |
| `danger` | boolean | `false` | Syntactic sugar for danger intent. |
| `disabled` | boolean | `false` | Blocks interaction. |
| `ghost` | boolean | `false` | Transparent style for complex backgrounds. |
| `loading` | boolean | `false` | Shows a spinner and blocks repeated clicks. |
| `href` | string | empty | Renders the internal control as an anchor. |
| `target` | string | empty | Applied only when `href` is present. |
| `rel` | string | empty | Defaults to `noreferrer` for `_blank` links. |
| `html-type` | `button`, `submit`, `reset` | `button` | Applied only to native button controls. |

## Slots

| Slot | Purpose |
| --- | --- |
| default | Button label/content. |
| `icon` | Optional icon. Use decorative icons with `aria-hidden="true"`. |

## Events

| Event | Detail |
| --- | --- |
| `ds-button-click` | `{ href: string; loading: boolean; nativeEvent: MouseEvent }` |

The native `click` event still fires. `ds-button-click` is provided for design-system integrations that prefer typed custom events.

## Accessibility

- Uses a native `<button>` unless `href` is present.
- Uses a native `<a>` when linking.
- Loading and disabled states block interaction.
- Icon-only/circle buttons must provide `aria-label`.
- Focus styling uses DS focus tokens.

