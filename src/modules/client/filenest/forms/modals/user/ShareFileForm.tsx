import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { FormSwitch } from "@/modules/shared/custom-form-fields";
import { TShareUserFileFormSchema } from "@/modules/shared/schemas/filenest/userFilePermission/userFilePermissionFormSchema";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface ShareFileFormProps {
  onCancel: () => void;
  onSubmit: (data: TShareUserFileFormSchema) => Promise<void>;
  isDisable?: boolean;
}

export function ShareFileForm({
  onCancel,
  onSubmit,
  isDisable,
}: ShareFileFormProps) {
  const form = useFormContext<TShareUserFileFormSchema>();

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = async (data: TShareUserFileFormSchema) => {
    await onSubmit(data);
  };

  const handleCloseModal = () => {
    form.reset();
    onCancel();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Access level</FieldLegend>
          <FieldGroup className="gap-2">
            <FormSwitch control={form.control} name="canView">
              <span className="text-muted-foreground text-sm">View</span>
            </FormSwitch>
            <FormSwitch control={form.control} name="canDownload">
              <span className="text-muted-foreground text-sm">Download</span>
            </FormSwitch>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSubmitting || isDisable}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sharing...
            </>
          ) : (
            "Share"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
