"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSession } from "../../auth/betterauth/auth-client";
import { useAdminModalStore } from "../stores/admin-modal-store";
import { useServerAction } from "zsa-react";
import { FormSelect } from "@/modules/shared/custom-form-fields";
import { SelectItem } from "@/components/ui/select";
import { FieldGroup } from "@/components/ui/field";
import {
  PreferenceTemplateValidationSchema,
  TPreferenceTemplateValidation,
} from "@/modules/shared/schemas/admin/preferenceTemplateValidationSchema";
import {
  countryOptions,
  currencyOptions,
  dateFormatOptions,
  numberFormatOptions,
  scopeOptions,
  timeFormatOptions,
  timezoneOptions,
  weekStartOptions,
} from "@/modules/shared/staticDatas/preference-datas";
import { createPreferenceTemplate } from "../server-actions/preferenceTemplate-actions";

export const CreatePreferenceTemplateModal = () => {
  const session = useSession();
  const closeModal = useAdminModalStore((state) => state.onClose);
  const modalType = useAdminModalStore((state) => state.type);
  const isOpen = useAdminModalStore((state) => state.isOpen);

  const isModalOpen = isOpen && modalType === "addPreferenceTemplate";

  const form = useForm<TPreferenceTemplateValidation>({
    resolver: zodResolver(PreferenceTemplateValidationSchema),
    defaultValues: {
      country: "",
      scope: "GLOBAL",
      currency: "",
      dateFormat: "",
      numberFormat: "",
      timezone: "",
      weekStart: "monday",
      timeFormat: "",
    },
  });

  // const formLiveData = form.watch();

  // const {
  //   formatDate,
  //   formatCurrency,
  //   formatNumber,
  //   convertMeasurement,
  //   formatTime,
  //   getScope,
  //   getWeekStart,
  // } = createPresenter({
  //   ...formLiveData,
  //   country: formLiveData.country || "en",
  // });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(createPreferenceTemplate, {
    onSuccess() {
      toast.success(`Preference Template created.`);
      handleCloseModal();
    },
    onError({ err }) {
      toast.error("An Error Occurred!", {
        description: err.message,
      });
    },
  });

  async function handleCreateApp(values: TPreferenceTemplateValidation) {
    if (!session) {
      return;
    }

    await execute({ ...values });
  }

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateApp)}
            className="space-y-5"
          >
            <DialogHeader>
              <DialogTitle>Create Preference Template</DialogTitle>
              <DialogDescription>
                Create a preference template to define default regional, time,
                and format settings for your organization or global scope.
              </DialogDescription>
            </DialogHeader>
            {/* ================= Scope & Country ================= */}
            <FieldGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  label="Scope"
                  name="scope"
                  placeholder="Select Scope"
                >
                  {scopeOptions.map((scope) => (
                    <SelectItem key={scope.value} value={scope.value}>
                      {scope.label}
                    </SelectItem>
                  ))}
                </FormSelect>

                <FormSelect
                  control={form.control}
                  label="Country"
                  name="country"
                  placeholder="Select Country"
                >
                  {countryOptions.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </FormSelect>
              </div>
            </FieldGroup>

            {/* ================= Timezone & Currency ================= */}
            <FieldGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  label="Timezone"
                  name="timezone"
                  placeholder="Select Timezone"
                >
                  {timezoneOptions.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </FormSelect>

                <FormSelect
                  control={form.control}
                  label="Currency"
                  name="currency"
                  placeholder="Select Currency"
                >
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </FormSelect>
              </div>
            </FieldGroup>

            {/* ================= Date & Time Format ================= */}
            <FieldGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  label="Date Format"
                  name="dateFormat"
                  placeholder="Select Date Format"
                >
                  {dateFormatOptions.map((df) => (
                    <SelectItem key={df.value} value={df.value}>
                      {df.label}
                    </SelectItem>
                  ))}
                </FormSelect>

                <FormSelect
                  control={form.control}
                  label="Time Format"
                  name="timeFormat"
                  placeholder="Select Time Format"
                >
                  {timeFormatOptions.map((tf) => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {tf.label}
                    </SelectItem>
                  ))}
                </FormSelect>
              </div>
            </FieldGroup>

            {/* ================= Number & Measurement ================= */}
            <FieldGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  control={form.control}
                  label="Number Format"
                  name="numberFormat"
                  placeholder="Select Number Format"
                >
                  {numberFormatOptions.map((nf) => (
                    <SelectItem key={nf.value} value={nf.value}>
                      {nf.label}
                    </SelectItem>
                  ))}
                </FormSelect>

                {/* <FormSelect
                  control={form.control}
                  label="Measurement System"
                  name="measurementSystem"
                  placeholder="Select Measurement System"
                >
                  {measurementSystemOptions.map((ms) => (
                    <SelectItem key={ms.value} value={ms.value}>
                      {ms.label}
                    </SelectItem>
                  ))}
                </FormSelect> */}
                <FormSelect
                  control={form.control}
                  label="Week Start Day"
                  name="weekStart"
                  placeholder="Select Week Start"
                >
                  {weekStartOptions.map((week) => (
                    <SelectItem key={week.value} value={week.value}>
                      {week.label}
                    </SelectItem>
                  ))}
                </FormSelect>
              </div>
            </FieldGroup>

            {/* ================= Week Start ================= */}
            {/* <FieldGroup>
              <FormSelect
                control={form.control}
                label="Week Start Day"
                name="weekStart"
                placeholder="Select Week Start"
              >
                {weekStartOptions.map((week) => (
                  <SelectItem key={week.value} value={week.value}>
                    {week.label}
                  </SelectItem>
                ))}
              </FormSelect>
            </FieldGroup> */}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isSubmitting} size="sm">
                {isSubmitting ? (
                  <>
                    Create <Loader2 className="animate-spin" />
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
