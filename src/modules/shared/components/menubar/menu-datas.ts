import {
  BriefcaseMedical,
  CalendarClock,
  CalendarPlus,
  LayoutDashboard,
  Settings2,
  Stethoscope,
  UserCog,
} from "lucide-react";

export const homeSidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/bezs",
          icon: "layout-dashboard",
        },
        {
          title: "Calendar",
          url: "/bezs/calendar",
          icon: "calendar-range",
        },
      ],
    },
    {
      title: "Others",
      items: [
        {
          title: "Settings",
          icon: "settings",
          items: [
            {
              title: "Profile",
              url: "/bezs/settings",
              icon: "user-cog",
            },
            {
              title: "Account",
              url: "/bezs/settings/account",
              icon: "wrench",
            },
            {
              title: "Preference",
              url: "/bezs/settings/preference",
              icon: "palette",
            },
          ],
        },
      ],
    },
  ],
};

export const telemedicineSidebarData = {
  navGroups: [
    {
      title: "Admin Management",
      items: [
        {
          title: "Manage Doctors",
          url: "/bezs/telemedicine/admin/manage-doctors",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Doctor",
      items: [
        {
          title: "Dashboard",
          url: "/bezs/telemedicine/doctor",
          icon: LayoutDashboard,
        },
        {
          title: "Professional Settings",
          icon: Stethoscope,
          items: [
            {
              title: "Services",
              url: "/bezs/telemedicine/doctor/settings/services",
              icon: BriefcaseMedical,
            },
            {
              title: "Availability",
              url: "/bezs/telemedicine/doctor/settings/availability",
              icon: CalendarClock,
            },
          ],
        },
        {
          title: "Settings",
          icon: Settings2,
          items: [
            {
              title: "Profile",
              url: "/bezs/telemedicine/doctor/settings/profile",
              icon: UserCog,
            },
          ],
        },
      ],
    },
    {
      title: "Patient",
      items: [
        {
          title: "Dashboard",
          url: "/bezs/telemedicine/patient",
          icon: LayoutDashboard,
        },
        {
          title: "Profile",
          url: "/bezs/telemedicine/patient/profile",
          icon: UserCog,
        },
        {
          title: "Book Appointment",
          url: "/bezs/telemedicine/patient/appointments/book",
          icon: CalendarPlus,
        },
        {
          title: "Appointment Intake",
          url: "/bezs/telemedicine/patient/askai",
          icon: CalendarPlus,
        },
      ],
    },
    // {
    //   title: "Others",
    //   items: [
    //     {
    //       title: "Settings",
    //       icon: Settings,
    //       items: [
    //         {
    //           title: "Profile",
    //           url: "/bezs/telemedicine/doctor/profile",
    //           icon: UserCog,
    //         },
    //         {
    //           title: "Availability",
    //           url: "/bezs/telemedicine/doctor/availability",
    //           icon: CalendarClock,
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      title: "Application Admin",
      items: [
        {
          title: "Dashboard",
          url: "/bezs/telemedicine/admin",
          icon: "layout-dashboard",
        },
        {
          title: "Manage Doctors",
          url: "/bezs/telemedicine/admin/manage-doctors",
          icon: "hospital",
        },
        {
          title: "Manage Doctor",
          url: "/bezs/telemedicine/admin/manage-doctors/:type",
          icon: "hospital",
          visible: false,
        },
      ],
    },
  ],
};
