export interface NanoPrompt {
  id: string;
  title: string;
  category: string;
  tags: string[];
  promptText: string;
  description?: string;
  isCustom?: boolean;
  imageUrl?: string;
}

/**
 * Authentic Nano Banana Pro / YouMind-OpenLab Prompts Dataset
 * Exhaustive, curated dataset of authentic prompt templates for Google Nano Banana Pro (Gemini Image) models.
 */
export const NANO_BANANA_PROMPTS: NanoPrompt[] = [
  // ==========================================
  // 1. PRODUCT SHOWCASE & HERO PACKSHOTS (12)
  // ==========================================
  {
    id: 'nb-prod-001',
    title: 'Minimalist Studio Packshot',
    category: 'product',
    tags: ['product-photography', 'packshot', 'minimalist', 'studio'],
    promptText: 'Minimalist product photography of [Product Name] sitting centered on a matte slate surface in a soft-lit studio, high contrast, clean shadow backdrop, shot on 85mm prime lens f/2.8, 8k crisp details',
    description: 'Hero packshot with clean slate surface and soft directional studio lighting.'
  },
  {
    id: 'nb-prod-002',
    title: 'Floating Obsidian Glass Podium',
    category: 'product',
    tags: ['floating', 'obsidian', 'luxury', 'raytraced'],
    promptText: 'High-end commercial advertisement photo of [Product Name] floating weightlessly over a glossy dark obsidian glass podium, surrounded by subtle soft volumetric haze, warm 35mm studio key light with rim lighting, soft contact dropshadows, 8k raytraced, professional advertising aesthetic',
    description: 'Weightless float effect over reflective obsidian glass with warm studio key light.'
  },
  {
    id: 'nb-prod-003',
    title: 'Water Ripples & Light Caustics',
    category: 'product',
    tags: ['water-reflections', 'ripples', 'caustics', 'macro'],
    promptText: 'Ultra-realistic product shot of [Product Name] set upon a crystal-clear shallow water surface with subtle liquid ripples, golden studio rim light reflecting on water droplets, bokeh background in soft [Brand Color] palette, macro 100mm lens focus',
    description: 'Refreshing shallow liquid surface with golden light caustics and water droplets.'
  },
  {
    id: 'nb-prod-004',
    title: 'Prism Refraction & Spectral Flares',
    category: 'product',
    tags: ['prism', 'rainbow', 'refraction', 'crystal'],
    promptText: 'Award-winning product advertisement photo of [Product Name] illuminated by dynamic rainbow crystal prism refractions, casting brilliant spectral light flares across a dark satin background, high key contrast, 8k render',
    description: 'Spectral rainbow light dispersion across dark satin backdrop.'
  },
  {
    id: 'nb-prod-005',
    title: 'Volcanic Basalt Rock Pedestal',
    category: 'product',
    tags: ['basalt', 'volcanic-rock', 'dark-mood', 'crimson'],
    promptText: 'Bold product photography featuring [Product Name] placed on raw black volcanic basalt rocks, moody dark background with subtle smoke trails, sharp edge lighting in crimson red, aggressive premium commercial feel',
    description: 'Raw black volcanic rock pedestal with crimson edge lighting.'
  },
  {
    id: 'nb-prod-006',
    title: 'Frosted Ice Crystal Block',
    category: 'product',
    tags: ['frozen', 'ice-block', 'sub-zero', 'blue-led'],
    promptText: 'Ice-cold commercial product photography of [Product Name] encased inside an icy frozen crystal block, sub-zero frosted mist, crisp blue LED backlighting, macro ice texture details, studio flash capture',
    description: 'Frozen ice block staging for beverages and refreshing skincare products.'
  },
  {
    id: 'nb-prod-007',
    title: 'Terrazzo Stone & Botanical Shadow',
    category: 'product',
    tags: ['terrazzo', 'monstera', 'botanical-shadow', 'modern'],
    promptText: 'Modern lifestyle product placement of [Product Name] on a speckled white terrazzo stone block, dappled Monstera leaf shadow overlay, warm morning sunlight, aesthetic Instagram catalog photography look',
    description: 'Speckled white terrazzo block with organic Monstera leaf shadows.'
  },
  {
    id: 'nb-prod-008',
    title: 'Liquid Splash Explosion FX',
    category: 'product',
    tags: ['high-speed', 'liquid-splash', '1/8000s', 'dynamic'],
    promptText: 'High-speed action product photograph of [Product Name] hitting a splash of vibrant [Brand Color] liquid, high speed 1/8000s shutter capture, crisp suspended liquid droplets, studio strobe flash lighting',
    description: 'High-speed frozen liquid splash explosion in brand accent colors.'
  },
  {
    id: 'nb-prod-009',
    title: 'Sand Dunes & Desert Sunset Glow',
    category: 'product',
    tags: ['desert', 'sand-dunes', 'golden-hour', 'outdoor'],
    promptText: 'Outdoor adventure product staging of [Product Name] standing on fine golden sand dunes at sunset, low angle shot, long warm shadows, cinematic warm ambient light, dusty particles in air, 35mm camera',
    description: 'Rugged desert environment with golden hour sunset shadows.'
  },
  {
    id: 'nb-prod-010',
    title: 'Silk Satin Ribbon Encircled',
    category: 'product',
    tags: ['silk-ribbon', 'pastel-pink', 'delicate', 'luxury'],
    promptText: 'Soft commercial catalog shot of [Product Name] gently encircled by a flowing blush pink silk ribbon, soft studio light, pastel gradient background, elegant delicate feel',
    description: 'Encircled by flowing silk ribbons for cosmetics and elegance.'
  },
  {
    id: 'nb-prod-011',
    title: 'Brushed Aluminum Industrial Base',
    category: 'product',
    tags: ['aluminum', 'industrial', 'precision', 'metallic'],
    promptText: 'Precision product photography of [Product Name] centered on brushed aluminum sheet, sharp razor edge highlights, subtle laser grid projection in background, cold industrial aesthetic',
    description: 'Brushed aluminum metal staging with precise laser highlights.'
  },
  {
    id: 'nb-prod-012',
    title: 'Frosted Acrylic Gradient Panel',
    category: 'product',
    tags: ['frosted-acrylic', 'gradient', 'minimalist', 'modern'],
    promptText: 'Sleek modern product photo of [Product Name] resting on a semi-opaque frosted acrylic panel, backlit with soft rainbow pastel gradient glow, clean minimal layout',
    description: 'Semi-opaque frosted acrylic panel with soft rainbow backlight.'
  },

  // ==========================================
  // 2. CINEMATIC COMMERCIALS & LIGHTING (12)
  // ==========================================
  {
    id: 'nb-cine-001',
    title: 'Anamorphic Lens Flare Studio',
    category: 'cinematic',
    tags: ['anamorphic', 'octane-render', 'cinematic', 'lens-flare'],
    promptText: 'Cinematic 8k octane render ad featuring [Product Name] inside a moody architectural studio, subtle horizontal blue anamorphic lens flare, volumetric fog, rim light, dark slate background, high contrast dramatics, shot on 35mm prime lens',
    description: 'Dramatic movie trailer aesthetic with horizontal blue anamorphic lens flares.'
  },
  {
    id: 'nb-cine-002',
    title: 'God-Ray Beam Stone Archway',
    category: 'cinematic',
    tags: ['god-rays', 'sunbeam', 'stone-pedestal', 'golden-hour'],
    promptText: 'Dramatic cinematic commercial for [Product Name] placed on a stone pedestal, illuminated by a warm god-ray beam of golden hour sunlight breaking through a dark architectural arch, dusty atmospheric particles, shallow depth of field',
    description: 'Epic sunlight beams breaking through dark stone arches.'
  },
  {
    id: 'nb-cine-003',
    title: 'Chiaroscuro Dark Velvet',
    category: 'cinematic',
    tags: ['chiaroscuro', 'velvet', 'dark-luxury', 'dramatic'],
    promptText: 'Dark mood luxury advert for [Product Name] wrapped in deep velvet textures, chiaroscuro lighting, deep dramatic shadows, high contrast, golden accents, award-winning commercial layout',
    description: 'Rich dark chiaroscuro lighting with golden rim accents.'
  },
  {
    id: 'nb-cine-004',
    title: 'Rainy Night Street Reflection',
    category: 'cinematic',
    tags: ['rainy-asphalt', 'city-lights', 'bokeh', 'urban'],
    promptText: 'Moody cinematic commercial photo of [Product Name] on wet asphalt road at night, colorful blurred city street lights reflected in rainwater puddles, anamorphic bokeh, film grain texture',
    description: 'Wet rainy city night asphalt with colorful bokeh puddle reflections.'
  },
  {
    id: 'nb-cine-005',
    title: 'Sci-Fi Laboratory Glass Pod',
    category: 'cinematic',
    tags: ['scifi-lab', 'laser-grid', 'glass-containment', 'sterile'],
    promptText: 'High tech scientific lab commercial featuring [Product Name] floating inside a pristine glass containment pod, soft blue laser grid scanner light, sterile white minimalist background, 8k render',
    description: 'Sci-fi laboratory glass containment pod with blue laser grid rays.'
  },
  {
    id: 'nb-cine-006',
    title: 'Nordic Forest Morning Mist',
    category: 'cinematic',
    tags: ['nordic', 'scandinavian-forest', 'morning-fog', 'granite'],
    promptText: 'Atmospheric Scandinavian forest advert of [Product Name] resting on a moss-covered granite boulder, thick pine trees veiled in early morning mist, soft overcast light, tranquil cinematic mood',
    description: 'Scandinavian pine forest shrouded in tranquil morning fog.'
  },
  {
    id: 'nb-cine-007',
    title: 'Industrial Factory Sparks & Smoke',
    category: 'cinematic',
    tags: ['industrial', 'factory-sparks', 'steel-girders', 'gritty'],
    promptText: 'Gritty industrial commercial poster for [Product Name] placed on raw rusted steel girders, background filled with glowing orange sparks and warm factory smoke haze, heavy metal aesthetic',
    description: 'Industrial steel girders with warm factory smoke and flying sparks.'
  },
  {
    id: 'nb-cine-008',
    title: 'Deep Ocean Trench Caustics',
    category: 'cinematic',
    tags: ['underwater', 'ocean-trench', 'caustics', 'bubbles'],
    promptText: 'Ethereal underwater cinematic ad of [Product Name] descending into deep blue ocean water, caustic sun rays piercing through water surface, tiny air bubbles floating upward, serene oceanic depth',
    description: 'Deep sea underwater environment with sunlight caustics.'
  },
  {
    id: 'nb-cine-009',
    title: 'Zero Gravity Orbital Sunrise',
    category: 'cinematic',
    tags: ['orbital-sunrise', 'space', 'earth-curvature', 'interstellar'],
    promptText: 'Interstellar sci-fi advertisement for [Product Name] floating in Earth orbit, curvature of Earth with bright blue atmospheric horizon illuminated by orbital sunrise, stars background',
    description: 'Floating in zero gravity against the glowing curvature of Earth.'
  },
  {
    id: 'nb-cine-010',
    title: 'Subterranean Cavern Lava Glow',
    category: 'cinematic',
    tags: ['subterranean', 'lava-glow', 'cave', 'fire'],
    promptText: 'Epic fantasy commercial shot of [Product Name] resting on a dark basalt ledge inside a subterranean crystal cavern, warm magma lava glow reflecting on surfaces, atmospheric smoke',
    description: 'Subterranean crystal cavern with warm magma lava reflections.'
  },
  {
    id: 'nb-cine-011',
    title: 'Vintage Retro Film Grain Studio',
    category: 'cinematic',
    tags: ['35mm-film', 'film-grain', 'amber-tones', 'vintage'],
    promptText: 'Classic 1970s analog cinematic photography of [Product Name], warm amber key lighting, authentic Kodachrome film grain, subtle lens vignette, nostalgic award-winning advertisement',
    description: 'Authentic 1970s Kodachrome analog film grain aesthetics.'
  },
  {
    id: 'nb-cine-012',
    title: 'High-Contrast Neo-Noir Shadow',
    category: 'cinematic',
    tags: ['neo-noir', 'venetian-blinds', 'dramatic-shadows', 'mystery'],
    promptText: 'High contrast neo-noir commercial photo featuring [Product Name] illuminated by slatted shadows from Venetian window blinds, moody black and white with single [Brand Color] splash accent',
    description: 'Neo-noir venetian blind shadows with single brand color accent.'
  },

  // ==========================================
  // 3. E-COMMERCE & MINIMALIST PODIUMS (10)
  // ==========================================
  {
    id: 'nb-ecom-001',
    title: 'Pastel Geometric Cylinders',
    category: 'ecommerce',
    tags: ['pastel', 'flatlay', 'shopify', 'minimalist'],
    promptText: 'Clean e-commerce studio flatlay featuring [Product Name] on a pastel [Brand Color] geometric cylinder podium, soft overhead daylight, minimal drop shadow, sharp focus, aesthetic catalog photo for Amazon and Shopify',
    description: 'Bright clean geometric cylinder podium for e-commerce listings.'
  },
  {
    id: 'nb-ecom-002',
    title: 'High-Key Seamless White Backdrop',
    category: 'ecommerce',
    tags: ['high-key', 'white-background', 'clean-packshot', 'isolation'],
    promptText: 'High-key commercial advertisement of [Product Name] isolated on a pure seamless white studio background, neutral soft lighting, accurate colors, subtle contact shadow, ready for digital print banner',
    description: '100% pure white background for crisp e-commerce isolation.'
  },
  {
    id: 'nb-ecom-003',
    title: 'Organic Linen & Palm Leaf Shadows',
    category: 'ecommerce',
    tags: ['organic-linen', 'palm-shadow', 'natural-daylight', 'cozy'],
    promptText: 'Aesthetic lifestyle product photo of [Product Name] resting on a natural linen tablecloth, soft tropical palm leaf shadows cast across the surface, warm natural morning sunlight, cozy minimalist vibe',
    description: 'Natural linen tablecloth with tropical palm leaf shadows.'
  },
  {
    id: 'nb-ecom-004',
    title: 'Terracotta Curved Clay Wall',
    category: 'ecommerce',
    tags: ['terracotta', 'clay-wall', 'earthy-tones', 'editorial'],
    promptText: 'Minimalist product catalog photography of [Product Name] set against a terracotta warm clay curved wall, soft diffused side light, earthy natural tones, editorial e-commerce look',
    description: 'Earthy terracotta clay wall backdrop for natural brands.'
  },
  {
    id: 'nb-ecom-005',
    title: 'Beige Sandstone & Pampas Grass',
    category: 'ecommerce',
    tags: ['boho', 'sandstone', 'pampas-grass', 'cozy-warmth'],
    promptText: 'Boho aesthetic product photo of [Product Name] on rough beige sandstone with delicate dried pampas grass stems, soft sunbeams, warm cozy tone, perfect for organic lifestyle catalog',
    description: 'Boho style with dried pampas grass and natural beige sandstone.'
  },
  {
    id: 'nb-ecom-006',
    title: 'Dual Split Color Contrast Backdrop',
    category: 'ecommerce',
    tags: ['split-color', 'bold-contrast', 'social-feed', 'modern'],
    promptText: 'Eye-catching e-commerce ad photo of [Product Name] positioned on a dual split-color background half [Brand Color] and half stark black, sharp dividing line, high contrast',
    description: 'Dual split color background for striking social media feeds.'
  },
  {
    id: 'nb-ecom-007',
    title: 'Cloud Dry-Ice Vapor Stage',
    category: 'ecommerce',
    tags: ['cloud-vapor', 'dry-ice', 'dreamy', 'pastel-sky'],
    promptText: 'Dreamy product display photo of [Product Name] resting on a soft cloud-like puff of white dry ice vapor, pastel sky blue background, soft ethereal lighting',
    description: 'Ethereal dry ice cloud vapor base for wellness and fragrance.'
  },
  {
    id: 'nb-ecom-008',
    title: 'Oak Wood Block & Minimal Archway',
    category: 'ecommerce',
    tags: ['oak-wood', 'archway-cutout', 'beige', 'aesthetic'],
    promptText: 'Aesthetic minimalist packaging photo of [Product Name] placed inside a smooth beige archway cutout, resting on oak wood block, soft natural light, warm aesthetic',
    description: 'Smooth beige archway cutout with natural oak wood block.'
  },
  {
    id: 'nb-ecom-009',
    title: 'Frosted Glass Surface Backlit',
    category: 'ecommerce',
    tags: ['frosted-glass', 'pastel-backlight', 'sleek', 'modern'],
    promptText: 'Sleek modern e-commerce shot of [Product Name] standing on a semi-opaque frosted glass panel, soft pastel gradient backlight underneath, ultra clean layout',
    description: 'Frosted glass surface with soft pastel gradient backlight.'
  },
  {
    id: 'nb-ecom-010',
    title: 'Monochrome Warm Beige Curvatures',
    category: 'ecommerce',
    tags: ['monochrome', 'curved-walls', 'warm-beige', 'soothing'],
    promptText: 'Soothing minimalist e-commerce showcase of [Product Name] set amidst smooth curved beige architectural walls, soft diffused daylight, studio isolation look',
    description: 'Monochromatic warm beige curved walls with soft ambient daylight.'
  },

  // ==========================================
  // 4. CYBERPUNK & 3D TECH (10)
  // ==========================================
  {
    id: 'nb-cyber-001',
    title: 'Dual Cyan & Magenta Neon Rim',
    category: 'cyberpunk',
    tags: ['cyberpunk', 'neon-rim', 'cyan-magenta', 'futuristic'],
    promptText: 'Futuristic 3D tech product display of [Product Name] floating inside a dark neon studio, vivid dual-tone cyan and magenta rim lighting, glowing LED accents, metallic textures, high-contrast dark cyberpunk aesthetic',
    description: 'High-energy dual neon rim light for tech gadgets and audio gear.'
  },
  {
    id: 'nb-cyber-002',
    title: 'Holographic Matrix Grid',
    category: 'cyberpunk',
    tags: ['hologram', 'matrix-grid', 'scifi-ui', 'octane-render'],
    promptText: 'Sci-fi commercial ad of [Product Name] resting on a glowing grid matrix pedestal, surrounded by subtle blue holographic UI particles, 8k octane render, dark metallic background, ultra crisp',
    description: 'Sci-fi holographic particles surrounding a dark matrix grid.'
  },
  {
    id: 'nb-cyber-003',
    title: 'Chrome & Carbon Fiber Showcase',
    category: 'cyberpunk',
    tags: ['carbon-fiber', 'liquid-chrome', 'edge-lighting', 'industrial'],
    promptText: 'Industrial cyberpunk showcase of [Product Name] on a dark carbon fiber platform with polished liquid chrome accents, intense sharp edge lighting, futuristic tech advertisement',
    description: 'Polished liquid chrome and carbon fiber platform.'
  },
  {
    id: 'nb-cyber-004',
    title: 'Synthwave 80s Wireframe Grid',
    category: 'cyberpunk',
    tags: ['synthwave', '80s-retro', 'wireframe-sun', 'neon-pink'],
    promptText: '80s synthwave retro-futuristic ad for [Product Name] placed on a purple grid horizon, giant glowing wireframe sun in background, hot pink neon lighting, nostalgic 80s vibe',
    description: '80s synthwave grid horizon with glowing wireframe sun.'
  },
  {
    id: 'nb-cyber-005',
    title: 'Tokyo Rain Alley Kanji Neon',
    category: 'cyberpunk',
    tags: ['tokyo-night', 'kanji-neon', 'rainy-barrel', 'blade-runner'],
    promptText: 'Cyberpunk Tokyo alleyway at night featuring [Product Name] on a rainy metal barrel, glowing kanji neon signs reflecting in puddles, cinematic dark moody atmosphere',
    description: 'Tokyo night alley with glowing kanji neon signage.'
  },
  {
    id: 'nb-cyber-006',
    title: 'Quantum Plasma Portal Ring',
    category: 'cyberpunk',
    tags: ['plasma-portal', 'quantum-ring', 'blue-energy', 'void'],
    promptText: 'Sci-fi product revelation featuring [Product Name] emerging through a glowing electric blue plasma portal ring, floating particles, dark void background, high energy',
    description: 'Emerging from a swirling electric plasma portal.'
  },
  {
    id: 'nb-cyber-007',
    title: 'Gold Circuit Board Fiber Optics',
    category: 'cyberpunk',
    tags: ['circuit-board', 'fiber-optics', 'gold-traces', 'hardware'],
    promptText: 'Deep tech product photo of [Product Name] surrounded by glowing gold circuit board traces and glowing fiber optic cables, macro perspective, futuristic hardware advert',
    description: 'Glowing gold circuit board traces and fiber optic cabling.'
  },
  {
    id: 'nb-cyber-008',
    title: 'Holographic Prism Laser Scattering',
    category: 'cyberpunk',
    tags: ['laser-scattering', 'iridescent-cube', 'titanium', '3d-render'],
    promptText: 'Futuristic tech advertisement for [Product Name] hovering inside an iridescent holographic cube prism, laser light scattering, octane render, sleek titanium texture',
    description: 'Iridescent holographic cube prism with scattered laser beams.'
  },
  {
    id: 'nb-cyber-009',
    title: 'Brushed Titanium Razor Laser Stripe',
    category: 'cyberpunk',
    tags: ['titanium', 'lime-green', 'laser-stripe', 'minimal-tech'],
    promptText: 'Clean modern tech ad photo of [Product Name] on a brushed titanium surface with a single razor-thin neon lime green light stripe passing through, minimalist high tech',
    description: 'Brushed titanium surface with razor-thin lime laser line.'
  },
  {
    id: 'nb-cyber-010',
    title: 'Fiery Magma Lava Veins Pedestal',
    category: 'cyberpunk',
    tags: ['magma-veins', 'lava-rock', 'fiery-orange', 'gaming-tech'],
    promptText: 'Extreme gaming tech advertisement for [Product Name] resting on a cracked magma rock with glowing fiery orange LED lava veins, intense heat radiation aesthetic',
    description: 'Fiery magma rock pedestal with glowing orange LED veins.'
  },

  // ==========================================
  // 5. FASHION & EDITORIAL MODELS (10)
  // ==========================================
  {
    id: 'nb-fash-001',
    title: 'Vogue Editorial Sunset Cover',
    category: 'fashion',
    tags: ['vogue', 'editorial', 'model-portrait', 'sunset-rimlight'],
    promptText: 'High fashion magazine cover advertisement featuring model wearing or holding [Product Name], dramatic warm sunset rim light, cinematic color grading, shallow depth of field, 85mm portrait lens, editorial aesthetic',
    description: 'Vogue editorial cover shot with model and sunset rim light.'
  },
  {
    id: 'nb-fash-002',
    title: 'Urban Streetwear Night Scene',
    category: 'fashion',
    tags: ['streetwear', 'city-night', 'neon-storefronts', 'trendy'],
    promptText: 'Urban streetwear advertisement featuring [Product Name] in a night city scene with wet rain reflections and colorful neon store signs in the bokeh background, trendy aesthetic, high energy',
    description: 'Urban streetwear night scene with neon store reflections.'
  },
  {
    id: 'nb-fash-003',
    title: 'Monochromatic Haute Couture',
    category: 'fashion',
    tags: ['haute-couture', 'monochrome', 'beige-studio', 'luxury'],
    promptText: 'Sleek monochromatic editorial photoshoot featuring [Product Name] against a seamless beige backdrop, soft directional studio light, minimalist haute couture look, luxury brand vibe',
    description: 'Soft beige haute couture studio fashion aesthetic.'
  },
  {
    id: 'nb-fash-004',
    title: 'Parisian Balcony Eiffel Tower Sunset',
    category: 'fashion',
    tags: ['paris', 'eiffel-tower', 'balcony', 'romantic-luxury'],
    promptText: 'Luxury fashion lifestyle commercial featuring [Product Name] on a vintage wrought-iron Parisian balcony overlooking the Eiffel Tower at golden hour, soft romantic sunlight, elegant',
    description: 'Parisian balcony setting with sunset view over the Eiffel Tower.'
  },
  {
    id: 'nb-fash-005',
    title: 'Dramatic Black & White High-Fashion',
    category: 'fashion',
    tags: ['black-and-white', 'harsh-shadows', 'vogue', 'timeless'],
    promptText: 'Dramatic black and white fashion advertisement shot of [Product Name], deep harsh shadows, bold key light, timeless high-fashion photography style, 50mm lens',
    description: 'Dramatic black & white high-contrast studio portrait.'
  },
  {
    id: 'nb-fash-006',
    title: 'Vibrant Yellow Billowing Silk Fabric',
    category: 'fashion',
    tags: ['billowing-silk', 'yellow', 'vibrant-pop', 'mid-air'],
    promptText: 'Vibrant fashion poster for [Product Name] surrounded by billowing bright yellow silk fabric caught mid-air, bold saturated color contrast, studio flash lighting',
    description: 'Billowing saturated yellow silk fabric caught mid-air.'
  },
  {
    id: 'nb-fash-007',
    title: 'Ribbed Glass Shadow Play',
    category: 'fashion',
    tags: ['ribbed-glass', 'shadow-play', 'abstract', 'artistic'],
    promptText: 'Artistic editorial fashion photo of [Product Name] photographed through a textured ribbed glass sheet, creating distorted abstract light shadows and artistic reflections',
    description: 'Photographed through ribbed architectural glass for creative shadows.'
  },
  {
    id: 'nb-fash-008',
    title: 'White Sand Dunes Drapes Shoot',
    category: 'fashion',
    tags: ['white-sand-dunes', 'flowing-drapes', 'sun-kissed', 'desert-fashion'],
    promptText: 'High fashion desert shoot showcasing [Product Name] amidst endless white sand dunes under a clear blue sky, long flowing white drapes, sun-kissed lighting',
    description: 'Pristine white sand dunes with flowing white drapes.'
  },
  {
    id: 'nb-fash-009',
    title: 'Infinity Mirror Chamber Reflections',
    category: 'fashion',
    tags: ['infinity-mirror', 'repeating-reflections', 'art-gallery', 'surreal'],
    promptText: 'Surreal fashion advertisement of [Product Name] displayed inside an infinity mirror room with repeating reflections, soft ambient light glow, modern art gallery feel',
    description: 'Infinity mirror chamber with endless repeating reflections.'
  },
  {
    id: 'nb-fash-010',
    title: 'Vintage 70s Analog Film Look',
    category: 'fashion',
    tags: ['70s-vintage', 'film-grain', 'amber-tones', 'retro-model'],
    promptText: 'Vintage 1970s fashion advertisement for [Product Name], warm orange and amber tone color grade, analog film grain, vintage lens flare, retro aesthetic',
    description: 'Warm 70s analog film grain photography with retro model.'
  },

  // ==========================================
  // 6. LUXURY & JEWELRY STAGING (8)
  // ==========================================
  {
    id: 'nb-lux-001',
    title: '24k Gold Leaf Flakes & Obsidian',
    category: 'luxury',
    tags: ['24k-gold', 'obsidian-glass', 'shimmer', 'ultra-luxury'],
    promptText: 'Ultra luxury advertisement of [Product Name] on black obsidian glass, surrounded by floating 24k gold leaf foil fragments shimmering in air, warm key light, rich golden reflections, 8k raytraced',
    description: 'Floating 24k gold leaf flakes shimmering over dark obsidian glass.'
  },
  {
    id: 'nb-lux-002',
    title: 'Carrara Marble & Diamond Sparkles',
    category: 'luxury',
    tags: ['carrara-marble', 'diamond-flares', 'jewelry-staging', 'high-end'],
    promptText: 'High jewelry commercial photo featuring [Product Name] atop a polished white Carrara marble pedestal, subtle diamond flare sparks, clean luxury brand lighting, crisp reflections',
    description: 'Polished white Carrara marble pedestal with diamond lens flares.'
  },
  {
    id: 'nb-lux-003',
    title: 'Deep Sapphire Velvet & Gold Trim',
    category: 'luxury',
    tags: ['sapphire-velvet', 'gold-trim', 'royal', 'haute-jewel'],
    promptText: 'Royal luxury ad placement for [Product Name] draped on royal sapphire blue velvet with soft gold embroidery trim, warm spotlighting, specular highlights',
    description: 'Royal sapphire blue velvet backdrop with gold embroidery.'
  },
  {
    id: 'nb-lux-004',
    title: 'Polished Rose Gold Reflection Pool',
    category: 'luxury',
    tags: ['rose-gold', 'reflection-pool', 'warm-champagne', 'glamour'],
    promptText: 'Glamorous product advertisement of [Product Name] resting above a smooth liquid rose gold mirror pool, soft champagne ambient light, elegant contact reflections',
    description: 'Liquid rose gold mirror pool with champagne lighting.'
  },
  {
    id: 'nb-lux-005',
    title: 'Emerald Glass Geometric Pedestal',
    category: 'luxury',
    tags: ['emerald-glass', 'geometric', 'jewel-tones', 'dramatic'],
    promptText: 'Exquisite jewelry showcase photo featuring [Product Name] on a faceted emerald green crystal pedestal, sharp light refractions, deep dramatic dark background',
    description: 'Faceted emerald green crystal pedestal with sharp refractions.'
  },
  {
    id: 'nb-lux-006',
    title: 'Champagne Flute Sparkle Glow',
    category: 'luxury',
    tags: ['champagne-bubbles', 'golden-sparkle', 'celebration', 'gala'],
    promptText: 'Celebration luxury advertisement for [Product Name] set against a background of sparkling golden champagne bubbles and bokeh flares, warm festive gala mood',
    description: 'Golden champagne bubbles bokeh flares for high-end galas.'
  },
  {
    id: 'nb-lux-007',
    title: 'Platinum Metallic Curved Sculpture',
    category: 'luxury',
    tags: ['platinum', 'sculptural', 'modern-art', 'silver-shine'],
    promptText: 'Modern luxury exhibition photo of [Product Name] placed within a flowing liquid platinum metal sculpture, high key specular highlights, pristine studio reflection',
    description: 'Liquid platinum sculptural metal base with specular highlights.'
  },
  {
    id: 'nb-lux-008',
    title: 'Baccarat Crystal Faceted Pillar',
    category: 'luxury',
    tags: ['crystal-pillar', 'refraction-sparks', 'baccarat-style', 'pure'],
    promptText: 'High-end prestige advertisement for [Product Name] sitting atop a hand-carved crystal glass pillar, brilliant prismatic rainbow sparkles, deep black velvet background',
    description: 'Hand-carved crystal glass pillar with prismatic sparkles.'
  },

  // ==========================================
  // 7. FOOD & GOURMET BEVERAGE (8)
  // ==========================================
  {
    id: 'nb-food-001',
    title: 'Espresso Steam & Roasted Beans',
    category: 'food',
    tags: ['espresso', 'coffee-beans', 'aromatic-steam', 'gourmet'],
    promptText: 'Gourmet commercial photo of [Product Name] surrounded by scattered dark roasted coffee beans and swirling white aromatic steam rising, warm morning light, rustic wooden table',
    description: 'Scattered roasted coffee beans with swirling steam.'
  },
  {
    id: 'nb-food-002',
    title: 'Citrus Condensation Splash',
    category: 'food',
    tags: ['citrus-splash', 'condensation-drops', 'refreshing-drink', 'summer'],
    promptText: 'Refreshing drink ad for [Product Name] covered in icy water condensation droplets, fresh sliced orange and lime splashing into liquid, vibrant summer sunlight',
    description: 'Icy condensation droplets with fresh citrus slice splash.'
  },
  {
    id: 'nb-food-003',
    title: 'Artisanal Dark Chocolate Drizzle',
    category: 'food',
    tags: ['chocolate-drizzle', 'cocoa-powder', 'gourmet-dessert', 'warm-rich'],
    promptText: 'Mouthwatering dessert photography of [Product Name] being drizzled with glossy warm dark chocolate sauce, scattered cocoa powder dusting, macro 100mm lens',
    description: 'Glossy warm dark chocolate sauce drizzle with cocoa powder.'
  },
  {
    id: 'nb-food-004',
    title: 'Woodfired Pizzeria Flame & Flour',
    category: 'food',
    tags: ['woodfired', 'flour-burst', 'pizzeria', 'rustic-flame'],
    promptText: 'Authentic culinary commercial for [Product Name] set inside a rustic brick woodfired oven environment, airborne flour dust burst, warm fiery glow, appetising',
    description: 'Rustic brick oven environment with airborne flour dust.'
  },
  {
    id: 'nb-food-005',
    title: 'Matcha Tea Powder Whisk & Slate',
    category: 'food',
    tags: ['matcha-powder', 'bamboo-whisk', 'zen-slate', 'healthy'],
    promptText: 'Serene Japanese culinary ad for [Product Name] surrounded by fine vibrant green matcha powder, traditional bamboo whisk, dark slate background, natural daylight',
    description: 'Japanese matcha powder setting with traditional bamboo whisk.'
  },
  {
    id: 'nb-food-006',
    title: 'Wild Berry Botanical Splash',
    category: 'food',
    tags: ['wild-berries', 'liquid-splash', 'fresh-mint', 'summer-juice'],
    promptText: 'Vibrant beverage advertisement for [Product Name] with fresh raspberries, blueberries, and mint leaves exploding in a splash of clear liquid, high speed capture',
    description: 'Fresh raspberries and blueberries exploding in liquid splash.'
  },
  {
    id: 'nb-food-007',
    title: 'Gourmet Honey Drizzle & Comb',
    category: 'food',
    tags: ['golden-honey', 'honeycomb', 'warm-amber', 'natural'],
    promptText: 'Gourmet food commercial shot of [Product Name] drenched in a slow-pouring stream of golden organic honey, raw honeycomb pieces, warm amber backlighting',
    description: 'Slow-pouring stream of golden organic honey with honeycomb.'
  },
  {
    id: 'nb-food-008',
    title: 'Craft Beer Amber Foam Crown',
    category: 'food',
    tags: ['craft-beer', 'amber-ale', 'frothy-foam', 'condensation'],
    promptText: 'Crisp beverage advertisement for [Product Name] standing beside a frosty glass of amber ale with rich creamy foam crown, water droplets, dark tavern background',
    description: 'Frosty beverage glass with rich creamy foam crown.'
  },

  // ==========================================
  // 8. AUTOMOTIVE & HIGH-SPEED (8)
  // ==========================================
  {
    id: 'nb-auto-001',
    title: 'Highway Tunnel Motion Light Trails',
    category: 'automotive',
    tags: ['motion-blur', 'light-trails', 'highway-tunnel', 'hypercar'],
    promptText: 'High speed commercial shot of [Product Name] driving through a sleek illuminated highway tunnel at night, light trails motion blur background, razor sharp focus on product, 8k render',
    description: 'High-speed highway tunnel with motion light trails.'
  },
  {
    id: 'nb-auto-002',
    title: 'Showroom Spotlight & Dark Epoxy Floor',
    category: 'automotive',
    tags: ['showroom', 'epoxy-floor', 'spotlight', 'specular-reflections'],
    promptText: 'Luxury automotive showroom advertisement featuring [Product Name] under dramatic top ceiling spotlights on a polished dark epoxy floor, crystal clear specular reflections',
    description: 'Dark epoxy showroom floor under ceiling spotlights.'
  },
  {
    id: 'nb-auto-003',
    title: 'Mountain Pass Drift Smoke',
    category: 'automotive',
    tags: ['mountain-pass', 'drift-smoke', 'sunset-horizon', 'action'],
    promptText: 'Dynamic motor racing advertisement featuring [Product Name] on a winding alpine mountain pass road at sunset, tire smoke drift effect, aggressive low perspective',
    description: 'Alpine mountain pass drift scene with sunset tire smoke.'
  },
  {
    id: 'nb-auto-004',
    title: 'Rainy City Track Water Spray',
    category: 'automotive',
    tags: ['wet-track', 'water-spray', 'night-racing', 'high-speed'],
    promptText: 'Intense motorsport commercial shot of [Product Name] on wet circuit asphalt at night, water spray mist kicking up from tires, bright floodlight reflections',
    description: 'Wet asphalt track with water spray mist from high-speed motion.'
  },
  {
    id: 'nb-auto-005',
    title: 'Futuristic EV Wireless Charging Pad',
    category: 'automotive',
    tags: ['ev-charging', 'wireless-pad', 'cyan-glow', 'clean-future'],
    promptText: 'Clean electric vehicle tech advertisement for [Product Name] parked on a sleek wireless charging pad, glowing cyan LED strip lights, futuristic underground bay',
    description: 'Futuristic EV charging pad with cyan LED strip glow.'
  },
  {
    id: 'nb-auto-006',
    title: 'Salt Flats Sunset Horizon Speed',
    category: 'automotive',
    tags: ['salt-flats', 'mirror-reflection', 'sunset-horizon', 'endless'],
    promptText: 'Epic automotive photoshoot of [Product Name] parked on expansive dry salt flats at golden sunset, mirror reflection on ground, endless horizon',
    description: 'Expansive salt flats with mirror reflections at golden sunset.'
  },
  {
    id: 'nb-auto-007',
    title: 'Carbon Composite Engine Bay Details',
    category: 'automotive',
    tags: ['engine-bay', 'carbon-composite', 'macro-details', 'precision'],
    promptText: 'Supercar precision detail shot featuring [Product Name] embedded in exposed carbon fiber engine compartment, red metallic accents, crisp macro camera lens',
    description: 'Exposed carbon fiber engine compartment precision details.'
  },
  {
    id: 'nb-auto-008',
    title: 'Desert Rally Dust Cloud Sunset',
    category: 'automotive',
    tags: ['rally', 'dust-cloud', 'off-road', 'desert-sunset'],
    promptText: 'Off-road rally adventure commercial for [Product Name] charging through desert sand, massive dust cloud illuminated by setting sun, high action capture',
    description: 'Off-road desert rally with golden sunset dust clouds.'
  },

  // ==========================================
  // 9. COSMETICS, SKINCARE & PERFUME (8)
  // ==========================================
  {
    id: 'nb-cosm-001',
    title: 'Milk Bath & Floating Rose Petals',
    category: 'cosmetics',
    tags: ['milk-bath', 'rose-petals', 'quartz-crystals', 'skincare'],
    promptText: 'Ethereal skincare advertisement of [Product Name] resting in a silky white milk bath floating with soft pink rose petals and rose quartz crystals, gentle spa lighting',
    description: 'Silky white milk bath with floating pink rose petals and quartz.'
  },
  {
    id: 'nb-cosm-002',
    title: 'Aloe Vera & Dew Drop Hydration',
    category: 'cosmetics',
    tags: ['aloe-vera', 'dew-drops', 'clean-beauty', 'hydration'],
    promptText: 'Clean organic beauty ad for [Product Name] set against fresh aloe vera leaves, glistening dew drops, bright natural studio daylight, refreshing hydration theme',
    description: 'Fresh aloe vera leaves with glistening dew drops.'
  },
  {
    id: 'nb-cosm-003',
    title: 'Golden Honey Serum Swirl',
    category: 'cosmetics',
    tags: ['serum-swirl', 'golden-glow', 'nourishing', 'macro-droplet'],
    promptText: 'Luxury skincare commercial shot of [Product Name] sitting on a smooth wave of golden nourishing serum liquid, macro dew droplet, soft warm glow',
    description: 'Smooth wave of golden serum liquid with macro dew droplets.'
  },
  {
    id: 'nb-cosm-004',
    title: 'French Lavender & Silk Backdrop',
    category: 'cosmetics',
    tags: ['french-lavender', 'purple-silk', 'fragrance', 'calming'],
    promptText: 'French perfume advertisement featuring [Product Name] surrounded by fresh lavender flower sprigs and draped deep violet silk, soft romantic evening lighting',
    description: 'Fresh lavender sprigs draped in deep violet silk.'
  },
  {
    id: 'nb-cosm-005',
    title: 'Hyaluronic Acid Liquid Bubble Sphere',
    category: 'cosmetics',
    tags: ['hyaluronic-acid', 'liquid-bubble', 'dermatology', 'pure-water'],
    promptText: 'Dermatological beauty advert for [Product Name] suspended inside a crystal clear liquid sphere of hyaluronic acid, pure water background, high tech clean lighting',
    description: 'Suspended inside a crystal clear hyaluronic liquid sphere.'
  },
  {
    id: 'nb-cosm-006',
    title: 'Crushed Ruby Lipstick Pigment',
    category: 'cosmetics',
    tags: ['crushed-pigment', 'ruby-red', 'makeup', 'bold-contrast'],
    promptText: 'High pigment makeup advertisement showing [Product Name] surrounded by artistic powder bursts of crushed ruby red lipstick pigment, dramatic studio flash',
    description: 'Powder bursts of crushed ruby red makeup pigment.'
  },
  {
    id: 'nb-cosm-007',
    title: 'Shea Butter & Coconut Shell Organic',
    category: 'cosmetics',
    tags: ['shea-butter', 'coconut', 'organic-skincare', 'natural-warmth'],
    promptText: 'Organic bodycare photography of [Product Name] on raw coconut shell half filled with creamy shea butter, soft tropical morning light, clean earthy vibe',
    description: 'Raw coconut shell half filled with creamy shea butter.'
  },
  {
    id: 'nb-cosm-008',
    title: 'Pearl Essence Iridescent Glow',
    category: 'cosmetics',
    tags: ['pearl-essence', 'iridescent-mother-of-pearl', 'luminous', 'spa'],
    promptText: 'Luminous spa advertisement for [Product Name] sitting on an iridescent mother-of-pearl shell, shimmering pearl powder dust in air, soft glowing light',
    description: 'Iridescent mother-of-pearl shell with luminous glow.'
  },

  // ==========================================
  // 10. AUDIO & SMART TECH GADGETS (8)
  // ==========================================
  {
    id: 'nb-tech-001',
    title: 'BOULT Soundwave Ripples & LED Halo',
    category: 'tech',
    tags: ['audio-gadget', 'soundwaves', 'cyan-led', 'bass-vibration'],
    promptText: 'High fidelity audio advertisement for [Product Name] hovering over glowing liquid soundwave ripples, deep bass vibration effects, dark metallic background with cyan LED ring',
    description: 'Liquid soundwave ripples and cyan LED halo ring.'
  },
  {
    id: 'nb-tech-002',
    title: 'Smartwatch Fitness Holographic UI Ring',
    category: 'tech',
    tags: ['smartwatch', 'holographic-ui', 'health-data', 'futuristic'],
    promptText: 'Wearable tech advertisement showing [Product Name] surrounded by floating holographic heartbeat UI rings, dark matte background, sharp edge lighting',
    description: 'Floating holographic heartbeat UI rings around wearable tech.'
  },
  {
    id: 'nb-tech-003',
    title: 'Noise Cancelling Acoustic Foam Studio',
    category: 'tech',
    tags: ['acoustic-foam', 'studio-monitor', 'audio-gear', 'clean-sound'],
    promptText: 'Pro audio gear commercial photo of [Product Name] resting on dark geometric acoustic foam panels, soft amber rim lighting, razor sharp detail',
    description: 'Pro audio gear on dark geometric acoustic foam panels.'
  },
  {
    id: 'nb-tech-004',
    title: 'Anodized Space Gray VR Headset',
    category: 'tech',
    tags: ['vr-headset', 'space-gray', 'metaverse', 'ambient-light'],
    promptText: 'Next-gen VR hardware advertisement featuring [Product Name] on a reflective dark glass surface, purple and blue ambient glow, sleek futuristic styling',
    description: 'Reflective dark glass with purple and blue ambient VR glow.'
  },
  {
    id: 'nb-tech-005',
    title: 'Exploded View Component Engineering',
    category: 'tech',
    tags: ['exploded-view', 'precision-engineering', 'hardware', '3d-cad'],
    promptText: 'Industrial engineering advertisement showing [Product Name] in a suspended exploded component view, floating microchips and aluminum housing, clean white CAD background',
    description: 'Suspended exploded view showing internal microchips and chassis.'
  },
  {
    id: 'nb-tech-006',
    title: 'MagSafe Wireless Charger Floating Magnet',
    category: 'tech',
    tags: ['magsafe', 'wireless-charger', 'magnetic-levitation', 'minimal'],
    promptText: 'Minimalist smartphone accessory ad featuring [Product Name] magnetically hovering over a brushed silver charging puck, soft directional studio light',
    description: 'Magnetically hovering over brushed silver wireless charging puck.'
  },
  {
    id: 'nb-tech-007',
    title: 'Drone Carbon Fiber Propeller Haze',
    category: 'tech',
    tags: ['drone', 'carbon-propeller', 'aerodynamics', 'high-tech'],
    promptText: 'Aerial tech commercial photograph of [Product Name] with spinning carbon fiber propellers, subtle motion wind trail haze, dark slate studio',
    description: 'Carbon fiber drone with spinning motion wind trails.'
  },
  {
    id: 'nb-tech-008',
    title: 'Smart Speaker Wood Mesh Warm Home',
    category: 'tech',
    tags: ['smart-speaker', 'wood-mesh', 'cozy-interior', 'ambient-audio'],
    promptText: 'Lifestyle audio advertisement for [Product Name] placed on a walnut sideboard in a modern cozy living room, warm ambient lamp light, elegant acoustic fabric mesh',
    description: 'Walnut sideboard with warm ambient lamp light.'
  },

  // ==========================================
  // 11. ARCHITECTURE & INTERIOR DESIGN (6)
  // ==========================================
  {
    id: 'nb-arch-001',
    title: 'Brutalist Concrete Villa Skylight',
    category: 'architecture',
    tags: ['brutalist', 'concrete-villa', 'skylight-sunbeam', 'architectural-digest'],
    promptText: 'Architectural Digest feature shot of [Product Name] inside a modern brutalist concrete villa, illuminated by a sunbeam through a ceiling skylight, minimalist interior decoration',
    description: 'Brutalist concrete architecture with skylight sunbeam rays.'
  },
  {
    id: 'nb-arch-002',
    title: 'Scandinavian Birch Wood Living Space',
    category: 'architecture',
    tags: ['nordic-interior', 'birch-wood', 'sunlit-living-room', 'cozy'],
    promptText: 'Nordic interior design advertisement featuring [Product Name] placed on a light birch wood coffee table in a sunlit Scandinavian living room, neutral linen accents, cozy atmosphere',
    description: 'Scandinavian sunlit living room with natural birch wood.'
  },
  {
    id: 'nb-arch-003',
    title: 'Japanese Wabi-Sabi Tatami & Bamboo',
    category: 'architecture',
    tags: ['wabi-sabi', 'tatami-mat', 'bamboo-screen', 'zen-space'],
    promptText: 'Zen wabi-sabi interior photography of [Product Name] set upon a woven tatami mat beside a sliding bamboo Shoji screen, soft dappled garden sunlight',
    description: 'Woven tatami mat setting beside bamboo Shoji screen.'
  },
  {
    id: 'nb-arch-004',
    title: 'Mid-Century Modern Walnut Credenza',
    category: 'architecture',
    tags: ['mid-century', 'walnut-credenza', 'vintage-lamp', 'warm-tones'],
    promptText: 'Mid-century modern home advertisement for [Product Name] resting on a polished walnut credenza, vintage brass lamp, warm ambient evening light',
    description: 'Polished walnut credenza with vintage brass lamp.'
  },
  {
    id: 'nb-arch-005',
    title: 'Industrial Loft Exposed Red Brick',
    category: 'architecture',
    tags: ['industrial-loft', 'exposed-brick', 'black-steel', 'urban-home'],
    promptText: 'Urban loft interior commercial showcasing [Product Name] on a black steel shelf against an authentic exposed red brick wall, soft window daylight',
    description: 'Black steel shelf against authentic exposed red brick wall.'
  },
  {
    id: 'nb-arch-006',
    title: 'Mediterranean Villa Archway Terrace',
    category: 'architecture',
    tags: ['mediterranean', 'terracotta-terrace', 'sea-view', 'sun-kissed'],
    promptText: 'Luxury resort advertisement featuring [Product Name] on a whitewashed Mediterranean terrace with terracotta tiles, overlooking blue sea archways at sunset',
    description: 'Whitewashed Mediterranean terrace overlooking blue sea.'
  },

  // ==========================================
  // 12. SPORTS & ATHLETIC FITNESS (6)
  // ==========================================
  {
    id: 'nb-sports-001',
    title: 'Night Stadium Floodlights & Running Track',
    category: 'sports',
    tags: ['stadium-floodlights', 'running-track', 'athletic', 'high-energy'],
    promptText: 'High performance athletic advertisement for [Product Name] on a dark running track under intense stadium floodlights, water mist droplets in the air, high contrast dynamic energy',
    description: 'Night running track under intense stadium floodlights.'
  },
  {
    id: 'nb-sports-002',
    title: 'Crossfit Gym Rubber Floor & Chalk Dust',
    category: 'sports',
    tags: ['crossfit-gym', 'chalk-dust', 'rubber-floor', 'raw-strength'],
    promptText: 'Gritty fitness advertisement for [Product Name] sitting on matte black gym rubber flooring, airborne white chalk dust particles, dramatic side key light',
    description: 'Matte black gym rubber floor with airborne chalk dust.'
  },
  {
    id: 'nb-sports-003',
    title: 'Mountain Trail Summit Sunset',
    category: 'sports',
    tags: ['mountain-summit', 'trail-running', 'outdoor-fitness', 'sunset'],
    promptText: 'Outdoor trail performance commercial featuring [Product Name] on a rugged granite mountain peak at sunset, vast mountain range panorama background',
    description: 'Rugged granite mountain peak with vast sunset panorama.'
  },
  {
    id: 'nb-sports-004',
    title: 'Olympic Swimming Pool Lane Ripples',
    category: 'sports',
    tags: ['olympic-pool', 'underwater-lane', 'blue-water', 'swimming'],
    promptText: 'High speed aquatic sports photo of [Product Name] positioned above shimmering blue swimming pool lanes, crystal clear water reflections, intense overhead arena lights',
    description: 'Blue swimming pool lanes with overhead arena lights.'
  },
  {
    id: 'nb-sports-005',
    title: 'Boxing Ring Ropes & Fog Atmosphere',
    category: 'sports',
    tags: ['boxing-ring', 'ring-ropes', 'spotlight-fog', 'champion'],
    promptText: 'Dramatic sports photography for [Product Name] resting inside a dimly lit boxing ring, single overhead spotlight piercing atmospheric fog, red ring ropes',
    description: 'Boxing ring ropes with overhead spotlight piercing fog.'
  },
  {
    id: 'nb-sports-006',
    title: 'Surfboard Ocean Barrel Wave',
    category: 'sports',
    tags: ['ocean-wave', 'surfing-barrel', 'turquoise-water', 'action'],
    promptText: 'Action sports advertisement showing [Product Name] inside a massive churning turquoise ocean wave barrel, golden sunbeams through water',
    description: 'Inside a massive churning turquoise ocean wave barrel.'
  },

  // ==========================================
  // 13. REAL ESTATE & LUXURY INTERIORS (4)
  // ==========================================
  {
    id: 'nb-re-001',
    title: 'Penthouse Sunset Skyline View',
    category: 'realestate',
    tags: ['penthouse', 'skyline-sunset', 'floor-to-ceiling-glass', 'luxury-living'],
    promptText: 'Real estate interior luxury staging featuring [Product Name] inside a modern penthouse apartment, panoramic floor-to-ceiling glass windows overlooking a glowing city skyline at sunset',
    description: 'Modern penthouse apartment with panoramic skyline sunset view.'
  },
  {
    id: 'nb-re-002',
    title: 'Infinity Pool Villa Sunset Reflection',
    category: 'realestate',
    tags: ['infinity-pool', 'luxury-villa', 'sunset-reflection', 'resort'],
    promptText: 'High-end resort advertisement showing [Product Name] on a teak deck beside a calm infinity pool, reflection of orange sunset sky and palm trees',
    description: 'Teak deck beside an infinity pool reflecting sunset sky.'
  },
  {
    id: 'nb-re-003',
    title: 'Modern Marble Kitchen Island',
    category: 'realestate',
    tags: ['marble-island', 'gourmet-kitchen', 'pendant-lights', 'interior-staging'],
    promptText: 'Architectural interior photo of [Product Name] placed on a waterfall Calacatta marble kitchen island, warm brass pendant lighting, modern luxury staging',
    description: 'Waterfall Calacatta marble kitchen island with brass pendants.'
  },
  {
    id: 'nb-re-004',
    title: 'Sunroom Glass Atrium Botanical',
    category: 'realestate',
    tags: ['sunroom-atrium', 'glass-house', 'botanical-garden', 'natural-sunlight'],
    promptText: 'Bright real estate commercial photo of [Product Name] inside a sunlit glass atrium filled with exotic indoor plants, sunbeams, pristine garden view',
    description: 'Sunlit glass atrium filled with exotic indoor greenery.'
  },

  // ==========================================
  // 14. GAMING & ESPORTS BATTLESTATIONS (4)
  // ==========================================
  {
    id: 'nb-game-001',
    title: 'RGB Battlestation Desk Haze',
    category: 'gaming',
    tags: ['rgb-led', 'gaming-battlestation', 'esports', 'teal-purple'],
    promptText: 'Pro gaming ad for [Product Name] sitting on a sleek dark desk surrounded by customizable RGB LED light bars, subtle purple and teal haze, ultra modern esports aesthetic',
    description: 'Pro gaming desk setup with customizable RGB LED lighting.'
  },
  {
    id: 'nb-game-002',
    title: 'Cyber Esports Tournament Arena',
    category: 'gaming',
    tags: ['esports-arena', 'stadium-screens', 'laser-show', 'crowd'],
    promptText: 'Epic esports tournament commercial showing [Product Name] on a main stage pod, massive background LED screens displaying game graphics, red laser light show',
    description: 'Esports tournament main stage with laser light show.'
  },
  {
    id: 'nb-game-003',
    title: 'Overclocked Liquid Cooling Tubes',
    category: 'gaming',
    tags: ['liquid-cooling', 'uv-reactive', 'pc-rig', 'overclocked'],
    promptText: 'Custom PC gaming advertisement featuring [Product Name] beside glowing UV-reactive green liquid cooling tubes inside an anodized aluminum PC case',
    description: 'Custom PC rig with UV-reactive green liquid cooling tubes.'
  },
  {
    id: 'nb-game-004',
    title: 'Neon Cyber Arcade Cabinet Glow',
    category: 'gaming',
    tags: ['arcade-machine', 'retro-gaming', 'neon-magenta', 'nostalgia'],
    promptText: 'Nostalgic arcade gaming ad for [Product Name] on a reflective black glass counter beside retro arcade machine marquees, magenta and blue neon light',
    description: 'Retro arcade machine marquees with magenta neon glow.'
  },

  // ==========================================
  // 15. SOCIAL MEDIA & HIGH CTR BANNERS (4)
  // ==========================================
  {
    id: 'nb-social-001',
    title: 'High-CTR Pop Art Contrast Banner',
    category: 'socialmedia',
    tags: ['high-ctr', 'pop-art', 'instagram-ad', 'split-color'],
    promptText: 'Eye-catching social media advertisement for [Product Name] on a dual split background of vibrant yellow and electric indigo, bold drop shadow, high contrast layout optimized for Instagram feeds',
    description: 'Vibrant yellow and electric indigo split background for social ads.'
  },
  {
    id: 'nb-social-002',
    title: 'Floating TikTok Product Tag Badge',
    category: 'socialmedia',
    tags: ['tiktok-ad', 'viral-product', 'floating-badge', 'trendy-colors'],
    promptText: 'Viral TikTok social ad composition featuring [Product Name] floating against a bright coral and teal gradient, soft 3D shadows, high engagement layout',
    description: 'Coral and teal gradient optimized for viral video feeds.'
  },
  {
    id: 'nb-social-003',
    title: 'Black Friday Cyber Sale Banner',
    category: 'socialmedia',
    tags: ['black-friday', 'cyber-sale', 'gold-3d-text', 'dark-discount'],
    promptText: 'High conversion promo banner for [Product Name], dark luxury background with metallic 3D gold accents, high contrast sales lighting, crisp advertising composition',
    description: 'Promo sales banner with 3D gold accents and high contrast.'
  },
  {
    id: 'nb-social-004',
    title: 'Minimalist Pinterest Editorial Grid',
    category: 'socialmedia',
    tags: ['pinterest-grid', 'aesthetic-flatlay', 'soft-pastel', 'curated'],
    promptText: 'Curated Pinterest aesthetic photo of [Product Name] in an organized flatlay layout on warm cream background, soft organic shadows, high viral shareability',
    description: 'Curated Pinterest flatlay on warm cream background.'
  }
];
