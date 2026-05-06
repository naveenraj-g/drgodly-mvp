import { fhirRequest } from "./client";
import type { LifestyleData } from "@/modules/client/telemedicine/datas/doctor-dashboard";

export interface VitalRecord {
  id: number;
  user_id: string;
  patient_id: number;
  org_id: string;
  steps: number | null;
  calories_kcal: number | null;
  distance_meters: number | null;
  total_active_minutes: number | null;
  activity_name: string | null;
  exercise_duration_minutes: number | null;
  resting_heart_rate: number | null;
  heart_rate: number | null;
  heart_rate_variability: number | null;
  sleep_minutes: number | null;
  rem_sleep_minutes: number | null;
  deep_sleep_minutes: number | null;
  light_sleep_minutes: number | null;
  awake_minutes: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  recorded_at: string;
  date?: string | null;
}

export interface VitalsResponse {
  total: number;
  limit: number;
  offset: number;
  data: VitalRecord[];
}

export interface VitalsQueryParams {
  recorded_at_from?: string;
  recorded_at_to?: string;
  limit?: number;
  offset?: number;
}

export interface VitalsListParams extends VitalsQueryParams {
  user_id?: string;
  patient_id?: number;
  org_id?: string;
}

export async function getVitals(
  params: VitalsListParams = {},
): Promise<VitalsResponse> {
  const query = new URLSearchParams();
  if (params.user_id) query.set("user_id", params.user_id);
  if (params.patient_id != null) query.set("patient_id", String(params.patient_id));
  if (params.org_id) query.set("org_id", params.org_id);
  if (params.recorded_at_from) query.set("recorded_at_from", params.recorded_at_from);
  if (params.recorded_at_to) query.set("recorded_at_to", params.recorded_at_to);
  if (params.limit != null) query.set("limit", String(params.limit));
  if (params.offset != null) query.set("offset", String(params.offset));

  const qs = query.toString();
  return fhirRequest<VitalsResponse>("GET", `/api/v1/vitals${qs ? `?${qs}` : ""}`);
}

export async function getMyVitals(
  params: VitalsQueryParams = {},
): Promise<VitalsResponse> {
  const query = new URLSearchParams();
  if (params.recorded_at_from)
    query.set("recorded_at_from", params.recorded_at_from);
  if (params.recorded_at_to) query.set("recorded_at_to", params.recorded_at_to);
  if (params.limit != null) query.set("limit", String(params.limit));
  if (params.offset != null) query.set("offset", String(params.offset));

  const qs = query.toString();
  return fhirRequest<VitalsResponse>(
    "GET",
    `/api/v1/vitals/me${qs ? `?${qs}` : ""}`,
  );
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function transformVitalsToLifestyle(
  records: VitalRecord[],
): LifestyleData {
  // Build date → latest record map (sort asc so last entry per date wins)
  const sorted = [...records].sort(
    (a, b) =>
      new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
  );
  const byDate = new Map<string, VitalRecord>();
  for (const r of sorted) {
    byDate.set(r.recorded_at.split("T")[0], r);
  }

  const heartRate: LifestyleData["heartRate"] = [];
  const steps: LifestyleData["steps"] = [];
  const sleep: LifestyleData["sleep"] = [];
  const activity: LifestyleData["activity"] = [];

  // Past 7 days, oldest first
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    const label = DAY_LABELS[d.getDay()];
    const r = byDate.get(dateKey);

    heartRate.push({ date: label, value: r?.heart_rate ?? 0 });
    steps.push({ date: label, value: r?.steps ?? 0 });
    sleep.push({
      date: label,
      value: r?.sleep_minutes
        ? Math.round((r.sleep_minutes / 60) * 10) / 10
        : 0,
    });
    activity.push({
      date: label,
      value: r?.total_active_minutes ?? 0,
      ...(r?.activity_name ? { activityName: r.activity_name } : {}),
    });
  }

  return { heartRate, steps, sleep, activity };
}
