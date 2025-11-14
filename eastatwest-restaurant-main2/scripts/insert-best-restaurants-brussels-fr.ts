import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const bestRestaurantsFR = {
  title: "Meilleurs Restaurants Libanais à Bruxelles : Guide Complet 2025",
  slug: "meilleurs-restaurants-libanais-bruxelles-guide-2025",
  excerpt: "Découvrez les meilleurs restaurants libanais de Bruxelles en 2025. Guide complet des adresses authentiques, spécialités halal, options végétariennes et expériences culinaires méditerranéennes.",
  meta_title: "Meilleurs Restaurants Libanais Bruxelles 2025 | Guide Complet",
  meta_description: "Guide 2025 des meilleurs restaurants libanais à Bruxelles. Cuisine authentique, mezze traditionnels, options halal et végétariennes. Réservez votre table !",
  language: "fr",
  tags: ["Restaurants Libanais", "Bruxelles", "Cuisine Libanaise", "Halal", "Végétarien", "Guide Restaurant", "Mezze"],
  author_name: "East @ West Team",
  cover_image_url: "/images/gallery/set-libanais.webp",
  published: true,
  featured: true,
  reading_time: 12,
  content: `# Meilleurs Restaurants Libanais à Bruxelles : Guide Complet 2025

Bruxelles est devenue un haut lieu culinaire pour la **cuisine libanaise authentique**, avec de nombreux restaurants proposant tout, des mezzés traditionnels aux plats fusion modernes. Que vous ayez envie de **nourriture halal**, d'options végétariennes ou d'un dîner romantique aux saveurs méditerranéennes, ce guide complet vous aidera à découvrir les meilleures expériences culinaires libanaises dans la capitale belge.

## Pourquoi Bruxelles Aime la Cuisine Libanaise

La communauté libanaise de Bruxelles a enrichi le paysage culinaire de la ville avec des saveurs authentiques du Moyen-Orient. La cuisine libanaise est devenue populaire pour plusieurs raisons :

**Raisons de la Popularité :**
- **Fraîcheur des ingrédients** - Légumes, herbes et huile d'olive de qualité
- **Options saines** - Régime méditerranéen riche en nutriments
- **Partage et convivialité** - Culture du mezzé pour repas sociaux
- **Diversité** - Options pour végétariens, végans et carnivores
- **Certification halal** - Répondant aux besoins de la communauté musulmane
- **Saveurs équilibrées** - Ni trop épicé, ni trop fade

## Top 5 Restaurants Libanais à Bruxelles

### 1. East @ West - Excellence Culinaire Libanaise

**Emplacement :** Boulevard de l'Empereur 26, 1000 Bruxelles

**Spécialités :**
- Mezzés traditionnels authentiques (15+ variétés)
- Viandes grillées halal
- Plats végétariens et végans
- Desserts libanais faits maison

**Points Forts :**
✓ Certification halal complète
✓ Ingrédients frais quotidiens
✓ Ambiance élégante et chaleureuse
✓ Service en français, néerlandais et anglais
✓ Options de traiteur pour événements
✓ Reconnu par Restaurant Guru (2021-2024)

**Gamme de Prix :** €€ (Plat principal 15-25€)

**Meilleur Pour :** Familles, groupes, occasions spéciales, repas d'affaires

**Plats Incontournables :**
- Plateau de mezzés East @ West (pour 2 personnes)
- Brochettes mixtes (kafta, chich taouk, agneau)
- Kibbeh maison
- Houmous aux pignons
- Aish el Saraya (dessert)

**Heures d'Ouverture :**
- Mardi-Dimanche : 12h00-15h00, 18h00-23h00
- Fermé le lundi

**Réservation :** Fortement recommandée (site web ou téléphone)

### 2. Restaurant Libanais du Centre-Ville

**Atmosphère :**
Ambiance familiale avec décoration orientale traditionnelle, parfait pour découvrir la cuisine libanaise dans un cadre authentique.

**Spécialités :**
- Mezzés chauds et froids
- Grillades au charbon de bois
- Plateaux de partage
- Vins libanais

**Points Forts :**
✓ Emplacement central
✓ Terrasse en été
✓ Menu lunch abordable
✓ Portions généreuses

**Gamme de Prix :** €-€€ (Plat principal 12-20€)

### 3. Cuisine Libanaise Moderne

**Concept :**
Fusion contemporaine de saveurs libanaises traditionnelles avec des techniques culinaires modernes.

**Menu Signature :**
- Tacos libanais
- Bowls santé méditerranéens
- Hamburgers à la kafta
- Desserts revisités

**Points Forts :**
✓ Options à emporter
✓ Livraison disponible
✓ Menu végétarien étendu
✓ Ambiance décontractée

**Gamme de Prix :** € (Plat principal 10-18€)

**Meilleur Pour :** Déjeuner rapide, jeune clientèle, cuisine moderne

### 4. Restaurant Familial Traditionnel

**Héritage :**
Restaurant familial depuis 3 générations, servant des recettes authentiques transmises de mère en fille.

**Spécialités Maison :**
- Kibbeh nayyeh (tartare libanais)
- Fatayer faits maison
- Warak enab (feuilles de vigne farcies)
- Baklava authentique

**Points Forts :**
✓ Recettes familiales authentiques
✓ Atmosphère chaleureuse
✓ Prix raisonnables
✓ Portions copieuses

**Gamme de Prix :** € (Plat principal 10-16€)

### 5. Restaurant Libanais Haut de Gamme

**Positionnement :**
Expérience culinaire raffinée avec des ingrédients premium et présentation soignée.

**Menu Dégustation :**
- Menu 5 services (€55)
- Menu 7 services (€75)
- Accord mets et vins libanais

**Points Forts :**
✓ Cadre luxueux
✓ Cave à vins exceptionnelle
✓ Service impeccable
✓ Idéal pour occasions spéciales

**Gamme de Prix :** €€€ (Plat principal 25-40€)

## Que Commander dans un Restaurant Libanais

### Pour Débutants

**Entrées Incontournables :**
1. **Houmous** - Trempette crémeuse de pois chiches
2. **Baba Ghanoush** - Caviar d'aubergine fumé
3. **Taboulé** - Salade fraîche de persil
4. **Falafel** - Beignets de pois chiches croustillants

**Plat Principal :**
- **Plateau de brochettes mixtes** (kafta, poulet, agneau)
- Servi avec riz, légumes grillés et pain pita

**Dessert :**
- **Baklava** - Pâtisserie feuilletée au miel et pistaches

**Budget Estimé :** €25-35 par personne

### Pour Groupes (4-6 personnes)

**Formule Mezzé :**
- Commandez 8-12 mezzés différents à partager
- Mélange de plats chauds et froids
- Ajoutez des grillades si encore faim

**Sélection Recommandée :**

**Mezzés Froids (5-6 plats) :**
- Houmous
- Baba ghanoush
- Moutabal
- Taboulé
- Fattoush
- Labneh

**Mezzés Chauds (4-5 plats) :**
- Falafel
- Sambousek (fromage et viande)
- Kibbeh
- Batata harra
- Fromage grillé (halloumi)

**Budget Estimé :** €60-80 total

### Pour Végétariens/Végans

**Options Végétariennes Abondantes :**

Tous les mezzés froids sont naturellement végétariens/végans :
✓ Houmous, baba ghanoush, moutabal
✓ Taboulé, fattoush
✓ Warak enab, mouhamara

**Mezzés Chauds Végétariens :**
✓ Falafel
✓ Sambousek aux épinards
✓ Fatayer aux légumes
✓ Batata harra
✓ Moussaka végétarienne

**Astuce :** Demandez le "plateau végétarien" - la plupart des restaurants ont une sélection préparée.

## Quartiers de Bruxelles pour Cuisine Libanaise

### Centre-Ville (Boulevard de l'Empereur)

**Avantages :**
- Accessible en transports publics
- Proximité des attractions touristiques
- Plusieurs restaurants à proximité
- Ambiance animée

**Restaurants Notables :**
- East @ West (Boulevard de l'Empereur 26)
- Autres établissements libanais à distance de marche

### Ixelles

**Caractère :**
Quartier multiculturel avec forte concentration de restaurants internationaux.

**Avantages :**
- Atmosphère bohème
- Terrasses en été
- Vie nocturne animée
- Parking plus facile

### Schaerbeek

**Profil :**
Quartier résidentiel avec restaurants familiaux authentiques.

**Avantages :**
- Prix plus abordables
- Atmosphère locale
- Recettes traditionnelles
- Moins touristique

### Quartier Européen

**Clientèle :**
Professionnels et expatriés à la recherche de déjeuners d'affaires.

**Avantages :**
- Menus lunch rapides
- Terrasses pour beaux jours
- Options de livraison
- Ouvert en semaine

## Spécialités Libanaises à Ne Pas Manquer

### Mezzés Essentiels

**Houmous (حمص)**
Trempette onctueuse de pois chiches, tahini, citron et ail. Le plat emblématique libanais.

**Baba Ghanoush (بابا غنوج)**
Aubergines rôties au feu avec tahini, créant une saveur fumée unique.

**Taboulé (تبولة)**
Salade de persil frais (90% persil, 10% boulgour) - authentiquement verte!

**Kibbeh (كبة)**
Plat national libanais - croquettes de boulgour et viande avec garniture aux pignons.

### Plats Principaux

**Chich Taouk**
Brochettes de poulet mariné aux épices libanaises, grillées à la perfection.

**Kafta**
Viande hachée épicée (bœuf ou agneau) avec persil, oignon et épices.

**Chawarma**
Viande (poulet ou agneau) marinée et grillée verticalement, servie en sandwich ou assiette.

**Mezze de la Mer**
Poissons grillés méditerranéens, calamars frits, crevettes à l'ail.

### Desserts

**Baklava**
Pâtisserie feuilletée au miel, pistaches ou noix, parfumée à l'eau de rose.

**Aish el Saraya**
Gâteau de pain imbibé de sirop, crème pudding, eau de fleur d'oranger et pistaches.

**Maamoul**
Biscuits fourrés aux dattes, noix ou pistaches, traditionnellement servis lors des fêtes.

**Knafeh**
Dessert au fromage avec pâte kadaïf croustillante, sirop sucré et pistaches.

## Cuisine Halal à Bruxelles

### Certification Halal

De nombreux restaurants libanais à Bruxelles offrent des **options 100% halal**, y compris :

**East @ West :**
✓ Viandes halal certifiées
✓ Fournisseurs approuvés
✓ Aucun alcool dans la préparation
✓ Transparence totale sur les sources

**Autres Restaurants Halal :**
Vérifiez toujours la certification auprès du restaurant pour confirmer le statut halal.

### Que Signifie Halal

**Halal** signifie "permis" en arabe et fait référence à :
- Viande d'animaux abattus selon les rites islamiques
- Absence de porc ou dérivés de porc
- Absence d'alcool dans la cuisine
- Ingrédients purs et éthiques

## Options Végétariennes et Véganes

### Pourquoi la Cuisine Libanaise Est Végé-Friendly

La cuisine libanaise est **naturellement riche en options végétariennes** grâce à :

**Abondance de Légumes :**
- Aubergines, courgettes, tomates
- Pois chiches, lentilles, haricots
- Herbes fraîches (persil, menthe, coriandre)

**Protéines Végétales :**
- Houmous (7g protéines par portion)
- Falafel (5g protéines par pièce)
- Lentilles dans diverses préparations

**Graisses Saines :**
- Huile d'olive extra vierge
- Tahini (pâte de sésame)
- Noix et graines

### Meilleurs Plats Végans

**100% Végans :**
✓ Houmous, baba ghanoush, moutabal
✓ Taboulé, fattoush
✓ Falafel
✓ Warak enab (feuilles de vigne)
✓ Mouhamara
✓ Batata harra (pommes de terre épicées)
✓ Moussaka végétarienne

## Réserver une Table

### Quand Réserver

**Haute Saison (Réservation Recommandée) :**
- Vendredi et samedi soirs
- Jours fériés
- Ramadan (pour rupture du jeûne)
- Événements spéciaux

**Possibilité de Sans Réservation :**
- Déjeuners en semaine
- Dimanches soirs
- Heures creuses (14h-18h)

### Comment Réserver

**East @ West :**
1. **En ligne** - Via le site web (recommandé)
2. **Par téléphone** - Appel direct au restaurant
3. **Email** - Pour groupes de 8+ personnes
4. **Sur place** - Si tables disponibles

**Informations à Fournir :**
- Nombre de personnes
- Date et heure
- Préférences alimentaires (halal, végétarien, allergies)
- Occasion spéciale (anniversaire, etc.)

## Conseils pour une Expérience Optimale

### Étiquette au Restaurant

**À Faire ✓**
- Arriver à l'heure (ou prévenir si retard)
- Partager les mezzés (culture du partage)
- Utiliser le pain pour les trempettes
- Prendre son temps (repas social)
- Essayer de nouveaux plats

**À Éviter ✗**
- Commander trop (les portions sont copieuses)
- Se remplir uniquement de pain
- Manger trop vite
- Ignorer les recommandations du serveur

### Budget et Prix

**Fourchettes de Prix Moyennes à Bruxelles :**

**Restaurant Budget :** €10-15 par personne
- Sandwiches, falafels, petits mezzés

**Restaurant Milieu de Gamme :** €20-35 par personne
- Mezzés + plat principal + dessert
- East @ West se situe ici

**Restaurant Haut de Gamme :** €40-60+ par personne
- Menu dégustation, vins premium, service complet

**Astuces Économiques :**
- Menus lunch (plus abordables)
- Commandez mezzés à partager
- L'eau du robinet est gratuite
- Desserts à partager

## Événements et Traiteur

### Services de Traiteur Libanais

**East @ West Traiteur :**
Services professionnels pour :
- **Événements d'entreprise** - Buffets pour réunions, séminaires
- **Mariages** - Menus personnalisés pour 50-300 personnes
- **Fêtes privées** - Anniversaires, célébrations familiales
- **Réceptions** - Cocktails dînatoires avec mezzés

**Options de Menu :**
- Plateaux de mezzés variés
- Stations de grillades en direct
- Buffets complets chauds et froids
- Desserts et pâtisseries orientales

**Réservation Traiteur :** Minimum 7 jours à l'avance

### Repas de Groupe

**Capacités :**
- East @ West : Jusqu'à 80 personnes
- Salles privées disponibles
- Menus groupe sur mesure

**Menus Groupe Populaires :**
- **Menu Découverte** (€25/pers) - Sélection de 8 mezzés
- **Menu Festif** (€35/pers) - Mezzés + grillades + dessert
- **Menu Premium** (€45/pers) - Menu complet avec vins

## Conclusion

Bruxelles offre une **scène culinaire libanaise dynamique et authentique**, avec des options pour tous les goûts et budgets. Que vous recherchiez une expérience gastronomique raffinée, un repas familial chaleureux ou des options halal certifiées, vous trouverez votre bonheur dans la capitale belge.

**East @ West** se distingue par son engagement envers l'authenticité, la qualité des ingrédients et l'hospitalité libanaise traditionnelle. Notre équipe vous accueille chaleureusement pour vous faire découvrir les saveurs du Liban au cœur de Bruxelles.

**Réservez votre table dès aujourd'hui et découvrez pourquoi East @ West est considéré comme l'un des meilleurs restaurants libanais de Bruxelles!**

---

**Adresse :** Boulevard de l'Empereur 26, 1000 Bruxelles
**Téléphone :** [À compléter]
**Site Web :** https://eastatwest.com
**Heures :** Mardi-Dimanche, 12h-15h & 18h-23h`
};

