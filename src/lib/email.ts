import nodemailer from 'nodemailer';

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
      // Do not fail on invalid certs (for development)
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
  from = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@eastatwest.com',
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
    headers: {
      'X-Mailer': 'East At West Restaurant',
      ...headers,
    },
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
