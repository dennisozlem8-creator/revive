import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cadence",
  description: "Hear how today sounds. A private voice check-in for your own mental-state tone.",
};

export default function HomePage() {
  return (
    <main className="cd-main">
      <section className="cd-hero">
        <div>
          <p className="cd-kicker">Voice check-in</p>
          <h1>Hear how today sounds.</h1>
          <p className="cd-lead">
            Cadence listens to a short clip of your voice and reflects a tone for how you are: pace, melody, pauses,
            and the words you chose. It stays on this device. It is a mirror for your mental state, not a diagnosis.
          </p>
          <div className="cd-actions">
            <Link href="/check-in" className="cd-btn cd-btn-primary">
              Start a check-in
            </Link>
            <Link href="/how-it-works" className="cd-btn cd-btn-ghost">
              How the tone is made
            </Link>
          </div>
        </div>
        <aside className="cd-preview" aria-label="Picture of a result, not a real check-in">
          <div className="cd-preview-top">
            <span>Picture only</span>
            <span>Not a reading</span>
          </div>
          <div className="cd-preview-score">
            <strong>76</strong>
            <span>Mixed</span>
          </div>
          <p>A drawing of the result screen, so you can see the shape of a tone before you speak.</p>
          <div className="cd-bars" aria-hidden="true">
            <div>
              <em>Pace</em>
              <span><i style={{ width: "78%" }} /></span>
              <em>78</em>
            </div>
            <div>
              <em>Pauses</em>
              <span><i style={{ width: "70%" }} /></span>
              <em>70</em>
            </div>
            <div>
              <em>Melody</em>
              <span><i style={{ width: "81%" }} /></span>
              <em>81</em>
            </div>
          </div>
        </aside>
      </section>

      <section className="cd-section">
        <h2>Three beats, then you are done.</h2>
        <div className="cd-steps">
          <article className="cd-step">
            <b>Speak</b>
            <p>Half a minute about how today felt, in ordinary words. You are scoring yourself, out loud.</p>
          </article>
          <article className="cd-step">
            <b>Reflect</b>
            <p>Cadence turns the clip into four signals and one tone from 0 to 100. Audio is discarded.</p>
          </article>
          <article className="cd-step">
            <b>Compare</b>
            <p>After a few real check-ins, today is compared only with your own recent clips.</p>
          </article>
        </div>
      </section>

      <section className="cd-section cd-limits">
        <div>
          <h2>A reflection, with a limit on it.</h2>
          <p>
            Studies of speech have found that a slower pace, longer pauses, and a flatter melody can show up more often
            on low days. Those are group patterns. They cannot tell how any one person is. Cadence uses them as a
            private reflection and, once you have a few clips, compares you with yourself.
          </p>
        </div>
        <div className="cd-step">
          <b>What it will not do</b>
          <p>It will not diagnose a condition, upload your voice, or quietly score somebody who did not sit down to check in.</p>
          <div className="cd-actions">
            <Link href="/check-in" className="cd-btn cd-btn-primary">
              Start a check-in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
