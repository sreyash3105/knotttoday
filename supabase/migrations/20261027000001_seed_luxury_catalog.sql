-- ═══════════════════════════════════════════════════════════════
-- Seed 4-5 Unique Services Per Category (Makeup, DJ/Music, Photography, Decoration, Catering)
-- Plus Complete Luxury Jewellery & Clothing Rentals
-- ═══════════════════════════════════════════════════════════════

-- 1. SERVICES (5 UNIQUE PER CATEGORY)
insert into public.services (id, name, category, location, rating, "priceRange", description, image, phone, whatsapp, services) values
-- ─── CATEGORY 1: Makeup Artists ───
('v1', 'Glow Bridal Studio', 'Makeup Artists', 'Udaipur', 4.9, '₹15,000 – ₹35,000', 'Premium celebrity bridal makeup with HD finish, Temptu airbrush techniques, and hair styling.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200', '+91 98765 11111', '+91 98765 11111', '{"HD Bridal Makeup","Airbrush Finish","Hairstyling","Mehendi Glow"}'),
('v2', 'Aura Beauty Lounge', 'Makeup Artists', 'Jaipur', 4.7, '₹10,000 – ₹28,000', 'Expert artists specializing in traditional royal Rajasthani bridal transformations and groom styling.', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1200', '+91 98765 22222', '+91 98765 22222', '{"Traditional Bridal","Groom Grooming","Hairstyling","Saree Draping"}'),
('v3', 'Radiance Celebrity Makeovers', 'Makeup Artists', 'Mumbai', 4.8, '₹25,000 – ₹65,000', 'Red-carpet destination wedding glam team offering 3-ceremony looks for Sangeet, Pheras and Reception.', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200', '+91 98765 33333', '+91 98765 33333', '{"3-Look Package","Airbrush Makeup","Lash Extensions","Trial Session"}'),
('v4', 'Shubh Bridal Art & Draping', 'Makeup Artists', 'Delhi', 4.9, '₹18,000 – ₹40,000', 'Master saree and lehenga draping alongside contemporary glass-skin makeup for modern brides.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200', '+91 98765 44444', '+91 98765 44444', '{"Bridal Makeup","Master Draping","Jewellery Setting","Haldi Touchup"}'),
('v21', 'AyurGlow Organic Pre-Bridal Sanctuary', 'Makeup Artists', 'Udaipur', 5.0, '₹20,000 – ₹45,000', 'Holistic Ayurvedic skin detox, herbal ubtan rituals, and chemical-free bridal radiance treatments.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200', '+91 98765 55555', '+91 98765 55555', '{"Ayurvedic Ubtan","Kansa Wand Facial","Organic Body Polish","Hair Hydration"}'),

-- ─── CATEGORY 2: DJ / Music ───
('v5', 'DJ Aakash Beats & Visual Concert', 'DJ / Music', 'Udaipur', 4.8, '₹25,000 – ₹60,000', 'High-energy Bollywood, Punjabi and commercial EDM fusion equipped with synchronized lighting.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200', '+91 98888 11111', '+91 98888 11111', '{"Sangeet DJ","DJ Night","Concert Sound","CO2 Cannons"}'),
('v6', 'Vibe Sound Lab & DMX Laser Rig', 'DJ / Music', 'Jaipur', 4.7, '₹30,000 – ₹70,000', 'Arena-grade sound engineering, intelligent moving-head beams, and personalized couple intros.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200', '+91 98888 22222', '+91 98888 22222', '{"Club Sound Setup","Laser Grid Show","Special Entry Audio","Lighting Truss"}'),
('v7', 'Rhythm Riders Celebrity Touring DJ', 'DJ / Music', 'Delhi', 4.9, '₹45,000 – ₹95,000', 'Premier festival DJ known for viral Bollywood mashups, energetic MC mic work, and seamless pacing.', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200', '+91 98888 33333', '+91 98888 33333', '{"Headline DJ","Live MC Host","Custom Sangeet Edits","Dancefloor LED"}'),
('v8', 'Royal Sufi & Acoustic Ghazal Ensemble', 'DJ / Music', 'Udaipur', 4.9, '₹35,000 – ₹75,000', 'Soulful sunset live band with harmonium, tabla, rubab and acclaimed vocalists for your welcome dinner.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200', '+91 98888 44444', '+91 98888 44444', '{"6-Piece Live Band","Sufi Repertoire","Acoustic Ghazals","Dinner Ambience"}'),
('v22', 'Punjabi Dhol Symphony & Brass Horns', 'DJ / Music', 'Chandigarh', 4.9, '₹20,000 – ₹50,000', 'Thunderous 8-dhol procession with live brass trumpets to lead an unforgettable, high-energy Baraat.', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200', '+91 98888 55555', '+91 98888 55555', '{"8 Master Dholis","Brass Horns","Baraat Procession","Custom Dhol LED"}'),

-- ─── CATEGORY 3: Photography ───
('v9', 'Candid Canvas Studio', 'Photography', 'Udaipur', 4.9, '₹50,000 – ₹1,50,000', 'Award-winning documentary photojournalism capturing unscripted family laughter and emotional moments.', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200', '+91 99999 11111', '+91 99999 11111', '{"Candid Photography","Cinematic 4K Film","Drone Aerials","Pre-Wedding Shoot"}'),
('v10', 'Fairy Tale 4K Cinema & Drone Frames', 'Photography', 'Mumbai', 4.8, '₹60,000 – ₹1,80,000', 'Feature-film cinematographers providing full 45-minute documentary movies and same-day teaser reels.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200', '+91 99999 22222', '+91 99999 22222', '{"Feature Film","Same-Day Teaser","Licensed Drone Pilots","Color Grading"}'),
('v11', 'Royal Lens Pre-Wedding Productions', 'Photography', 'Jaipur', 4.9, '₹40,000 – ₹1,20,000', 'Stylized destination pre-wedding shoots at historical forts, palaces, and scenic desert sand dunes.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', '+91 99999 33333', '+91 99999 33333', '{"Destination Shoot","Wardrobe Direction","30 Fine-Art Retouches","Drone Reel"}'),
('v12', 'Artisanal Heirloom Photo & Leather Books', 'Photography', 'Delhi', 4.7, '₹35,000 – ₹90,000', 'Archival museum-grade wedding albums printed on Fuji Crystal silk sheets bound in Italian leather.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200', '+91 99999 44444', '+91 99999 44444', '{"3 Leather Albums","Silk Lay-Flat Paper","Gold Embossing","Cloud Archive"}'),
('v23', 'Vintage Monochrome & Film Studio', 'Photography', 'Bangalore', 5.0, '₹70,000 – ₹2,00,000', 'Medium format film photography and timeless black-and-white portraits for connoisseurs of classic art.', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200', '+91 99999 55555', '+91 99999 55555', '{"35mm & 120mm Film","Fine Art Prints","Timeless Portraits","Exclusive Coverage"}'),

-- ─── CATEGORY 4: Decoration ───
('v13', 'Blossom Palace Mandap Studio', 'Decoration', 'Udaipur', 4.8, '₹80,000 – ₹2,50,000', 'Exotic fresh floral mandaps, floating pond installations, and bespoke botanical backdrops.', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200', '+91 97777 11111', '+91 97777 11111', '{"Vedic Floral Mandap","Aisle Petal Shower","Chandelier Accents","Lounge Seating"}'),
('v14', 'Royal Mewari Heritage Themes', 'Decoration', 'Jaipur', 4.9, '₹60,000 – ₹2,00,000', 'Authentic royal Rajasthani palace decorations with brass urns, carved wooden jhulas, and silk drapes.', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200', '+91 97777 22222', '+91 97777 22222', '{"Royal Heritage Decor","Carved Wooden Jhula","Antique Brass Urlis","Marigold Drapes"}'),
('v15', 'Enchanted Crystal & Fairy Light Canopies', 'Decoration', 'Mumbai', 5.0, '₹1,00,000 – ₹3,50,000', 'Breathtaking overhead sea of 10,000 starry lights and crystal chandeliers for fairytale evening receptions.', 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&q=80&w=1200', '+91 97777 33333', '+91 97777 33333', '{"10,000+ Starry Lights","Crystal Chandeliers","Dimmer Controls","Reception Stage"}'),
('v16', 'Boho Sunset Marigold & Macrame Decor', 'Decoration', 'Goa', 4.7, '₹45,000 – ₹1,20,000', 'Relaxed boho-chic Mehendi and Haldi setups with macrame teepees, vibrant cushions, and tassel canopies.', 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1200', '+91 97777 44444', '+91 97777 44444', '{"Boho Teepees","Marigold Tassels","Low Seating Lounges","Printed Parasols"}'),
('v24', 'Grand Mirror Pathway & Cold Pyro Sets', 'Decoration', 'Delhi', 4.9, '₹90,000 – ₹2,80,000', 'Reflective runway stage, smokeless cold-fire sparklers, and dry-ice cloud fog for majestic varmala entries.', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200', '+91 97777 55555', '+91 97777 55555', '{"Mirror Runway","12 Cold-Pyro Fountains","Low-Lying Fog Machine","Floral Crest Wall"}'),

-- ─── CATEGORY 5: Catering ───
('v17', 'Maharaja Feast Royal Silver Thali', 'Catering', 'Udaipur', 4.8, '₹1,500 – ₹2,800 / plate', 'Lavish Marwari and Mewari culinary banquet served on ornate silver-plated tableware with royal hospitality.', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200', '+91 96666 11111', '+91 96666 11111', '{"Royal Rajwada Thali","Dal Baati Churma","Silver Tableware","Traditional Attendants"}'),
('v18', 'Spice Route Global Live Gourmet Pavilions', 'Catering', 'Jaipur', 4.9, '₹1,200 – ₹2,200 / plate', 'Live interactive wood-fired pizza ovens, sushi bar, dim sum steamers, and Mexican taco live stations.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200', '+91 96666 22222', '+91 96666 22222', '{"6 Live Global Counters","Artisanal Wood-Fired Ovens","Fresh Sushi Counter","Interactive Chefs"}'),
('v19', 'Royal Bites Molecular Cocktail & Dessert Studio', 'Catering', 'Mumbai', 5.0, '₹1,800 – ₹3,500 / plate', 'Smoked botanical cocktails, liquid nitrogen ice cream, and handcrafted Belgian chocolate dessert cascades.', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=1200', '+91 96666 33333', '+91 96666 33333', '{"Molecular Mocktails","Nitrogen Ice Cream","Chocolate Sculptures","Flare Bartenders"}'),
('v20', 'Annapurna Satvik & Regional Banquets', 'Catering', 'Ahmedabad', 4.7, '₹800 – ₹1,600 / plate', 'Pure vegetarian and Satvik royal banquets featuring traditional sweets, farsaans, and seasonal delicacies.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1200', '+91 96666 44444', '+91 96666 44444', '{"100% Pure Satvik","Gujarati Delicacies","Live Chaat Galli","Handmade Mithai"}'),
('v25', 'Midnight Khau Galli Street Food Extravaganza', 'Catering', 'Delhi', 4.8, '₹600 – ₹1,200 / plate', 'Late-night after-party comfort station serving piping hot kulchas, Mumbai pav bhaji, rolls, and kesar chai.', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200', '+91 96666 55555', '+91 96666 55555', '{"Late-Night Comfort Food","Live Tawa Counters","Kulhad Kesar Chai","Midnight Snack Boxes"}')

on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  location = excluded.location,
  rating = excluded.rating,
  "priceRange" = excluded."priceRange",
  description = excluded.description,
  image = excluded.image,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  services = excluded.services;

-- 2. FINE JEWELLERY CATALOG
insert into public.jewellery (id, name, category, "forWhom", "rentalPrice", "securityDeposit", availability, "rentalDuration", description, image) values
('jw1', 'Royal Bridal Necklace Set', 'Bridal Sets', 'Bride', 15000, 50000, 'Available', '3 days', 'Exquisite kundan and pearl bridal necklace with matching earrings.', 'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw2', 'Traditional Choker Set', 'Necklaces', 'Bride', 8000, 30000, 'Available', '2 days', 'Gold-plated choker with intricate meenakari work.', 'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw3', 'Long Temple Necklace', 'Necklaces', 'Bride', 12000, 40000, 'Limited', '3 days', 'South Indian temple jewellery long necklace with Lakshmi motifs.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'),
('jw4', 'Pearl Jhumka Earrings', 'Earrings & Jhumkas', 'Bride', 3500, 12000, 'Available', '2 days', 'Elegant pearl and gold jhumka earrings.', 'https://images.pexels.com/photos/20021569/pexels-photo-20021569.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw5', 'Bridal Jhumka Set', 'Earrings & Jhumkas', 'Bride', 5000, 18000, 'Available', '2 days', 'Heavy bridal jhumkas with kundan and pearl detailing.', 'https://images.pexels.com/photos/6986012/pexels-photo-6986012.jpeg?auto=compress&cs=tinysrgb&w=900'),
('jw6', 'Gold Plated Bangles Set', 'Bangles', 'Bride', 4000, 15000, 'Available', '3 days', 'Set of 8 gold-plated bangles with intricate carving.', 'https://images.pexels.com/photos/14825267/pexels-photo-14825267.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw7', 'Maang Tikka – Kundan', 'Maang Tikka', 'Bride', 2500, 8000, 'Available', '2 days', 'Beautiful kundan maang tikka with pearl drops.', 'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw8', 'Matha Patti – Royal', 'Matha Patti', 'Bride', 6000, 20000, 'Available', '2 days', 'Three-tier matha patti with intricate gold work.', 'https://images.pexels.com/photos/37163992/pexels-photo-37163992.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw9', 'Marathi Nath / Nose Ring', 'Nath / Nose Ring', 'Bride', 2000, 7000, 'Available', '2 days', 'Traditional pearl and gold nose ring for the bride.', 'https://images.pexels.com/photos/20021569/pexels-photo-20021569.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw10', 'Kamarbandh / Waist Belt', 'Kamarbandh', 'Bride', 4500, 16000, 'Available', '3 days', 'Ornate gold-finish waist belt with temple motifs.', 'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw11', 'Silver Anklets Pair', 'Anklets', 'Bride', 1800, 6000, 'Available', '3 days', 'Delicate silver anklets with ghungroos.', 'https://images.pexels.com/photos/14825267/pexels-photo-14825267.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw12', 'Groom Pearl Brooch', 'Groom Kilangi & Mala', 'Groom', 1500, 5000, 'Available', '2 days', 'Elegant pearl brooch for sherwani.', 'https://images.pexels.com/photos/28802603/pexels-photo-28802603.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw13', 'Sehra with Gold Strings', 'Groom Kilangi & Mala', 'Groom', 3000, 10000, 'Available', '2 days', 'Traditional sehra decorated with gold strings and flowers.', 'https://images.pexels.com/photos/20021569/pexels-photo-20021569.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw14', 'Groom Gold Necklace', 'Groom Kilangi & Mala', 'Groom', 5000, 18000, 'Limited', '2 days', 'Thick gold chain for the groom, statement piece.', 'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw15', 'Groom Silver Bracelet', 'Groom Kilangi & Mala', 'Groom', 2000, 7000, 'Available', '2 days', 'Kada-style silver bracelet for the groom.', 'https://images.pexels.com/photos/14825267/pexels-photo-14825267.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw16', 'Gold Cufflinks Pair', 'Groom Kilangi & Mala', 'Groom', 1200, 4000, 'Available', '2 days', 'Premium gold-finish cufflinks for the reception suit.', 'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  "forWhom" = excluded."forWhom",
  "rentalPrice" = excluded."rentalPrice",
  "securityDeposit" = excluded."securityDeposit",
  availability = excluded.availability,
  "rentalDuration" = excluded."rentalDuration",
  description = excluded.description,
  image = excluded.image;

-- 3. HAUTE COUTURE CLOTHING CATALOG
insert into public.clothes (id, name, category, "forWhom", size, color, "rentalPrice", "securityDeposit", availability, "rentalDuration", description, image) values
('c1', 'Red Bridal Lehenga – Royal', 'Bridal Lehenga', 'Bride', 'M', 'Red', 25000, 80000, 'Available', '3 days', 'Heavy zardozi embroidered red bridal lehenga with dupatta.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200'),
('c2', 'Maroon Wedding Saree', 'Wedding Saree', 'Bride', 'Free', 'Maroon', 12000, 40000, 'Available', '2 days', 'Silk Kanjivaram saree with gold border.', 'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c3', 'Reception Gown – Champagne', 'Reception Outfit', 'Bride', 'S', 'Champagne', 15000, 50000, 'Limited', '2 days', 'Elegant champagne reception gown with sequin work.', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=1200'),
('c4', 'Mehendi Outfit – Yellow', 'Mehendi Outfit', 'Bride', 'M', 'Yellow', 6000, 20000, 'Available', '2 days', 'Bright yellow lehenga for mehendi ceremony.', 'https://images.pexels.com/photos/20021569/pexels-photo-20021569.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c5', 'Haldi Outfit – Orange', 'Haldi Outfit', 'Bride', 'M', 'Orange', 5000, 18000, 'Available', '2 days', 'Comfortable orange cotton lehenga for haldi.', 'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c6', 'Bridal Dupatta – Net', 'Dupatta', 'Bride', 'Free', 'Red', 2000, 7000, 'Available', '2 days', 'Heavily embroidered net dupatta with gold border.', 'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c7', 'Bridal Accessories Kit', 'Bridal Accessories', 'Bride', 'Free', 'Gold', 3000, 10000, 'Available', '3 days', 'Kamarbandh, kaleere, and bridal clutch kit.', 'https://images.pexels.com/photos/14825267/pexels-photo-14825267.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c8', 'Cream Sherwani – Royal', 'Sherwani', 'Groom', 'L', 'Cream', 18000, 60000, 'Available', '3 days', 'Heavy embroidered cream sherwani with churidar.', 'https://images.pexels.com/photos/28802603/pexels-photo-28802603.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c9', 'Navy Blue Reception Suit', 'Suit', 'Groom', 'L', 'Navy', 12000, 40000, 'Available', '2 days', 'Tailored navy blue three-piece suit for reception.', 'https://images.pexels.com/photos/37163992/pexels-photo-37163992.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c10', 'Kurta Pajama – Yellow Haldi', 'Kurta Pajama', 'Groom', 'L', 'Yellow', 4000, 12000, 'Available', '2 days', 'Bright yellow silk kurta with white pajama for haldi.', 'https://images.pexels.com/photos/28802603/pexels-photo-28802603.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c11', 'Indo-Western Sangeet – Maroon', 'Indo-Western', 'Groom', 'L', 'Maroon', 10000, 35000, 'Limited', '2 days', 'Stylish maroon indo-western blazer for sangeet.', 'https://images.pexels.com/photos/33049965/pexels-photo-33049965.jpeg?auto=compress&cs=tinysrgb&w=900'),
('c12', 'Reception Blazer – Black', 'Reception Outfit', 'Groom', 'L', 'Black', 9000, 30000, 'Available', '2 days', 'Classic black blazer with Indo-western detailing.', 'https://images.pexels.com/photos/37163992/pexels-photo-37163992.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c13', 'Safa / Turban – Red & Gold', 'Safa / Turban', 'Groom', 'Free', 'Red', 2500, 8000, 'Available', '2 days', 'Royal red and gold safa with kalgi pin.', 'https://images.pexels.com/photos/20021569/pexels-photo-20021569.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c14', 'Groom Accessories Kit', 'Groom Accessories', 'Groom', 'Free', 'Gold', 2000, 7000, 'Available', '3 days', 'Brooch, cufflinks, pocket square, and mojris kit.', 'https://images.pexels.com/photos/28802603/pexels-photo-28802603.jpeg?auto=compress&cs=tinysrgb&w=1200')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  "forWhom" = excluded."forWhom",
  size = excluded.size,
  color = excluded.color,
  "rentalPrice" = excluded."rentalPrice",
  "securityDeposit" = excluded."securityDeposit",
  availability = excluded.availability,
  "rentalDuration" = excluded."rentalDuration",
  description = excluded.description,
  image = excluded.image;
