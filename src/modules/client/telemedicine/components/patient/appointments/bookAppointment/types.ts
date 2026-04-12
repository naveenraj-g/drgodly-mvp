export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  priceAmount: number | null;
  priceCurrency: string | null;
  supportedModes: ("VIRTUAL" | "INPERSON")[];
}

export interface SelectedService {
  id: string;
  name: string;
  duration: number;
  priceAmount: number | null;
  priceCurrency: string | null;
  selectedMode: "VIRTUAL" | "INPERSON";
}

export interface weeklyAvailability {
  id: string;
  dayOfWeek: string;
  isEnabled: boolean;
  slots: {
    id: string;
    start: string;
    end: string;
  }[];
}

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  ratingCount: number | null;
  gender?: string | null;
  ratingAverage: number | null;
  location: string | null;
  mobileNumber?: string | null;
  image: string | null;
  description: string | null;
  available: boolean;
  reviews: Record<string, any>[];
  services: Service[];
  weeklyAvailabilities: weeklyAvailability[];
}

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
}

export interface DateOption {
  date: Date;
  isAvailable: boolean;
}

export interface AppointmentDetails {
  doctor: Doctor | null;
  service: Service | null;
  date: Date | null;
  time: string | null;
}
