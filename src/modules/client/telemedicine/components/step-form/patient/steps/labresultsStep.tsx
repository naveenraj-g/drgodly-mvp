"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { StepNavigation } from "./stepNavigation";

import {
  abnormalFlagOptions,
  labNameOptions,
} from "@/modules/client/telemedicine/datas/patient-profile-datas";
import {
  LabResultSchema,
  TLabResultDetail,
} from "@/modules/shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface LabResultStepProps {
  data?: TLabResultDetail;
  onNext: (data: TLabResultDetail) => void;
  onPrevious: () => void;
  onSaveDraft: (data: Partial<TLabResultDetail>) => void;
  isLoading?: boolean;
}

export function LabResultsStep({
  data,
  onNext,
  onPrevious,
  onSaveDraft,
  isLoading = false,
}: LabResultStepProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<TLabResultDetail>({
    resolver: zodResolver(LabResultSchema),
    defaultValues: data || {
      parameter: "",
      value: "",
      range: "",
      units: "",
      abnormalFlag: "",
      labReportDate: undefined,
      labReportRefNo: "",
      labName: "",
    },
  });

  const handleSubmit = (values: TLabResultDetail) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold">Result</h2>
            <p className="text-muted-foreground">
              Please fill in the patient&apos;s lab result details.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lab Result</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Parameter */}
            <FormField
              control={form.control}
              name="parameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parameter *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter parameter"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"eg: 13.5, 98, 140/90 etc"}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Range */}
            <FormField
              control={form.control}
              name="range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Range *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"eg: 12-16 g/dl, 70-100 mg/dl etc"}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LabReport RefNo */}
            <FormField
              control={form.control}
              name="labReportRefNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>labReportRefNo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter labReport refNo"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LabReport Date */}
            <FormField
              control={form.control}
              name="labReportDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Lab Report Date *</FormLabel>

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
                          ? format(field.value as Date, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as Date}
                        onSelect={(date) => {
                          setOpen(false);
                          field.onChange(date as Date);
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

            {/*units */}

            <FormField
              control={form.control}
              name="units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter thr units"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* abnormal flag */}
            <FormField
              control={form.control}
              name="abnormalFlag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abnormal Flag *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select abnormalFlag" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {abnormalFlagOptions.map((item) => (
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

            {/* Lab name*/}
            <FormField
              control={form.control}
              name="labName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LabName *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select labName" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labNameOptions.map((item) => (
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

        <StepNavigation
          currentStep={3}
          totalSteps={5}
          onPrevious={onPrevious}
          onNext={form.handleSubmit(onNext)}
          onSaveDraft={() => onSaveDraft(form.getValues())}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
}
