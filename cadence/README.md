# Cadence

A private voice check-in for how today sounds.

Cadence is a separate app from Revive Motion. You speak for about half a minute. The browser reflects four signals — pace, melody, pauses, and the words you chose — as one tone from 0 to 100. That tone is a mental-state reflection you can compare with your own later clips.

It is a wellness mirror, not a diagnosis. It does not detect depression, anxiety, or any other condition, and it is not a medical device. Audio stays on the device and is discarded after the reflection. There is no account and no upload. Cadence is for the person speaking. It is not a way to score someone else.

If a check-in includes explicit crisis language, the score is hidden and the screen leads with help: in the US and Canada, call or text 988.

## Run

```bash
cd cadence
npm install
npm run dev
```

Open [http://localhost:3010](http://localhost:3010).

```bash
npm test
npm run lint
npm run build
```

The check-in page can record from the microphone. **Try a brighter example** and **Try a quieter example** run the same scorer on synthetic tones, so you can see a result without a mic. Those examples are tagged in history and do not become your baseline.
