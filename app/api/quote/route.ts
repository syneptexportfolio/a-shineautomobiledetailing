import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, vehicle, service, details } = body;

    // Basic server-side validation
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required.' },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
      console.warn('GOOGLE_SCRIPT_URL not configured — running in dev mode.');
      return NextResponse.json({ result: 'dev-mode' });
    }

    // Google Apps Script Web Apps issue a 302 redirect on POST.
    // Sending as application/x-www-form-urlencoded with redirect:'follow'
    // ensures the payload survives the redirect correctly.
    const formData = new URLSearchParams();
    formData.append('name',    name    ?? '');
    formData.append('phone',   phone   ?? '');
    formData.append('email',   email   ?? '');
    formData.append('vehicle', vehicle ?? '');
    formData.append('service', service ?? '');
    formData.append('details', details ?? '');

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'follow',
    });

    // Google Apps Script always returns 200 on success
    if (!response.ok) {
      const text = await response.text();
      console.error('Google Script non-200:', response.status, text);
      return NextResponse.json(
        { error: 'Failed to save to Google Sheets. Please try again.' },
        { status: 500 }
      );
    }

    const text = await response.text();
    let result: { result?: string; message?: string } = {};
    try {
      result = JSON.parse(text);
    } catch {
      // Google sometimes returns HTML on auth errors — treat as failure
      console.error('Google Script non-JSON response:', text.slice(0, 200));
      return NextResponse.json(
        { error: 'Unexpected response from Google Sheets. Check your Apps Script deployment.' },
        { status: 500 }
      );
    }

    if (result.result !== 'success') {
      console.error('Google Script logic error:', result.message);
      return NextResponse.json(
        { error: result.message ?? 'Google Sheets write failed.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: 'success' });

  } catch (err) {
    console.error('Quote API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
