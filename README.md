# Next Chapter — web prototype

A runnable React + TypeScript + Vite recreation of the **Next Chapter** mobile app design
(Figma file *Next-Chapter*, page **“Page 4 Job Transition”**).

Next Chapter is an AI-powered career-transition companion for experienced people who have lost
their professional direction (laid off, retiring, ready for a change). The prototype follows
**Sarah, 48** — 20 years leading projects and teams in tech — as she rediscovers her strengths
with **JoyAI**, the AI coach, chooses to explore yoga teaching, and turns it into a 100-day plan.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks and builds a static site into `dist/` (relative paths, works on GitHub Pages or any static host). |
| `npm run preview` | Serves the production build locally. |
| `npm run fetch:assets` | Downloads the photos from Figma into `public/images/` (see below). |

### Photos

The photos in the Figma file are not committed here. Every image slot renders a soft,
on-palette placeholder until the real file exists. To pull the originals from Figma:

```bash
FIGMA_TOKEN=<personal access token> npm run fetch:assets
```

Create the token in Figma → Settings → Security → *Personal access tokens* (read-only file
content is enough). The script maps each slot to its Figma node in `scripts/fetch-figma-assets.mjs`.

## Responsive behaviour

- **Desktop / tablet (≥ 600 px):** the app is shown inside a 390 × 844 iPhone frame with the
  Dynamic Island, status bar and home indicator — the same viewport as the Figma frames. On wide
  screens (≥ 1000 px) a *prototype map* on the left jumps to any screen or overlay.
- **Phones (< 600 px):** the prototype fills the real screen, drops the fake status bar / home
  indicator and uses the device safe-area insets instead.
- Each screen keeps the top bar and bottom tab bar fixed while the content scrolls, as in Figma.

## Screens and flow

| Route | Figma frame | Notes |
| --- | --- | --- |
| `/welcome` | P1 - Welcome Page | Every visit starts here — `/` and unknown routes redirect to it. “Discover My Next Chapter” opens **Meet JoyAI** |
| `/coach/start` | P2 - AI Coach Guiding | First-time chat, journey step 1, no tab bar |
| `/strengths` | P3 - User Strength | Journey step 2 |
| `/possibilities` | P4 | Journey step 3 — reached only from P3 and “Revisit My Possibilities” |
| `/fit` | P5 | “Build My 100-Day Yoga Plan” opens **Plan ready** |
| `/home` | P0 - Home | **Home** tab (also where *Plan ready → Let’s Begin My Journey* lands). Greeting, journey card → Roadmap, strengths-vs-role radar → P5, My Schedule (event cards → Discover / Community), then JoyAI’s green check-in card at the bottom (**Let’s talk** → AI Coach, JoyAI → profile, **Not now** folds it away) |
| `/coach` | P2.2 - AI Coach | AI Coach tab |
| `/discover` | P4.2 - Explore Your Next Steps | **Discover** tab once a path is chosen |
| `/roadmap` | P6 - Roadmap | **Roadmap** tab — “My 100-Day Roadmap”: long-term goal → milestones → next action |
| `/community` | P7 - Community | Peer circles, human guide, RSVP |
| ~~`/community/my-day`~~ | P7.2 - My Day | Hidden — not routed and nothing links here (`src/screens/MyDay.tsx` kept; its schedule now lives on Home) |
| `/me` | User Page | Avatar in the top bar |
| `/messages` | P8 - Messages | 💬 in the top bar |
| `/joyai` | JoyAI Settings | From the ≡ drawer or JoyAI’s profile. The Overview · Knowledge · About You · Preferences bar pins to the top, scrolls to its section and follows the scroll; **Customize** jumps to Preferences. *How I Talk With You* (Preferences) sets behaviour, not content: tone (shown as the header tags), reply length, reply language, proactive check-ins and boundaries, with a live sample reply. Check-ins and language also drive JoyAI’s check-in on Home |

Overlays: settings drawer (≡ — text size, bold text and high contrast actually work), Meet JoyAI,
JoyAI profile, Plan ready, and three *Add to My Day* sheets (gathering RSVP, guide chat, trial class).

## Design system

- **Colour** — tokens mirror the Figma variable collection *Next Chapter · Color*
  (`src/styles/tokens.css`): Primary `#1E382B`, Secondary `#D9933B`, Tertiary `#995A4E`, Neutral `#232623`.
- **Type** — Newsreader for headlines, Atkinson Hyperlegible Next for body and labels (bundled via Fontsource).
- **Components** — top bar, bottom nav, journey steps, JoyAI mascot/avatar, radar chart, pills, toggles and
  cards in `src/components/`.

## Project structure

```
src/
  App.tsx              router, device frame, prototype map
  routes.ts            route ↔ Figma frame map
  context/             overlay + display-settings state
  components/          shared UI (Chrome, Screen, JoyAI, RadarChart, Icon, ui…)
  overlays/            drawer, modals and bottom sheets
  screens/             one file per Figma frame
  data/content.ts      shared copy and chart data from Figma
  styles/              tokens + global styles
scripts/fetch-figma-assets.mjs
```

Sample people and messages illustrate the information structure only.
