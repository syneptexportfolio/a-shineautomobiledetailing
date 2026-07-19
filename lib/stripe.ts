// Stripe client initialization
// Server-side only — never import this in client components

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Lazily initialize and return the Stripe client.
 * This prevents build errors when STRIPE_SECRET_KEY is not set.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Add it to your .env.local file.'
      );
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-06-24.dahlia',
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Create a Stripe Checkout session for a booking
 */
export async function createCheckoutSession({
  serviceName,
  serviceDescription,
  amountCents,
  bookingCode,
  customerEmail,
  customerName,
  metadata,
}: {
  serviceName: string;
  serviceDescription: string;
  amountCents: number;
  bookingCode: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: serviceName,
            description: serviceDescription,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${baseUrl}/book/success?session_id={CHECKOUT_SESSION_ID}&code=${bookingCode}`,
    cancel_url: `${baseUrl}/book?cancelled=true`,
    customer_email: customerEmail,
    metadata: {
      booking_code: bookingCode,
      customer_name: customerName,
      ...metadata,
    },
  });

  return session;
}
