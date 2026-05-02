export type AnchorActiveCandidate = {
  distance: number;
  href: string;
  visibleSize: number;
};

export type AnchorActiveResult = {
  href: string;
  shouldClearPending: boolean;
};

const PENDING_TARGET_THRESHOLD = 2;
const SETTLED_TARGET_DISTANCE = 8;

function getMostVisibleCandidate(candidates: AnchorActiveCandidate[]) {
  let mostVisibleCandidate = candidates[0];

  for (const candidate of candidates) {
    if (candidate.visibleSize > mostVisibleCandidate.visibleSize) {
      mostVisibleCandidate = candidate;
    }
  }

  return mostVisibleCandidate;
}

function getNearestCandidate(candidates: AnchorActiveCandidate[], targetDistance = 0) {
  return candidates.reduce((nearest, candidate) =>
    Math.abs(candidate.distance - targetDistance) < Math.abs(nearest.distance - targetDistance) ? candidate : nearest
  );
}

export function resolveAnchorActiveHref({
  candidates,
  isAtEnd,
  pendingHref,
  settled
}: {
  candidates: AnchorActiveCandidate[];
  isAtEnd: boolean;
  pendingHref: string;
  settled: boolean;
}): AnchorActiveResult {
  if (!candidates.length) {
    return {
      href: "",
      shouldClearPending: false
    };
  }

  if (pendingHref) {
    const pendingCandidate = candidates.find((candidate) => candidate.href === pendingHref);

    if (!pendingCandidate) {
      return {
        href: "",
        shouldClearPending: true
      };
    }

    if (Math.abs(pendingCandidate.distance) <= PENDING_TARGET_THRESHOLD || isAtEnd) {
      return {
        href: "",
        shouldClearPending: true
      };
    }

    return {
      href: pendingHref,
      shouldClearPending: false
    };
  }

  if (isAtEnd) {
    return {
      href: candidates[candidates.length - 1]?.href ?? "",
      shouldClearPending: false
    };
  }

  const mostVisibleCandidate = getMostVisibleCandidate(candidates);

  if (mostVisibleCandidate.visibleSize > 0) {
    return {
      href: mostVisibleCandidate.href,
      shouldClearPending: false
    };
  }

  return {
    href: getNearestCandidate(candidates, settled ? SETTLED_TARGET_DISTANCE : 0).href,
    shouldClearPending: false
  };
}
