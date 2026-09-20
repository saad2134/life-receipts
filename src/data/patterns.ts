import { DetectedPattern } from '../types/receipt';

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
