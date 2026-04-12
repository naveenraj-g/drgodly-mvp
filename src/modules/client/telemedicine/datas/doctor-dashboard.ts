export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  reason: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  patient: PatientDetails;
}

export interface PatientDetails {
  name: string;
  age: number;
  gender: string;
  primaryComplaint: string;
  intake: IntakeData;
  aiRecommendations: AIRecommendations;
  lifestyle: LifestyleData;
  healthRecords: HealthRecord[];
}

export interface IntakeData {
  symptoms: string[];
  medicalHistory: string[];
  currentMedications: string[];
  redFlags: string[];
  concerns: string[];
}

export interface AIRecommendations {
  likelyConditions: string[];
  differentialDiagnosis: string[];
  recommendedTests: string[];
  treatmentPathway: string[];
  precautions: string[];
}

export interface LifestyleData {
  heartRate: { date: string; value: number }[];
  steps: { date: string; value: number }[];
  sleep: { date: string; value: number }[];
  activity: { date: string; value: number }[];
}

export interface HealthRecord {
  id: string;
  type: "pdf" | "image";
  name: string;
  date: string;
}

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    time: "09:00 AM",
    patientName: "Sarah Johnson",
    reason: "Annual Physical Exam",
    status: "completed",
    patient: {
      name: "Sarah Johnson",
      age: 34,
      gender: "Female",
      primaryComplaint: "Routine checkup and fatigue discussion",
      intake: {
        symptoms: [
          "Persistent fatigue",
          "Occasional headaches",
          "Difficulty sleeping",
        ],
        medicalHistory: ["Asthma (childhood)", "Seasonal allergies"],
        currentMedications: ["Multivitamin daily", "Cetirizine 10mg PRN"],
        redFlags: ["Family history of thyroid disease"],
        concerns: ["Work-life balance", "Sleep quality", "Energy levels"],
      },
      aiRecommendations: {
        likelyConditions: [
          "Vitamin D deficiency",
          "Iron deficiency anemia",
          "Hypothyroidism",
        ],
        differentialDiagnosis: [
          "Chronic fatigue syndrome",
          "Sleep apnea",
          "Depression",
        ],
        recommendedTests: [
          "Complete Blood Count (CBC)",
          "Thyroid panel (TSH, T3, T4)",
          "Vitamin D levels",
          "Iron studies",
        ],
        treatmentPathway: [
          "Order initial blood work",
          "Sleep hygiene counseling",
          "Follow-up in 2 weeks with lab results",
          "Consider referral to endocrinology if thyroid abnormality",
        ],
        precautions: [
          "Monitor for worsening fatigue",
          "Screen for depression symptoms",
        ],
      },
      lifestyle: {
        heartRate: [
          { date: "Mon", value: 72 },
          { date: "Tue", value: 68 },
          { date: "Wed", value: 75 },
          { date: "Thu", value: 71 },
          { date: "Fri", value: 69 },
          { date: "Sat", value: 65 },
          { date: "Sun", value: 67 },
        ],
        steps: [
          { date: "Mon", value: 8500 },
          { date: "Tue", value: 6200 },
          { date: "Wed", value: 9100 },
          { date: "Thu", value: 7800 },
          { date: "Fri", value: 5900 },
          { date: "Sat", value: 12000 },
          { date: "Sun", value: 10500 },
        ],
        sleep: [
          { date: "Mon", value: 6.5 },
          { date: "Tue", value: 5.8 },
          { date: "Wed", value: 6.2 },
          { date: "Thu", value: 5.5 },
          { date: "Fri", value: 7.1 },
          { date: "Sat", value: 8.2 },
          { date: "Sun", value: 7.5 },
        ],
        activity: [
          { date: "Mon", value: 35 },
          { date: "Tue", value: 20 },
          { date: "Wed", value: 45 },
          { date: "Thu", value: 30 },
          { date: "Fri", value: 15 },
          { date: "Sat", value: 60 },
          { date: "Sun", value: 50 },
        ],
      },
      healthRecords: [
        {
          id: "r1",
          type: "pdf",
          name: "Previous Lab Results - Jan 2025",
          date: "2025-01-15",
        },
        {
          id: "r2",
          type: "pdf",
          name: "Vaccination Records",
          date: "2024-11-20",
        },
        {
          id: "r3",
          type: "image",
          name: "Chest X-Ray 2024",
          date: "2024-06-10",
        },
      ],
    },
  },
  {
    id: "2",
    time: "10:00 AM",
    patientName: "Michael Chen",
    reason: "Follow-up - Hypertension",
    status: "in-progress",
    patient: {
      name: "Michael Chen",
      age: 58,
      gender: "Male",
      primaryComplaint: "Blood pressure monitoring and medication review",
      intake: {
        symptoms: [
          "Occasional dizziness",
          "Mild chest discomfort with exertion",
        ],
        medicalHistory: [
          "Hypertension (5 years)",
          "Type 2 Diabetes",
          "Hyperlipidemia",
        ],
        currentMedications: [
          "Lisinopril 20mg daily",
          "Metformin 1000mg BID",
          "Atorvastatin 40mg daily",
          "Aspirin 81mg daily",
        ],
        redFlags: ["Chest discomfort with exertion", "Father had MI at age 60"],
        concerns: [
          "Medication side effects",
          "Lifestyle modifications",
          "Cardiac risk",
        ],
      },
      aiRecommendations: {
        likelyConditions: [
          "Stable hypertension",
          "Angina pectoris",
          "Coronary artery disease risk",
        ],
        differentialDiagnosis: ["Stable angina", "Anxiety", "GERD"],
        recommendedTests: [
          "EKG",
          "Lipid panel",
          "HbA1c",
          "Exercise stress test",
        ],
        treatmentPathway: [
          "Obtain EKG today",
          "Order stress test",
          "Review current medication efficacy",
          "Consider cardiology referral if EKG abnormal",
          "Reinforce diet and exercise counseling",
        ],
        precautions: [
          "Alert patient on chest pain warning signs",
          "Follow up within 1 week",
          "Nitroglycerin prescription if angina confirmed",
        ],
      },
      lifestyle: {
        heartRate: [
          { date: "Mon", value: 78 },
          { date: "Tue", value: 82 },
          { date: "Wed", value: 76 },
          { date: "Thu", value: 80 },
          { date: "Fri", value: 79 },
          { date: "Sat", value: 74 },
          { date: "Sun", value: 75 },
        ],
        steps: [
          { date: "Mon", value: 5200 },
          { date: "Tue", value: 4800 },
          { date: "Wed", value: 6100 },
          { date: "Thu", value: 5500 },
          { date: "Fri", value: 4200 },
          { date: "Sat", value: 7800 },
          { date: "Sun", value: 6900 },
        ],
        sleep: [
          { date: "Mon", value: 7.2 },
          { date: "Tue", value: 6.8 },
          { date: "Wed", value: 7.5 },
          { date: "Thu", value: 6.5 },
          { date: "Fri", value: 7.0 },
          { date: "Sat", value: 8.0 },
          { date: "Sun", value: 7.8 },
        ],
        activity: [
          { date: "Mon", value: 25 },
          { date: "Tue", value: 20 },
          { date: "Wed", value: 35 },
          { date: "Thu", value: 28 },
          { date: "Fri", value: 18 },
          { date: "Sat", value: 45 },
          { date: "Sun", value: 40 },
        ],
      },
      healthRecords: [
        {
          id: "r4",
          type: "pdf",
          name: "Cardiology Consult - 2024",
          date: "2024-09-12",
        },
        {
          id: "r5",
          type: "pdf",
          name: "Lab Results - Lipid Panel",
          date: "2025-01-05",
        },
        { id: "r6", type: "image", name: "EKG - Previous", date: "2024-08-20" },
      ],
    },
  },
  {
    id: "3",
    time: "11:00 AM",
    patientName: "Emily Rodriguez",
    reason: "Acute Respiratory Infection",
    status: "scheduled",
    patient: {
      name: "Emily Rodriguez",
      age: 28,
      gender: "Female",
      primaryComplaint: "Cough, congestion, and sore throat for 5 days",
      intake: {
        symptoms: [
          "Productive cough",
          "Nasal congestion",
          "Sore throat",
          "Mild fever (100.5°F)",
          "Body aches",
        ],
        medicalHistory: [
          "No significant medical history",
          "Seasonal allergies",
        ],
        currentMedications: ["Loratadine 10mg daily"],
        redFlags: ["None reported"],
        concerns: ["Worried about missing work", "When to seek emergency care"],
      },
      aiRecommendations: {
        likelyConditions: [
          "Viral upper respiratory infection",
          "Acute bronchitis",
          "Common cold",
        ],
        differentialDiagnosis: ["Influenza", "COVID-19", "Bacterial sinusitis"],
        recommendedTests: [
          "COVID-19 rapid test",
          "Influenza rapid test",
          "Throat culture if suspecting strep",
        ],
        treatmentPathway: [
          "Symptomatic treatment with rest and fluids",
          "Consider antiviral if influenza positive",
          "Cough suppressant/expectorant as needed",
          "NSAIDs for fever and body aches",
          "Follow up if symptoms worsen or persist beyond 10 days",
        ],
        precautions: [
          "Isolate if COVID/Flu positive",
          "Return precautions for breathing difficulty",
        ],
      },
      lifestyle: {
        heartRate: [
          { date: "Mon", value: 85 },
          { date: "Tue", value: 88 },
          { date: "Wed", value: 82 },
          { date: "Thu", value: 90 },
          { date: "Fri", value: 86 },
          { date: "Sat", value: 84 },
          { date: "Sun", value: 83 },
        ],
        steps: [
          { date: "Mon", value: 9200 },
          { date: "Tue", value: 3500 },
          { date: "Wed", value: 4100 },
          { date: "Thu", value: 2800 },
          { date: "Fri", value: 3200 },
          { date: "Sat", value: 5000 },
          { date: "Sun", value: 4500 },
        ],
        sleep: [
          { date: "Mon", value: 7.5 },
          { date: "Tue", value: 8.5 },
          { date: "Wed", value: 9.0 },
          { date: "Thu", value: 8.2 },
          { date: "Fri", value: 9.5 },
          { date: "Sat", value: 10.0 },
          { date: "Sun", value: 8.8 },
        ],
        activity: [
          { date: "Mon", value: 40 },
          { date: "Tue", value: 10 },
          { date: "Wed", value: 15 },
          { date: "Thu", value: 8 },
          { date: "Fri", value: 12 },
          { date: "Sat", value: 20 },
          { date: "Sun", value: 18 },
        ],
      },
      healthRecords: [
        {
          id: "r7",
          type: "pdf",
          name: "Immunization Record",
          date: "2024-10-01",
        },
      ],
    },
  },
  {
    id: "4",
    time: "01:00 PM",
    patientName: "David Thompson",
    reason: "Skin Rash Evaluation",
    status: "scheduled",
    patient: {
      name: "David Thompson",
      age: 42,
      gender: "Male",
      primaryComplaint: "Itchy rash on arms and torso for 2 weeks",
      intake: {
        symptoms: [
          "Red, itchy rash",
          "Dry skin patches",
          "Occasional burning sensation",
        ],
        medicalHistory: ["Eczema as child", "Allergic rhinitis"],
        currentMedications: ["Fluticasone nasal spray PRN"],
        redFlags: ["No systemic symptoms", "No recent new medications"],
        concerns: [
          "Contagious?",
          "Treatment options",
          "Work exposure (construction)",
        ],
      },
      aiRecommendations: {
        likelyConditions: [
          "Contact dermatitis",
          "Atopic dermatitis flare",
          "Allergic reaction",
        ],
        differentialDiagnosis: [
          "Psoriasis",
          "Fungal infection",
          "Drug reaction",
        ],
        recommendedTests: [
          "Physical examination",
          "Consider patch testing if contact dermatitis suspected",
        ],
        treatmentPathway: [
          "Topical corticosteroid (e.g., hydrocortisone or triamcinolone)",
          "Oral antihistamine for pruritus",
          "Emollient/moisturizer BID",
          "Avoid known irritants",
          "Follow up in 2 weeks if no improvement",
          "Consider dermatology referral if refractory",
        ],
        precautions: [
          "Educate on trigger avoidance",
          "Monitor for infection signs",
        ],
      },
      lifestyle: {
        heartRate: [
          { date: "Mon", value: 70 },
          { date: "Tue", value: 72 },
          { date: "Wed", value: 68 },
          { date: "Thu", value: 71 },
          { date: "Fri", value: 69 },
          { date: "Sat", value: 66 },
          { date: "Sun", value: 68 },
        ],
        steps: [
          { date: "Mon", value: 11000 },
          { date: "Tue", value: 10500 },
          { date: "Wed", value: 12200 },
          { date: "Thu", value: 11800 },
          { date: "Fri", value: 10200 },
          { date: "Sat", value: 9500 },
          { date: "Sun", value: 8800 },
        ],
        sleep: [
          { date: "Mon", value: 6.8 },
          { date: "Tue", value: 7.0 },
          { date: "Wed", value: 6.5 },
          { date: "Thu", value: 7.2 },
          { date: "Fri", value: 6.9 },
          { date: "Sat", value: 8.0 },
          { date: "Sun", value: 7.5 },
        ],
        activity: [
          { date: "Mon", value: 55 },
          { date: "Tue", value: 50 },
          { date: "Wed", value: 60 },
          { date: "Thu", value: 58 },
          { date: "Fri", value: 48 },
          { date: "Sat", value: 42 },
          { date: "Sun", value: 38 },
        ],
      },
      healthRecords: [
        {
          id: "r8",
          type: "image",
          name: "Rash Photo - Patient Submitted",
          date: "2025-01-17",
        },
      ],
    },
  },
  {
    id: "5",
    time: "02:30 PM",
    patientName: "Lisa Martinez",
    reason: "Diabetes Management",
    status: "scheduled",
    patient: {
      name: "Lisa Martinez",
      age: 51,
      gender: "Female",
      primaryComplaint:
        "Quarterly diabetes follow-up and medication adjustment",
      intake: {
        symptoms: [
          "Increased thirst",
          "Occasional blurred vision",
          "Tingling in feet",
        ],
        medicalHistory: [
          "Type 2 Diabetes (8 years)",
          "Obesity (BMI 32)",
          "Diabetic neuropathy",
        ],
        currentMedications: [
          "Metformin 1000mg BID",
          "Glipizide 10mg daily",
          "Gabapentin 300mg TID for neuropathy",
        ],
        redFlags: [
          "HbA1c trending up",
          "Neuropathy worsening",
          "Non-compliance with diet",
        ],
        concerns: [
          "Weight loss struggles",
          "Medication side effects",
          "Foot health",
        ],
      },
      aiRecommendations: {
        likelyConditions: [
          "Poorly controlled Type 2 Diabetes",
          "Diabetic peripheral neuropathy",
          "Retinopathy risk",
        ],
        differentialDiagnosis: [
          "Medication non-adherence",
          "Insulin resistance progression",
        ],
        recommendedTests: [
          "HbA1c",
          "Fasting glucose",
          "Comprehensive metabolic panel",
          "Urine microalbumin",
          "Dilated eye exam referral",
        ],
        treatmentPathway: [
          "Review HbA1c and adjust medications if >8%",
          "Consider adding GLP-1 agonist or SGLT2 inhibitor",
          "Reinforce lifestyle modifications (diet, exercise)",
          "Refer to dietitian and diabetes educator",
          "Foot exam and podiatry referral",
          "Ophthalmology referral for retinal screening",
          "Follow up in 3 months",
        ],
        precautions: [
          "Monitor for hypoglycemia",
          "Screen for diabetic foot ulcers",
          "Cardiovascular risk assessment",
        ],
      },
      lifestyle: {
        heartRate: [
          { date: "Mon", value: 76 },
          { date: "Tue", value: 79 },
          { date: "Wed", value: 74 },
          { date: "Thu", value: 77 },
          { date: "Fri", value: 78 },
          { date: "Sat", value: 72 },
          { date: "Sun", value: 73 },
        ],
        steps: [
          { date: "Mon", value: 4500 },
          { date: "Tue", value: 3800 },
          { date: "Wed", value: 5200 },
          { date: "Thu", value: 4100 },
          { date: "Fri", value: 3500 },
          { date: "Sat", value: 6000 },
          { date: "Sun", value: 5500 },
        ],
        sleep: [
          { date: "Mon", value: 6.2 },
          { date: "Tue", value: 6.8 },
          { date: "Wed", value: 6.0 },
          { date: "Thu", value: 7.0 },
          { date: "Fri", value: 6.5 },
          { date: "Sat", value: 7.8 },
          { date: "Sun", value: 7.2 },
        ],
        activity: [
          { date: "Mon", value: 22 },
          { date: "Tue", value: 18 },
          { date: "Wed", value: 28 },
          { date: "Thu", value: 20 },
          { date: "Fri", value: 15 },
          { date: "Sat", value: 35 },
          { date: "Sun", value: 30 },
        ],
      },
      healthRecords: [
        {
          id: "r9",
          type: "pdf",
          name: "Lab Results - HbA1c Trend",
          date: "2024-10-15",
        },
        {
          id: "r10",
          type: "pdf",
          name: "Endocrinology Consult",
          date: "2024-07-22",
        },
        {
          id: "r11",
          type: "pdf",
          name: "Diabetic Foot Exam",
          date: "2024-11-05",
        },
      ],
    },
  },
];
