import FallbackView from "./Fallback.view";
import type { FallbackProps } from "./Fallback.types";

/**
 * Host 앱 전체에서 재사용하는 단일 fallback component입니다.
 *
 * 비동기 로딩, remote app 미기동, status 확인 중 같은 비정상/대기 상태를 하나의 UI로 통일합니다.
 */
function Fallback(props: FallbackProps) {
  return <FallbackView {...props} />;
}

export default Fallback;
