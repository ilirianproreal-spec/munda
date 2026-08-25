# MUNDA — Automotive Lighting Technology

Premium B2B company website for MUNDA + the integrated **MUNDA Light Lab** game
(a lighting simulator where the player designs a door-panel lighting system with
LED, optical fibers and textile technology).

One product: the website presents the technology and drives visitors into the lab.

## Routes

| Route | Page |
|---|---|
| `/` | Home (Hero, Technology, Automotive, Light Lab, About, Careers) |
| `/about` | About |
| `/careers` | Careers |
| `/light-lab` | Game entry (fullscreen, "← Back to MUNDA") |
| `/light-lab/how` | Game tutorial (4 steps) |
| `/light-lab/lab` | Design Lab — the game (5 levels, heatmap, validation test) |

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (Vite plugin, `@theme` tokens — electric cyan + violet on near-black)
- Framer Motion (scroll reveals, parallax, micro-interactions)
- React Router (routes above)
- Zustand + `persist` middleware (localStorage: levels, best score, test count, sound)
- HTML Canvas (light simulation / heatmap) + SVG + SMIL (interior showcase)

## Structure

```
src/
  components/
    fx/        LightField (canvas fibers), InteriorShowcase (SVG), TutorialArt
    lab/       DoorPanel, LedControls, MaterialPicker, FiberPicker,
               ProjectStats, TestReport
    layout/    TopBar (game HUD), LogoMark, BootSplash
    ui/        GlowButton, Panel, SpecTag, StatusLight
    FadeIn.tsx scroll-reveal wrapper
  sections/    Navbar, Hero, TechnologySection, AutomotiveSection,
               LightLabSection, AboutSection, CareersSection, Footer
  pages/       HomePage, AboutPage, CareersPage
  screens/     LightLabEntry, TutorialScreen, DesignLabScreen
  data/        lab stations, materials, fibers, levels
  store/       labStore (game state), settingsStore (sound)
  lib/         cn, light (metrics/geometry), heatmap, sound (Web Audio)
```

## Game loop

DESIGN → TEST → ANALYZE → OPTIMIZE → PASS: place LEDs, pick a textile layer and
fiber routing, then run the validation test — 5 metrics (uniformity, energy, cost,
design, manufacturability) weighted into a total score, evaluated against 5
sequential levels. Progress persists in localStorage.

## Run

```bash
npm install
npm run dev
```
