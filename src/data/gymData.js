// KINETIX ATHLETIC CLUB - Centralized Business Data Layer
// Architected for easy connection to FastAPI / Supabase backend

export const GYM_CONFIG = {
  name: "KINETIX ATHLETIC CLUB",
  shortName: "KINETIX",
  tagline: "BUILD YOUR STRONGEST SELF.",
  subTagline: "The Gold Standard of Strength, Conditioning & Athletic Transformation",
  phone: "+91 98765 43210",
  phoneRaw: "+919876543210",
  whatsappNumber: "919876543210",
  whatsappDefaultMsg: "Hi, I am interested in joining KINETIX Athletic Club. I would like to know about your membership plans and book my free trial.",
  email: "membership@kinetixathletic.com",
  address: "Level 4 & 5, Apex Pinnacle Towers, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
  landmark: "Opposite Metro Pillar 142, Above WholeFoods Store",
  mapUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru+Kinetix+Gym",
  hours: {
    weekdays: "5:30 AM – 10:30 PM",
    sunday: "7:00 AM – 2:00 PM",
    holidays: "6:00 AM – 12:00 PM (Special Timings)"
  },
  socials: {
    instagram: "https://instagram.com/kinetixathletic",
    facebook: "https://facebook.com/kinetixathletic",
    youtube: "https://youtube.com/@kinetixathletic"
  }
};

export const HERO_DATA = {
  badge: "PREMIUM FITNESS • STRENGTH • PERFORMANCE",
  headingLine1: "BUILD YOUR",
  headingHighlight: "STRONGEST",
  headingLine2: "SELF.",
  subtext: "Train with expert coaches, Olympic-grade equipment and an elite community designed to help you reach your fitness goals.",
  primaryCta: "START YOUR JOURNEY",
  secondaryCta: "BOOK A FREE TRIAL",
  statsPill: {
    rating: "4.9/5",
    reviewsCount: "1,280+",
    accolade: "Voted Best Athletic Club 2025"
  }
};

export const STATS_DATA = [
  { value: 10, suffix: "+", label: "Years Experience", description: "Pioneering athletic training since 2016" },
  { value: 2500, suffix: "+", label: "Active Members", description: "Dedicated community of achievers" },
  { value: 15, suffix: "+", label: "Expert Trainers", description: "CSCS & Olympic certified coaches" },
  { value: 50, suffix: "+", label: "Weekly Programs", description: "Strength, HIIT, mobility & boxing" }
];

export const ABOUT_DATA = {
  badge: "OUR PHILOSOPHY",
  title: "MORE THAN A GYM.",
  highlight: "A HABITAT FOR HIGH ACHIEVERS.",
  description: "Founded on the belief that peak physical performance transforms every aspect of life, KINETIX was built to eliminate standard gym friction. No crowded machines, no outdated equipment, and no generic routines.",
  paragraphs: [
    "Every square foot of our 18,000 sq.ft facility is purpose-engineered: from calibrated Eleiko barbells and acoustic sound-dampened lifting platforms to private biometric assessment labs.",
    "Whether your target is shedding 15 kilograms, stepping onto a powerlifting platform, or developing athletic stamina for life, our coaches craft tailored roadmaps backed by scientific periodization and continuous accountability."
  ],
  pillars: [
    {
      title: "Precision Biomechanics",
      description: "Movement screening before lifting a single weight to prevent injury and unlock maximum power output."
    },
    {
      title: "Olympic Grade Rigging",
      description: "Eleiko, Prime Fitness, and Rogue equipment calibrated for smooth resistance profiles and safe loading."
    },
    {
      title: "Bio-Recovery & Sauna",
      description: "Infrared thermal saunas, cold compression therapy, and private nutrition consultations for rapid muscle recovery."
    }
  ],
  imageMain: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
  imageSecondary: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
  experienceYears: 10
};

