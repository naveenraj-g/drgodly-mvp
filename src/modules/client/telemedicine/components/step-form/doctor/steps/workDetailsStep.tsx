import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { StepNavigation } from "./stepNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DoctorWorkDetailsSchema,
  TDoctorWorkDetails,
} from "../../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { TDoctorWorkDetails as TDoctorWork } from "../../../../../../shared/entities/models/telemedicine/doctorProfile";
import { notWokingReason } from "../../../../datas/doctor-profile-datas";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  FormInput,
  FormRadioGroup,
  FormSelect,
} from "@/modules/shared/custom-form-fields";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const natureOfWorkData = [
  { label: "Administrative", value: "administrative" },
  { label: "Practice", value: "practice" },
  { label: "Teaching", value: "teaching" },
  { label: "Research", value: "research" },
];

interface WorkDetailsStepProps {
  data?: TDoctorWorkDetails;
  onNext: (data: TDoctorWorkDetails) => void;
  onPrevious: () => void;
  onSaveDraft: (data: Partial<TDoctorWorkDetails>) => void;
  workData?: TDoctorWork | null;
  isLoading?: boolean;
}

export function WorkDetailsStep({
  data,
  onNext,
  onPrevious,
  onSaveDraft,
  workData,
  isLoading = false,
}: WorkDetailsStepProps) {
  const form = useForm<TDoctorWorkDetails>({
    resolver: zodResolver(DoctorWorkDetailsSchema),
    defaultValues: data || {
      currentlyWorking: true,
      about: "",
      experience: "",
      reasonForNotWorking: null,
      otherReason: null,
      natureOfWork: workData?.natureOfWork ?? null,
      teleConsultationURL: null,
      governmentCategory: null,
      centralGovernment: null,
      workStatus: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workingFacilityDetails",
  });

  const currentlyWorking = form.watch("currentlyWorking");
  const reasonForNotWorking = form.watch("reasonForNotWorking");
  const workStatus = form.watch("workStatus");
  const governmentCategory = form.watch("governmentCategory");

  useEffect(() => {
    console.log("----------Running useEffect----------");
    if (workData) {
      const workPlace = workData?.workingFacilityDetails.map((w) => ({
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
      }));

      form.reset({
        currentlyWorking: workData.currentlyWorking,
        experience: workData.experience,
        reasonForNotWorking: workData.reasonForNotWorking,
        otherReason: workData.otherReason,
        natureOfWork: workData.natureOfWork,
        teleConsultationURL: workData.teleConsultationURL,
        workStatus: workData.workStatus,
        governmentCategory: workData.governmentCategory,
        centralGovernment: workData.centralGovernment,
        about: workData.about,
        workingFacilityDetails: workPlace ?? undefined,
      });
    }
  }, [form, workData]);

  const handleSubmit = (values: TDoctorWorkDetails) => {
    onNext(values as TDoctorWorkDetails);
  };

  const addFacility = () => {
    append({
      id: fields.length + 1 + "",
      facilityId: "",
      facilityStatus: true,
      facilityName: "",
      address: "",
      state: "",
      district: "",
      type: "",
      department: "",
      designation: "",
    });
  };

  const removeAllFacility = () => {
    for (let i = 0; i < fields.length; i++) {
      remove(i);
    }
  };

  useEffect(() => {
    if (!currentlyWorking) {
      removeAllFacility();
    }
  }, [currentlyWorking]);

  useEffect(() => {
    if (currentlyWorking && workStatus) {
      if (fields.length === 0) {
        addFacility();
      }
    }
  }, [currentlyWorking, workStatus]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Work Details
          </h2>
          <p className="text-muted-foreground">
            Tell us about your professional experience and current practice
          </p>
        </div>

        {/* Current Work Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Work Status</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FormRadioGroup
                control={form.control}
                name="currentlyWorking"
                label="Are you currently working? *"
                className="flex gap-6 !w-fit"
              >
                <Field orientation="horizontal" className="flex-0">
                  <RadioGroupItem value="true" id="yes" />
                  <FieldLabel htmlFor="yes">Yes</FieldLabel>
                </Field>

                <Field orientation="horizontal" className="flex-0">
                  <RadioGroupItem value="false" id="no" />
                  <FieldLabel htmlFor="no">No</FieldLabel>
                </Field>
              </FormRadioGroup>

              <FormInput
                control={form.control}
                name="experience"
                label="Work Experience (Years) *"
                placeholder="10"
                className="max-w-24"
              />

              {!currentlyWorking && (
                <>
                  <FormField
                    control={form.control}
                    name="reasonForNotWorking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Please select reason for not working *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {notWokingReason.map((reason, i) => (
                              <SelectItem key={i} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {reasonForNotWorking === "other" && (
                    <FormField
                      control={form.control}
                      name="otherReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter reason"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}

              {currentlyWorking && (
                <>
                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                    <FormSelect
                      control={form.control}
                      name="natureOfWork"
                      label="Nature of Work *"
                      placeholder="Select a work"
                    >
                      {natureOfWorkData.map((work, i) => (
                        <SelectItem key={i} value={work.value}>
                          {work.label}
                        </SelectItem>
                      ))}
                    </FormSelect>

                    <FormInput
                      control={form.control}
                      name="teleConsultationURL"
                      label="Teleconsultation URL"
                      placeholder="http://..."
                    />
                  </FieldGroup>

                  <FormRadioGroup
                    control={form.control}
                    label="Work Status *"
                    name="workStatus"
                    className="flex"
                  >
                    <Field orientation="horizontal" className="flex-0">
                      <RadioGroupItem
                        value="government"
                        id="gov"
                      ></RadioGroupItem>
                      <FieldLabel htmlFor="gov">Government</FieldLabel>
                    </Field>

                    <Field orientation="horizontal" className="flex-0">
                      <RadioGroupItem
                        value="private"
                        id="priv"
                      ></RadioGroupItem>
                      <FieldLabel htmlFor="priv">Private</FieldLabel>
                    </Field>

                    <Field orientation="horizontal" className="flex-0">
                      <RadioGroupItem value="both" id="both"></RadioGroupItem>
                      <FieldLabel htmlFor="both">Both</FieldLabel>
                    </Field>
                  </FormRadioGroup>

                  {(workStatus === "government" || workStatus === "both") && (
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                      <FormRadioGroup
                        control={form.control}
                        name="governmentCategory"
                        label="Select Category *"
                        className="flex"
                      >
                        <Field orientation="horizontal" className="flex-0">
                          <RadioGroupItem
                            value="central"
                            id="central"
                          ></RadioGroupItem>
                          <FieldLabel htmlFor="central">Central</FieldLabel>
                        </Field>

                        <Field orientation="horizontal" className="flex-0">
                          <RadioGroupItem
                            value="state"
                            id="state"
                          ></RadioGroupItem>
                          <FieldLabel htmlFor="state">State</FieldLabel>
                        </Field>
                      </FormRadioGroup>

                      {governmentCategory === "central" && (
                        <FormInput
                          control={form.control}
                          name="centralGovernment"
                          label="Central Government *"
                          placeholder="Enter central government you work under"
                        />
                      )}
                    </FieldGroup>
                  )}
                </>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {currentlyWorking && (
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Place of Work</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFacility}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Facilities
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.length === 0 && (
                <p className="text-muted-foreground text-center">
                  Add Facilities
                </p>
              )}
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardHeader className="flex items-center justify-between mb-4">
                    <CardTitle>Facility {index + 1}</CardTitle>
                    {/* {fields.length > 1 && ( */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {/* )} */}
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Facility ID */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.facilityId`}
                      label="Facility ID *"
                      placeholder="Enter Facility ID"
                    />

                    {/* Facility Name */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.facilityName`}
                      label="Facility Name *"
                      placeholder="Enter Facility Name"
                    />

                    {/* Facility Status */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.facilityStatus`}
                      label="Facility Active Status"
                    />

                    {/* Address */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.address`}
                      label="Facility Address *"
                      placeholder="Enter Facility Address"
                    />

                    {/* State */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.state`}
                      label="State *"
                      placeholder="Enter State"
                    />

                    {/* District */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.district`}
                      label="District *"
                      placeholder="Enter District"
                    />

                    {/* Facility Type */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.type`}
                      label="Facility Type *"
                      placeholder="Enter Facility Type"
                    />

                    {/* Department */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.department`}
                      label="Working Department *"
                      placeholder="Enter Department"
                    />

                    {/* Designation */}
                    <FormInput
                      control={form.control}
                      name={`workingFacilityDetails.${index}.designation`}
                      label="Designation *"
                      placeholder="Enter Designation"
                    />
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About You</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write about your expertise, approach to patient care, areas of interest, and what patients can expect from your consultations..."
                      className="h-[200px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p
                    className={cn(
                      "text-sm text-muted-foreground",
                      field.value?.length > 500 && "text-red-500"
                    )}
                  >
                    {field.value?.length || 0} / 500 characters
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <StepNavigation
          currentStep={3}
          totalSteps={4}
          onPrevious={onPrevious}
          onNext={() => {}}
          onSaveDraft={() => onSaveDraft(form.getValues())}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
}
