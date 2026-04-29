/**
 * Script to fix incorrect price updates and apply correct prices.
 *
 * Run with: tsx scripts/update-takeaway-prices.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// EXACT name → price mapping based on PDF + database product names
// Only products that exist in BOTH the PDF and database are listed
// Sandwiches are NOT in the PDF as standalone items, so we restore original prices
const priceFixes: Record<string, number> = {
  // COLD MEZZES (from PDF)
  'Hummus': 7.50,
  'Moutabal': 8,
  'Warak Enab': 7,
  'Makdous': 8,
  'Batata Harra': 7.50,
  'Foul Moudamas': 8,
  'Arayes Cheese': 10,

  // HOT MEZZES — DB name "Falafel" is the hot mezze (2pcs), not the lunch dish
  // The PDF lists "Falafel (2 pcs)" at €4, but the DB "Falafel" at category level
  // needs verification. Keeping as mezze price for now:

  // Sujuk is a hot mezze in the DB (not the lunch dish)
  'Sujuk': 12.50,

  // LUNCH DISHES (from PDF) — these are dish/plate items
  'Falafel Plate': 18,
  'Kebab Dish': 19,

  // SKEWERS
  'Kebab Skewers (2x)': 10,
  'Chich Taouk Skewers (2x)': 10,

  // SET MENUS (for 2 people — PDF prices)
  'Menu Lazeez': 65.50,
  'Menu Sahten': 84,
  'Menu Vegan': 64.50,

  // SALADS (from PDF)
  'Fattoush Salad': 8,
  'Taboule': 8,
  'Falafel Salad': 13.50,

  // DESSERTS
  'Aish el Saraya': 3.50,
  'Traditional Ice Cream': 9,

  // DRINKS
  'Espresso': 3.50,
  'Indian Tonic': 4,
  'Jupiler Beer': 3.50,
  'Lebanese Beer': 5,

  // === ROLLBACK WRONG PRICES ===
  // These were incorrectly matched by fuzzy matching and need to be restored.
  // Sandwiches don't have corresponding PDF prices — restore originals.
  'Falafel Sandwich': 8.50,       // Was wrongly set to €18 (matched Falafel lunch dish)
  'Kebab Sandwich': 9.50,         // Was wrongly set to €19 (matched Kebab lunch dish)
  'Toshka Sandwich': 10,          // Was wrongly set to €12.50 (matched Toshka mezze)
  'Makdous Sandwich': 9.50,       // Was wrongly set to €8 (matched Makdous mezze)
  'Toshka Leban': 16.50,          // Was wrongly set to €12.50 (matched Toshka mezze)
  'Shish Taouk': 16.50,           // Was wrongly set to €10 (matched skewer price)
  'Falafel': 7,                   // Was wrongly set to €18 (matched lunch dish). This is the mezze item.
}

async function updatePrices() {
  console.log('Fetching all products from Supabase...\n')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price')

  if (error) {
    console.error('Error fetching products:', error)
    process.exit(1)
  }

  if (!products || products.length === 0) {
    console.error('No products found in database')
    process.exit(1)
  }

  console.log(`Found ${products.length} products in database\n`)

  let updated = 0
  let skipped = 0
  let noMatch = 0

  for (const product of products) {
    const englishName = product.name?.en || product.name
    const nameStr = String(englishName)

    // EXACT match only — no fuzzy matching
    const newPrice = priceFixes[nameStr]

    if (newPrice === undefined) {
      noMatch++
      continue
    }

    if (product.price === newPrice) {
      console.log(`✓  "${nameStr}" — €${newPrice} (unchanged)`)
      skipped++
      continue
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ price: newPrice })
      .eq('id', product.id)

    if (updateError) {
      console.error(`✗  Error updating "${nameStr}":`, updateError)
    } else {
      console.log(`✅ "${nameStr}" — €${product.price} → €${newPrice}`)
      updated++
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Updated: ${updated}`)
  console.log(`Unchanged: ${skipped}`)
  console.log(`No match (not in fix list): ${noMatch}`)
}

updatePrices()
