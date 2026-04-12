"use client";

import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { StepNavigation } from "./stepNavigation";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import {
  allergyOptions,
  doseOptions,
  durationOptions,
  familyHistoryOptions,
  frequencyOptions,
  immunizationOptions,
  ongoingTreatmentOptions,
  pastDiagnosesOptions,
  pastSurgeriesOptions,
} from "@/modules/client/telemedicine/datas/patient-profile-datas";
import {
  MedicalDetailsSchema,
  TMedicalDetails,
} from "@/modules/shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import { useState } from "react";

interface MedicalDetailsStepProps {
  data?: TMedicalDetails;
  onNext: (data: TMedicalDetails) => void;
  onPrevious: () => void;
  onSaveDraft: (data: Partial<TMedicalDetails>) => void;
  isLoading?: boolean;
}

export function MedicalDetailsStep({
  data,
  onNext,
  onPrevious,
  onSaveDraft,
  isLoading = false,
}: MedicalDetailsStepProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<TMedicalDetails>({
    resolver: zodResolver(MedicalDetailsSchema),
    defaultValues: data || {
      pastDiagnoses: "",
      pastSurgeries: "",
      allergies: "",
      immunization: "",
      ongoingTreatment: "",
      familyHistory: "",
      drugName: "",
      fromDate: undefined,
      toDate: undefined,
      dose: "",
      frequency: "",
      duration: "",
    },
  });

  const handleSubmit = (values: TMedicalDetails) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold">Medical History</h2>
            <p className="text-muted-foreground">
              Please fill in the patient’s medical details accurately.
            </p>
          </div>
        </div>

        {/* SYSTEM OF MEDICINE */}
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <FormField
              control={form.control}
              name="pastDiagnoses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Diagnoses *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Diagnoses" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pastDiagnosesOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* System */}
            <FormField
              control={form.control}
              name="pastSurgeries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Surgeries *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pastSurgeries" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pastSurgeriesOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allergies */}
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pastSurgeries" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allergyOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Immunization */}
            <FormField
              control={form.control}
              name="immunization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Immunization *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Immunization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {immunizationOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* OngingTreatments */}
            <FormField
              control={form.control}
              name="ongoingTreatment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OngoingTreatment *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Treatment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ongoingTreatmentOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* family history */}
            <FormField
              control={form.control}
              name="familyHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>familyHistory *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select history" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {familyHistoryOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* medications */}

        <Card>
          <CardHeader>
            <CardTitle>Medication Details</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Drug Name */}
              <FormField
                control={form.control}
                name="drugName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter drug name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* From Date  */}
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>From Date *</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "pl-3 text-left",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            setOpen(false);
                            field.onChange(date);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          className="pointer-events-auto"
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To Date */}
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>To Date *</FormLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "pl-3 text-left",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent align="start" className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            setOpen(false);
                            field.onChange(date);
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          className="pointer-events-auto"
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dose */}
              <FormField
                control={form.control}
                name="dose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dose</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select dose" />
                        </SelectTrigger>
                        <SelectContent>
                          {doseOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Frequency */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <StepNavigation
          currentStep={2}
          totalSteps={4}
          onPrevious={onPrevious}
          onNext={form.handleSubmit(onNext)}
          onSaveDraft={() => onSaveDraft(form.getValues())}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
}
