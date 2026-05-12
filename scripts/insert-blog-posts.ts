/**
 * Script to insert blog posts into Supabase.
 * Each article has an English and French version.
 *
 * Run with: tsx scripts/insert-blog-posts.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  author_name: string
  cover_image_url: string
  tags: string[]
  published: boolean
  featured: boolean
  language: string
  meta_title: string
  meta_description: string
  reading_time: number
  published_at: string
}

const blogPosts: BlogPost[] = [
  // ============================================================
  // 1. Lebanese Cuisine - English
  // ============================================================
  {
    title: 'Lebanese Cuisine: Definition, History, Ingredients, and Traditional Dishes',
    slug: 'lebanese-cuisine-history-ingredients-dishes',
    excerpt: 'Discover Lebanese cuisine, its history, ingredients, and how it compares to Mediterranean food. Find where to eat authentic Lebanese food in Brussels.',
    content: `## History of Lebanese Food

Lebanese food has developed over centuries through the influence of three major culinary periods: ancient Phoenician traditions, Ottoman rule, and French influence.

The earliest foundations date to the Phoenicians, who introduced grains, olive oil, and trade-based ingredients that shaped the core of Lebanese cooking.

During the Ottoman period (1516–1918), Lebanese cuisine incorporated dishes such as lamb-based meals, stuffed vegetables (mahshi), baklava, and coffee, which remain central to its food culture.

Later, the French influence (1918–1943) introduced elements like pastries, including croissants, and desserts such as caramel custards, adding refinement and variety to Lebanese cuisine.

## Core Ingredients in Lebanese Cooking

Lebanese cooking is based on a core set of fresh and simple ingredients, including olive oil, chickpeas, tahini, bulgur, fresh herbs, garlic, and lemon juice.

- **Olive oil** is the primary fat used in Lebanese cuisine, valued for its flavor and role in both cooking and dressing dishes.
- **Chickpeas** are a staple ingredient, commonly used in dishes like hummus and falafel.
- **Tahini**, a paste made from sesame seeds, is often combined with chickpeas and lemon juice to create rich and creamy textures.
- **Bulgur**, a cracked wheat grain, is widely used in dishes such as tabbouleh and kibbeh.
- **Fresh herbs** like parsley and mint add brightness and freshness, especially in salads.
- **Garlic and lemon juice** are essential for seasoning, giving many Lebanese dishes their distinctive, sharp, and tangy flavor.

## Lebanese Cuisine vs Mediterranean Cuisine

Lebanese cuisine is a specific national cuisine with its own traditional dishes, ingredients, and cultural identity, while Mediterranean cuisine is a broader category that includes multiple regional cuisines from countries around the Mediterranean.

Lebanese cuisine focuses on specific staples like bulgur, tahini, and fresh herbs, while Mediterranean cuisine encompasses a wider variety of ingredients and cooking styles from countries like Greece, Italy, Spain, and Morocco.

## Where to Eat Authentic Lebanese Food in Brussels

Authentic Lebanese food in Brussels can be found in restaurants that follow traditional preparation methods and use fresh ingredients such as olive oil, herbs, grains, and legumes.

A true Lebanese menu typically includes a variety of mezze dishes such as **kibbeh**, **hummus**, **moutabal**, and **falafel**, along with traditional plates like **warak enab**, **fatteh**, **itch**, and **zahra**, all prepared with classic Lebanese ingredients and flavors.

If you are looking to experience authentic Lebanese cuisine, visit [East @ West](https://eastatwest.com) and discover a selection of authentic dishes prepared using classic Lebanese recipes. Check our [menu](https://eastatwest.com/menu) for the full range of traditional options.

## FAQs

### What kind of food is Lebanese food?
Lebanese food is a traditional cuisine based on fresh ingredients such as vegetables, olive oil, and herbs. It includes dishes like kibbeh, hummus, and falafel, and is known for balanced flavors, healthy meals, and a strong culture of shared dining.

### What is the national dish of Lebanon?
Kibbeh is considered the national dish of Lebanon. It is made from bulgur and minced meat, shaped and either fried or baked. Kibbeh is a traditional Lebanese dish and a central part of mezze and everyday meals.

### What is Lebanon's famous food?
Lebanese famous food includes dishes like kibbeh, hummus, falafel, tabbouleh, and shawarma. These dishes are made with ingredients such as chickpeas, bulgur, herbs, and olive oil, and are often served with flatbread as part of traditional Lebanese meals.

### What's the best Lebanese dish?
The best Lebanese dish depends on preference: kibbeh is a traditional favorite, hummus and falafel are ideal for vegetarians, and shawarma is popular for meat lovers. Lebanese cuisine offers a variety of dishes suited to different tastes and dietary choices.

### Is Lebanese food spicy?
No, Lebanese food is generally not spicy, as it focuses on fresh herbs, garlic, lemon, and mild spices rather than strong heat, although some dishes like kibbeh may include light spice for added flavor.

### Is Lebanese cuisine healthy?
Lebanese cuisine is considered healthy because it relies on fresh ingredients like vegetables, olive oil, legumes, and herbs. For example, **tabbouleh**, made with parsley, bulgur, and lemon, is rich in fiber, vitamins, and antioxidants, supporting a balanced diet.`,
    author_name: 'East @ West',
    cover_image_url: '/images/events-catering/mezze-libanais-restaurant.webp',
    tags: ['Lebanese Cuisine', 'History', 'Ingredients', 'Brussels', 'Traditional Food'],
    published: true,
    featured: true,
    language: 'en',
    meta_title: 'Lebanese Cuisine: History, Ingredients, and Dishes',
    meta_description: 'Discover Lebanese cuisine, its history, ingredients, and how it compares to Mediterranean food. Find where to eat authentic Lebanese food in Brussels.',
    reading_time: 4,
    published_at: '2026-05-12T10:00:00Z'
  },

  // ============================================================
  // 1. Lebanese Cuisine - French
  // ============================================================
  {
    title: 'Cuisine libanaise : définition, histoire, ingrédients et plats traditionnels',
    slug: 'cuisine-libanaise-histoire-ingredients-plats',
    excerpt: 'Découvrez la cuisine libanaise, son histoire, ses ingrédients et ses différences avec la cuisine méditerranéenne. Où manger libanais à Bruxelles.',
    content: `## Histoire de la cuisine libanaise

La cuisine libanaise s'est développée au fil des siècles sous l'influence de trois grandes périodes culinaires : les traditions phéniciennes, la domination ottomane et l'influence française.

Les premières bases remontent aux Phéniciens, qui ont introduit les céréales, l'huile d'olive et des ingrédients issus du commerce maritime, et ont façonné la cuisine libanaise.

Durant la période ottomane (1516–1918), la cuisine libanaise a intégré des plats à base d'agneau, des légumes farcis (mahshi), le baklava et le café, aujourd'hui encore essentiels à la culture culinaire du pays.

Plus tard, l'influence française (1918–1943) a introduit des éléments comme les viennoiseries, notamment les croissants, ainsi que des desserts tels que les crèmes au caramel, apportant davantage de raffinement et de diversité à la cuisine libanaise.

## Ingrédients essentiels dans la cuisine libanaise

La cuisine libanaise repose sur des ingrédients frais et simples :

- **L'huile d'olive** est la principale matière grasse, appréciée pour sa saveur et son rôle dans la cuisson et l'assaisonnement.
- **Les pois chiches** sont un ingrédient incontournable, notamment dans le houmous et le falafel.
- **Le tahini**, une pâte de sésame, est souvent mélangé aux pois chiches et au citron pour créer des textures riches et crémeuses.
- **Le boulgour**, une céréale de blé concassé, est largement utilisé dans le taboulé et le kibbeh.
- **Les herbes fraîches**, comme le persil et la menthe, apportent de la fraîcheur et de la légèreté.
- **L'ail et le jus de citron** sont essentiels pour l'assaisonnement et donnent aux plats libanais leur goût vif et légèrement acidulé.

## Cuisine libanaise vs cuisine méditerranéenne

La cuisine libanaise est une cuisine nationale spécifique avec ses propres plats, ingrédients et identité culturelle, tandis que la cuisine méditerranéenne est une catégorie plus large regroupant plusieurs cuisines régionales autour de la Méditerranée.

## Où manger une authentique cuisine libanaise à Bruxelles

La cuisine libanaise authentique à Bruxelles se retrouve dans des restaurants qui respectent les méthodes de préparation traditionnelles et utilisent des ingrédients frais comme l'huile d'olive, les herbes, les céréales et les légumineuses.

Un véritable menu libanais comprend généralement différents mezzés comme le **kibbeh**, le **houmous**, le **moutabal** et le **falafel**, ainsi que des plats traditionnels comme le **warak enab**, la **fatteh**, l'**itch** et la **zahra**.

Si vous souhaitez découvrir la cuisine libanaise traditionnelle à Bruxelles, visitez [East @ West](https://eastatwest.com) et profitez d'une sélection de plats authentiques. Consultez notre [menu](https://eastatwest.com/menu) pour découvrir toutes nos spécialités.

## FAQ

### Quel type de cuisine est la cuisine libanaise ?
La cuisine libanaise est une cuisine traditionnelle fondée sur des ingrédients frais tels que les légumes, l'huile d'olive et les herbes. Elle comprend des plats comme le kibbeh, le houmous et le falafel, et est reconnue pour ses saveurs équilibrées et sa culture du partage.

### Quel est le plat national du Liban ?
Le kibbeh est considéré comme le plat national du Liban. Il est préparé à partir de boulgour et de viande hachée, puis frit ou cuit au four.

### Quel est le plat libanais le plus célèbre ?
Les plats libanais les plus célèbres comprennent le kibbeh, le houmous, le falafel, le taboulé et le shawarma.

### La cuisine libanaise est-elle épicée ?
Non, la cuisine libanaise n'est généralement pas très épicée. Elle privilégie les herbes fraîches, l'ail, le citron et les épices douces.

### La cuisine libanaise est-elle saine ?
Oui, la cuisine libanaise est considérée comme saine car elle repose sur des ingrédients frais tels que les légumes, l'huile d'olive, les légumineuses et les herbes.`,
    author_name: 'East @ West',
    cover_image_url: '/images/events-catering/mezze-libanais-restaurant.webp',
    tags: ['Cuisine Libanaise', 'Histoire', 'Ingrédients', 'Bruxelles', 'Plats Traditionnels'],
    published: true,
    featured: true,
    language: 'fr',
    meta_title: 'Cuisine libanaise : histoire, ingrédients et plats',
    meta_description: 'Découvrez la cuisine libanaise, son histoire, ses ingrédients et ses différences avec la cuisine méditerranéenne. Où manger libanais à Bruxelles.',
    reading_time: 4,
    published_at: '2026-05-12T10:00:00Z'
  },

  // ============================================================
  // 2. Kibbeh - English
  // ============================================================
  {
    title: 'Kibbeh: Ingredients, Types, and Where to Eat It in Brussels',
    slug: 'kibbeh-ingredients-types-where-to-eat-brussels',
    excerpt: 'Learn what kibbeh is, its ingredients, types, and preparation. Discover its health value, compare it to falafel, and find where to eat kibbeh in Brussels.',
    content: `## What is Kibbeh?

Kibbeh is a traditional Lebanese dish made from bulgur and finely minced meat, typically beef or lamb, mixed with onions and spices. It is considered one of the most iconic dishes in Lebanese cuisine, with origins in the Levant. Kibbeh holds strong cultural importance in Lebanon, where it is commonly prepared for family gatherings and served as part of a mezze or as a main course.

## What is Kibbeh Made Of?

Kibbeh is made from a combination of bulgur, finely minced meat, and spices that create its distinctive flavor and texture.

The meat used in kibbeh is typically beef or lamb, finely ground and mixed to form a smooth and consistent base. Traditional kibbeh is seasoned with spices such as allspice, black pepper, and salt, which give the dish its warm, juicy, and rich flavor.

## Types of Kibbeh in Lebanese Cuisine

Kibbeh is prepared in several traditional forms, each with a different texture and method of serving:

- **Kibbeh Nayeh (Raw Kibbeh)** is made from finely minced raw meat mixed with bulgur and spices. It is considered a delicacy in Lebanese cuisine and is typically served fresh with olive oil and herbs.
- **Fried Kibbeh Balls** are one of the most common types, shaped into oval croquettes with a crispy outer shell made from bulgur and meat, and filled with spiced minced meat, onions, and sometimes nuts.
- **Baked Kibbeh (Kibbeh bil Sanieh)** is prepared by layering the kibbeh mixture in a tray with a filling of minced meat and onions, then baking it until firm and golden, and cutting it into portions for serving.

## How Kibbeh is Prepared

Kibbeh is prepared using traditional methods that focus on combining ingredients carefully and choosing the right cooking technique for the desired texture.

The traditional preparation method involves finely grinding meat and mixing it with soaked bulgur, onions, and spices until a smooth and uniform mixture is formed. The mixture is then shaped by hand into balls, patties, or spread into layers, depending on the type of kibbeh.

Kibbeh can be cooked using different techniques, mainly frying or baking. Fried kibbeh is shaped into oval croquettes and deep-fried until crispy on the outside, while baked kibbeh is prepared in a tray and cooked in the oven, resulting in a softer texture with a firm structure.

## Is Kibbeh Healthy?

Kibbeh can be a nutritious dish depending on its ingredients and preparation method, as it combines grains, meat, and spices.

In terms of nutritional value, kibbeh provides a mix of protein, carbohydrates, and essential nutrients from bulgur, meat, and spices. It also contains vitamins and minerals, especially when prepared with fresh ingredients.

For protein and calorie breakdown, kibbeh is relatively high in protein due to the meat content, while the calorie level varies based on cooking method. Fried kibbeh tends to be higher in calories because of oil, whereas baked kibbeh is generally lighter.

## Kibbeh vs Falafel: What's the Difference?

Kibbeh and falafel are both popular dishes in Lebanese cuisine, but they differ in ingredients, taste, and texture.

In terms of ingredients, kibbeh is made from bulgur and minced meat, typically beef or lamb, mixed with spices. Falafel, on the other hand, is made from ground chickpeas combined with herbs and spices, making it a plant-based dish.

When it comes to taste and texture, kibbeh has a rich, savory flavor and a firm or crispy texture, depending on how it is prepared, while falafel has a lighter, herb-rich taste with a crispy exterior and a soft interior.

## Where to Eat Authentic Kibbeh in Brussels

Authentic kibbeh in Brussels can be found in Lebanese restaurants that follow traditional preparation methods and offer a variety of mezze and classic dishes made with fresh ingredients.

A great option is [East @ West](https://eastatwest.com), which serves a wide selection of Lebanese dishes, including kibbeh, falafel, and vegetarian and vegan options. Check our [menu](https://eastatwest.com/menu) to discover a full range of traditional options.`,
    author_name: 'East @ West',
    cover_image_url: '/images/gallery/kebbe.webp',
    tags: ['Kibbeh', 'Lebanese Food', 'Brussels', 'Mezze', 'Traditional Dishes'],
    published: true,
    featured: false,
    language: 'en',
    meta_title: 'Kibbeh: Ingredients, Types, and Where to Eat in Brussels',
    meta_description: 'Learn what kibbeh is, its ingredients, types, and preparation. Discover its health value, compare it to falafel, and find where to eat kibbeh in Brussels.',
    reading_time: 4,
    published_at: '2026-05-12T11:00:00Z'
  },

  // ============================================================
  // 2. Kibbeh - French
  // ============================================================
  {
    title: 'Kibbeh : ingrédients, types et où en manger à Bruxelles',
    slug: 'kibbeh-ingredients-types-ou-manger-bruxelles',
    excerpt: 'Découvrez le kibbeh : composition, types, préparation et valeur nutritionnelle. Comparez-le au falafel et trouvez où manger un kibbeh authentique à Bruxelles.',
    content: `## Qu'est-ce que le kibbeh ?

Le kibbeh est un plat traditionnel libanais préparé à partir de boulgour et de viande finement hachée, généralement du bœuf ou de l'agneau, mélangés avec des oignons et des épices. Il est considéré comme l'un des plats les plus emblématiques de la cuisine libanaise, dont les origines remontent au Levant.

Le kibbeh revêt une grande importance culturelle au Liban, où il est souvent préparé lors des réunions familiales et servi à la fois comme mezze et comme plat principal.

## De quoi est composé le kibbeh ?

Le kibbeh est préparé à partir d'un mélange de boulgour, de viande hachée et d'épices, qui lui confèrent sa texture et sa saveur caractéristiques.

La viande utilisée est généralement du bœuf ou de l'agneau, finement hachée pour obtenir une préparation lisse et homogène. Le kibbeh traditionnel est assaisonné d'épices comme la cannelle, le quatre-épices, le poivre noir et le sel, qui lui confèrent une saveur riche et chaleureuse.

## Types de kibbeh dans la cuisine libanaise

Le kibbeh existe sous plusieurs formes traditionnelles :

- **Kibbeh Nayeh (kibbeh cru)** : préparé à partir de viande crue finement hachée mélangée à du boulgour et des épices. Il est considéré comme une spécialité raffinée et est généralement servi frais avec de l'huile d'olive et des herbes.
- **Boules de kibbeh frites** : l'une des formes les plus populaires, façonnées en croquettes ovales à base de boulgour et de viande, farcies de viande hachée épicée, d'oignons et parfois de noix.
- **Kibbeh au four (Kibbeh bil Sanieh)** : préparé en couches dans un plat, garni de viande hachée et d'oignons, puis cuit au four jusqu'à obtenir une texture ferme et dorée.

## Comment le kibbeh est-il préparé ?

La préparation traditionnelle consiste à hacher finement la viande, puis à la mélanger avec du boulgour trempé, des oignons et des épices, jusqu'à obtenir une préparation homogène. Le mélange est ensuite façonné à la main en boulettes, en galettes ou en couches, selon le type de kibbeh.

Le kibbeh peut être préparé par friture ou cuisson au four. Le kibbeh frit est façonné en croquettes ovales et frit jusqu'à devenir croustillant, tandis que le kibbeh au four est cuit dans un plat pour obtenir une texture plus tendre.

## Le kibbeh est-il sain ?

Le kibbeh peut être un plat nutritif selon ses ingrédients et sa méthode de préparation, car il combine des céréales, de la viande et des épices.

D'un point de vue nutritionnel, le kibbeh apporte un mélange de protéines, de glucides et de nutriments essentiels. Le kibbeh frit contient généralement plus de calories en raison de l'huile, tandis que le kibbeh au four est souvent plus léger.

## Kibbeh vs falafel : quelles différences ?

Le kibbeh et le falafel sont deux plats populaires de la cuisine libanaise, mais ils diffèrent par leurs ingrédients, leur goût et leur texture.

Le kibbeh est préparé à partir de boulgour et de viande hachée, mélangés avec des épices. Le falafel, quant à lui, est préparé à base de pois chiches moulus associés à des herbes et des épices, ce qui en fait un plat végétal.

En termes de goût, le kibbeh possède une saveur riche et salée, tandis que le falafel offre un goût plus léger et herbacé, avec un extérieur croustillant et un intérieur moelleux.

## Où manger un authentique kibbeh à Bruxelles

Le kibbeh authentique à Bruxelles se trouve dans des restaurants libanais qui respectent les méthodes de préparation traditionnelles et proposent une variété de mezzés et de plats classiques.

Une excellente option est [East @ West](https://eastatwest.com) à Bruxelles, qui propose une large sélection de spécialités libanaises, notamment du kibbeh, des falafels ainsi que des options végétariennes et végétales. Consultez notre [menu](https://eastatwest.com/menu) pour découvrir toutes nos spécialités.`,
    author_name: 'East @ West',
    cover_image_url: '/images/gallery/kebbe.webp',
    tags: ['Kibbeh', 'Cuisine Libanaise', 'Bruxelles', 'Mezze', 'Plats Traditionnels'],
    published: true,
    featured: false,
    language: 'fr',
    meta_title: 'Kibbeh : ingrédients, types et où en manger à Bruxelles',
    meta_description: 'Découvrez le kibbeh : composition, types, préparation et valeur nutritionnelle. Comparez-le au falafel et trouvez où en manger à Bruxelles.',
    reading_time: 5,
    published_at: '2026-05-12T11:00:00Z'
  },

  // ============================================================
  // 3. Falafel - English
  // ============================================================
  {
    title: 'Falafel Explained: Ingredients, Nutrition, and Best Falafel in Brussels',
    slug: 'falafel-ingredients-nutrition-best-in-brussels',
    excerpt: 'Learn what falafel is, its ingredients, preparation, and health benefits, and discover how it\'s served and where to eat it in Brussels.',
    content: `## What is Falafel?

Falafel is a traditional Lebanese dish made from ground chickpeas mixed with herbs and spices, shaped into small balls or patties, and fried until crispy. It is a plant-based food widely recognized for its texture and flavor. Falafel has origins in the Middle East and is commonly associated with Levantine cuisine, where it has been prepared and consumed for generations.

In Lebanese street food, falafel is a staple, often served on Lebanese bread with vegetables and tahini sauce. It is popular as a quick, affordable meal and is commonly found in casual eateries and street food settings across Lebanon and beyond.

## What is Falafel Made Of?

Falafel is made from a mixture of legumes, herbs, and spices that give it its distinctive flavor and texture. The main ingredient is typically chickpeas, although in some variations, fava beans are used instead or combined with chickpeas. The mixture is then blended with herbs and spices such as parsley, garlic, and cumin, which add freshness and depth to the dish.

## How Falafel is Prepared

Falafel is prepared by grinding and mixing simple ingredients into a uniform mixture, then shaping and cooking them to achieve a crispy texture.

The preparation starts by soaking chickpeas and then grinding them with herbs, garlic, and spices until a coarse yet well-combined mixture forms. This mixture is then shaped into small balls or patties.

Falafel is typically cooked by deep-frying, in which the shaped pieces are fried in hot oil until golden and crispy on the outside while remaining soft on the inside.

## Is Falafel Healthy?

Yes, falafel can be a healthy option, depending on how it is prepared and served, as it is made from plant-based ingredients such as chickpeas, herbs, and spices.

Falafel is naturally vegan since it contains no animal products, making it suitable for vegetarian and plant-based diets. It is also a good source of protein and fiber from chickpeas. When served in falafel wraps with vegetables and tahini sauce, it can make a balanced meal, though the calorie count may increase due to frying and added sauces.

## How Falafel is Served in Lebanese Cuisine

In Lebanese cuisine, falafel is served in different ways, depending on the dining style, from casual street food to traditional mezze.

Falafel is often included in mezze platters, where it is served alongside dishes like hummus, moutabal, and salads, allowing it to be shared as part of a variety of small plates. It is also commonly served in wraps with vegetables and tahini sauce as a quick meal.

Authentic falafel is defined by its use of soaked chickpeas, fresh herbs, and balanced spices, along with a crispy exterior and soft interior, achieved through proper preparation and frying techniques.

## Where to Eat the Best Falafel in Brussels

Fresh falafel in Brussels can be found in Lebanese restaurants, where it is prepared with soaked chickpeas, herbs, and traditional spices, then fried to achieve a crispy texture and rich flavor.

A great place to try fresh falafel is [East @ West](https://eastatwest.com), where falafel is served as part of a varied menu that includes wraps, mezze, dishes, and vegetarian options. Check our [menu](https://eastatwest.com/menu) to discover a full range of traditional options.`,
    author_name: 'East @ West',
    cover_image_url: '/images/gallery/falafel.webp',
    tags: ['Falafel', 'Lebanese Food', 'Vegan', 'Brussels', 'Street Food'],
    published: true,
    featured: false,
    language: 'en',
    meta_title: 'Falafel: Ingredients, Nutrition, and Best in Brussels',
    meta_description: 'Learn what falafel is, its ingredients, preparation, and health benefits, and discover how it\'s served and where to eat it in Brussels.',
    reading_time: 3,
    published_at: '2026-05-12T12:00:00Z'
  },

  // ============================================================
  // 3. Falafel - French
  // ============================================================
  {
    title: 'Falafel : ingrédients, nutrition et meilleur falafel à Bruxelles',
    slug: 'falafel-ingredients-nutrition-meilleur-bruxelles',
    excerpt: 'Découvrez le falafel : composition, préparation, bienfaits et où trouver le meilleur falafel à Bruxelles.',
    content: `## Qu'est-ce que le falafel ?

Le falafel est un plat traditionnel libanais préparé à partir de pois chiches moulus, mélangés à des herbes et des épices, façonnés en petites boulettes ou en galettes, puis frits jusqu'à obtenir une texture croustillante. Il s'agit d'un aliment végétal reconnu pour son goût et sa texture.

Le falafel trouve ses origines au Moyen-Orient et est étroitement associé à la cuisine levantine, où il est préparé et consommé depuis des générations.

Dans la street food libanaise, le falafel est un incontournable, souvent servi dans un pain pita garni de légumes et de sauce tahini. Il est apprécié comme repas rapide et abordable.

## De quoi est composé le falafel ?

Le falafel est préparé à partir d'un mélange de légumineuses, d'herbes et d'épices qui lui confèrent sa saveur et sa texture caractéristiques.

L'ingrédient principal est généralement le pois chiche, bien que certaines variantes utilisent des fèves ou un mélange de fèves et de pois chiches. La préparation est ensuite mélangée avec des herbes et des épices comme le persil, l'ail et le cumin, qui apportent fraîcheur et profondeur au plat.

## Comment le falafel est-il préparé ?

La préparation commence par le trempage des pois chiches, puis leur broyage avec des herbes, de l'ail et des épices jusqu'à obtenir un mélange grossier mais bien homogène. Ce mélange est ensuite façonné en petites boulettes ou en galettes.

Le falafel est généralement cuit par friture, les pièces étant plongées dans l'huile chaude jusqu'à ce qu'elles deviennent dorées et croustillantes à l'extérieur, tout en restant tendres à l'intérieur.

## Le falafel est-il sain ?

Oui, le falafel peut être une option saine selon sa préparation, car il est composé d'ingrédients végétaux tels que les pois chiches, les herbes et les épices.

Le falafel est naturellement végan puisqu'il ne contient aucun produit d'origine animale, ce qui le rend adapté aux régimes végétariens et végétaliens. Il constitue également une bonne source de protéines et de fibres grâce aux pois chiches.

Lorsqu'il est servi dans un wrap avec des légumes et de la sauce tahini, le falafel peut constituer un repas équilibré, même si le nombre de calories peut augmenter en raison de la friture et des sauces ajoutées.

## Comment le falafel est-il servi dans la cuisine libanaise ?

Le falafel est servi de différentes façons dans la cuisine libanaise :

- Dans des **plateaux de mezzés**, accompagné de plats comme le houmous, le moutabal et les salades, permettant de le partager.
- En **wraps**, avec des légumes et de la sauce tahini, comme repas rapide.

Le falafel authentique se distingue par l'utilisation de pois chiches trempés, d'herbes fraîches et d'épices équilibrées, ainsi que par une texture croustillante à l'extérieur et moelleuse à l'intérieur.

## Où manger le meilleur falafel à Bruxelles

Le falafel frais à Bruxelles se trouve dans des restaurants libanais qui le préparent à partir de pois chiches trempés, d'herbes et d'épices traditionnelles.

Un excellent endroit pour goûter un falafel frais à Bruxelles est [East @ West](https://eastatwest.com), où le falafel fait partie d'un menu varié comprenant des wraps, des mezzés et des options végétariennes. Consultez notre [menu](https://eastatwest.com/menu) pour découvrir toutes nos spécialités.`,
    author_name: 'East @ West',
    cover_image_url: '/images/gallery/falafel.webp',
    tags: ['Falafel', 'Cuisine Libanaise', 'Végan', 'Bruxelles', 'Street Food'],
    published: true,
    featured: false,
    language: 'fr',
    meta_title: 'Falafel : ingrédients, nutrition et meilleur à Bruxelles',
    meta_description: 'Découvrez le falafel : composition, préparation, bienfaits nutritionnels et où trouver le meilleur falafel à Bruxelles.',
    reading_time: 4,
    published_at: '2026-05-12T12:00:00Z'
  },

  // ============================================================
  // 4. Lebanese vs Turkish - English
  // ============================================================
  {
    title: 'Lebanese vs Turkish Food: Key Differences Explained',
    slug: 'lebanese-vs-turkish-food-key-differences',
    excerpt: 'Compare Lebanese and Turkish food, including ingredients, cooking methods, flavor profiles, health differences, and where to try Lebanese cuisine in Brussels.',
    content: `## Key Ingredient Differences Between Lebanese and Turkish Cuisine

Lebanese and Turkish cuisines use different core ingredients, which shape their flavors and overall style.

Lebanese cuisine relies heavily on fresh vegetables, herbs, legumes, and olive oil, with ingredients such as parsley, mint, chickpeas, bulgur, and lemon used frequently to create light, balanced dishes. In contrast, Turkish cuisine makes greater use of meat, dairy, and richer components such as butter, yogurt, and spices, along with ingredients like eggplant, lamb, and rice, resulting in deeper and more robust flavors.

## Cooking Techniques in Lebanese vs Turkish Cuisine

Lebanese and Turkish cuisines use different cooking techniques that influence the texture, flavor, and richness of their dishes.

Lebanese cooking focuses on simple, light techniques such as grilling, baking, and combining fresh ingredients, often with minimal processing to preserve natural flavors. Dishes are typically prepared quickly and rely on olive oil, lemon, and herbs rather than heavy cooking methods.

In contrast, Turkish cuisine uses more varied and intensive techniques, including slow cooking, stewing, roasting, and pan-frying. These methods are often combined with butter, rich sauces, and spices, resulting in deeper flavors and heavier textures.

## Flavor Profiles in Lebanese vs Turkish Cuisine

Lebanese cuisine is known for its fresh, light, and balanced flavors, often combining lemon, garlic, olive oil, and herbs such as parsley and mint to create bright, refreshing dishes. The seasoning is typically moderate, allowing natural ingredients to stand out.

In contrast, Turkish cuisine features richer and more intense flavors, with a heavier use of spices, butter, and slow-cooked ingredients. Dishes often have deeper, warmer tastes, sometimes with a mix of savory and slightly sweet elements from spices and cooking methods.

## Which Cuisine Is Healthier: Lebanese or Turkish?

Lebanese cuisine is generally considered healthier due to its focus on fresh ingredients, balanced meals, and lighter cooking methods.

Lebanese food relies heavily on vegetables, legumes, olive oil, and herbs, which provide fiber, vitamins, and healthy fats while keeping dishes relatively low in calories. In contrast, Turkish cuisine often includes richer ingredients such as butter, meats, and slow-cooked dishes, which can be higher in calories and fat, although it still offers nutritious options depending on the preparation.

## Where to Try Lebanese Food in Brussels

Lebanese cuisine is widely available in Brussels, especially in restaurants that focus on traditional recipes and fresh ingredients.

You can try authentic Lebanese dishes at [East @ West](https://eastatwest.com) in Brussels, where the menu includes a variety of mezze, grilled dishes, and vegetarian options prepared in a traditional style. Check our [menu](https://eastatwest.com/menu) to discover a full range of traditional options.`,
    author_name: 'East @ West',
    cover_image_url: '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
    tags: ['Lebanese Food', 'Turkish Food', 'Comparison', 'Brussels', 'Healthy Eating'],
    published: true,
    featured: false,
    language: 'en',
    meta_title: 'Lebanese vs Turkish Food: Key Differences',
    meta_description: 'Compare Lebanese and Turkish food, including ingredients, cooking methods, flavor profiles, health differences, and where to try Lebanese cuisine in Brussels.',
    reading_time: 3,
    published_at: '2026-05-12T13:00:00Z'
  },

  // ============================================================
  // 4. Lebanese vs Turkish - French
  // ============================================================
  {
    title: 'Cuisine libanaise vs cuisine turque : principales différences',
    slug: 'cuisine-libanaise-vs-turque-differences',
    excerpt: 'Comparez la cuisine libanaise et turque : ingrédients, techniques de cuisson, saveurs, bienfaits pour la santé et où manger libanais à Bruxelles.',
    content: `## Principales différences d'ingrédients entre la cuisine libanaise et turque

Les cuisines libanaise et turque utilisent des ingrédients de base différents, ce qui influence leurs saveurs et leur style général.

La cuisine libanaise repose largement sur les légumes frais, les herbes, les légumineuses et l'huile d'olive. Des ingrédients tels que le persil, la menthe, les pois chiches, le boulgour et le citron sont fréquemment utilisés pour préparer des plats légers et équilibrés.

En revanche, la cuisine turque utilise davantage de viande, de produits laitiers et d'ingrédients plus riches comme le beurre, le yaourt et les épices, ainsi que des aliments comme l'aubergine, l'agneau et le riz, donnant des saveurs plus profondes et plus généreuses.

## Techniques de cuisson dans la cuisine libanaise et turque

La cuisine libanaise privilégie des méthodes simples et légères, comme le grill, la cuisson au four et le mélange d'ingrédients frais, souvent avec peu de transformation, afin de préserver les saveurs naturelles.

À l'inverse, la cuisine turque recourt à des techniques plus variées et plus intensives, notamment le mijotage, les ragoûts, le rôtissage et la cuisson à la poêle. Ces méthodes sont souvent associées au beurre, aux sauces riches et aux épices.

## Profils de saveurs dans la cuisine libanaise et turque

La cuisine libanaise est connue pour ses saveurs fraîches, légères et équilibrées, combinant souvent le citron, l'ail, l'huile d'olive et des herbes comme le persil et la menthe pour créer des plats rafraîchissants. L'assaisonnement reste généralement modéré afin de mettre en valeur les ingrédients naturels.

En comparaison, la cuisine turque propose des saveurs plus riches et plus intenses, avec davantage d'épices, de beurre et d'ingrédients mijotés.

## Quelle cuisine est la plus saine : libanaise ou turque ?

La cuisine libanaise est généralement considérée comme plus saine grâce à l'utilisation d'ingrédients frais, à des repas équilibrés et à des méthodes de cuisson plus légères.

La cuisine libanaise repose fortement sur les légumes, les légumineuses, l'huile d'olive et les herbes, qui apportent des fibres, des vitamines et de bonnes graisses tout en maintenant des plats relativement faibles en calories.

En revanche, la cuisine turque contient souvent des ingrédients plus riches, comme le beurre, la viande et les plats mijotés, susceptibles d'être plus riches en calories et en matières grasses.

## Où goûter la cuisine libanaise à Bruxelles

La cuisine libanaise est largement présente à Bruxelles, notamment dans les restaurants qui mettent l'accent sur les recettes traditionnelles et les ingrédients frais.

Vous pouvez déguster des plats libanais authentiques chez [East @ West](https://eastatwest.com) à Bruxelles, où le menu propose une variété de mezzés, de plats grillés et d'options végétariennes. Consultez notre [menu](https://eastatwest.com/menu) pour explorer une gamme complète de plats traditionnels.`,
    author_name: 'East @ West',
    cover_image_url: '/images/events-catering/plat-libanais-restaurant-libanais-bruxelles.webp',
    tags: ['Cuisine Libanaise', 'Cuisine Turque', 'Comparaison', 'Bruxelles', 'Alimentation Saine'],
    published: true,
    featured: false,
    language: 'fr',
    meta_title: 'Cuisine libanaise vs turque : principales différences',
    meta_description: 'Comparez la cuisine libanaise et turque : ingrédients, techniques de cuisson, saveurs, bienfaits pour la santé et où manger libanais à Bruxelles.',
    reading_time: 3,
    published_at: '2026-05-12T13:00:00Z'
  }
]

async function insertBlogPosts() {
  console.log('Inserting blog posts into Supabase...\n')

  // Check for existing posts to avoid duplicates
  const { data: existing, error: fetchError } = await supabase
    .from('blogs')
    .select('slug')

  if (fetchError) {
    console.error('Error fetching existing blogs:', fetchError)
    process.exit(1)
  }

  const existingSlugs = new Set((existing || []).map(b => b.slug))
  let inserted = 0
  let skipped = 0

  for (const post of blogPosts) {
    if (existingSlugs.has(post.slug)) {
      console.log(`  Skipped "${post.title}" (slug already exists)`)
      skipped++
      continue
    }

    const { error } = await supabase
      .from('blogs')
      .insert(post)

    if (error) {
      console.error(`  Error inserting "${post.title}":`, error.message)
    } else {
      console.log(`  Inserted "${post.title}" [${post.language}]`)
      inserted++
    }
  }

  console.log(`\n--- Summary ---`)
  console.log(`Inserted: ${inserted}`)
  console.log(`Skipped (existing): ${skipped}`)
  console.log(`Total posts: ${blogPosts.length}`)
}

insertBlogPosts()
