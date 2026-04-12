"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StepProgressBar } from "./step-progress-bar";
import { PersonalDetailsStep } from "./steps/personalDetailsStep";
import { MedicalDetailsStep } from "./steps/medicalDetailsStep";
import { LabResultsStep } from "./steps/labresultsStep";
import { LifeStyleDetailsStep } from "./steps/lifestyleDetailsStep";
import { PatientFullDetailsStep } from "./steps/patientfullDetails";
import {
  TLabResultDetail,
  TLifeStyleDetails,
  TMedicalDetails,
  TPatientPersonalDetails,
} from "@/modules/shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
export interface PatientProfileData {
  personalDetails?: TPatientPersonalDetails;
  MedicalDetails?: TMedicalDetails;
  LabResult?: TLabResultDetail;
  LifeStyle?: TLifeStyleDetails;
  patientDetails?: any;
  completed: boolean;
}

function PatientProfileAndRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [profileData, setProfileData] = useState<PatientProfileData>({
    completed: false,
  });

  /** -------------------------------
   * ❇ Move next when a step is saved
   --------------------------------*/
  const handleStepComplete = (step: number, data: any) => {
    setProfileData((prev) => ({
      ...prev,
      ...(step === 1 && { personalDetails: data }),
      ...(step === 2 && { MedicalDetails: data }),
      ...(step === 3 && { LabResult: data }),
      ...(step === 4 && { LifeStyle: data }),
      ...(step === 5 && { patientDetails: data }),
    }));

    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step].sort());
    }

    if (step < 5) {
      setCurrentStep(step + 1);
    }

    toast.success("Step saved!");
  };

  /** ------------------------
   * ❇ Save draft (frontend only)
   ---------------------------*/
  const handleSaveDraft = (data: any) => {
    console.log("Draft saved:", data);
    toast.success("Draft saved!");
  };

  /** ------------------------
   * ❇ Submit final form
   ---------------------------*/

  const handleSubmit = (data: any) => {
    setProfileData((prev) => ({
      ...prev,
      patientDetails: data,
      completed: true,
    }));

    console.log("Final Submitted Data:", {
      ...profileData,
      patientDetails: data,
      completed: true,
    });

    toast.success("Profile submitted!");
  };

  /** ------------------------------
   * ❇ Step click navigation
   -------------------------------*/
  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="space-y-8 mb-6">
      <StepProgressBar
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {/* Step Screens */}
      <div>
        {currentStep === 1 && (
          <PersonalDetailsStep
            data={profileData.personalDetails}
            onNext={(data) => handleStepComplete(1, data)}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 2 && (
          <MedicalDetailsStep
            data={profileData.MedicalDetails}
            onNext={(data) => handleStepComplete(2, data)}
            onPrevious={() => setCurrentStep(1)}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 3 && (
          <LabResultsStep
            data={profileData.LabResult}
            onNext={(data) => handleStepComplete(3, data)}
            onPrevious={() => setCurrentStep(2)}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 4 && (
          <LifeStyleDetailsStep
            data={profileData.LifeStyle}
            onPrevious={() => setCurrentStep(3)}
            onNext={(data) => handleStepComplete(4, data)}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentStep === 5 && (
          <PatientFullDetailsStep
            data={profileData.patientDetails}
            fullData={profileData}
            onPrevious={() => setCurrentStep(4)}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
          />
        )}
      </div>
    </div>
  );
}

export default PatientProfileAndRegister;
