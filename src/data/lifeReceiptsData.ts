// Generated Life Receipts Dataset
// Source: Synthesized from Daily Household Transactions.csv, spotify_history.csv, and IndiaTransactMultiFacet
import { LifeReceipt, StoryChapter, DetectedPattern, LifeStats, MoodType } from '../types/receipt';

export const INITIAL_CHAPTERS: StoryChapter[] = [
  {
    id: "ch-1",
    number: 1,
    title: "The Midnight Frequencies",
    tagline: "Late-night contemplation, quiet discoveries, and 2 AM playlists.",
    timeRange: "October 2018 — December 2018",
    narrative: "Between the hours of 1:00 AM and 3:30 AM, the city goes silent. Digital footprints show an intense concentration of melancholic indie pop, deep philosophical searches, midnight tea, and private diary entries questioning direction. These moments formed an unspoken sanctuary.",
    reflection: "Solitude was not loneliness; it was the quiet soil where clarity took root.",
    themeColor: "indigo",
    bgGradient: "from-indigo-950/80 via-slate-900 to-slate-950",
    accentColor: "#6366f1",
    receiptIds: ["rcpt-001", "rcpt-002", "rcpt-003", "rcpt-004", "rcpt-005", "rcpt-006", "rcpt-007"],
    stats: {
      receiptCount: 7,
      totalSpend: 199,
      topTrack: "Born To Die — Lana Del Rey",
      topPlace: "Home Desk / Bedroom",
      dominantMood: "melancholic"
    }
  },
  {
    id: "ch-2",
    number: 2,
    title: "The Monsoon Commute",
    tagline: "Suburban trains, rain on glass, cutting chai, and life in transit.",
    timeRange: "July 2018 — September 2018",
    narrative: "Commuting between Place 5 and Place 0 became a daily meditation. The tap of the train ticket counter, sudden torrential downpours, auto rides from station to permanent residence, and quick text messages checking if the trains were running on time. High-energy beats and snapshot photos turned transit into cinema.",
    reflection: "A receipt for a 30 INR train ticket holds the weight of thousands of miles of quiet ambition.",
    themeColor: "cyan",
    bgGradient: "from-cyan-950/80 via-slate-900 to-slate-950",
    accentColor: "#06b6d4",
    receiptIds: ["rcpt-010", "rcpt-011", "rcpt-012", "rcpt-013", "rcpt-014", "rcpt-015", "rcpt-016"],
    stats: {
      receiptCount: 7,
      totalSpend: 140,
      topTrack: "Drinking from the Bottle — Calvin Harris",
      topPlace: "Central Railway (Place 5 to Place 0)",
      dominantMood: "energetic"
    }
  },
  {
    id: "ch-3",
    number: 3,
    title: "The Family Anchor",
    tagline: "Ganesh Chaturthi celebrations, parental healthcare, festival feasts, and shared joy.",
    timeRange: "September 2018 — November 2018",
    narrative: "Life was firmly anchored by family duties and cherished rituals. From purchasing the Ganesh idol and modak sweets to picking up cataract medicine and sweet bread cakes for parents, the digital receipts reflect deep familial love.",
    reflection: "Receipts for medicines and sweets were small acts of service that mattered more than any luxury.",
    themeColor: "amber",
    bgGradient: "from-amber-950/80 via-slate-900 to-slate-950",
    accentColor: "#f59e0b",
    receiptIds: ["rcpt-020", "rcpt-021", "rcpt-022", "rcpt-023", "rcpt-024", "rcpt-025", "rcpt-026"],
    stats: {
      receiptCount: 7,
      totalSpend: 851,
      topTrack: "Aarti Sukhakarta — Traditional Bhajan",
      topPlace: "Permanent Residence, Dadar",
      dominantMood: "peaceful"
    }
  },
  {
    id: "ch-4",
    number: 4,
    title: "The Ambition Sprint",
    tagline: "Work-from-home setups, technical certifications, HBR subscriptions, and late-night builds.",
    timeRange: "August 2018 — October 2018",
    narrative: "A dramatic surge in self-investment and career pivot. Data booster recharges for remote work, Harvard Business Review subscriptions, Audible audiobooks during transit, and systematic investments into small-cap equity funds. Parallel searches on software architecture revealed an engineer pushing to reach the next tier.",
    reflection: "Spending shifted decisively from impulse to future equity—both financial and intellectual.",
    themeColor: "emerald",
    bgGradient: "from-emerald-950/80 via-slate-900 to-slate-950",
    accentColor: "#10b981",
    receiptIds: ["rcpt-030", "rcpt-031", "rcpt-032", "rcpt-033", "rcpt-034"],
    stats: {
      receiptCount: 5,
      totalSpend: 5301,
      topTrack: "Midnight City — M83",
      topPlace: "Developer Workstation",
      dominantMood: "contemplative"
    }
  },
  {
    id: "ch-5",
    number: 5,
    title: "The Quiet Renaissance",
    tagline: "Fresh artisanal bread, weekend coastal walks, acoustic resonance, and mindful living.",
    timeRange: "November 2018 — December 2018",
    narrative: "After months of relentless commuting and career sprints, a gentle equilibrium settled in. Weekend visits to organic bakeries, quiet strolls along the seaside promenade, acoustic folk playlists, and notes reflecting on personal growth signaled a new chapter of peace.",
    reflection: "Happiness finally stopped being a destination in the future and became a presence in everyday moments.",
    themeColor: "rose",
    bgGradient: "from-rose-950/80 via-slate-900 to-slate-950",
    accentColor: "#f43f5e",
    receiptIds: ["rcpt-040", "rcpt-041", "rcpt-042", "rcpt-043", "rcpt-044"],
    stats: {
      receiptCount: 5,
      totalSpend: 75,
      topTrack: "Say It, Just Say It — The Mowgli's",
      topPlace: "Carter Road Promenade",
      dominantMood: "peaceful"
    }
  }
];

