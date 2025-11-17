import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// French translation for Mezze Guide
const mezzeFR = {
  title: "Guide des Mezzés Libanais Traditionnels : 20 Entrées Incontournables",
  slug: "guide-mezzes-libanais-traditionnels-entrees-incontournables-fr",
  excerpt: "Guide complet des mezzés libanais. Découvrez 20 entrées traditionnelles, du houmous et baba ganoush au kibbeh et sambousek. Parfait pour les amateurs de cuisine bruxelloise.",
  meta_title: "Guide des Mezzés Libanais : 20 Entrées Traditionnelles | Bruxelles",
  meta_description: "Découvrez les mezzés libanais authentiques avec notre guide complet. Apprenez les 20 entrées traditionnelles, méthodes de préparation et où trouver les meilleurs mezzés à Bruxelles.",
  language: "fr",
  tags: ["Mezzé", "Cuisine Libanaise", "Entrées", "Guide Gastronomique", "Restaurant Bruxelles", "Halal", "Végétarien", "Cuisine Traditionnelle"],
  content: `# Guide des Mezzés Libanais Traditionnels : 20 Entrées Incontournables

**Le mezzé** est l'âme de la cuisine libanaise - une collection de petits plats savoureux destinés au partage, à la conversation et à la célébration. Que vous dîniez dans un **restaurant libanais à Bruxelles** ou que vous découvriez la cuisine du Moyen-Orient pour la première fois, comprendre le mezzé est essentiel pour apprécier la culture culinaire libanaise.

## Qu'est-ce que le Mezzé ?

Le mezzé (aussi écrit meze ou mazza) désigne de petits plats servis en entrée dans la cuisine libanaise et méditerranéenne. Le mot vient du persan, signifiant "goût" ou "snack".

**Caractéristiques Principales :**
- Servi en petites portions à partager
- Mélange de plats chauds et froids
- Options végétariennes et carnées
- Mangé avec du pain pita frais
- Encourage un repas lent et social
- Habituellement 8-15 plats par repas

## L'Art du Mezzé

### Ordre de Service Traditionnel

1. **Mezzés Froids d'Abord** - Trempettes et salades (15-20 minutes)
2. **Mezzés Chauds Ensuite** - Plats frits et cuits au four (10-15 minutes)
3. **Plats Principaux** - Viandes grillées et riz (optionnel)
4. **Dessert & Café** - Conclusion sucrée

### Étiquette du Mezzé

✓ **Tout se partage** - Le mezzé est communautaire
✓ **Utilisez le pain pour tremper** - Pas besoin d'ustensiles
✓ **Prenez de petites portions** - Nombreux plats à essayer
✓ **Prenez votre temps** - Ne vous précipitez pas
✓ **Commandez par vagues** - Ajoutez plus si nécessaire

## 10 Mezzés Froids Essentiels

### 1. Houmous (حمص)

**Le roi des mezzés** - trempette onctueuse de pois chiches et tahini.

**Ingrédients :**
- Pois chiches
- Tahini (pâte de sésame)
- Jus de citron
- Ail
- Huile d'olive

**Variations :**
- Houmous classique
- Houmous aux pignons
- Houmous à la viande hachée
- Houmous épicé (harissa)

**Bienfaits :** Riche en protéines (7g par portion), graisses saines, fibres. Vegan et sans gluten.

### 2. Baba Ghanoush (بابا غنوج)

**Caviar d'aubergine** fumé avec tahini et ail.

**Préparation :**
- Rôtir l'aubergine au feu pour le goût fumé
- Mélanger avec tahini, ail, citron
- Arroser d'huile d'olive
- Garnir de graines de grenade

**Profil Gustatif :** Crémeux, fumé, acidulé

### 3. Taboulé (تبولة)

**Salade de persil frais** - la salade la plus verte que vous verrez.

**Ingrédient Principal :** Persil (90% de la salade!)

**Composants :**
- Persil plat frais (abondant)
- Boulgour (minimal)
- Tomates (coupées en petits dés)
- Feuilles de menthe
- Jus de citron et huile d'olive

**Erreur Courante :** Trop de boulgour (le vrai taboulé est surtout du persil)

### 4. Fattoush (فتوش)

**Salade levantine** avec chips de pita croustillantes et sumac.

**Ingrédients :**
- Verdures mélangées (laitue, radis, tomates)
- Chips de pita croustillantes
- Sumac (épice acidulée)
- Mélasse de grenade
- Herbes fraîches

**Élément Unique :** Le sumac donne une saveur citronnée et acidulée

### 5. Moutabal (متبل)

**Caviar d'aubergine crémeux**, similaire au baba ghanoush mais avec plus de tahini.

**Différence avec Baba Ghanoush :**
- Texture plus crémeuse
- Plus de tahini
- Parfois avec yaourt
- Souvent garni de graines de grenade

### 6. Labneh (لبنة)

**Yaourt épais filtré** - le fromage blanc libanais.

**Styles de Service :**
- Avec huile d'olive et za'atar
- Avec menthe séchée
- Avec ail et herbes
- Comme trempette ou tartinade

**Bienfaits Probiotiques :** Santé intestinale, digestion

### 7. Warak Enab (ورق عنب)

**Feuilles de vigne farcies** au riz, herbes et parfois viande.

**Garnitures :**
- Riz et herbes (végétarien)
- Riz et viande hachée
- Pignons et épices

**Service :** Froid avec jus de citron

### 8. Muhammara (محمرة)

**Trempette de poivron rouge et noix** - sucrée, épicée, noisette.

**Ingrédients :**
- Poivrons rouges rôtis
- Noix
- Chapelure
- Mélasse de grenade
- Cumin et piment d'Alep

**Saveur :** Sucrée, fumée, légèrement épicée

### 9. Shanklish (شنكليش)

**Fromage affiné** roulé dans le za'atar et épices.

**Description :**
- Boules de fromage fermenté
- Enrobage de za'atar, sumac, piment
- Servi avec huile d'olive, tomates, oignons

**Goût Acquis :** Saveur forte et acidulée

### 10. Makdous (مكدوس)

**Aubergines farcies marinées** aux noix et poivrons.

**Préparation :**
- Petites aubergines salées
- Farcies aux noix, ail, poivrons
- Conservées dans l'huile d'olive

**Saveur :** Acidulée, savoureuse, légèrement épicée

## 10 Mezzés Chauds Délicieux

### 11. Falafel (فلافل)

**Beignets de pois chiches croustillants** - la star végétarienne.

**Fait À Partir De :**
- Pois chiches moulus (pas cuits!)
- Herbes (persil, coriandre)
- Épices (cumin, coriandre)
- Ail et oignon

**Servi Avec :**
- Sauce tahini
- Cornichons
- Légumes frais
- Pain pita

**Vegan & Halal :** Oui aux deux

### 12. Sambousek (سمبوسك)

**Pâtisseries triangulaires** farcies au fromage, viande ou épinards.

**Options de Garniture :**
- Sambousek au fromage (fromage blanc, persil)
- Sambousek à la viande (bœuf/agneau haché épicé)
- Sambousek aux épinards (épinards, oignons, sumac)

**Pâte :** Fine, croustillante, feuilletée

### 13. Kibbeh (كبة)

**Croquettes de boulgour et viande** - plat national du Liban.

**Variétés :**
- Kibbeh maqliyeh (frit)
- Kibbeh nayyeh (cru - tartare libanais)
- Kibbeh bil sanieh (cuit au four)
- Kibbeh labaniyeh (en sauce yaourt)

**Composants :**
- Enveloppe externe : Boulgour et viande maigre
- Garniture : Viande hachée, pignons, oignons

### 14. Fatayer (فطاير)

**Pâtisseries en forme de bateau** avec diverses garnitures.

**Types :**
- Fatayer aux épinards (saban fatayer)
- Fatayer au fromage
- Fatayer à la viande (lahmacun)

**Forme :** Triangulaire ou en bateau avec dessus ouvert

### 15. Arayes (عرايس)

**Pain pita farci** de viande épicée, grillé.

**Préparation :**
- Moitiés de pain pita
- Farcies de mélange kafta
- Grillées jusqu'à croustillant

**Saveur :** Fumé, juteux, aromatique

### 16. Batata Harra (بطاطا حرة)

**Pommes de terre épicées** à l'ail, coriandre et piment.

**Préparation :**
- Pommes de terre en dés frites
- Mélangées avec ail, coriandre, piment
- Finies au jus de citron

**Niveau d'Épice :** Moyen à fort

### 17. Sujuk (سجق)

**Saucisse arménienne épicée** populaire dans la cuisine libanaise.

**Épices :**
- Cumin, paprika, ail
- Piment rouge en flocons
- Poivre noir, quatre-épices

**Service :** Grillée ou poêlée, avec citron

### 18. Makanek (مقانق)

**Saucisses libanaises** aux pignons et épices.

**Différence avec Sujuk :** Profil d'épices plus doux et sucré

**Cuisson :** Poêlée avec mélasse de grenade

### 19. Rouleaux au Fromage (رقاقات جبنة)

**Feuilles de brick** farcies au fromage, frites croustillantes.

**Garniture :**
- Fromage blanc (akawi ou halloumi)
- Herbes fraîches
- Parfois graines de nigelle

**Texture :** Croustillant dehors, fondant dedans

### 20. Soujouk aux Œufs (سجق مع بيض)

**Mezzé du petit-déjeuner** - saucisse brouillée avec œufs.

**Préparation :**
- Faire revenir les tranches de sujuk
- Ajouter les œufs battus
- Brouiller ensemble

**Service :** Chaud avec pain frais

## Comment Commander des Mezzés au Restaurant

### Pour Débutants (2-3 personnes)

**Mezzés Froids :**
- Houmous
- Baba ghanoush
- Taboulé

**Mezzés Chauds :**
- Falafel
- Sambousek (choisir une garniture)

**Estimation :** €25-35 total

### Pour Groupes (4-6 personnes)

**Mezzés Froids :**
- Houmous
- Baba ghanoush
- Moutabal
- Taboulé
- Fattoush
- Labneh

**Mezzés Chauds :**
- Falafel
- Kibbeh
- Sambousek (2-3 types)
- Batata harra

**Estimation :** €60-80 total

## Mezzés à Bruxelles

**Où Trouver des Mezzés Authentiques :**

Chez **East @ West**, nous servons des mezzés traditionnels préparés frais quotidiennement :
✓ 15+ variétés de mezzés
✓ Recettes traditionnelles
✓ Préparation fraîche quotidienne
✓ Options végétariennes et vegan
✓ Certifié Halal
✓ Parfait pour partager

**Options de Commande :**
- Assiettes de mezzés individuels (€6-12)
- Plateau mezzé pour 2 (€25)
- Grand assortiment mezzé pour groupes (€60-80)

## Conclusion

Le mezzé est plus qu'une nourriture - c'est une **expérience sociale, tradition culturelle et célébration de l'hospitalité libanaise**. Chaque plat raconte l'histoire de la riche histoire culinaire du Levant.

Que vous exploriez la **cuisine libanaise à Bruxelles** ou que vous planifiez un festin méditerranéen chez vous, maîtriser le mezzé est votre passerelle vers la compréhension de la culture culinaire libanaise.

**Visitez East @ West** pour découvrir les mezzés libanais authentiques au cœur de Bruxelles.

**Réservez votre table aujourd'hui !**`
};

async function insertMissingTranslations() {
  console.log('🌍 Creating missing French translation for Mezze Guide...\n');

  // Insert French Mezze Guide
  const frPost = {
    ...mezzeFR,
    author_name: "East @ West Team",
    cover_image_url: "/images/gallery/set-libanais.webp",
    published: true,
    featured: false,
    reading_time: 12,
    published_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('blogs')
    .insert([frPost])
    .select();

  if (error) {
    console.error('❌ Error inserting French Mezze Guide:', error);
  } else {
    console.log('✅ Inserted: Guide des Mezzés Libanais (FR)');
    console.log(`   Slug: ${data[0].slug}`);
  }

  console.log('\n✅ Translation created successfully!');
  console.log('\nNote: Due to the length of content, additional translations will be created in separate scripts.');
  console.log('Remaining translations needed:');
  console.log('  - Lebanese Cuisine Guide (FR, NL)');
  console.log('  - Mediterranean Diet (FR, NL)');
  console.log('  - Best Lebanese Restaurants Brussels (FR, NL)');
}

insertMissingTranslations();
