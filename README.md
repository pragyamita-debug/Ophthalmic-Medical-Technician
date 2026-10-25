# CV → Dashboard (Ophthalmic Medical Technician)

Candidates upload a CV (PDF, DOCX or TXT) and get an animated portfolio dashboard in a night-blue clinic
style: deep navy, electric-blue light, glass cards, a drifting network of light points behind the hero, real
clinician / imaging-suite / reception photos, and a warm sunrise on the horizon of the contact band.

Everything runs in the browser. The CV is read client-side and never sent to a server.

**Live site:** https://pragyamita-debug.github.io/Ophthalmic-Medical-Technician/ (after Pages is switched on — see below)

## How it works

0. **Example first** — the page opens on the full design filled with neutral placeholder text
   (`src/data/placeholder.ts`: “Your Name”, “Your Role”, “Project One”…) and an **Upload CV** button.
1. **Upload** — drag a CV onto the drop zone, or try the bundled sample (`src/data/sample-cv.txt`, a fictional ophthalmic technician).
2. **Read** — PDF text comes from pdf.js, Word files from mammoth; both load only when needed.
3. **Parse** — `src/lib/parseResume.ts` splits the text into sections and works out years of experience from
   the date ranges, counting overlapping jobs once. `Tools: …` lines under a project become its tags.
4. **Review** — the candidate checks what was found and fixes anything before the dashboard is built.
5. **Dashboard** — saved to `localStorage`; the profile menu (top right) can upload another CV, edit, download or go back to the example.

## What the dashboard shows

| Section | Built from |
| --- | --- |
| Top bar | eye mark, name and role, section links, expanding search (Enter jumps to and highlights the match), bell with the goals, profile menu, **Upload CV** / **Get in touch** |
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
npm test             # parser tests (vitest)
npm run build        # static build in dist/
npm run build:single # one self-contained index.html in dist-single/
```

## Publish on GitHub Pages

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Actions → Deploy to GitHub Pages → Run workflow** (it also runs on every push to `main`).

## Writing a CV that parses well

- Clear headings: **Experience**, **Education**, **Skills**, **Projects**, **Achievements**, **Certifications**.
- Dates on the role line or the line after it: `Jan 2023 – Present`, `03/2021 - 06/2023`, `2019 - 2022`.
- Optional extras: **Goals** (`Goal: …`, `Next Step: …`), **Motto**, **Interests**.
- Text-based PDFs only — scanned images have no text to read.

## Project structure

```
src/
  App.tsx                 example → upload → reading → review → dashboard
  data/placeholder.ts     the general example profile shown before any upload
  data/sample-cv.txt      fictional sample CV
  lib/                    extractText, parseResume (+ tests), dates, storage, types
  hooks/                  useCountUp, useScramble, useInView, usePointerGlow, useScrollSpy
  components/
    NavBar.tsx            top bar, search, bell, profile menu
    Sections.tsx          hero, skills, projects, about, experience, achievements, contact band, footer
    Dashboard.tsx         page layout
    UploadScreen.tsx, ReviewDialog.tsx
    GlowCard.tsx          the moving-border card
  assets/photos/          hero, imaging suite, reception
  styles/global.css       colour tokens, type, buttons
```

The photos in `src/assets/photos/` were cut from the design mock-up (the clinic logo and name removed — the
page writes the candidate’s own name on the reception wall) and enlarged with Real-ESRGAN mixed with a plain
enlargement and light grain. Swap in higher-resolution photos with the same file names for the sharpest page.
