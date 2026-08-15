import type { InjuryType } from "./users";

export type PreBriefingQuestion = {
  id: string;
  text: string;
  type: "scale" | "choice";
  options?: string[];
};

const commonQuestions: PreBriefingQuestion[] = [
  {
    id: "sleep",
    text: "How did you sleep last night?",
    type: "choice",
    options: ["Great — 7+ hours", "OK — some rest", "Poor — disrupted"],
  },
  {
    id: "energy",
    text: "Energy level right now?",
    type: "scale",
  },
  {
    id: "medication",
    text: "Did you take prescribed medication today?",
    type: "choice",
    options: ["Yes", "No", "Not prescribed"],
  },
  {
    id: "swelling",
    text: "Any swelling since yesterday?",
    type: "choice",
    options: ["None", "Slight", "Noticeable"],
  },
  {
    id: "yesterday",
    text: "Did you complete yesterday's exercises?",
    type: "choice",
    options: ["Yes, fully", "Partially", "No / rest day"],
  },
  {
    id: "confidence",
    text: "Confidence in doing today's session?",
    type: "scale",
  },
];

const injuryQuestions: Record<InjuryType, PreBriefingQuestion[]> = {
  knee: [
    {
      id: "knee-stiffness",
      text: "Morning knee stiffness today?",
      type: "choice",
      options: ["None", "Mild", "Moderate", "Severe"],
    },
    {
      id: "knee-stairs",
      text: "Pain on stairs or squatting?",
      type: "choice",
      options: ["No", "A little", "Yes, limits activity"],
    },
    {
      id: "knee-giving-way",
      text: "Any giving-way or buckling?",
      type: "choice",
      options: ["No", "Once", "More than once"],
    },
  ],
  ankle: [
    {
      id: "ankle-stiffness",
      text: "Ankle stiffness when you wake up?",
      type: "choice",
      options: ["None", "Mild", "Moderate", "Severe"],
    },
    {
      id: "ankle-walking",
      text: "Pain while walking today?",
      type: "choice",
      options: ["No", "Mild", "Moderate", "Severe"],
    },
    {
      id: "ankle-balance",
      text: "Balance on uneven ground?",
      type: "choice",
      options: ["Steady", "Slightly unsteady", "Very unsteady"],
    },
  ],
  elbow: [
    {
      id: "elbow-stiffness",
      text: "Elbow stiffness this morning?",
      type: "choice",
      options: ["None", "Mild", "Moderate", "Severe"],
    },
    {
      id: "elbow-grip",
      text: "Grip strength compared to yesterday?",
      type: "choice",
      options: ["Better", "Same", "Weaker"],
    },
    {
      id: "elbow-lifting",
      text: "Pain when lifting or reaching?",
      type: "choice",
      options: ["No", "Light loads only", "Most movements"],
    },
  ],
  wrist: [
    {
      id: "wrist-stiffness",
      text: "Wrist stiffness this morning?",
      type: "choice",
      options: ["None", "Mild", "Moderate", "Severe"],
    },
    {
      id: "wrist-typing",
      text: "Discomfort with typing or gripping?",
      type: "choice",
      options: ["No", "After a while", "Immediately"],
    },
    {
      id: "wrist-numbness",
      text: "Any numbness or tingling?",
      type: "choice",
      options: ["No", "Occasionally", "Often"],
    },
  ],
  other: [
    {
      id: "other-stiffness",
      text: "Stiffness in the affected area today?",
      type: "choice",
      options: ["None", "Mild", "Moderate", "Severe"],
    },
    {
      id: "other-movement",
      text: "Pain with everyday movement?",
      type: "choice",
      options: ["No", "A little", "Yes, limits activity"],
    },
    {
      id: "other-confidence",
      text: "Comfort moving the injured area?",
      type: "choice",
      options: ["Confident", "Somewhat", "Very cautious"],
    },
  ],
};

export function getPreBriefingQuestions(injury: InjuryType): PreBriefingQuestion[] {
  return [...commonQuestions, ...injuryQuestions[injury]];
}

export type CheckInAnswers = Record<string, string | number>;

export function summarizeCheckIn(answers: CheckInAnswers): string {
  const flags: string[] = [];
  if (answers.sleep === "Poor — disrupted") flags.push("poor sleep");
  if (Number(answers.energy) <= 2) flags.push("low energy");
  if (answers.swelling === "Noticeable") flags.push("swelling");
  if (answers.yesterday === "No / rest day") flags.push("missed yesterday");
  if (Number(answers.confidence) <= 2) flags.push("low confidence");
  return flags.length ? flags.join(", ") : "doing well";
}
