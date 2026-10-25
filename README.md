# Ophthalmic Medical Technician Portfolio Dashboard

An animated portfolio dashboard in a night-blue clinic style: deep navy, electric-blue light, glass cards, a drifting network of light points behind the hero, real
clinician / imaging-suite / reception photos, and a warm sunrise on the horizon of the contact band.

All the content lives in one file, `src/data/profile.ts`. It ships with neutral placeholder text
(“Your Name”, “Your Role”, “Project One”…) — replace the values and the whole page updates.

**Live site:** https://pragyamita-debug.github.io/Ophthalmic-Medical-Technician/ (after Pages is switched on — see below)

## Making it yours

Open `src/data/profile.ts` and edit the fields:

| Field | Shown in |
| --- | --- |
| `name`, `headline` (`Role | Focus`), `location`, `email`, `phone`, `links` | top bar, hero, reception wall, contact, footer |
| `summary`, `tagline`, `motto` | hero, skills intro, about, footer |
| `skills`, `interests`, `certifications` | hero chips, skill cards |
| `projects` (with `tags`) | projects |
| `experience` | experience cards |
| `achievements`, `certifications` | achievement cards, counters |
| `goals` | bell, hero card, contact band, footer |
| `stats` | the counting numbers |
| `cvUrl` (optional) | adds a **Download CV** button — put the file in `public/` |

## What the dashboard shows

| Section | Built from |
| --- | --- |
| Top bar | eye mark, name and role, section links, expanding search (Enter jumps to and highlights the match), bell with the goals, **Get in touch** |
| Hero | focus, name, role in blue, first line of the summary, three top skills; clinician photo with a scan line and a floating “next step” card |
| Skills | six glowing skill cards (all on request) |
| Projects | imaging-suite photo with a breathing glow; pick a project to read it |
| About | summary; years / projects / skills / awards counting up; reception photo with the name glowing on the wall |
| Experience | role cards with company initials; the lit card walks along and its bullets show below |
| Achievements | achievements and certifications as review cards with stars, auto-sliding |
| Contact band | the next goal and a small form that opens an email; a sun rises on the horizon |
| Footer | links, skills, contact details, next steps |

## Animations

| Effect | Where | How |
| --- | --- | --- |
| Counting numbers | about | `useCountUp` — rAF + ease-out-expo, starts when in view; the “+” lands when the count finishes |
| Moving, lit borders | skill, role, review and hero cards | conic gradient on `@property --angle`, masked to a thin ring, plus a blurred halo (`GlowCard`) |
| Hover | every card, chip, icon and button | pointer spotlight + slight tilt, lift, glow, icons brighten |
| Light network | hero background | a small canvas of drifting points joined by fading lines |
| Rising sun | contact band | the sun climbs over a glowing horizon line when the band scrolls into view |
| Scan line, neon sign, hologram glow | hero photo, reception, imaging suite | CSS keyframes |

All motion respects `prefers-reduced-motion`.

## Getting started

```bash
npm install
npm run dev          # local dev server
npm run typecheck    # TypeScript check
npm run build        # static build in dist/
npm run build:single # one self-contained index.html in dist-single/
```

## Publish on GitHub Pages

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Actions → Deploy to GitHub Pages → Run workflow** (it also runs on every push to `main`).

## Project structure

```
src/
  App.tsx                 renders the dashboard from the profile
  data/profile.ts         all the content (edit this)
  lib/types.ts            the profile shape
  hooks/                  useCountUp, useScramble, useInView, usePointerGlow, useScrollSpy
  components/
    NavBar.tsx            top bar, search, bell
    Sections.tsx          hero, skills, projects, about, experience, achievements, contact band, footer
    Dashboard.tsx         page layout
    GlowCard.tsx          the moving-border card
  assets/photos/          hero, imaging suite, reception
  styles/global.css       colour tokens, type, buttons
```

The photos in `src/assets/photos/` were cut from the design mock-up (the clinic logo and name removed — the
page writes the candidate’s own name on the reception wall) and enlarged with Real-ESRGAN mixed with a plain
enlargement and light grain. Swap in higher-resolution photos with the same file names for the sharpest page.
