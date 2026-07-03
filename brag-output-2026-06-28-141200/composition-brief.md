# Hyperframes Composition Brief: Quotex by SaralBuy

## Objective
Create a short launch-style brag video for Quotex by SaralBuy.

## Output
- Composition directory: `brag-output-2026-06-28-141200/composition/`
- Rendered video: `brag-output-2026-06-28-141200/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 15 seconds

## Source Material
- Project root: `c:\Users\Mayur Agarwal\Desktop\Saralbuy\frontend_v2`
- Primary files read: `index.html`, `src/index.css`, `package.json`, `src/pages/ProductOverview.jsx`
- Product name: Quotex by SaralBuy
- Tagline / strongest claim: "Sourcing 1500 bags of cement just got as easy as ordering a pizza."
- Key UI or visual moment to recreate: The "Requirement Specifications" grid showing RFQ details, and a massive side drawer sliding in for "Submit Quotation".
- Copy that must appear verbatim:
  - "B2B Sourcing used to be slow."
  - "Not anymore."
  - "Requirement Specifications"
  - "Submit Quotation"
  - "Quotex by SaralBuy. Start sourcing today."

## Creative Direction
- Tone preset: `app-store`
- Creative direction: "Corporate but not boring, smooth, premium B2B SaaS"
- Interpretation: Clean typography (Geist), solid contrast, deliberate pacing without chaotic cuts. Professional corporate energy.
- Angle: Emphasize the ease and slickness of dealing with massive industrial RFQs.
- Hook: A confident dark-mode intro fading out into the bright, crisp UI of the app.
- Outro / punchline: Fade to the brand orange color with the final CTA.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `oklch(1 0 0)` (White) / Dark sections `#1A1A1A`
- Text: `oklch(0.145 0 0)` (Dark Slate)
- Accent: `rgb(235, 120, 19)` (Orange)
- Display font: `Geist Variable`
- Body font: `Geist Variable`
- Visual references from the project: Grid layouts, subtle rounded borders, large slide-out drawer pattern.

## Storyboard
Use the storyboard in `brag-output-2026-06-28-141200/brag-plan.md` as the creative contract.

Scene summary:
1. The Hook — 3s — Dark screen, big text: "B2B Sourcing used to be slow. Not anymore."
2. The Grid Reveal — 4s — White background, "Requirement Specifications" grid stagger-reveals the data points.
3. The Action — 4s — The "Submit Quotation" 45vw drawer slides in over the grid from the right.
4. Outro — 4s — Orange background, "Quotex by SaralBuy. Start sourcing today."

## Audio
- Audio role: warm bed
- Audio arc: Drop in quickly, smooth corporate tech beats, swell at the end and cut.
- Music: `upbeat_corporate.mp3`
- Music treatment: Consistent bed, fade out at the very end.
- Music cue guidance: detect at composition via analyze_music_cues.py / hyperframes beats
- Audio-reactive treatment: subtle
- Audio-coupled moments:
  - The Grid Reveal — sequential pops or hits for the grid cards appearing.
  - The Action — deep woosh/slide sound for the drawer opening.
- SFX selection guidance: Modern UI swooshes, clean pops, subtle clicks.
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation.

## Hyperframes Instructions
Use the current `hyperframes` skill and CLI workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project.
- Keep all text readable in the final render.
- Keep the video within 15-25 seconds.
- Include the planned music/SFX layer unless audio was explicitly disabled or documented as intentionally silent.
- Treat `/brag` audio notes as guidance, not a fixed cue sheet. Choose SFX after the visual animation exists.
- Run Hyperframes lint and validate before render.
