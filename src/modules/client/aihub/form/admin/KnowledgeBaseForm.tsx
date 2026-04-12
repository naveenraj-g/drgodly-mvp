"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormInput, FormTextarea } from "@/modules/shared/custom-form-fields";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { TCreateOrUpdateKnowledgeBaseFormSchema } from "../../modals/admin/CreateKnowledgeBaseModal";

interface IKnowledgeBaseFormProps {
  onSubmit: (data: TCreateOrUpdateKnowledgeBaseFormSchema) => Promise<void>;
  onCancel: () => void;
}

export function KnowledgeBaseForm({
  onSubmit,
  onCancel,
}: IKnowledgeBaseFormProps) {
  const form = useFormContext<TCreateOrUpdateKnowledgeBaseFormSchema>();

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = async (data: TCreateOrUpdateKnowledgeBaseFormSchema) => {
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
              placeholder="e.g., Product Documentation"
              label="Name"
            />

            <FormTextarea
              control={form.control}
              name="description"
              placeholder="Describe the contents of this knowledge base..."
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
              <Loader2 className="animate-spin" /> Create
            </>
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
