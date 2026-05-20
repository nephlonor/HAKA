# Haka!

A web rendering of the Haka! mobile mockup — pick an animal, tune its stats,
and battle nearby opponents.

## Run locally

The app is a static site with no build step.

```sh
# any static server, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

Open `index.html` directly with `file://` also works in most browsers.

## Host on GitHub Pages

1. Push this branch to GitHub and merge to `main` (or set Pages to deploy from this branch).
2. Repo → **Settings** → **Pages** → **Branch**: select the branch + `/ (root)`.
3. Wait for the deploy; the URL will be `https://<user>.github.io/HAKA/`.

## Screens

- **Login** — email/password + sign-up + social-login stubs. The eagle/dragonfly/etc. carousel
  lets you pick the animal you want to start with (only unlocked ones apply).
- **Home (`Haka!`)** — your current animal, total attribute score, ⚙ goes to Settings.
- **Settings** — username, change password, Bluetooth / WiFi / Location toggles.
  **Battles require Bluetooth or WiFi to be on.**
- **Stats** — points, win %, matches, line chart, demo IAPs.
- **Attributes** — five sliders (Speed / Agility / Intelligence / Power / Reflexes). The total
  shows in the corner; total goes up to 50.
- **Battle** — swipe through opponents (FabioX14, Reymondo, Alice 98, …), tap **FIGHT**.
  Win = +5 points, lose = −2.
- **Roster** — animals organized by point tiers (45+, 250+, 500+). Tap an unlocked animal to equip it.

## Navigation

Swipe (touch) or click-drag (desktop) between adjacent screens. There's also a small dock at the
bottom for direct nav. The `⌄` and `⌃` glyphs in the mockup hint at swipe direction.

## What's faked

Real-world Bluetooth/Wi-Fi peer matchmaking isn't available to a web page. Battles are
rolled locally against scripted opponents using your slider values, so the **UX** matches
the mockup even though the **transport** is simulated. The login, social-login, and IAP
buttons are stubs as well.

State persists in `localStorage` under the key `haka:v1`.
Reset from the console: `__haka.reset()`.

---
© by JUFL
