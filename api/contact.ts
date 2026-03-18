export const config = {
  runtime: 'nodejs'
};

import { Resend } from 'resend';


let lastRequestTime = 0;

export default async function handler(req: any, res: any) {

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: 'Missing API key'
    });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log('RESEND_API_KEY loaded?', !!process.env.RESEND_API_KEY);

  const body = typeof req.body === 'string'
    ? JSON.parse(req.body)
    : req.body;

  const { name, email, topic, message, company } = body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const now = Date.now();
  if (now - lastRequestTime < 30000) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  lastRequestTime = now;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!topic) {
    return res.status(400).json({ error: 'Topic required' });
  }

  if (!message || message.trim().length < 10) {
    return res.status(400).json({ error: 'Message too short' });
  }

  try {

    if (company) {
      return res.status(200).json({ success: true });
    }

    const data = await resend.emails.send({

      from: 'onboarding@resend.dev',

      to: 'xavieljoseterrerocuevas9@gmail.com',

      subject: `Portfolio message: ${topic}`,

      html: `
        <div style="background-color: #0f0f0f; padding: 20px; font-family: Arial, sans-serif;">

        <div style="text-align: center; margin-bottom: 20px;">
  <h1 style="color:#ffb300; margin: 0 0 10px 0;">
    Xaviel Web
  </h1>

  <span style="
    display: inline-block;
    background:#ffb30022;
    color:#ffb300;
    padding:4px 10px;
    border-radius:6px;
    font-size:12px;
  ">
    ${topic}
  </span>
</div>
    
    <div style="
      max-width: 600px;
      margin: 0 auto;
      background-color: rgba(0,0,0,0.8);
      border: 1px solid #ffb300;
      border-radius: 12px;
      padding: 20px;
      color: #ffffff;
    ">

      <h2 style="
        color: #ffb300;
        margin-bottom: 20px;
        font-size: 20px;
      ">
        New Portfolio Contact
      </h2>

      <p style="margin: 8px 0;">
        <strong style="color:#ffb300;">Name:</strong> ${name}
      </p>

      <p style="margin: 8px 0;">
        <strong style="color:#ffb300;">Email:</strong> ${email}
      </p>

      <p style="margin: 8px 0;">
        <strong style="color:#ffb300;">Topic:</strong> ${topic}
      </p>

      <hr style="
        margin: 20px 0;
        border: none;
        border-top: 1px solid rgba(255,179,0,0.3);
      " />

      <p style="margin-bottom: 10px;">
        <strong style="color:#ffb300;">Message:</strong>
      </p>

      <p style="
        line-height: 1.6;
        color: #ddd;
      ">
        ${message}
      </p>

    </div>

  </div>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error: any) {

    console.error('RESEND ERROR:', error);

    return res.status(500).json({
      error: 'Failed to send email',
      details: error?.message || JSON.stringify(error)
    });

  }

}
