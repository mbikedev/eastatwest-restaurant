import nodemailer from 'nodemailer';

// Consistent sender identity — always use the same From address
const DEFAULT_FROM = `East @ West Restaurant <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@eastatwest.com'}>`;
const REPLY_TO = process.env.SMTP_REPLY_TO || 'contact@eastatwest.com';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eastatwest.com';

// Create reusable transporter for SMTP
function createTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error('SMTP configuration is incomplete. Please check SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS environment variables.');
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
}

// Send email using SMTP (Nodemailer)
export async function sendEmail({
  to,
  subject,
  text,
  html,
  from = DEFAULT_FROM,
  headers = {},
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
  from?: string;
  headers?: Record<string, string>;
}) {
  const transporter = createTransporter();

  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
    replyTo: REPLY_TO,
    headers: {
      'X-Mailer': 'East At West Restaurant',
      // Gmail/Yahoo require List-Unsubscribe for deliverability
      'List-Unsubscribe': `<mailto:unsubscribe@eastatwest.com>, <${BASE_URL}/unsubscribe?email=${encodeURIComponent(to)}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      ...headers,
    },
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
