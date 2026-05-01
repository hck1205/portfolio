# Typography

`ds-typography`는 제목, 본문, 보조 텍스트를 의미 있는 HTML과 DS foundation token으로 표현하는 컴포넌트입니다. 프로젝트 typography spec의 `typo-name` 토큰을 우선 API로 제공합니다.

## Attributes

| Attribute | Values | Default | Notes |
| --- | --- | --- | --- |
| `typo-name` | `{Scope}/{Scale}/{Level}/{Weight}` | `Normal/Body/3/Normal` | spec의 Typography token 이름입니다. 예: `Normal/Title/3/Bold`, `UI/Button/3/Normal`. |
| `as` | safe HTML tag | derived | 내부 semantic element를 직접 지정합니다. 없으면 `variant`, `level`, `href`에서 파생합니다. |
| `variant` | `text`, `title`, `paragraph` | `text` | 내부 semantic element를 `span`/`a`, `h1`-`h5`, `p`로 전환합니다. |
| `level` | `1`, `2`, `3`, `4`, `5` | `1` | `variant="title"`일 때 제목 계층을 지정합니다. |
| `type` | `default`, `secondary`, `success`, `warning`, `danger` | `default` | 텍스트 상태 색상을 지정합니다. |
| `color-token` | foundation color token | empty | 예: `Grayscale/Solid/G7`. CSS 변수로 변환해 색상을 적용합니다. |
| `color` | CSS color | empty | 직접 색상을 지정합니다. `color-token`보다 우선합니다. |
| `text-overflow` | `none`, `truncate`, `break` | `none` | spec의 textOverflow 규칙을 Web Component 속성으로 제공합니다. |
| `display` | CSS display keyword | empty | spec의 display prop을 반영합니다. |
| `text-align` | `left`, `right`, `center`, `justify`, `start`, `end` | empty | spec의 textAlign prop을 반영합니다. |
| `text-decoration` | `overline`, `underline`, `line-through`, `none` | empty | spec의 textDecoration prop을 반영합니다. |
| `strong` | boolean | `false` | 굵은 텍스트를 적용합니다. |
| `italic` | boolean | `false` | 기울임 텍스트를 적용합니다. |
| `underline` | boolean | `false` | 밑줄을 적용합니다. |
| `delete` | boolean | `false` | 취소선을 적용합니다. |
| `mark` | boolean | `false` | 강조 배경을 적용합니다. |
| `code` | boolean | `false` | inline code 스타일을 적용합니다. |
| `keyboard` | boolean | `false` | keyboard key 스타일을 적용합니다. |
| `copyable` | boolean | `false` | 복사 버튼을 표시합니다. |
| `editable` | boolean | `false` | 편집 버튼과 textarea 편집 상태를 제공합니다. |
| `ellipsis` | boolean | `false` | 지정한 줄 수에서 말줄임 처리합니다. |
| `rows` | number | `1` | `ellipsis`가 켜졌을 때 표시할 줄 수입니다. |
| `disabled` | boolean | `false` | 시각적으로 비활성 상태를 표시하고 액션을 막습니다. |
| `href` | string | empty | `variant="text"`에서 내부 요소를 anchor로 렌더링합니다. |
| `target` | string | empty | anchor에 적용됩니다. |
| `rel` | string | empty | `_blank` 링크는 기본적으로 `noreferrer`를 사용합니다. |

## Slots

| Slot | Purpose |
| --- | --- |
| default | 표시할 텍스트 또는 inline content입니다. |

## Events

| Event | Detail |
| --- | --- |
| `ds-typography-copy` | `{ text: string }` |
| `ds-typography-edit-start` | `{ value: string }` |
| `ds-typography-edit-end` | `{ value: string }` |
| `ds-typography-edit-cancel` | `{ value: string }` |

## Typo Name

`typo-name`은 typography spec의 `{Category}/{Type}/{Level}/{Weight}` 형식을 따릅니다.

- Category: `Normal`, `UI`
- Type: `Display`, `Headline`, `Title`, `Subtitle`, `Body`, `Label`, `Callout`, `Footnote`, `Button`
- Weight: `Normal`, `Medium`, `SemiBold`, `Bold`

`LargeTitle`은 `Normal/LargeTitle/Bold`처럼 level 없이 사용할 수 있습니다.

## Accessibility

- `title` variant는 실제 `h1`부터 `h5`까지의 heading element를 렌더링합니다.
- `paragraph` variant는 실제 `p` element를 렌더링합니다.
- `href`가 있으면 native anchor를 사용합니다.
- 복사와 편집 액션은 native button을 사용하며 keyboard focus ring을 제공합니다.
- `disabled` 상태에서는 복사와 편집 액션을 숨기고 링크 이동을 막습니다.
