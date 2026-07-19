// API Route: Stripe Webhook Handler
// POST /api/stripe/webhook
// Handles payment events from Stripe

import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`⚠️ Webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutExpired(session);
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      await handleChargeRefunded(charge);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

/**
 * Handle successful payment — confirm the booking
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const bookingCode = session.metadata?.booking_code;
  const paymentIntentId = typeof session.payment_intent === 'string' 
    ? session.payment_intent 
    : session.payment_intent?.id;

  console.log(`✅ Payment successful for booking: ${bookingCode}`);
  console.log(`   Payment Intent: ${paymentIntentId}`);
  console.log(`   Amount: ${session.amount_total} ${session.currency?.toUpperCase()}`);

  // TODO: Update booking status in database
  // await db.booking.update({
  //   where: { bookingCode },
  //   data: {
  //     status: 'confirmed',
  //     stripeSessionId: session.id,
  //     stripePaymentIntentId: paymentIntentId,
  //     updatedAt: new Date(),
  //   },
  // });

  // TODO: Send confirmation SMS/email to customer
}

/**
 * Handle expired checkout — cancel the pending booking
 */
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const bookingCode = session.metadata?.booking_code;
  console.log(`⏰ Checkout expired for booking: ${bookingCode}`);

  // TODO: Update booking status in database
  // await db.booking.update({
  //   where: { bookingCode },
  //   data: { status: 'cancelled', updatedAt: new Date() },
  // });
}

/**
 * Handle refund — update booking status
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`💰 Refund processed for charge: ${charge.id}`);

  // TODO: Find booking by payment intent and update status
  // const paymentIntentId = typeof charge.payment_intent === 'string'
  //   ? charge.payment_intent
  //   : charge.payment_intent?.id;
  //
  // await db.booking.update({
  //   where: { stripePaymentIntentId: paymentIntentId },
  //   data: { status: 'cancelled', updatedAt: new Date() },
  // });
}
