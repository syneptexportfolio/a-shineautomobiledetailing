// Time slot generation and availability utilities

export interface TimeSlot {
  time: string;       // e.g. "9:00 AM"
  hour: number;       // 24h format, e.g. 9
  minute: number;     // e.g. 0 or 30
  available: boolean;
}

const BUSINESS_START_HOUR = 9;  // 9 AM
const BUSINESS_END_HOUR = 17;   // 5 PM

/**
 * Generate available time slots based on service duration.
 * Slots are generated at 30-min intervals for short services,
 * 60-min intervals for longer ones.
 */
export function generateTimeSlots(serviceDurationMinutes: number): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  // Use 30-min intervals for services <= 30 min, 60-min for longer
  const intervalMinutes = serviceDurationMinutes <= 30 ? 30 : 60;
  
  let hour = BUSINESS_START_HOUR;
  let minute = 0;

  while (hour < BUSINESS_END_HOUR) {
    // Check if the service can finish before closing time
    const endHour = hour + Math.floor((minute + serviceDurationMinutes) / 60);
    const endMinute = (minute + serviceDurationMinutes) % 60;
    
    if (endHour < BUSINESS_END_HOUR || (endHour === BUSINESS_END_HOUR && endMinute === 0)) {
      slots.push({
        time: formatTime(hour, minute),
        hour,
        minute,
        available: true, // Will be checked against existing bookings via API
      });
    }

    // Advance by interval
    minute += intervalMinutes;
    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute = minute % 60;
    }
  }

  return slots;
}

/**
 * Format hour and minute into a readable time string
 */
export function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

/**
 * Calculate end time display string
 */
export function getEndTime(startTime: string, durationMinutes: number): string {
  const match = startTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';

  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3].toUpperCase();

  // Convert to 24h
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  // Add duration
  const totalMinutes = hour * 60 + minute + durationMinutes;
  const endHour = Math.floor(totalMinutes / 60) % 24;
  const endMinute = totalMinutes % 60;

  return formatTime(endHour, endMinute);
}

/**
 * Get business hours display string
 */
export function getBusinessHours(): string {
  return `${formatTime(BUSINESS_START_HOUR, 0)} – ${formatTime(BUSINESS_END_HOUR, 0)}`;
}
