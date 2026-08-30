# Revive Motion

Physical therapy web app for guided recovery, sensor ROM tests, Kids Quest, and video knee-motion tracking.

Live site: [https://www.revivemotion.ai](https://www.revivemotion.ai)  
Source: [https://github.com/dennisozlem8-creator/revive](https://github.com/dennisozlem8-creator/revive)

## Photo Goniometer

Signed-in patients can open **Photo Goniometer** from Dashboard, Charts (Photo tab), or today’s briefing.

1. Open the camera and take a side-view photo, or choose a photo from files. The app reads the hip, knee, and ankle and shows the angle at the bottom of that page.
2. Or record a short side-view video, then tap **Send to analysis** or **Save to database**.
3. Saved angles stay on this device. If Supabase is connected, a copy is also sent to the clinic database.
4. You can still mark hip → knee → ankle by hand if the camera cannot see the leg.

The estimate is for progress tracking, not a diagnosis. Video files are not stored in the browser database.

## Heart sensor (live Bluetooth)

A Bluetooth heart-rate strap can show **live BPM** on Session, onboarding, and assessment screens.

1. Open Chrome or Edge (not iPhone Safari).
2. Wear the strap and wait until it wakes.
3. Tap **Connect heart sensor**. Pick your device in the browser list.
4. If it is missing, tap **My sensor is not listed**.

Works with most BLE heart-rate straps (Polar H9/H10, Wahoo TICKR, Coospo, Magene, and similar). Apple Watch and many Fitbits do not share heart rate with a website. Joint ROM scan is still a demo.

## Run locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Optional Supabase keys in `.env.local` come from your Supabase project. The app still runs without them; accounts and goniometer results stay in local storage.

Open [http://localhost:3000](http://localhost:3000).
