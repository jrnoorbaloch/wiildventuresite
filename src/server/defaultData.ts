export interface CustomSectionItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  badge?: string;
  statValue?: string;
}

export interface CustomLandingSection {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  layout: 'cards_grid' | 'cta_banner' | 'text_image' | 'stats_row' | 'accordion';
  themeStyle: 'cream' | 'teal' | 'white' | 'accent';
  position: 'after_hero' | 'after_about' | 'after_attractions' | 'after_pricing' | 'before_footer';
  order: number;
  isVisible: boolean;
  buttonText?: string;
  buttonLink?: string;
  image?: string;
  items: CustomSectionItem[];
  createdAt: string;
}

export interface CustomPageSection {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  layout: 'content_text' | 'cards_grid' | 'cta_banner' | 'text_image' | 'faq_list';
  themeStyle: 'white' | 'cream' | 'teal';
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: CustomSectionItem[];
  order: number;
  isVisible: boolean;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  heroImage?: string;
  badge?: string;
  bodyContent?: string;
  showInNav?: boolean;
  showInFooter?: boolean;
  isVisible: boolean;
  sections: CustomPageSection[];
  createdAt: string;
}

export interface RolePagePermissions {
  dashboard: boolean;
  branding: boolean;
  theme: boolean;
  homepage: boolean;
  attractions: boolean;
  pricing: boolean;
  statistics: boolean;
  testimonials: boolean;
  blog: boolean;
  faqs: boolean;
  navigation: boolean;
  visibility: boolean;
  bookings: boolean;
  contact: boolean;
  media: boolean;
  users: boolean;
}

export interface RoleOptionPermissions {
  canPublish: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canExportData: boolean;
  canEditTheme: boolean;
  canManageBookings: boolean;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  color: string;
  isSystem?: boolean;
  pages: RolePagePermissions;
  options: RoleOptionPermissions;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  roleId: string;
  avatar?: string;
  status: 'active' | 'suspended';
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export type GroupType = 'school' | 'university' | 'corporate';

export interface GroupBookingItem {
  id: string;
  bookingRef: string;
  groupType: GroupType;
  organizationName: string;
  department?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  designation?: string;
  visitDate: string;
  backupDate?: string;
  studentCount?: number;
  supervisorCount?: number;
  totalAttendees: number;
  packageType: string;
  cateringOption?: string;
  busParking?: boolean;
  guidedTour?: boolean;
  conferenceHall?: boolean;
  specialRequests?: string;
  estimatedTotal: number;
  status: 'pending' | 'confirmed' | 'contacted' | 'cancelled';
  createdAt: string;

