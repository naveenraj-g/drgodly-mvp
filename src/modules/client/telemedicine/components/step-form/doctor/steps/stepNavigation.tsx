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
    <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t flex items-center justify-between">
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
