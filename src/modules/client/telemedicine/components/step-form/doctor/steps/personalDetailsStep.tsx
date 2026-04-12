import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StepNavigation } from "./stepNavigation";
import {
  DoctorPersonalDetailsSchema,
  socialProviderData,
  TDoctorPersonalDetails,
} from "../../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { TDoctorPersonalDetails as TProfileDetails } from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { langSpoken, titles } from "../../../../datas/doctor-profile-datas";
import { FormInput, FormSelect } from "@/modules/shared/custom-form-fields";
import { FieldGroup } from "@/components/ui/field";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

interface PersonalDetailsStepProps {
  data?: TDoctorPersonalDetails;
  onNext: (data: TDoctorPersonalDetails) => void;
  onSaveDraft: (data: Partial<TDoctorPersonalDetails>) => void;
  profileData?: TProfileDetails | null;
  isLoading?: boolean;
}

export function PersonalDetailsStep({
  data,
  onNext,
  onSaveDraft,
  profileData,
  isLoading = false,
}: PersonalDetailsStepProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<TDoctorPersonalDetails>({
    resolver: zodResolver(DoctorPersonalDetailsSchema),
    defaultValues: data || {
      title: profileData?.title ?? "",
      fullName: "",
      nationality: "Indian",
      languagesSpoken: [],
      gender: profileData?.gender ?? "",
      speciality: "",
      // fatherName: "",
      kycAddress: {
        careOf: "",
        addressLine: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
      },
      socialAccounts: [
        {
          id: "1",
          platform: "",
          url: "",
        },
      ],
      communicationAddress: {
        sameAsKyc: true,
      },
      mobileNumber: "",
      email: "",
      alternativeMobileNumber: profileData?.alternativeMobileNumber ?? "",
      alternativeEmail: profileData?.alternativeEmail ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialAccounts",
  });
  const sameAsKyc = form.watch("communicationAddress.sameAsKyc");

  const handleSubmit = (values: TDoctorPersonalDetails) => {
    onNext(values as TDoctorPersonalDetails);
  };

  const addSocial = () => {
    append({
      id: Date.now().toString(),
      platform: "",
      url: "",
    });
  };

  useEffect(() => {
    console.log("----------Running useEffect----------");
    if (profileData) {
      const languagesSpoken = profileData?.languagesSpoken.map(
        (l) => l.langCode
      );
      const socialAccounts = profileData?.socialAccounts.map((s) => ({
        id: s.id,
        platform: s.platform,
        url: s.url,
      }));
      const kycAddress = {
        careOf: profileData.kycAddress?.careOf,
        addressLine: profileData.kycAddress?.addressLine,
        city: profileData.kycAddress?.city,
        district: profileData.kycAddress?.district,
        state: profileData.kycAddress?.state,
        pincode: profileData.kycAddress?.pincode,
      };
      const communicationAddress = {
        sameAsKyc: profileData.communicationAddress?.sameAsKyc,
        careOf: profileData.kycAddress?.careOf,
        addressLine: profileData.kycAddress?.addressLine,
        city: profileData.kycAddress?.city,
        district: profileData.kycAddress?.district,
        state: profileData.kycAddress?.state,
        pincode: profileData.kycAddress?.pincode,
      };

      form.reset({
        title: profileData.title ?? "",
        fullName: profileData.fullName,
        nationality: profileData.nationality,
        languagesSpoken,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender ?? "",
        socialAccounts,
        kycAddress,
        communicationAddress,
        mobileNumber: profileData.mobileNumber,
        email: profileData.email,
        speciality: profileData.speciality ?? "",
        alternativeEmail: profileData.alternativeEmail ?? "",
        alternativeMobileNumber: profileData.alternativeMobileNumber ?? "",
      });
    }
  }, [form, profileData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Personal Details
          </h2>
          <p className="text-muted-foreground">
            Please provide your basic information as per your official documents
          </p>
        </div>

        {/* Basic Information */}
        <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormSelect
            control={form.control}
            name="title"
            label={
              <p>
                Title <span className="text-red-500">*</span>
              </p>
            }
            placeholder="Select a title"
          >
            {titles.map((title) => (
              <SelectItem key={title.value} value={title.value}>
                {title.label}
              </SelectItem>
            ))}
          </FormSelect>

          <FormInput
            control={form.control}
            name="fullName"
            label={
              <p>
                Full Name <span className="text-red-500">*</span>
              </p>
            }
            placeholder="Enter your full name"
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>Date of Birth *</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
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

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            control={form.control}
            name="nationality"
            label={
              <p>
                Nationality <span className="text-red-500">*</span>
              </p>
            }
            placeholder="Enter nationality"
          />

          <FormInput
            control={form.control}
            name="speciality"
            label={
              <p>
                Speciality <span className="text-red-500">*</span>
              </p>
            }
            placeholder="Enter speciality"
          />
        </FieldGroup>

        {/* Languages Spoken */}
        <FormField
          control={form.control}
          name="languagesSpoken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages Spoken *</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={langSpoken}
                  placeholder="Select languages you spoke"
                  emptyIndicator={<p>no language found</p>}
                  onChange={(selected: Option[]) => {
                    const values = selected.map((s) => s.value);
                    field.onChange(values);
                  }}
                  value={langSpoken.filter((o) =>
                    field.value?.includes(o.value)
                  )}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number *</FormLabel>
                <FormControl>
                  <Input placeholder="+91 9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            control={form.control}
            name="alternativeMobileNumber"
            placeholder="+91 9876543210"
            label="Alternative Mobile Number"
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            control={form.control}
            name="alternativeEmail"
            placeholder="your.email@example.com"
            label="Alternative Email Address"
          />
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Social Account Details</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSocial}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Qualification
            </Button>
          </CardHeader>
          <CardDescription className="px-5 space-y-5">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Social {index + 1}</CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <div className="px-5">
                  <FieldGroup>
                    <FormSelect
                      control={form.control}
                      name={`socialAccounts.${index}.platform`}
                      label="Social Name"
                      placeholder="Select a social account"
                    >
                      {socialProviderData.map((provider, i) => (
                        <SelectItem key={i} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </FormSelect>

                    <FormInput
                      control={form.control}
                      name={`socialAccounts.${index}.url`}
                      label="Social Profile URL"
                      placeholder="https://linkedin/drgodly"
                    />
                  </FieldGroup>
                </div>
              </Card>
            ))}
          </CardDescription>
        </Card>

        {/* KYC Address */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Address as per KYC (Aadhaar)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="kycAddress.careOf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>C/O *</FormLabel>
                  <FormControl>
                    <Input placeholder="Care of" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kycAddress.addressLine"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address Line *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="House/Flat No., Street, Area"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kycAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kycAddress.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <FormControl>
                    <Input placeholder="District" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kycAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kycAddress.pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode *</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" maxLength={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Communication Address */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Communication Address
          </h3>

          <FormField
            control={form.control}
            name="communicationAddress.sameAsKyc"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 mb-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Same as KYC address
                </FormLabel>
              </FormItem>
            )}
          />

          {!sameAsKyc && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="communicationAddress.careOf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>C/O</FormLabel>
                    <FormControl>
                      <Input placeholder="Care of" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communicationAddress.addressLine"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Address Line</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="House/Flat No., Street, Area"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communicationAddress.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communicationAddress.district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="District" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communicationAddress.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communicationAddress.pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" maxLength={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <StepNavigation
          currentStep={1}
          totalSteps={4}
          onPrevious={() => {}}
          onNext={() => {}}
          onSaveDraft={() => onSaveDraft(form.getValues())}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
}
