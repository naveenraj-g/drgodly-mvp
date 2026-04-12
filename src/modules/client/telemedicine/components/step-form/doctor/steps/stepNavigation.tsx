import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSaveDraft,
  isNextDisabled = false,
  isLastStep = false,
  isLoading = false,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-border">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isLoading}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* <Button
        type="button"
        variant="outline"
        onClick={onSaveDraft}
        className="gap-2"
      >
        <Save className="w-4 h-4" />
        Save Draft
      </Button> */}

      <Button
        type="submit"
        onClick={onNext}
        disabled={isNextDisabled || isLoading}
        className="gap-2"
      >
        {isLastStep ? "Submit" : "Next"}
        {!isLastStep && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
}