export const INITIAL_PATTERNS: DetectedPattern[] = [
  {
    id: "pat-1",
    title: "2:00 AM Creative Reverie",
    category: "temporal",
    description: "Recurrent alignment of melancholic music streaming, incognito existential searches, and introspective journal notes clustered specifically between 02:00 AM and 03:00 AM.",
    significance: "Reveals that solitary late-night hours are the primary incubation phase for self-reflection and creative clarity.",
    confidenceScore: 98,
    connectedReceiptIds: ["rcpt-001", "rcpt-002", "rcpt-003", "rcpt-004", "rcpt-005"],
    metrics: [
      { label: "Peak Window", value: "02:14 AM – 02:45 AM" },
      { label: "Cross-Domain Synergy", value: "Music + Search + Notes + Photo" },
      { label: "Dominant Mood", value: "Melancholic (85%)" }
    ]
  },
  {
    id: "pat-2",
    title: "The Monsoon Commute Loop",
    category: "behavioral",
    description: "Repetitive sensory choreography: Train ticket purchase at Place 5 + snack at station + rain photo taken on window + upbeat electronic music streaming in coach.",
    significance: "Demonstrates how mundane public transit is converted into a cinematic ritual through music and visual snapshots.",
    confidenceScore: 96,
    connectedReceiptIds: ["rcpt-010", "rcpt-011", "rcpt-012", "rcpt-013", "rcpt-014"],
    metrics: [
      { label: "Route", value: "Place 5 ➔ Place 0" },
      { label: "Average Transit Spend", value: "₹30 – ₹90" },
      { label: "Sonic Companion", value: "High-BPM Electronic" }
    ]
  },
  {
    id: "pat-3",
    title: "Parental Care & Family Duty Pulse",
    category: "emotional",
    description: "Direct temporal link between pharmacy purchases (cataract eye drops), anxiety-driven medical precautions search, and reassuring family messages to siblings.",
    significance: "Uncovers the hidden emotional labor and deep family bonds driving everyday expenditure.",
    confidenceScore: 95,
    connectedReceiptIds: ["rcpt-024", "rcpt-025", "rcpt-026"],
    metrics: [
      { label: "Recipient", value: "Mother (Post-op Care)" },
      { label: "Communication Latency", value: "< 25 mins from purchase" },
      { label: "Emotional Transition", value: "Anxious ➔ Peaceful" }
    ]
  },
  {
    id: "pat-4",
    title: "The Career Upskilling Flywheel",
    category: "financial",
    description: "Synchronized pivot toward high-value growth: HBR subscriptions, Audible professional audiobooks, midnight data booster recharges, and disciplined equity investments.",
    significance: "Marks a transition from passive consumption to aggressive intellectual and financial self-capitalization.",
    confidenceScore: 94,
    connectedReceiptIds: ["rcpt-030", "rcpt-031", "rcpt-032", "rcpt-033", "rcpt-034"],
    metrics: [
      { label: "Knowledge Investment", value: "₹481/mo" },
      { label: "Asset Accumulation", value: "₹5,000 SIP / month" },
      { label: "Skill Focus", value: "Distributed Systems & Strategy" }
    ]
  },
  {
    id: "pat-5",
    title: "Sunday Coastal Sensory Reset",
    category: "behavioral",
    description: "Weekend pattern linking artisanal bakery purchases, seaside walks along Carter Road, morning nature photography, and acoustic indie tunes.",
    significance: "Acts as the psychological counterweight to intense weekday work sprints, grounding mental health through nature and slow living.",
    confidenceScore: 92,
    connectedReceiptIds: ["rcpt-040", "rcpt-041", "rcpt-042", "rcpt-043", "rcpt-044"],
    metrics: [
      { label: "Cadence", value: "Sunday Mornings (08:00 AM – 10:30 AM)" },
      { label: "Physical Activity", value: "5,400+ steps along coast" },
      { label: "Stress Reduction", value: "High (-65% cortisol markers)" }
    ]
  }
];

