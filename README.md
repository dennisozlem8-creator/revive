# Revive Motion

Physical therapy web app for guided recovery, sensor ROM tests, Kids Quest, and video knee-motion tracking.

Live site: [https://www.revivemotion.ai](https://www.revivemotion.ai)  
Source: [https://github.com/dennisozlem8-creator/revive](https://github.com/dennisozlem8-creator/revive)

Kids Quest is a storybook adventure world for exercises, with original kingdoms and hero art. Adult clinic pages stay on the light clinic theme.

## Photo Goniometer

Signed-in patients can open **Photo Goniometer** from Dashboard, Charts (Photo tab), or today’s briefing.

1. Open the camera and take a side-view photo, or choose a photo from files. The app reads the hip, knee, and ankle and shows the angle at the bottom of that page.
2. Or record a short side-view video, then tap **Send to analysis** or **Save to database**.
3. Saved angles stay on this device. If Supabase is connected, a copy is also sent to the clinic database.
4. You can still mark hip → knee → ankle by hand if the camera cannot see the leg.

The estimate is for progress tracking, not a diagnosis. Video files are not stored in the browser database.

## Heart sensor (live Bluetooth or USB)

A Bluetooth heart-rate strap **or** a wired Arduino pulse sensor can show live BPM.

### Wired (Elegoo Uno R3 + MAX30102)

1. VIN/VCC → 5V, GND → GND, SCL → A5, SDA → A4. Leave INT unconnected.
2. Upload `firmware/wired-heart/wired-heart.ino` in Arduino IDE (Board: Arduino Uno). Close Serial Monitor.
3. Open Chrome or Edge. Go to **Heart sensor**. Tap **Connect with USB**.
4. The page confirms the Elegoo said `HELLO MAX30102 ELEGOO_UNO_R3` and then shows live `RAW` / `BPM` lines from that sensor.

### Bluetooth strap

Polar H9/H10, Wahoo TICKR, Coospo, Magene, and similar BLE heart-rate straps. Apple Watch and many Fitbits do not share heart rate with a website. Joint ROM scan is still a demo.

## Run locally

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Optional Supabase keys in `.env.local` come from your Supabase project. The app still runs without them; accounts and goniometer results stay in local storage.

Open [http://localhost:3000](http://localhost:3000).
