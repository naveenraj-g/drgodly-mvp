"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import type { PatientProfileData } from "../step-form";

interface PatientFullDetailsProps {
  data?: any;
  fullData?: PatientProfileData;
  onPrevious: () => void;
  onSubmit: (data: any) => void;
  onSaveDraft: (data: any) => void;
}

export function PatientFullDetailsStep({
  data,
  fullData,
  onPrevious,
  onSubmit,
  onSaveDraft,
}: PatientFullDetailsProps) {
  const handleSubmit = () => {
    onSubmit(fullData ?? data ?? {});
  };

  const pd = fullData?.personalDetails ?? data?.personalDetails ?? {};
  const md = fullData?.MedicalDetails ?? data?.MedicalDetails ?? {};
  const lr = fullData?.LabResult ?? data?.LabResult ?? {};
  const fd = fullData?.LifeStyle ?? data?.LifeStyle ?? {};

  function formatValue(value: any) {
    if (value === null || value === undefined) return "—";
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      if (!isNaN(parsed) && /\d{4}-\d{2}-\d{2}/.test(value)) {
        return new Date(parsed).toLocaleDateString();
      }
      return value;
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (e) {
        return String(value);
      }
    }
    return String(value);
  }

  const Row = ({ label, value }: { label: string; value: any }) => (
    <div className="flex gap-4 py-2 border-b last:border-b-0">
      <div className="w-48 text-sm font-medium text-muted-foreground">
        {label}
      </div>
      <div className="text-sm">{formatValue(value)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Patient Full Details</h2>
        <p className="text-muted-foreground">
          Review all patient information before final submission.
        </p>
      </div>

      <div className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-0">
              <Row label="Name" value={pd?.Name} />
              <Row
                label="Date of Birth"
                value={
                  pd?.dateOfBirth
                    ? new Date(pd.dateOfBirth).toLocaleDateString()
                    : null
                }
              />
              <Row label="Gender" value={pd?.gender} />
              <Row label="Mobile" value={pd?.mobileNumber} />
              <Row label="Email" value={pd?.email} />
              <Row label="Address" value={pd?.address} />
              <Row
                label="Alternative Mobile"
                value={pd?.alternativeMobileNumber}
              />
              <Row label="Alternative Email" value={pd?.alternativeEmail} />
              <Row label="Alternative Address" value={pd?.alternativeAddress} />
              <Row label="Insurance Provider" value={pd?.insuranceProvider} />
              <Row label="Insurance Number" value={pd?.insuranceNumber} />
              <Row label="Marital Status" value={pd?.maritalStatus} />
              <Row label="Blood Group" value={pd?.bloodGroup} />
              <Row label="ID Card Number" value={pd?.idCardNumbers} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-0">
              <Row label="Past Diagnoses" value={md?.pastDiagnoses} />
              <Row label="Past Surgeries" value={md?.pastSurgeries} />
              <Row label="Allergies" value={md?.allergies} />
              <Row label="Immunization" value={md?.immunization} />
              <Row label="Ongoing Treatment" value={md?.ongoingTreatment} />
              <Row label="Family History" value={md?.familyHistory} />
              <Row label="Drug Name" value={md?.drugName} />
              <Row
                label="From Date"
                value={
                  md?.fromDate
                    ? new Date(md.fromDate).toLocaleDateString()
                    : null
                }
              />
              <Row
                label="To Date"
                value={
                  md?.toDate ? new Date(md.toDate).toLocaleDateString() : null
                }
              />
              <Row label="Dose" value={md?.dose} />
              <Row label="Frequency" value={md?.frequency} />
              <Row label="Duration" value={md?.duration} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lab Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-0">
              <Row label="Parameter" value={lr?.parameter} />
              <Row label="Value" value={lr?.value} />
              <Row label="Range" value={lr?.range} />
              <Row label="Units" value={lr?.units} />
              <Row label="Abnormal Flag" value={lr?.abnormalFlag} />
              <Row label="Report Date" value={lr?.labReportDate} />
              <Row label="Report Ref No" value={lr?.labReportRefNo} />
              <Row label="Lab Name" value={lr?.labName} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Life Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-0">
              <Row label="Bp" value={fd?.bp} />
              <Row label="Hr" value={fd?.hr} />
              <Row label="Temperature" value={fd?.temp} />
              <Row label="Bmi" value={fd?.bmi} />
              <Row label="Oxygen Sat" value={fd?.oxygenSat} />
              <Row
                label="As On Date"
                value={
                  fd?.asOnDate
                    ? new Date(fd.asOnDate).toLocaleDateString()
                    : null
                }
              />
              <Row label="Smoking" value={fd?.smoking} />
              <Row label="Alcohol" value={fd?.alcohol} />
              <Row label="Exercise" value={fd?.exercise} />
              <Row label="Diet" value={fd?.diet} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 items-center justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Edit
        </Button>
        <Button onClick={() => onSaveDraft(fullData)}>Save Draft</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

export default PatientFullDetailsStep;
