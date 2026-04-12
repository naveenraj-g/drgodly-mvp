

const apps = [
    {
        name: "Admin",
        slug: "admin",
        type: "platform",
        description: "This is admin app",
    },
    {
        name: "TeleMedicine",
        slug: "telemedicine",
        type: "platform",
        description: "This is admin app",
    }
]

const orgId = "4f8723d9-16c8-4ecb-b65d-d068865aff6f"

export const doctorUsers = [
    {
        name: "Aarav Mehta",
        username: "doctor1",
        email: "doctor1@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Rohan Sharma",
        username: "doctor2",
        email: "doctor2@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Kunal Verma",
        username: "doctor3",
        email: "doctor3@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Aditya Singh",
        username: "doctor4",
        email: "doctor4@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Vikram Patel",
        username: "doctor5",
        email: "doctor5@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Suresh Kumar",
        username: "doctor6",
        email: "doctor6@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Manish Gupta",
        username: "doctor7",
        email: "doctor7@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Deepak Yadav",
        username: "doctor8",
        email: "doctor8@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Rahul Malhotra",
        username: "doctor9",
        email: "doctor9@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Nitin Chawla",
        username: "doctor10",
        email: "doctor10@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Arjun Nair",
        username: "doctor11",
        email: "doctor11@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Sanjay Iyer",
        username: "doctor12",
        email: "doctor12@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Prakash Rao",
        username: "doctor13",
        email: "doctor13@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Amit Kulkarni",
        username: "doctor14",
        email: "doctor14@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Harish Reddy",
        username: "doctor15",
        email: "doctor15@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    },
    {
        name: "Mohit Bansal",
        username: "doctor16",
        email: "doctor16@gmail.com",
        role: "doctor",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "4d46f6ac-61c7-4fd1-8419-d09551015d99",
                defaultRedirectUrl: "/bezs/telemedicine/doctor"
            }
        }
    }
];

