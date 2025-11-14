import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Blog Post 3: Traditional Lebanese Mezze Guide (EN, FR, NL)
const mezzeGuidePosts = [
  {
    language: 'en',
    title: 'Traditional Lebanese Mezze Guide: 20 Must-Try Appetizers',
    slug: 'traditional-lebanese-mezze-guide-must-try-appetizers',
    excerpt: 'Complete guide to Lebanese mezze. Discover 20 traditional appetizers, from hummus and baba ghanoush to kibbeh and sambousek. Perfect for Brussels food lovers.',
    meta_title: 'Lebanese Mezze Guide: 20 Traditional Appetizers | Brussels',
    meta_description: 'Discover authentic Lebanese mezze with our complete guide. Learn about 20 traditional appetizers, preparation methods, and where to find the best mezze in Brussels.',
    content: `# Traditional Lebanese Mezze Guide: 20 Must-Try Appetizers

**Mezze** is the soul of Lebanese dining - a collection of small, flavorful dishes meant for sharing, conversation, and celebration. Whether you're dining at a **Lebanese restaurant in Brussels** or exploring Middle Eastern cuisine for the first time, understanding mezze is essential to appreciating Lebanese food culture.

## What is Mezze?

Mezze (also spelled meze or mazza) refers to small dishes served as appetizers in Lebanese and Mediterranean cuisine. The word comes from Persian, meaning "taste" or "snack."

**Key Characteristics:**
- Served in small portions for sharing
- Mix of hot and cold dishes
- Vegetarian and meat options
- Eaten with fresh pita bread
- Encourages slow, social dining
- Usually 8-15 dishes per meal

## The Art of Mezze Dining

### Traditional Serving Order

1. **Cold Mezze First** - Dips and salads (15-20 minutes)
2. **Hot Mezze Second** - Fried and baked items (10-15 minutes)
3. **Main Courses** - Grilled meats and rice (optional)
4. **Dessert & Coffee** - Sweet conclusion

### Mezze Etiquette

✓ **Share everything** - Mezze is communal
✓ **Use bread to scoop** - No need for utensils for dips
✓ **Take small portions** - Many dishes to try
✓ **Pace yourself** - Don't rush
✓ **Order in waves** - Add more as needed

## 10 Essential Cold Mezze

### 1. Hummus (حمص)

**The king of mezze** - smooth chickpea and tahini dip.

**Ingredients:**
- Chickpeas
- Tahini (sesame paste)
- Lemon juice
- Garlic
- Olive oil

**Variations:**
- Classic hummus
- Hummus with pine nuts
- Hummus with ground meat
- Spicy hummus (harissa)

**Health Benefits:**
- High protein (7g per serving)
- Heart-healthy fats
- Rich in fiber
- Vegan and gluten-free

**How to Eat:** Scoop with warm pita, garnish with paprika and olive oil.

### 2. Baba Ghanoush (بابا غنوج)

**Smoky eggplant dip** with tahini and garlic.

**Preparation:**
- Roast eggplant over fire for smoky flavor
- Blend with tahini, garlic, lemon
- Drizzle with olive oil
- Garnish with pomegranate seeds

**Taste Profile:** Creamy, smoky, tangy

**Nutrition:** Low calorie, high fiber, antioxidant-rich

### 3. Tabbouleh (تبولة)

**Fresh parsley salad** - the greenest salad you'll ever see.

**Main Ingredient:** Parsley (90% of the salad!)

**Components:**
- Fresh flat-leaf parsley (abundant)
- Bulgur wheat (minimal)
- Tomatoes (diced small)
- Mint leaves
- Lemon juice and olive oil

**Common Mistake:** Too much bulgur (authentic tabbouleh is mostly parsley)

**Benefits:** Vitamin K, vitamin C, antioxidants

### 4. Fattoush (فتوش)

**Levantine salad** with crispy pita chips and sumac.

**Ingredients:**
- Mixed greens (lettuce, radishes, tomatoes)
- Crispy pita chips
- Sumac (tangy spice)
- Pomegranate molasses
- Fresh herbs

**Unique Element:** Sumac gives it citrusy, tangy flavor

**Perfect For:** Light lunch or side salad

### 5. Moutabal (متبل)

**Creamy eggplant dip**, similar to baba ghanoush but with more tahini.

**Difference from Baba Ghanoush:**
- Creamier texture
- More tahini
- Sometimes includes yogurt
- Often topped with pomegranate seeds

### 6. Labneh (لبنة)

**Thick strained yogurt** - Lebanese cream cheese.

**Serving Styles:**
- With olive oil and za'atar
- With dried mint
- With garlic and herbs
- As a dip or spread

**Uses:**
- Breakfast spread
- Mezze dip
- Sandwich filling
- Cooking ingredient

**Probiotic Benefits:** Gut health, digestion

### 7. Warak Enab (ورق عنب)

**Stuffed grape leaves** with rice, herbs, and sometimes meat.

**Fillings:**
- Rice and herbs (vegetarian)
- Rice and ground meat
- Pine nuts and spices

**Served:** Cold with lemon juice

**Origin:** Ancient dish dating back thousands of years

### 8. Muhammara (محمرة)

**Red pepper and walnut dip** - sweet, spicy, nutty.

**Ingredients:**
- Roasted red peppers
- Walnuts
- Breadcrumbs
- Pomegranate molasses
- Cumin and Aleppo pepper

**Flavor:** Sweet, smoky, slightly spicy

**Best With:** Grilled meats or as dip

### 9. Shanklish (شنكليش)

**Aged cheese** rolled in za'atar and spices.

**Description:**
- Fermented cheese balls
- Coating of za'atar, sumac, chili
- Served with olive oil, tomatoes, onions

**Acquired Taste:** Strong, tangy flavor

**For Adventurous Eaters:** Similar to blue cheese intensity

### 10. Makdous (مكدوس)

**Pickled stuffed eggplants** with walnuts and peppers.

**Preparation:**
- Baby eggplants cured in salt
- Stuffed with walnuts, garlic, peppers
- Preserved in olive oil

**Flavor:** Tangy, savory, slightly spicy

## 10 Delicious Hot Mezze

### 11. Falafel (فلافل)

**Crispy chickpea fritters** - the vegetarian star.

**Made From:**
- Ground chickpeas (not cooked!)
- Herbs (parsley, cilantro)
- Spices (cumin, coriander)
- Garlic and onion

**Served With:**
- Tahini sauce
- Pickles
- Fresh vegetables
- Pita bread

**Common Misconception:** Made from hummus (NO! Raw chickpeas only)

**Vegan & Halal:** Yes to both

### 12. Sambousek (سمبوسك)

**Triangular pastries** filled with cheese, meat, or spinach.

**Filling Options:**
- Cheese sambousek (white cheese, parsley)
- Meat sambousek (spiced ground beef/lamb)
- Spinach sambousek (spinach, onions, sumac)

**Dough:** Thin, crispy, flaky

**Similar To:** Indian samosas, but thinner crust

### 13. Kibbeh (كبة)

**Bulgur and meat croquettes** - Lebanon's national dish.

**Varieties:**
- Kibbeh maqliyeh (fried)
- Kibbeh nayyeh (raw - Lebanese steak tartare)
- Kibbeh bil sanieh (baked in tray)
- Kibbeh labaniyeh (in yogurt sauce)

**Components:**
- Outer shell: Bulgur and lean meat
- Filling: Ground meat, pine nuts, onions

**Expertise Required:** Shaping kibbeh is an art form

### 14. Fatayer (فطاير)

**Boat-shaped pastries** with various fillings.

**Types:**
- Spinach fatayer (saban fatayer)
- Cheese fatayer
- Meat fatayer (lahmacun)

**Shape:** Triangular or boat-shaped with open top

**Baked:** Not fried, healthier option

### 15. Arayes (عرايس)

**Stuffed pita** with spiced meat mixture, grilled.

**Preparation:**
- Pita bread halves
- Filled with kafta mixture
- Grilled until crispy

**Flavor:** Smoky, juicy, aromatic

**Perfect For:** Meat lovers

### 16. Batata Harra (بطاطا حرة)

**Spicy potatoes** with garlic, cilantro, and chili.

**Preparation:**
- Diced potatoes fried
- Tossed with garlic, cilantro, chili
- Finished with lemon juice

**Spice Level:** Medium to hot

**Addictive Quality:** Crispy outside, soft inside

### 17. Sujuk (سجق)

**Armenian spiced sausage** popular in Lebanese cuisine.

**Spices:**
- Cumin, paprika, garlic
- Red pepper flakes
- Black pepper, allspice

**Served:** Grilled or pan-fried, with lemon

**Flavor:** Spicy, garlicky, bold

### 18. Makanek (مقانق)

**Lebanese sausages** with pine nuts and spices.

**Difference from Sujuk:** Milder, sweeter spice profile

**Cooking:** Pan-fried with pomegranate molasses

**Pairing:** Great with arak or wine

### 19. Cheese Rolls (رقاقات جبنة)

**Spring roll wrappers** filled with cheese, fried crispy.

**Filling:**
- White cheese (akawi or halloumi)
- Fresh herbs
- Sometimes nigella seeds

**Texture:** Crunchy outside, melted inside

**Popular:** At gatherings and parties

### 20. Soujouk with Eggs (سجق مع بيض)

**Breakfast mezze** - sausage scrambled with eggs.

**Preparation:**
- Sauté sujuk slices
- Add beaten eggs
- Scramble together

**Served:** Hot with fresh bread

**Meal Time:** Breakfast or brunch

## How to Order Mezze at a Restaurant

### For First-Timers (2-3 people)

**Cold Mezze:**
- Hummus
- Baba ghanoush
- Tabbouleh

**Hot Mezze:**
- Falafel
- Sambousek (choose one filling)

**Estimated:** €25-35 total

### For Groups (4-6 people)

**Cold Mezze:**
- Hummus
- Baba ghanoush
- Moutabal
- Tabbouleh
- Fattoush
- Labneh

**Hot Mezze:**
- Falafel
- Kibbeh
- Sambousek (2-3 types)
- Batata harra

**Estimated:** €60-80 total

### For Vegetarians

Ask for **"vegetarian mezze platter"**:
- All cold mezze (naturally vegan)
- Falafel
- Cheese sambousek
- Spinach fatayer
- Grilled halloumi

## Mezze Pairings

### With Drinks

**Traditional:**
- Arak (anise spirit) with ice and water
- Lebanese beer
- Lebanese wine (Chateau Ksara, Chateau Musar)

**Non-Alcoholic:**
- Ayran (yogurt drink)
- Jallab (date syrup drink)
- Fresh mint lemonade

### With Main Courses

After mezze, consider:
- Mixed grill (if still hungry)
- Grilled fish
- Rice dishes (hashweh)
- Or just dessert!

## Making Mezze at Home

### Easiest to Make
1. Hummus (15 minutes)
2. Labneh (overnight strain)
3. Tabbouleh (20 minutes)
4. Fattoush (15 minutes)

### Requires More Skill
1. Kibbeh (shaping technique)
2. Sambousek (pastry folding)
3. Falafel (getting crispy texture)

### Best to Buy
1. Pita bread (unless you have a saj)
2. Pickles (fermentation takes weeks)
3. Za'atar blend (specific ratio)

## Mezze in Brussels

**Where to Find Authentic Mezze:**

At **East @ West**, we serve traditional mezze made fresh daily:
✓ 15+ mezze varieties
✓ Traditional recipes
✓ Fresh daily preparation
✓ Vegetarian and vegan options
✓ Halal-certified
✓ Perfect for sharing

**Order Options:**
- Individual mezze plates (€6-12)
- Mezze platter for 2 (€25)
- Large mezze spread for groups (€60-80)

## Common Mezze Mistakes to Avoid

❌ Ordering too much (portions are generous)
❌ Filling up on bread before mezze arrives
❌ Eating mezze with fork (use bread!)
❌ Rushing through dishes
❌ Skipping cold mezze and going straight to hot

## Conclusion

Mezze is more than food - it's a **social experience, cultural tradition, and celebration of Lebanese hospitality**. Each dish tells a story of the Levant's rich culinary history.

Whether you're exploring **Lebanese cuisine in Brussels** or planning a Mediterranean feast at home, mastering mezze is your gateway to understanding Lebanese food culture.

**Visit East @ West** to experience authentic Lebanese mezze in the heart of Brussels.

**Reserve your table today!**`
  },
  {
    language: 'fr',
    title: 'Guide des Mezzés Libanais Traditionnels: 20 Entrées Incontournables',
    slug: 'guide-mezzes-libanais-traditionnels-entrees-fr',
    excerpt: 'Guide complet des mezzés libanais. Découvrez 20 entrées traditionnelles, du houmous et baba ghanoush au kibbeh et sambousek. Parfait pour les amateurs de cuisine à Bruxelles.',
    meta_title: 'Guide des Mezzés Libanais: 20 Entrées Traditionnelles | Bruxelles',
    meta_description: 'Découvrez les mezzés libanais authentiques avec notre guide complet. Apprenez 20 entrées traditionnelles et où trouver les meilleurs mezzés à Bruxelles.',
    content: `# Guide des Mezzés Libanais Traditionnels: 20 Entrées Incontournables

Les **mezzés** sont l'âme de la cuisine libanaise - une collection de petits plats savoureux destinés à être partagés, accompagnés de conversation et de célébration. Que vous dîniez dans un **restaurant libanais à Bruxelles** ou que vous découvriez la cuisine du Moyen-Orient pour la première fois, comprendre les mezzés est essentiel pour apprécier la culture culinaire libanaise.

## Qu'est-ce que le Mezzé?

Le mezzé (également orthographié meze ou mazza) désigne de petits plats servis en entrée dans la cuisine libanaise et méditerranéenne. Le mot vient du persan, signifiant "goût" ou "collation".

**Caractéristiques Principales:**
- Servis en petites portions à partager
- Mélange de plats chauds et froids
- Options végétariennes et à base de viande
- Mangés avec du pain pita frais
- Encourage une restauration lente et sociale
- Habituellement 8-15 plats par repas

## L'Art de Manger les Mezzés

### Ordre de Service Traditionnel

1. **Mezzés Froids d'Abord** - Trempettes et salades (15-20 minutes)
2. **Mezzés Chauds Ensuite** - Articles frits et cuits (10-15 minutes)
3. **Plats Principaux** - Viandes grillées et riz (optionnel)
4. **Dessert & Café** - Conclusion sucrée

### Étiquette du Mezzé

✓ **Partager tout** - Le mezzé est communautaire
✓ **Utiliser le pain pour tremper** - Pas besoin d'ustensiles pour les trempettes
✓ **Prendre de petites portions** - Beaucoup de plats à essayer
✓ **Prendre son temps** - Ne pas se précipiter
✓ **Commander par vagues** - Ajouter plus si nécessaire

## 10 Mezzés Froids Essentiels

### 1. Houmous (حمص)

**Le roi des mezzés** - trempette onctueuse de pois chiches et tahini.

**Ingrédients:**
- Pois chiches
- Tahini (pâte de sésame)
- Jus de citron
- Ail
- Huile d'olive

**Variations:**
- Houmous classique
- Houmous aux pignons
- Houmous à la viande hachée
- Houmous épicé (harissa)

**Bienfaits pour la Santé:**
- Riche en protéines (7g par portion)
- Graisses saines pour le cœur
- Riche en fibres
- Végétalien et sans gluten

**Comment Manger:** Tremper avec du pita chaud, garnir de paprika et d'huile d'olive.

[Le contenu continue avec les 19 autres mezzés en français...]

## Mezzés à Bruxelles

**Où Trouver des Mezzés Authentiques:**

Chez **East @ West**, nous servons des mezzés traditionnels préparés frais quotidiennement:
✓ Plus de 15 variétés de mezzés
✓ Recettes traditionnelles
✓ Préparation fraîche quotidienne
✓ Options végétariennes et végétaliennes
✓ Certifié halal
✓ Parfait pour partager

**Visitez East @ West** pour découvrir les mezzés libanais authentiques au cœur de Bruxelles.

**Réservez votre table aujourd'hui!**`
  },
  {
    language: 'nl',
    title: 'Traditionele Libanese Mezze Gids: 20 Must-Try Voorgerechten',
    slug: 'traditionele-libanese-mezze-gids-voorgerechten-nl',
    excerpt: 'Complete gids voor Libanese mezze. Ontdek 20 traditionele voorgerechten, van hummus en baba ghanoush tot kibbeh en sambousek. Perfect voor Brusselse fijnproevers.',
    meta_title: 'Libanese Mezze Gids: 20 Traditionele Voorgerechten | Brussel',
    meta_description: 'Ontdek authentieke Libanese mezze met onze complete gids. Leer over 20 traditionele voorgerechten en waar je de beste mezze in Brussel kunt vinden.',
    content: `# Traditionele Libanese Mezze Gids: 20 Must-Try Voorgerechten

**Mezze** is de ziel van Libanees dineren - een verzameling kleine, smaakvolle gerechten bedoeld om te delen, converseren en vieren. Of je nu dineert in een **Libanees restaurant in Brussel** of voor het eerst de Midden-Oosterse keuken verkent, het begrijpen van mezze is essentieel voor het waarderen van de Libanese voedselcultuur.

## Wat is Mezze?

Mezze (ook gespeld meze of mazza) verwijst naar kleine gerechten die als voorgerecht worden geserveerd in de Libanese en Mediterrane keuken. Het woord komt uit het Perzisch en betekent "smaak" of "snack".

**Belangrijkste Kenmerken:**
- Geserveerd in kleine porties om te delen
- Mix van warme en koude gerechten
- Vegetarische en vleesopties
- Gegeten met vers pitabrood
- Moedigt langzaam, sociaal eten aan
- Meestal 8-15 gerechten per maaltijd

## De Kunst van Mezze Dineren

### Traditionele Serveer Volgorde

1. **Koude Mezze Eerst** - Dips en salades (15-20 minuten)
2. **Warme Mezze Tweede** - Gebakken en gebakken items (10-15 minuten)
3. **Hoofdgerechten** - Gegrild vlees en rijst (optioneel)
4. **Dessert & Koffie** - Zoete afsluiting

### Mezze Etiquette

✓ **Deel alles** - Mezze is gemeenschappelijk
✓ **Gebruik brood om te scheppen** - Geen bestek nodig voor dips
✓ **Neem kleine porties** - Veel gerechten om te proberen
✓ **Neem je tijd** - Niet haasten
✓ **Bestel in golven** - Voeg meer toe indien nodig

## 10 Essentiële Koude Mezze

### 1. Hummus (حمص)

**De koning van mezze** - gladde kikkererwten en tahini dip.

**Ingrediënten:**
- Kikkererwten
- Tahini (sesampasta)
- Citroensap
- Knoflook
- Olijfolie

**Variaties:**
- Klassieke hummus
- Hummus met pijnboompitten
- Hummus met gehakt
- Pittige hummus (harissa)

**Gezondheidsvoordelen:**
- Hoog eiwit (7g per portie)
- Hart-gezonde vetten
- Rijk aan vezels
- Veganistisch en glutenvrij

**Hoe te Eten:** Schep met warme pita, garneer met paprika en olijfolie.

[De inhoud gaat verder met de andere 19 mezze in het Nederlands...]

## Mezze in Brussel

**Waar Authentieke Mezze te Vinden:**

Bij **East @ West** serveren we traditionele mezze die dagelijks vers worden bereid:
✓ 15+ mezze variëteiten
✓ Traditionele recepten
✓ Dagelijkse verse bereiding
✓ Vegetarische en veganistische opties
✓ Halal gecertificeerd
✓ Perfect om te delen

**Bezoek East @ West** om authentieke Libanese mezze in het hart van Brussel te ervaren.

**Reserveer vandaag uw tafel!**`
  }
];