export const INITIAL_LIFE_RECEIPTS: LifeReceipt[] = [
  {
    "id": "rcpt-001",
    "category": "music",
    "timestamp": "2018-10-12T02:14:00Z",
    "displayDate": "12 Oct 2018, 02:14 AM",
    "title": "Born To Die",
    "subtitle": "Lana Del Rey \u2022 Born To Die (Paradise Edition)",
    "description": "Streamed for 285 seconds with repeat on. Night-mode audio session via Spotify web player.",
    "amount": 0,
    "currency": "INR",
    "location": {
      "name": "Home Desk / Bedroom",
      "city": "Mumbai",
      "lat": 19.0596,
      "long": 72.8295
    },
    "mood": "melancholic",
    "tags": [
      "2am-tunes",
      "nostalgia",
      "late-night",
      "solitude"
    ],
    "chapterId": "ch-1",
    "connectedReceiptIds": [
      "rcpt-002",
      "rcpt-003",
      "rcpt-004",
      "rcpt-005"
    ],
    "rawSource": "spotify",
    "metadata": {
      "artist": "Lana Del Rey",
      "album": "Born To Die - The Paradise Edition",
      "trackDurationMs": 285386,
      "platform": "Spotify Web Player",
      "reasonStart": "clickrow",
      "reasonEnd": "unknown"
    }
  },
  {
    "id": "rcpt-002",
    "category": "search",
    "timestamp": "2018-10-12T02:22:15Z",
    "displayDate": "12 Oct 2018, 02:22 AM",
    "title": "Search: 'why do memories feel more vivid at 2 AM'",
    "subtitle": "Google Search \u2022 Incognito Tab",
    "description": "Read 3 articles on circadian rhythms, nighttime memory recall, and dopamine regulation during late-night hours.",
    "location": {
      "name": "Home Desk",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "psychology",
      "curiosity",
      "2am-search",
      "solitude"
    ],
    "chapterId": "ch-1",
    "connectedReceiptIds": [
      "rcpt-001",
      "rcpt-003",
      "rcpt-004"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "searchQuery": "why do memories feel more vivid at 2 AM",
      "searchEngine": "Google Chrome",
      "articlesVisited": 3
    }
  },
  {
    "id": "rcpt-003",
    "category": "note",
    "timestamp": "2018-10-12T02:35:40Z",
    "displayDate": "12 Oct 2018, 02:35 AM",
    "title": "Note: 'The quiet hour'",
    "subtitle": "Keep Notes \u2022 Pinned",
    "description": "\u201cThe daytime is for what society demands. But 2 AM is the only hour where the world stops asking for things, and I can hear what I actually want.\u201d",
    "location": {
      "name": "Home Desk",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "journal",
      "introspection",
      "life-goals"
    ],
    "chapterId": "ch-1",
    "connectedReceiptIds": [
      "rcpt-001",
      "rcpt-002",
      "rcpt-004"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "noteType": "Personal Reflection",
      "charCount": 164
    }
  },
  {
    "id": "rcpt-004",
    "category": "photo",
    "timestamp": "2018-10-12T02:40:10Z",
    "displayDate": "12 Oct 2018, 02:40 AM",
    "title": "Desk Lamp & Amber Shadow",
    "subtitle": "Camera Roll \u2022 IMG_4092.JPG",
    "description": "A quiet shot of the desk lamp glowing warm yellow against the dark blue room with headphones resting beside a notebook.",
    "location": {
      "name": "Home Desk",
      "city": "Mumbai"
    },
    "mood": "peaceful",
    "tags": [
      "aesthetic",
      "photography",
      "night-owl",
      "still-life"
    ],
    "chapterId": "ch-1",
    "connectedReceiptIds": [
      "rcpt-001",
      "rcpt-002",
      "rcpt-003"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "cameraDevice": "OnePlus 6",
      "iso": 800,
      "shutterSpeed": "1/15s",
      "resolution": "4000x3000"
    }
  },
  {
    "id": "rcpt-005",
    "category": "music",
    "timestamp": "2018-10-12T02:44:30Z",
    "displayDate": "12 Oct 2018, 02:44 AM",
    "title": "Off To The Races",
    "subtitle": "Lana Del Rey \u2022 Born To Die",
    "description": "Queued right after Born To Die. 134 seconds streamed before drifting off.",
    "amount": 0,
    "currency": "INR",
    "location": {
      "name": "Home Desk",
      "city": "Mumbai"
    },
    "mood": "melancholic",
    "tags": [
      "2am-tunes",
      "indie-pop"
    ],
    "chapterId": "ch-1",
    "connectedReceiptIds": [
      "rcpt-001"
    ],
    "rawSource": "spotify",
    "metadata": {
      "artist": "Lana Del Rey",
      "album": "Born To Die - The Paradise Edition",
      "trackDurationMs": 134022,
      "platform": "Spotify Web Player"
    }
  },
  {
    "id": "rcpt-006",
    "category": "entertainment",
    "timestamp": "2018-10-19T23:30:00Z",
    "displayDate": "19 Oct 2018, 11:30 PM",
    "title": "Netflix Monthly Subscription",
    "subtitle": "Saving Bank Account 1 \u2022 Auto-Debit",
    "description": "1 month standard subscription renewed for midnight documentaries and late-night series marathons.",
    "amount": 199,
    "currency": "INR",
    "location": {
      "name": "Online Payment",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "subscription",
      "streaming",
      "entertainment"
    ],
    "chapterId": "ch-1",
    "connectedReceiptIds": [
      "rcpt-001",
      "rcpt-007"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "serviceProvider": "Netflix India",
      "paymentMode": "NetBanking",
      "plan": "Standard Mobile/Web"
    }
  },
  {
    "id": "rcpt-007",
    "category": "message",
    "timestamp": "2018-10-20T01:15:20Z",
    "displayDate": "20 Oct 2018, 01:15 AM",
    "title": "Message to Priya: 'Are you still awake?'",
    "subtitle": "WhatsApp \u2022 Starred",
    "description": "\u201cAre you still awake? Just finished watching that episode and listened to Lana Del Rey. The world is so loud by day and so peaceful right now.\u201d",
    "location": {
      "name": "Home Desk",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "friendship",
      "midnight-convo",
      "connection"
    ],
    "chapterId": "ch-1",
    "connectedReceiptIds": [
      "rcpt-006",
      "rcpt-001"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "messagePartner": "Priya (College Friend)",
      "app": "WhatsApp"
    }
  },
  {
    "id": "rcpt-010",
    "category": "purchase",
    "timestamp": "2018-09-20T12:04:08Z",
    "displayDate": "20 Sep 2018, 12:04 PM",
    "title": "Train: 2 Place 5 to Place 0",
    "subtitle": "Cash \u2022 Suburban Railway Counter",
    "description": "Two single-journey second class tickets on the central line during peak afternoon monsoon downpour.",
    "amount": 30,
    "currency": "INR",
    "location": {
      "name": "Place 5 Station",
      "city": "Mumbai",
      "lat": 19.1136,
      "long": 72.8697
    },
    "mood": "energetic",
    "tags": [
      "commute",
      "train",
      "monsoon",
      "travel"
    ],
    "chapterId": "ch-2",
    "connectedReceiptIds": [
      "rcpt-011",
      "rcpt-012",
      "rcpt-013",
      "rcpt-014"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "paymentMode": "Cash",
      "category": "Transportation",
      "subcategory": "Train",
      "note": "2 Place 5 to Place 0"
    }
  },
  {
    "id": "rcpt-011",
    "category": "purchase",
    "timestamp": "2018-09-20T12:03:15Z",
    "displayDate": "20 Sep 2018, 12:03 PM",
    "title": "Idli Medu Vada Mix (2 Plates)",
    "subtitle": "Cash \u2022 Station Canteen Snack",
    "description": "Two steaming plates of idli vada sambar with spicy coconut chutney before catching the fast train.",
    "amount": 60,
    "currency": "INR",
    "location": {
      "name": "Station Udupi Stall, Place 5",
      "city": "Mumbai"
    },
    "mood": "peaceful",
    "tags": [
      "food",
      "street-food",
      "breakfast",
      "commute"
    ],
    "chapterId": "ch-2",
    "connectedReceiptIds": [
      "rcpt-010",
      "rcpt-012"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "paymentMode": "Cash",
      "category": "Food",
      "subcategory": "snacks",
      "note": "Idli medu Vada mix 2 plates"
    }
  },
  {
    "id": "rcpt-012",
    "category": "photo",
    "timestamp": "2018-09-20T12:18:45Z",
    "displayDate": "20 Sep 2018, 12:18 PM",
    "title": "Monsoon Rain on Train Window",
    "subtitle": "Camera Roll \u2022 IMG_3881.JPG",
    "description": "Drops of rain streaking horizontally against the yellow-barred train window as the fast train crosses the creek.",
    "location": {
      "name": "Central Railway Line, Near Creek",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "monsoon",
      "photography",
      "mumbai-trains",
      "rain"
    ],
    "chapterId": "ch-2",
    "connectedReceiptIds": [
      "rcpt-010",
      "rcpt-011",
      "rcpt-013",
      "rcpt-014"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "cameraDevice": "OnePlus 6",
      "shutterSpeed": "1/500s",
      "resolution": "4000x3000"
    }
  },
  {
    "id": "rcpt-013",
    "category": "message",
    "timestamp": "2018-09-20T12:25:00Z",
    "displayDate": "20 Sep 2018, 12:25 PM",
    "title": "Message from Rohan: 'Boarded the 12:10 fast?'",
    "subtitle": "SMS / WhatsApp",
    "description": "\u201cBoarded the fast train? Rain is crazy outside Dadar. Save me a standing spot near the luggage rack.\u201d",
    "location": {
      "name": "In Transit, Railway Coach",
      "city": "Mumbai"
    },
    "mood": "energetic",
    "tags": [
      "commute",
      "friends",
      "transit-chat"
    ],
    "chapterId": "ch-2",
    "connectedReceiptIds": [
      "rcpt-010",
      "rcpt-012"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "messagePartner": "Rohan (Co-worker)",
      "app": "WhatsApp"
    }
  },
  {
    "id": "rcpt-014",
    "category": "music",
    "timestamp": "2018-09-20T12:30:10Z",
    "displayDate": "20 Sep 2018, 12:30 PM",
    "title": "Drinking from the Bottle",
    "subtitle": "Calvin Harris ft. Tinie Tempah \u2022 18 Months",
    "description": "Headphones turned all the way up to drown out the roar of train tracks and torrential downpour.",
    "amount": 0,
    "currency": "INR",
    "location": {
      "name": "Suburban Railway Coach",
      "city": "Mumbai"
    },
    "mood": "energetic",
    "tags": [
      "commute-beats",
      "edm",
      "high-energy"
    ],
    "chapterId": "ch-2",
    "connectedReceiptIds": [
      "rcpt-010",
      "rcpt-012"
    ],
    "rawSource": "spotify",
    "metadata": {
      "artist": "Calvin Harris",
      "album": "18 Months",
      "trackDurationMs": 240000,
      "platform": "Android App"
    }
  },
  {
    "id": "rcpt-015",
    "category": "purchase",
    "timestamp": "2018-09-14T05:39:17Z",
    "displayDate": "14 Sep 2018, 05:39 AM",
    "title": "Auto: Place 2 Station to Permanent Residence",
    "subtitle": "Cash \u2022 Early Morning Auto Ride",
    "description": "Metered auto rickshaw ride in dawn drizzle from the railway terminus back home.",
    "amount": 50,
    "currency": "INR",
    "location": {
      "name": "Place 2 Station Stand",
      "city": "Mumbai",
      "lat": 19.0178,
      "long": 72.8478
    },
    "mood": "peaceful",
    "tags": [
      "auto",
      "early-morning",
      "arrival",
      "home"
    ],
    "chapterId": "ch-2",
    "connectedReceiptIds": [
      "rcpt-010",
      "rcpt-016"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "paymentMode": "Cash",
      "category": "Transportation",
      "subcategory": "auto",
      "note": "Place 2 station to Permanent Residence"
    }
  },
  {
    "id": "rcpt-016",
    "category": "place",
    "timestamp": "2018-09-14T05:55:00Z",
    "displayDate": "14 Sep 2018, 05:55 AM",
    "title": "Permanent Residence, Dadar",
    "subtitle": "Geo-fenced Arrival \u2022 Home Base",
    "description": "Arrival home before the rest of the building awakens. Aroma of freshly brewed ginger tea from the kitchen.",
    "location": {
      "name": "Permanent Residence",
      "city": "Mumbai",
      "state": "Maharashtra",
      "lat": 19.0178,
      "long": 72.8478
    },
    "mood": "peaceful",
    "tags": [
      "home",
      "sanctuary",
      "family"
    ],
    "chapterId": "ch-2",
    "connectedReceiptIds": [
      "rcpt-015",
      "rcpt-020"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "arrivalType": "Auto commute destination"
    }
  },
  {
    "id": "rcpt-020",
    "category": "purchase",
    "timestamp": "2018-09-16T17:15:08Z",
    "displayDate": "16 Sep 2018, 05:15 PM",
    "title": "Ganesh Idol & Pooja Samagri",
    "subtitle": "Cash \u2022 Lalbaug Festival Market",
    "description": "Clay Ganpati idol purchased with family for Ganesh Chaturthi installation, accompanied by flowers and modak.",
    "amount": 251,
    "currency": "INR",
    "location": {
      "name": "Lalbaug Festival Market",
      "city": "Mumbai"
    },
    "mood": "euphoric",
    "tags": [
      "festival",
      "ganesh-chaturthi",
      "tradition",
      "family"
    ],
    "chapterId": "ch-3",
    "connectedReceiptIds": [
      "rcpt-021",
      "rcpt-022",
      "rcpt-023",
      "rcpt-024"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "paymentMode": "Cash",
      "category": "Festivals",
      "subcategory": "Ganesh Pujan",
      "note": "Ganesh idol"
    }
  },
  {
    "id": "rcpt-021",
    "category": "event",
    "timestamp": "2018-09-16T19:00:00Z",
    "displayDate": "16 Sep 2018, 07:00 PM",
    "title": "Ganesh Chaturthi Sthapana & Aarti",
    "subtitle": "Family Ritual \u2022 Living Room",
    "description": "Welcoming the idol home with evening dhol-tasha rhythms, family singing aarti together, and distributing warm ukadiche modak.",
    "location": {
      "name": "Living Room, Permanent Residence",
      "city": "Mumbai"
    },
    "mood": "euphoric",
    "tags": [
      "celebration",
      "family-gathering",
      "blessings"
    ],
    "chapterId": "ch-3",
    "connectedReceiptIds": [
      "rcpt-020",
      "rcpt-022",
      "rcpt-023"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "attendeesCount": 8,
      "eventVenue": "Family Home"
    }
  },
  {
    "id": "rcpt-022",
    "category": "photo",
    "timestamp": "2018-09-16T19:42:15Z",
    "displayDate": "16 Sep 2018, 07:42 PM",
    "title": "Mom Holding the Aarti Lamp",
    "subtitle": "Camera Roll \u2022 Portrait Mode \u2022 IMG_3910.JPG",
    "description": "The brass diya reflecting golden highlights on Mom's face as the whole family sings the closing stanzas of Sukhakarta Dukhaharta.",
    "location": {
      "name": "Pooja Corner",
      "city": "Mumbai"
    },
    "mood": "peaceful",
    "tags": [
      "mom",
      "family-love",
      "portrait",
      "sacred"
    ],
    "chapterId": "ch-3",
    "connectedReceiptIds": [
      "rcpt-020",
      "rcpt-021",
      "rcpt-023"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "cameraDevice": "OnePlus 6",
      "aperture": "f/1.7",
      "resolution": "4000x3000"
    }
  },
  {
    "id": "rcpt-023",
    "category": "purchase",
    "timestamp": "2018-09-16T20:30:00Z",
    "displayDate": "16 Sep 2018, 08:30 PM",
    "title": "Sweet Bread Cake & Veg Puffs",
    "subtitle": "Cash \u2022 Local Bakery Celebration Snack",
    "description": "Freshly baked warm sweet cake and 2 crispy vegetable puffs brought home for cousins visiting after evening aarti.",
    "amount": 120,
    "currency": "INR",
    "location": {
      "name": "City Bakery, Dadar",
      "city": "Mumbai"
    },
    "mood": "euphoric",
    "tags": [
      "bakery",
      "sweets",
      "cousins",
      "hospitality"
    ],
    "chapterId": "ch-3",
    "connectedReceiptIds": [
      "rcpt-020",
      "rcpt-021",
      "rcpt-022"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "category": "Food",
      "subcategory": "snacks",
      "note": "Sweet bread cake 90 + veg puff 2"
    }
  },
  {
    "id": "rcpt-024",
    "category": "purchase",
    "timestamp": "2018-09-18T14:10:00Z",
    "displayDate": "18 Sep 2018, 02:10 PM",
    "title": "Cataract Eye Drops & Prescription Medicine",
    "subtitle": "Cash \u2022 MedPlus Pharmacy",
    "description": "Prescription post-operative care drops and antibiotic ointment for mother's eye treatment.",
    "amount": 480,
    "currency": "INR",
    "location": {
      "name": "MedPlus Pharmacy",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "healthcare",
      "mom",
      "duty",
      "family"
    ],
    "chapterId": "ch-3",
    "connectedReceiptIds": [
      "rcpt-025",
      "rcpt-026"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "category": "Health",
      "subcategory": "Medicine",
      "note": "Cataract Medicine"
    }
  },
  {
    "id": "rcpt-025",
    "category": "search",
    "timestamp": "2018-09-18T14:35:00Z",
    "displayDate": "18 Sep 2018, 02:35 PM",
    "title": "Search: 'cataract post-op eye drops timing precautions'",
    "subtitle": "Google Search \u2022 Mobile Browser",
    "description": "Looking up reminders on spacing out steroid drops and preventing eye strain during screen time.",
    "location": {
      "name": "Pharmacy Waiting Area",
      "city": "Mumbai"
    },
    "mood": "anxious",
    "tags": [
      "healthcare",
      "family-care",
      "research"
    ],
    "chapterId": "ch-3",
    "connectedReceiptIds": [
      "rcpt-024",
      "rcpt-026"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "searchQuery": "cataract post-op eye drops timing precautions",
      "searchEngine": "Google"
    }
  },
  {
    "id": "rcpt-026",
    "category": "message",
    "timestamp": "2018-09-18T15:02:10Z",
    "displayDate": "18 Sep 2018, 03:02 PM",
    "title": "Message to Sister: 'Got the drops, mom is resting'",
    "subtitle": "WhatsApp \u2022 Family Group",
    "description": "\u201cGot both the lubricating and steroid drops from the pharmacy. Mom is resting peacefully in the bedroom now. Doctor said vision will clear up within a week.\u201d",
    "location": {
      "name": "Permanent Residence",
      "city": "Mumbai"
    },
    "mood": "peaceful",
    "tags": [
      "sister",
      "mom",
      "family-care"
    ],
    "chapterId": "ch-3",
    "connectedReceiptIds": [
      "rcpt-024",
      "rcpt-025"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "messagePartner": "Sister (Neha)",
      "app": "WhatsApp"
    }
  },
  {
    "id": "rcpt-030",
    "category": "purchase",
    "timestamp": "2018-09-13T21:01:47Z",
    "displayDate": "13 Sep 2018, 09:01 PM",
    "title": "Harvard Business Review (2 Months)",
    "subtitle": "Credit Card \u2022 Global Knowledge Subscription",
    "description": "Digital access subscription to study case studies on tech scalability, organizational strategy, and modern software leadership.",
    "amount": 83,
    "currency": "INR",
    "location": {
      "name": "Digital Checkout",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "learning",
      "career",
      "hbr",
      "ambition"
    ],
    "chapterId": "ch-4",
    "connectedReceiptIds": [
      "rcpt-031",
      "rcpt-032",
      "rcpt-033",
      "rcpt-034"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "category": "subscription",
      "note": "HBR 2 Months subscription",
      "paymentMode": "Credit Card"
    }
  },
  {
    "id": "rcpt-031",
    "category": "entertainment",
    "timestamp": "2018-09-14T20:15:00Z",
    "displayDate": "14 Sep 2018, 08:15 PM",
    "title": "Audible Monthly Membership",
    "subtitle": "Credit Card \u2022 Amazon Audible India",
    "description": "Audiobook subscription for listening to 'Designing Data-Intensive Applications' and management books during the daily commute.",
    "amount": 199,
    "currency": "INR",
    "location": {
      "name": "Digital Subscription",
      "city": "Mumbai"
    },
    "mood": "energetic",
    "tags": [
      "audiobook",
      "upskilling",
      "audio-learning"
    ],
    "chapterId": "ch-4",
    "connectedReceiptIds": [
      "rcpt-030",
      "rcpt-032"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "category": "subscription",
      "note": "audible subscription",
      "serviceProvider": "Audible Amazon"
    }
  },
  {
    "id": "rcpt-032",
    "category": "purchase",
    "timestamp": "2018-09-17T23:41:17Z",
    "displayDate": "17 Sep 2018, 11:41 PM",
    "title": "Data Booster Pack (WFH Midnight Sprint)",
    "subtitle": "Saving Bank Account \u2022 Telecom Top-up",
    "description": "High-speed 4G data add-on purchased late at night to finish pushing a large Git repository deployment and cloud cluster configuration.",
    "amount": 19,
    "currency": "INR",
    "location": {
      "name": "Telecom App",
      "city": "Mumbai"
    },
    "mood": "energetic",
    "tags": [
      "wfh",
      "coding",
      "data-pack",
      "late-night-build"
    ],
    "chapterId": "ch-4",
    "connectedReceiptIds": [
      "rcpt-030",
      "rcpt-033"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "category": "subscription",
      "subcategory": "Mobile Service Provider",
      "note": "Data booster pack"
    }
  },
  {
    "id": "rcpt-033",
    "category": "search",
    "timestamp": "2018-09-17T23:55:00Z",
    "displayDate": "17 Sep 2018, 11:55 PM",
    "title": "Search: 'distributed cache invalidation race conditions'",
    "subtitle": "Google Search \u2022 Developer Tab",
    "description": "Deep-diving into Redis clustering, read-through caching patterns, and high-concurrency memory safety.",
    "location": {
      "name": "Developer Workstation",
      "city": "Mumbai"
    },
    "mood": "contemplative",
    "tags": [
      "engineering",
      "architecture",
      "coding",
      "learning"
    ],
    "chapterId": "ch-4",
    "connectedReceiptIds": [
      "rcpt-030",
      "rcpt-032",
      "rcpt-034"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "searchQuery": "distributed cache invalidation race conditions",
      "searchEngine": "Google"
    }
  },
  {
    "id": "rcpt-034",
    "category": "purchase",
    "timestamp": "2018-09-13T10:00:00Z",
    "displayDate": "13 Sep 2018, 10:00 AM",
    "title": "Small Cap Mutual Fund SIP",
    "subtitle": "Saving Bank Account \u2022 Auto Transfer-Out",
    "description": "Monthly disciplined wealth-building investment into Nippon/SBI Small Cap growth equity fund.",
    "amount": 5000,
    "currency": "INR",
    "location": {
      "name": "Mutual Fund Portal",
      "city": "Mumbai"
    },
    "mood": "peaceful",
    "tags": [
      "investment",
      "future",
      "savings",
      "discipline"
    ],
    "chapterId": "ch-4",
    "connectedReceiptIds": [
      "rcpt-030"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "category": "Investment",
      "subcategory": "Mutual fund",
      "note": "Small Cap fund 1"
    }
  },
  {
    "id": "rcpt-040",
    "category": "purchase",
    "timestamp": "2018-11-04T08:15:00Z",
    "displayDate": "04 Nov 2018, 08:15 AM",
    "title": "Artisanal Brown Bread & Fresh Milk",
    "subtitle": "Cash \u2022 Local Organic Grocer",
    "description": "Fresh whole wheat loaf and farm milk for a slow Sunday breakfast before a walk along the shore.",
    "amount": 75,
    "currency": "INR",
    "location": {
      "name": "Hill Road Grocer, Bandra",
      "city": "Mumbai"
    },
    "mood": "peaceful",
    "tags": [
      "morning",
      "breakfast",
      "mindfulness",
      "health"
    ],
    "chapterId": "ch-5",
    "connectedReceiptIds": [
      "rcpt-041",
      "rcpt-042",
      "rcpt-043"
    ],
    "rawSource": "household_trans",
    "metadata": {
      "category": "Food",
      "subcategory": "Grocery",
      "note": "brown bread + milk"
    }
  },
  {
    "id": "rcpt-041",
    "category": "place",
    "timestamp": "2018-11-04T08:45:00Z",
    "displayDate": "04 Nov 2018, 08:45 AM",
    "title": "Carter Road Promenade",
    "subtitle": "Seaside Stroll \u2022 Morning Sun",
    "description": "Gentle ocean breeze, dogs playing on the rocks, and the sun warming the Arabian Sea. Zero rush.",
    "location": {
      "name": "Carter Road Promenade",
      "city": "Mumbai",
      "lat": 19.0667,
      "long": 72.8258
    },
    "mood": "peaceful",
    "tags": [
      "sea",
      "walk",
      "peace",
      "nature"
    ],
    "chapterId": "ch-5",
    "connectedReceiptIds": [
      "rcpt-040",
      "rcpt-042",
      "rcpt-043"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "stepsCount": 5420,
      "weather": "Sunny, 26\u00b0C"
    }
  },
  {
    "id": "rcpt-042",
    "category": "photo",
    "timestamp": "2018-11-04T09:05:12Z",
    "displayDate": "04 Nov 2018, 09:05 AM",
    "title": "Sunlight Glittering on Coastal Waves",
    "subtitle": "Camera Roll \u2022 IMG_4210.JPG",
    "description": "A sparkling reflection of morning light against the calm sea, framed by silhouettes of coconut palms.",
    "location": {
      "name": "Bandra Coastline",
      "city": "Mumbai"
    },
    "mood": "euphoric",
    "tags": [
      "ocean",
      "photography",
      "serenity"
    ],
    "chapterId": "ch-5",
    "connectedReceiptIds": [
      "rcpt-040",
      "rcpt-041",
      "rcpt-043"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "cameraDevice": "OnePlus 6",
      "resolution": "4000x3000"
    }
  },
  {
    "id": "rcpt-043",
    "category": "music",
    "timestamp": "2018-11-04T09:12:00Z",
    "displayDate": "04 Nov 2018, 09:12 AM",
    "title": "Say It, Just Say It",
    "subtitle": "The Mowgli's \u2022 Waiting For The Dawn",
    "description": "Upbeat folk-pop track playing through earbuds while walking past the coastal amphitheatre.",
    "amount": 0,
    "currency": "INR",
    "location": {
      "name": "Carter Road",
      "city": "Mumbai"
    },
    "mood": "euphoric",
    "tags": [
      "morning-playlist",
      "indie-folk",
      "feel-good"
    ],
    "chapterId": "ch-5",
    "connectedReceiptIds": [
      "rcpt-040",
      "rcpt-041",
      "rcpt-042"
    ],
    "rawSource": "spotify",
    "metadata": {
      "artist": "The Mowgli's",
      "album": "Waiting For The Dawn",
      "trackDurationMs": 195000,
      "platform": "Spotify Android"
    }
  },
  {
    "id": "rcpt-044",
    "category": "note",
    "timestamp": "2018-11-04T10:30:00Z",
    "displayDate": "04 Nov 2018, 10:30 AM",
    "title": "Note: 'The Art of Not Hurrying'",
    "subtitle": "Journal \u2022 Sunday Entry",
    "description": "\u201cSpent two hours doing absolutely nothing of commercial value this morning\u2014just bread, sea breeze, and sunshine. And I feel richer than after any paycheck.\u201d",
    "location": {
      "name": "Promenade Bench",
      "city": "Mumbai"
    },
    "mood": "peaceful",
    "tags": [
      "journal",
      "philosophy",
      "gratitude",
      "peace"
    ],
    "chapterId": "ch-5",
    "connectedReceiptIds": [
      "rcpt-041",
      "rcpt-042"
    ],
    "rawSource": "synthetic",
    "metadata": {
      "noteType": "Sunday Journal",
      "charCount": 178
    }
  }
];

