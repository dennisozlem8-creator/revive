import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
  description: "How Cadence turns a voice clip into a private mental-state reflection, and what it refuses to claim.",
};

export default function HowItWorksPage() {
  return (
    <main className="cd-main cd-prose">
      <p className="cd-kicker">The method</p>
      <h1>How a tone is made.</h1>
      <p>
        Cadence is named for the rhythm of a voice. You speak, the browser measures that rhythm, and you get one number
        you can compare with your own later clips.
      </p>

      <h2>What you do</h2>
      <p>
        Sit somewhere you can talk. Say how today felt for about half a minute. Cadence is for the person at the
        microphone. It is not a tool for screening someone else, and it does not accept a file of another person&apos;s
        voice.
      </p>

      <h2>The four signals</h2>
      <ul>
        <li>Pace: how often speech sounds arrive while you are talking.</li>
        <li>Pauses: how much of the clip is quiet.</li>
        <li>Melody: how much your pitch moves. A very flat contour scores lower than a varied one.</li>
        <li>Words: a small list of lighter and heavier words, used only when there are enough of them. Context is easy to miss, so words stay a tenth of the tone.</li>
      </ul>
      <p>
        The tone runs from 0 to 100 and lands in a band: Settled, Mixed, Quieter, or Heavy. If the clip is too short or
        too quiet, Cadence asks you to try again instead of inventing a number.
      </p>

      <h2>You, compared with you</h2>
      <p>
        The first clips have no personal baseline. After two microphone check-ins, a later one can say whether today
        sounds brighter, quieter, or close to your recent tones. Example voices are left out of that comparison.
      </p>

      <h2>What it cannot tell you</h2>
      <p>
        A slower voice can be fatigue, a quiet room, a careful speaker, or a hard day. Cadence cannot tell those apart.
        It does not diagnose depression, anxiety, or any other condition. It is not a medical device, and the weights
        inside the tone are a wellness heuristic, not a clinical scale.
      </p>

      <h2>Privacy</h2>
      <p>
        Analysis runs in the browser. The recording is discarded after the reflection is made. Cadence saves the tone,
        the signals, and the words you keep in this browser&apos;s local storage. There is no account and no upload.
      </p>

      <h2>If the words sound like a crisis</h2>
      <p>
        If what you said includes explicit crisis language, Cadence hides the score and shows help first. In the US and
        Canada, call or text 988, or visit <a href="https://988lifeline.org/">988lifeline.org</a>. If you are in
        immediate danger, call emergency services. Outside the US and Canada, local lines are listed by the{" "}
        <a href="https://www.iasp.info/suicidalthoughts/">International Association for Suicide Prevention</a>.
      </p>
      <p>
        <Link href="/check-in">Start a check-in</Link>
      </p>
    </main>
  );
}