export const PROGRAMS_DATA = [
  {
    id: "strength-training",
    title: "Strength Training",
    category: "Strength",
    tagline: "Build absolute power, bulletproof joints and dense muscle.",
    description: "Build strength, power and muscle through structured progressive overload and Olympic barbell mechanics.",
    difficulty: "All Levels",
    duration: "60 Mins",
    intensity: "High",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    benefits: [
      "Targeted compound lifts: Squat, Bench, Deadlift, Overhead Press",
      "Progressive periodization tracked via personal dashboard",
      "Corrective posture drills to safeguard lumbar & shoulders"
    ],
    recommendedFor: "Anyone looking to increase absolute strength and functional bone density."
  },
  {
    id: "weight-loss",
    title: "Weight Loss & MetCon",
    category: "Fat Loss",
    tagline: "Shed stubborn body fat while preserving lean muscle mass.",
    description: "Improve fitness, burn fat and build sustainable habits through high-energy metabolic conditioning.",
    difficulty: "Beginner to Intermediate",
    duration: "45 Mins",
    intensity: "Very High",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
    benefits: [
      "EPOC afterburn effect burns calories for up to 24 hours post-workout",
      "Custom macro-nutrition roadmap and daily accountability check-ins",
      "Low impact heart-rate zone tracking to protect joints"
    ],
    recommendedFor: "Individuals seeking sustainable fat loss and all-day cardiovascular stamina."
  },
  {
    id: "muscle-building",
    title: "Muscle Building",
    category: "Strength",
    tagline: "Hypertrophy science engineered for aesthetic symmetry.",
    description: "Progressive training designed for hypertrophy, muscle definition, and elite athletic performance.",
    difficulty: "Intermediate to Advanced",
    duration: "60 Mins",
    intensity: "High",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
    benefits: [
      "High mechanical tension and metabolic stress training cycles",
      "Targeted lagging muscle group prioritization",
      "Supplement and protein synthesis optimization protocol"
    ],
    recommendedFor: "Athletes and lifters aiming for muscle volume, shape, and strength balance."
  },
  {
    id: "personal-training",
    title: "Personal Training",
    category: "Personal",
    tagline: "Exclusive 1-on-1 coaching customized to your exact genetics.",
    description: "One-on-one coaching designed around your personal goals, schedule, and biomechanical profile.",
    difficulty: "Customized",
    duration: "60 Mins",
    intensity: "Personalized",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    benefits: [
      "Dedicated elite trainer in a private dedicated coaching bay",
      "Monthly 3D InBody scan and body composition analysis",
      "Flexible scheduling with 24/7 direct coach WhatsApp access"
    ],
    recommendedFor: "Busy executives, beginners needing proper form, or competitors seeking maximum velocity."
  },
  {
    id: "functional-training",
    title: "Functional Training",
    category: "Mobility",
    tagline: "Athletic agility, explosive speed and real-world durability.",
    description: "Improve mobility, endurance, balance, rotational power and real-world athletic performance.",
    difficulty: "All Levels",
    duration: "50 Mins",
    intensity: "Moderate to High",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop",
    benefits: [
      "Sled pushes, kettlebell complexes, plyometrics and sandbags",
      "Restores rotational hip power and spine decompression",
      "Drastically boosts athletic reflexes and stamina"
    ],
    recommendedFor: "Runners, weekend warriors, and those seeking effortless everyday mobility."
  },
  {
    id: "group-classes",
    title: "Group Classes",
    category: "Group",
    tagline: "Electrifying group energy, curated playlists and team drive.",
    description: "High-energy classes that combine training, motivation and community to push past limits together.",
    difficulty: "All Levels",
    duration: "45 Mins",
    intensity: "High Energy",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop",
    benefits: [
      "HIIT, Boxing Circuits, Core Blast, and Power Flow formats",
      "World-class energetic coaches pushing you through every set",
      "Unmatched camaraderie and supportive group accountability"
    ],
    recommendedFor: "Anyone who thrives on community motivation and electric group synergy."
  }
];

