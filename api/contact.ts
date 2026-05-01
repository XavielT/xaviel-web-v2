import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not defined');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Parse the request body
  let body: any;
  try {
    body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
  } catch (error) {
    console.error('Parse error:', error);
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { name, email, topic, message, company } = body;

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Invalid topic' });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters' });
  }

  // Honeypot check
  if (company && company.toString().trim().length > 0) {
    // Return success but don't send email (bot protection)
    console.log('Honeypot triggered');
    return res.status(200).json({ success: true });
  }

  try {
    // Initialize Resend client
    const resend = new Resend(apiKey);

    // Prepare email HTML
    const emailHTML = `
      <div style="background-color: #0f0f0f; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color:#ffb300; margin: 0 0 10px 0;">Xaviel Web</h1>
          <span style="display: inline-block; background:#ffb30022; color:#ffb300; padding:4px 10px; border-radius:6px; font-size:12px;">
            ${topic}
          </span>
        </div>
        <div style="max-width: 600px; margin: 0 auto; background-color: rgba(0,0,0,0.8); border: 1px solid #ffb300; border-radius: 12px; padding: 20px; color: #ffffff;">
          <h2 style="color: #ffb300; margin-bottom: 20px; font-size: 20px;">New Portfolio Contact</h2>
          <p style="margin: 8px 0;"><strong style="color:#ffb300;">Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong style="color:#ffb300;">Email:</strong> ${email}</p>
          <p style="margin: 8px 0;"><strong style="color:#ffb300;">Topic:</strong> ${topic}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid rgba(255,179,0,0.3);" />
          <p style="margin-bottom: 10px;"><strong style="color:#ffb300;">Message:</strong></p>
          <p style="line-height: 1.6; color: #ddd;">${message}</p>
        </div>
      </div>
    `;

    console.log('Sending email via Resend to:', 'xavieljoseterrerocuevas9@gmail.com');

    // Send email
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'xavieljoseterrerocuevas9@gmail.com',
      subject: `Portfolio message: ${topic}`,
      html: emailHTML,
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return res.status(500).json({ error: 'Failed to send email', details: response.error });
    }

    console.log('Email sent successfully:', response.id);
    return res.status(200).json({ success: true, id: response.id });

  } catch (error: any) {
    console.error('Exception in contact API:', error);
    console.error('Error message:', error?.message);
    console.error('Error name:', error?.name);
    
    return res.status(500).json({
      error: 'Failed to send email',
      message: error?.message || 'Unknown error',
    });
  }
}