export const patientUsers = [
    {
        name: "Ravi Kumar",
        username: "patient1",
        email: "patient1@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Anita Sharma",
        username: "patient2",
        email: "patient2@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Suresh Patel",
        username: "patient3",
        email: "patient3@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Pooja Verma",
        username: "patient4",
        email: "patient4@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Aakash Singh",
        username: "patient5",
        email: "patient5@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Neha Gupta",
        username: "patient6",
        email: "patient6@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Rohit Malhotra",
        username: "patient7",
        email: "patient7@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Kavita Nair",
        username: "patient8",
        email: "patient8@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Vivek Joshi",
        username: "patient9",
        email: "patient9@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
    {
        name: "Sneha Iyer",
        username: "patient10",
        email: "patient10@gmail.com",
        role: "patient",
        currentOrgId: orgId,
        members: { create: { role: "member", organizationId: orgId } },
        rbac: {
            create: {
                organizationId: orgId,
                roleId: "dbd506ef-d8da-4447-8ae0-411905050ba1",
                defaultRedirectUrl: "/bezs/telemedicine/patient/appointments/intake"
            }
        }
    },
];



export const specialties = [
    "Family Medicine",
    "Pediatrics",
    "Internal Medicine",
    "Obstetrics & Gynecology",
    "General Surgery",
    "Cardiology",
    "Gastroenterology",
    "Endocrinology",
    "Hematology/Oncology",
    "Pulmonology",
    "Infectious Disease",
    "Nephrology",
    "Dermatology",
    "Psychiatry",
    "Ophthalmology",
    "Otolaryngology (ENT)",
];

export const servicesBySpecialty = {
    "Family Medicine": [
        {
            name: "General Health Consultation",
            duration: 20,
            priceAmount: 500,
            description: "Routine consultation for common illnesses and health concerns.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Annual Health Checkup",
            duration: 30,
            priceAmount: 1200,
            description: "Comprehensive annual physical examination.",
            supportedModes: ["in-person"],
        },
        {
            name: "Diabetes Screening",
            duration: 20,
            priceAmount: 600,
            description: "Screening and early detection of diabetes.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Blood Pressure Monitoring",
            duration: 15,
            priceAmount: 300,
            description: "Blood pressure check and counseling.",
            supportedModes: ["in-person"],
        },
        {
            name: "Lifestyle Counseling",
            duration: 25,
            priceAmount: 700,
            description: "Guidance on diet, exercise, and healthy living.",
            supportedModes: ["online"],
        },
    ],

    Pediatrics: [
        {
            name: "Child Health Consultation",
            duration: 20,
            priceAmount: 600,
            description: "General pediatric health consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Newborn Care Consultation",
            duration: 30,
            priceAmount: 800,
            description: "Guidance on newborn care and feeding.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Growth & Development Assessment",
            duration: 30,
            priceAmount: 900,
            description: "Monitoring physical and mental growth milestones.",
            supportedModes: ["in-person"],
        },
        {
            name: "Pediatric Vaccination Counseling",
            duration: 20,
            priceAmount: 500,
            description: "Vaccination schedule planning and advice.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Pediatric Nutrition Counseling",
            duration: 25,
            priceAmount: 700,
            description: "Diet planning for children.",
            supportedModes: ["online"],
        },
    ],

    "Internal Medicine": [
        {
            name: "Internal Medicine Consultation",
            duration: 25,
            priceAmount: 700,
            description: "Consultation for adult medical conditions.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Chronic Disease Management",
            duration: 30,
            priceAmount: 900,
            description: "Long-term management of chronic illnesses.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Diabetes Management",
            duration: 25,
            priceAmount: 800,
            description: "Diabetes evaluation and control planning.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Hypertension Management",
            duration: 20,
            priceAmount: 700,
            description: "Blood pressure control consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Preventive Health Screening",
            duration: 30,
            priceAmount: 1000,
            description: "Preventive screenings and risk assessment.",
            supportedModes: ["in-person"],
        },
    ],

    "Obstetrics & Gynecology": [
        {
            name: "Gynecology Consultation",
            duration: 25,
            priceAmount: 800,
            description: "General gynecological consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Antenatal Care Consultation",
            duration: 30,
            priceAmount: 1000,
            description: "Pregnancy check-up and counseling.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Menstrual Disorder Consultation",
            duration: 25,
            priceAmount: 700,
            description: "Diagnosis and treatment of menstrual issues.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Infertility Counseling",
            duration: 30,
            priceAmount: 1200,
            description: "Evaluation and counseling for infertility.",
            supportedModes: ["in-person"],
        },
        {
            name: "Menopause Management",
            duration: 25,
            priceAmount: 900,
            description: "Management of menopausal symptoms.",
            supportedModes: ["online"],
        },
    ],

    "General Surgery": [
        {
            name: "Pre-Surgical Consultation",
            duration: 30,
            priceAmount: 1000,
            description: "Evaluation before surgical procedures.",
            supportedModes: ["in-person"],
        },
        {
            name: "Post-Operative Follow-up",
            duration: 20,
            priceAmount: 600,
            description: "Follow-up after surgery.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Hernia Evaluation",
            duration: 25,
            priceAmount: 900,
            description: "Assessment and treatment planning for hernia.",
            supportedModes: ["in-person"],
        },
        {
            name: "Wound Care Management",
            duration: 20,
            priceAmount: 500,
            description: "Care and management of surgical wounds.",
            supportedModes: ["in-person"],
        },
        {
            name: "Minor Surgical Procedure Consultation",
            duration: 30,
            priceAmount: 1200,
            description: "Consultation for minor surgical procedures.",
            supportedModes: ["in-person"],
        },
    ],

    Cardiology: [
        {
            name: "Cardiology Consultation",
            duration: 30,
            priceAmount: 1000,
            description: "Heart-related medical consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "ECG Interpretation",
            duration: 20,
            priceAmount: 800,
            description: "Electrocardiogram analysis.",
            supportedModes: ["in-person"],
        },
        {
            name: "Hypertension Evaluation",
            duration: 25,
            priceAmount: 900,
            description: "High blood pressure assessment.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Heart Failure Management",
            duration: 30,
            priceAmount: 1200,
            description: "Long-term heart failure care.",
            supportedModes: ["in-person"],
        },
        {
            name: "Chest Pain Evaluation",
            duration: 30,
            priceAmount: 1100,
            description: "Assessment of cardiac chest pain.",
            supportedModes: ["in-person"],
        },
    ],

    Gastroenterology: [
        {
            name: "Gastroenterology Consultation",
            duration: 25,
            priceAmount: 800,
            description: "Digestive system consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Acid Reflux Treatment",
            duration: 20,
            priceAmount: 600,
            description: "Treatment for GERD and acid reflux.",
            supportedModes: ["online"],
        },
        {
            name: "Liver Disorder Consultation",
            duration: 30,
            priceAmount: 1000,
            description: "Diagnosis and treatment of liver conditions.",
            supportedModes: ["in-person"],
        },
        {
            name: "IBS Management",
            duration: 25,
            priceAmount: 700,
            description: "Management of irritable bowel syndrome.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Digestive Health Counseling",
            duration: 25,
            priceAmount: 700,
            description: "Diet and digestive health guidance.",
            supportedModes: ["online"],
        },
    ],

    Endocrinology: [
        {
            name: "Endocrinology Consultation",
            duration: 25,
            priceAmount: 800,
            description: "Consultation for hormonal disorders.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Diabetes Care Program",
            duration: 30,
            priceAmount: 1000,
            description: "Comprehensive diabetes management.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Thyroid Disorder Management",
            duration: 25,
            priceAmount: 800,
            description: "Evaluation and treatment of thyroid disorders.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Obesity Management",
            duration: 30,
            priceAmount: 900,
            description: "Weight management and hormonal evaluation.",
            supportedModes: ["online"],
        },
        {
            name: "Osteoporosis Consultation",
            duration: 25,
            priceAmount: 850,
            description: "Bone health evaluation.",
            supportedModes: ["in-person"],
        },
    ],

    "Hematology/Oncology": [
        {
            name: "Hematology Consultation",
            duration: 30,
            priceAmount: 1000,
            description: "Consultation for blood disorders.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Anemia Evaluation",
            duration: 25,
            priceAmount: 700,
            description: "Diagnosis and treatment of anemia.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Blood Disorder Management",
            duration: 30,
            priceAmount: 900,
            description: "Management of chronic blood disorders.",
            supportedModes: ["in-person"],
        },
        {
            name: "Oncology Follow-up Consultation",
            duration: 30,
            priceAmount: 1200,
            description: "Cancer treatment follow-up.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Cancer Screening Counseling",
            duration: 25,
            priceAmount: 800,
            description: "Guidance on cancer screening tests.",
            supportedModes: ["online"],
        },
    ],

    Pulmonology: [
        {
            name: "Pulmonology Consultation",
            duration: 25,
            priceAmount: 800,
            description: "Respiratory system consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Asthma Management",
            duration: 25,
            priceAmount: 700,
            description: "Asthma diagnosis and treatment.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "COPD Management",
            duration: 30,
            priceAmount: 900,
            description: "Chronic obstructive pulmonary disease care.",
            supportedModes: ["in-person"],
        },
        {
            name: "Sleep Apnea Consultation",
            duration: 30,
            priceAmount: 1000,
            description: "Evaluation of sleep-related breathing disorders.",
            supportedModes: ["online"],
        },
        {
            name: "Chronic Cough Evaluation",
            duration: 20,
            priceAmount: 600,
            description: "Diagnosis of persistent cough.",
            supportedModes: ["online", "in-person"],
        },
    ],

    "Infectious Disease": [
        {
            name: "Infectious Disease Consultation",
            duration: 30,
            priceAmount: 900,
            description: "Consultation for infectious conditions.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Fever of Unknown Origin Evaluation",
            duration: 30,
            priceAmount: 800,
            description: "Diagnosis of prolonged fever.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Tuberculosis Management",
            duration: 30,
            priceAmount: 1000,
            description: "Diagnosis and treatment of TB.",
            supportedModes: ["in-person"],
        },
        {
            name: "HIV Counseling",
            duration: 25,
            priceAmount: 900,
            description: "HIV testing guidance and counseling.",
            supportedModes: ["online"],
        },
        {
            name: "Travel Medicine Consultation",
            duration: 20,
            priceAmount: 700,
            description: "Vaccination and travel health advice.",
            supportedModes: ["online"],
        },
    ],

    Nephrology: [
        {
            name: "Nephrology Consultation",
            duration: 25,
            priceAmount: 800,
            description: "Kidney-related medical consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Chronic Kidney Disease Management",
            duration: 30,
            priceAmount: 1000,
            description: "Long-term kidney disease care.",
            supportedModes: ["in-person"],
        },
        {
            name: "Dialysis Counseling",
            duration: 25,
            priceAmount: 900,
            description: "Guidance on dialysis treatment.",
            supportedModes: ["in-person"],
        },
        {
            name: "Electrolyte Disorder Management",
            duration: 20,
            priceAmount: 700,
            description: "Correction of electrolyte imbalances.",
            supportedModes: ["online"],
        },
        {
            name: "Kidney Stone Consultation",
            duration: 25,
            priceAmount: 800,
            description: "Diagnosis and treatment of kidney stones.",
            supportedModes: ["online", "in-person"],
        },
    ],

    Dermatology: [
        {
            name: "Dermatology Consultation",
            duration: 20,
            priceAmount: 700,
            description: "Consultation for skin-related conditions.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Acne Treatment",
            duration: 20,
            priceAmount: 600,
            description: "Diagnosis and treatment of acne.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Hair Loss Treatment",
            duration: 25,
            priceAmount: 800,
            description: "Hair fall evaluation and treatment planning.",
            supportedModes: ["online"],
        },
        {
            name: "Skin Allergy Management",
            duration: 20,
            priceAmount: 650,
            description: "Treatment for allergic skin reactions.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Cosmetic Dermatology Consultation",
            duration: 30,
            priceAmount: 1500,
            description: "Cosmetic skin care consultation.",
            supportedModes: ["in-person"],
        },
    ],

    Psychiatry: [
        {
            name: "Psychiatry Consultation",
            duration: 30,
            priceAmount: 900,
            description: "Mental health evaluation and counseling.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Anxiety Disorder Treatment",
            duration: 30,
            priceAmount: 800,
            description: "Management of anxiety disorders.",
            supportedModes: ["online"],
        },
        {
            name: "Depression Management",
            duration: 30,
            priceAmount: 850,
            description: "Diagnosis and treatment of depression.",
            supportedModes: ["online"],
        },
        {
            name: "Stress Counseling",
            duration: 25,
            priceAmount: 700,
            description: "Stress management and counseling.",
            supportedModes: ["online"],
        },
        {
            name: "Sleep Disorder Consultation",
            duration: 25,
            priceAmount: 800,
            description: "Evaluation of sleep-related disorders.",
            supportedModes: ["online"],
        },
    ],

    Ophthalmology: [
        {
            name: "Eye Consultation",
            duration: 20,
            priceAmount: 700,
            description: "General eye examination.",
            supportedModes: ["in-person"],
        },
        {
            name: "Vision Testing",
            duration: 20,
            priceAmount: 500,
            description: "Eye sight and vision assessment.",
            supportedModes: ["in-person"],
        },
        {
            name: "Cataract Evaluation",
            duration: 25,
            priceAmount: 900,
            description: "Diagnosis and evaluation of cataracts.",
            supportedModes: ["in-person"],
        },
        {
            name: "Glaucoma Screening",
            duration: 25,
            priceAmount: 900,
            description: "Screening for glaucoma.",
            supportedModes: ["in-person"],
        },
        {
            name: "Dry Eye Treatment",
            duration: 20,
            priceAmount: 600,
            description: "Treatment for dry eye syndrome.",
            supportedModes: ["in-person"],
        },
    ],

    "Otolaryngology (ENT)": [
        {
            name: "ENT Consultation",
            duration: 25,
            priceAmount: 800,
            description: "Ear, nose, and throat consultation.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Hearing Assessment",
            duration: 30,
            priceAmount: 900,
            description: "Hearing evaluation and diagnosis.",
            supportedModes: ["in-person"],
        },
        {
            name: "Sinusitis Treatment",
            duration: 25,
            priceAmount: 700,
            description: "Diagnosis and treatment of sinus infections.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Throat Infection Management",
            duration: 20,
            priceAmount: 600,
            description: "Treatment of throat infections.",
            supportedModes: ["online", "in-person"],
        },
        {
            name: "Vertigo Evaluation",
            duration: 25,
            priceAmount: 800,
            description: "Diagnosis of balance and vertigo issues.",
            supportedModes: ["in-person"],
        },
    ],
};
