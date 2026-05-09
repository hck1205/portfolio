const ONBOARDING_GUIDE_PATH = "/settings/guide";
const ABOUT_PATH = "/settings/about";
const ONBOARDING_GUIDE_LINK_SELECTOR = 'a[href*="path=/settings/guide"]';

/**
 * Keeps direct navigation to Storybook's onboarding guide out of the design-system manager.
 * Storybook exposes the guide in development mode without a dedicated removal flag, so direct
 * guide URLs are normalized to the stable about screen before the manager route settles.
 */
function redirectOnboardingGuideRoute() {
  const url = new URL(window.location.href);

  if (url.searchParams.get("path") !== ONBOARDING_GUIDE_PATH) {
    return;
  }

  url.searchParams.set("path", ABOUT_PATH);
  window.history.replaceState(window.history.state, "", url);
}

/**
 * Removes Storybook onboarding guide links from manager chrome after Storybook mounts them.
 * The sidebar checklist itself is disabled through the official feature flag in main.ts; this
 * only handles the remaining settings-menu entry that Storybook renders in development mode.
 */
function removeOnboardingGuideLinks(root: ParentNode) {
  root.querySelectorAll<HTMLAnchorElement>(ONBOARDING_GUIDE_LINK_SELECTOR).forEach((link) => {
    const menuItem = link.closest('[role="menuitem"], li, [data-radix-collection-item]');

    (menuItem ?? link).remove();
  });
}

/**
 * Watches Storybook manager chrome for lazy-mounted settings content and prunes the guide entry.
 * The observer is intentionally scoped to links pointing at the guide route so unrelated manager
 * controls such as context menus, shortcuts, and open-in-editor remain available.
 */
function watchOnboardingGuideLinks() {
  const pruneDocument = () => removeOnboardingGuideLinks(document);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", pruneDocument, { once: true });
  } else {
    pruneDocument();
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element || node instanceof DocumentFragment) {
          removeOnboardingGuideLinks(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", redirectOnboardingGuideRoute);
}

redirectOnboardingGuideRoute();
watchOnboardingGuideLinks();

export {};
