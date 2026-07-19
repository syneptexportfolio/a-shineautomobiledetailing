// API Route: Booking Lookup (Customer-facing, no auth required)
// POST /api/bookings/lookup

import { NextRequest, NextResponse } from 'next/server';
import { bookingLookupSchema } from '@/lib/validators';

// Mock data for demo purposes
// TODO: Replace with database query
const MOCK_BOOKINGS = [
  {
    bookingCode: 'ASH-K7M2',
    customer: { name: 'Sarah Thompson', phone: '+14165550123' },
    serviceName: 'Full Detail Package',
    date: '2026-07-18',
    timeSlot: '10:00 AM',
    vehicleType: 'SUV',
    status: 'confirmed' as const,
    total: 19097, // cents
    timeline: [
      { event: 'Booking Created', timestamp: '2026-07-15T15:24:00Z', completed: true },
      { event: 'Payment Received', timestamp: '2026-07-15T15:25:00Z', completed: true },
      { event: 'Booking Confirmed', timestamp: '2026-07-15T15:25:00Z', completed: true },
      { event: 'Service In Progress', timestamp: null, completed: false },
      { event: 'Completed', timestamp: null, completed: false },
    ],
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = bookingLookupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { bookingCode, phone } = parsed.data;

    // TODO: Rate limit this endpoint (5 requests per minute per IP)

    // Search for booking
    // TODO: Replace with database query
    const booking = MOCK_BOOKINGS.find(
      (b) =>
        b.bookingCode.toUpperCase() === bookingCode.toUpperCase() &&
        b.customer.phone.replace(/\D/g, '').endsWith(phone.replace(/\D/g, '').slice(-10))
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found. Please check your booking code and phone number.' },
        { status: 404 }
      );
    }

    // Return booking details (exclude sensitive info)
    return NextResponse.json({
      bookingCode: booking.bookingCode,
      serviceName: booking.serviceName,
      date: booking.date,
      timeSlot: booking.timeSlot,
      vehicleType: booking.vehicleType,
      status: booking.status,
      timeline: booking.timeline,
    });
  } catch (error) {
    console.error('Booking lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
