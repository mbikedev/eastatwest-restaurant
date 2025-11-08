import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function testNotificationEmail() {
  console.log('\n╔═══════════════════════════════════════════╗')
  console.log('║  Testing Staff Notification Email       ║')
  console.log('╚═══════════════════════════════════════════╝\n')

  const testData = {
    reservationData: {
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '+32 123 456 789',
      date: new Date().toISOString(),
      startTime: '19:00',
      endTime: '21:00',
      guests: 4,
      specialRequests: 'This is a test notification to staff'
    }
  }

  console.log('📧 Sending test notification email to staff...')
  console.log('Reservation for:', testData.reservationData.name)
  console.log('Guests:', testData.reservationData.guests)
  console.log('')

  try {
    const response = await fetch('http://localhost:3000/api/send-notification-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('✅ Success! Notification emails sent')
      console.log('Details:', result)
    } else {
      console.log('❌ Failed to send notification emails')
      console.log('Status:', response.status)
      console.log('Error:', result)
    }
  } catch (error) {
    console.error('❌ Error testing notification email:', error)
  }

  console.log('\n═══════════════════════════════════════════\n')
}

testNotificationEmail()
