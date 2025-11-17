import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function testReservationEmail() {
  console.log('\n╔═══════════════════════════════════════════╗')
  console.log('║  Testing Reservation Email               ║')
  console.log('╚═══════════════════════════════════════════╝\n')

  const testData = {
    email: 'mbagnickg@gmail.com',
    guests: 4,
    language: 'en',
    invoiceNumber: `TEST-${Date.now()}`,
    reservationData: {
      name: 'Test User',
      email: 'mbagnickg@gmail.com',
      phone: '+32 123 456 789',
      date: new Date().toISOString(),
      startTime: '19:00',
      endTime: '21:00',
      guests: 4,
      specialRequests: 'This is a test reservation email'
    }
  }

  console.log('📧 Sending test reservation email...')
  console.log('To:', testData.email)
  console.log('Guests:', testData.guests)
  console.log('Language:', testData.language)
  console.log('')

  try {
    const response = await fetch('http://localhost:3000/api/send-reservation-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log('✅ Success! Reservation email sent')
      console.log('Check your inbox:', testData.email)
      console.log('Invoice Number:', testData.invoiceNumber)
    } else {
      console.log('❌ Failed to send reservation email')
      console.log('Error:', result.error || 'Unknown error')
      console.log('Status:', response.status)
    }
  } catch (error) {
    console.error('❌ Error testing reservation email:', error)
  }

  console.log('\n═══════════════════════════════════════════\n')
}

testReservationEmail()
