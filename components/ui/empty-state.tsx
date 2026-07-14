import { Button } from "@/components/ui/button";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading } from "@/components/ui/section-heading";

type EmptyStateProps = {
  heading: string;
  subtext: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  heading,
  subtext,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="mx-auto max-w-md py-16 text-center"
    >
      <EyebrowLabel>nothing here yet</EyebrowLabel>
      <SectionHeading as="h3" className="mt-3">
        {heading}
      </SectionHeading>
      <p className="text-body-gray mt-4 text-sm leading-relaxed">{subtext}</p>
      {actionLabel && actionHref && (
        <div className="mt-6 flex justify-center">
          <Button href={actionHref} variant="outline" size="md">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
