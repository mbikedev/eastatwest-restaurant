import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const bestRestaurantsNL = {
  title: "Beste Libanese Restaurants in Brussel: Volledige Gids 2025",
  slug: "beste-libanese-restaurants-brussel-gids-2025",
  excerpt: "Ontdek de beste Libanese restaurants van Brussel in 2025. Complete gids van authentieke adressen, halal specialiteiten, vegetarische opties en mediterrane culinaire ervaringen.",
  meta_title: "Beste Libanese Restaurants Brussel 2025 | Volledige Gids",
  meta_description: "Gids 2025 van de beste Libanese restaurants in Brussel. Authentieke keuken, traditionele mezze, halal en vegetarische opties. Reserveer uw tafel!",
  language: "nl",
  tags: ["Libanese Restaurants", "Brussel", "Libanese Keuken", "Halal", "Vegetarisch", "Restaurant Gids", "Mezze"],
  author_name: "East @ West Team",
  cover_image_url: "/images/gallery/set-libanais.webp",
  published: true,
  featured: true,
  reading_time: 12,
  content: `# Beste Libanese Restaurants in Brussel: Volledige Gids 2025

Brussel is een culinaire hotspot geworden voor **authentieke Libanese keuken**, met talrijke restaurants die alles aanbieden van traditionele mezze tot moderne fusion gerechten. Of u nu zin heeft in **halal eten**, vegetarische opties of een romantisch diner met mediterrane smaken, deze uitgebreide gids helpt u de beste Libanese eetervaring te vinden in de Belgische hoofdstad.

## Waarom Brussel Dol is op Libanese Keuken

De Libanese gemeenschap in Brussel heeft het culinaire landschap van de stad verrijkt met authentieke smaken uit het Midden-Oosten. Libanese keuken is populair geworden om verschillende redenen:

**Redenen voor Populariteit:**
- **Verse ingrediënten** - Kwaliteitsgroenten, kruiden en olijfolie
- **Gezonde opties** - Voedzaam mediterraan dieet
- **Delen en gezelligheid** - Mezze-cultuur voor sociale maaltijden
- **Diversiteit** - Opties voor vegetariërs, veganisten en vleeseters
- **Halal certificering** - Voldoet aan de behoeften van de moslimgemeenschap
- **Evenwichtige smaken** - Niet te pikant, niet te flauw

## Top 5 Libanese Restaurants in Brussel

### 1. East @ West - Libanese Culinaire Excellentie

**Locatie:** Keizerslaan 26, 1000 Brussel

**Specialiteiten:**
- Authentieke traditionele mezze (15+ variëteiten)
- Gegrilde halal vlees
- Vegetarische en veganistische gerechten
- Huisgemaakte Libanese desserts

**Hoogtepunten:**
✓ Volledige halal certificering
✓ Dagelijks verse ingrediënten
✓ Elegante en warme sfeer
✓ Service in Frans, Nederlands en Engels
✓ Catering opties voor evenementen
✓ Erkend door Restaurant Guru (2021-2024)

**Prijsklasse:** €€ (Hoofdgerecht 15-25€)

**Beste Voor:** Gezinnen, groepen, speciale gelegenheden, zakelijke diners

**Must-Try Gerechten:**
- East @ West mezze plateau (voor 2 personen)
- Mixed grill spiesjes (kafta, chich taouk, lam)
- Huisgemaakte kibbeh
- Hummus met pijnboompitten
- Aish el Saraya (dessert)

**Openingstijden:**
- Dinsdag-Zondag: 12:00-15:00, 18:00-23:00
- Gesloten op maandag

**Reservering:** Sterk aanbevolen (website of telefoon)

### 2. Stadscentrum Libanees Restaurant

**Sfeer:**
Familievriendelijke ambiance met traditionele oosterse decoratie, perfect om de Libanese keuken te ontdekken in een authentiek kader.

**Specialiteiten:**
- Warme en koude mezze
- Houtskool grill
- Deel plateaus
- Libanese wijnen

**Hoogtepunten:**
✓ Centrale locatie
✓ Terras in de zomer
✓ Betaalbaar lunch menu
✓ Royale porties

**Prijsklasse:** €-€€ (Hoofdgerecht 12-20€)

### 3. Moderne Libanese Keuken

**Concept:**
Hedendaagse fusie van traditionele Libanese smaken met moderne kooktechnieken.

**Menu Highlights:**
- Deconstructed mezze
- Gourmet kibbeh variaties
- Innovatieve desserts
- Craft cocktails met Libanese twist

**Beste Voor:** Foodies, date night, culinaire avonturiers

**Prijsklasse:** €€-€€€ (Hoofdgerecht 18-30€)

### 4. Authentiek Familiebedrijf

**Verhaal:**
Derde generatie familie restaurant gespecialiseerd in traditionele recepten uit Beiroet en de Beqaa vallei.

**Authentieke Gerechten:**
- Warak enab (gevulde wijnbladeren)
- Fattoush salade
- Taouk marinades volgens grootmoeder's recept
- Traditionele kanafeh

**Sfeer:** Huiselijk, warm, authentiek

**Prijsklasse:** € (Hoofdgerecht 10-18€)

### 5. Luxe Libanees Eetcafé

**Ervaring:**
Upscale dining met verfijnde presentatie en premium ingrediënten.

**Onderscheidende Kenmerken:**
- Sommelier met focus op Libanese wijnen
- Chef's tasting menu
- Privé dining ruimtes
- Cocktail bar

**Beste Voor:** Zakelijk, jubilea, speciale vieringen

**Prijsklasse:** €€€ (Hoofdgerecht 25-40€)

## Wat te Bestellen: Essentiële Libanese Gerechten

### Moet-Proberen Mezze (Voorgerechten)

**Koude Mezze:**
- **Hummus** - Kikkererwten dip met tahini en olijfolie
- **Baba Ghanoush** - Geroosterde aubergine dip
- **Tabbouleh** - Peterselie salade met bulgur
- **Fattoush** - Levantijnse salade met pita chips
- **Labneh** - Gezeefde yoghurt met olijfolie
- **Muhammara** - Rode paprika en walnoten dip

**Warme Mezze:**
- **Falafel** - Krokante kikkererwten balletjes
- **Sambousek** - Driehoekige gebakjes (kaas, vlees, spinazie)
- **Kibbeh** - Bulgur en vlees croquetten
- **Batata Harra** - Pittige aardappelen
- **Halloumi Gegrild** - Gegrilde Cypriotische kaas
- **Arayes** - Gevulde pita met gekruid vlees

### Hoofdgerechten

**Grill Specialiteiten:**
- **Mixed Grill** - Combinatie van lam, kip, kafta
- **Chich Taouk** - Gekruide kip spiesjes
- **Kafta** - Gekruid gehakt spiesjes
- **Lamb Chops** - Gegrilde lamskoteletjes

**Traditionele Schotels:**
- **Shawarma** - Draaispit vlees in pita
- **Kibbeh Bil Sanieh** - Gebakken bulgur en vlees taart
- **Makloubeh** - "Ondersteboven" rijst schotel
- **Moussaka** - Aubergine en gehakt ovenschotel

**Vegetarische Opties:**
- **Loubieh Bil Zeit** - Groene bonen in tomatensaus
- **Batinjan Mehchi** - Gevulde aubergines
- **Moudardara** - Linzen en rijst met crispy uien

### Desserts

- **Baklava** - Gelaagd bladerdeegebak met noten
- **Kanafeh** - Kaas dessert met kadayif deeg
- **Aish el Saraya** - Bread pudding met room
- **Maamoul** - Dadel gevulde koekjes
- **Halawet el Jibn** - Zoete kaas broodjes

## Prijsklassen & Budgettering

### Budget Vriendelijk (€10-15 per persoon)
- Falafel wrap + frisdrank
- Lunch menu deals
- Mezze platter voor delen
- Takeaway opties

### Mid-Range (€20-30 per persoon)
- 3-4 mezze + hoofdgerecht
- Mixed grill + bijgerechten
- Wijn/bier inbegrepen
- Dessert

### Premium Ervaring (€40-60 per persoon)
- Uitgebreide mezze spread
- Premium grill selecties
- Libanese wijn pairing
- Meerdere gangen

## Halal Certificering & Dieet Opties

### Halal Restaurants in Brussel

Veel Libanese restaurants in Brussel bieden **100% halal gecertificeerd vlees**. Belangrijke punten:

**Volledig Halal Restaurants:**
- East @ West (volledige halal certificering)
- Meerdere familiebedrijven
- Vraag altijd naar certificering bij twijfel

**Wat "Halal" betekent:**
- Vlees geslacht volgens islamitische richtlijnen
- Geen varkensvlees of alcohol in bereiding
- Gescheiden keukengerei en voorbereidingsruimtes

### Vegetarische & Veganistische Opties

Libanese keuken is **natuurlijk vegetarisch vriendelijk**:

**Volledig Vegetarisch/Veganistisch:**
- Meeste koude mezze (hummus, baba ghanoush, tabbouleh)
- Falafel
- Groenten grill
- Salades en bijgerechten

**Tip:** Vraag naar "vegetarian mezze platter" voor diverse selectie.

## Reservering Tips & Beste Tijden

### Wanneer te Reserveren

**Reservering Verplicht:**
- Weekend diners (vrijdag-zaterdag avonden)
- Feestdagen en speciale gelegenheden
- Grote groepen (6+ personen)

**Walk-Ins Mogelijk:**
- Weekdag lunches
- Vroege avond (voor 19:00)
- Maandag-Woensdag diners

### Beste Tijden voor Bezoek

**Minder Druk:**
- Maandag-Dinsdag avonden
- Vroege lunch (12:00-13:00)
- Vroege diner (18:00-19:30)

**Levendige Sfeer:**
- Vrijdag-Zaterdag avonden (20:00-22:00)
- Zondag lunches (familie tijd)

## Libanese Eetgewoonten & Etiquette

### Hoe te Eten zoals een Libanees

**Mezze Etiquette:**
- Deel alles - mezze is gemeenschappelijk
- Gebruik vers pita brood om te scheppen
- Neem kleine porties - veel gerechten te proberen
- Neem je tijd - geen haast

**Broodgebruik:**
- Libanese pita (khubz) is je bestek
- Scheur kleine stukjes af
- Gebruik om dips te scheppen
- Wrap rond gegrild vlees

**Sociale Aspecten:**
- Maaltijden zijn sociale gebeurtenissen
- Verwacht langzaam dineren (1.5-2 uur)
- Conversatie is net zo belangrijk als eten
- Familie stijl delen is de norm

## Seizoensspecialiteiten & Feestdagen

### Ramadan Specials

Tijdens Ramadan (islamitische vastenmaand) bieden veel restaurants:
- Iftar buffetten (avond maaltijd om vasten te breken)
- Speciale Ramadan menu's
- Late avond openingstijden
- Traditionele Ramadan gerechten

### Zomer Menu's

**Lichte Zomer Gerechten:**
- Meer koude mezze
- Gegrilde vis
- Frisse salades
- Ijskoude ayran (yoghurt drank)

### Winter Comfort Food

**Hartige Winter Opties:**
- Warme stoofschotels
- Rijke lamsstoofpotten
- Fattet gerechten (brood, rijst, yoghurt lagen)
- Warme thee en noten

## Takeaway & Bezorg Opties

### Beste Gerechten voor Takeaway

**Reist Goed:**
- Shawarma wraps
- Falafel sandwiches
- Mixed grill (in containers)
- Mezze combo's

**Vermijd voor Takeaway:**
- Zeer knapperige gerechten (direct eten)
- Delicate salades (dressing apart vragen)

### Bezorg Platforms

- Deliveroo
- Uber Eats
- Takeaway.com
- Direct restaurant bezorging

## Groep Dineren & Speciale Gelegenheden

### Groep Menu Suggesties

**Voor 4-6 Personen:**
- 8-10 mezze gerechten (mix koud/warm)
- 2-3 mixed grill plateaus
- 2-3 bijgerechten (rijst, salade)
- Dessert platter

**Geschatte Kosten:** €30-40 per persoon

### Privé Evenementen & Catering

Veel Libanese restaurants bieden:
- Privé dining ruimtes
- Catering voor evenementen (bruiloften, bedrijf)
- Aangepaste menu's
- Party plateaus voor thuisbezorging

**East @ West Catering:**
- Vanaf 10 personen
- Volledige menu aanpassing
- Bezorging en setup beschikbaar

## Kinderen & Familie Vriendelijkheid

### Kid-Friendly Gerechten

**Kinderen Houden Van:**
- Falafel (krispy kipnuggets alternatief)
- Chicken taouk (mild gekruide kip)
- Plain hummus met pita
- Grilled halloumi sticks
- Rijst en yoghurt

**High Chairs & Voorzieningen:**
- Meeste restaurants hebben kinderstoelen
- Vraag naar kinderporties
- Familie vriendelijke sfeer

## Drank Pairings

### Traditionele Dranken

**Alcoholvrij:**
- **Ayran** - Gezouten yoghurt drank
- **Jallab** - Dadel siroop drank
- **Vers Sap** - Granaatappel, sinaasappel
- **Munt Limonade** - Verfrissend en zoet

**Alcoholisch:**
- **Arak** - Anijs alcohol (Libanees nationaal drank)
- **Libanese Wijn** - Chateau Ksara, Chateau Musar
- **Almaza Bier** - Libanees lager bier

### Wijn Pairing Tips

**Rode Wijn:**
- Gaat goed met gegrild rood vlees
- Lam kebabs
- Krachtige stoofschotels

**Witte Wijn:**
- Perfect bij zeevruchten
- Gegrilde kip
- Koude mezze

**Rosé:**
- Veelzijdig - past bij de meeste gerechten
- Ideaal voor gemengde mezze
- Populaire zomer keuze

## Locatie Overzicht: Libanese Restaurants per Buurt

### Centrum (1000)
- Hoogste concentratie restaurants
- Mix van budget tot premium
- Gemakkelijke bereikbaarheid met metro
- Veel toeristen en locals

### Ixelles (1050)
- Trendy, moderne restaurants
- Studenten vriendelijke prijzen
- Levendige avond sfeer

### Schaarbeek (1030)
- Authentieke familie restaurants
- Grotere Midden-Oosten gemeenschap
- Betaalbare opties

### Etterbeek (1040)
- Dicht bij EU instellingen
- Zakelijke lunch opties
- Internationale crowd

## Hoe te Komen: Transport Tips

### Met Metro
- **Station Beurs/Bourse** - Meeste centrale restaurants
- **Station De Brouckère** - Walking distance naar top restaurants
- **Station Porte de Namur** - Ixelles restaurants

### Met Bus/Tram
- Tram 3, 4, 32 - Centrum routes
- Bus 71 - Schaarbeek gebied

### Parkeren
- Meeste restaurants hebben GEEN eigen parking
- Gebruik publieke parkeergarages:
  - Parking Grand Place
  - Parking Alhambra
  - Parking Monnaie

## Seizoens Gids

### Lente (Maart-Mei)
- **Beste Voor:** Verse kruiden gerechten (tabbouleh, fattoush)
- **Specials:** Jonge lam gerechten
- **Sfeer:** Terrassen beginnen te openen

### Zomer (Juni-Augustus)
- **Beste Voor:** Gegrild eten, koude mezze
- **Specials:** Zeevruchten specials
- **Sfeer:** Outdoor dining, levendig

### Herfst (September-November)
- **Beste Voor:** Stoofschotels, warme mezze
- **Specials:** Comfort food menu's
- **Sfeer:** Gezellig binnen dineren

### Winter (December-Februari)
- **Beste Voor:** Warme soepen, hartige gerechten
- **Specials:** Nieuwjaar feest menu's
- **Sfeer:** Intieme, warm verlichte interieurs

## Conclusie: Uw Libanese Culinaire Avontuur in Brussel

Brussel's Libanese restaurant scene biedt iets voor iedereen - van **authentieke familie recepten** tot **moderne culinaire interpretaties**. Of u nu een halal optie zoekt, vegetarisch bent, of gewoon nieuwe smaken wilt ontdekken, de Libanese keuken verwelkomt u met open armen.

**Belangrijkste Punten:**
✓ Reserveer vooraf voor weekend diners
✓ Begin met mezze platter om verschillende smaken te ontdekken
✓ Vraag naar halal certificering als dat belangrijk is
✓ Neem je tijd - Libanese maaltijden zijn sociale ervaringen
✓ Deel met vrienden en familie voor de beste ervaring

**Begin uw reis bij East @ West**, waar traditionele Libanese gastvrijheid moderne culinaire excellentie ontmoet in het hart van Brussel.

**Reserveer vandaag uw tafel!**

## Nuttige Woordenschat

**Basis Libanese Voedsel Termen:**
- **Mezze** - Voorgerechten/kleine gerechten
- **Kafta** - Gekruid gehakt
- **Taouk** - Gemarineerde kip
- **Lahem** - Vlees
- **Samak** - Vis
- **Khodra** - Groenten
- **Khubz** - Brood
- **Helou** - Dessert/zoet

**In Restaurant:**
- **Sahtein** - Eet smakelijk!
- **Shukran** - Dank u
- **Bil afieh** - Gezondheid (gezegd bij eten)

---

**East @ West Restaurant**
Keizerslaan 26, 1000 Brussel
Tel: +32 2 503 53 03
Website: www.eastatwest.com
Email: infos.east.west@gmail.com

**Reserveer Nu!**`
};

