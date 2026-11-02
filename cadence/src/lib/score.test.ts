import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyzeSamples } from "./analyze.ts";
import { findCrisis } from "./crisis.ts";
import { synthesizeSpeech } from "./samples.ts";
import { bandFor, compareToSelf, scoreCheckIn } from "./score.ts";
import type { VoiceFeatures } from "./types.ts";

function features(over: Partial<VoiceFeatures> = {}): VoiceFeatures {
  return {
    durationSec: 8,
    voicedSec: 4,
    pauseRatio: 0.3,
    onsetCount: 16,
    onsetsPerVoicedSec: 4,
    pitchMedianHz: 180,
    pitchCv: 0.15,
    ...over,
  };
}

describe("crisis language", () => {
  it("flags explicit crisis phrases and ignores ordinary speech", () => {
    assert.equal(findCrisis("I think I want to die"), true);
    assert.equal(findCrisis("I had a good walk and I am tired"), false);
    assert.equal(findCrisis("that joke is killer"), false);
  });
});

describe("tone score", () => {
  it("scores an easy clip as settled and a flat, paused clip lower", () => {
    const easy = scoreCheckIn({
      features: features(),
      transcript: "I feel calm grateful hopeful and glad",
      history: [],
      source: "microphone",
    });
    const heavy = scoreCheckIn({
      features: features({
        durationSec: 10,
        voicedSec: 2,
        pauseRatio: 0.75,
        onsetCount: 3,
        onsetsPerVoicedSec: 1.1,
        pitchMedianHz: 120,
        pitchCv: 0.02,
      }),
      transcript: "I feel exhausted hopeless and stuck",
      history: [],
      source: "microphone",
    });
    assert.equal(easy.status, "ready");
    assert.equal(easy.band, "settled");
    assert.ok((easy.score ?? 0) >= 80);
    assert.ok(heavy.band === "quieter" || heavy.band === "heavy");
    assert.ok((easy.score ?? 0) > (heavy.score ?? 0) + 25);
  });

  it("does not invent a score for a short or silent clip", () => {
    const short = scoreCheckIn({
      features: features({ durationSec: 1.2, voicedSec: 0.4 }),
      transcript: "",
      history: [],
      source: "microphone",
    });
    const quiet = scoreCheckIn({
      features: features({ durationSec: 6, voicedSec: 0.2, pauseRatio: 0.97 }),
      transcript: "hello there friend",
      history: [],
      source: "microphone",
    });
    assert.equal(short.status, "short");
    assert.equal(short.score, null);
    assert.equal(quiet.status, "quiet");
    assert.equal(quiet.score, null);
  });

  it("keeps spaces in the transcript so typing is possible", () => {
    const partial = scoreCheckIn({
      features: features(),
      transcript: "I want to ",
      history: [],
      source: "microphone",
    });
    assert.equal(partial.transcript, "I want to ");
    assert.equal(partial.crisis, false);
  });

  it("hides the score when the words are a crisis", () => {
    const result = scoreCheckIn({
      features: features(),
      transcript: "I want to die",
      history: [80, 82],
      source: "microphone",
    });
    assert.equal(result.crisis, true);
    assert.equal(result.score, null);
    assert.equal(result.comparedToYou, null);
  });

  it("compares a microphone check-in with your own recent scores", () => {
    assert.equal(compareToSelf(70, [70]), null);
    assert.match(compareToSelf(50, [80, 82, 78]) ?? "", /Quieter than your recent/);
    assert.match(compareToSelf(90, [70, 72]) ?? "", /Brighter than your recent/);
    assert.match(compareToSelf(74, [70, 76]) ?? "", /Close to your recent/);
    const result = scoreCheckIn({
      features: features(),
      transcript: "",
      history: [60, 62, 58],
      source: "microphone",
    });
    assert.match(result.comparedToYou ?? "", /Brighter than your recent/);
    const sample = scoreCheckIn({
      features: features(),
      transcript: "",
      history: [60, 62],
      source: "sample",
    });
    assert.equal(sample.comparedToYou, null);
  });

  it("assigns the published bands", () => {
    assert.equal(bandFor(72), "settled");
    assert.equal(bandFor(52), "mixed");
    assert.equal(bandFor(34), "quieter");
    assert.equal(bandFor(33), "heavy");
  });
});

describe("example voices", () => {
  it("hears a brighter example above a quieter one", () => {
    const brightFeatures = analyzeSamples(synthesizeSpeech("settled"), 16000);
    const quietFeatures = analyzeSamples(synthesizeSpeech("quieter"), 16000);
    const bright = scoreCheckIn({
      features: brightFeatures,
      transcript: "I feel calm and grateful today",
      history: [],
      source: "sample",
    });
    const quiet = scoreCheckIn({
      features: quietFeatures,
      transcript: "I feel tired and heavy and stuck",
      history: [],
      source: "sample",
    });
    assert.equal(bright.status, "ready", JSON.stringify(brightFeatures));
    assert.equal(quiet.status, "ready", JSON.stringify(quietFeatures));
    assert.ok(brightFeatures.pitchCv != null && quietFeatures.pitchCv != null);
    assert.ok((brightFeatures.pitchCv ?? 1) > (quietFeatures.pitchCv ?? 0));
    assert.ok(quietFeatures.pauseRatio > brightFeatures.pauseRatio);
    assert.equal(bright.band, "settled");
    assert.ok(quiet.band === "quieter" || quiet.band === "heavy");
    assert.ok((bright.score ?? 0) > (quiet.score ?? 0) + 15, `${bright.score} vs ${quiet.score}`);
  });
});
