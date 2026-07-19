// Validation schemas using Zod
import { z } from 'zod';

// Canadian phone number validation
const canadianPhoneRegex = /^(\+1)?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const customerDetailsSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .regex(canadianPhoneRegex, 'Please enter a valid Canadian phone number')
    .trim(),
  vehicleType: z
    .enum(['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Other'], {
      error: 'Please select a vehicle type',
    }),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .default(''),
  whatsappOptIn: z.boolean().default(true),
});

export const bookingLookupSchema = z.object({
  bookingCode: z
    .string()
    .regex(/^ASH-[A-Z0-9]{4}$/, 'Booking code must be in format ASH-XXXX')
    .trim()
    .toUpperCase(),
  phone: z
    .string()
    .regex(canadianPhoneRegex, 'Please enter a valid phone number')
    .trim(),
});

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date format'
  ),
  timeSlot: z.string().min(1, 'Time slot is required'),
  customer: customerDetailsSchema,
});

export type CustomerDetailsInput = z.infer<typeof customerDetailsSchema>;
export type BookingLookupInput = z.infer<typeof bookingLookupSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