export const TRAINERS_DATA = [
  {
    id: "arjun-sharma",
    name: "ARJUN SHARMA",
    role: "Head Strength & Conditioning Coach",
    experience: "8+ Years Experience",
    specialization: "Strength • Hypertrophy • Performance",
    certifications: ["CSCS (NSCA Certified)", "Eleiko Level 2 Coach", "Precision Nutrition L1"],
    bio: "Former national-level powerlifting competitor with over 400 successful client transformations. Specializes in barbell biomechanics and safe, sustainable strength building.",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop",
    instagram: "https://instagram.com",
    metrics: "450+ Lifters Coached"
  },
  {
    id: "maya-patel",
    name: "MAYA PATEL",
    role: "Lead HIIT & Metabolic Specialist",
    experience: "6+ Years Experience",
    specialization: "Fat Loss • Endurance • Olympic Lifting",
    certifications: ["CrossFit Level 3 Trainer", "ACE Certified Personal Trainer", "Kettlebell Athletics Pro"],
    bio: "Ex-collegiate sprinter turned elite conditioning coach. Maya’s high-octane programming combines functional cardio with weight training for maximum calorie burn and tone.",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop",
    instagram: "https://instagram.com",
    metrics: "1,200+ Classes Led"
  },
  {
    id: "kabir-roy",
    name: "KABIR ROY",
    role: "Master Body Recomposition Coach",
    experience: "10+ Years Experience",
    specialization: "Biomechanics • Recomp • Injury Rehab",
    certifications: ["ISSA Master Trainer", "FMS Functional Movement Specialist", "Sports Rehab Specialist"],
    bio: "Over a decade of transforming corporate professionals and competitive athletes. Kabir focuses on pinpoint posture correction, mobility restoration, and injury-free muscle gains.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    instagram: "https://instagram.com",
    metrics: "10+ Yrs Track Record"
  },
  {
    id: "ananya-sen",
    name: "ANANYA SEN",
    role: "Functional Mobility & Pilates Coach",
    experience: "7+ Years Experience",
    specialization: "Core Stability • Flexibility • Prehab",
    certifications: ["Polestar Pilates Certified", "NASM Corrective Exercise Specialist", "Yoga Alliance 500H"],
    bio: "Integrates clinical mobility drills with athletic conditioning to unlock hip fluidity, core tension control, and injury resilience for lifters of all experience levels.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    instagram: "https://instagram.com",
    metrics: "300+ Rehab Clients"
  }
];

export const MEMBERSHIP_PLANS = [
  {
    id: "basic",
    name: "BASIC",
    badge: "ESSENTIAL ACCESS",
    priceMonthly: 999,
    priceQuarterly: 2699, // ~899/mo
    priceAnnual: 9990,    // ~832/mo
    periodText: "MONTH",
    description: "Ideal for self-directed athletes looking for full access to world-class strength & cardio equipment.",
    popular: false,
    ctaText: "GET STARTED",
    features: [
      { text: "Full gym floor access (5:30 AM – 10:30 PM)", included: true },
      { text: "Olympic lifting & cardio zones", included: true },
      { text: "Luxury locker & shower facility", included: true },
      { text: "Free initial fitness & movement assessment", included: true },
      { text: "Mobile app workout tracking", included: true },
      { text: "1-on-1 Personal Trainer guidance", included: false },
      { text: "Personalized nutrition & meal plan", included: false },
      { text: "Steam & bio-sauna recovery access", included: false }
    ]
  },
  {
    id: "pro",
    name: "PRO",
    badge: "MOST POPULAR",
    priceMonthly: 1499,
    priceQuarterly: 3999, // ~1333/mo
    priceAnnual: 14990,   // ~1249/mo
    periodText: "MONTH",
    description: "The complete performance package with custom workout programming, trainer check-ins and group classes.",
    popular: true,
    ctaText: "GET STARTED",
    features: [
      { text: "Everything included in BASIC", included: true },
      { text: "Unlimited access to all Group Classes & HIIT", included: true },
      { text: "Personalized 4-week workout routine", included: true },
      { text: "Dedicated floor trainer form checks", included: true },
      { text: "Bi-weekly body composition & progress tracking", included: true },
      { text: "Thermal steam room & recovery lounge", included: true },
      { text: "1-on-1 Dedicated Personal Trainer", included: false },
      { text: "Priority locker reservation", included: false }
    ]
  },
  {
    id: "elite",
    name: "ELITE",
    badge: "VIP PERFORMANCE",
    priceMonthly: 2499,
    priceQuarterly: 6499, // ~2166/mo
    priceAnnual: 23990,   // ~1999/mo
    periodText: "MONTH",
    description: "The ultimate white-glove fitness experience with dedicated personal coaching, tailored nutrition, and VIP perks.",
    popular: false,
    ctaText: "START TRAINING",
    features: [
      { text: "Everything in PRO with unlimited VIP access", included: true },
      { text: "4 One-on-One Personal Training sessions / month", included: true },
      { text: "Customized clinical nutrition & macro roadmap", included: true },
      { text: "Full 3D InBody scan & metabolic rate testing", included: true },
      { text: "Unlimited infrared sauna & recovery suite", included: true },
      { text: "Free guest passes (2 per month)", included: true },
      { text: "Complimentary laundry & towel service", included: true },
      { text: "Priority booking for all premium workshops", included: true }
    ]
  }
];

