import { ChevronRight } from "lucide-react";

export const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { num: 1, label: "Select Doctor" },
    { num: 2, label: "Choose Time" },
    { num: 3, label: "Confirm" },
  ];

  return (
    <div className="flex items-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-2">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center whitespace-nowrap">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-2 transition-colors ${
              currentStep >= step.num
                ? "bg-primary text-secondary"
                : "bg-primary/15 text-primary"
            }`}
          >
            {step.num}
          </div>
          <span
            className={`text-sm font-medium ${
              currentStep >= step.num ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {step.label}
          </span>
          {idx < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 ml-2 md:ml-4 text-zinc-700" />
          )}
        </div>
      ))}
    </div>
  );
};
