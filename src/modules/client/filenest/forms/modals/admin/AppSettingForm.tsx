"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { FolderOpen, Loader2 } from "lucide-react";
import { TCreateOrUpdateAppStorageSettingFormSchema } from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
import {
  FormInput,
  FormSelect,
  FormSwitch,
} from "@/modules/shared/custom-form-fields";
import { fileSizeOptions } from "../../../datas/storage";
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
import { storageTypeOptions } from "@/modules/shared/entities/enums/filenest/storage";
import { useEffect } from "react";

interface AppSettingFormProps {
  appSettingsRequiredDatas?: TAppSettingsColumnProps | null;
  onSubmit: (data: TCreateOrUpdateAppStorageSettingFormSchema) => Promise<void>;
  onCancel: () => void;
}

export function AppSettingForm({
  appSettingsRequiredDatas,
  onSubmit,
  onCancel,
}: AppSettingFormProps) {
  const form = useFormContext<TCreateOrUpdateAppStorageSettingFormSchema>();

  const {
    formState: { isSubmitting },
  } = form;

  const type = form.watch("type");

  useEffect(() => {
    if (type === "LOCAL") form.setValue("cloudStorageConfigId", null);
    if (type === "CLOUD") form.setValue("localStorageConfigId", null);
  }, [type]);

  const handleSubmit = async (
    data: TCreateOrUpdateAppStorageSettingFormSchema
  ) => {
    await onSubmit(data);
  };

  const handleCancel = () => {
    onCancel();
  };

  const appSelectData = appSettingsRequiredDatas?.appDatas?.map((appData) => ({
    value: appData.id,
    label: appData.name,
  }));

  const cloudSelectData = appSettingsRequiredDatas?.cloudStorageConfigs?.map(
    (cloudConfig) => ({
      value: cloudConfig.id,
      label: cloudConfig.name,
    })
  );

  const localSelectData = appSettingsRequiredDatas?.localStorageConfigs?.map(
    (localConfig) => ({
      value: localConfig.id,
      label: localConfig.name,
    })
  );

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

      {/* Storage Configuration */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Storage Configuration</FieldLegend>
          <FieldGroup className="grid grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="name"
              placeholder="Primary Storage"
              label="Setting Name"
            />

            <FormSelect
              control={form.control}
              name="type"
              label="Storage Type"
              placeholder="Select a type"
              customValue={form.watch("type").toString()}
              onCustomChange={(value) =>
                form.setValue("type", value as "LOCAL" | "CLOUD")
              }
            >
              {storageTypeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </FormSelect>

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
                        placeholder="filenest"
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

      {/* Link to Storage Configuration */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Link to Storage Configuration</FieldLegend>
          <FieldGroup className="grid sm:grid-cols-2 gap-4">
            {type === "CLOUD" ? (
              <FormSelect
                control={form.control}
                name="cloudStorageConfigId"
                label="Cloud Storage Configuration"
                placeholder="Select a config"
                customValue={form.watch("cloudStorageConfigId")?.toString()}
                onCustomChange={(value) => {
                  form.setValue("cloudStorageConfigId", BigInt(value));
                }}
              >
                {cloudSelectData?.map((cloudConfig) => (
                  <SelectItem
                    key={cloudConfig.value}
                    value={cloudConfig.value.toString()}
                  >
                    {cloudConfig.label}
                  </SelectItem>
                ))}
              </FormSelect>
            ) : (
              <FormSelect
                control={form.control}
                name="localStorageConfigId"
                label="Local Storage Configuration"
                placeholder="Select a config"
                customValue={form.watch("localStorageConfigId")?.toString()}
                onCustomChange={(value) => {
                  form.setValue("localStorageConfigId", BigInt(value));
                }}
              >
                {localSelectData?.map((localConfig) => (
                  <SelectItem
                    key={localConfig.value}
                    value={localConfig.value.toString()}
                  >
                    {localConfig.label}
                  </SelectItem>
                ))}
              </FormSelect>
            )}
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      {/* Settings */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Settings</FieldLegend>
          <FieldGroup className="grid grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="maxFileSize"
              label="Maximum File Size"
              placeholder="Select max size"
              customValue={form.watch("maxFileSize").toString()}
              onCustomChange={(value) =>
                form.setValue("maxFileSize", parseInt(value))
              }
            >
              {fileSizeOptions.map((size) => (
                <SelectItem key={size.value} value={size.value.toString()}>
                  {size.label}
                </SelectItem>
              ))}
            </FormSelect>

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
