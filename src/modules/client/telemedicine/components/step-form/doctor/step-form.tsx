"use client";

import { useEffect, useState } from "react";
import {
  TDoctorConcent,
  TDoctorPersonalDetails,
  TDoctorQualifications,
  TDoctorWorkDetails,
} from "../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { toast } from "sonner";
import { StepProgressBar } from "./step-progress-bar";
import { PersonalDetailsStep } from "./steps/personalDetailsStep";
import { QualificationStep } from "./steps/qualificationStep";
import { WorkDetailsStep } from "./steps/workDetailsStep";
import { PreviewStep } from "./steps/previewStep";
import { TDoctor } from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import { useServerAction } from "zsa-react";
import {
  createOrUpdateDoctorPersonalDetails,
  createOrUpdateDoctorQualificationDetails,
  createOrUpdateDoctorWorkDetails,
  submitDoctorFullProfile,
} from "../../../server-actions/doctorProfile-actions";

export interface DoctorProfileData {
  personalDetails?: TDoctorPersonalDetails;
  qualificationDetails?: TDoctorQualifications;
  workDetails?: TDoctorWorkDetails;
  doctorConcent?: TDoctorConcent;
  completed: boolean;
}

type TUser = {
  id: string;
  name: string;
  username?: string | null;
  currentOrgId?: string | null;
};

