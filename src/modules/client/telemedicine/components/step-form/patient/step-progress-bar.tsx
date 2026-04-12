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
  {
    id: 1,
    title: "Personal Details",
  },
  {
    id: 2,
    title: "Medical Details",
  },
  {
    id: 3,
    title: "Lab Results",
  },
  {
    id: 4,
    title: "Life Style",
  },
  {
    id: 5,
    title: "PatientFull Details",
  },
];

export function StepProgressBar({
  currentStep,
  onStepClick,
  completedSteps,
}: ProfileSidebarProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Patient Profile Registration
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Complete your personal profile for ABDM Patient Registry
        </p>
      </div>

      <div className="flex gap-4 sm:gap-2 max-w-full justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isAccessible = step.id <= currentStep || isCompleted;

          return (
            <Fragment key={step.id}>
              <div
                key={step.id}
                className="flex flex-col items-center flex-none"
              >
                {/* Step Button */}
                <button
                  onClick={() => isAccessible && onStepClick(step.id)}
                  disabled={!isAccessible}
                  className={cn(
                    "flex flex-col items-center p-2 rounded-lg transition-all",
                    isCurrent && "bg-primary/10",
                    isAccessible && "hover:bg-accent",
                    !isAccessible && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Step Icon */}
                  <div className="mb-1 rounded-full p-1">
                    {isCompleted ? (
                      <div className="bg-primary rounded-full p-1">
                        <Check className="w-6 h-6 text-success text-accent" />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
                          isCurrent
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground text-muted-foreground"
                        )}
                      >
                        {step.id}
                      </div>
                    )}
                  </div>

                  {/* Step Title */}
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-xs md:text-sm font-medium",
                        isCurrent ? "text-primary" : "text-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                </button>
              </div>
              {index !== steps.length - 1 && (
                <div
                  key={step.id + 1}
                  className={`p-[1px] w-full h-fit ${
                    isCurrent
                      ? "bg-accent-foreground"
                      : isCompleted
                      ? "bg-accent-foreground"
                      : "bg-secondary"
                  } self-center`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
