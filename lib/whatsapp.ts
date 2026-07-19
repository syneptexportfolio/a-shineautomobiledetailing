// WhatsApp Cloud API client for sending automated invoices
// Uses Meta's official Cloud API

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
}

function getConfig(): WhatsAppConfig {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.warn(
      '⚠️  WhatsApp API credentials not configured. ' +
      'Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env.local'
    );
  }

  return {
    phoneNumberId: phoneNumberId || '',
    accessToken: accessToken || '',
  };
}

/**
 * Send an invoice message via WhatsApp
 */
export async function sendInvoiceMessage({
  customerPhone,
  customerName,
  serviceName,
  totalAmount,
  bookingCode,
  invoicePdfUrl,
}: {
  customerPhone: string;
  customerName: string;
  serviceName: string;
  totalAmount: string; // formatted, e.g. "$190.97"
  bookingCode: string;
  invoicePdfUrl?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getConfig();

  if (!config.phoneNumberId || !config.accessToken) {
    return {
      success: false,
      error: 'WhatsApp API not configured',
    };
  }

  // Normalize phone number to international format
  const phone = normalizePhoneNumber(customerPhone);

  try {
    // Send template message with invoice details
    const response = await fetch(
      `${WHATSAPP_API_URL}/${config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'template',
          template: {
            name: 'ashine_invoice_delivery', // Pre-approved template name
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: customerName },
                  { type: 'text', text: serviceName },
                  { type: 'text', text: totalAmount },
                  { type: 'text', text: bookingCode },
                ],
              },
            ],
          },
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.messages?.[0]?.id) {
      // If we have a PDF URL, send it as a follow-up document
      if (invoicePdfUrl) {
        await sendDocument({
          phone,
          documentUrl: invoicePdfUrl,
          filename: `Invoice-${bookingCode}.pdf`,
          caption: `Invoice for your ${serviceName} service — ${totalAmount} CAD`,
          config,
        });
      }

      return {
        success: true,
        messageId: data.messages[0].id,
      };
    }

    return {
      success: false,
      error: data.error?.message || 'Failed to send WhatsApp message',
    };
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a document (PDF invoice) via WhatsApp
 */
async function sendDocument({
  phone,
  documentUrl,
  filename,
  caption,
  config,
}: {
  phone: string;
  documentUrl: string;
  filename: string;
  caption: string;
  config: WhatsAppConfig;
}): Promise<void> {
  try {
    await fetch(
      `${WHATSAPP_API_URL}/${config.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'document',
          document: {
            link: documentUrl,
            filename,
            caption,
          },
        }),
      }
    );
  } catch (error) {
    console.error('Failed to send WhatsApp document:', error);
  }
}

/**
 * Normalize a Canadian phone number to E.164 format
 * e.g. "(416) 555-0123" → "14165550123"
 */
function normalizePhoneNumber(phone: string): string {
  // Strip all non-numeric characters
  const digits = phone.replace(/\D/g, '');

  // If starts with 1 and is 11 digits, it's already in international format
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits;
  }

  // If 10 digits, prepend country code
  if (digits.length === 10) {
    return `1${digits}`;
  }

  return digits;
}

/**
 * Check if WhatsApp API is configured
 */
export function isWhatsAppConfigured(): boolean {
  return !!(
    process.env.WHATSAPP_PHONE_NUMBER_ID &&
    process.env.WHATSAPP_ACCESS_TOKEN
  );
}
