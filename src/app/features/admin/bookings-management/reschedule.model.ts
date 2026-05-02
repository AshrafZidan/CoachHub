export interface CoachSlot {
  id: number;
  startTimeUtc: string;
  endTimeUtc: string;
  periodMinutes: number;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
  slotType?: string; // optional (API may not return it)
}

export interface AvailableSlotsDay {
  date: string; // YYYY-MM-DD
  slots: CoachSlot[];
}

export interface AvailableSlotsResponse {
  httpStatus: string;
  code: string;
  messageEn: string;
  messageAr: string;
  data: AvailableSlotsDay[];
  count: number;
  pageIndex: number;
  pageSize: number;
}

export interface ReschedulePayload {
  bookingId: number;
  coachSlotId: number;
}

export interface RescheduleResponse {
  data: {
    startTime: string;
    endTime: string;
    coachSlot: CoachSlot;
  };
}