export function calculateLifeStats(receipts: LifeReceipt[]): LifeStats {
  const categoryCounts = {
    music: 0,
    entertainment: 0,
    place: 0,
    purchase: 0,
    photo: 0,
    message: 0,
    search: 0,
    event: 0,
    note: 0,
  };

  let totalSpend = 0;
  const hourFrequency: Record<number, number> = {};
  const moodFrequency: Record<string, number> = {};
  const uniquePlaces = new Set<string>();

  receipts.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    if (r.amount) totalSpend += r.amount;

    // Mood tracking
    moodFrequency[r.mood] = (moodFrequency[r.mood] || 0) + 1;

    // Place tracking
    if (r.location?.name) {
      uniquePlaces.add(r.location.name);
    }

    // Hour tracking
    try {
      const d = new Date(r.timestamp);
      const hr = d.getHours();
      hourFrequency[hr] = (hourFrequency[hr] || 0) + 1;
    } catch {}
  });

  // Find most active hour
  let maxHr = 2;
  let maxHrCount = 0;
  Object.entries(hourFrequency).forEach(([hrStr, count]) => {
    if (count > maxHrCount) {
      maxHrCount = count;
      maxHr = parseInt(hrStr, 10);
    }
  });

  const formattedHr = `${maxHr.toString().padStart(2, '0')}:00`;

  // Find dominant mood
  let domMood: MoodType = 'contemplative';
  let maxMoodCount = 0;
  Object.entries(moodFrequency).forEach(([mood, count]) => {
    if (count > maxMoodCount) {
      maxMoodCount = count;
      domMood = mood as MoodType;
    }
  });

  return {
    totalReceipts: receipts.length,
    categoryCounts,
    totalSpend,
    currency: "INR",
    mostActiveHour: formattedHr,
    dominantMood: domMood,
    connectedThreadsCount: INITIAL_PATTERNS.length,
    placesTraversed: uniquePlaces.size,
    soundtrackTracksCount: categoryCounts.music,
  };
}
