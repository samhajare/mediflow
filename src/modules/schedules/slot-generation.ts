export const scheduleMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const dateParts = (date: Date, timezone: string): Record<string, number> => {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, Number(part.value)]));
};

export const localToUtc = (date: string, time: string, timezone: string): Date => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const observed = dateParts(new Date(localAsUtc), timezone);
  const observedAsUtc = Date.UTC(observed.year, observed.month - 1, observed.day, observed.hour, observed.minute, observed.second);
  return new Date(localAsUtc - (observedAsUtc - localAsUtc));
};

export interface CandidateSlot { startTime: Date; endTime: Date; }
export const generateCandidateSlots = (date: string, timezone: string, schedules: Array<{ startTime: string; endTime: string; slotDurationMinutes: number }>): CandidateSlot[] => {
  const slots: CandidateSlot[] = [];
  for (const schedule of schedules) {
    for (let cursor = scheduleMinutes(schedule.startTime); cursor + schedule.slotDurationMinutes <= scheduleMinutes(schedule.endTime); cursor += schedule.slotDurationMinutes) {
      const hours = String(Math.floor(cursor / 60)).padStart(2, '0');
      const minutes = String(cursor % 60).padStart(2, '0');
      const startTime = localToUtc(date, `${hours}:${minutes}`, timezone);
      slots.push({ startTime, endTime: new Date(startTime.getTime() + schedule.slotDurationMinutes * 60_000) });
    }
  }
  return slots;
};
