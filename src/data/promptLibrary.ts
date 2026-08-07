import { MainCategory } from '../types';

export const MAIN_CATEGORIES_DATA: MainCategory[] = [
  {
    id: 'commercial-workspace',
    name: 'Commercial & Workspace',
    iconName: 'Building',
    description: 'Executive desks, startup hubs, modern open-plan offices, boardrooms, and creative agency studios',
    subcategories: [
      {
        id: 'executive-office',
        name: 'Executive & Corporate Desks',
        description: 'Polished hardwood, sleek desk lamps, high-rise views, and executive prestige',
        prompts: [
          {
            id: 'exec-1',
            label: 'Professional office desk',
            prompt: 'A sleek professional office desk with a modern laptop, ambient warm lamp, and BOULT audio gear placed on polished oak wood with soft background bokeh blur.',
            tags: ['office', 'desk', 'laptop', 'corporate', 'executive']
          },
          {
            id: 'exec-2',
            label: 'High-rise skyline executive office',
            prompt: 'Executive mahogany desk inside a glass-walled skyscraper office overlooking Manhattan skyline at dusk. Soft ambient floor lamps, leather armchair, and BOULT active noise cancelling headphones showcased on a leather desk mat.',
            tags: ['skyscraper', 'skyline', 'mahogany', 'dusk', 'executive']
          },
          {
            id: 'exec-3',
            label: 'Minimalist Scandinavian workstation',
            prompt: 'Clean Scandinavian light oak desk with an ultra-thin monitor, brass desk accessories, a green fiddle-leaf fig plant, and BOULT matte white earbuds resting on a felt pad.',
            tags: ['scandinavian', 'minimalist', 'light oak', 'clean']
          },
          {
            id: 'exec-4',
            label: 'Boardroom conference table',
            prompt: 'High-gloss dark walnut boardroom conference table with ambient recessed ceiling lights, crystal water glasses, and BOULT premium over-ear headphones placed at the head of the table.',
            tags: ['boardroom', 'walnut', 'corporate', 'conference']
          },
          {
            id: 'exec-5',
            label: 'Modern corner office daylight',
            prompt: 'Bright sunlit corner office with floor-to-ceiling windows, ergonomic mesh chair, wireless keyboard, and BOULT smartwatch displaying fitness metrics on a glass desk top.',
            tags: ['sunlit', 'corner office', 'smartwatch', 'daylight']
          },
          {
            id: 'exec-6',
            label: 'CEO leather desk setup',
            prompt: 'Dark vintage leather desk with brass vintage pen holder, luxury notepad, warm Edison bulb lamp, and BOULT metallic neckband earphones gracefully displayed.',
            tags: ['vintage', 'leather', 'brass', 'ceo']
          },
          {
            id: 'exec-7',
            label: 'Architectural studio workstation',
            prompt: 'Architect workspace filled with drafting blueprints, aluminum ruler, desk magnifier, soft architectural lamps, and BOULT ANC headphones resting beside a graphite pencil.',
            tags: ['architect', 'blueprints', 'drafting', 'studio']
          },
          {
            id: 'exec-8',
            label: 'Financial trader multi-screen setup',
            prompt: 'High-tech financial trading desk with three curved monitors showing stock graphs, LED backlighting, and BOULT gaming wireless earbuds ready on a magnetic charger.',
            tags: ['financial', 'trading', 'multi-monitor', 'stocks']
          }
        ]
      },
      {
        id: 'creative-startup',
        name: 'Creative Agency & Startup Hubs',
        description: 'Vibrant co-working spaces, loft offices, design studios, and podcast nooks',
        prompts: [
          {
            id: 'crea-1',
            label: 'Loft co-working studio',
            prompt: 'Industrial brick-walled co-working loft with warm festoon lights, standing wooden desk, mechanical keyboard, and BOULT true wireless earbuds in a matte black case.',
            tags: ['loft', 'coworking', 'brick', 'industrial']
          },
          {
            id: 'crea-2',
            label: 'Graphic design workstation',
            prompt: 'Color-calibrated design studio setup with drawing tablet, Pantone color swatches, ambient RGB accent strip, and BOULT wireless headphones hanging on a brass stand.',
            tags: ['design', 'pantone', 'drawing tablet', 'rgb']
          },
          {
            id: 'crea-3',
            label: 'Podcast & broadcasting booth',
            prompt: 'Professional acoustic foam insulated podcast recording booth with a condenser microphone on a boom arm, pop filter, and BOULT studio monitoring headphones on the desk.',
            tags: ['podcast', 'broadcasting', 'acoustic', 'studio']
          },
          {
            id: 'crea-4',
            label: 'UI/UX developer setup',
            prompt: 'Dual vertical screen programmer workstation with dark theme code IDE, mechanical keycaps, Monstera leaf shadows, and BOULT active noise cancelling earbuds.',
            tags: ['developer', 'coding', 'mechanical keyboard', 'uiux']
          },
          {
            id: 'crea-5',
            label: 'Artisanal product design workspace',
            prompt: 'Clay modeling and industrial design desk with 3D printed prototypes, calipers, warm studio lamp, and BOULT sleek smartwatch in a floating display casing.',
            tags: ['industrial design', 'prototypes', '3d printing', 'artisanal']
          },
          {
            id: 'crea-6',
            label: 'Social media creator studio',
            prompt: 'Vibrant Youtube creator desk with ring light, camera on tripod, colorful pastel backdrop panels, and BOULT RGB bluetooth party speaker vibrating on the desk.',
            tags: ['creator', 'youtube', 'ring light', 'vibrant']
          },
          {
            id: 'crea-7',
            label: 'Home office balcony nook',
            prompt: 'Cozy sunlit balcony work nook with potted ferns, ceramic mug of tea, tablet with stylus, and BOULT wireless earphones soaking in morning sunshine.',
            tags: ['balcony', 'home office', 'sunshine', 'ferns']
          }
        ]
      },
      {
        id: 'industrial-facilities',
        name: 'High-Tech Facilities & Labs',
        description: 'Cleanrooms, server hubs, robotics labs, and automated smart factories',
        prompts: [
          {
            id: 'ind-1',
            label: 'Cybernetic datacenter server room',
            prompt: 'Futuristic datacenter room with blue LED server rack glows, glass floor reflections, and BOULT high-performance headphones floating on a magnetic pedestal.',
            tags: ['datacenter', 'datacenter', 'led', 'futuristic']
          },
          {
            id: 'ind-2',
            label: 'Precision cleanroom laboratory',
            prompt: 'Ultra-clean white robotics laboratory with soft diffused overhead light panels and BOULT wireless tech resting on a polished chrome inspection tray.',
            tags: ['cleanroom', 'laboratory', 'white', 'precision']
          },
          {
            id: 'ind-3',
            label: 'Automated smart warehouse',
            prompt: 'Modern automated logistics facility with ambient floor laser lines and BOULT rugged sports audio displayed on an industrial carbon fiber platform.',
            tags: ['warehouse', 'industrial', 'carbon fiber', 'modern']
          },
          {
            id: 'ind-4',
            label: 'Audio acoustic testing chamber',
            prompt: 'Anechoic acoustic testing chamber with soundproof geometric wedge walls, central glowing pedestal, and BOULT flagship audiophile headphones resting on glass head mold.',
            tags: ['anechoic', 'soundproof', 'audiophile', 'testing']
          },
          {
            id: 'ind-5',
            label: 'Microchip cleanroom inspection',
            prompt: 'High-tech semiconductor wafer manufacturing line with turquoise cleanroom glow, optical microscopes, and BOULT precision engineered earbuds resting on silicon wafer tray.',
            tags: ['semiconductor', 'cleanroom', 'microchip', 'precision']
          }
        ]
      },
      {
        id: 'retail-display',
        name: 'Retail Flagship & Boutique Displays',
        description: 'Luxurious retail counters, glass showcases, and pop-up store installations',
        prompts: [
          {
            id: 'ret-1',
            label: 'Luxury flagship audio counter',
            prompt: 'High-end retail boutique display counter with backlit acrylic panels, velvet padding, and BOULT flagship earbuds illuminated by precision spotlights.',
            tags: ['boutique', 'retail', 'spotlight', 'luxury']
          },
          {
            id: 'ret-2',
            label: 'Minimalist pop-up store stage',
            prompt: 'Modern architectural pop-up exhibition stand with brushed aluminum accents and BOULT smartwatch showcased inside an acrylic cube.',
            tags: ['popup', 'exhibition', 'aluminum', 'architectural']
          },
          {
            id: 'ret-3',
            label: 'Airport Duty-Free electronics lounge',
            prompt: 'Sleek illuminated duty-free store display at international airport lounge with glowing neon branding pillar and BOULT noise-cancelling headphones on polished glass shelf.',
            tags: ['airport', 'duty free', 'travel', 'lounge']
          },
          {
            id: 'ret-4',
            label: 'Department store glass vitrine',
            prompt: 'High fashion department store window vitrine with floating satin ribbons, golden spotlights, and BOULT luxury wireless earbuds on a pedestal.',
            tags: ['vitrine', 'window display', 'satin', 'gold']
          }
        ]
      }
    ]
  },
  {
    id: 'studio-architectural',
    name: 'Studio & Architectural Renders',
    iconName: 'Palette',
    description: 'Minimalist pastel stages, dark luxury marble, 3D abstract shapes, and frosted glass setups',
    subcategories: [
      {
        id: 'minimalist-studio',
        name: 'Minimalist & Pastel Studio',
        description: 'Clean architectural podiums, geometric shapes, soft shadows, and pastel tones',
        prompts: [
          {
            id: 'min-1',
            label: 'Minimalist studio',
            prompt: 'A clean minimalist studio podium with soft architectural lighting, pastel geometric background, and subtle soft drop shadows around BOULT product.',
            tags: ['minimalist', 'pastel', 'podium', 'shadows']
          },
          {
            id: 'min-2',
            label: 'Frosted glass & beige plaster',
            prompt: 'Architectural studio scene featuring beige plaster arches, frosted glass discs, warm ambient side light, and BOULT white audio gear on a travertine pedestal.',
            tags: ['frosted glass', 'beige', 'travertine', 'arches']
          },
          {
            id: 'min-3',
            label: 'Monochromatic matte grey stage',
            prompt: 'Monochromatic neutral grey studio render with soft raytraced bounce lights, organic concrete shapes, and BOULT matte black earbuds.',
            tags: ['monochrome', 'concrete', 'raytraced', 'grey']
          },
          {
            id: 'min-4',
            label: 'Terrazzo pedestal & pastel arch',
            prompt: 'A trendy pastel studio backdrop with pink terrazzo cylinder pedestal, soft sage green background wall, and BOULT wireless earphones.',
            tags: ['terrazzo', 'pastel', 'sage', 'trendy']
          },
          {
            id: 'min-5',
            label: 'Soft clay geometric blocks',
            prompt: 'Contemporary product photography featuring soft clay geometric blocks in dusty peach and cream colors, with BOULT true wireless earbud case resting on top.',
            tags: ['clay', 'peach', 'cream', 'geometric']
          },
          {
            id: 'min-6',
            label: 'Zen sand ripples & bamboo',
            prompt: 'Minimalist Japanese zen garden scene with raked white sand ripples, smooth river stones, subtle bamboo shoot shadows, and BOULT noise-cancelling headphones.',
            tags: ['zen', 'japanese', 'sand ripples', 'bamboo']
          },
          {
            id: 'min-7',
            label: 'Corrugated paper & warm light',
            prompt: 'Architectural studio setup with organic wavy corrugated paper backdrop, warm sunrise side shadow, and BOULT beige wireless neckband.',
            tags: ['corrugated', 'paper', 'warm shadow', 'organic']
          },
          {
            id: 'min-8',
            label: 'Glass prism rainbow refraction',
            prompt: 'Clean white studio pedestal with triangular crystal prisms splitting sunlight into vibrant rainbow spectrum light leaks onto BOULT clear edition earbuds.',
            tags: ['prism', 'rainbow', 'refraction', 'light leak']
          }
        ]
      },
      {
        id: 'dark-luxury-studio',
        name: 'Dark & Cyberpunk Luxury',
        description: 'Dramatic lighting, gold rim lights, reflective black glass, smoke, and neon accents',
        prompts: [
          {
            id: 'drk-1',
            label: 'Dark luxury studio',
            prompt: 'Dark luxury studio setting with dramatic cyan and gold neon rim lighting, floating BOULT earbuds on a dark reflective glass podium with smoke particles.',
            tags: ['dark', 'luxury', 'neon', 'gold', 'reflective']
          },
          {
            id: 'drk-2',
            label: 'Black marble & liquid gold',
            prompt: 'High-contrast commercial photography of black polished Nero Marquina marble with swirling golden veins and BOULT metallic smartwatch glistening under spotlight.',
            tags: ['marble', 'gold', 'spotlight', 'black']
          },
          {
            id: 'drk-3',
            label: 'Holographic glass showcase',
            prompt: 'Dark cyber studio with floating iridescent glass prisms, subtle rainbow laser refractions, and BOULT gaming headset placed at center.',
            tags: ['holographic', 'prisms', 'cyber', 'laser']
          },
          {
            id: 'drk-4',
            label: 'Volcanic basalt & ember glow',
            prompt: 'Dramatic product shot on rough black volcanic basalt rock with glowing orange fiery embers beneath, dark atmospheric fog, and BOULT rugged sports audio.',
            tags: ['volcanic', 'basalt', 'embers', 'fire']
          },
          {
            id: 'drk-5',
            label: 'Obsidian mirror pool',
            prompt: 'Dark moody studio setup with a shallow obsidian water mirror reflecting ambient cyan LED light rings, with BOULT metallic earbuds hovering just above the surface.',
            tags: ['obsidian', 'mirror', 'water', 'led ring']
          },
          {
            id: 'drk-6',
            label: 'Gold leaf foliage luxury',
            prompt: 'Opulent dark studio set with handcrafted 24k gold leaf palm fronds, dark velvet background, and BOULT gold-accented ANC headphones resting on a pedestal.',
            tags: ['gold leaf', 'velvet', 'opulent', 'luxury']
          },
          {
            id: 'drk-7',
            label: 'Carbon fiber sci-fi vault',
            prompt: 'Futuristic sci-fi security vault with woven carbon fiber walls, blue laser grid lines, and BOULT flagship wireless earbuds floating inside a protective magnetic field.',
            tags: ['carbon fiber', 'sci-fi', 'vault', 'laser grid']
          },
          {
            id: 'drk-8',
            label: 'High-tech smoke & spotlight',
            prompt: 'Cinematic dark studio with sharp white spotlight piercing through heavy atmospheric stage fog, highlighting the metallic texture of BOULT neckband earbuds.',
            tags: ['spotlight', 'fog', 'smoke', 'cinematic']
          }
        ]
      },
      {
        id: 'abstract-3d-conceptual',
        name: 'Abstract & Liquid Elements',
        description: 'Magnetic fluid, liquid chrome ripples, levitating water droplets, and zero gravity',
        prompts: [
          {
            id: 'abs-1',
            label: 'Liquid mercury ripple',
            prompt: 'Abstract studio composition with swirling liquid mercury ripple, high chrome metallic sheen, soft studio reflection, and floating BOULT earbud casing.',
            tags: ['liquid metal', 'chrome', 'abstract', 'ripple']
          },
          {
            id: 'abs-2',
            label: 'Floating anti-gravity spheres',
            prompt: 'Conceptual 3D artwork featuring floating matte spheres, levitating water droplets, zero gravity physics, and BOULT audio gear surrounded by golden dust.',
            tags: ['anti-gravity', 'floating', 'spheres', 'gold dust']
          },
          {
            id: 'abs-3',
            label: 'Swirling colorful acoustic soundwaves',
            prompt: 'Visual representation of audio with 3D swirling holographic soundwave ribbons in cyan, magenta, and gold wrapping around BOULT wireless headphones.',
            tags: ['soundwaves', 'holographic', 'audio visual', 'ribbons']
          },
          {
            id: 'abs-4',
            label: 'Ferrofluid magnetic spikes',
            prompt: 'High-tech liquid magnetic ferrofluid forming symmetrical sharp organic spikes around a central pedestal holding BOULT true wireless gaming earbuds.',
            tags: ['ferrofluid', 'magnetic', 'spikes', 'sci-fi']
          },
          {
            id: 'abs-5',
            label: 'Floating glass bubble cluster',
            prompt: 'Surreal aesthetic render of transparent soap bubbles floating in zero gravity, reflecting pastel sunset gradients, with BOULT white earbuds inside a bubble.',
            tags: ['bubbles', 'zero gravity', 'pastel', 'surreal']
          },
          {
            id: 'abs-6',
            label: 'Geometric metallic ribbon swirl',
            prompt: 'Sleek 3D composition with brushed rose gold metallic ribbons swirling dynamically through space around BOULT luxury active smartwatch.',
            tags: ['ribbon', 'rose gold', 'swirl', '3d render']
          }
        ]
      }
    ]
  },
  {
    id: 'outdoor-nature',
    name: 'Nature & Landscapes',
    iconName: 'Trees',
    description: 'Misty pine forests, golden beaches, snow summits, autumn groves, and tropical waterfalls',
    subcategories: [
      {
        id: 'forests-mountains',
        name: 'Forests & Sunlit Mountains',
        description: 'Lush green foliage, sunrise mist, alpine peaks, and mossy stone trail setups',
        prompts: [
          {
            id: 'nat-1',
            label: 'Nature landscape',
            prompt: 'Lush green nature landscape with a misty forest trail at sunrise, soft golden sunlight filtering through leaves around BOULT wireless earphones placed on mossy stone.',
            tags: ['nature', 'forest', 'sunrise', 'moss']
          },
          {
            id: 'nat-2',
            label: 'Alpine mountain summit',
            prompt: 'Crisp high-altitude alpine mountain peak backdrop with snow-capped ridges, deep blue sky, and BOULT sports headphones placed on granite rock.',
            tags: ['alpine', 'mountain', 'snow', 'granite']
          },
          {
            id: 'nat-3',
            label: 'Autumn birch grove',
            prompt: 'Serene autumn forest grove with golden yellow leaves gently falling, soft morning mist, and BOULT neckband earphone resting on rustic birch tree trunk.',
            tags: ['autumn', 'leaves', 'birch', 'mist']
          },
          {
            id: 'nat-4',
            label: 'Redwood forest god-rays',
            prompt: 'Majestic giant redwood forest with dramatic volumetric god-rays of sunlight cutting through morning fog, with BOULT outdoor speaker sitting on a redwood log.',
            tags: ['redwood', 'god rays', 'fog', 'volumetric']
          },
          {
            id: 'nat-5',
            label: 'Cherry blossom spring garden',
            prompt: 'Enchanting Japanese sakura garden with delicate pink cherry blossom petals falling, soft morning sunlight, and BOULT rose gold earbuds resting on smooth stone.',
            tags: ['cherry blossom', 'sakura', 'pink', 'spring']
          },
          {
            id: 'nat-6',
            label: 'Bamboo forest zen trail',
            prompt: 'Tall emerald green bamboo forest with sunlight filtering through stalks, fine dew drops, and BOULT noise-cancelling headphones on a natural bamboo bench.',
            tags: ['bamboo', 'emerald', 'zen', 'dew drops']
          },
          {
            id: 'nat-7',
            label: 'Desert dune sunset',
            prompt: 'Vast golden sand dunes at sunset with long dramatic shadows, warm orange horizon, and BOULT rugged smartwatch sitting on smooth wind-rippled sand.',
            tags: ['desert', 'dunes', 'sunset', 'golden sand']
          }
        ]
      },
      {
        id: 'beaches-water',
        name: 'Beaches, Ocean & Water',
        description: 'Golden hour ocean waves, tropical palm tree shadows, crystalline waterfalls, and pools',
        prompts: [
          {
            id: 'coa-1',
            label: 'Golden Hour Beach',
            prompt: 'Warm golden hour ocean beach with soft rolling waves, palm tree shadows, fine white sand, and luxury vacation mood showcasing BOULT splashproof earbuds.',
            tags: ['beach', 'golden hour', 'waves', 'palms']
          },
          {
            id: 'coa-2',
            label: 'Crystalline waterfall pool',
            prompt: 'Tropical rainforest waterfall with turquoise natural pool, water droplets catching sunlight, and water-resistant BOULT speaker resting on wet volcanic rock.',
            tags: ['waterfall', 'turquoise', 'tropical', 'waterproof']
          },
          {
            id: 'coa-3',
            label: 'Tropical infinity pool resort',
            prompt: 'Luxury tropical resort infinity pool overflowing into the ocean at sunset, cocktail glass on teak deck, and BOULT active smartwatch glowing on sunbed.',
            tags: ['infinity pool', 'resort', 'luxury', 'sunset']
          },
          {
            id: 'coa-4',
            label: 'Underwater coral reef spray',
            prompt: 'Crystal clear tropical ocean water surface shot with light caustics dancing underwater, sunbeams, and waterproof BOULT earbuds submerged safely.',
            tags: ['underwater', 'caustics', 'coral', 'waterproof']
          },
          {
            id: 'coa-5',
            label: 'Dewy leaf rain droplets',
            prompt: 'Extreme macro shot of vibrant green monstera leaf covered in crystal clear rain droplets, with BOULT IPX7 water-resistant earbuds gleaming under sunlight.',
            tags: ['rain droplets', 'macro', 'leaf', 'waterproof']
          },
          {
            id: 'coa-6',
            label: 'Icelandic black sand beach',
            prompt: 'Dramatic Icelandic black sand beach with crashing icy turquoise Atlantic waves, white sea foam, misty atmosphere, and BOULT matte black audio gear.',
            tags: ['iceland', 'black sand', 'sea foam', 'dramatic']
          }
        ]
      }
    ]
  },
  {
    id: 'urban-lifestyle',
    name: 'Urban & Street Life',
    iconName: 'Compass',
    description: 'Neon night streets, rooftop skylines, cozy cafes, subway stations, and European alleyways',
    subcategories: [
      {
        id: 'city-nightlife',
        name: 'City Streets & Nightlife',
        description: 'Wet asphalt reflections, vibrant neon signage, city traffic bokeh, and skyscrapers',
        prompts: [
          {
            id: 'urb-1',
            label: 'Urban street',
            prompt: 'Futuristic urban street at night with wet asphalt reflections, vibrant neon signage, blurred city traffic bokeh, and bold cinematic BOULT product display.',
            tags: ['urban', 'night', 'neon', 'asphalt', 'bokeh']
          },
          {
            id: 'urb-2',
            label: 'Rooftop skyline dusk',
            prompt: 'Metropolitan rooftop terrace at dusk with panoramic glass skyscraper view, warm city horizon glow, and BOULT wireless headphones on a glass patio table.',
            tags: ['rooftop', 'dusk', 'skyline', 'terrace']
          },
          {
            id: 'urb-3',
            label: 'Underground subway platform',
            prompt: 'Atmospheric urban subway platform with moody directional tile lighting, passing train motion blur, and BOULT noise-canceling headphones.',
            tags: ['subway', 'urban', 'motion blur', 'moody']
          },
          {
            id: 'urb-4',
            label: 'Shibuya crossing neon buzz',
            prompt: 'Vibrant Tokyo Shibuya crossing at night with bustling crowd motion blur, massive billboard neon glows, and BOULT gaming earbuds highlighted on a glass podium.',
            tags: ['tokyo', 'shibuya', 'billboard', 'crowd blur']
          },
          {
            id: 'urb-5',
            label: 'Cozy European cobblestone lane',
            prompt: 'Charming European old town cobblestone street lined with warm bistro lanterns, vintage bicycle with basket, and BOULT neckband audio resting on wooden cafe chair.',
            tags: ['cobblestone', 'european', 'bistro', 'lanterns']
          },
          {
            id: 'urb-6',
            label: 'Downtown bridge sunset traffic',
            prompt: 'Cinematic suspension bridge overlooking city center during golden hour sunset with red tail-light streaks and BOULT smartwatch in foreground.',
            tags: ['bridge', 'sunset', 'tail lights', 'city']
          }
        ]
      },
      {
        id: 'cafe-leisure',
        name: 'Cafes, Bakeries & Coffee Spots',
        description: 'Artisanal coffee shops, warm brick walls, latte art, and cozy reading nooks',
        prompts: [
          {
            id: 'caf-1',
            label: 'Coffee shop workstation',
            prompt: 'Cozy artisanal coffee shop workstation with an espresso cup, rustic brick wall, morning sunlight, and BOULT noise-canceling headphones resting on a wooden table.',
            tags: ['cafe', 'coffee', 'brick', 'wooden table']
          },
          {
            id: 'caf-2',
            label: 'Bistro outdoor sidewalk',
            prompt: 'Charming Parisian sidewalk bistro table with fresh croissants, latte art, and BOULT white smartwatch placed beside a vintage sunglasses frame.',
            tags: ['bistro', 'sidewalk', 'parisian', 'latte']
          },
          {
            id: 'caf-3',
            label: 'Industrial roastery coffee bar',
            prompt: 'Modern industrial coffee roastery counter with copper espresso machine, coffee bean sack, warm Edison lights, and BOULT wireless earphones on polished concrete.',
            tags: ['roastery', 'espresso', 'copper', 'concrete']
          },
          {
            id: 'caf-4',
            label: 'Bookstore cafe reading nook',
            prompt: 'Warm library cafe nook with wooden bookshelves stretching to ceiling, steaming matcha latte cup, open hardcover book, and BOULT audio gear.',
            tags: ['bookstore', 'library', 'matcha', 'cozy']
          },
          {
            id: 'caf-5',
            label: 'Rooftop garden brunch spot',
            prompt: 'Sun-drenched rooftop garden brunch setup with avocado toast, fresh orange juice, marble tabletops, and BOULT smartwatch catching morning sun.',
            tags: ['brunch', 'rooftop', 'marble', 'sunlight']
          }
        ]
      }
    ]
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Active Lifestyle',
    iconName: 'Dumbbell',
    description: 'High-energy gyms, crossfit boxes, running tracks, cycling trails, and extreme outdoor sports',
    subcategories: [
      {
        id: 'gym-crossfit',
        name: 'Gym & Indoor Athletics',
        description: 'Dumbbells, iron weights, sweat-proof audio, chalk dust, and rubber floors',
        prompts: [
          {
            id: 'gym-1',
            label: 'Gym & Fitness workspace',
            prompt: 'High-energy fitness gym atmosphere with dumbbells, sports towel, chalk dust particles, and sweat-resistant BOULT wireless earbuds on rubber gym floor.',
            tags: ['gym', 'fitness', 'dumbbells', 'sweat-proof']
          },
          {
            id: 'gym-2',
            label: 'Crossfit arena box',
            prompt: 'Gritty industrial crossfit box with iron kettlebells, dark wooden plyo box, dynamic rim lighting, and BOULT workout neckband.',
            tags: ['crossfit', 'kettlebell', 'workout', 'industrial']
          },
          {
            id: 'gym-3',
            label: 'Boxing gym ring ropes',
            prompt: 'Atmospheric boxing club ring with leather speed bag, hanging heavy bags in background haze, dramatic overhead spotlight, and BOULT athletic smartwatch.',
            tags: ['boxing', 'ring', 'leather', 'spotlight']
          },
          {
            id: 'gym-4',
            label: 'Yoga studio sunlit hardwood',
            prompt: 'Serene yoga studio with warm morning sunlight streaming through sheer curtains, cork yoga mat, water bottle, and BOULT light-weight wireless earbuds.',
            tags: ['yoga', 'mat', 'serene', 'sunlight']
          },
          {
            id: 'gym-5',
            label: 'Indoor climbing boulder wall',
            prompt: 'Modern indoor rock climbing gym with colorful hold grips, chalk dust catching light beams, and BOULT shockproof sports smartwatch on climber wrist.',
            tags: ['climbing', 'boulder', 'chalk', 'sports']
          }
        ]
      },
      {
        id: 'outdoor-active',
        name: 'Outdoor Running & Cycling',
        description: 'Red tartan running tracks, dusty mountain bike trails, and sunset marathons',
        prompts: [
          {
            id: 'out-1',
            label: 'Sunset running track',
            prompt: 'Dynamic athletic runner on a red tartan track at golden hour sunset, sweat droplets catching sunlight, wearing matte black BOULT sports neckband.',
            tags: ['running', 'sunset', 'track', 'sports']
          },
          {
            id: 'out-2',
            label: 'Mountain trail cycling',
            prompt: 'Action sports shot on a dusty pine forest mountain bike trail with lens flare, sports helmet, and BOULT rugged wireless earbuds.',
            tags: ['cycling', 'mountain bike', 'trail', 'dust']
          },
          {
            id: 'out-3',
            label: 'Coastal highway marathon',
            prompt: 'Scenic ocean highway marathon route with athlete running along cliff edges at sunrise, crashing waves below, wearing BOULT sweat-proof earphones.',
            tags: ['marathon', 'coastal', 'highway', 'sunrise']
          },
          {
            id: 'out-4',
            label: 'Extreme snowboard mountain peak',
            prompt: 'High-action winter sports shot on a snow-covered mountain slope with powder spray, vibrant goggles reflecting blue sky, and BOULT cold-resistant sports gear.',
            tags: ['snowboard', 'powder', 'winter', 'mountains']
          },
          {
            id: 'out-5',
            label: 'Skatepark halfpipe sunset',
            prompt: 'Urban skatepark concrete bowl during purple sunset dusk with skateboarder silhouette and BOULT wireless speaker blasting music on the ramp.',
            tags: ['skatepark', 'skateboard', 'halfpipe', 'dusk']
          }
        ]
      }
    ]
  },
  {
    id: 'gaming-cyber',
    name: 'Gaming & Cyber Battlestation',
    iconName: 'Gamepad2',
    description: 'Ultra RGB battlestations, curved OLED screens, 80s synthwave arcades, and sci-fi eSports stages',
    subcategories: [
      {
        id: 'battlestations-esports',
        name: 'RGB Battlestations & Streaming',
        description: 'Curved monitors, mechanical keycaps, neon backlights, boom mics, and streamer gear',
        prompts: [
          {
            id: 'gam-1',
            label: 'High-tech gaming setup',
            prompt: 'Ultra high-tech RGB gaming desk with curved OLED monitor, mechanical keyboard, and premium BOULT gaming headset glowing in blue and purple.',
            tags: ['gaming', 'rgb', 'oled', 'battlestation']
          },
          {
            id: 'gam-2',
            label: 'Retro Synthwave 80s arcade desk',
            prompt: 'Vibrant 1980s synthwave gaming room with magenta grid wallpapers, neon palm silhouettes, and BOULT wireless headset floating over a retro console.',
            tags: ['synthwave', '80s', 'neon', 'arcade']
          },
          {
            id: 'gam-3',
            label: 'eSports arena mainstage',
            prompt: 'Massive eSports tournament mainstage with laser light shows, packed stadium crowd cheers, smoke haze, and BOULT noise-isolating pro gaming headset.',
            tags: ['esports', 'stadium', 'lasers', 'tournament']
          },
          {
            id: 'gam-4',
            label: 'Twitch streamer studio booth',
            prompt: 'Professional game streamer desk with dual camera light panels, acoustic hexagonal wall tiles, boom mic, and BOULT RGB gaming earbuds.',
            tags: ['streamer', 'twitch', 'acoustic tiles', 'mic']
          },
          {
            id: 'gam-5',
            label: 'Cyberpunk net cafe pod',
            prompt: 'Futuristic Tokyo internet cafe booth with neon purple liquid-cooled PC case, glowing mechanical keys, and BOULT low-latency earbuds.',
            tags: ['cyberpunk', 'net cafe', 'liquid cooling', 'tokyo']
          },
          {
            id: 'gam-6',
            label: 'Sim-racing cockpit desk',
            prompt: 'High-end racing simulator cockpit with force-feedback wheel, triple monitor setup, carbon fiber seat, and BOULT surround-sound gaming headset.',
            tags: ['sim racing', 'cockpit', 'triple monitor', 'carbon fiber']
          }
        ]
      }
    ]
  },
  {
    id: 'fashion-luxury',
    name: 'Fashion & High Elegance',
    iconName: 'Crown',
    description: 'Champagne silk drapery, velvet jewelry showcases, golden light, and editorial runways',
    subcategories: [
      {
        id: 'high-fashion-editorial',
        name: 'High Fashion & Silk Drape',
        description: 'Soft flowing silk, champagne tones, marble pedestals, and haute couture lighting',
        prompts: [
          {
            id: 'fas-1',
            label: 'Champagne silk drape',
            prompt: 'Haute couture studio photography featuring flowing champagne silk fabric, soft editorial lighting, and BOULT gold accent smartwatch resting on a crystal slab.',
            tags: ['fashion', 'silk', 'champagne', 'editorial']
          },
          {
            id: 'fas-2',
            label: 'Velvet jewelry showcase',
            prompt: 'Deep emerald green velvet jewelry display pedestal with warm gold spotlights, subtle glimmers, and BOULT metallic earbuds glistening inside.',
            tags: ['velvet', 'jewelry', 'emerald', 'spotlight']
          },
          {
            id: 'fas-3',
            label: 'Paris runway backlight',
            prompt: 'Paris fashion week runway stage with blinding white backdrop spotlights, subtle fog, polished black catwalk reflection, and BOULT white luxury headphones.',
            tags: ['runway', 'fashion week', 'catwalk', 'paris']
          },
          {
            id: 'fas-4',
            label: 'Rose gold mirror vanity',
            prompt: 'Luxury dressing table vanity mirror with warm Hollywood globe bulbs, perfume bottles, velvet ring dishes, and BOULT rose gold smartwatch.',
            tags: ['vanity', 'rose gold', 'dressing table', 'perfume']
          },
          {
            id: 'fas-5',
            label: 'High-gloss magazine editorial',
            prompt: 'Vogue-style high fashion studio shoot with sharp directional key light, harsh shadows, satin garments, and BOULT wireless earbuds as a chic accessory.',
            tags: ['vogue', 'editorial', 'satin', 'chic']
          }
        ]
      }
    ]
  },
  {
    id: 'food-beverage',
    name: 'Food & Culinary Settings',
    iconName: 'Coffee',
    description: 'Gourmet kitchens, cocktail bars, wine cellars, tea gardens, and bakery tables',
    subcategories: [
      {
        id: 'culinary-beverage',
        name: 'Gourmet & Beverage Spaces',
        description: 'Artisanal coffee, craft cocktails, marble kitchen counters, and fine dining',
        prompts: [
          {
            id: 'foo-1',
            label: 'Modern marble kitchen island',
            prompt: 'Sleek luxury marble kitchen island with stainless steel appliances, bowl of fresh citrus fruits, warm pendant lights, and BOULT smartwatch resting on marble.',
            tags: ['kitchen', 'marble', 'appliances', 'pendant light']
          },
          {
            id: 'foo-2',
            label: 'Speakeasy craft cocktail lounge',
            prompt: 'Dimly lit moody speakeasy bar with crystal cocktail glasses, amber whiskey decanter, dark leather booth, and BOULT metallic headphones on polished mahogany bar.',
            tags: ['speakeasy', 'whiskey', 'cocktail', 'mahogany']
          },
          {
            id: 'foo-3',
            label: 'Artisanal bakery morning light',
            prompt: 'Charming bakery kitchen table covered in dusted flour, fresh sourdough loaves, wooden rolling pin, and BOULT wireless earbuds resting beside a linen napkin.',
            tags: ['bakery', 'flour', 'sourdough', 'artisanal']
          },
          {
            id: 'foo-4',
            label: 'Organic tea estate garden',
            prompt: 'Rolling green tea plantation hills in Darjeeling at dawn, morning dew drops on tea leaves, ceramic teacup, and BOULT wireless neckband.',
            tags: ['tea estate', 'hills', 'darjeeling', 'dew']
          }
        ]
      }
    ]
  }
];
