import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fragment } from "react";

interface Step {
  id: number;
  title: string;
}

interface ProfileSidebarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

const steps: Step[] = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Qualifications" },
  { id: 3, title: "Work Details" },
  { id: 4, title: "Preview & Submit" },
];

export function StepProgressBar({
  currentStep,
  onStepClick,
  completedSteps,
}: ProfileSidebarProps) {
  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl leading-tight">
            Doctor Profile Registration
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete your professional profile for ABDM Provider Registry
          </p>
        </div>
        <div className="hidden sm:flex flex-col items-end shrink-0 pb-0.5">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            Progress
          </p>
          <p className="text-xl font-bold text-primary leading-none mt-0.5">
            {currentStep}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}/ {steps.length}
            </span>
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-start">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = step.id <= currentStep || isCompleted;
          const isLast = index === steps.length - 1;

          return (
            <Fragment key={step.id}>
              <button
                onClick={() => isAccessible && onStepClick(step.id)}
                disabled={!isAccessible}
                className={cn(
                  "flex flex-col items-center gap-2 flex-none transition-opacity",
                  !isAccessible && "opacity-40 cursor-not-allowed pointer-events-none",
                  isAccessible && !isCurrent && "hover:opacity-70 cursor-pointer",
                )}
              >
                {/* Circle */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200 shrink-0",
                    isCompleted &&
                      "bg-primary border-primary text-primary-foreground shadow-sm",
                    isCurrent &&
                      !isCompleted &&
                      "bg-primary border-primary text-primary-foreground ring-[3px] ring-primary/20 ring-offset-2 ring-offset-background",
                    !isCurrent &&
                      !isCompleted &&
                      "bg-muted border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    step.id
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-center text-[11px] sm:text-xs font-medium leading-tight max-w-[68px] sm:max-w-[90px]",
                    isCurrent
                      ? "text-primary font-semibold"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </button>

              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mt-[18px] mx-2 rounded-full transition-all duration-300",
                    isCompleted ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
