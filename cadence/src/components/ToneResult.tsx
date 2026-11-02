import type { Ref } from "react";
import type { CheckIn } from "@/lib/types";

function ScoreRing({ score, band }: { score: number; band: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  return (
    <svg className="cd-ring" data-band={band} viewBox="0 0 140 140" aria-hidden="true">
      <circle className="cd-ring-track" cx="70" cy="70" r={radius} />
      <circle
        className="cd-ring-value"
        cx="70"
        cy="70"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
      />
      <text className="cd-ring-num" x="70" y="78" textAnchor="middle">
        {score}
      </text>
    </svg>
  );
}

export function ToneResult({
  result,
  onTranscript,
  headingRef,
}: {
  result: CheckIn;
  onTranscript?: (value: string) => void;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  const scored = result.status === "ready" && result.score != null && result.band && !result.crisis;

  return (
    <article className="cd-panel cd-result" aria-live="polite">
      {result.crisis ? (
        <div className="cd-crisis" data-testid="crisis-panel">
          <h2 ref={headingRef} tabIndex={-1}>
            If this is a crisis, reach out now.
          </h2>
          <p>{result.summary}</p>
          <p>
            In the US and Canada, <a href="tel:988">call 988</a> or <a href="sms:988">text 988</a>. You can also open{" "}
            <a href="https://988lifeline.org/">988lifeline.org</a>. If you are in immediate danger, call emergency
            services.
          </p>
          <p>
            Outside the US and Canada, the{" "}
            <a href="https://www.iasp.info/suicidalthoughts/">International Association for Suicide Prevention</a> lists
            local lines.
          </p>
          <p>This check-in was saved on this device without a tone number.</p>
        </div>
      ) : scored ? (
        <div className="cd-score-layout">
          <ScoreRing score={result.score as number} band={result.band as string} />
          <div className="cd-score-copy">
            <p className="cd-kicker">{result.source === "sample" ? "Example voice" : "Your clip"}</p>
            <h2 ref={headingRef} tabIndex={-1} data-testid="tone-band">
              {result.bandLabel}
            </h2>
            <p data-testid="tone-score">{result.score} out of 100</p>
            <p>{result.summary}</p>
            {result.comparedToYou ? <p className="cd-compare">{result.comparedToYou}</p> : null}
          </div>
        </div>
      ) : (
        <>
          <h2 ref={headingRef} tabIndex={-1}>
            Try that once more
          </h2>
          <p>{result.summary}</p>
        </>
      )}

      {scored ? (
        <ul className="cd-signals">
          {result.signals.map((signal) => (
            <li key={signal.key} className="cd-signal">
              <div className="cd-signal-label">
                <span>{signal.label}</span>
                <span>{signal.score == null ? "Left out" : signal.score}</span>
              </div>
              {signal.score != null ? (
                <div className="cd-bar" aria-hidden="true">
                  <span style={{ width: `${signal.score}%` }} />
                </div>
              ) : null}
              <p>{signal.detail}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {onTranscript ? (
        <label className="cd-field">
          Words from this check-in
          <textarea
            data-testid="transcript"
            value={result.transcript}
            onChange={(event) => onTranscript(event.target.value)}
            placeholder="Type what you said if the transcript is empty or wrong."
          />
        </label>
      ) : null}

      <p className="cd-fine">
        {result.source === "sample"
          ? "This example is a synthetic voice, not a person. It is marked in history and is not part of your baseline."
          : "The recording was not stored."}{" "}
        {result.status === "ready" ? "The reflection is saved in this browser only." : null} Cadence does not diagnose a
        mental health condition.
      </p>
    </article>
  );
}