export const TRANSFORMATIONS_DATA = [
  {
    id: "rahul-s",
    name: "Rahul Sharma",
    age: "29",
    profession: "Software Architect",
    goal: "Weight Loss & Core Strength",
    result: "-14 KG FAT LOSS",
    duration: "12 Weeks",
    metrics: {
      startWeight: "92 KG",
      endWeight: "78 KG",
      bodyFatChange: "29% → 16%",
      squatIncrease: "+35 KG"
    },
    beforeImg: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    quote: "Working 12-hour desk shifts ruined my back and posture. Arjun Sharma designed a schedule around my meetings. Dropping 14 kg completely changed my energy levels.",
    coach: "Coach Arjun Sharma"
  },
  {
    id: "priya-m",
    name: "Priya Menon",
    age: "34",
    profession: "Marketing Director",
    goal: "Tone, Stamina & Fat Reduction",
    result: "-11 KG & TONED",
    duration: "16 Weeks",
    metrics: {
      startWeight: "68 KG",
      endWeight: "57 KG",
      bodyFatChange: "31% → 20%",
      waistReduction: "-4.5 inches"
    },
    beforeImg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=600&auto=format&fit=crop",
    quote: "I tried countless fad diets and online apps. At KINETIX, the structured strength training and nutrition coaching made fat loss effortless and consistent.",
    coach: "Coach Maya Patel"
  },
  {
    id: "vikram-r",
    name: "Vikram Reddy",
    age: "26",
    profession: "Entrepreneur",
    goal: "Hypertrophy & Power",
    result: "+7.5 KG LEAN MUSCLE",
    duration: "20 Weeks",
    metrics: {
      startWeight: "64 KG",
      endWeight: "71.5 KG",
      bodyFatChange: "Maintained 12%",
      benchPress: "60kg → 105kg"
    },
    beforeImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    quote: "I was a 'hardgainer' for years. Coach Kabir showed me how proper mechanical tension and progressive surplus nutrition actually build dense, athletic muscle.",
    coach: "Coach Kabir Roy"
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Rahul S.",
    role: "Member for 1 Year",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    highlight: "Transformative Coaching & Zero Fluff",
    review: "The trainers actually understand your goals and help you stay consistent. I've never enjoyed training this much. The Olympic lifting platforms and vibe are unmatched.",
    program: "Personal Training & Strength"
  },
  {
    id: 2,
    name: "Sneha Varma",
    role: "Member for 8 Months",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    highlight: "Super Welcoming Environment",
    review: "As a woman stepping into a strength gym for the first time, I was nervous. The coaches made me feel completely respected and taught me proper deadlift and squat form without judgment.",
    program: "Strength & Group Classes"
  },
  {
    id: 3,
    name: "David D'Souza",
    role: "Member for 2 Years",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    highlight: "Best Facility in the City Hands Down",
    review: "I've trained in London and Singapore; KINETIX easily matches the best athletic clubs abroad. Spotless cleanliness, top-tier Rogue barbells, and the sauna after heavy squats is pure bliss.",
    program: "Elite Pro Membership"
  },
  {
    id: 4,
    name: "Kavita Rao",
    role: "Member for 1.5 Years",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    highlight: "Lost 12 kg and Kept It Off",
    review: "The InBody body analysis scans every month kept me accountable. Maya's HIIT classes push you to your absolute best without letting your form degrade. Worth every rupee.",
    program: "Weight Loss & Conditioning"
  }
];

