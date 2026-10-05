import { ChevronRight } from "lucide-react";
import Section, { type SectionProps } from "../shared/section";
import StepCard, { type Step } from "../shared/cards/step-card";
import { DEFAULT_STEPS } from "../../data";

export type { Step };

export type HowItWorksProps = {
  steps?: Step[];
  title?: string;
  description?: string;
  viewMore?: SectionProps["viewMore"];
  width?: SectionProps["width"];
  headerWidth?: SectionProps["headerWidth"];
  contentWidth?: SectionProps["contentWidth"];
  className?: string;
};

export default function HowItWorks({
  steps = DEFAULT_STEPS,
  title = "How it works",
  description = "Top up in four quick steps, no account headaches.",
  viewMore,
  width,
  headerWidth,
  contentWidth,
  className,
}: HowItWorksProps) {
  if (steps.length === 0) return null;

  return (
    <Section
      title={title}
      description={description}
      viewMore={viewMore}
      width={width}
      headerWidth={headerWidth}
      contentWidth={contentWidth}
      className={className}
    >
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="relative">
            <StepCard step={step} index={i} total={steps.length} />

            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className="absolute -right-5.5 top-1/2 z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-lg border-2 border-border bg-card text-lime-400 shadow-sm lg:grid"
              >
                <ChevronRight className="size-4" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
