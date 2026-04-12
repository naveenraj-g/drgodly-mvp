"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormInput, FormTextarea } from "@/modules/shared/custom-form-fields";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { TCreateOrUpdateEndpointFormSchema } from "../../modals/admin/CreateEndpointModal";

interface IEndpointFormProps {
  onSubmit: (data: TCreateOrUpdateEndpointFormSchema) => Promise<void>;
  onCancel: () => void;
}

export function EndpointForm({ onSubmit, onCancel }: IEndpointFormProps) {
  const form = useFormContext<TCreateOrUpdateEndpointFormSchema>();

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = async (data: TCreateOrUpdateEndpointFormSchema) => {
    await onSubmit(data);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <FieldGroup className="grid grid-cols-1 gap-4">
            <FormInput
              control={form.control}
              name="name"
              placeholder="e.g., Production API"
              label="Name"
            />

            <FormInput
              control={form.control}
              name="url"
              placeholder="https://api.example.com/v1"
              label="URL"
            />

            <FormTextarea
              control={form.control}
              name="description"
              placeholder="Describe this endpoint..."
              label="Description"
            />
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
