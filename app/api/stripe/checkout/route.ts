// API Route: Create a Stripe Checkout session
// POST /api/stripe/checkout

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { getServiceById, formatPrice } from '@/lib/services';
import { calculateTax, calculateTotal, generateBookingCode, DEFAULT_TAX_RATE } from '@/lib/bookings';
import { createBookingSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = createBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { serviceId, date, timeSlot, customer } = parsed.data;

    // Validate service
    const service = getServiceById(serviceId);
    if (!service) {
      return NextResponse.json(
        { error: 'Invalid service' },
        { status: 400 }
      );
    }

    // Calculate amounts
    const subtotal = service.price;
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal);

    // Generate booking code
    const bookingCode = generateBookingCode();

    // Create Stripe Checkout session
    const session = await createCheckoutSession({
      serviceName: `${service.name} — A-Shine Auto Mobile Detailing`,
      serviceDescription: `${service.description} | ${date} at ${timeSlot}`,
      amountCents: total,
      bookingCode,
      customerEmail: customer.email,
      customerName: customer.name,
      metadata: {
        service_id: serviceId,
        service_name: service.name,
        booking_date: date,
        time_slot: timeSlot,
        customer_phone: customer.phone,
        vehicle_type: customer.vehicleType,
        whatsapp_opt_in: String(customer.whatsappOptIn),
        subtotal: String(subtotal),
        tax: String(tax),
        tax_name: DEFAULT_TAX_RATE.name,
        tax_rate: String(DEFAULT_TAX_RATE.rate),
      },
    });

    // TODO: Create a pending booking in the database here
    // The Stripe webhook will confirm it once payment succeeds

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
      bookingCode,
    });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
