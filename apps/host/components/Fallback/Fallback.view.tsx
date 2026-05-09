import { FallbackRoot } from "./Fallback.styles";
import type { FallbackProps } from "./Fallback.types";

/**
 * Host 영역에서 remote 상태, loading 상태, unavailable 상태를 동일한 화면 패턴으로 보여줍니다.
 */
function FallbackView({ children = "Not live" }: FallbackProps) {
  return <FallbackRoot>{children}</FallbackRoot>;
}

export default FallbackView;