export const FACILITIES_DATA = [
  {
    id: "strength-area",
    title: "Strength & Power Zone",
    description: "6 Olympic lifting platforms with calibrated Eleiko bumper plates, Rogue monster power racks, and specialty bars.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    features: ["Calibrated Eleiko Plates", "6 Power Racks", "Chalk Allowed & Soundproof Mats"]
  },
  {
    id: "cardio-zone",
    title: "Cardio & Stamina Deck",
    description: "Woodway non-motorized curved treadmills, Concept2 rowers, SkiErgs, and Assault air bikes with real-time biometric displays.",
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=800&auto=format&fit=crop",
    features: ["Concept2 Rowers & SkiErgs", "Woodway Curve Treadmills", "Heart-Rate Zone Displays"]
  },
  {
    id: "functional-turf",
    title: "Functional Athletic Turf",
    description: "30-meter indoor sprint turf, heavy prowler sleds, kettlebell racks up to 48kg, plyo boxes, and climbing ropes.",
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop",
    features: ["30M Sprint Track", "Prowler Sleds & Battle Ropes", "Suspension Rigging"]
  },
  {
    id: "personal-studio",
    title: "Personal Training Studio",
    description: "Dedicated private coaching suites equipped for undisturbed 1-on-1 sessions, movement screens and biomechanical assessments.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop",
    features: ["Private Coaching Pods", "3D InBody 570 Bio-Scanner", "Video Motion Analysis"]
  },
  {
    id: "recovery-spa",
    title: "Thermal Spa & Locker Suites",
    description: "Individual eucalyptus steam rooms, infrared thermal saunas, rain showers, digital biometric lockers, and grooming lounges.",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    features: ["Infrared Finnish Sauna", "Rain Showers & Towel Service", "Keyless Smart Lockers"]
  },
  {
    id: "fuel-bar",
    title: "Fuel & Protein Lounge",
    description: "Handcrafted cold-pressed recovery shakes, organic whey isolate smoothies, cold brew coffee, and high-protein athletic snacks.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop",
    features: ["Custom Protein Smoothies", "Cold Brew Specialty Coffee", "Grab-and-Go Nutrition"]
  }
];

