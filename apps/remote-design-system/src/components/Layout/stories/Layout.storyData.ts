import { BarChart3, Boxes, FileText, Home, Inbox, Settings, Users } from "lucide";

import type { ContentCopy, HeaderItem, LayoutStoryArgs, SideItem, SideKey } from "./Layout.storyTypes";

export const defaultLayoutArgs = {
  breakpoint: undefined,
  collapsed: false,
  collapsedWidth: 64,
  collapsible: true,
  reverseArrow: false,
  theme: "dark",
  width: "216"
} satisfies LayoutStoryArgs;

export const headerItems: HeaderItem[] = [
  { key: "overview", label: "Overview" },
  { key: "reports", label: "Reports" },
  { key: "customers", label: "Customers" },
  { key: "settings", label: "Settings" }
];

export const sideItems: SideItem[] = [
  { icon: Home, key: "home", label: "Home" },
  { icon: Inbox, key: "inbox", label: "Inbox" },
  { icon: BarChart3, key: "analytics", label: "Analytics" },
  { icon: FileText, key: "documents", label: "Documents" },
  { icon: Users, key: "teams", label: "Teams" },
  { icon: Boxes, key: "billing", label: "Billing" },
  { icon: Settings, key: "admin", label: "Admin" }
];

const sideCopy: Record<SideKey, string> = {
  home: "핵심 지표와 빠른 작업을 한 화면에서 확인합니다.",
  inbox: "읽지 않은 요청, 승인 대기 항목, 최근 알림을 우선순위대로 정리합니다.",
  analytics: "방문, 전환, 유지율을 요약해 현재 흐름을 빠르게 파악합니다.",
  documents: "최근 문서와 공유된 자료를 작업 맥락에 맞게 보여줍니다.",
  teams: "팀별 상태와 협업 이슈를 한 번에 확인합니다.",
  billing: "청구 예정 금액과 결제 상태를 요약합니다.",
  admin: "관리자 설정과 권한 변경 내역을 확인합니다."
};

function createContentGroup(section: string) {
  return Object.fromEntries(
    (Object.keys(sideCopy) as SideKey[]).map((sideKey) => [
      sideKey,
      {
        title: `${section} / ${sideKey[0].toUpperCase()}${sideKey.slice(1)}`,
        body: `${section} 영역에서 ${sideCopy[sideKey]}`
      }
    ])
  ) as ContentCopy["overview"];
}

export const contentCopy: ContentCopy = {
  overview: createContentGroup("Overview"),
  reports: createContentGroup("Reports"),
  customers: createContentGroup("Customers"),
  settings: createContentGroup("Settings")
};

export const storyDescriptions = {
  application:
    "Header, Sider, Content, Footer로 구성한 애플리케이션 레이아웃입니다. Header nav와 Sider menu는 active 상태를 바꾸고 선택 조합에 따라 Content가 갱신됩니다.",
  headerContentFooter: "Header, Content, Footer가 세로로 쌓이는 가장 기본적인 페이지 구조입니다.",
  headerLeftSiderContentFooter:
    "Header 아래에 Sider와 Content가 나란히 놓이고 Footer가 하단에 위치하는 구조입니다.",
  headerContentRightSiderFooter:
    "Header 아래에서 Content가 왼쪽, Sider가 오른쪽에 놓이고 Footer가 하단에 위치하는 구조입니다.",
  leftSiderHeaderContentFooter:
    "Sider가 전체 높이를 차지하고, 오른쪽 영역 안에 Header, Content, Footer가 쌓이는 구조입니다.",
  responsive:
    "breakpoint 아래에서 Sider가 64px로 접히며 메뉴 아이콘만 남는 passive responsive 예시입니다.",
  siderContent: "Sider and Content only. This story omits Header and Footer to show the lean side navigation layout.",
  customTriggerIcon:
    "Uses slot=\"trigger\" to replace the default collapse trigger content with custom expand/collapse icons and label.",
  scrollableSider:
    "Sider 안에 많은 메뉴가 들어가도 Sider body만 스크롤됩니다. collapse 버튼은 스크롤 영역 밖 상단에 남습니다."
};
