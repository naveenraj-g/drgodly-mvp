"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2, Stethoscope, Video, CheckCircle2 } from "lucide-react";
import { useServerAction } from "zsa-react";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useDoctorModalStore } from "../../stores/doctor-modal-store";
import { FormInput, FormTextarea } from "@/modules/shared/custom-form-fields";
import {
  CreateDoctorServiceFormSchema,
  TCreateDoctorServiceForm,
} from "@/modules/shared/schemas/telemedicine/doctorService/doctorServiceValidationSchema";
import { createDoctorService } from "../../server-actions/doctorService-action";

const currencies = ["USD", "INR", "EUR", "GBP"] as const;

type ModeKey = "INPERSON" | "VIRTUAL";

function ModeTile({
  icon: Icon,
  label,
  subtitle,
  selected,
  onClick,
}: {
  icon: React.ComponentType<any>;
  label: string;
  subtitle: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-md border p-2 py-3 text-left transition-all",
        "hover:border-primary/70 hover:shadow-sm",
        selected ? "border-primary ring-2 ring-primary/20" : "border-muted"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "rounded-full p-2",
            selected ? "bg-primary/10" : "bg-muted"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium leading-none">{label}</p>
            {selected && <CheckCircle2 className="h-4 w-4" />}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}

export const CreateDoctorServiceModal: React.FC = () => {
  const closeModal = useDoctorModalStore((s) => s.onClose);
  const modalType = useDoctorModalStore((s) => s.type);
  const isOpen = useDoctorModalStore((s) => s.isOpen);
  const userId = useDoctorModalStore((s) => s.userId);
  const orgId = useDoctorModalStore((s) => s.orgId);

  const isModalOpen = isOpen && modalType === "addService";

  const form = useForm<TCreateDoctorServiceForm>({
    resolver: zodResolver(CreateDoctorServiceFormSchema),
    defaultValues: {
      name: "",
      duration: 30,
      supportedModes: ["INPERSON"],
      description: null,
      priceAmount: null,
      priceCurrency: null,
    },
    mode: "onTouched",
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { execute } = useServerAction(createDoctorService, {
    onSuccess() {
      toast.success("Service Created.");
      handleCloseModal();
    },
    onError({ err }: any) {
      toast.error("An Error Occurred!", {
        description: err?.message ?? "Please try again later.",
      });
    },
  });

  function handleCloseModal() {
    form.reset();
    closeModal();
  }

  const modes = form.watch("supportedModes");
  const has = (k: ModeKey) => modes.includes(k);
  const toggle = (k: ModeKey) => {
    const next = has(k) ? modes.filter((m) => m !== k) : [...modes, k];

    // Ensure we never pass an empty array to a field typed as a non-empty tuple.
    // If the toggle would result in an empty array, prevent the update.
    if (next.length === 0) {
      return;
    }

    // Cast to the required non-empty tuple type for TypeScript.
    form.setValue("supportedModes", next as [ModeKey, ...ModeKey[]], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  async function onSubmit(values: TCreateDoctorServiceForm) {
    if (!userId || !orgId) {
      toast.error("Unauthorized", {
        description: "User or Organization information is missing.",
      });
      return;
    }

    await execute({
      userId,
      orgId,
      operationBy: userId,
      ...values,
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create Service</DialogTitle>
              <DialogDescription>
                Define the service details, price and supported modes.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              {/* Service Name */}
              <FormInput
                control={form.control}
                name="name"
                label={
                  <>
                    Service Name
                    <span className="text-red-400">*</span>
                  </>
                }
                placeholder="e.g. General Checkup, Cardiac Screening"
              />

              {/* Two column: Duration + Price */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Duration (Minutes){" "}
                        <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min={5} step={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-2">
                  <Label>Price</Label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <FormField
                      control={form.control}
                      name="priceAmount"
                      render={({ field }) => (
                        <FormItem className="m-0">
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                field.onChange(v === "" ? null : Number(v));
                              }}
                              placeholder="110"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceCurrency"
                      render={({ field }) => (
                        <FormItem className="m-0">
                          <Select onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="md:w-[110px]">
                                <SelectValue placeholder="Select a Currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currencies.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Supported Modes */}
              <FormItem>
                <FormLabel>
                  Supported Modes <span className="text-red-400">*</span>
                </FormLabel>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ModeTile
                    icon={Stethoscope}
                    label="In‑Person"
                    subtitle="Visit the clinic"
                    selected={has("INPERSON")}
                    onClick={() => toggle("INPERSON")}
                  />
                  <ModeTile
                    icon={Video}
                    label="Virtual"
                    subtitle="Video consultation"
                    selected={has("VIRTUAL")}
                    onClick={() => toggle("VIRTUAL")}
                  />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select one or both.
                </p>
                <FormMessage>
                  {form.formState.errors.supportedModes?.message as any}
                </FormMessage>
              </FormItem>

              <FormTextarea
                control={form.control}
                name="description"
                label="Description (Optinal)"
                placeholder="Provide a brief description of the service."
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    Save <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
