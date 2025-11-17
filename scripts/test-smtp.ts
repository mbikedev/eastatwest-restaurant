import { config } from 'dotenv';
import { resolve } from 'path';
import { sendEmail } from '../src/lib/email';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testSMTP() {
  console.log('🧪 Testing SMTP Email Configuration...\n');

  // Display configuration (without password)
  console.log('📧 SMTP Configuration:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  From:', process.env.SMTP_FROM_EMAIL);
  console.log('');

  try {
    console.log('📤 Sending test email...\n');

    const result = await sendEmail({
      to: process.env.SMTP_USER || 'contact@eastatwest.com', // Send to yourself for testing
      subject: '✅ Test Email from East @ West Restaurant',
      text: 'This is a test email to verify SMTP configuration with Titan Email.',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0;">✅ Test Email Successful!</h1>
          </div>

          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1f2937; margin-top: 0;">SMTP Configuration Working</h2>

            <p style="color: #4b5563; line-height: 1.6;">
              This is a test email from <strong>East @ West Restaurant</strong> to verify that your SMTP configuration with Titan Email is working correctly.
            </p>

            <div style="background: #f0f9f4; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h3 style="color: #10b981; margin: 0 0 10px 0;">✓ Email Service Status</h3>
              <ul style="color: #374151; margin: 0; padding-left: 20px;">
                <li>SMTP Host: smtp.titan.email</li>
                <li>Port: 587 (TLS)</li>
                <li>Authentication: Successful</li>
                <li>Email Delivery: Working</li>
              </ul>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              <strong>Next Steps:</strong>
            </p>
            <ol style="color: #6b7280; font-size: 14px; line-height: 1.8;">
              <li>Test reservation confirmation emails</li>
              <li>Test order confirmation emails</li>
              <li>Configure production environment variables</li>
              <li>Merge main2 branch to main</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>East @ West Restaurant - Email Testing</p>
            <p>Powered by Nodemailer + Titan Email</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully!\n');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    console.log('\n💡 Check your inbox:', process.env.SMTP_USER);
    console.log('');
    console.log('🎉 SMTP configuration is working correctly!');

  } catch (error) {
    console.error('❌ Error sending email:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);

      // Provide helpful debugging information
      console.log('\n🔍 Troubleshooting Tips:');
      console.log('1. Verify your Titan Email credentials in .env.local');
      console.log('2. Check that SMTP_USER is your full email address');
      console.log('3. Ensure your Titan Email password is correct');
      console.log('4. Verify that port 587 is not blocked by your firewall');
      console.log('5. Check Hostinger/Titan Email dashboard for any restrictions');
    }

    process.exit(1);
  }
}

// Run the test
testSMTP();