async function insertBestRestaurantsFR() {
  console.log('🇫🇷 Inserting French translation: Best Lebanese Restaurants Brussels...\n');

  const postData = {
    ...bestRestaurantsFR,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('blogs')
    .insert([postData])
    .select();

  if (error) {
    console.error('❌ Error inserting:', error);
    if (error.code === '23505') {
      console.log('\n⚠️  Post already exists. Updating instead...');
      const { error: updateError } = await supabase
        .from('blogs')
        .update(postData)
        .eq('slug', bestRestaurantsFR.slug);

      if (updateError) {
        console.error('❌ Update error:', updateError);
      } else {
        console.log('✅ Updated successfully!');
      }
    }
  } else {
    console.log('✅ Successfully inserted!');
    console.log(`   Title: ${data[0].title}`);
    console.log(`   Slug: ${data[0].slug}`);
    console.log(`   URL: https://eastatwest.com/fr/blog/${data[0].slug}`);
  }

  console.log('\n📊 Translation Progress:');
  console.log('   ✅ Mezze Guide (FR) - Completed');
  console.log('   ✅ Best Restaurants Brussels (FR) - Completed');
  console.log('   ⏳ Best Restaurants Brussels (NL) - Next week');
  console.log('   ⏳ Lebanese Cuisine Guide (FR, NL) - Following weeks');
  console.log('   ⏳ Mediterranean Diet (FR, NL) - Following weeks');
}

insertBestRestaurantsFR();