export const SCHEDULE_DATA = [
  // Monday
  { day: "Monday", time: "06:00 AM", name: "Strength & Power", category: "Strength", trainer: "Arjun Sharma", duration: "60 min", spots: 4, intensity: "High" },
  { day: "Monday", time: "07:30 AM", name: "MetCon HIIT Burn", category: "HIIT", trainer: "Maya Patel", duration: "45 min", spots: 2, intensity: "Very High" },
  { day: "Monday", time: "06:00 PM", name: "Functional Athletic Conditioning", category: "Functional", trainer: "Kabir Roy", duration: "50 min", spots: 5, intensity: "High" },
  { day: "Monday", time: "07:30 PM", name: "Boxing & Strike Circuit", category: "Boxing", trainer: "Arjun Sharma", duration: "50 min", spots: 3, intensity: "High" },
  
  // Tuesday
  { day: "Tuesday", time: "06:00 AM", name: "Hypertrophy Upper Body", category: "Strength", trainer: "Kabir Roy", duration: "60 min", spots: 6, intensity: "High" },
  { day: "Tuesday", time: "07:30 AM", name: "Mobility & Core Decompression", category: "Mobility", trainer: "Ananya Sen", duration: "45 min", spots: 8, intensity: "Moderate" },
  { day: "Tuesday", time: "06:00 PM", name: "CrossFit WOD", category: "CrossFit", trainer: "Maya Patel", duration: "60 min", spots: 1, intensity: "Very High" },
  { day: "Tuesday", time: "07:30 PM", name: "Kettlebell Power Flow", category: "Functional", trainer: "Kabir Roy", duration: "45 min", spots: 4, intensity: "High" },

  // Wednesday
  { day: "Wednesday", time: "06:00 AM", name: "Olympic Barbell Technique", category: "Strength", trainer: "Arjun Sharma", duration: "60 min", spots: 3, intensity: "High" },
  { day: "Wednesday", time: "07:30 AM", name: "MetCon Tabata", category: "HIIT", trainer: "Maya Patel", duration: "45 min", spots: 5, intensity: "Very High" },
  { day: "Wednesday", time: "06:00 PM", name: "Deadlift & Squat Lab", category: "Strength", trainer: "Arjun Sharma", duration: "60 min", spots: 2, intensity: "High" },
  { day: "Wednesday", time: "07:30 PM", name: "Boxing Conditioning", category: "Boxing", trainer: "Kabir Roy", duration: "50 min", spots: 4, intensity: "High" },

  // Thursday
  { day: "Thursday", time: "06:00 AM", name: "Functional Agility & Turf", category: "Functional", trainer: "Kabir Roy", duration: "50 min", spots: 7, intensity: "High" },
  { day: "Thursday", time: "07:30 AM", name: "Pilates & Core Power", category: "Mobility", trainer: "Ananya Sen", duration: "45 min", spots: 6, intensity: "Moderate" },
  { day: "Thursday", time: "06:00 PM", name: "Metabolic Shred", category: "HIIT", trainer: "Maya Patel", duration: "45 min", spots: 3, intensity: "Very High" },
  { day: "Thursday", time: "07:30 PM", name: "Hypertrophy Push/Pull", category: "Strength", trainer: "Kabir Roy", duration: "60 min", spots: 5, intensity: "High" },

  // Friday
  { day: "Friday", time: "06:00 AM", name: "Full Body Armor Lift", category: "Strength", trainer: "Arjun Sharma", duration: "60 min", spots: 4, intensity: "High" },
  { day: "Friday", time: "07:30 AM", name: "Friday Blitz HIIT", category: "HIIT", trainer: "Maya Patel", duration: "45 min", spots: 2, intensity: "Very High" },
  { day: "Friday", time: "06:00 PM", name: "Combat Fight Club", category: "Boxing", trainer: "Arjun Sharma", duration: "50 min", spots: 3, intensity: "High" },
  { day: "Friday", time: "07:30 PM", name: "Mobility & De-Stress Flow", category: "Mobility", trainer: "Ananya Sen", duration: "45 min", spots: 8, intensity: "Gentle" },

  // Saturday
  { day: "Saturday", time: "07:00 AM", name: "Super Saturday Team WOD", category: "CrossFit", trainer: "Maya & Arjun", duration: "75 min", spots: 5, intensity: "Elite" },
  { day: "Saturday", time: "09:00 AM", name: "Strength Clinic & Bench Press", category: "Strength", trainer: "Arjun Sharma", duration: "60 min", spots: 4, intensity: "High" },
  { day: "Saturday", time: "05:00 PM", name: "Sunset Functional Turf Challenge", category: "Functional", trainer: "Kabir Roy", duration: "60 min", spots: 6, intensity: "High" },

  // Sunday
  { day: "Sunday", time: "08:00 AM", name: "Deep Tissue Mobility & Stretch", category: "Mobility", trainer: "Ananya Sen", duration: "60 min", spots: 10, intensity: "Low" },
  { day: "Sunday", time: "09:30 AM", name: "Open Gym & Powerlifting Practice", category: "Strength", trainer: "Floor Coach", duration: "120 min", spots: 12, intensity: "Self-Paced" }
];