async function insertBestRestaurantsBrusselsNL() {
  console.log('🇳🇱 Inserting Dutch translation: Best Lebanese Restaurants Brussels...\n');

  const blogPost = {
    ...bestRestaurantsNL,
    published_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('blogs')
    .insert([blogPost])
    .select();

  if (error) {
    console.error('❌ Error inserting Dutch Best Restaurants Brussels:', error);
    process.exit(1);
  } else {
    console.log('✅ Successfully inserted: Beste Libanese Restaurants in Brussel (NL)');
    console.log(`   Slug: ${data[0].slug}`);
    console.log(`   Language: ${data[0].language}`);
    console.log(`   Featured: ${data[0].featured}`);
    console.log(`   Reading time: ${data[0].reading_time} minutes`);
  }

  console.log('\n✅ Week 2 translation completed!');
  console.log('\n📋 Translation Progress:');
  console.log('  ✅ Week 1: French Mezze Guide');
  console.log('  ✅ Week 1: French Best Restaurants Brussels');
  console.log('  ✅ Week 2: Dutch Best Restaurants Brussels');
  console.log('  ⏳ Week 3: French Lebanese Cuisine Guide (pending)');
  console.log('  ⏳ Week 4: Dutch Lebanese Cuisine Guide (pending)');
  console.log('  ⏳ Week 5: French Mediterranean Diet (pending)');
  console.log('  ⏳ Week 6: Dutch Mediterranean Diet (pending)');
}

insertBestRestaurantsBrusselsNL();
