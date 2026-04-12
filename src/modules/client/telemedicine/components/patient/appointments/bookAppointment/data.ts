import { Doctor, Service } from "./types";

export const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    specialty: "Dentist",
    subSpecialty: "Root Canal Expert",
    rating: 5.0,
    location: "Dental Center, New York",
    phone: "(555) 654-3210",
    image: "https://picsum.photos/seed/jane/200/200",
    description:
      "Experienced dental professional providing top-quality care with a gentle touch.",
    available: true,
    reviews: [
      {
        id: "r1",
        author: "Alice Johnson",
        rating: 5,
        date: "2023-10-15",
        comment: "Dr. Smith was amazing! I felt no pain during my root canal.",
      },
      {
        id: "r2",
        author: "Bob Williams",
        rating: 5,
        date: "2023-09-22",
        comment:
          "Very professional and the clinic is spotless. Highly recommend.",
      },
      {
        id: "r3",
        author: "Charlie Brown",
        rating: 5,
        date: "2023-08-05",
        comment: "Best dentist in NY. She explained everything clearly.",
      },
    ],
  },
  {
    id: "2",
    name: "Dr. John Doe",
    specialty: "Dentist",
    subSpecialty: "General Dentistry",
    rating: 4.8,
    location: "Dental Center, New York",
    phone: "(555) 123-4567",
    image: "https://picsum.photos/seed/john/200/200",
    description:
      "Specializes in preventative care and patient education for long-term oral health.",
    available: true,
    reviews: [
      {
        id: "r1",
        author: "David Miller",
        rating: 5,
        date: "2023-11-01",
        comment: "Great with kids! My son actually enjoyed his visit.",
      },
      {
        id: "r2",
        author: "Eva Green",
        rating: 4,
        date: "2023-10-12",
        comment: "Good service, but the wait time was a bit long.",
      },
    ],
  },
  {
    id: "3",
    name: "Dr. Emily Chen",
    specialty: "Dermatologist",
    subSpecialty: "Cosmetic Dermatology",
    rating: 4.9,
    location: "Skin Health Clinic, Brooklyn",
    phone: "(555) 987-6543",
    image: "https://picsum.photos/seed/emily/200/200",
    description:
      "Board-certified dermatologist focusing on acne treatments and anti-aging procedures.",
    available: true,
    reviews: [
      {
        id: "r1",
        author: "Sophie Turner",
        rating: 5,
        date: "2023-10-30",
        comment: "My skin has never looked better. Dr. Chen is a magician!",
      },
      {
        id: "r2",
        author: "Ryan Reynolds",
        rating: 5,
        date: "2023-09-15",
        comment: "Professional, knowledgeable, and kind.",
      },
      {
        id: "r3",
        author: "Blake Lively",
        rating: 4,
        date: "2023-08-20",
        comment: "Expensive, but worth it for the results.",
      },
    ],
  },
  {
    id: "4",
    name: "Dr. Michael Ross",
    specialty: "Cardiologist",
    subSpecialty: "Interventional Cardiology",
    rating: 5.0,
    location: "Heart Institute, Manhattan",
    phone: "(555) 456-7890",
    image: "https://picsum.photos/seed/michael/200/200",
    description:
      "Expert in diagnosing and treating complex cardiovascular conditions.",
    available: true,
    reviews: [
      {
        id: "r1",
        author: "Harvey Specter",
        rating: 5,
        date: "2023-11-05",
        comment: "Saved my life. Literally. Cannot thank him enough.",
      },
      {
        id: "r2",
        author: "Donna Paulsen",
        rating: 5,
        date: "2023-10-01",
        comment: "The best cardiologist in the city. Very attentive.",
      },
    ],
  },
  {
    id: "5",
    name: "Dr. Sarah Connor",
    specialty: "Pediatrician",
    subSpecialty: "Child Wellness",
    rating: 4.7,
    location: "Kids First Clinic, Queens",
    phone: "(555) 222-3333",
    image: "https://picsum.photos/seed/sarah/200/200",
    description:
      "Dedicated to providing compassionate care for infants, children, and adolescents.",
    available: true,
    reviews: [
      {
        id: "r1",
        author: "Kyle Reese",
        rating: 5,
        date: "2023-10-20",
        comment: "She is great with babies. Very gentle.",
      },
      {
        id: "r2",
        author: "John Connor",
        rating: 4,
        date: "2023-09-10",
        comment: "Good doctor, but parking is a nightmare.",
      },
    ],
  },
  {
    id: "6",
    name: "Dr. Alan Grant",
    specialty: "Orthopedist",
    subSpecialty: "Sports Medicine",
    rating: 4.6,
    location: "Joint Care Center, Bronx",
    phone: "(555) 777-8888",
    image: "https://picsum.photos/seed/alan/200/200",
    description:
      "Specializing in sports injuries, arthroscopy, and joint reconstruction.",
    available: true,
    reviews: [
      {
        id: "r1",
        author: "Ellie Sattler",
        rating: 5,
        date: "2023-11-10",
        comment: "He fixed my knee after a soccer injury. Back to running now!",
      },
      {
        id: "r2",
        author: "Ian Malcolm",
        rating: 4,
        date: "2023-10-05",
        comment: "Knowledgeable, but talks a lot about chaos theory.",
      },
    ],
  },
];

export const SERVICES: Record<string, Service[]> = {
  Dentist: [
    {
      id: "d1",
      name: "Regular Checkup",
      duration: 60,
      price: 120,
      supportedModes: ["INPERSON"],
    },
    {
      id: "d2",
      name: "Teeth Cleaning",
      duration: 45,
      price: 90,
      supportedModes: ["INPERSON"],
    },
    {
      id: "d3",
      name: "Consultation",
      duration: 30,
      price: 75,
      supportedModes: ["INPERSON", "VIRTUAL"],
    },
    {
      id: "d4",
      name: "Emergency Visit",
      duration: 30,
      price: 150,
      supportedModes: ["INPERSON"],
    },
  ],
  Dermatologist: [
    {
      id: "s1",
      name: "Skin Consultation",
      duration: 30,
      price: 150,
      supportedModes: ["INPERSON"],
    },
    {
      id: "s2",
      name: "Acne Treatment",
      duration: 45,
      price: 200,
      supportedModes: ["INPERSON"],
    },
  ],
  Cardiologist: [
    {
      id: "c1",
      name: "Initial Consultation",
      duration: 60,
      price: 300,
      supportedModes: ["INPERSON", "VIRTUAL"],
    },
    {
      id: "c2",
      name: "Follow-up",
      duration: 30,
      price: 150,
      supportedModes: ["INPERSON", "VIRTUAL"],
    },
  ],
  Pediatrician: [
    {
      id: "p1",
      name: "Wellness Check",
      duration: 30,
      price: 100,
      supportedModes: ["INPERSON"],
    },
    {
      id: "p2",
      name: "Sick Visit",
      duration: 30,
      price: 120,
      supportedModes: ["INPERSON"],
    },
  ],
  Orthopedist: [
    {
      id: "o1",
      name: "Injury Assessment",
      duration: 45,
      price: 250,
      supportedModes: ["INPERSON"],
    },
    {
      id: "o2",
      name: "Physical Therapy Intro",
      duration: 60,
      price: 180,
      supportedModes: ["INPERSON"],
    },
  ],
};

export const TIME_SLOTS: string[] = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export const SPECIALTIES = [
  "All",
  ...Array.from(new Set(DOCTORS.map((d) => d.specialty))),
];
