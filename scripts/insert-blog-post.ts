import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const blogContent = `# Complete Guide to Lebanese Cuisine: Traditional Dishes, Flavors & Culture

Lebanese cuisine is one of the world's most celebrated culinary traditions, combining fresh Mediterranean ingredients with centuries-old recipes and aromatic spices. Whether you're exploring **Lebanese restaurants in Brussels** or planning your first taste of authentic Middle Eastern food, this comprehensive guide will introduce you to the flavors, dishes, and cultural significance of Lebanese gastronomy.

## What Makes Lebanese Cuisine Special?

Lebanese food stands out for several unique characteristics that have made it beloved worldwide:

- **Fresh, Quality Ingredients**: Lebanese cooking emphasizes seasonal vegetables, herbs, olive oil, lemon, and garlic
- **Healthy Mediterranean Diet**: Rich in vegetables, legumes, whole grains, and lean proteins
- **Mezze Culture**: The tradition of sharing small plates creates a communal dining experience
- **Ancient Recipes**: Many dishes have been passed down through generations, preserving authentic flavors
- **Aromatic Spices**: Sumac, za'atar, cinnamon, allspice, and mint create distinctive flavor profiles

## 🥗 Essential Lebanese Mezze (Appetizers)

Mezze is the heart of Lebanese dining. These small dishes are meant for sharing and enjoying slowly with friends and family.

### Cold Mezze

**Hummus** - The iconic chickpea and tahini dip, drizzled with olive oil and often topped with pine nuts or paprika. Perfect with warm pita bread.

**Baba Ghanoush** - Smoky roasted eggplant blended with tahini, garlic, and lemon juice. The charred flavor makes it irresistible.

**Tabbouleh** - Fresh parsley salad with bulgur wheat, tomatoes, mint, lemon juice, and olive oil. Light, refreshing, and packed with nutrients.

**Fattoush** - Mixed green salad with crispy pita chips, radishes, tomatoes, and sumac dressing. The tangy sumac gives it a unique citrus flavor.

**Moutabal** - Similar to baba ghanoush but creamier, with more tahini and often pomegranate seeds for sweetness.

**Labneh** - Thick, strained yogurt served with olive oil, mint, and za'atar. Often eaten for breakfast with vegetables.

### Hot Mezze

**Falafel** - Crispy fried chickpea fritters seasoned with herbs and spices. A vegetarian staple found in every **Lebanese restaurant in Brussels**.

**Sambousek** - Triangular pastries filled with cheese, spinach, or spiced meat. Perfectly crispy and savory.

**Kibbeh** - Ground meat mixed with bulgur wheat, shaped into balls or torpedoes, and deep-fried until golden. Can also be served raw (kibbeh nayyeh).

**Fatayer** - Small pastries filled with spinach, cheese, or meat. Boat-shaped and baked until golden.

**Grilled Halloumi** - Cypriot cheese that holds its shape when grilled, served with za'atar and olive oil.

## 🍖 Traditional Lebanese Main Courses

Lebanese main dishes showcase the country's mastery of grilled meats, aromatic rice, and slow-cooked stews.

### Grilled Specialties

**Shish Taouk** - Marinated chicken skewers grilled to perfection, served with garlic sauce (toum) and pickles.

**Kafta (Kofta)** - Seasoned ground lamb or beef shaped onto skewers and grilled. Often served with grilled vegetables.

**Mixed Grill (Mashawi)** - A platter featuring lamb chops, chicken, kafta, and sometimes liver or kidneys. Perfect for sharing.

**Lamb Shawarma** - Thinly sliced marinated lamb, stacked and slow-roasted on a vertical spit. Served in pita or over rice.

### Traditional Stews & Rice Dishes

**Moussaka** - Layers of eggplant, chickpeas, and tomato sauce, baked until tender. Similar to Greek moussaka but without béchamel.

**Mjadra** - Lentils and rice cooked with caramelized onions. Simple, hearty, and deeply flavorful.

**Hashweh** - Spiced rice with ground meat, pine nuts, and aromatic spices like cinnamon and allspice.

**Batata Harra** - Spicy roasted potatoes with garlic, cilantro, and chili peppers. A popular side dish.

**Sayadieh** - Fish and rice cooked with caramelized onions and tahini sauce. A coastal specialty.

## 🥙 Lebanese Street Food Favorites

### Manakish (Lebanese Pizza)

Flatbread topped with za'atar and olive oil, cheese, or spiced meat (lahm bi ajeen). Often eaten for breakfast or as a quick snack.

### Falafel Wrap

Crispy falafel balls wrapped in pita with tahini sauce, vegetables, and pickles. A **halal** vegetarian option available at most Lebanese restaurants.

### Shawarma Sandwich

Slow-roasted meat (chicken or lamb) wrapped in thin saj bread with garlic sauce, pickles, and fries. The ultimate Lebanese street food.

## 🍰 Lebanese Desserts & Sweets

Lebanese desserts are known for their use of nuts, honey, orange blossom water, and phyllo pastry.

**Baklava** - Layers of crispy phyllo pastry filled with pistachios or walnuts, sweetened with honey or sugar syrup.

**Knafeh (Kanafeh)** - Shredded phyllo pastry layered with sweet cheese, baked until golden, and soaked in rose water syrup.

**Maamoul** - Shortbread cookies filled with dates, pistachios, or walnuts. Traditional for holidays and special occasions.

**Halawet El Jibn** - Sweet cheese rolls filled with cream and topped with pistachios and sugar syrup.

**Rice Pudding (Riz bi Haleeb)** - Creamy rice pudding flavored with orange blossom water and topped with nuts.

## ☕ Lebanese Beverages

**Turkish Coffee** - Strong, unfiltered coffee served in small cups. The grounds settle at the bottom, and some people read fortunes from the patterns.

**Mint Tea** - Fresh mint leaves steeped in hot water with sugar. Refreshing and digestive.

**Ayran** - Salted yogurt drink, perfect for cooling down with spicy foods.

**Jallab** - Sweet drink made from dates, grape molasses, and rose water, served over ice with pine nuts and raisins.

**Arak** - Anise-flavored alcoholic spirit, traditionally served with mezze. Turns milky white when mixed with water.

## 🌿 Key Ingredients in Lebanese Cooking

Understanding these ingredients will help you appreciate the authentic flavors of Lebanese cuisine:

### Herbs & Spices
- **Za'atar** - Herb blend of thyme, sumac, sesame seeds, and salt
- **Sumac** - Tangy, lemony spice used in salads and on grilled meats
- **Mint** - Fresh or dried, used in tabbouleh, tea, and yogurt dishes
- **Parsley** - The star of tabbouleh, used abundantly in Lebanese cooking
- **Allspice & Cinnamon** - Used in meat dishes and rice preparations

### Staples
- **Tahini** - Sesame seed paste, base for many dips and sauces
- **Olive Oil** - Extra virgin olive oil from Lebanese groves
- **Pomegranate Molasses** - Tangy-sweet syrup used in dressings and marinades
- **Bulgur Wheat** - Used in tabbouleh, kibbeh, and mjadra
- **Chickpeas** - Foundation of hummus and falafel

## 🍽️ Lebanese Dining Etiquette & Culture

### The Mezze Tradition
Lebanese meals are rarely rushed. The mezze tradition encourages slow dining, conversation, and sharing. It's common to order 8-12 mezze dishes for a group to share before main courses.

### Hospitality (Karama)
Lebanese hospitality is legendary. Hosts take pride in offering abundant food and ensuring guests never leave hungry. It's polite to accept offerings and try a bit of everything.

### Halal Certification
Many Lebanese restaurants, including those in Brussels, serve **halal-certified meat**, making the cuisine accessible to Muslim diners while maintaining traditional preparation methods.

## 🌍 Where to Experience Authentic Lebanese Cuisine in Brussels

Brussels has a vibrant Lebanese food scene, with restaurants offering everything from quick falafel wraps to elaborate mezze spreads. When looking for **authentic Lebanese restaurants in Brussels**, seek out places that:

- Make fresh hummus and baba ghanoush daily
- Grill meats over charcoal for authentic flavor
- Offer a wide variety of mezze dishes
- Use traditional spices and preparation methods
- Provide warm Arabic bread (pita) fresh from the oven

**At East @ West**, we pride ourselves on bringing authentic Lebanese flavors to the heart of Brussels. Our menu features traditional recipes passed down through generations, using fresh ingredients and time-honored cooking techniques.

## 🥘 Vegetarian & Vegan Options in Lebanese Cuisine

Lebanese cuisine is exceptionally vegetarian and vegan-friendly:

**Vegan Mezze:**
- Hummus
- Baba ghanoush
- Tabbouleh
- Fattoush
- Falafel
- Muhammara (red pepper and walnut dip)
- Warak enab (stuffed grape leaves)

**Vegetarian Options:**
- All vegan options plus:
- Halloumi cheese
- Labneh
- Sambousek with cheese
- Manakish with cheese

## 📖 Tips for Ordering at a Lebanese Restaurant

**For First-Timers:**
1. Start with a **mixed mezze platter** to try multiple dishes
2. Order **hummus** - it's a benchmark for quality
3. Try **shish taouk** or **mixed grill** for main courses
4. Save room for **baklava** or **knafeh**
5. Don't skip the **Arabic coffee** at the end

**For Groups:**
Order family-style with multiple mezze, a few main dishes, and share everything.

**For Vegetarians:**
Lebanese restaurants typically have excellent vegetarian options. Ask for a **vegetarian mezze selection**.

## 🎯 Health Benefits of Lebanese Cuisine

Lebanese food aligns perfectly with the **Mediterranean diet**, recognized as one of the world's healthiest:

- **Heart-Healthy Fats**: Abundant olive oil and tahini provide beneficial fats
- **Plant-Based Proteins**: Chickpeas, lentils, and beans offer protein without cholesterol
- **Antioxidant-Rich**: Fresh herbs, vegetables, and spices combat inflammation
- **Low in Processed Foods**: Emphasis on whole, fresh ingredients
- **Probiotic Benefits**: Yogurt-based dishes support gut health

## 🍽️ Experience Authentic Lebanese Cuisine in Brussels

Ready to explore Lebanese flavors? Visit **East @ West Lebanese Restaurant** in Brussels for an authentic culinary journey. Our menu features:

✓ Fresh daily mezze made from traditional recipes
✓ Charcoal-grilled meats marinated in Lebanese spices
✓ Halal-certified options
✓ Vegetarian and vegan selections
✓ Traditional desserts and Lebanese coffee
✓ Warm hospitality in the heart of Brussels

**Reserve your table today** and discover why Lebanese cuisine is celebrated worldwide.`;

