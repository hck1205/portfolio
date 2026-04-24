import { Button, SurfaceCard } from "@portfolio/ui";

export default function DesignSystemShowcase() {
  return (
    <div className="remote-design-showcase">
      <SurfaceCard eyebrow="Federated UI" title="Design System Remote">
        <div className="ds-stack">
          <p>
            This component is exposed by <strong>@portfolio/remote-design-system</strong> and
            consumed by the Shell app at runtime through Module Federation.
          </p>
          <div className="remote-design-actions">
            <Button>Primary action</Button>
            <Button tone="neutral">Neutral action</Button>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
