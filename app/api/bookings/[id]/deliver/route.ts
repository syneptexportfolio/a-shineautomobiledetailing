// API Route: Mark booking as delivered + trigger invoice + WhatsApp
// POST /api/bookings/[id]/deliver

import { NextRequest, NextResponse } from 'next/server';
import { sendInvoiceMessage, isWhatsAppConfigured } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/services';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // TODO: Verify admin authentication via JWT/session
    // const session = await getAdminSession(request);
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // TODO: Fetch booking from database
    // const booking = await db.booking.findUnique({ where: { id } });
    // if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Mock booking for demonstration
    const booking = {
      id,
      bookingCode: 'ASH-K7M2',
      serviceName: 'Full Detail Package',
      customer: {
        name: 'Sarah Thompson',
        email: 'sarah.thompson@email.com',
        phone: '+14165550123',
        whatsappOptIn: true,
      },
      total: 19097,
      status: 'confirmed',
    };

    if (booking.status === 'completed') {
      return NextResponse.json(
        { error: 'Booking is already marked as delivered' },
        { status: 400 }
      );
    }

    // Step 1: Update booking status to completed
    // TODO: await db.booking.update({ where: { id }, data: { status: 'completed', updatedAt: new Date() } });
    console.log(`✅ Booking ${booking.bookingCode} marked as delivered`);

    // Step 2: Generate invoice PDF
    // TODO: const invoicePdf = await generateInvoicePdf(booking);
    // TODO: const invoiceUrl = await uploadToStorage(invoicePdf);
    const invoiceUrl = `https://ashine.ca/invoices/${booking.bookingCode}.pdf`;
    console.log(`📄 Invoice generated: ${invoiceUrl}`);

    // Step 3: Send WhatsApp message (if customer opted in)
    let whatsappResult: { success: boolean; messageId?: string; error?: string } = { success: false, error: 'Not attempted' };

    if (booking.customer.whatsappOptIn && isWhatsAppConfigured()) {
      whatsappResult = await sendInvoiceMessage({
        customerPhone: booking.customer.phone,
        customerName: booking.customer.name,
        serviceName: booking.serviceName,
        totalAmount: formatPrice(booking.total),
        bookingCode: booking.bookingCode,
        invoicePdfUrl: invoiceUrl,
      });

      if (whatsappResult.success) {
        console.log(`📱 WhatsApp invoice sent to ${booking.customer.phone}`);
      } else {
        console.warn(`⚠️ WhatsApp send failed: ${whatsappResult.error}`);
        // TODO: Fallback to email via Resend
      }
    } else if (!isWhatsAppConfigured()) {
      console.warn('⚠️ WhatsApp API not configured — skipping');
    }

    // Step 4: Create invoice record in database
    // TODO: await db.invoice.create({
    //   data: {
    //     bookingId: id,
    //     invoiceNumber: generateInvoiceNumber(),
    //     amountCents: booking.total - calculateTax(booking.total),
    //     taxCents: calculateTax(booking.total),
    //     totalCents: booking.total,
    //     pdfUrl: invoiceUrl,
    //     whatsappSent: whatsappResult.success,
    //     sentAt: whatsappResult.success ? new Date() : null,
    //   },
    // });

    return NextResponse.json({
      success: true,
      bookingCode: booking.bookingCode,
      status: 'completed',
      invoice: {
        url: invoiceUrl,
        generated: true,
      },
      whatsapp: {
        sent: whatsappResult.success,
        error: whatsappResult.success ? null : whatsappResult.error,
      },
    });
  } catch (error) {
    console.error('Deliver booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process delivery' },
      { status: 500 }
    );
  }
}
