"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FieldGroup } from "@/components/ui/field";
import {
  bloodGroupOptions,
  genders,
  insuranceProviders,
  maritalStatusOptions,
} from "@/modules/client/telemedicine/datas/patient-profile-datas";
import {
  PatientPersonalDetailsSchema,
  TPatientPersonalDetails,
} from "@/modules/shared/schemas/telemedicine/patientProfile/patientProfileValidationSchema";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/modules/shared/custom-form-fields";
import { TPatientWithPersonalProfile } from "@/modules/shared/entities/models/telemedicine/patientProfile";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import {
  createorUpdatePatientPersonalDetails,
  createPatientInitialProfile,
} from "../../server-actions/patientProfile-actions";

type TUser = {
  id: string;
  name: string;
  username?: string | null;
  currentOrgId?: string | null;
};

interface PersonalDetailsStepProps {
  data: TPatientWithPersonalProfile | null;
  user: TUser;
}

export function PatientProfilePersonalDetails({
  data,
  user,
}: PersonalDetailsStepProps) {
  const [open, setOpen] = useState(false);
  const hasTriggeredRef = useRef(false);

  const {
    execute: createInitialProfile,
    isPending: createInitialProfileIsPending,
  } = useServerAction(createPatientInitialProfile, {
    onSuccess() {
      toast.success("Profile initialized");
    },
    onError({ err }) {
      toast.error(err.message || "Failed to create initial patient profile");
    },
  });

  useEffect(() => {
    if (!data && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      createInitialProfile({
        orgId: user.currentOrgId!,
        userId: user.id,
        isABHAPatientProfile: false,
        createdBy: user.id,
      });
    }
  }, [data]);

  const { execute, isPending } = useServerAction(
    createorUpdatePatientPersonalDetails,
    {
      onSuccess() {
        toast.success(
          `Personal details ${
            data?.personal?.id ? "updated" : "created"
          } successfully.`
        );
      },
      onError({ err }) {
        toast.error("Error!", {
          description: err.message,
        });
      },
    }
  );

  const form = useForm<TPatientPersonalDetails>({
    resolver: zodResolver(PatientPersonalDetailsSchema),
    defaultValues: data?.personal ?? {
      name: "",
      dateOfBirth: undefined,

      insuranceProvider: "",
      insuranceNumber: "",
      idCardNumber: "",
      maritalStatus: "",
      bloodGroup: "",

      mobileNumber: "",
      email: "",
      address: "",
      alternativeAddress: "",
      alternativeMobileNumber: "",
      alternativeEmail: "",
    },
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center mt-18">
        <p className="text-muted-foreground flex items-center gap-2 text-lg">
          <Loader2 className="animate-spin size-5" />
          Setting up your profile...
        </p>
      </div>
    );
  }

  const handleSubmit = async (values: TPatientPersonalDetails) => {
    if (!data?.id) return;

    let id: string | null;

    if (data?.personal?.id) {
      id = data?.personal?.id;
    } else {
      id = null;
    }

    await execute({
      patientId: data?.id,
      orgId: user.currentOrgId!,
      id,
      operationBy: user.id,
      ...values,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Personal Details
            </h2>
            <p className="text-muted-foreground">
              Add the basic personal details of the patient.
            </p>
          </div>

          {/* side preview removed — full review is on step 5 */}
        </div>

        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Name */}
          <FormInput
            control={form.control}
            name="name"
            label={
              <p>
                Name <span className="text-red-500">*</span>
              </p>
            }
            placeholder="Enter full name"
          />

          {/* DOB */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>
                  Date of Birth <span className="text-red-500">*</span>
                </FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 text-left font-medium",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        setOpen(false);
                        field.onChange(date);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      className="pointer-events-auto"
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormSelect
            control={form.control}
            name="gender"
            placeholder="Select gender"
            label={
              <p>
                Gender <span className="text-red-500">*</span>
              </p>
            }
          >
            {genders.map((gender, i) => (
              <SelectItem key={i} value={gender.value}>
                {gender.label}
              </SelectItem>
            ))}
          </FormSelect>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormTextarea
            control={form.control}
            name="address"
            label="Address *"
            placeholder="Your Address"
          />

          <FormTextarea
            control={form.control}
            name="alternativeAddress"
            label="Alternative Address"
            placeholder="Enter the Alternative"
          />

          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+91 1234567890"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alternativeMobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternative Mobile</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+91 1234567890"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alternativeEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternative Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insuranceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Provider</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceProviders.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insurance Number */}
          <FormField
            control={form.control}
            name="insuranceNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter insurance number"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Marital Status */}
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marital Status *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      {maritalStatusOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Blood Group */}
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group *</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroupOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ID Card Numbers */}
          <FormField
            control={form.control}
            name="idCardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Card Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter ID card number"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>

        <Button
          size="sm"
          className="w-fit self-end"
          disabled={isPending || createInitialProfileIsPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          {data?.personal ? "Update" : "Create"} Profile
        </Button>
      </form>
    </Form>
  );
}
