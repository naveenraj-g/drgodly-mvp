"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Clock, DollarSign, Hash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TUserPreferenceValidation,
  UserPreferenceValidationSchema,
} from "@/modules/shared/schemas/userPreferences/userPreferencesValidationSchema";
import { createPresenter } from "@/modules/shared/utils/user-preference";
import { FormSelect } from "@/modules/shared/custom-form-fields";
import {
  countryOptions,
  currencyOptions,
  dateFormatOptions,
  numberFormatOptions,
  regionalPresets,
  timeFormatOptions,
  timezoneOptions,
  weekStartOptions,
} from "@/modules/shared/staticDatas/preference-datas";
import { FieldGroup } from "@/components/ui/field";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const MOCK_PREFERENCE: TUserPreferenceValidation = {
  country: "US",
  currency: "USD",
  dateFormat: "MM/DD/YYYY",
  numberFormat: "1,234.56",
  timezone: "America/New_York",
  weekStart: "monday",
  timeFormat: "h:mm A",
};

export function UserPreferences() {
  const form = useForm<TUserPreferenceValidation>({
    resolver: zodResolver(UserPreferenceValidationSchema),
    defaultValues: MOCK_PREFERENCE,
  });

  const currentValues = form.watch();

  const { formatDate, formatCurrency, formatNumber, formatTime } =
    createPresenter({
      ...currentValues,
      country: currentValues.country || "en",
    });

  const onSubmit = async (_values: TUserPreferenceValidation) => {
    toast.success("Preferences updated successfully.");
  };

  const isInitialMount = useRef(true);
  const prevCountry = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevCountry.current = currentValues.country;
      return;
    }

    if (
      currentValues.country &&
      currentValues.country !== prevCountry.current
    ) {
      prevCountry.current = currentValues.country;

      const countrySpecificValues = regionalPresets[
        currentValues.country as keyof typeof regionalPresets
      ] as TUserPreferenceValidation;

      form.reset({
        ...form.getValues(),
        ...countrySpecificValues,
      });
    }
  }, [currentValues.country, form]);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Regional Preferences
            </h1>
            <p className="text-muted-foreground">
              Customize your regional settings including language, timezone, and
              formatting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Country */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Country</CardTitle>
                    <CardDescription>
                      Select your country to automatically apply regional
                      defaults.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label="Country"
                          name="country"
                          placeholder="Select a country"
                        >
                          {countryOptions.map((country) => (
                            <SelectItem
                              key={country.value}
                              value={country.value}
                            >
                              {country.label}
                            </SelectItem>
                          ))}
                        </FormSelect>
                      </div>
                    </FieldGroup>
                  </CardContent>
                </Card>

                {/* Localization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Localization</CardTitle>
                    <CardDescription>
                      Configure how dates, times, and the week are displayed.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label="Timezone"
                          name="timezone"
                          placeholder="Select a timezone"
                        >
                          {timezoneOptions.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </FormSelect>

                        <FormSelect
                          control={form.control}
                          label="Date Format"
                          name="dateFormat"
                          placeholder="Select a date format"
                        >
                          {dateFormatOptions.map((df) => (
                            <SelectItem key={df.value} value={df.value}>
                              {df.label}
                            </SelectItem>
                          ))}
                        </FormSelect>
                      </div>
                    </FieldGroup>

                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label="Time Format"
                          name="timeFormat"
                          placeholder="Select a time format"
                        >
                          {timeFormatOptions.map((tf) => (
                            <SelectItem key={tf.value} value={tf.value}>
                              {tf.label}
                            </SelectItem>
                          ))}
                        </FormSelect>

                        <FormSelect
                          control={form.control}
                          label="Week Starts On"
                          name="weekStart"
                          placeholder="Select first day of week"
                        >
                          {weekStartOptions.map((week) => (
                            <SelectItem key={week.value} value={week.value}>
                              {week.label}
                            </SelectItem>
                          ))}
                        </FormSelect>
                      </div>
                    </FieldGroup>
                  </CardContent>
                </Card>

                {/* Regional Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Regional Settings</CardTitle>
                    <CardDescription>
                      Set your preferred currency and number formatting style.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label="Currency"
                          name="currency"
                          placeholder="Select a currency"
                        >
                          {currencyOptions.map((currency) => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              {currency.label}
                            </SelectItem>
                          ))}
                        </FormSelect>

                        <FormSelect
                          control={form.control}
                          label="Number Format"
                          name="numberFormat"
                          placeholder="Select a number format"
                        >
                          {numberFormatOptions.map((nf) => (
                            <SelectItem key={nf.value} value={nf.value}>
                              {nf.label}
                            </SelectItem>
                          ))}
                        </FormSelect>
                      </div>
                    </FieldGroup>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap">
                  <Button
                    type="submit"
                    className="flex-3 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Save Preferences
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    variant="outline"
                    onClick={() => form.reset(MOCK_PREFERENCE)}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Column - Preview */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl">Live Preview</CardTitle>
                <CardDescription>
                  See how your formatting settings will look.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatDate(new Date())}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>Time</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatTime(new Date())}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Currency</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(1224.87)}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Hash className="w-4 h-4" />
                      <span>Number</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatNumber(1224.87)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4M16 2v4M3 4h18v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4Z" />
      <path d="M3 10h18" />
    </svg>
  );
}