async function insertBlogPost() {
  console.log('🚀 Inserting Lebanese Cuisine Guide blog post...');

  const { data, error } = await supabase
    .from('blogs')
    .insert([{
      title: 'Complete Guide to Lebanese Cuisine: Traditional Dishes, Flavors & Culture',
      slug: 'complete-guide-lebanese-cuisine-traditional-dishes',
      excerpt: 'Discover authentic Lebanese cuisine with our complete guide. Learn about traditional mezze, main dishes, desserts, and the rich culinary culture of Lebanon. Perfect for food lovers in Brussels and beyond.',
      content: blogContent,
      author_name: 'East @ West Team',
      cover_image_url: 'https://eastatwest.com/images/gallery/set-libanais.webp',
      tags: ['Lebanese Cuisine', 'Food Guide', 'Middle Eastern Food', 'Mediterranean Diet', 'Traditional Recipes', 'Brussels Dining', 'Halal Food', 'Mezze', 'Lebanese Culture', 'Restaurant Guide'],
      published: true,
      featured: true,
      language: 'en',
      meta_title: 'Complete Guide to Lebanese Cuisine: Traditional Dishes, Mezze & Culture | Brussels',
      meta_description: 'Comprehensive guide to authentic Lebanese cuisine. Discover traditional mezze, main dishes, desserts, and dining culture. Perfect for Brussels food lovers seeking authentic Middle Eastern flavors.',
      reading_time: 15,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    console.error('❌ Error inserting blog post:', error);
    process.exit(1);
  }

  console.log('✅ Blog post inserted successfully!');
  console.log('📝 Post ID:', data[0].id);
  console.log('🔗 Slug:', data[0].slug);
  console.log('🌐 View at: https://eastatwest.com/blog/complete-guide-lebanese-cuisine-traditional-dishes');
  console.log('\n📊 SEO Details:');
  console.log('   - Keywords: Lebanese cuisine, mezze, Brussels dining, halal food, Mediterranean diet');
  console.log('   - Reading time: 15 minutes');
  console.log('   - Featured: Yes');
  console.log('   - Published: Yes');
}

insertBlogPost();
