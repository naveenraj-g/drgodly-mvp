// modules/telemedicine/application/repositories/weeklyAvailabilityRepository.interface.ts
import {
  TWeeklyAvailabilityCreate,
  TWeeklyAvailabilityUpdate,
  TWeeklySchedulePayload,
  TWeeklyAvailabilityPublic,
  TWeeklyAvailabilitiesPublic,
} from "../../../../shared/entities/models/telemedicine/weeklyAvailability";

export interface IDoctorWeeklyAvailabilityRepository {
  createDayAvailability(
    data: TWeeklyAvailabilityCreate
  ): Promise<TWeeklyAvailabilityPublic>;
  getDoctorWeeklyAvailability(
    orgId: string,
    doctorId: string
  ): Promise<TWeeklyAvailabilitiesPublic>;
  updateDayAvailability(
    data: TWeeklyAvailabilityUpdate
  ): Promise<TWeeklyAvailabilityPublic>;
  deleteDayAvailability(
    orgId: string,
    doctorId: string,
    dayOfWeek: string
  ): Promise<TWeeklyAvailabilityPublic>;

  // Optional helper to save/replace an entire week at once
  upsertFullWeek(
    orgId: string,
    doctorId: string,
    payload: TWeeklySchedulePayload,
    operationBy: string
  ): Promise<TWeeklyAvailabilitiesPublic>;

  /** Bulk CREATE a whole week: clears existing week then creates entries for enabled days */
  createFullWeek(
    orgId: string,
    doctorId: string,
    payload: TWeeklySchedulePayload,
    operationBy: string
  ): Promise<TWeeklyAvailabilitiesPublic>;

  /** Bulk UPDATE a whole week: upserts enabled days (replace slots) and deletes disabled days */
  updateFullWeek(
    orgId: string,
    doctorId: string,
    payload: TWeeklySchedulePayload,
    operationBy: string
  ): Promise<TWeeklyAvailabilitiesPublic>;
}
