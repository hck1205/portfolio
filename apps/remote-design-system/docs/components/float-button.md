# FloatButton

`ds-float-button`은 페이지 어디에서나 접근해야 하는 전역 액션을 화면 위에 고정해 보여주는 컴포넌트입니다. Ant Design FloatButton의 기본 모델을 따르되, DS Web Component 구조에 맞춰 native `<button>`과 `<a>`를 사용합니다.

## Attributes

| Attribute | Values | Default | Notes |
| --- | --- | --- | --- |
| `type` | `default`, `primary` | `default` | 기본 버튼과 주요 액션 버튼 스타일을 전환합니다. |
| `shape` | `circle`, `square` | `circle` | `content`를 함께 보여줄 때는 `square`가 적합합니다. |
| `content` | string | empty | 짧은 텍스트를 버튼 내부에 표시합니다. `circle`에서는 숨겨집니다. |
| `tooltip` | string | empty | native `title`과 접근 가능한 이름 후보로 사용됩니다. |
| `badge` | string | empty | 버튼 우측 상단에 짧은 배지를 표시합니다. |
| `back-top` | boolean | `false` | 클릭 시 window 스크롤을 맨 위로 이동합니다. |
| `visibility-height` | number | `400` | `back-top` 버튼이 나타나는 최소 스크롤 높이입니다. |
| `disabled` | boolean | `false` | 클릭과 링크 이동을 막습니다. |
| `href` | string | empty | 값이 있으면 내부 컨트롤을 앵커로 렌더링합니다. |
| `target` | string | empty | `href`가 있을 때 앵커에 적용됩니다. |
| `rel` | string | empty | `_blank` 링크는 기본적으로 `noreferrer`를 사용합니다. |
| `html-type` | `button`, `submit`, `reset` | `button` | native button일 때만 적용됩니다. |

## Group Attributes

| Attribute | Values | Default | Notes |
| --- | --- | --- | --- |
| `shape` | `circle`, `square` | `circle` | 직접 자식 `ds-float-button`의 shape에 동기화됩니다. |
| `placement` | `top`, `right`, `bottom`, `left` | `top` | 메뉴 버튼 기준으로 목록이 펼쳐지는 방향입니다. |
| `trigger` | `click`, `hover` | empty | 값이 있으면 메뉴 모드로 동작합니다. |
| `open` | boolean | `false` | 메뉴 목록의 열린 상태입니다. |

## Slots

| Element | Slot | Purpose |
| --- | --- | --- |
| `ds-float-button` | `icon` | 버튼 아이콘입니다. 장식용 아이콘은 `aria-hidden="true"`를 사용합니다. |
| `ds-float-button-group` | default | 직접 자식 `ds-float-button` 목록입니다. |

## Events

| Event | Detail |
| --- | --- |
| `ds-float-button-click` | `{ backTop: boolean; href: string; nativeEvent: MouseEvent }` |
| `ds-float-button-group-open-change` | `{ open: boolean; nativeEvent?: Event }` |

## Accessibility

- 내부 컨트롤은 기본적으로 native `<button>`을 사용하고, `href`가 있으면 native `<a>`를 사용합니다.
- `aria-label`, `tooltip`, `content`, `back-top` 순서로 접근 가능한 이름을 보완합니다.
- `disabled` 상태는 시각적으로 표시되고 상호작용을 막습니다.
- 메뉴 모드의 group trigger는 `aria-expanded`로 열린 상태를 전달합니다.
- focus 스타일은 DS focus token을 사용합니다.
