import type {
  WeddingEvent,
  Guest,
  Vendor,
  JewelleryItem,
  ClothesItem,
  Task,
  BudgetItem,
  AppNotification,
  SangeetPerformance,
  BridalPrepItem,
} from '@/types';

// ─── Wedding Info ───
export const weddingInfo = {
  brideName: 'Aishwarya',
  groomName: 'Rohan',
  weddingDate: 'December 18, 2026',
  weddingDateISO: '2026-12-18T17:00:00',
  location: 'The Leela Palace, Udaipur, Rajasthan',
  coupleInitials: 'A&R',
};

// ─── Images ───
export const images = {
  heroBride:
    'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=1600',
  brideMirror:
    'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200',
  brideRedLehenga:
    'https://images.pexels.com/photos/17154861/pexels-photo-17154861.jpeg?auto=compress&cs=tinysrgb&w=1200',
  groomSherwani:
    'https://images.pexels.com/photos/28802603/pexels-photo-28802603.jpeg?auto=compress&cs=tinysrgb&w=1200',
  groomTurban:
    'https://images.pexels.com/photos/20021569/pexels-photo-20021569.jpeg?auto=compress&cs=tinysrgb&w=1200',
  groomFull:
    'https://images.pexels.com/photos/37163992/pexels-photo-37163992.jpeg?auto=compress&cs=tinysrgb&w=1200',
  couple:
    'https://images.pexels.com/photos/38147801/pexels-photo-38147801.jpeg?auto=compress&cs=tinysrgb&w=1200',
  ceremony:
    'https://images.pexels.com/photos/4128977/pexels-photo-4128977.jpeg?auto=compress&cs=tinysrgb&w=1200',
  mandap:
    'https://images.pexels.com/photos/34079355/pexels-photo-34079355.jpeg?auto=compress&cs=tinysrgb&w=1200',
  mandapSea:
    'https://images.pexels.com/photos/39797467/pexels-photo-39797467.jpeg?auto=compress&cs=tinysrgb&w=1200',
  stageFloral:
    'https://images.pexels.com/photos/14395559/pexels-photo-14395559.jpeg?auto=compress&cs=tinysrgb&w=1200',
  stageFloral2:
    'https://images.pexels.com/photos/12432503/pexels-photo-12432503.jpeg?auto=compress&cs=tinysrgb&w=1200',
  haldi:
    'https://images.pexels.com/photos/17261984/pexels-photo-17261984.jpeg?auto=compress&cs=tinysrgb&w=1200',
  haldi2:
    'https://images.pexels.com/photos/29492597/pexels-photo-29492597.jpeg?auto=compress&cs=tinysrgb&w=1200',
  mehendi:
    'https://images.pexels.com/photos/19590224/pexels-photo-19590224.jpeg?auto=compress&cs=tinysrgb&w=1200',
  mehendi2:
    'https://images.pexels.com/photos/12899814/pexels-photo-12899814.jpeg?auto=compress&cs=tinysrgb&w=1200',
  sangeet:
    'https://images.pexels.com/photos/33885310/pexels-photo-33885310.jpeg?auto=compress&cs=tinysrgb&w=1200',
  baraat:
    'https://images.pexels.com/photos/33885311/pexels-photo-33885311.jpeg?auto=compress&cs=tinysrgb&w=1200',
  reception:
    'https://images.pexels.com/photos/33417234/pexels-photo-33417234.jpeg?auto=compress&cs=tinysrgb&w=1200',
  food:
    'https://images.pexels.com/photos/32689476/pexels-photo-32689476.jpeg?auto=compress&cs=tinysrgb&w=1200',
  food2:
    'https://images.pexels.com/photos/37976941/pexels-photo-37976941.jpeg?auto=compress&cs=tinysrgb&w=1200',
  food3:
    'https://images.pexels.com/photos/35985960/pexels-photo-35985960.jpeg?auto=compress&cs=tinysrgb&w=1200',
  makeup:
    'https://images.pexels.com/photos/16799888/pexels-photo-16799888.jpeg?auto=compress&cs=tinysrgb&w=1200',
  makeup2:
    'https://images.pexels.com/photos/32588056/pexels-photo-32588056.jpeg?auto=compress&cs=tinysrgb&w=1200',
  makeup3:
    'https://images.pexels.com/photos/15530661/pexels-photo-15530661.jpeg?auto=compress&cs=tinysrgb&w=1200',
  photography:
    'https://images.pexels.com/photos/30372608/pexels-photo-30372608.jpeg?auto=compress&cs=tinysrgb&w=1200',
  photography2:
    'https://images.pexels.com/photos/31832653/pexels-photo-31832653.jpeg?auto=compress&cs=tinysrgb&w=1200',
  photography3:
    'https://images.pexels.com/photos/16869843/pexels-photo-16869843.jpeg?auto=compress&cs=tinysrgb&w=1200',
  dj:
    'https://images.pexels.com/photos/9005458/pexels-photo-9005458.jpeg?auto=compress&cs=tinysrgb&w=1200',
  dj2:
    'https://images.pexels.com/photos/37227941/pexels-photo-37227941.jpeg?auto=compress&cs=tinysrgb&w=1200',
  dj3:
    'https://images.pexels.com/photos/33539320/pexels-photo-33539320.jpeg?auto=compress&cs=tinysrgb&w=1200',
  jewellery1:
    'https://images.pexels.com/photos/6986012/pexels-photo-6986012.jpeg?auto=compress&cs=tinysrgb&w=900',
  jewellery2:
    'https://images.pexels.com/photos/29503018/pexels-photo-29503018.jpeg?auto=compress&cs=tinysrgb&w=900',
  jewellery3:
    'https://images.pexels.com/photos/7093769/pexels-photo-7093769.jpeg?auto=compress&cs=tinysrgb&w=900',
  jewellery4:
    'https://images.pexels.com/photos/22679062/pexels-photo-22679062.jpeg?auto=compress&cs=tinysrgb&w=900',
  jewellery5:
    'https://images.pexels.com/photos/2566659/pexels-photo-2566659.jpeg?auto=compress&cs=tinysrgb&w=900',
  jewellery6:
    'https://images.pexels.com/photos/37601638/pexels-photo-37601638.jpeg?auto=compress&cs=tinysrgb&w=900',
  lehenga1:
    'https://images.pexels.com/photos/12959396/pexels-photo-12959396.jpeg?auto=compress&cs=tinysrgb&w=900',
  lehenga2:
    'https://images.pexels.com/photos/13022612/pexels-photo-13022612.jpeg?auto=compress&cs=tinysrgb&w=900',
  lehenga3:
    'https://images.pexels.com/photos/13204680/pexels-photo-13204680.jpeg?auto=compress&cs=tinysrgb&w=900',
  lehenga4:
    'https://images.pexels.com/photos/13197696/pexels-photo-13197696.jpeg?auto=compress&cs=tinysrgb&w=900',
  sherwani1:
    'https://images.pexels.com/photos/39210712/pexels-photo-39210712.jpeg?auto=compress&cs=tinysrgb&w=900',
  sherwani2:
    'https://images.pexels.com/photos/27519192/pexels-photo-27519192.jpeg?auto=compress&cs=tinysrgb&w=900',
  sherwani3:
    'https://images.pexels.com/photos/15232747/pexels-photo-15232747.jpeg?auto=compress&cs=tinysrgb&w=900',
  sherwani4:
    'https://images.pexels.com/photos/33049965/pexels-photo-33049965.jpeg?auto=compress&cs=tinysrgb&w=900',
  brideHenna:
    'https://images.pexels.com/photos/16525657/pexels-photo-16525657.jpeg?auto=compress&cs=tinysrgb&w=1200',
  brideBangles:
    'https://images.pexels.com/photos/14825267/pexels-photo-14825267.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

// ─── Events / Journey ───
export const journeyStages: WeddingEvent[] = [
  {
    id: 'j1',
    name: 'Fitcheck (Clothes & Jewellery Trials)',
    day: 'Day -5',
    date: 'Dec 10, 2026',
    time: '11:00 AM',
    location: 'Royal Atelier & Jewellery Lounge, Udaipur',
    description: 'Final styling trials and fittings for bridal lehengas, groom sherwani, and royal heirloom jewellery.',
    dressCode: 'Casual & Comfortable',
    responsiblePerson: 'Stylist & Jewellery Consultant',
    notes: 'Check blouse alteration, dupatta draping, and sherwani cuffs with jewellery matching.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.jewellery1,
    serviceAddons: ['Jewellery Rental', 'Clothes Rental'],
  },
  {
    id: 'j2',
    name: 'Makeup Trial',
    day: 'Day -3',
    date: 'Dec 12, 2026',
    time: '2:00 PM',
    location: 'Glow Bridal Studio, Udaipur',
    description: 'Bridal makeup trial, hairstyling session, skin consultation, and product shade testing.',
    dressCode: 'Comfortable Wear',
    responsiblePerson: 'Senior Makeup Artist',
    notes: 'Test waterproof HD foundation, eye lashes, and floral hair accessories.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.makeup,
    serviceAddons: ['Makeup Artists'],
  },
  {
    id: 'j3',
    name: 'Pre-Wedding Shoot',
    day: 'Day -1',
    date: 'Dec 14, 2026',
    time: '6:30 AM',
    location: 'City Palace & Lake Pichola Ghats, Udaipur',
    description: 'Romantic sunrise and sunset pre-wedding cinematography and drone photoshoot.',
    dressCode: 'Pastel Western Gown & Tuxedo / Royal Ethnic',
    responsiblePerson: 'Candid Canvas Studio',
    notes: 'Drone permissions secured. 3 outfit changes planned. Golden hour lighting prioritized.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.couple,
    serviceAddons: ['Photography', 'Clothes Rental'],
  },
  {
    id: 'j4',
    name: 'Mehndi',
    day: 'Day 1',
    date: 'Dec 15, 2026',
    time: '4:00 PM',
    location: 'Garden Lawn, The Leela Palace',
    description: 'Mehendi application ceremony for the bride and guests.',
    dressCode: 'Green / Traditional Indian',
    responsiblePerson: 'Meena (Mehendi Artist)',
    notes: '3 mehendi artists booked for 50 guests. Herbal organic cone paste ready.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.mehendi,
    serviceAddons: ['Decoration', 'Catering', 'Music & DJ'],
  },
  {
    id: 'j5',
    name: 'Haldi',
    day: 'Day 2',
    date: 'Dec 16, 2026',
    time: '11:00 AM',
    location: 'Poolside Terrace, The Leela Palace',
    description: 'Traditional Haldi ceremony with family and close friends.',
    dressCode: 'Yellow / Orange',
    responsiblePerson: 'Sunita (Bride Aunt)',
    notes: 'Organic haldi paste prepared fresh.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.haldi,
    serviceAddons: ['Decoration', 'Photography'],
  },
  {
    id: 'j6',
    name: 'Sangeet',
    day: 'Day 2',
    date: 'Dec 16, 2026',
    time: '7:00 PM',
    location: 'Grand Ballroom, The Leela Palace',
    description: 'Musical evening with family performances and dance.',
    dressCode: 'Glamorous Indian',
    responsiblePerson: 'Anjali (Event Coordinator)',
    notes: '8 performances scheduled. DJ starts at 9 PM.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.sangeet,
    serviceAddons: ['Music & DJ', 'Decoration', 'Photography', 'Makeup Artists'],
  },
  {
    id: 'j7',
    name: 'DJ Night',
    day: 'Day 2',
    date: 'Dec 16, 2026',
    time: '10:00 PM',
    location: 'Club Lounge, The Leela Palace',
    description: 'DJ night following the Sangeet performances with high energy Bollywood and EDM fusion.',
    dressCode: 'Party Wear',
    responsiblePerson: 'DJ Aakash Beats',
    notes: 'Sound check at 6 PM. Fog machine and laser lights configured.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.dj,
    serviceAddons: ['Music & DJ', 'Catering'],
  },
  {
    id: 'j8',
    name: 'Bride & Groom Prep',
    day: 'Day 3',
    date: 'Dec 17, 2026',
    time: '11:00 AM',
    location: 'Bridal & Groom Suites, The Leela Palace',
    description: 'Bridal makeup, hairstyling, dressing ceremony, and groom sherwani fitting & safa tying.',
    dressCode: 'Comfortable / Robes',
    responsiblePerson: 'Priya & Arjun (Bridal Maid & Best Man)',
    notes: 'Ensure jewellery and lehenga are ready by 8 AM. Safa wala arrives at 9:30 AM.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.brideMirror,
    serviceAddons: ['Makeup Artists', 'Jewellery Rental', 'Clothes Rental'],
  },
  {
    id: 'j9',
    name: 'Baraat',
    day: 'Day 3',
    date: 'Dec 17, 2026',
    time: '4:00 PM',
    location: 'Hotel Entrance to Mandap, The Leela Palace',
    description: "Groom's wedding procession with brass band and dance.",
    dressCode: 'Sherwani / Bandhgala',
    responsiblePerson: 'Arjun (Best Man)',
    notes: 'Baggi (horse) booked. Band: Rajasthani Brass.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.baraat,
    serviceAddons: ['Music & DJ', 'Photography'],
  },
  {
    id: 'j10',
    name: 'Bride & Groom Entry & Photoshoot',
    day: 'Day 3',
    date: 'Dec 17, 2026',
    time: '5:30 PM',
    location: 'Palace Courtyard & Phoolon Ki Chaadar Pathway',
    description: 'Grand bride entry under floral canopy, groom welcome, varmala garland exchange, and royal portraits.',
    dressCode: 'Royal Wedding Attire',
    responsiblePerson: 'Event Production Team',
    notes: 'Varmala stage ready with rose petal blast. Dedicated candid photographer assigned for first look reaction.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.brideRedLehenga,
    serviceAddons: ['Decoration', 'Photography', 'Music & DJ'],
  },
  {
    id: 'j11',
    name: 'Wedding Ceremony',
    day: 'Day 3',
    date: 'Dec 17, 2026',
    time: '7:00 PM',
    location: 'Mandap, Garden Lawn, The Leela Palace',
    description: 'Sacred wedding rituals and pheras around the holy fire.',
    dressCode: 'Bridal Red / Sherwani',
    responsiblePerson: 'Pandit Sharma',
    notes: 'Vedic rituals. Kanyadaan at 6 PM. Hawan samagri verified.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.mandap,
    serviceAddons: ['Decoration', 'Catering', 'Photography'],
  },
  {
    id: 'j12',
    name: 'Reception',
    day: 'Day 4',
    date: 'Dec 18, 2026',
    time: '7:30 PM',
    location: 'Grand Ballroom, The Leela Palace',
    description: 'Grand reception dinner with all guests and family.',
    dressCode: 'Formal Indian',
    responsiblePerson: 'Event Coordinator',
    notes: 'Cocktail hour 7–8 PM. Dinner 8:30 PM. Live jazz band & sit-down royal dining.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.reception,
    serviceAddons: ['Catering', 'Music & DJ', 'Decoration', 'Photography'],
  },
  {
    id: 'j13',
    name: 'Vidai',
    day: 'Day 4',
    date: 'Dec 18, 2026',
    time: '11:30 PM',
    location: 'Hotel Entrance, The Leela Palace',
    description: 'Emotional farewell as the bride leaves for her new home.',
    dressCode: 'Bridal Outfit',
    responsiblePerson: 'Family Elders',
    notes: 'Decorated car arranged. Rice throwing ritual.',
    status: 'Upcoming',
    bookingStatus: 'Recommended',
    image: images.couple,
    serviceAddons: ['Photography', 'Decoration'],
  },
];

// ─── Events & Functions ───
export const eventsData: WeddingEvent[] = journeyStages.map((s, i) => ({
  ...s,
  id: `e${i + 1}`,
}));

// ─── Dashboard schedule ───
export const todaySchedule = [
  { time: '10:00 AM', title: 'Bridal Makeup', location: 'Bridal Suite' },
  { time: '12:00 PM', title: 'Haldi Ceremony', location: 'Poolside Terrace' },
  { time: '3:00 PM', title: 'Photography', location: 'Garden Lawn' },
  { time: '6:00 PM', title: 'Sangeet', location: 'Grand Ballroom' },
];

// ─── Guests ───
export const guestsData: Guest[] = [
  { id: 'g1', name: 'Suresh Sharma', phone: '+91 98765 43210', email: 'suresh.sharma@email.com', side: 'Bride', numberOfGuests: 4, rsvp: 'Confirmed', notes: 'Vegetarian family' },
  { id: 'g2', name: 'Kavita Iyer', phone: '+91 98450 11223', email: 'kavita.iyer@email.com', side: 'Bride', numberOfGuests: 2, rsvp: 'Confirmed', notes: 'Arriving from Bangalore' },
  { id: 'g3', name: 'Raj Malhotra', phone: '+91 99100 55667', email: 'raj.malhotra@email.com', side: 'Groom', numberOfGuests: 3, rsvp: 'Pending', notes: 'Will confirm by Dec 1' },
  { id: 'g4', name: 'Anita Desai', phone: '+91 98200 33445', email: 'anita.desai@email.com', side: 'Groom', numberOfGuests: 1, rsvp: 'Confirmed', notes: 'VIP guest' },
  { id: 'g5', name: 'Prakash Nair', phone: '+91 99001 22334', email: 'prakash.nair@email.com', side: 'Bride', numberOfGuests: 5, rsvp: 'Declined', notes: 'Overseas, cannot attend' },
  { id: 'g6', name: 'Lakshmi Reddy', phone: '+91 98844 55667', email: 'lakshmi.reddy@email.com', side: 'Bride', numberOfGuests: 2, rsvp: 'Confirmed', notes: 'Gluten-free meals' },
  { id: 'g7', name: 'Sanjay Gupta', phone: '+91 99777 88990', email: 'sanjay.gupta@email.com', side: 'Groom', numberOfGuests: 3, rsvp: 'Pending', notes: 'Awaiting flight confirmation' },
  { id: 'g8', name: 'Meera Joshi', phone: '+91 98655 22118', email: 'meera.joshi@email.com', side: 'Groom', numberOfGuests: 2, rsvp: 'Confirmed', notes: 'Photography enthusiast' },
  { id: 'g9', name: 'Vijay Krishnan', phone: '+91 98456 77889', email: 'vijay.krishnan@email.com', side: 'Bride', numberOfGuests: 4, rsvp: 'Confirmed', notes: 'Family with kids' },
  { id: 'g10', name: 'Deepa Agarwal', phone: '+91 99555 66778', email: 'deepa.agarwal@email.com', side: 'Groom', numberOfGuests: 1, rsvp: 'Pending', notes: 'Will bring gift' },
];

// ─── Wedding Services Directory ───
export const vendorsData: Vendor[] = [
  // Makeup Artists
  { id: 'v1', name: 'Glow Bridal Studio', category: 'Makeup Artists', location: 'Udaipur', rating: 4.9, priceRange: '₹15,000 – ₹35,000', email: 'v1@glowstudio.com', description: 'Premium bridal makeup with HD finish and airbrush techniques.', image: images.makeup, phone: '+91 98765 11111', whatsapp: '+91 98765 11111', services: ['Bridal Makeup', 'Reception Makeup', 'Hairstyling', 'Mehendi Makeup'] },
  { id: 'v2', name: 'Aura Beauty Lounge', category: 'Makeup Artists', location: 'Jaipur', rating: 4.7, priceRange: '₹10,000 – ₹28,000', description: 'Expert artists for traditional and contemporary bridal looks.', image: images.makeup2, phone: '+91 98765 22222', whatsapp: '+91 98765 22222', services: ['Bridal Makeup', 'Groom Grooming', 'Hairstyling'] },
  { id: 'v3', name: 'Radiance Makeovers', category: 'Makeup Artists', location: 'Mumbai', rating: 4.8, priceRange: '₹12,000 – ₹30,000', description: 'Destination wedding makeup specialists.', image: images.makeup3, phone: '+91 98765 33333', whatsapp: '+91 98765 33333', services: ['Bridal Makeup', 'Reception Makeup', 'Trial Session'] },
  { id: 'v4', name: 'Shubh Bridal Art', category: 'Makeup Artists', location: 'Udaipur', rating: 4.6, priceRange: '₹8,000 – ₹22,000', description: 'Affordable elegance with a personal touch.', image: images.makeup2, phone: '+91 98765 44444', whatsapp: '+91 98765 44444', services: ['Bridal Makeup', 'Hairstyling', 'Haldi Makeup'] },
  // DJ / Music
  { id: 'v5', name: 'DJ Aakash Beats', category: 'DJ / Music', location: 'Udaipur', rating: 4.8, priceRange: '₹25,000 – ₹60,000', email: 'v5@djaakash.com', description: 'High-energy DJ nights with Bollywood and EDM fusion.', image: images.dj, phone: '+91 98888 11111', whatsapp: '+91 98888 11111', services: ['Sangeet DJ', 'DJ Night', 'Sound System'] },
  { id: 'v6', name: 'Vibe Sound Lab', category: 'DJ / Music', location: 'Jaipur', rating: 4.7, priceRange: '₹20,000 – ₹50,000', description: 'Professional sound and lighting for unforgettable nights.', image: images.dj2, phone: '+91 98888 22222', whatsapp: '+91 98888 22222', services: ['DJ Night', 'Sound Equipment', 'Lighting'] },
  { id: 'v7', name: 'Rhythm Riders', category: 'DJ / Music', location: 'Delhi', rating: 4.9, priceRange: '₹30,000 – ₹75,000', description: 'Premium DJ services for luxury Indian weddings.', image: images.dj3, phone: '+91 98888 33333', whatsapp: '+91 98888 33333', services: ['Sangeet DJ', 'DJ Night', 'MC Services'] },
  { id: 'v8', name: 'Beats Unlimited', category: 'DJ / Music', location: 'Udaipur', rating: 4.5, priceRange: '₹15,000 – ₹40,000', description: 'Custom playlists and live mixing for every celebration.', image: images.dj, phone: '+91 98888 44444', whatsapp: '+91 98888 44444', services: ['DJ Night', 'Sound System'] },
  // Photography
  {
    id: 'v9',
    name: 'Candid Canvas Studio',
    category: 'Photography',
    location: 'Udaipur',
    rating: 4.9,
    priceRange: '₹50,000 – ₹1,50,000',
    contactPerson: 'Arjun Rathore',
    email: 'arjun@candidcanvas.com',
    acceptingBookings: true,
    description: 'Award-winning candid and traditional wedding photography with cinematic drone storytelling.',
    image: images.photography,
    phone: '+91 99999 11111',
    whatsapp: '+91 99999 11111',
    services: ['Candid Photography', 'Videography', 'Drone Photography', 'Pre-Wedding Shoot'],
  },
  { id: 'v10', name: 'Fairy Tale Frames', category: 'Photography', location: 'Mumbai', rating: 4.8, priceRange: '₹40,000 – ₹1,20,000', description: 'Storytelling through wedding photography and films.', image: images.photography2, phone: '+91 99999 22222', whatsapp: '+91 99999 22222', services: ['Wedding Photography', 'Cinematic Film', 'Pre-Wedding Shoot'] },
  { id: 'v11', name: 'Royal Lens Productions', category: 'Photography', location: 'Jaipur', rating: 4.7, priceRange: '₹35,000 – ₹1,00,000', description: 'Luxury wedding cinematography and traditional photography.', image: images.photography3, phone: '+91 99999 33333', whatsapp: '+91 99999 33333', services: ['Traditional Photography', 'Videography', 'Drone Photography'] },
  { id: 'v12', name: 'Ever Memories Photo', category: 'Photography', location: 'Udaipur', rating: 4.6, priceRange: '₹30,000 – ₹80,000', description: 'Affordable photography with a creative eye.', image: images.photography, phone: '+91 99999 44444', whatsapp: '+91 99999 44444', services: ['Wedding Photography', 'Candid Photography'] },
  // Decoration
  { id: 'v13', name: 'Blossom Decor Studio', category: 'Decoration', location: 'Udaipur', rating: 4.8, priceRange: '₹50,000 – ₹2,00,000', description: 'Luxury floral and thematic wedding decor.', image: images.mandap, phone: '+91 97777 11111', whatsapp: '+91 97777 11111', services: ['Wedding Stage', 'Mandap', 'Floral Decoration', 'Lighting'] },
  { id: 'v14', name: 'Royal Themes Decor', category: 'Decoration', location: 'Jaipur', rating: 4.7, priceRange: '₹40,000 – ₹1,50,000', description: 'Royal Rajasthani themed wedding decoration.', image: images.stageFloral, phone: '+91 97777 22222', whatsapp: '+91 97777 22222', services: ['Mandap', 'Entrance', 'Floral Decoration'] },
  { id: 'v15', name: 'Petal & Pearl Events', category: 'Decoration', location: 'Mumbai', rating: 4.9, priceRange: '₹60,000 – ₹2,50,000', description: 'Bespoke decor for every wedding celebration.', image: images.stageFloral2, phone: '+91 97777 33333', whatsapp: '+91 97777 33333', services: ['Wedding Stage', 'Reception', 'Mehendi Decor', 'Haldi Decor'] },
  { id: 'v16', name: 'Aura Decorators', category: 'Decoration', location: 'Udaipur', rating: 4.5, priceRange: '₹25,000 – ₹90,000', description: 'Beautiful decor on any budget.', image: images.mandapSea, phone: '+91 97777 44444', whatsapp: '+91 97777 44444', services: ['Entrance', 'Lighting', 'Floral Decoration'] },
  // Catering
  {
    id: 'v17',
    name: 'Maharaja Feast Caterers',
    category: 'Catering',
    location: 'Udaipur',
    rating: 4.8,
    priceRange: '₹1,500 – ₹2,400 / plate',
    contactPerson: 'Chef Raghuvendra Singh',
    email: 'chef@maharajafeast.com',
    acceptingBookings: true,
    cuisines: ['Royal Rajasthani', 'Mughlai', 'Dal Baati Churma', 'Live Chaat Counter'],
    description: 'Royal Rajasthani and multi-cuisine wedding catering with silver thali dining and 56-bhog banquets.',
    image: images.food,
    phone: '+91 96666 11111',
    whatsapp: '+91 96666 11111',
    services: ['North Indian', 'South Indian', 'Desserts', 'Beverages', 'Live Chaat Counter'],
  },
  { id: 'v18', name: 'Spice Route Catering', category: 'Catering', location: 'Jaipur', rating: 4.7, priceRange: '₹400 – ₹1,200 / plate', description: 'Authentic Indian flavors with live food counters.', image: images.food2, phone: '+91 96666 22222', whatsapp: '+91 96666 22222', services: ['Vegetarian', 'Non-Vegetarian', 'Snacks', 'Live Counters'] },
  { id: 'v19', name: 'Royal Bites Catering', category: 'Catering', location: 'Mumbai', rating: 4.9, priceRange: '₹600 – ₹2,000 / plate', description: 'Premium catering with international cuisine options.', image: images.food3, phone: '+91 96666 33333', whatsapp: '+91 96666 33333', services: ['North Indian', 'Continental', 'Desserts', 'Beverages'] },
  { id: 'v20', name: 'Annapurna Caterers', category: 'Catering', location: 'Udaipur', rating: 4.6, priceRange: '₹300 – ₹800 / plate', description: 'Traditional vegetarian catering with regional specialties.', image: images.food, phone: '+91 96666 44444', whatsapp: '+91 96666 44444', services: ['Vegetarian', 'South Indian', 'Snacks'] },
  { id: 'v18', name: 'Spice Route Catering', category: 'Catering', location: 'Jaipur', rating: 4.7, priceRange: '₹400 – ₹1,200 / plate', description: 'Authentic Indian flavors with live food counters.', image: images.food2, phone: '+91 96666 22222', whatsapp: '+91 96666 22222', services: ['Vegetarian', 'Non-Vegetarian', 'Snacks', 'Live Counters'] },
  { id: 'v19', name: 'Royal Bites Catering', category: 'Catering', location: 'Mumbai', rating: 4.9, priceRange: '₹600 – ₹2,000 / plate', description: 'Premium catering with international cuisine options.', image: images.food3, phone: '+91 96666 33333', whatsapp: '+91 96666 33333', services: ['North Indian', 'Continental', 'Desserts', 'Beverages'] },
  { id: 'v20', name: 'Annapurna Caterers', category: 'Catering', location: 'Udaipur', rating: 4.6, priceRange: '₹300 – ₹800 / plate', description: 'Traditional vegetarian catering with regional specialties.', image: images.food, phone: '+91 96666 44444', whatsapp: '+91 96666 44444', services: ['Vegetarian', 'South Indian', 'Snacks'] },
];

// ─── Jewellery ───
export const jewelleryData: JewelleryItem[] = [
  { id: 'jw1', name: 'Royal Bridal Necklace Set', category: 'Bridal Necklace', forWhom: 'Bride', rentalPrice: 15000, securityDeposit: 50000, availability: 'Available', rentalDuration: '3 days', description: 'Exquisite kundan and pearl bridal necklace with matching earrings.', image: images.jewellery3 },
  { id: 'jw2', name: 'Traditional Choker Set', category: 'Choker', forWhom: 'Bride', rentalPrice: 8000, securityDeposit: 30000, availability: 'Available', rentalDuration: '2 days', description: 'Gold-plated choker with intricate meenakari work.', image: images.jewellery1 },
  { id: 'jw3', name: 'Long Temple Necklace', category: 'Long Necklace', forWhom: 'Bride', rentalPrice: 12000, securityDeposit: 40000, availability: 'Limited', rentalDuration: '3 days', description: 'South Indian temple jewellery long necklace with Lakshmi motifs.', image: images.jewellery2 },
  { id: 'jw4', name: 'Pearl Jhumka Earrings', category: 'Earrings', forWhom: 'Bride', rentalPrice: 3500, securityDeposit: 12000, availability: 'Available', rentalDuration: '2 days', description: 'Elegant pearl and gold jhumka earrings.', image: images.jewellery6 },
  { id: 'jw5', name: 'Bridal Jhumka Set', category: 'Jhumka', forWhom: 'Bride', rentalPrice: 5000, securityDeposit: 18000, availability: 'Available', rentalDuration: '2 days', description: 'Heavy bridal jhumkas with kundan and pearl detailing.', image: images.jewellery1 },
  { id: 'jw6', name: 'Gold Plated Bangles Set', category: 'Bangles', forWhom: 'Bride', rentalPrice: 4000, securityDeposit: 15000, availability: 'Available', rentalDuration: '3 days', description: 'Set of 8 gold-plated bangles with intricate carving.', image: images.jewellery5 },
  { id: 'jw7', name: 'Maang Tikka – Kundan', category: 'Maang Tikka', forWhom: 'Bride', rentalPrice: 2500, securityDeposit: 8000, availability: 'Available', rentalDuration: '2 days', description: 'Beautiful kundan maang tikka with pearl drops.', image: images.jewellery2 },
  { id: 'jw8', name: 'Matha Patti – Royal', category: 'Matha Patti', forWhom: 'Bride', rentalPrice: 6000, securityDeposit: 20000, availability: 'Limited', rentalDuration: '2 days', description: 'Three-tier matha patti with intricate gold work.', image: images.jewellery4 },
  { id: 'jw9', name: 'Marathi Nath / Nose Ring', category: 'Nath / Nose Ring', forWhom: 'Bride', rentalPrice: 2000, securityDeposit: 7000, availability: 'Available', rentalDuration: '2 days', description: 'Traditional pearl and gold nose ring for the bride.', image: images.jewellery6 },
  { id: 'jw10', name: 'Kamarbandh / Waist Belt', category: 'Kamarbandh', forWhom: 'Bride', rentalPrice: 4500, securityDeposit: 16000, availability: 'Available', rentalDuration: '3 days', description: 'Ornate gold-finish waist belt with temple motifs.', image: images.jewellery3 },
  { id: 'jw11', name: 'Silver Anklets Pair', category: 'Anklets', forWhom: 'Bride', rentalPrice: 1800, securityDeposit: 6000, availability: 'Available', rentalDuration: '3 days', description: 'Delicate silver anklets with ghungroos.', image: images.jewellery5 },
  { id: 'jw12', name: 'Groom Pearl Brooch', category: 'Brooch', forWhom: 'Groom', rentalPrice: 1500, securityDeposit: 5000, availability: 'Available', rentalDuration: '2 days', description: 'Elegant pearl brooch for sherwani.', image: images.jewellery2 },
  { id: 'jw13', name: 'Sehra with Gold Strings', category: 'Sehra', forWhom: 'Groom', rentalPrice: 3000, securityDeposit: 10000, availability: 'Available', rentalDuration: '2 days', description: 'Traditional sehra decorated with gold strings and flowers.', image: images.jewellery4 },
  { id: 'jw14', name: 'Groom Gold Necklace', category: 'Groom Necklace', forWhom: 'Groom', rentalPrice: 5000, securityDeposit: 18000, availability: 'Limited', rentalDuration: '2 days', description: 'Thick gold chain for the groom, statement piece.', image: images.jewellery3 },
  { id: 'jw15', name: 'Groom Silver Bracelet', category: 'Bracelet', forWhom: 'Groom', rentalPrice: 2000, securityDeposit: 7000, availability: 'Available', rentalDuration: '2 days', description: 'Kada-style silver bracelet for the groom.', image: images.jewellery5 },
  { id: 'jw16', name: 'Gold Cufflinks Pair', category: 'Cufflinks', forWhom: 'Groom', rentalPrice: 1200, securityDeposit: 4000, availability: 'Available', rentalDuration: '2 days', description: 'Premium gold-finish cufflinks for the reception suit.', image: images.jewellery2 },
];

// ─── Clothes ───
export const clothesData: ClothesItem[] = [
  { id: 'c1', name: 'Red Bridal Lehenga – Royal', category: 'Bridal Lehenga', forWhom: 'Bride', size: 'M', color: 'Red', rentalPrice: 25000, securityDeposit: 80000, availability: 'Available', rentalDuration: '3 days', description: 'Heavy zardozi embroidered red bridal lehenga with dupatta.', image: images.lehenga1 },
  { id: 'c2', name: 'Maroon Wedding Saree', category: 'Wedding Saree', forWhom: 'Bride', size: 'Free', color: 'Maroon', rentalPrice: 12000, securityDeposit: 40000, availability: 'Available', rentalDuration: '2 days', description: 'Silk Kanjivaram saree with gold border.', image: images.lehenga2 },
  { id: 'c3', name: 'Reception Gown – Champagne', category: 'Reception Outfit', forWhom: 'Bride', size: 'S', color: 'Champagne', rentalPrice: 15000, securityDeposit: 50000, availability: 'Limited', rentalDuration: '2 days', description: 'Elegant champagne reception gown with sequin work.', image: images.lehenga3 },
  { id: 'c4', name: 'Mehendi Outfit – Yellow', category: 'Mehendi Outfit', forWhom: 'Bride', size: 'M', color: 'Yellow', rentalPrice: 6000, securityDeposit: 20000, availability: 'Available', rentalDuration: '2 days', description: 'Bright yellow lehenga for mehendi ceremony.', image: images.lehenga4 },
  { id: 'c5', name: 'Haldi Outfit – Orange', category: 'Haldi Outfit', forWhom: 'Bride', size: 'M', color: 'Orange', rentalPrice: 5000, securityDeposit: 18000, availability: 'Available', rentalDuration: '2 days', description: 'Comfortable orange cotton lehenga for haldi.', image: images.lehenga2 },
  { id: 'c6', name: 'Bridal Dupatta – Net', category: 'Dupatta', forWhom: 'Bride', size: 'Free', color: 'Red', rentalPrice: 2000, securityDeposit: 7000, availability: 'Available', rentalDuration: '2 days', description: 'Heavily embroidered net dupatta with gold border.', image: images.lehenga1 },
  { id: 'c7', name: 'Bridal Accessories Kit', category: 'Bridal Accessories', forWhom: 'Bride', size: 'Free', color: 'Gold', rentalPrice: 3000, securityDeposit: 10000, availability: 'Available', rentalDuration: '3 days', description: 'Kamarbandh, kaleere, and bridal clutch kit.', image: images.brideBangles },
  { id: 'c8', name: 'Cream Sherwani – Royal', category: 'Sherwani', forWhom: 'Groom', size: 'L', color: 'Cream', rentalPrice: 18000, securityDeposit: 60000, availability: 'Available', rentalDuration: '3 days', description: 'Heavy embroidered cream sherwani with churidar.', image: images.sherwani1 },
  { id: 'c9', name: 'Navy Blue Reception Suit', category: 'Suit', forWhom: 'Groom', size: 'L', color: 'Navy', rentalPrice: 12000, securityDeposit: 40000, availability: 'Available', rentalDuration: '2 days', description: 'Tailored navy blue three-piece suit for reception.', image: images.sherwani2 },
  { id: 'c10', name: 'Kurta Pyjama – Silk', category: 'Kurta', forWhom: 'Groom', size: 'M', color: 'White', rentalPrice: 4000, securityDeposit: 15000, availability: 'Available', rentalDuration: '2 days', description: 'Silk kurta pyjama for haldi and mehendi.', image: images.sherwani3 },
  { id: 'c11', name: 'Indo-Western Blazer', category: 'Indo-Western', forWhom: 'Groom', size: 'L', color: 'Maroon', rentalPrice: 10000, securityDeposit: 35000, availability: 'Limited', rentalDuration: '2 days', description: 'Stylish maroon indo-western blazer for sangeet.', image: images.sherwani4 },
  { id: 'c12', name: 'Reception Blazer – Black', category: 'Reception Outfit', forWhom: 'Groom', size: 'L', color: 'Black', rentalPrice: 9000, securityDeposit: 30000, availability: 'Available', rentalDuration: '2 days', description: 'Classic black blazer with Indo-western detailing.', image: images.sherwani2 },
  { id: 'c13', name: 'Safa / Turban – Red & Gold', category: 'Safa / Turban', forWhom: 'Groom', size: 'Free', color: 'Red', rentalPrice: 2500, securityDeposit: 8000, availability: 'Available', rentalDuration: '2 days', description: 'Royal red and gold safa with kalgi pin.', image: images.sherwani3 },
  { id: 'c14', name: 'Groom Accessories Kit', category: 'Groom Accessories', forWhom: 'Groom', size: 'Free', color: 'Gold', rentalPrice: 2000, securityDeposit: 7000, availability: 'Available', rentalDuration: '3 days', description: 'Brooch, cufflinks, pocket square, and mojris kit.', image: images.sherwani1 },
];

// ─── Tasks ───
export const tasksData: Task[] = [
  { id: 't1', name: 'Book Photographer', category: 'Photography', dueDate: 'Oct 30, 2026', priority: 'High', status: 'Completed', assignedPerson: 'Anjali' },
  { id: 't2', name: 'Finalize Jewellery', category: 'Jewellery', dueDate: 'Nov 15, 2026', priority: 'High', status: 'In Progress', assignedPerson: 'Priya' },
  { id: 't3', name: 'Finalize Bride Outfit', category: 'Clothes', dueDate: 'Nov 10, 2026', priority: 'High', status: 'In Progress', assignedPerson: 'Aishwarya' },
  { id: 't4', name: 'Finalize Groom Outfit', category: 'Clothes', dueDate: 'Nov 10, 2026', priority: 'High', status: 'Completed', assignedPerson: 'Rohan' },
  { id: 't5', name: 'Book Makeup Artist', category: 'Makeup', dueDate: 'Oct 25, 2026', priority: 'High', status: 'Completed', assignedPerson: 'Priya' },
  { id: 't6', name: 'Book DJ', category: 'DJ / Music', dueDate: 'Oct 28, 2026', priority: 'Medium', status: 'Completed', assignedPerson: 'Arjun' },
  { id: 't7', name: 'Confirm Decoration', category: 'Decoration', dueDate: 'Nov 20, 2026', priority: 'Medium', status: 'Pending', assignedPerson: 'Anjali' },
  { id: 't8', name: 'Confirm Catering', category: 'Catering', dueDate: 'Nov 20, 2026', priority: 'High', status: 'Pending', assignedPerson: 'Rajesh' },
  { id: 't9', name: 'Send Invitations', category: 'Invitations', dueDate: 'Nov 5, 2026', priority: 'High', status: 'Completed', assignedPerson: 'Sunita' },
  { id: 't10', name: 'Confirm Guests', category: 'Guests', dueDate: 'Dec 1, 2026', priority: 'Medium', status: 'In Progress', assignedPerson: 'Anjali' },
  { id: 't11', name: 'Mehendi Arrangements', category: 'Events', dueDate: 'Dec 10, 2026', priority: 'Medium', status: 'Pending', assignedPerson: 'Meena' },
  { id: 't12', name: 'Haldi Arrangements', category: 'Events', dueDate: 'Dec 10, 2026', priority: 'Medium', status: 'Pending', assignedPerson: 'Sunita' },
  { id: 't13', name: 'Venue Preparation', category: 'Venue', dueDate: 'Dec 15, 2026', priority: 'High', status: 'Pending', assignedPerson: 'Anjali' },
  { id: 't14', name: 'Transportation', category: 'Transportation', dueDate: 'Dec 14, 2026', priority: 'Low', status: 'Pending', assignedPerson: 'Arjun' },
  { id: 't15', name: 'Reception Preparation', category: 'Events', dueDate: 'Dec 16, 2026', priority: 'Medium', status: 'Pending', assignedPerson: 'Vikram' },
];

// ─── Budget ───
export const budgetData: BudgetItem[] = [
  { id: 'b1', category: 'Venue', description: 'The Leela Palace – 3 days', planned: 1500000, spent: 1500000 },
  { id: 'b2', category: 'Jewellery', description: 'Bridal jewellery rental', planned: 80000, spent: 65000 },
  { id: 'b3', category: 'Clothes', description: 'Bride and groom outfits', planned: 150000, spent: 120000 },
  { id: 'b4', category: 'Makeup', description: 'Bridal makeup package', planned: 35000, spent: 35000 },
  { id: 'b5', category: 'Photography', description: 'Wedding photography + film', planned: 120000, spent: 120000 },
  { id: 'b6', category: 'Decoration', description: 'Mandap, stage, entrance', planned: 200000, spent: 0 },
  { id: 'b7', category: 'Catering', description: 'All functions catering', planned: 500000, spent: 250000 },
  { id: 'b8', category: 'DJ / Music', description: 'Sangeet and DJ night', planned: 60000, spent: 60000 },
  { id: 'b9', category: 'Transportation', description: 'Guest transport and baggi', planned: 50000, spent: 0 },
  { id: 'b10', category: 'Invitations', description: 'Wedding cards and gifts', planned: 40000, spent: 38000 },
  { id: 'b11', category: 'Other', description: 'Miscellaneous expenses', planned: 50000, spent: 15000 },
];

// ─── Notifications ───
export const notificationsData: AppNotification[] = [
  { id: 'n1', title: 'RSVP Confirmed', message: 'Suresh Sharma confirmed attendance for 4 guests.', type: 'success', time: '2 hours ago', read: false },
  { id: 'n2', title: 'Vendor Booked', message: 'DJ Aakash Beats confirmed for Sangeet night.', type: 'success', time: '5 hours ago', read: false },
  { id: 'n3', title: 'Upcoming Event', message: 'Mehendi ceremony on Dec 15 at 4:00 PM.', type: 'info', time: '1 day ago', read: false },
  { id: 'n4', title: 'Jewellery Rental Confirmation', message: 'Royal Bridal Necklace Set rental approved.', type: 'success', time: '2 days ago', read: true },
  { id: 'n5', title: 'Rental Return Reminder', message: 'Pearl Jhumka Earrings return due tomorrow.', type: 'reminder', time: '2 days ago', read: false },
  { id: 'n6', title: 'Makeup Appointment', message: 'Bridal makeup trial on Dec 14 at 10:00 AM.', type: 'info', time: '3 days ago', read: true },
  { id: 'n7', title: 'Task Reminder', message: 'Confirm Catering task due by Nov 20.', type: 'warning', time: '3 days ago', read: false },
  { id: 'n8', title: 'Payment Reminder', message: 'Decoration advance payment of ₹50,000 pending.', type: 'warning', time: '4 days ago', read: true },
  { id: 'n9', title: 'Photography Appointment', message: 'Pre-wedding shoot scheduled for Dec 1.', type: 'info', time: '5 days ago', read: true },
  { id: 'n10', title: 'Clothes Rental Confirmation', message: 'Red Bridal Lehenga rental confirmed for Dec 15–18.', type: 'success', time: '1 week ago', read: true },
];

// ─── Sangeet Performances ───
export const sangeetData: SangeetPerformance[] = [
  { id: 's1', name: 'Couple Dance', song: 'Tum Se Hi – Jab We Met', side: 'Bride', participants: 'Aishwarya & Rohan', practiceDate: 'Dec 10, 2026', practiceTime: '5:00 PM', duration: '4 min', status: 'Practicing', notes: 'Slow romantic opening number' },
  { id: 's2', name: 'Sisters Dance', song: 'Din Shagna Da – Phillauri', side: 'Bride', participants: 'Priya, Meera, Kavya', practiceDate: 'Dec 8, 2026', practiceTime: '6:00 PM', duration: '5 min', status: 'Ready', notes: 'Surprise performance for bride' },
  { id: 's3', name: 'Friends Dance', song: 'Gallan Goodiyaan – Dil Dhadakne Do', side: 'Groom', participants: 'Arjun, Karan, Vivek, Raj', practiceDate: 'Dec 9, 2026', practiceTime: '7:00 PM', duration: '6 min', status: 'Practicing', notes: 'High energy group performance' },
  { id: 's4', name: 'Family Group Dance', song: 'Nachde Ne Saare – Baar Baar Dekho', side: 'Bride', participants: 'All family members', practiceDate: 'Dec 12, 2026', practiceTime: '4:00 PM', duration: '8 min', status: 'Planned', notes: 'Grand finale performance' },
  { id: 's5', name: 'Groom Entry Dance', song: 'Mauka Mauka – Custom Mix', side: 'Groom', participants: 'Rohan & Baraat', practiceDate: 'Dec 11, 2026', practiceTime: '8:00 PM', duration: '3 min', status: 'Planned', notes: 'Choreographed baraat entry' },
];

// ─── Bridal Preparation Checklist ───
export const bridalPrepData: BridalPrepItem[] = [
  { id: 'bp1', appointment: 'Bridal Makeup Trial', time: 'Dec 14, 10:00 AM', vendor: 'Glow Bridal Studio', status: 'Completed', notes: 'Natural glam look finalized' },
  { id: 'bp2', appointment: 'Hairstyling Session', time: 'Dec 15, 8:00 AM', vendor: 'Glow Bridal Studio', status: 'Pending', notes: 'Low bun with gajra' },
  { id: 'bp3', appointment: 'Jewellery Fitting', time: 'Dec 13, 3:00 PM', vendor: 'Royal Jewellers', status: 'In Progress', notes: 'Necklace set and maang tikka' },
  { id: 'bp4', appointment: 'Bridal Lehenga Fitting', time: 'Dec 12, 11:00 AM', vendor: 'Ethnic Couture', status: 'Completed', notes: 'Final fitting done' },
  { id: 'bp5', appointment: 'Reception Outfit Trial', time: 'Dec 14, 2:00 PM', vendor: 'Style Studio', status: 'Pending', notes: 'Champagne gown' },
  { id: 'bp6', appointment: 'Mehendi Outfit Pickup', time: 'Dec 10, 5:00 PM', vendor: 'Ethnic Couture', status: 'Completed', notes: 'Yellow lehenga picked up' },
  { id: 'bp7', appointment: 'Haldi Outfit Pickup', time: 'Dec 11, 4:00 PM', vendor: 'Ethnic Couture', status: 'Pending', notes: 'Orange cotton lehenga' },
  { id: 'bp8', appointment: 'Bridal Shoes Fitting', time: 'Dec 10, 1:00 PM', vendor: 'Footwear Plus', status: 'Completed', notes: 'Gold heels and juttis' },
  { id: 'bp9', appointment: 'Accessories Pickup', time: 'Dec 13, 12:00 PM', vendor: 'Royal Jewellers', status: 'Pending', notes: 'Kaleere and clutch' },
  { id: 'bp10', appointment: 'Mehendi Appointment', time: 'Dec 15, 4:00 PM', vendor: 'Meena Mehendi Arts', status: 'Pending', notes: 'Full hand intricate design' },
  { id: 'bp11', appointment: 'Beauty Facial Session', time: 'Dec 13, 10:00 AM', vendor: 'Aura Beauty Lounge', status: 'Completed', notes: 'Pre-bridal glow facial' },
  { id: 'bp12', appointment: 'Manicure & Pedicure', time: 'Dec 14, 4:00 PM', vendor: 'Aura Beauty Lounge', status: 'Pending', notes: 'Before mehendi' },
];

// ─── Groom Preparation Checklist ───
export const groomPrepData: BridalPrepItem[] = [
  { id: 'gp1', appointment: 'Grooming Session', time: 'Dec 14, 11:00 AM', vendor: 'The Grooming Lounge', status: 'Pending', notes: 'Haircut and beard trim' },
  { id: 'gp2', appointment: 'Sherwani Fitting', time: 'Dec 12, 2:00 PM', vendor: 'Royal Menswear', status: 'Completed', notes: 'Cream sherwani final fitting' },
  { id: 'gp3', appointment: 'Reception Suit Trial', time: 'Dec 14, 3:00 PM', vendor: 'Style Studio', status: 'Pending', notes: 'Navy blue three-piece' },
  { id: 'gp4', appointment: 'Kurta Pickup', time: 'Dec 10, 1:00 PM', vendor: 'Royal Menswear', status: 'Completed', notes: 'White silk kurta for haldi' },
  { id: 'gp5', appointment: 'Shoes & Mojris', time: 'Dec 11, 12:00 PM', vendor: 'Footwear Plus', status: 'Completed', notes: 'Cream mojris and black formal shoes' },
  { id: 'gp6', appointment: 'Safa / Turban Fitting', time: 'Dec 15, 9:30 AM', vendor: 'Safa Wala Singh', status: 'Pending', notes: 'Red and gold safa with kalgi' },
  { id: 'gp7', appointment: 'Brooch Selection', time: 'Dec 13, 11:00 AM', vendor: 'Royal Jewellers', status: 'Completed', notes: 'Pearl brooch selected' },
  { id: 'gp8', appointment: 'Cufflinks Pickup', time: 'Dec 13, 11:30 AM', vendor: 'Royal Jewellers', status: 'Pending', notes: 'Gold-finish cufflinks' },
  { id: 'gp9', appointment: 'Accessories Pickup', time: 'Dec 12, 4:00 PM', vendor: 'Royal Menswear', status: 'Pending', notes: 'Pocket square and belt' },
  { id: 'gp10', appointment: 'Groom Function Prep', time: 'Dec 16, 5:00 PM', vendor: 'Best Man – Arjun', status: 'Pending', notes: 'Coordinate with groom family' },
];

// ─── Wedding Journey Progress stages (for dashboard) ───
export const progressStages = [
  'Preparation',
  'Mehendi',
  'Haldi',
  'Sangeet',
  'Baraat',
  'Wedding',
  'Reception',
  'Vidai',
];

export const bookedServices = [
  { name: 'Photography', vendor: 'Candid Canvas Studio', icon: 'Camera', image: images.photography },
  { name: 'Makeup', vendor: 'Glow Bridal Studio', icon: 'Sparkles', image: images.makeup },
  { name: 'DJ', vendor: 'DJ Aakash Beats', icon: 'Music', image: images.dj },
  { name: 'Decoration', vendor: 'Blossom Decor Studio', icon: 'Flower2', image: images.mandap },
  { name: 'Catering', vendor: 'Maharaja Feast Caterers', icon: 'UtensilsCrossed', image: images.food },
];

// ─── FAQ ───
export const faqData = [
  { q: 'How do I add a new event to my wedding?', a: 'Navigate to Events & Functions and click "Add Event". Fill in the event details and save.' },
  { q: 'Can I rent jewellery and clothes together?', a: 'Yes! Visit the Jewellery Rental and Clothes Rental pages to submit separate rental requests for each.' },
  { q: 'How do I track my wedding budget?', a: 'Go to the Budget page to see planned vs spent amounts, add new budget items, and track remaining funds.' },
  { q: 'How do I change the language?', a: 'Use the language selector in the top header or visit the Language page to switch between English, Hindi, and Kannada.' },
  { q: 'What if I need urgent help?', a: 'Visit the Support page and use the Emergency Help option to contact your event manager immediately.' },
];