export const GALLERY_DATA = [
  { id: 1, title: "Olympic Lifting Bay", category: "Gym", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=900&auto=format&fit=crop" },
  { id: 2, title: "Deadlift Form Coaching", category: "Training", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop" },
  { id: 3, title: "Head Coach Arjun in Action", category: "Trainers", image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=900&auto=format&fit=crop" },
  { id: 4, title: "MetCon Team High Energy", category: "Members", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=900&auto=format&fit=crop" },
  { id: 5, title: "Annual KINETIX Lift Showdown", category: "Events", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop" },
  { id: 6, title: "Woodway Curved Treadmills", category: "Gym", image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=900&auto=format&fit=crop" },
  { id: 7, title: "Kettlebell Snatch Progression", category: "Training", image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=900&auto=format&fit=crop" },
  { id: 8, title: "Coach Maya Leading Saturday WOD", category: "Trainers", image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=900&auto=format&fit=crop" },
  { id: 9, title: "Community Victory Celebration", category: "Members", image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=900&auto=format&fit=crop" },
  { id: 10, title: "Biometric InBody Screening Suite", category: "Gym", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=900&auto=format&fit=crop" },
  { id: 11, title: "Thermal Finnish Sauna", category: "Gym", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=900&auto=format&fit=crop" },
  { id: 12, title: "Battle Rope Intervals", category: "Training", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=900&auto=format&fit=crop" }
];

export const FAQS_DATA = [
  {
    q: "How does the Free 1-Day VIP Trial work?",
    a: "Your free trial includes full unrestricted access to our gym floor, an optional 30-minute fitness and movement screening with one of our head trainers, and access to any scheduled group class on that day. Simply submit the form on this page or message us on WhatsApp to confirm your trial slot."
  },
  {
    q: "I am a complete beginner. Is KINETIX too intense for me?",
    a: "Not at all. More than 40% of our members started with zero barbell or gym experience. Every new member receives an initial movement assessment where we evaluate mobility and baseline strength, ensuring you are paired with the right training intensity and exercises."
  },
  {
    q: "Can I freeze or pause my membership if I travel?",
    a: "Yes. All Pro and Elite memberships come with complimentary membership freeze allowances (up to 30 days per year on quarterly plans, and up to 60 days on annual plans) at no extra charge."
  },
  {
    q: "Are personal trainers included with gym membership?",
    a: "Our gym floor is staffed with certified coaches at all times to check your form and ensure safety. Dedicated 1-on-1 personal coaching is included with the Elite membership tier or can be added to any plan in flexible packages."
  },
  {
    q: "What are your peak hours and is parking available?",
    a: "Peak training hours are typically 6:30 AM – 9:00 AM and 6:30 PM – 9:00 PM. Our 18,000 sq.ft footprint ensures minimal wait times even during rush hours. We provide dedicated basement valet parking for cars and two-wheelers with EV charging points."
  }
];

export const INITIAL_LEADS_DATA = [
  {
    id: "lead-1",
    name: "Vikram Malhotra",
    phone: "+91 98450 11223",
    email: "vikram.m@techcorp.io",
    goal: "Weight Loss",
    time: "Early Morning (5:30 AM – 8:00 AM)",
    message: "Looking to lose 10kg before year end. Want to check out the trial tomorrow morning.",
    status: "New",
    createdAt: "2026-10-14 08:30 AM"
  },
  {
    id: "lead-2",
    name: "Ayesha Khan",
    phone: "+91 97312 88492",
    email: "ayesha.k@gmail.com",
    goal: "Personal Training",
    time: "Evening (5:00 PM – 9:00 PM)",
    message: "Recovering from a knee sprain. Need 1-on-1 trainer guidance.",
    status: "Contacted",
    createdAt: "2026-10-14 11:15 AM"
  },
  {
    id: "lead-3",
    name: "Rohan Deshmukh",
    phone: "+91 99801 34567",
    email: "rohan.d@fintech.co",
    goal: "Strength",
    time: "Mid-Day (11:00 AM – 4:00 PM)",
    message: "Interested in the Elite Annual plan. Do you offer corporate discounts?",
    status: "Trial Booked",
    createdAt: "2026-10-13 04:45 PM"
  }
];
