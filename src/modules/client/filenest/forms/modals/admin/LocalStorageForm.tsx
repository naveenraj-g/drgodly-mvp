"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SelectItem } from "@/components/ui/select";
import { FolderOpen, Loader2 } from "lucide-react";
import { TCreateOrUpdateLocalStorageFormSchema } from "@/modules/shared/schemas/filenest/filenestValidationSchemas";
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

interface LocalStorageFormProps {
  onSubmit: (data: TCreateOrUpdateLocalStorageFormSchema) => Promise<void>;
  onCancel: () => void;
}

export function LocalStorageForm({
  onSubmit,
  onCancel,
}: LocalStorageFormProps) {
  const form = useFormContext<TCreateOrUpdateLocalStorageFormSchema>();

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = async (data: TCreateOrUpdateLocalStorageFormSchema) => {
    await onSubmit(data);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Basic Info */}
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Basic Information</FieldLegend>
          <FieldGroup className="grid sm:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="name"
              placeholder="My Local Storage"
              label="Configuration Name"
            />

            <Controller
              control={form.control}
              name="basePath"
              render={({ field, fieldState }) => {
                return (
                  <Field className="gap-2" data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>Base Path</FieldLabel>
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
                        placeholder="/var/filenest/files"
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
