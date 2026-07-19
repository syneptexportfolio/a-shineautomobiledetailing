// Booking-related types and utilities
export type BookingStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  notes?: string;
  whatsappOptIn: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;        // ISO date string
  timeSlot: string;    // e.g. "10:00 AM"
  customer: CustomerDetails;
  status: BookingStatus;
  subtotal: number;    // cents
  tax: number;         // cents
  total: number;       // cents
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

// Tax rates by Canadian province
export const TAX_RATES: Record<string, { name: string; rate: number }> = {
  ON: { name: 'HST', rate: 0.13 },
  BC: { name: 'GST+PST', rate: 0.12 },
  AB: { name: 'GST', rate: 0.05 },
  QC: { name: 'GST+QST', rate: 0.14975 },
  MB: { name: 'GST+PST', rate: 0.12 },
  SK: { name: 'GST+PST', rate: 0.11 },
  NS: { name: 'HST', rate: 0.15 },
  NB: { name: 'HST', rate: 0.15 },
  NL: { name: 'HST', rate: 0.15 },
  PE: { name: 'HST', rate: 0.15 },
};

// Default to Ontario HST
export const DEFAULT_TAX_RATE = TAX_RATES.ON;

export function calculateTax(subtotalCents: number, rate: number = DEFAULT_TAX_RATE.rate): number {
  return Math.round(subtotalCents * rate);
}

export function calculateTotal(subtotalCents: number, rate: number = DEFAULT_TAX_RATE.rate): number {
  return subtotalCents + calculateTax(subtotalCents, rate);
}

export function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I,O,0,1 to avoid confusion
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ASH-${code}`;
}

export function getStatusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status];
}

export function getStatusBadgeClass(status: BookingStatus): string {
  const classes: Record<BookingStatus, string> = {
    pending: 'badge badge--pending',
    confirmed: 'badge badge--confirmed',
    'in-progress': 'badge badge--in-progress',
    completed: 'badge badge--completed',
    cancelled: 'badge badge--cancelled',
  };
  return classes[status];
}
