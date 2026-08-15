export type ExerciseMedia = {
  image: string;
  kidsImage?: string;
  kidsQuest: {
    title: string;
    story: string;
    gamePrompt: string;
    reps: number;
    reward: string;
  };
};

const defaultMedia = (name: string): ExerciseMedia => ({
  image: "/exercises/mobility.svg",
  kidsImage: "/kids/exercises/quest-default.svg",
  kidsQuest: {
    title: `${name} Quest`,
    story: "Complete the movement to power up your hero!",
    gamePrompt: "Wear your sensor — reps count when you hit the right angle",
    reps: 10,
    reward: "⭐ Star badge",
  },
});

export const exerciseMedia: Record<string, ExerciseMedia> = {
  "ankle-pumps": {
    image: "/exercises/ankle.svg",
    kidsImage: "/kids/zones/ankle.svg",
    kidsQuest: {
      title: "Rocket Ankle Boost",
      story: "Pump your ankle to fuel the rocket ship!",
      gamePrompt: "Tap each time you point and flex your foot",
      reps: 15,
      reward: "🚀 Rocket badge",
    },
  },
  "calf-stretch": {
    image: "/exercises/stretch.svg",
    kidsQuest: {
      title: "Stretchy Giraffe",
      story: "Stretch tall like a giraffe reaching for leaves!",
      gamePrompt: "Hold stretch, then tap when done",
      reps: 6,
      reward: "🦒 Tall badge",
    },
  },
  "resistance-eversion": {
    image: "/exercises/strength.svg",
    kidsQuest: {
      title: "Shield Foot Defender",
      story: "Push against the band to protect the castle!",
      gamePrompt: "Tap for each strong push outward",
      reps: 12,
      reward: "🛡️ Shield badge",
    },
  },
  "heel-raises": {
    image: "/exercises/strength.svg",
    kidsQuest: {
      title: "Tiptoe Tower Climb",
      story: "Rise on your toes to climb the magic tower!",
      gamePrompt: "Tap each time you lift your heels",
      reps: 10,
      reward: "🏰 Tower badge",
    },
  },
  "heel-slides": {
    image: "/exercises/knee.svg",
    kidsImage: "/kids/zones/knee.svg",
    kidsQuest: {
      title: "Penguin Slide",
      story: "Slide your heel like a penguin on ice!",
      gamePrompt: "Tap when you slide heel toward hip",
      reps: 12,
      reward: "🐧 Ice badge",
    },
  },
  "quad-sets": {
    image: "/exercises/knee.svg",
    kidsQuest: {
      title: "Muscle Lightning",
      story: "Squeeze your quad to charge lightning power!",
      gamePrompt: "Tap and hold, then release each rep",
      reps: 10,
      reward: "⚡ Power badge",
    },
  },
  "mini-squats": {
    image: "/exercises/strength.svg",
    kidsQuest: {
      title: "Frog Hop Squat",
      story: "Squat down like a frog ready to hop!",
      gamePrompt: "Tap for each mini squat",
      reps: 8,
      reward: "🐸 Hop badge",
    },
  },
  "straight-leg-raise": {
    image: "/exercises/strength.svg",
    kidsQuest: {
      title: "Leg Lift Launch",
      story: "Lift your leg to launch the balloon!",
      gamePrompt: "Tap when leg is raised",
      reps: 10,
      reward: "🎈 Balloon badge",
    },
  },
  "pelvic-tilt": {
    image: "/exercises/core.svg",
    kidsQuest: {
      title: "Bridge Builder",
      story: "Tilt your pelvis to build a strong bridge!",
      gamePrompt: "Tap for each pelvic tilt",
      reps: 10,
      reward: "🌉 Bridge badge",
    },
  },
  "cat-cow": {
    image: "/exercises/core.svg",
    kidsImage: "/kids/zones/back.svg",
    kidsQuest: {
      title: "Cat & Cow Adventure",
      story: "Arch like a cat, then moo like a cow!",
      gamePrompt: "Tap for each cat-cow cycle",
      reps: 8,
      reward: "🐱 Farm badge",
    },
  },
  "bird-dog": {
    image: "/exercises/core.svg",
    kidsQuest: {
      title: "Balance Bird Dog",
      story: "Balance like a bird on one leg, reach like a dog!",
      gamePrompt: "Tap when arm and leg are extended",
      reps: 8,
      reward: "🐦 Balance badge",
    },
  },
  "side-bend-stretch": {
    image: "/exercises/stretch.svg",
    kidsQuest: {
      title: "Rainbow Bend",
      story: "Bend side to side to paint a rainbow!",
      gamePrompt: "Tap after each side bend",
      reps: 6,
      reward: "🌈 Rainbow badge",
    },
  },
  "wrist-circles": {
    image: "/exercises/wrist.svg",
    kidsImage: "/kids/zones/wrist.svg",
    kidsQuest: {
      title: "Wrist Wizard Wheel",
      story: "Spin your wrist to cast magic circles!",
      gamePrompt: "Tap for each wrist circle",
      reps: 10,
      reward: "🪄 Magic badge",
    },
  },
  "prayer-stretch": {
    image: "/exercises/wrist.svg",
    kidsQuest: {
      title: "Prayer Power Push",
      story: "Press palms together to unlock the temple door!",
      gamePrompt: "Tap when stretch is held",
      reps: 6,
      reward: "🕌 Temple badge",
    },
  },
  "flexor-stretch": {
    image: "/exercises/wrist.svg",
    kidsQuest: {
      title: "Flexor Flower",
      story: "Stretch your wrist to help the flower bloom!",
      gamePrompt: "Tap after each stretch hold",
      reps: 6,
      reward: "🌸 Flower badge",
    },
  },
  "putty-squeeze": {
    image: "/exercises/grip.svg",
    kidsQuest: {
      title: "Super Squeeze",
      story: "Squeeze the putty to crush the slime monster!",
      gamePrompt: "Tap for each squeeze",
      reps: 12,
      reward: "👾 Hero badge",
    },
  },
  "shoulder-rolls": {
    image: "/exercises/mobility.svg",
    kidsQuest: {
      title: "Shoulder Windmill",
      story: "Roll shoulders to spin the windmill!",
      gamePrompt: "Tap for each shoulder roll",
      reps: 10,
      reward: "💨 Wind badge",
    },
  },
  "hip-flexor-stretch": {
    image: "/exercises/stretch.svg",
    kidsQuest: {
      title: "Hip Hero Lunge",
      story: "Stretch your hip to cross the lava river!",
      gamePrompt: "Tap when stretch is complete",
      reps: 6,
      reward: "🔥 Lava badge",
    },
  },
  "neck-rotation": {
    image: "/exercises/mobility.svg",
    kidsQuest: {
      title: "Owl Lookout",
      story: "Turn your head like an owl spotting treasure!",
      gamePrompt: "Tap for each head turn",
      reps: 8,
      reward: "🦉 Owl badge",
    },
  },
  "bodyweight-squat": {
    image: "/exercises/strength.svg",
    kidsQuest: {
      title: "Chair Quest Squat",
      story: "Squat with chair support to lift the treasure chest!",
      gamePrompt: "Tap for each supported squat",
      reps: 8,
      reward: "💎 Treasure badge",
    },
  },
};

export function getExerciseMedia(exerciseId: string, exerciseName: string) {
  return exerciseMedia[exerciseId] ?? defaultMedia(exerciseName);
}

export function getKidsExerciseImage(exerciseId: string, exerciseName: string) {
  const media = getExerciseMedia(exerciseId, exerciseName);
  return media.kidsImage ?? "/kids/exercises/quest-default.svg";
}