function DoctorProfileAndRegister({
  doctorData,
  id,
  user,
  isUpdate,
}: {
  doctorData: TDoctor | null;
  id: string;
  user: TUser;
  isUpdate?: boolean;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [profileData, setProfileData] = useState<DoctorProfileData>({
    completed: false,
  });

  useEffect(() => {
    if (doctorData) {
      if (doctorData.personal) {
        setCurrentStep(2);
        setCompletedSteps((prev) => [...prev, 1].sort());

        const personal = doctorData.personal;
        const kyc = personal.kycAddress ?? {
          careOf: "",
          addressLine: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
        };
        const communication = personal.communicationAddress ?? {
          sameAsKyc:
            doctorData.personal?.communicationAddress?.sameAsKyc ?? false,
          careOf: "",
          addressLine: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
        };

        setProfileData((prev) => ({
          ...prev,
          completed: doctorData.isCompleted,
          personalDetails: {
            title: personal.title ?? "",
            fullName: personal.fullName ?? "",
            nationality: personal.nationality ?? "",
            languagesSpoken:
              personal.languagesSpoken?.map((l) => l.langCode) ?? [],
            dateOfBirth: personal.dateOfBirth ?? null,
            gender: personal.gender ?? "",
            mobileNumber: personal.mobileNumber ?? "",
            email: personal.email ?? "",
            speciality: personal.speciality ?? "",
            alternativeMobileNumber: personal.alternativeMobileNumber ?? null,
            alternativeEmail: personal.alternativeEmail ?? null,
            kycAddress: {
              careOf: kyc.careOf,
              addressLine: kyc.addressLine,
              city: kyc.city,
              district: kyc.district,
              state: kyc.state,
              pincode: kyc.pincode,
            },
            socialAccounts:
              personal.socialAccounts?.map((social) => ({
                id: social.id,
                platform: social.platform,
                url: social.url,
              })) ?? undefined,
            communicationAddress: {
              sameAsKyc: communication.sameAsKyc ?? false,
              careOf: communication.careOf ?? "",
              addressLine: communication.addressLine ?? "",
              city: communication.city ?? "",
              district: communication.district ?? "",
              state: communication.state ?? "",
              pincode: communication.pincode ?? "",
            },
          },
        }));
      }
      if (doctorData.qualification) {
        setCurrentStep(3);
        setCompletedSteps((prev) => [...prev, 2].sort());

        const qualification = doctorData.qualification;

        setProfileData((prev) => ({
          ...prev,
          completed: doctorData.isCompleted,
          qualificationDetails: {
            systemOfMedicine: qualification.systemOfMedicine ?? "",
            category: qualification.category ?? "",
            councilName: qualification.councilName ?? "",
            registrationNumber: qualification.registrationNumber ?? "",
            dateOfFirstRegistration:
              qualification.dateOfFirstRegistration ?? null,
            registrationType: qualification.registrationType,
            registrationValidDate: qualification.registrationValidDate ?? null,
            nameMatchesAadhaar: qualification.nameMatchesAadhaar ?? false,
            qualifications: qualification.qualifications.map((q) => ({
              nameMatchesAadhaar: q.nameMatchesAadhaar ?? false,
              id: q.id,
              countryOfQualification: q.countryOfQualification,
              degreeName: q.degreeName,
              country: q.country,
              state: q.state,
              college: q.college,
              university: q.university,
              passingMonth: q.passingMonth,
              passingYear: q.passingYear,
            })),
          },
        }));
      }
      if (doctorData.workDetail) {
        setCurrentStep(4);
        setCompletedSteps((prev) => [...prev, 3].sort());

        const workDetail = doctorData.workDetail;

        setProfileData((prev) => ({
          ...prev,
          completed: doctorData.isCompleted,
          workDetails: {
            currentlyWorking: workDetail.currentlyWorking ?? true,
            experience: workDetail.experience ?? "",
            reasonForNotWorking: workDetail.reasonForNotWorking ?? null,
            otherReason: workDetail.otherReason ?? null,
            natureOfWork: workDetail.natureOfWork ?? null,
            teleConsultationURL: workDetail.teleConsultationURL ?? null,
            workStatus: workDetail.workStatus ?? null,
            governmentCategory: workDetail.governmentCategory ?? null,
            centralGovernment: workDetail.centralGovernment ?? null,
            about: workDetail.about ?? "",
            workingFacilityDetails: workDetail.workingFacilityDetails.map(
              (w) => ({
                id: w.id,
                facilityId: w.facilityId,
                facilityStatus: w.facilityStatus,
                facilityName: w.facilityName,
                state: w.state,
                district: w.district,
                type: w.type,
                department: w.department,
                designation: w.designation,
                address: w.address,
              })
            ),
          },
        }));
      }

      if (doctorData.concent) {
        setCurrentStep(4);
        setCompletedSteps((prev) => [...prev, 4].sort());

        const concentDetails = doctorData.concent;

        setProfileData((prev) => ({
          ...prev,
          completed: doctorData.isCompleted,
          doctorConcent: {
            name: concentDetails.name ?? true,
            systemOfMedicine: concentDetails.systemOfMedicine ?? true,
            qualification: concentDetails.qualification ?? true,
            experience: concentDetails.experience ?? true,
            isDeclearedToCreateDoctorAccount:
              concentDetails.isDeclearedToCreateDoctorAccount,
            isAgreeToShowDetailsPublic:
              concentDetails.isAgreeToShowDetailsPublic ?? null,
            // showToPublic: concentDetails.showToPublic ?? null,
            email: concentDetails.email ?? null,
            contactNumber: concentDetails.contactNumber ?? null,
            placeOfWork: concentDetails.placeOfWork ?? null,
            profilePicture: concentDetails.profilePicture ?? null,
            languageSpoken: concentDetails.languageSpoken ?? null,
            workStatus: concentDetails.workStatus ?? null,
            teleConsultation: concentDetails.teleConsultation ?? null,
          },
        }));
      }
    }
  }, [doctorData]);

  const {
    execute: executePersonalDetails,
    isPending: isPendingPersonalDetails,
  } = useServerAction(createOrUpdateDoctorPersonalDetails, {
    onSuccess() {
      toast.success("Personal details updated successfully");
    },
    onError({ err }) {
      toast.error(err.message ?? "Failed to create personal details");
    },
  });

  const {
    execute: executeQualificationDetails,
    isPending: isPendingQualificationDetails,
  } = useServerAction(createOrUpdateDoctorQualificationDetails, {
    onSuccess() {
      toast.success("Qualification details updated successfully");
    },
    onError({ err }) {
      toast.error(err.message ?? "Failed to create qualification details");
    },
  });

  const { execute: executeWorkDetails, isPending: isPendingWorkDetails } =
    useServerAction(createOrUpdateDoctorWorkDetails, {
      onSuccess() {
        toast.success("Work details updated successfully");
      },
      onError({ err }) {
        toast.error(err.message ?? "Failed to create work details");
      },
    });

  const {
    execute: executeDoctorFullProfile,
    isPending: isPendingDoctorFullProfile,
  } = useServerAction(submitDoctorFullProfile, {
    onSuccess() {
      toast.success("Profile submitted successfully!");
    },
    onError({ err }) {
      toast.error(err.message ?? "Failed to submit profile");
    },
  });

  const handleStepComplete = async (step: number, data: any) => {
    if (step === 1) {
      await executePersonalDetails({
        ...data,
        id: doctorData?.personal?.id ?? null,
        doctorId: id,
        operationBy: user.id,
        orgId: user.currentOrgId,
      });
    }

    if (step === 2) {
      await executeQualificationDetails({
        ...data,
        id: doctorData?.qualification?.id ?? null,
        doctorId: id,
        operationBy: user.id,
        orgId: user.currentOrgId,
      });
    }

    if (step === 3) {
      await executeWorkDetails({
        ...data,
        id: doctorData?.workDetail?.id ?? null,
        doctorId: id,
        operationBy: user.id,
        orgId: user.currentOrgId,
      });
    }

    setProfileData((prev) => ({
      ...prev,
      ...(step === 1 && { personalDetails: data }),
      ...(step === 2 && { qualificationDetails: data }),
      ...(step === 3 && { workDetails: data }),
      ...(step === 4 && { doctorConcent: data }),
    }));

    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step].sort());
    }

    if (step < 4) {
      setCurrentStep(step + 1);
    }
  };

  const handleSaveDraft = (data: any) => {
    toast.success("Draft saved successfully");
    console.log("Draft saved:", data);
  };

  const handleSubmit = async (data: any) => {
    setProfileData((prev) => ({
      ...prev,
      doctorConcent: data,
      completed: true,
    }));

    await executeDoctorFullProfile({
      doctorId: id,
      orgId: user.currentOrgId!,
      operationBy: user.id,
      personal: {
        ...profileData.personalDetails!,
        id: doctorData?.personal?.id ?? null,
        doctorId: id,
        operationBy: user.id,
        orgId: user.currentOrgId!,
      },
      qualification: {
        ...profileData.qualificationDetails!,
        id: doctorData?.qualification?.id ?? null,
        doctorId: id,
        operationBy: user.id,
        orgId: user.currentOrgId!,
      },
      work: {
        ...profileData.workDetails!,
        id: doctorData?.workDetail?.id ?? null,
        doctorId: id,
        operationBy: user.id,
        orgId: user.currentOrgId!,
      },
      concent: {
        ...data,
        id: doctorData?.concent?.id ?? null,
        doctorId: id,
        operationBy: user.id,
        orgId: user.currentOrgId!,
      },
    });
  };

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

      <div>
        {currentStep === 1 && (
          <PersonalDetailsStep
            data={profileData.personalDetails}
            onNext={(data) => handleStepComplete(1, data)}
            onSaveDraft={handleSaveDraft}
            profileData={doctorData?.personal}
            isLoading={isPendingPersonalDetails}
          />
        )}

        {currentStep === 2 && (
          <QualificationStep
            data={profileData.qualificationDetails}
            onNext={(data) => handleStepComplete(2, data)}
            onPrevious={() => setCurrentStep(1)}
            onSaveDraft={handleSaveDraft}
            qualificationData={doctorData?.qualification}
            isLoading={isPendingQualificationDetails}
          />
        )}

        {currentStep === 3 && (
          <WorkDetailsStep
            data={profileData.workDetails}
            onNext={(data) => handleStepComplete(3, data)}
            onPrevious={() => setCurrentStep(2)}
            onSaveDraft={handleSaveDraft}
            workData={doctorData?.workDetail}
            isLoading={isPendingWorkDetails}
          />
        )}

        {currentStep === 4 && (
          <PreviewStep
            data={profileData}
            onPrevious={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
            concentData={doctorData?.concent}
            isLoading={isPendingDoctorFullProfile}
            isUpdate={isUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default DoctorProfileAndRegister;