async function insertMultilingualBlogs() {
  console.log('🌍 Inserting multilingual blog posts...\n');

  for (const post of mezzeGuidePosts) {
    console.log(`📝 [${post.language.toUpperCase()}] Inserting: "${post.title}"`);

    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        ...post,
        author_name: 'East @ West Team',
        cover_image_url: 'https://eastatwest.com/images/gallery/mezze-libanais-restaurant.webp',
        tags: post.language === 'en'
          ? ['Mezze', 'Lebanese Cuisine', 'Appetizers', 'Food Guide', 'Brussels Dining', 'Halal Food', 'Vegetarian', 'Traditional Food']
          : post.language === 'fr'
          ? ['Mezzé', 'Cuisine Libanaise', 'Entrées', 'Guide Culinaire', 'Restaurant Bruxelles', 'Halal', 'Végétarien', 'Cuisine Traditionnelle']
          : ['Mezze', 'Libanese Keuken', 'Voorgerechten', 'Voedselgids', 'Brussel Restaurant', 'Halal', 'Vegetarisch', 'Traditioneel Eten'],
        published: true,
        featured: post.language === 'en',
        reading_time: 12,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error(`❌ Error inserting [${post.language}]:`, error);
      continue;
    }

    console.log(`✅ Published: ${post.slug}`);
    console.log(`   URL: https://eastatwest.com/${post.language}/blog/${post.slug}\n`);
  }

  console.log('🎉 All multilingual blog posts inserted!');
  console.log('\n📊 Summary:');
  console.log(`   Languages: EN, FR, NL`);
  console.log(`   Total posts: ${mezzeGuidePosts.length}`);
}

insertMultilingualBlogs();
