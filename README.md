# Revive Motion

Physical therapy web app for guided recovery, sensor ROM tests, Kids Quest, and video knee-motion tracking.

Live site: [https://www.revivemotion.ai](https://www.revivemotion.ai)  
Source: [https://github.com/dennisozlem8-creator/revive](https://github.com/dennisozlem8-creator/revive)

Kids Quest is a storybook adventure world for exercises, with original kingdoms and hero art. Adult clinic pages stay on the light clinic theme.

## Photo Goniometer

Signed-in patients can open **Photo Goniometer** from Dashboard, Charts (Photo tab), or today’s briefing.

1. Choose the exercise, then follow the **Before you record** checklist so the clip is usable.
2. Take a side-view photo or record a short video and tap **Analyze movement**. The coach scores form, compares it to your last clip, and gives the next sets to do.
3. Saved angles, form scores, and next actions stay on this device. Doctors on this device can open a patient and review the movement trend.
4. You can still mark hip → knee → ankle by hand if the camera cannot see the leg.

The estimate is for progress tracking, not a diagnosis. Video files are not stored in the browser database.

## MyoWare 2.0 (wired muscle / EMG)

1. VIN → Uno 5V. GND → Uno GND. ENV → A0. Flip the MyoWare power switch ON. The VIN LED should stay lit.
2. Snap electrodes: MID on the muscle belly, END along the muscle, REF on nearby bone.
3. Download `wired-myoware.ino` from the Muscle page (or open `firmware/wired-myoware/wired-myoware.ino`). Board: Arduino Uno. Upload, then close Serial Monitor.
4. Open Chrome or Edge. Go to **MyoWare 2.0** (`/muscle`). Tap **Connect with USB**. Flex. ENV should rise.

## Heart sensor (live Bluetooth or USB)

A Bluetooth heart-rate strap **or** a wired Arduino pulse sensor can show live BPM.

### Wired (Elegoo Uno R3 + MAX30102)

1. If the power pin says VIN or VCC, use Uno 5V. Leave the sensor 3.3V pin empty. Never put 5V on a pin labeled only 3.3V. GND → Uno GND. SCL → A5. SDA → A4. Leave INT unconnected.
2. Download `wired-heart.ino` from the Heart page (or open `firmware/wired-heart/wired-heart.ino`). Board: Arduino Uno. Upload, then close Serial Monitor. The sketch recovers a stuck I2C bus and will try SDA/SCL swapped if the first scan finds nothing.
3. Open Chrome or Edge. Go to **Heart sensor**. Tap **Connect with USB**.
4. The page confirms `HELLO MAX30102 ELEGOO_UNO_R3`, then live `RAW` / `BPM` lines. Cover both LEDs with a fingertip.

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
