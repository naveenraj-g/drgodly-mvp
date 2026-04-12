import { getServerSession } from "@/modules/server/auth/get-session";
import { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { JSONSchema } from "openai/lib/jsonschema.mjs";
import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { getDoctorsByOrg } from "@/modules/client/telemedicine/server-actions/doctor-action";
import { TBookAppointmentValidation } from "@/modules/shared/schemas/telemedicine/appointment/appointmentValidationSchema";
import {
  bookAppointment,
  getPatientAppointments,
} from "@/modules/client/telemedicine/server-actions/appointment-action";
import { getDashboardAppointmentsDataAction } from "@/modules/client/telemedicine/server-actions/dashboard-actions";

export const tools: RunnableToolFunctionWithParse<any>[] = [
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
          return JSON.stringify({ message: "UNAUTHORIZED" });
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
      name: "create_appointment_ui",
      description:
        "Render appointment booking form. date should be today's date to 1 month period",
      parse: (i) => JSON.parse(i),
      parameters: zodToJsonSchema(
        z.object({
          doctor: z.any(),
          service: z.any(),
        }),
      ) as JSONSchema,
      function: async ({ doctor, service }) => {
        console.log(doctor, service);
        return JSON.stringify({
          type: "ui",
          schema: {
            component: "form",
            title: "Book Appointment",
            description: "Select appointment mode, service, date, and time",

            steps: [
              {
                id: "mode",
                title: "Appointment Mode",
                fields: [
                  { type: "hidden", name: "doctorId", value: doctor.id },
                  { type: "hidden", name: "serviceId", value: service.id },
                  {
                    type: "radio",
                    name: "appointmentMode",
                    label: "Choose Mode",
                    required: true,
                    options: [
                      { label: "Virtual Consultation", value: "VIRTUAL" },
                      { label: "In-Person Visit", value: "INPERSON" },
                    ],
                  },
                ],
              },
              {
                id: "schedule",
                title: "Date & Time",
                fields: [
                  { type: "hidden", name: "doctorId", value: doctor.id },
                  { type: "hidden", name: "serviceId", value: service.id },
                  {
                    type: "date",
                    name: "date",
                    label: "Appointment Date",
                    required: true,
                  },
                  {
                    type: "time",
                    name: "time",
                    label: "Appointment Time",
                    required: true,
                  },
                ],
              },

              {
                id: "confirmation",
                title: "Confirm Appointment",
                summary: [
                  { label: "Mode", valueFrom: "appointmentMode" },
                  { label: "Service", valueFrom: "serviceId" },
                  { label: "Date", valueFrom: "date" },
                  { label: "Time", valueFrom: "time" },
                ],
                fields: [
                  {
                    type: "checkbox",
                    name: "confirm",
                    label: "I confirm the appointment details are correct",
                    required: true,
                  },
                ],
              },
            ],

            submitLabel: "Confirm & Book Appointment",

            metadata: {
              doctorId: doctor.id,
              serviceId: service.id,
              flow: "appointment_booking",
            },
          },
        });
      },
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
          doctorName: z.string(),
          doctorId: z.string(),
          mode: z.string(),
          serviceName: z.string(),
          serviceId: z.string(),
          date: z.string(),
          time: z.string(),
        }),
      ) as JSONSchema,
      function: async (args) => {
        console.log({ args });
        const session = await getServerSession();

        if (!session || !session?.user?.currentOrgId) {
          return JSON.stringify({ message: "UNAUTHORIZED" });
        }

        const [allDoctors, doctorsError] = await getDoctorsByOrg({
          orgId: session.session.activeOrganizationId,
        });

        if (doctorsError) {
          return JSON.stringify({ message: "Failed to get doctors" });
        }

        const matchedDoctor = allDoctors.find(
          (d) => d.fullName === args.doctorName,
        );
        const matchedService = matchedDoctor?.services.find(
          (s) => s.name === args.serviceName,
        );

        const data: TBookAppointmentValidation = {
          patientUserId: session.user.id,
          doctorUserId: matchedDoctor?.id ?? args.doctorId,
          orgId: session.session.activeOrganizationId,
          appointmentDate: new Date(args.date),
          time: args.time,
          serviceId: matchedService?.id ?? args.serviceId,
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
            component: "success",
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
      parameters: zodToJsonSchema(z.object({ time: z.string() })) as JSONSchema,
      function: async () => {
        const session = await getServerSession();

        if (!session || !session?.user?.currentOrgId) {
          return JSON.stringify({ message: "UNAUTHORIZED" });
        }

        const [data, error] = await getPatientAppointments({
          orgId: session.session.activeOrganizationId,
          userId: session.user.id,
        });

        if (error) {
          return JSON.stringify({ message: "Failed to get appointments data" });
        }

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
      parameters: zodToJsonSchema(z.object({ time: z.string() })) as JSONSchema,
      function: async () => {
        const session = await getServerSession();

        if (!session || !session?.user?.currentOrgId) {
          return JSON.stringify({ message: "UNAUTHORIZED" });
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
