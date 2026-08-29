# Revive Motion

Physical therapy web app for guided recovery, sensor ROM tests, Kids Quest, and video knee-motion tracking.

Live site: [https://www.revivemotion.ai](https://www.revivemotion.ai)  
Source: [https://github.com/dennisozlem8-creator/revive](https://github.com/dennisozlem8-creator/revive)

## Photo Goniometer

Signed-in patients can open **Photo Goniometer** from Dashboard, Charts (Photo tab), or today’s briefing.

1. Take or upload a side-view JPG/PNG.
2. Tap hip, then knee, then ankle.
3. Save the estimated knee angle.
4. Review the progress graph (goal line uses your target ROM).

Photos stay on the device. Saved angles are stored in this browser. The estimate is for progress tracking, not a diagnosis.

## Run locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Optional Supabase keys in `.env.local` come from your Supabase project. The app still runs without them; accounts and goniometer results stay in local storage.

Open [http://localhost:3000](http://localhost:3000).
