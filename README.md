# MUNDA Light Lab

Automotive lighting simulator — the player takes the role of a Lighting Engineer
building an integrated door-panel lighting system with LED, optical fiber and
smart textile technology.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (Vite plugin, `@theme` tokens)
- Framer Motion (animations)
- React Router (routes: `/` start screen, `/lab` lab core)
- Zustand (game state store)
- HTML Canvas (light-particle field)

## Structure

```
src/
  components/
    fx/       LightField (canvas light simulation)
    layout/   TopBar, LogoMark
    ui/       GlowButton, Panel, SpecTag, StatusLight
  data/       static definitions (lab stations, version)
  screens/    HomeScreen, LabScreen
  store/      zustand game store
  utils/      cn() class joiner
  types.ts    shared domain types
```

## Run

```bash
npm install
npm run dev
```
