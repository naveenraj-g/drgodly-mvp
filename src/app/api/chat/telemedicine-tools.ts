import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { JSONSchema } from "openai/lib/jsonschema.mjs";
import { getServerSession } from "@/modules/server/auth/get-session";
import { symptomBasedSpecializations } from "./specializations";
import { getDoctorsByOrg } from "@/modules/client/telemedicine/server-actions/doctor-action";
import { TBookAppointmentValidation } from "@/modules/shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import {
  bookAppointment,
  getPatientAppointments,
} from "@/modules/client/telemedicine/server-actions/appointment-action";
import { getDashboardAppointmentsDataAction } from "@/modules/client/telemedicine/server-actions/dashboard-actions";

const IntakeUI = {
  type: "ui",
  schema: {
    component: "form",
    title: "Patient Intake Form",
    fields: [
      { type: "text", name: "name", label: "Full Name" },
      { type: "number", name: "age", label: "Age" },
      {
        type: "select",
        name: "gender",
        label: "Gender",
        options: ["Male", "Female", "Other"],
      },
      {
        type: "textarea",
        name: "symptoms",
        label: "What symptoms are you experiencing?",
      },
      {
        type: "textarea",
        name: "reason",
        label: "Primary reason for the appointment",
      },
    ],
    submitLabel: "Continue",
  },
};

export const telemedicineTools: RunnableToolFunctionWithParse<any>[] = [
  {
    type: "function",
    function: {
      name: "check_authentication",
      description: "Check if the current user is authenticated.",
      parse: (input) => JSON.parse(input),
      parameters: zodToJsonSchema(z.object({})) as JSONSchema,
      function: async () => {
        const session = await getServerSession();

        if (!session) {
          return JSON.stringify({ authenticated: false });
        }

        return JSON.stringify({
          authenticated: true,
          userId: session?.user.id,
        });
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "show_auth_prompt",
      description: "Show login/signup options if user is not authenticated.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(z.object({})) as JSONSchema,
      function: async () =>
        JSON.stringify({
          type: "ui",
          schema: {
            component: "buttons",
            title: "Please sign in to continue",
            buttons: [
              {
                label: "Sign In",
                action: { type: "link", url: "/signin" },
              },
              {
                label: "Sign Up",
                action: { type: "link", url: "/signup" },
              },
            ],
          },
        }),
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "collect_intake_info",
      description: "Collect patient intake details via a UI form.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(z.object({})) as JSONSchema,
      function: async () => JSON.stringify(IntakeUI),
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "get_doctor_recommendation",
      description:
        "Recommend a doctor specialization based on patient symptoms.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(
        z.object({
          symptoms: z.string().describe("Patient symptoms"),
        }),
      ) as JSONSchema,
      function: async ({ symptoms }) => {
        return JSON.stringify({ symptoms, symptomBasedSpecializations });
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "search_doctors",
      description: "Search doctors by specialization.",
      parse: (input) => JSON.parse(input) as { specialization: string },
      parameters: zodToJsonSchema(
        z.object({
          specialization: z
            .string()
            .describe("Medical specialization to search for"),
        }),
      ) as JSONSchema,
      function: async ({ specialization }) => {
        const session = await getServerSession();
        if (!session || !session?.user.currentOrgId) {
          return JSON.stringify({ message: "Unauthorized" });
        }

        const [allDoctors, error] = await getDoctorsByOrg({
          orgId: session.session.activeOrganizationId,
        });

        if (error) {
          return JSON.stringify({ message: "Failed to get doctors" });
        }

        const doctors = allDoctors.filter(
          (d) => d.speciality === specialization,
        );

        return JSON.stringify(doctors);
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "choose_appointment_mode",
      description: "Generate UI to pick appointment mode.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(
        z.object({
          doctorId: z.string(),
        }),
      ) as JSONSchema,
      function: async ({ doctorId }) =>
        JSON.stringify({
          type: "ui",
          schema: {
            component: "select",
            title: "Choose Appointment Mode",
            name: "mode",
            options: ["INPERSON", "VIRTUAL"],
            metadata: { doctorId },
          },
        }),
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "create_appointment_ui",
      description: "Render appointment booking form.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(
        z.object({
          doctorId: z.string(),
          mode: z.string(),
          service: z.string(),
        }),
      ) as JSONSchema,
      function: async ({ doctorId, mode, service }) =>
        JSON.stringify({
          type: "ui",
          schema: {
            component: "form",
            title: "Choose Appointment Date & Time",
            fields: [
              { type: "date", name: "date", label: "Date" },
              { type: "time", name: "time", label: "Time" },
            ],
            submitLabel: "Book Appointment",
            metadata: { doctorId, mode, service },
          },
        }),
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "confirm_appointment",
      description: "Save a new appointment.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(
        z.object({
          doctorId: z.string(),
          patientId: z.string(),
          mode: z.string(),
          serviceId: z.string(),
          date: z.string(),
          time: z.string(),
        }),
      ) as JSONSchema,
      function: async (args) => {
        const session = await getServerSession();

        if (!session || !session?.user?.currentOrgId) {
          return JSON.stringify({ message: "Unauthorized" });
        }

        const data: TBookAppointmentValidation = {
          patientUserId: session.user.id,
          doctorUserId: args.doctorId,
          orgId: session.session.activeOrganizationId,
          appointmentDate: args.date,
          time: args.time,
          serviceId: args.serviceId,
          appointmentMode: args.mode,
          note: null,
          intakeId: null,
        };
        const [appointment, error] = await bookAppointment(data);

        if (error) {
          return JSON.stringify({ message: "Failed to create appointment" });
        }

        return JSON.stringify({
          type: "ui",
          schema: {
            component: "confirmation",
            title: "Appointment Created",
            details: appointment,
          },
        });
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "list_appointments",
      description: "List all patient appointments.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(z.object({})) as JSONSchema,
      function: async () => {
        const session = await getServerSession();

        if (!session || !session?.user?.currentOrgId) {
          return JSON.stringify({ message: "Unauthorized" });
        }

        const data = await getPatientAppointments({
          orgId: session.session.activeOrganizationId,
          userId: session.user.id,
        });

        return JSON.stringify(data);
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "analytics_dashboard",
      description: "Show analytics of appointments.",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(z.object({})) as JSONSchema,
      function: async () => {
        const session = await getServerSession();

        if (!session || !session?.user?.currentOrgId) {
          return JSON.stringify({ message: "Unauthorized" });
        }

        const [data, error] = await getDashboardAppointmentsDataAction({
          orgId: session.session.activeOrganizationId,
          userId: session.user.id,
        });

        if (error) {
          return JSON.stringify({ message: "Failed to get analytics" });
        }

        return JSON.stringify(data);
      },
      strict: true,
    },
  },
];
