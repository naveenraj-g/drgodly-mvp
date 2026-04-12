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

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { StepNavigation } from "./stepNavigation";

import { Button } from "@/components/ui/button";

import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  alcoholOptions,
  bmiOptions,
  bpOptions,
  dietOptions,
  exerciseOptions,
  hrOptions,
  smokingOptions,
  tempOptions,
} from "@/modules/client/telemedicine/datas/patient-profile-datas";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { useState } from "react";
import {
  LifestyleDetailsSchema,
  TLifeStyleDetails,
} from "@/modules/shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";

interface PreviewStepProps {
  data?: TLifeStyleDetails;
  onNext: (data: TLifeStyleDetails) => void;
  onPrevious: () => void;
  onSaveDraft: (data: Partial<TLifeStyleDetails>) => void;
  isLoading?: boolean;
}

export function LifeStyleDetailsStep({
  data,
  onNext,
  onPrevious,
  onSaveDraft,
  isLoading = false,
}: PreviewStepProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<TLifeStyleDetails>({
    resolver: zodResolver(LifestyleDetailsSchema),
    defaultValues: data || {
      bp: "",
      hr: "",
      temp: "",
      bmi: "",
      oxygenSat: "",
      asOnDate: undefined,
      smoking: "",
      alcohol: "",
      exercise: "",
      diet: "",
    },
  });

  const handleSubmit = (values: TLifeStyleDetails) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold">Life Style</h2>
            <p className="text-muted-foreground">
              Provide key lifestyle factors that may influence patient health.
            </p>
          </div>
        </div>

        {/* VITAL */}
        <Card>
          <CardHeader>
            <CardTitle>Vital</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* BP */}
            <FormField
              control={form.control}
              name="bp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bp *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bp" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bpOptions.map((item) => (
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

            {/* HR */}
            <FormField
              control={form.control}
              name="hr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hr *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hr" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hrOptions.map((item) => (
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

            {/* TEMP – FIXED */}
            <FormField
              control={form.control}
              name="temp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select temperature" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tempOptions.map((item) => (
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

            {/* BMI */}
            <FormField
              control={form.control}
              name="bmi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bmi *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bmi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bmiOptions.map((item) => (
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

            {/* OXYGEN SAT */}
            <FormField
              control={form.control}
              name="oxygenSat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oxygen Sat *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select oxygen saturation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bmiOptions.map((item) => (
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

            {/* DATE */}
            <FormField
              control={form.control}
              name="asOnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>As On Date *</FormLabel>

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
          </CardContent>
        </Card>

        {/* LIFESTYLE */}
        <Card>
          <CardHeader>
            <CardTitle>Life Style</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SMOKING */}
            <FormField
              control={form.control}
              name="smoking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Smoking *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select smoking" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {smokingOptions.map((item) => (
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

            {/* ALCOHOL */}
            <FormField
              control={form.control}
              name="alcohol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alcohol *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alcohol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {alcoholOptions.map((item) => (
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

            {/* EXERCISE */}
            <FormField
              control={form.control}
              name="exercise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {exerciseOptions.map((item) => (
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

            {/* DIET */}
            <FormField
              control={form.control}
              name="diet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diet *</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dietOptions.map((item) => (
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

        {/* NAVIGATION */}
        <StepNavigation
          currentStep={4}
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
