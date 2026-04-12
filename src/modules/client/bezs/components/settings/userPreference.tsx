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
import { TUserPreference } from "@/modules/shared/entities/models/userPreferences/userPreferences";
import { ZSAError } from "zsa";
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
import { useServerAction } from "zsa-react";
import { updateUserPreference } from "../../server-actions/userPreference-actions";
import { useTranslations } from "next-intl";

export function UserPreferences({
  preference,
  error,
}: {
  preference: TUserPreference | null;
  error: ZSAError | null;
}) {
  const t = useTranslations("settings.UserPreferences");

  useEffect(() => {
    if (error) {
      toast.error(
        error.message || "Something went wrong while loading preferences."
      );
      if (process.env.NODE_ENV !== "production") {
        console.error("[UserPreferences] Initial Load Error:", error);
      }
    }
  }, [error]);

  const defaultValues = {
    country: preference?.country ?? "",
    currency: preference?.currency ?? "",
    dateFormat: preference?.dateFormat ?? "",
    numberFormat: preference?.numberFormat ?? "",
    timezone: preference?.timezone ?? "",
    weekStart: preference?.weekStart ?? "monday",
    timeFormat: preference?.timeFormat ?? "",
  };

  const form = useForm<TUserPreferenceValidation>({
    resolver: zodResolver(UserPreferenceValidationSchema),
    defaultValues: {
      country: preference?.country ?? "",
      currency: preference?.currency ?? "",
      dateFormat: preference?.dateFormat ?? "",
      numberFormat: preference?.numberFormat ?? "",
      timezone: preference?.timezone ?? "",
      weekStart: preference?.weekStart ?? "monday",
      timeFormat: preference?.timeFormat ?? "",
    },
  });

  const currentValues = form.watch();

  const { formatDate, formatCurrency, formatNumber, formatTime } =
    createPresenter({
      ...currentValues,
      country: currentValues.country || "en",
    });

  const { execute, isPending } = useServerAction(updateUserPreference, {
    onSuccess() {
      toast.success("Preferences updated successfully.");
    },
    onError(ctx) {
      toast.error("An Error Occurred.", {
        description:
          ctx.err.message || "Something went wrong while updating preferences.",
      });
    },
  });

  const onSubmit = async (values: TUserPreferenceValidation) => {
    const data = {
      ...values,
      id: preference?.id ?? "",
      userId: preference?.userId ?? "",
    };

    await execute(data);
  };

  const isInitialMount = useRef(true);
  const prevCountry = useRef<string | undefined>(undefined);
  const isManualReset = useRef(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevCountry.current = currentValues.country;
      return;
    }

    if (isManualReset.current) {
      isManualReset.current = false;
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
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
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
                {/* Country Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {t("country.title")}
                    </CardTitle>
                    <CardDescription>
                      {t("country.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* ================= Country ================= */}
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label={t("fields.country.label")}
                          name="country"
                          placeholder={t("fields.country.placeholder")}
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

                {/* Localization Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {t("localization.title")}
                    </CardTitle>
                    <CardDescription>
                      {t("localization.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* ================= Timezone & Date ================= */}
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label={t("fields.timezone.label")}
                          name="timezone"
                          placeholder={t("fields.timezone.placeholder")}
                        >
                          {timezoneOptions.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </FormSelect>

                        <FormSelect
                          control={form.control}
                          label={t("fields.dateFormat.label")}
                          name="dateFormat"
                          placeholder={t("fields.dateFormat.placeholder")}
                        >
                          {dateFormatOptions.map((df) => (
                            <SelectItem key={df.value} value={df.value}>
                              {df.label}
                            </SelectItem>
                          ))}
                        </FormSelect>
                      </div>
                    </FieldGroup>

                    {/* ================= Time Format & Week Start ================= */}
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label={t("fields.timeFormat.label")}
                          name="timeFormat"
                          placeholder={t("fields.timeFormat.placeholder")}
                        >
                          {timeFormatOptions.map((tf) => (
                            <SelectItem key={tf.value} value={tf.value}>
                              {tf.label}
                            </SelectItem>
                          ))}
                        </FormSelect>

                        <FormSelect
                          control={form.control}
                          label={t("fields.weekStart.label")}
                          name="weekStart"
                          placeholder={t("fields.weekStart.placeholder")}
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

                {/* Regional Settings Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {t("regional.title")}
                    </CardTitle>
                    <CardDescription>
                      {t("regional.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* ================= Currency & Number Format ================= */}
                    <FieldGroup>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormSelect
                          control={form.control}
                          label={t("fields.currency.label")}
                          name="currency"
                          placeholder={t("fields.currency.placeholder")}
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
                          label={t("fields.numberFormat.label")}
                          name="numberFormat"
                          placeholder={t("fields.numberFormat.placeholder")}
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
                    disabled={isPending}
                  >
                    {t("buttons.save")}
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    variant="outline"
                    onClick={() => {
                      // isManualReset.current = true;
                      form.reset(defaultValues);
                    }}
                    disabled={isPending}
                  >
                    {t("buttons.reset")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Column - Preview */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl">{t("preview.title")}</CardTitle>
                <CardDescription>{t("preview.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date and Time Preview */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{t("preview.date")}</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatDate(new Date())}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{t("preview.time")}</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatTime(new Date())}
                    </div>
                  </div>
                </div>

                {/* Currency and Number Preview */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{t("preview.currency")}</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(1224.87)}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                      <Hash className="w-4 h-4" />
                      <span>{t("preview.number")}</span>
                    </div>
                    <div className="text-lg font-semibold">
                      {formatNumber(1224.87)}
                    </div>
                  </div>
                </div>

                {/* Measurements Preview */}
                {/* <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Measurements</h3>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Distance (10 km):</span>
                    </div>
                    <span className="font-semibold">6.2 mi</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Weight className="w-4 h-4" />
                      <span>Weight (75 kg):</span>
                    </div>
                    <span className="font-semibold">165.3 lbs</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Thermometer className="w-4 h-4" />
                      <span>Temperature (20 °C):</span>
                    </div>
                    <span className="font-semibold">68.0 °F</span>
                  </div>
                </div> */}
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
