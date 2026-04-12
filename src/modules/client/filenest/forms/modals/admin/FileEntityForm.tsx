"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FolderOpen, Loader2 } from "lucide-react";
import { TCreateOrUpdateFileEntityFormSchema } from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import {
  FormInput,
  FormSelect,
  FormSwitch,
} from "@/modules/shared/custom-form-fields";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { TAppSettingsColumnProps } from "../../../types/appSettings";
import { SelectItem } from "@/components/ui/select";

interface FileEntityFormProps {
  appSettingsRequiredDatas?: TAppSettingsColumnProps | null;
  onSubmit: (data: TCreateOrUpdateFileEntityFormSchema) => Promise<void>;
  onCancel: () => void;
}

export function FileEntityForm({
  appSettingsRequiredDatas,
  onSubmit,
  onCancel,
}: FileEntityFormProps) {
  const form = useFormContext<TCreateOrUpdateFileEntityFormSchema>();

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = async (data: TCreateOrUpdateFileEntityFormSchema) => {
    await onSubmit(data);
  };

  const handleCancel = () => {
    onCancel();
  };

  const appSelectData = appSettingsRequiredDatas?.appDatas?.map((appData) => ({
    value: appData.id,
    label: appData.name,
  }));

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* App Identification */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>App Identification</FieldLegend>
          <FieldGroup className="grid sm:grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="appId"
              label="Apps"
              placeholder="Select a app"
              customValue={form.watch("appId").toString()}
              onCustomChange={(value) => {
                const appSlug = appSettingsRequiredDatas?.appDatas?.find(
                  (appData) => appData.id === value
                )?.slug;

                form.setValue("appId", value);
                form.setValue("appSlug", appSlug!);
              }}
            >
              {appSelectData?.map((appData) => (
                <SelectItem key={appData.value} value={appData.value}>
                  {appData.label}
                </SelectItem>
              ))}
            </FormSelect>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      {/* Basic Info */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Basic Information</FieldLegend>
          <FieldGroup className="grid sm:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="name"
              placeholder="DOCTOR_PROFILE_IMAGE"
              label="Entity Name"
              // description="Use UPPER_SNAKE_CASE format"
            />

            <FormInput
              control={form.control}
              name="label"
              placeholder="Doctor Profile Image"
              label="Display Label"
            />

            <FormInput
              control={form.control}
              name="type"
              placeholder="DOCTOR"
              label="Type of the Entity"
              // description="Use UPPER_SNAKE_CASE format (e.g: DOCTOR, PATIENT, APPOINTMENT)"
            />

            <Controller
              control={form.control}
              name="subFolder"
              render={({ field, fieldState }) => {
                return (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Sub Folder</FieldLabel>
                    </FieldContent>
                    <InputGroup>
                      <InputGroupAddon>
                        <FolderOpen className="text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        value={field.value ?? ""}
                        placeholder="lab-report"
                      />
                    </InputGroup>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      {/* Settings */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Settings</FieldLegend>
          <FieldGroup className="grid grid-cols-2 gap-4">
            <FormSwitch
              control={form.control}
              name="isActive"
              label="Active Status"
            >
              <span className="text-sm text-muted-foreground">
                {form.watch("isActive") ? "Active" : "Inactive"}
              </span>
            </FormSwitch>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      {/* Actions */}
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button disabled={isSubmitting} size="sm">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Save Configuration
            </>
          ) : (
            "Save Configuration"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
