import { useForm, useFieldArray } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StepNavigation } from "./stepNavigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DoctorQualificationsSchema,
  TDoctorQualifications,
} from "../../../../../../shared/schemas/telemedicine/doctorProfile/doctorProfileValidationSchema";
import { TDoctorQualifications as TQualificationData } from "@/modules/shared/entities/models/telemedicine/doctorProfile";
import { medicalCouncils } from "../../../../datas/doctor-profile-datas";
import { FieldGroup } from "@/components/ui/field";
import { useEffect } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 50 }, (_, i) =>
  (new Date().getFullYear() - i).toString()
);

interface QualificationStepProps {
  data?: TDoctorQualifications;
  onNext: (data: TDoctorQualifications) => void;
  onPrevious: () => void;
  onSaveDraft: (data: Partial<TDoctorQualifications>) => void;
  qualificationData?: TQualificationData | null;
  isLoading?: boolean;
}

export function QualificationStep({
  data,
  onNext,
  onPrevious,
  onSaveDraft,
  qualificationData,
  isLoading = false,
}: QualificationStepProps) {
  const form = useForm<TDoctorQualifications>({
    resolver: zodResolver(DoctorQualificationsSchema),
    defaultValues: data || {
      systemOfMedicine: qualificationData?.systemOfMedicine ?? "",
      category: qualificationData?.category ?? "",
      councilName: qualificationData?.councilName ?? "",
      registrationNumber: qualificationData?.registrationNumber ?? "",
      registrationType: "permanent",
      nameMatchesAadhaar: true,
      registrationValidDate: null,
      qualifications: [
        {
          id: "1",
          countryOfQualification: "India",
          degreeName: "",
          country: "India",
          state: "",
          college: "",
          university: "",
          passingMonth: "",
          passingYear: "",
          nameMatchesAadhaar: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "qualifications",
  });

  const selectedCouncilName = form.watch().councilName;
  const registrationType = form.watch().registrationType;

  useEffect(() => {
    if (registrationType === "permanent") {
      form.setValue("registrationValidDate", null);
    }
  }, [registrationType, form]);

  useEffect(() => {
    console.log("----------Running useEffect----------");
    if (qualificationData) {
      form.reset({
        category: qualificationData.category,
        systemOfMedicine: qualificationData.systemOfMedicine,
        councilName: qualificationData.councilName,
        registrationNumber: qualificationData.registrationNumber,
        registrationType: qualificationData.registrationType,
        nameMatchesAadhaar: qualificationData.nameMatchesAadhaar,
        registrationValidDate: qualificationData.registrationValidDate,
        qualifications: qualificationData.qualifications,
        dateOfFirstRegistration: qualificationData.dateOfFirstRegistration,
      });
    }
  }, [form, qualificationData]);

  const handleSubmit = (values: TDoctorQualifications) => {
    onNext(values as TDoctorQualifications);
  };

  const addQualification = () => {
    append({
      id: Date.now().toString(),
      countryOfQualification: "India",
      degreeName: "",
      country: "India",
      state: "",
      college: "",
      university: "",
      passingMonth: "",
      passingYear: "",
      nameMatchesAadhaar: true,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Qualifications & Registration
          </h2>
          <p className="text-muted-foreground">
            Provide your medical credentials and professional registration
            details
          </p>
        </div>

        {/* System of Medicine */}
        <Card>
          <CardHeader>
            <CardTitle>System of Medicine</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-136">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="allied">
                        Allied Health Professional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemOfMedicine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System of Medicine *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select system" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="allopathy">
                        Modern Medicine (Allopathy)
                      </SelectItem>
                      <SelectItem value="ayurveda">Ayurveda</SelectItem>
                      <SelectItem value="homeopathy">Homeopathy</SelectItem>
                      <SelectItem value="unani">Unani</SelectItem>
                      <SelectItem value="siddha">Siddha</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Registration Details */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Details</CardTitle>
            <CardDescription>
              {
                medicalCouncils.find((c) => c.value === selectedCouncilName)
                  ?.label
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              <FormField
                control={form.control}
                name="councilName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Register with Council *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select council" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {medicalCouncils.map((council, i) => (
                          <SelectItem key={i} value={council.value}>
                            {council.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter registration number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfFirstRegistration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of First Registration *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
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
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1950-01-01")
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
                name="registrationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Type *</FormLabel>
                    <p className="description">
                      Is the registration permanent or renewal?
                    </p>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="permanent" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Permanent
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="renewal" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Renewal
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {registrationType === "renewal" && (
                <FormField
                  control={form.control}
                  name="registrationValidDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Registration valid till *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
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
                            selected={field.value ?? undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1950-01-01")
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
              )}
            </FieldGroup>

            {/* Registration certificate attachment(Latest Certificate) - need to get that council certificate*/}

            <FormField
              control={form.control}
              name="nameMatchesAadhaar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Is your name in registration certificate the same as your
                    name in Aadhaar? *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value === "yes")}
                      defaultValue={field.value ? "yes" : "no"}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Yes
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          No
                        </FormLabel>
                        {/* if no selected -> get any certificate where the new name change is reflected */}
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Qualifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Academic Qualifications
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addQualification}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Qualification
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex items-center justify-between mb-4">
                <CardTitle>Qualification {index + 1}</CardTitle>
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

              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`qualifications.${index}.degreeName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of the Degree or Diploma *</FormLabel>
                      <FormControl>
                        <Input placeholder="Degree or Diploma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.country`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.state`}
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
                  name={`qualifications.${index}.college`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College *</FormLabel>
                      <FormControl>
                        <Input placeholder="College name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.university`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>University/Affiliated Board *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University or board name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 flex gap-6 max-w-136">
                  <FormField
                    control={form.control}
                    name={`qualifications.${index}.passingMonth`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Passing Month *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem
                                key={month}
                                value={month.toLowerCase()}
                              >
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`qualifications.${index}.passingYear`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Passing Year *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Upload Degree/Diploma - collect the certificate */}

                <FormField
                  control={form.control}
                  name={`qualifications.${index}.nameMatchesAadhaar`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>
                        Is your name on degree same as your name in Aadhaar? *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) =>
                            field.onChange(value === "yes")
                          }
                          defaultValue={field.value ? "yes" : "no"}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Yes
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              No
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <StepNavigation
          currentStep={2}
          totalSteps={4}
          onPrevious={onPrevious}
          onNext={() => {}}
          onSaveDraft={() => onSaveDraft(form.getValues())}
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
}
