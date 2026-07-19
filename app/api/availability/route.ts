// API Route: Check slot availability for a given date
// GET /api/availability?date=2026-07-18&serviceId=full-detail

import { NextRequest, NextResponse } from 'next/server';
import { generateTimeSlots } from '@/lib/timeslots';
import { getServiceById } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
      return NextResponse.json(
        { error: 'Missing required parameters: date, serviceId' },
        { status: 400 }
      );
    }

    // Validate service exists
    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Invalid service ID' },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const requestedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
      return NextResponse.json(
        { error: 'Cannot check availability for past dates' },
        { status: 400 }
      );
    }

    // Generate time slots based on service duration
    const slots = generateTimeSlots(service.duration);

    // TODO: When database is connected, check against existing bookings
    // For now, all generated slots are marked as available
    // In production:
    // 1. Query bookings table for the given date
    // 2. For each slot, check if it overlaps with existing bookings
    // 3. Mark overlapping slots as unavailable

    return NextResponse.json({
      date,
      serviceId,
      serviceDuration: service.duration,
      slots,
    });
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
