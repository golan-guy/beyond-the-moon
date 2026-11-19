# Beyond the Moon – mobile app

The game from the Claude artifact, packaged two ways from the same `www/` folder:

- **Installable web app (PWA)** – works on iPhone and Android, offline, full screen, own icon.
- **Android app (APK)** – the same files wrapped with Capacitor.

## Quickest path: GitHub does both

1. Create a new GitHub repository and push this folder to the `main` branch.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Open the **Actions** tab and wait for the two workflows:
   - *Publish web app* → the game is live at `https://<user>.github.io/<repo>/`.
     On the phone open that address, then **Share → Add to Home Screen** (iPhone)
     or **⋮ → Install app / Add to Home screen** (Android).
   - *Build Android APK* → download `beyond-the-moon-apk` from the run's Artifacts,
     unzip, copy `app-debug.apk` to the phone and install it.

## Build the APK on your own computer

Needs Node 20+, JDK 21 and Android Studio (for the Android SDK).

```
npm install
npm run android:init     # once: creates android/ and the icons/splash
npm run android:apk      # -> android/app/build/outputs/apk/debug/app-debug.apk
npm run android:open     # or open it in Android Studio and press Run
```

## Try it in a browser

```
npm run serve
```

## Changing the game

Edit `www/index.html`. After a change, bump `CACHE` in `www/sw.js` (e.g. `btm-v2` → `btm-v3`)
so phones that installed the web app pick up the new version. For the APK, rebuild.

## What was changed from the original artifact

- Fonts are bundled in `www/fonts/` instead of loading from Google Fonts (works offline).
- App icon, `manifest.webmanifest` and `sw.js` (offline support); logo image on the start screen.
- The oxygen clock follows real time, so it keeps running while the app is in the background.
- Progress is saved: reopening the app offers to resume the mission.
- "Install the app" button on the start screen, vibration feedback, screen stays awake during play, share button on the win screen.
- Question pool of 24 (8 per room); every game draws 4 per room at random.
- The final timeline challenge no longer shows mission numbers or dates until it is solved.

Questions live in the `ROOMS` array in `www/index.html`. The first four per room are the originals;
the added ones follow in the "extra question pool" block.
The debug APK is for installing on your own devices; Google Play needs a signed release build.
