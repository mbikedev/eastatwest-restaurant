/**
 * Script to update takeaway product prices based on eastatwest_menu_en.pdf
 *
 * Run with: npx tsx scripts/update-takeaway-prices.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
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

// Prices from eastatwest_menu_en.pdf (name → price in EUR)
const menuPrices: Record<string, number> = {
  // COLD MEZZES
  'Warak Enab': 7,
  'Zahra': 7.50,
  'Itch': 7.50,
  'Hummus': 7.50,
  'Moussaka': 7.50,
  'Muhammara': 8,
  'Makdous': 8,
  'Moutabal': 8,

  // HOT MEZZES
  'Falafel (2 pcs)': 4,
  'Kibbeh (2 pcs)': 7,
  'Fatteh': 7.50,
  'Batata Harra': 7.50,
  'Foul Moudamas': 8,
  'Grilled Syrian Cheese': 10,
  'Arayes Cheese': 10,
  'Chicken Liver': 11.50,
  'Sujuk': 12.50,
  'Toshka': 12.50,
  'Oriental Eggplant': 13.50,
  "Chef's Mezze": 13.50,

  // SET MENUS (for 2 people)
  'Menu East@West': 67.50,
  'Menu Vegan': 64.50,
  'Menu Sahten': 84,
  'Menu Lazeez': 65.50,

  // DISHES
  'Foodie Meat': 24,
  'Foodie Vegan': 24,

  // SKEWERS
  '2× Shish Taouk': 10,
  '2× Kebab': 10,

  // SALADS
  'Original Tabouleh': 8,
  'Fattoush': 8,
  'Falafel Salad': 13.50,

  // LUNCH DISHES
  'Mix Break Vegan': 14.50,
  'Mix Break': 16.50,
  'Falafel': 18,
  'Chich Taouk': 19,
  'Mix Grill': 19,
  'Kebab': 19,
  'Sujuk Dish': 20.80,
  'Toshka Dish': 20.80,
  "Chef's Dish": 23.50,

  // SANDWICH + SALAD FORMULAS
  'Falafel Sandwich + Fattoush Salad': 12.50,
  'Chich Taouk + Fattoush Salad': 12.50,
  'Kabab + Fattoush Salad': 12.50,

  // DRINKS - BEERS
  'Lebanese beer': 5,
  'Jupiler beer': 3.50,
  'Hoegaarden blond 25cl': 5,
  'Leffe brune beer 33cl': 5,
  'Leffe blonde beer 33cl': 5,
  'Leffe 33cl (alcohol free)': 5,
  'Cherry beer': 5,

  // DRINKS - WINE RED
  'Le Prieuré': 29,
  'Reserve du couvent': 33,
  'Bretéche bottle': 36,
  'Glass of Lebanese wine': 6,

  // DRINKS - WINE WHITE
  "Blanc de l'observatoire": 29,
  'Blanc de Blancs': 36,
  'Bretéche': 36,

  // DRINKS - WINE ROSÉ
  'Chateau Ksara Rosé': 30,

  // DRINKS - COCKTAILS
  'Magic of Damascus': 9,
  'Lemon mirage': 9,
  'Arak': 6,

  // DRINKS - SOFT DRINKS
  'Home Made "Rose of Damascus"': 5,
  'Homemade lemon juice': 5,
  'Homemade ice-tea': 4,
  'Schweppes (Agrumes / Virgin Mojito)': 4,
  'Schweppes (Indian Tonic)': 4,
  'Water still/sparkling 0.5L': 4,
  'Coca-Cola / Coca Zero / Sprite': 3.50,
  'Fanta Orange': 3.50,
  'Ayran': 3.50,

  // DRINKS - HOT DRINKS
  'Arabic Coffee': 4,
  'Tea (Mint Tea / Black Tea / Chamomile)': 3.50,
  'Café / Espresso': 3.50,

  // DESSERTS
  'Aish el Saraya (Vgn)': 3.50,
  'Halaweh': 6,
  'Homemade Traditional Ice Cream': 9,

  // EXTRAS
  '4× Extra Bread Pieces': 1,
  'Extra Garlic Sauce': 2,
  'Extra Spicy Pepper Sauce': 2,
}

// Normalize name for fuzzy matching
function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[éèê]/g, 'e')
    .replace(/[àâ]/g, 'a')
    .replace(/[ùû]/g, 'u')
    .replace(/[ôö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/×/g, 'x')
    .replace(/\s+/g, ' ')
    .trim()
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

  // Build normalized lookup from PDF prices
  const normalizedPrices = new Map<string, number>()
  for (const [name, price] of Object.entries(menuPrices)) {
    normalizedPrices.set(normalize(name), price)
  }

  let updated = 0
  let skipped = 0
  let noMatch = 0

  for (const product of products) {
    const englishName = product.name?.en || product.name
    const normalizedProductName = normalize(String(englishName))

    // Try exact match first, then partial match
    let newPrice = normalizedPrices.get(normalizedProductName)

    if (newPrice === undefined) {
      // Try partial matching
      for (const [menuName, price] of normalizedPrices.entries()) {
        if (normalizedProductName.includes(menuName) || menuName.includes(normalizedProductName)) {
          newPrice = price
          break
        }
      }
    }

    if (newPrice === undefined) {
      console.log(`⚠️  No match: "${englishName}" (skipped)`)
      noMatch++
      continue
    }

    if (product.price === newPrice) {
      console.log(`✓  "${englishName}" — €${newPrice} (unchanged)`)
      skipped++
      continue
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ price: newPrice })
      .eq('id', product.id)

    if (updateError) {
      console.error(`✗  Error updating "${englishName}":`, updateError)
    } else {
      console.log(`✅ "${englishName}" — €${product.price} → €${newPrice}`)
      updated++
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Updated: ${updated}`)
  console.log(`Unchanged: ${skipped}`)
  console.log(`No match (skipped): ${noMatch}`)
}

updatePrices()
