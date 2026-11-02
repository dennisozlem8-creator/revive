"use client";

import { useState, useSyncExternalStore } from "react";
import { formatWhen } from "@/lib/format";
import { clearCheckIns, loadCheckIns, serverCheckIns, subscribeCheckIns } from "@/lib/storage";

function Trend({ scores }: { scores: number[] }) {
  const width = 320;
  const height = 88;
  const step = scores.length === 1 ? 0 : width / (scores.length - 1);
  const points = scores
    .map((score, index) => `${index * step},${height - (score / 100) * (height - 8) - 4}`)
    .join(" ");
  return (
    <svg className="cd-trend" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Microphone tones, oldest to newest">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function HistoryBoard() {
  const items = useSyncExternalStore(subscribeCheckIns, loadCheckIns, serverCheckIns);
  const [confirming, setConfirming] = useState(false);

  if (items.length === 0) {
    return (
      <div className="cd-panel" data-testid="history-empty">
        <h2>Nothing saved yet</h2>
        <p>A check-in stays in this browser. Audio is never kept.</p>
      </div>
    );
  }

  const trend = items
    .filter((item) => item.source === "microphone" && typeof item.score === "number")
    .slice()
    .reverse();

  return (
    <>
      {trend.length >= 2 ? <Trend scores={trend.map((item) => item.score as number)} /> : null}
      <ol className="cd-history-list" data-testid="history-list">
        {items.map((item) => (
          <li key={item.id}>
            <time dateTime={item.createdAt}>{formatWhen(item.createdAt)}</time>
            {item.source === "sample" ? <span className="cd-tag">Example</span> : null}
            {item.crisis ? (
              <p>Crisis check-in, saved without a tone. If you need help now, call or text 988.</p>
            ) : item.score != null ? (
              <strong>
                {item.score} · {item.bandLabel}
              </strong>
            ) : (
              <p>{item.summary}</p>
            )}
            {item.comparedToYou ? <p>{item.comparedToYou}</p> : null}
          </li>
        ))}
      </ol>
      <div className="cd-actions">
        {confirming ? (
          <>
            <button
              type="button"
              className="cd-btn cd-btn-primary"
              onClick={() => {
                clearCheckIns();
                setConfirming(false);
              }}
            >
              Yes, erase everything on this device
            </button>
            <button type="button" className="cd-btn cd-btn-ghost" onClick={() => setConfirming(false)}>
              Keep it
            </button>
          </>
        ) : (
          <button type="button" className="cd-btn cd-btn-ghost" onClick={() => setConfirming(true)}>
            Erase history
          </button>
        )}
      </div>
    </>
  );
}