  // Backward compatibility fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  planName?: string;
  adults?: number;
  children?: number;
  totalAmount?: number;
}

export const defaultDatabase = {
  branding: {
    siteName: 'Wild Venture',
    tagline: 'The Ultimate Destination for Daredevils, Dreamers, and Joy Seekers!',
    description: 'Experience thrilling roller coasters, magical family attractions, delicious festival food, and live entertainment at Wild Venture amusement park.',
    logoText: 'Wild Venture',
    logoAccent: 'Venture',
    logoColor: '#ff9021',
    logoIcon: 'tent',
    logoImage: '',
    logoType: 'icon_text', // 'icon_text' | 'image_text' | 'image_only'
    logoHeight: 42,
    contactEmail: 'info@wildventurepark.com',
    contactPhone: '+1 (800) 132 468 795',
    address: '123 High Street, Springfield, London SW1A 1A, United Kingdom',
    footerCopyright: '© 2026 Wild Venture Amusement Park. All Rights Reserved.',
    socialLinks: {
      pinterest: 'https://pinterest.com',
      twitter: 'https://twitter.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
    },
  },
  theme: {
    primaryDark: '#103F3C',
    secondaryTeal: '#426B68',
    accentYellow: '#ff9021',
    accentHover: '#EFA812',
    softCream: '#F7F0E6',
    primaryText: '#153F3D',
    mutedTeal: '#184845',
    deepTeal: '#0D3330',
    fontFamily: 'Plus Jakarta Sans',
    headingFont: 'Poppins',
    borderRadius: '16px',
    buttonRadius: '12px',
    mode: 'light',
  },
  homepage: {
    announcement: {
      isVisible: true,
      text: 'Purchase Today & Enjoy UP TO 35% OFF on Season & Family Passes',
      buttonText: 'Buy Now',
    },
    hero: {
      eyebrow: 'Welcome To A World Of Wonder',
      headline: 'The Ultimate Destination for Daredevils, Dreamers, and Joy Seekers!',
      paragraph: "Get ready for a world full of laughter, music, thrilling rides, and magical moments! From epic roller coasters to vibrant festivals and live performances—there's something here for every age, every season, and every kind of fun.",
      primaryBtnText: 'Get Tickets Now',
      secondaryBtnText: 'Watch The Park Video',
      bgImage: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    about: {
      eyebrow: 'About Us',
      title: 'Spreading happiness, one ride at a time',
      paragraph: 'Welcome to a world where imagination comes to life! Our theme park and festival grounds have been bringing smiles, thrills, and heart-pumping joy to guests of all ages for over two decades. Designed as the ultimate hub for family memories, breathtaking rides, and seasonal celebrations.',
      yearsExperience: '20+',
      crewName: 'Jenny Wilson',
      crewRole: 'Guest Experience Lead',
      crewAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      feature1Title: 'Our theme park & festival',
      feature1Desc: '50+ dynamic rides, carnival games & themed zones.',
      feature2Title: 'Magical park land filled',
      feature2Desc: 'Wonder-filled gardens, fairytale trails & acrobatics.',
      imageTop: 'https://images.unsplash.com/photo-1505771226610-9762d2994cb9?auto=format&fit=crop&w=800&q=80',
      imageBottom: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    },
    facilitiesHeader: {
      eyebrow: 'Our Park Facilities',
      title: 'Discover Your Next Adventure',
      btnText: 'View All Services',
    },
    achievementsHeader: {
      eyebrow: 'Featured Attractions',
      title: 'Unforgettable Adventures Await Around Every Corner',
    },
    milestonesHeader: {
      eyebrow: 'Our Show History',
      title: 'Proud moments & milestones',
      description: "We're a world-class park destination specializing in wonder, heart-pumping rides, immersive family theater, and unforgettable memories for millions of visitors each year.",
      btnText: "Let's Get Started",
    },
    factsHeader: {
      eyebrow: 'Our Facts',
      title: 'Fun-packed numbers that speak for themselves',
    },
    familyBanner: {
      eyebrow: 'Start Your Family Adventure!',
      title: 'Unforgettable Adventures for the Whole Family',
      yearsText: '25+ Years Experience',
    },
    pricingHeader: {
      eyebrow: 'Our Pricing Plans',
      title: 'Daily, group & VIP passes tailored to you',
    },
    planVisit: {
      title: 'Plan ahead for a perfect day',
      paragraph: "Skip the ticket booth queues and plan your perfect day ahead! Our easy appointment and reservation system lets you customize your visit in just a few clicks—whether you're coming with family or a group.",
      hoursWeekday: 'Monday - Friday: 08:00 - 18:00',
      hoursWeekend: 'Saturday - Sunday: 08:00 - 22:00',
      image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80',
    },
    faqHeader: {
      eyebrow: 'Frequently Asked Questions',
      title: 'Common questions about tickets, rides & safety',
      paragraph: "We know you've got questions—and we're here with clear answers! Whether you're planning your first visit, organizing a school group, or holding a seasonal pass.",
      experienceText: 'In the new era of amusement and hospitality, we look to the future with confidence, safety pride, and proven expertise—built over two decades of delivering excellence.',
    },
    testimonialsHeader: {
      eyebrow: 'Our Testimonials',
      title: 'Guest experiences that speak louder',
      ratingScore: '4.98',
      ratingLabel: 'From 2,488+ verified reviews',
    },
    blogHeader: {
      eyebrow: 'Latest Blogs',
      title: 'Your ultimate guide to fun',
    },
    footerBanner: {
      title: 'Helpful link, contact, hours & more below',
      stampText: '25+ YEARS EXPERIENCE',
    },
  },
  attractions: [
    {
      id: 'attr-1',
      title: 'Event & Party Spaces',
      category: 'Facilities',
      description: 'We are excited to welcome you and host thrilling celebrations, birthday blowouts, and corporate festivals for your group.',
      image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=800&q=80',
      badge: 'Private Bookings',
      featured: true,
      status: 'active',
      order: 1,
    },
    {
      id: 'attr-2',
      title: 'Themed Gift Shops',
      category: 'Retail',
      description: 'Explore handcrafted souvenirs, plush mascot treasures, festival merchandise, and collectible tokens from every zone.',
      image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
      badge: 'Exclusive Apparel',
      featured: true,
      status: 'active',
      order: 2,
    },
    {
      id: 'attr-3',
      title: 'Food Courts & Stations',
      category: 'Dining',
      description: 'Savor gourmet park delicacies, sweet spun cotton candy, artisanal hot pretzels, burgers, and refreshing craft lemonades.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      badge: '18+ Culinary Stands',
      featured: true,
      status: 'active',
      order: 3,
    },
    {
      id: 'attr-4',
      title: 'SkyRush Hyper-Coaster',
      category: 'Thrill Rides',
      description: 'Soar through the skies at 85 mph with zero-G inversions, vertical drops, and high-speed banked turns over the central lake.',
      image: 'https://images.unsplash.com/photo-1505771226610-9762d2994cb9?auto=format&fit=crop&w=800&q=80',
      badge: '85 MPH Thrill',
      featured: true,
      status: 'active',
      order: 4,
    },
    {
      id: 'attr-5',
      title: 'Victorian Grand Carousel',
      category: 'Family Rides',
      description: 'Hand-carved illuminated wooden horses and antique calliope music providing nostalgic family joy for all generations.',
      image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
      badge: 'All Ages Welcome',
      featured: false,
      status: 'active',
      order: 5,
    },
    {
      id: 'attr-6',
      title: 'Splash Rapids River Plunge',
      category: 'Water Rides',
      description: 'Whitewater raft adventure through misty canyon falls and explosive wave chambers to cool off on warm summer afternoons.',
      image: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=800&q=80',
      badge: 'Water Adventure',
      featured: false,
      status: 'active',
      order: 6,
    },
  ],
  pricingPlans: [
    {
      id: 'pkg-school-std',
      name: 'School Educational Explorer Pass',
      category: 'school' as GroupType,
      pricePerPerson: 1800,
      dayPrice: 1800,
      seasonPrice: 1800,
      period: '/ Student',
      minGroup: 20,
      freePersonsIncluded: 3,
      freePersonRuleLabel: '3 Free Teacher Passes included (1 free per 10 students)',
      isPopular: false,
      description: 'Field trip pass featuring unlimited family-friendly rides, STEM workbook, and 1 free teacher pass for every 10 students.',
      features: [
        'Unlimited family-friendly rides & coasters',
        '1 Free teacher per 10 students',
        'Free dedicated coach & bus parking bay',
        'Safety wristbands & student check-in',
      ],
      badge: 'K-12 & Primary Schools',
      order: 1,
      status: 'active',
    },
    {
      id: 'pkg-school-stem',
      name: 'STEM Science & Physics Coaster Day',
      category: 'school' as GroupType,
      pricePerPerson: 2400,
      dayPrice: 2400,
      seasonPrice: 2400,
      period: '/ Student',
      minGroup: 25,
      freePersonsIncluded: 4,
      freePersonRuleLabel: '4 Free Chaperones / Teachers included',
      isPopular: true,
      description: 'Hands-on coaster physics lab, guided park mechanics tour, and reserved lunch canopy shelter for group gatherings.',
      features: [
        'Guided ride mechanics & engineering tour',
        'Physics experiment worksheets',
        '4 Free teacher passes included',
        'Dedicated park coordinator host',
      ],
      badge: 'Middle & High Schools',
      order: 2,
      status: 'active',
    },
    {
      id: 'pkg-uni-fest',
      name: 'University Campus Explorer & Coasters',
      category: 'university' as GroupType,
      pricePerPerson: 1800,
      dayPrice: 1800,
      seasonPrice: 1800,
      period: '/ Student',
      minGroup: 20,
      freePersonsIncluded: 2,
      freePersonRuleLabel: '2 Free Student Union Organizers included',
      isPopular: false,
      description: 'Complete park access including high-speed roller coasters, thrill rides, and student union discount privileges.',
      features: [
        'All high-thrill extreme roller coasters included',
        'Dedicated student union check-in fast lane',
        '2 Free student union lead passes',
        'Complimentary bus bay & group drop-off',
      ],
      badge: 'Colleges & Universities',
      order: 3,
      status: 'active',
    },
    {
      id: 'pkg-uni-dj',
      name: 'University Mega Thrills & DJ Amphitheater',
      category: 'university' as GroupType,
      pricePerPerson: 2400,
      dayPrice: 2400,
      seasonPrice: 2400,
      period: '/ Student',
      minGroup: 30,
      freePersonsIncluded: 3,
      freePersonRuleLabel: '3 Free Society Leads & Faculty included',
      isPopular: true,
      description: 'All-day coaster access plus reserved evening seating at the concert amphitheater, DJ music lawn, and fireworks.',
      features: [
        'All-day thrill rides & coaster bypass',
        'VIP DJ lawn reserved seating',
        'Evening fireworks viewing zone',
        '3 Free society organizers passes',
      ],
      badge: 'Societies & Farewells',
      order: 4,
      status: 'active',
    },
    {
      id: 'pkg-corp-retreat',
      name: 'Corporate Team Offsite & Coaster Pass',
      category: 'corporate' as GroupType,
      pricePerPerson: 1800,
      dayPrice: 1800,
      seasonPrice: 1800,
      period: '/ Attendee',
      minGroup: 15,
      freePersonsIncluded: 2,
      freePersonRuleLabel: '2 Free Executive Organizers included',
      isPopular: false,
      description: 'Team building day pass with park-wide access, scavenger hunt challenge app, and reserved shaded networking pavilion.',
      features: [
        'Full park admission with FastPass boarding',
        'Interactive team scavenger hunt challenge',
        '2 Free executive organizer passes',
        'Reserved shaded networking pavilion',
      ],
      badge: 'Companies & Startups',
      order: 5,
      status: 'active',
    },
    {
      id: 'pkg-corp-gala',
      name: 'Corporate Executive Summit & Pavilion',
      category: 'corporate' as GroupType,
      pricePerPerson: 2400,
      dayPrice: 2400,
      seasonPrice: 2400,
      period: '/ Attendee',
      minGroup: 25,
      freePersonsIncluded: 5,
      freePersonRuleLabel: '5 Free VIP Passes & Speakers included',
      isPopular: true,
      description: 'Premium corporate experience with dedicated stage, audio-visual system, private dining zone, and VIP concierge host.',
      features: [
        'VIP front-of-line FastPass priority',
        'Private stage & audio-visual setup',
        '5 Free VIP passes & guest speakers',
        'Dedicated event manager & VIP parking',
      ],
      badge: 'Annual Galas & Offsites',
      order: 6,
      status: 'active',
    },
  ],
  milestones: [
    {
      id: 'm-1',
      year: '2015 - 2016',
      title: 'Best Design & Theme Award',
      description: 'Honored with the International Attractions Gold Medallion for immersive zone storytelling and architectural coaster design.',
      order: 1,
    },
    {
      id: 'm-2',
      year: '2016 - 2017',
      title: 'Global Park Safety Winner',
      description: 'Certified 100% safety index across all high-thrill coaster mechanics and automated guest management systems.',
      order: 2,
    },
    {
      id: 'm-3',
      year: '2017 - 2018',
      title: 'Design Of The Year',
      description: 'Celebrated for unveiling the 360-degree holographic castle projections and choreographed lake pyrotechnics.',
      order: 3,
    },
    {
      id: 'm-4',
      year: '2017 - 2018',
      title: 'Family Entertainment Winner',
      description: 'Voted top park for multi-generational families with infant rest lounges, kid-friendly rides, and inclusive accessibility.',
      order: 4,
    },
    {
      id: 'm-5',
      year: '2018 - 2019',
      title: 'Culinary Festival Award Winner',
      description: 'Awarded for culinary variety across 18 themed bistros, seasonal autumn food walks, and fair sweets.',
      order: 5,
    },
    {
      id: 'm-6',
      year: '2019 - 2026',
      title: 'Best Grand Jury & Guest Choice',
      description: 'Sustained 5-star TripAdvisor and ThemeParkInsider rating with over 10 million jubilant guest entries.',
      order: 6,
    },
  ],
  statistics: {
    bannerStats: [
      { id: 'bs-1', value: '150+', label: 'Attractions and Rides', order: 1 },
      { id: 'bs-2', value: '45+', label: 'Daily Live Performances', order: 2 },
      { id: 'bs-3', value: '10M+', label: 'Visitors Every Year', order: 3 },
      { id: 'bs-4', value: '99K+', label: 'Festival & Seasonal Events', order: 4 },
    ],
    floatingStats: {
      stat1Value: '50+',
      stat1Label: 'Attractions and Rides',
      stat1Desc: 'From pulse-pounding hyper-coasters to gentle kiddie carousels.',
      stat2Value: '20+',
      stat2Label: 'Festivals and Seasonal Events',
      stat2Desc: 'Halloween Frights, Summer Splash, Winter Wonderland & Spring Glow.',
    },
    achievements: [
      {
        id: 'ach-1',
        percentage: '98%',
        title: 'SkyRush Coaster',
        description: 'Soar through the skies at lightning speed with dual inversions, zero-G rolls, and gravity-defying drops.',
        details: 'Over 4,200 ft of steel track, reaches top speeds in 2.8 seconds.',
        order: 1,
      },
      {
        id: 'ach-2',
        percentage: '94%',
        title: 'Enchanted Forest Zone',
        description: 'Dive into an erupting volcano and mythical ancient canopy in this explosive, immersive dark ride journey.',
        details: 'Sensory water mist, pyrotechnics, and live-actor encounters along 12 themed caverns.',
        order: 2,
      },
      {
        id: 'ach-3',
        percentage: '99%',
        title: 'Castle Of Dreams Live Show',
        description: 'A magical kingdom filled with fairytale creatures, dazzling aerial acrobatics, and nightly synchronized fireworks.',
        details: 'Over 60 world-class stage performers, projection mapping onto a 75-foot fairytale fortress.',
        order: 3,
      },
    ],
  },
  testimonials: [
    {
      id: 't-1',
      name: 'Leslie Alexander',
      role: 'Family Season Passholder',
      rating: 5,
      comment:
        'We visited during the summer festival, and every single moment was packed with pure joy. The roller coasters were thrilling and impeccably maintained, the food courts offered amazing variety, and my children were completely enchanted by the evening fireworks show! Customer service made booking effortless.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      visitDate: 'Visited July 2026',
      order: 1,
    },
    {
      id: 't-2',
      name: 'Marcus Vance',
      role: 'Adrenaline Seeker & Coaster Critic',
      rating: 5,
      comment:
        'SkyRush Coaster completely blew away my expectations! The dual launch and zero-G airtime hills rival the best parks in the world. Having the Festival Pass express lane meant zero waiting in lines during peak weekend hours. Best entertainment day of the year.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      visitDate: 'Visited August 2026',
      order: 2,
    },
    {
      id: 't-3',
      name: 'Sarah & David Sterling',
      role: 'Grandparents & Group Visitors',
      rating: 5,
      comment:
        'Taking six grandchildren to an amusement park usually feels overwhelming, but Wild Venture was pure delight. Spotlessly clean facilities, quiet shaded gardens for resting, and cheerful attendants at every ride made our family reunion unforgettable.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      visitDate: 'Visited September 2026',
      order: 3,
    },
  ],
  blogPosts: [
    {
      id: 'blog-1',
      title: 'The Ultimate Theme Park Bucket List for Every Age',
      category: 'Park Guides',
      date: 'Oct 24, 2026',
      readTime: '4 min read',
      excerpt:
        'From heart-pounding roller coasters for adrenaline junkies to magical character parades for toddlers, here is your essential master checklist for a legendary visit.',
      content:
        'Whether you are chasing the high-G loops of the SkyRush Hyper-Coaster or seeking the whimsical melodies of the Victorian Grand Carousel, planning your itinerary will transform a good day into an extraordinary adventure.',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      status: 'published',
    },
    {
      id: 'blog-2',
      title: 'Dance, Feast, Celebrate: The Most Iconic Seasonal Festivals',
      category: 'Festivals & Events',
      date: 'Oct 18, 2026',
      readTime: '6 min read',
      excerpt:
        'Discover the lineup for our upcoming Autumn Lantern Fiesta and Winter Wonderland: live orchestral stages, 50-foot light sculptures, and artisan culinary treats.',
      content:
        'Join thousands of visitors as we illuminate the central lagoon with breathtaking laser synchronizations, live brass bands, and artisan food stalls from 12 countries.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      status: 'published',
    },
    {
      id: 'blog-3',
      title: 'Preparing Your Family Trip: Essential Safety & Fun Tips',
      category: 'Visitor Tips',
      date: 'Oct 12, 2026',
      readTime: '5 min read',
      excerpt:
        'Maximize ride time and minimize waiting! Expert advice on fast-pass queuing, hydration spots, stroller rentals, and the best times to capture sunset castle photos.',
      content:
        'Arrive at park opening (08:00 AM) to experience premier thrill coasters with minimal queues. Download the digital pass for real-time wait monitors and mobile ordering.',
      image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80',
      status: 'published',
    },
  ],
  faqs: [
    {
      id: 1,
      question: "1. What are the park's opening hours?",
      answer: 'Our gates open promptly at 8:00 AM every day. Main thrill rides operate until 6:00 PM Monday through Friday, and extend until 10:00 PM on Saturdays and Sundays. Evening fireworks and festival concert stages run until 11:30 PM during summer and weekend periods.',
      order: 1,
    },
    {
      id: 2,
      question: '2. Do I need to buy tickets in advance?',
      answer: 'While tickets can be purchased at the gate, we strongly recommend reserving online in advance. Online reservations guarantee your park entry slot, provide up to 35% discount pricing, and allow you to skip the front-gate queuing lines with instant QR mobile scan.',
      order: 2,
    },
    {
      id: 3,
      question: '3. Are there rides suitable for young children?',
      answer: "Yes! Over 22 attractions are dedicated specifically to toddlers and young children in our 'Enchanted Kingdom' and 'Wonderland Carousel' zones, with gentle height requirements, padded play areas, and certified attendants on duty at all times.",
      order: 3,
    },
    {
      id: 4,
      question: '4. What happens in case of rain?',
      answer: 'Our park remains open in light rain! If severe thunderstorms or lightning occur, outdoor high-thrill coasters pause temporarily for safety, while over 15 indoor rides, arcade zones, 4D theaters, and sheltered dining pavilions continue full operation. We also issue Rain Check vouchers if weather interrupts your day.',
      order: 4,
    },
    {
      id: 5,
      question: '5. Are parking and locker rentals available on site?',
      answer: 'Yes, we offer secure on-site parking for over 4,500 vehicles with dedicated EV charging bays. Keyless electronic lockers with mobile PIN access are situated at the park entrance and adjacent to major water rides.',
      order: 5,
    },
  ],
  navigationLinks: [
    { id: 'nav-1', label: 'Home', href: '/', order: 1, isVisible: true },
    { id: 'nav-2', label: 'About Us', href: '/about', order: 2, isVisible: true },
    { id: 'nav-3', label: 'Attractions', href: '/attractions', order: 3, isVisible: true },
    { id: 'nav-4', label: 'Services', href: '/services', order: 4, isVisible: true },
    { id: 'nav-5', label: 'Pricing', href: '/pricing', order: 5, isVisible: true },
    { id: 'nav-6', label: 'Blog', href: '/blog', order: 6, isVisible: true },
    { id: 'nav-7', label: 'FAQ', href: '/faq', order: 7, isVisible: true },
    { id: 'nav-8', label: 'Contact Us', href: '/contact', order: 8, isVisible: true },
  ],
  bookings: [
    {
      id: 'book-1001',
      bookingRef: 'SCH-948201',
      groupType: 'school',
      organizationName: 'St. Jude International Academy',
      department: 'Middle & High School Science Club',
      contactName: 'Mrs. Eleanor Vance',
      contactEmail: 'eleanor.vance@stjude-academy.org',
      contactPhone: '+1 (555) 234-5678',
      designation: 'Lead Science Educator & Trip Coordinator',
      visitDate: '2026-11-12',
      backupDate: '2026-11-19',
      studentCount: 120,
      supervisorCount: 12,
      totalAttendees: 132,
      packageType: 'School STEM & Thrill Explorer Pass',
      cateringOption: 'Healthy Boxed Lunch & Fruit Snacks',
      busParking: true,
      guidedTour: true,
      conferenceHall: false,
      specialRequests: 'Need physics demonstrator for the roller coaster centrifugal force workshop.',
      estimatedTotal: 2880.00,
      totalAmount: 2880.00,
      customerName: 'Mrs. Eleanor Vance (St. Jude International)',
      customerEmail: 'eleanor.vance@stjude-academy.org',
      customerPhone: '+1 (555) 234-5678',
      planName: 'School STEM & Thrill Explorer Pass',
      adults: 12,
      children: 120,
      status: 'confirmed',
      createdAt: '2026-10-28T14:30:00.000Z',
    },
    {
      id: 'book-1002',
      bookingRef: 'UNI-837192',
      groupType: 'university',
      organizationName: 'Metropolitan University Student Union',
      department: 'Engineering & Computing Society',
      contactName: 'David K. Miller',
      contactEmail: 'd.miller@metro-students.edu',
      contactPhone: '+1 (555) 876-5432',
      designation: 'Student Union Social Secretary',
      visitDate: '2026-11-18',
      backupDate: '2026-11-25',
      studentCount: 85,
      supervisorCount: 4,
      totalAttendees: 89,
      packageType: 'Campus Society Sunset Pass & DJ Zone',
      cateringOption: 'Festival Gourmet Burger Buffet & Soft Drinks',
      busParking: true,
      guidedTour: false,
      conferenceHall: true,
      specialRequests: 'Access to the amphitheater stage for our societies welcome session.',
      estimatedTotal: 2580.00,
      totalAmount: 2580.00,
      customerName: 'David K. Miller (Metro University SU)',
      customerEmail: 'd.miller@metro-students.edu',
      customerPhone: '+1 (555) 876-5432',
      planName: 'Campus Society Sunset Pass',
      adults: 89,
      children: 0,
      status: 'pending',
      createdAt: '2026-10-29T01:15:00.000Z',
    },
    {
      id: 'book-1003',
      bookingRef: 'CORP-472910',
      groupType: 'corporate',
      organizationName: 'Apex Cloud Technologies Ltd.',
      department: 'People Operations & Culture',
      contactName: 'Victoria Sterling',
      contactEmail: 'v.sterling@apexcloud.io',
      contactPhone: '+1 (555) 432-8765',
      designation: 'Head of People & Corporate Events',
      visitDate: '2026-12-04',
      backupDate: '2026-12-11',
      studentCount: 0,
      supervisorCount: 0,
      totalAttendees: 150,
      packageType: 'Corporate Executive Gala & VIP FastPass',
      cateringOption: 'Full Gourmet BBQ Pavilion & Mocktail Bar',
      busParking: true,
      guidedTour: true,
      conferenceHall: true,
      specialRequests: 'Company banners around Pavilion 3 and microphone sound system required for CEO speech.',
      estimatedTotal: 7350.00,
      totalAmount: 7350.00,
      customerName: 'Victoria Sterling (Apex Cloud Tech)',
      customerEmail: 'v.sterling@apexcloud.io',
      customerPhone: '+1 (555) 432-8765',
      planName: 'Corporate Executive Gala Pass',
      adults: 150,
      children: 0,
      status: 'confirmed',
      createdAt: '2026-10-30T04:20:00.000Z',
    },
  ] as GroupBookingItem[],
  contactMessages: [
    {
      id: 'msg-1',
      firstName: 'Samantha',
      lastName: 'Reed',
      email: 'samantha.reed@example.com',
      phone: '+1 (555) 432-8976',
      visitDate: '2026-11-15',
      ticketType: 'Family Pass',
      message: 'Looking to organize a birthday party for my 8-year-old daughter with 15 guests. Do you provide a dedicated celebration host and private cabana?',
      status: 'unread',
      createdAt: '2026-10-29T02:10:00.000Z',
    },
  ],
  mediaLibrary: [
    {
      id: 'media-1',
      name: 'Hero Dusk Fairgrounds',
      url: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85',
      size: '1.4 MB',
      type: 'image/jpeg',
      uploadedAt: '2026-10-25',
    },
    {
      id: 'media-2',
      name: 'Day Roller Coaster & Crowds',
      url: 'https://images.unsplash.com/photo-1505771226610-9762d2994cb9?auto=format&fit=crop&w=800&q=80',
      size: '890 KB',
      type: 'image/jpeg',
      uploadedAt: '2026-10-26',
    },
    {
      id: 'media-3',
      name: 'Night Festival Glow Street',
      url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      size: '1.1 MB',
      type: 'image/jpeg',
      uploadedAt: '2026-10-27',
    },
    {
      id: 'media-4',
      name: 'Sky Swing Aerial Ride',
      url: 'https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80',
      size: '950 KB',
      type: 'image/jpeg',
      uploadedAt: '2026-10-28',
    },
  ],
  siteVisibility: {
    pages: {
      home: true,
      about: true,
      attractions: true,
      services: true,
      pricing: true,
      blog: true,
      faq: true,
      contact: true,
    },
    sections: {
      announcementBar: true,
      hero: true,
      about: true,
      facilities: true,
      attractionsCoaster: true,
      milestones: true,
      funNumbers: true,
      familyBanner: true,
      pricing: true,
      planVisit: true,
      faq: true,
      testimonials: true,
      blog: true,
      floatingBuyButton: true,
    },
    maintenanceSettings: {
      title: 'Attraction Temporarily Closed',
      message: 'This section is currently undergoing scheduled maintenance and updates for the festival. Please check back shortly or explore our other park attractions!',
      showHomeButton: true,
    },
  },
  customLandingSections: [
    {
      id: 'custom-sec-1',
      title: 'Exclusive Park Perks & VIP Benefits',
      eyebrow: 'VIP Member Perks',
      description: 'Enhance your adventure with priority express lane passes, gourmet dining discounts, complimentary souvenir cups, and exclusive front-row festival fireworks viewing.',
      layout: 'cards_grid' as const,
      themeStyle: 'cream' as const,
      position: 'after_attractions' as const,
      order: 1,
      isVisible: true,
      buttonText: 'Explore VIP Passes',
      buttonLink: '/pricing',
      image: '',
      items: [
        {
          id: 'item-1',
          title: 'Priority FastPass Line',
          description: 'Bypass regular queue times and step directly onto top roller coasters with dedicated express gates.',
          icon: 'ticket',
          badge: 'Fast Lane',
        },
        {
          id: 'item-2',
          title: 'Gourmet Dining Credits',
          description: 'Enjoy 20% off at all sit-down restaurants, artisan bakery cafes, and festival food stalls across the grounds.',
          icon: 'coffee',
          badge: 'Dining',
        },
        {
          id: 'item-3',
          title: 'Reserved Fireworks Seating',
          description: 'Access the private lakefront terrace for unobstructed views of our nightly music and fireworks extravaganza.',
          icon: 'sparkles',
          badge: 'Spectacle',
        },
      ],
      createdAt: '2026-10-29',
    },
  ] as CustomLandingSection[],
  customPages: [
    {
      id: 'custom-page-1',
      slug: 'safety-guidelines',
      title: 'Park Safety & Rider Guidelines',
      eyebrow: 'Guest Safety First',
      subtitle: 'Learn about our comprehensive daily safety inspections, ride height requirements, accessibility accommodations, and family health guidelines.',
      heroImage: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=2000&q=85',
      badge: 'Safety Certified',
      bodyContent: 'Your safety is our utmost priority at Wild Venture Funfair. Every roller coaster, aerial swing, and water slide undergoes daily multi-point mechanical inspections by certified safety engineers before park gates open.',
      showInNav: false,
      showInFooter: true,
      isVisible: true,
      sections: [
        {
          id: 'sec-safety-1',
          title: 'Daily Rigorous Inspections',
          eyebrow: 'Certified Engineering',
          description: 'Our certified engineering staff performs comprehensive structural, electronic, and pneumatic checks on all 50+ rides before the first guest enters the park.',
          layout: 'text_image' as const,
          themeStyle: 'white' as const,
          image: 'https://images.unsplash.com/photo-1505771226610-9762d2994cb9?auto=format&fit=crop&w=800&q=80',
          buttonText: 'Contact Safety Desk',
          buttonLink: '/contact',
          order: 1,
          isVisible: true,
          items: [],
        },
        {
          id: 'sec-safety-2',
          title: 'Essential Safety Rules',
          eyebrow: 'Rider Advice',
          description: 'Key guidelines to ensure a safe, magical experience for everyone in your group.',
          layout: 'cards_grid' as const,
          themeStyle: 'cream' as const,
          order: 2,
          isVisible: true,
          items: [
            {
              id: 'item-1',
              title: 'Height & Restraints',
              description: 'Check height requirements at ride entrances. Restraints must click securely in place before ride start.',
              badge: 'Requirement',
              icon: 'check',
            },
            {
              id: 'item-2',
              title: 'Loose Articles & Bags',
              description: 'Use complimentary ride-side lockers or leave loose articles with a non-riding companion.',
              badge: 'Storage',
              icon: 'shield',
            },
            {
              id: 'item-3',
              title: 'Follow Operator Guidance',
              description: 'Follow all audible cues, audio signals, and instructions given by our uniformed safety operators.',
              badge: 'Guidelines',
              icon: 'users',
            },
          ],
        },
      ],
      createdAt: '2026-10-29',
    },
  ] as CustomPage[],
  roles: [
    {
      id: 'role-superadmin',
      name: 'Super Administrator',
      description: 'Unrestricted full access across all park sections, branding, pricing, theme, users, and publishing controls.',
      color: 'emerald',
      isSystem: true,
      pages: {
        dashboard: true,
        branding: true,
        theme: true,
        homepage: true,
        attractions: true,
        pricing: true,
        statistics: true,
        testimonials: true,
        blog: true,
        faqs: true,
        navigation: true,
        visibility: true,
        bookings: true,
        contact: true,
        media: true,
        users: true,
      },
      options: {
        canPublish: true,
        canDelete: true,
        canManageUsers: true,
        canExportData: true,
        canEditTheme: true,
        canManageBookings: true,
      },
      createdAt: '2026-10-25',
    },
    {
      id: 'role-editor',
      name: 'Content & Marketing Editor',
      description: 'Manages promotional banners, news articles, FAQs, testimonials, and media library assets.',
      color: 'blue',
      isSystem: false,
      pages: {
        dashboard: true,
        branding: false,
        theme: false,
        homepage: true,
        attractions: false,
        pricing: false,
        statistics: false,
        testimonials: true,
        blog: true,
        faqs: true,
        navigation: false,
        visibility: false,
        bookings: false,
        contact: false,
        media: true,
        users: false,
      },
      options: {
        canPublish: true,
        canDelete: false,
        canManageUsers: false,
        canExportData: false,
        canEditTheme: false,
        canManageBookings: false,
      },
      createdAt: '2026-10-25',
    },
    {
      id: 'role-operations',
      name: 'Rides & Park Operations',
      description: 'Controls attraction schedules, thrill ride specs, height requirements, and landing page sections.',
      color: 'amber',
      isSystem: false,
      pages: {
        dashboard: true,
        branding: false,
        theme: false,
        homepage: false,
        attractions: true,
        pricing: false,
        statistics: true,
        testimonials: false,
        blog: false,
        faqs: true,
        navigation: false,
        visibility: true,
        bookings: false,
        contact: false,
        media: true,
        users: false,
      },
      options: {
        canPublish: true,
        canDelete: false,
        canManageUsers: false,
        canExportData: false,
        canEditTheme: false,
        canManageBookings: false,
      },
      createdAt: '2026-10-26',
    },
    {
      id: 'role-guest-relations',
      name: 'Guest Relations & Ticketing',
      description: 'Processes ticket bookings, passes, customer inquiries, feedback messages, and pricing packages.',
      color: 'purple',
      isSystem: false,
      pages: {
        dashboard: true,
        branding: false,
        theme: false,
        homepage: false,
        attractions: false,
        pricing: true,
        statistics: false,
        testimonials: true,
        blog: false,
        faqs: true,
        navigation: false,
        visibility: false,
        bookings: true,
        contact: true,
        media: false,
        users: false,
      },
      options: {
        canPublish: false,
        canDelete: false,
        canManageUsers: false,
        canExportData: true,
        canEditTheme: false,
        canManageBookings: true,
      },
      createdAt: '2026-10-27',
    },
  ] as AdminRole[],
  users: [
    {
      id: 'user-admin',
      name: 'Arthur Pendelton',
      email: 'admin@wildventure.com',
      password: 'admin123',
      roleId: 'role-superadmin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      status: 'active',
      phone: '+1 (800) 132-468',
      createdAt: '2026-10-25',
      lastLogin: '2026-10-30 08:30',
    },
    {
      id: 'user-editor',
      name: 'Marcus Vance',
      email: 'marcus@wildventure.com',
      password: 'editor123',
      roleId: 'role-editor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      status: 'active',
      phone: '+1 (800) 244-899',
      createdAt: '2026-10-26',
      lastLogin: '2026-10-29 16:45',
    },
    {
      id: 'user-operations',
      name: 'Elena Rostova',
      email: 'elena@wildventure.com',
      password: 'rides123',
      roleId: 'role-operations',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      status: 'active',
      phone: '+1 (800) 355-112',
      createdAt: '2026-10-27',
      lastLogin: '2026-10-30 07:15',
    },
    {
      id: 'user-guest',
      name: 'David Chen',
      email: 'david@wildventure.com',
      password: 'guest123',
      roleId: 'role-guest-relations',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      status: 'active',
      phone: '+1 (800) 466-778',
      createdAt: '2026-10-28',
      lastLogin: '2026-10-29 11:20',
    },
  ] as AdminUser[],
  adminAuth: {
    password: 'admin123',
    tokenSecret: 'funfair-wildventure-secret-2026',
  },
};

export type DatabaseSchema = typeof defaultDatabase;
