import type { User } from "@/lib/users";

const faq: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["streak", "days in a row"],
    answer:
      "Your streak counts consecutive days you complete exercises or quests. Visit your Dashboard to see your current streak. Do at least one session each day to keep it going!",
  },
  {
    keywords: ["ankle", "sprain"],
    answer:
      "For ankle recovery, start with gentle ankle pumps and calf stretches. Avoid high-impact activity until pain decreases. If swelling persists, consult your physical therapist.",
  },
  {
    keywords: ["knee", "squat"],
    answer:
      "Knee exercises like heel slides and quad sets help restore range of motion. Mini squats can build strength once pain allows. Stop if you feel sharp pain.",
  },
  {
    keywords: ["back", "lower back", "spine"],
    answer:
      "Lower back care often includes pelvic tilts, cat-cow stretches, and core stability work like bird dogs. Avoid heavy lifting during acute pain.",
  },
  {
    keywords: ["wrist", "hand", "typing"],
    answer:
      "Wrist recovery benefits from gentle circles, flexor stretches, and grip strengthening. Take breaks from repetitive typing every 20–30 minutes.",
  },
  {
    keywords: ["elbow", "tennis"],
    answer:
      "Elbow rehab focuses on gradual loading and eccentric exercises. Use a brace during activity if recommended, and ice after sessions if swollen.",
  },
  {
    keywords: ["rom", "range of motion", "sensor", "heart", "bpm", "polar", "bluetooth"],
    answer:
      "Pair a Bluetooth heart-rate strap from Session or onboarding: tap Connect heart sensor in Chrome or Edge. Live BPM replaces the demo heart numbers. Polar H9/H10, Wahoo TICKR, Coospo, Magene, and similar straps work. Apple Watch and most Fitbits do not. Joint ROM is still a demo; use Photo Goniometer for a real knee angle.",
  },
  {
    keywords: ["goniometer", "photo", "angle", "hip", "mark"],
    answer:
      "Open Photo Goniometer from your Dashboard or Charts. Record a side-view video of the knee moving. The app tracks hip, knee, and ankle, graphs the angle, and can save the peak. A still photo with tap-to-mark still works. It is not a medical diagnosis.",
  },
  {
    keywords: ["pain", "hurt", "sore"],
    answer:
      "Mild soreness after exercises can be normal. Sharp or worsening pain is a sign to stop and rest. Rate your pain during assessments so we can adjust exercises.",
  },
  {
    keywords: ["how often", "frequency", "daily", "times per week"],
    answer:
      "Most rehab programs suggest exercises 3–5 days per week, or daily for gentle mobility work. Follow your recommended plan and keep your streak alive!",
  },
  {
    keywords: ["kids", "quest", "game"],
    answer:
      "Kids Quest Mode turns exercises into adventure games! Go to Kids Quest from the home page, pick a zone, and complete tap-based rep games to earn XP and badges.",
  },
  {
    keywords: ["doctor", "therapist", "provider"],
    answer:
      "Your doctor can monitor your progress on their dashboard when your accounts are linked. Doctors see patient streaks, sessions, and alerts on the caregiver dashboard.",
  },
  {
    keywords: ["shop", "brace", "device", "buy"],
    answer:
      "Visit the Shop from your home or dashboard to browse ankle, knee, lower back, and elbow braces designed for rehab with your Revive Motion sensor.",
  },
  {
    keywords: ["hello", "hi", "hey"],
    answer:
      "Hi! I'm the Revive Motion assistant. I can help with exercises, streaks, ROM tests, and recovery tips. What would you like to know?",
  },
  {
    keywords: ["help", "what can you"],
    answer:
      "I can answer questions about exercises, body areas (ankle, knee, back, wrist), ROM tests, streaks, kids quests, braces in the shop, and general recovery tips.",
  },
];

const fallback =
  "I'm not sure about that yet. Try asking about exercises, streaks, ROM tests, pain, or a body area like ankle or knee. For medical advice, please consult your physical therapist.";

export function getChatResponse(input: string): string {
  const message = input.toLowerCase().trim();
  if (!message) return "Type a question and I'll do my best to help!";

  for (const entry of faq) {
    if (entry.keywords.some((kw) => message.includes(kw))) {
      return entry.answer;
    }
  }

  return fallback;
}

export function getCoachResponse(input: string, user?: User | null): string {
  const message = input.toLowerCase().trim();
  if (!message) return "Tell me how you're feeling or what you'd like help with today.";

  const faqMatch = getChatResponse(input);
  if (faqMatch !== fallback) {
    if (user) {
      const first = user.name.split(" ")[0];
      return `${first}, ${faqMatch.charAt(0).toLowerCase()}${faqMatch.slice(1)}`;
    }
    return faqMatch;
  }

  if (user && (message.includes("report") || message.includes("recommendation") || message.includes("progress"))) {
    const sessions = user.exerciseHistory.length;
    const pain = user.painToday ?? 3;
    const romGap = user.targetRom - user.baselineRom;
    const first = user.name.split(" ")[0];

    if (pain >= 7) {
      return `${first}, your pain is elevated today (${pain}/10). Focus on gentle mobility only — skip strength work until pain drops below 5. Ice and rest between sessions.`;
    }
    if (sessions < 3) {
      return `${first}, you're building momentum with ${sessions} session${sessions !== 1 ? "s" : ""} so far. Stay consistent ${user.sessionDays} days per week in the ${user.sessionTime} — small daily wins add up toward your ${user.targetRom}° goal.`;
    }
    return `${first}, strong progress! You've logged ${sessions} sessions toward your ${user.injuryType} rehab. Baseline ${user.baselineRom}° → goal ${user.targetRom}° (${romGap}° to gain). Keep today's prescription and maintain your streak.`;
  }

  if (user && (message.includes("today") || message.includes("plan") || message.includes("exercise"))) {
    const rx = user.ptPrescription;
    const name = rx?.exerciseName ?? "your prescribed exercise";
    return `Today's focus: ${name}. Aim for ${rx?.sets ?? 3} sets × ${rx?.reps ?? 10} reps with ${rx?.holdSeconds ?? 12}s holds. Wear your sensor and stop if pain exceeds 6/10.`;
  }

  return fallback;
}
