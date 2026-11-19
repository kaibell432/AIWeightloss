---
name: Weight Loss App
description: Calm wayfinding for a day of eating. Meals are stops on one clear line.
colors:
  ground: "#fafaf7"
  panel: "#ffffff"
  well: "#f1f4f2"
  rule: "#e3e8e5"
  ink: "#1c2321"
  muted: "#56605c"
  route: "#2f9e6e"
  route-ink: "#1f7a52"
  route-soft: "#e3f3eb"
  stop: "#f2a33a"
  over: "#c2410c"
  over-soft: "#fdebe2"
  under: "#4f6f94"
  under-soft: "#e6edf5"
  danger: "#b42318"
  danger-soft: "#fdecea"
typography:
  display:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  control:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  figure:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "\"tnum\""
rounded:
  item: "0.75rem"
  field: "0.875rem"
  menu: "1rem"
  panel: "1.5rem"
  full: "9999px"
spacing:
  gutter-sm: "1rem"
  gutter-md: "1.5rem"
  gutter-lg: "2.5rem"
  gutter-xl: "4rem"
  panel: "1.5rem"
  panel-lg: "2rem"
  section: "5rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.panel}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#2c3633"
  button-route:
    backgroundColor: "{colors.route}"
    textColor: "{colors.panel}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-route-hover:
    backgroundColor: "#278a5f"
  button-outline:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.well}"
  button-ghost:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0 16px"
    height: "36px"
  button-ghost-hover:
    backgroundColor: "{colors.well}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.panel}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  button-danger-hover:
    backgroundColor: "#9a1d14"
  input:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.field}"
    padding: "0 16px"
    height: "48px"
  input-focus:
    backgroundColor: "{colors.panel}"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  goal-label-on-target:
    backgroundColor: "{colors.route-soft}"
    textColor: "{colors.route-ink}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  goal-label-over:
    backgroundColor: "{colors.over-soft}"
    textColor: "{colors.over}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  goal-label-under:
    backgroundColor: "{colors.under-soft}"
    textColor: "{colors.under}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.control}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
  nav-link-active:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
  station:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.full}"
    size: "20px"
  station-destination:
    backgroundColor: "{colors.stop}"
    rounded: "{rounded.full}"
    size: "20px"
---

# Design System: Weight Loss App

## Overview

**Creative North Star: "The Daily Line"**

A day of eating drawn as a transit line. Meals are stations on one green route, so a person always sees where they are and what comes next. Every surface is built from one mark, the station: a white dot with a thick near-black ring, joined to the next by a rounded green stroke. The destination stop is filled amber. The rest of the system stays out of the way: a warm off-white ground, white rounded panels, near-black type, plain literal labels.

The world is calm and light by decision. It is used in short daylight sessions at a desk or kitchen counter, so there is no dark theme and no atmospheric effects. Density is low and generous: large rounded panels, 48px fields, pill buttons. Two inks carry everything at rest (ink and muted on ground and panel); colour appears only when it means something, and every coloured state is also written in words.

Motion follows the line. Routes draw themselves in, stops settle into place, and while the AI works a marker travels the track with an elapsed-seconds count. Every animation starts from a visible resting state, and reduced motion shows the drawn result.

**Key Characteristics:**
- One mark, the ringed station dot, reused at every scale from the logo to the hero map.
- Two inks at rest; green, orange, blue and amber appear only as state.
- Rounded everything: pill controls, 14px fields, 24px panels, round caps and joins on every line.
- Single variable sans (Overpass) at bold weights for headings, tabular figures for every number.
- Soft, low ambient shadows lift panels off the ground; no borders around panels.
- Light only.

## Colors

A near-neutral warm-green paper palette with one route green and three state accents, each paired with a soft tint.

### Primary
- **Route Green** (`route`): the line itself. Route strokes, the progress track tint, the selected-option check, the caret, the focus ring (55% mix), the "Plan meals" route button. Means "on the line" or "on target".
- **Route Ink** (`route-ink`): green as text on light grounds, where Route Green fails contrast (4.9:1). Inline links, "Show portions", the On target label, toast actions.
- **Route Mist** (`route-soft`): hover fill for green text controls, On target chip ground, text selection.

### Secondary
- **Destination Amber** (`stop`): fill of the last or active station only. The Dinner stop, the upper end of a target range, the travelling progress marker, the logo's right station. Never text, never a fill for panels or buttons.

### Tertiary
- **Over Orange** (`over`, tint `over-soft`): a plan above the goal by more than 5%. Recolours that plan's route line and its chip.
- **Under Slate Blue** (`under`, tint `under-soft`): a plan below the goal. Same role as Over; also the info toast icon.
- **Danger Red** (`danger`, tint `danger-soft`): destructive actions and field errors only.

### Neutral
- **Ground** (`ground`): the page, behind everything, including the frosted sticky header (85% with blur).
- **Panel White** (`panel`): raised surfaces (forms, plan cards, dialogs, menus, toasts) and the hollow centre of a station.
- **Well** (`well`): input fills, quiet note boxes, active nav pill, tab track, ghost and menu hover.
- **Rule** (`rule`): hairlines, footer and section dividers, the unbuilt part of a track, outline-button ring.
- **Ink** (`ink`): all primary text, station rings, the primary button.
- **Muted** (`muted`): secondary text, hints, figures' units (5.9:1 on ground).

### Named Rules
**The Two Inks Rule.** At rest a screen is ink and muted on ground and panel. Colour is spent only on the route and on state; if a coloured element doesn't mean something, it goes back to ink.

**The Colour Plus Words Rule.** No state is carried by colour alone. Over and under plans recolour their line and also carry an "Over goal" or "Under goal" label; success and error toasts carry an icon and a sentence.

**The One Amber Rule.** Amber marks the destination: one stop per line. A second amber element on the same route means the line has two ends.

## Typography

**Display Font:** Overpass Variable (with ui-sans-serif, system-ui)
**Body Font:** Overpass Variable
**Label/Mono Font:** none distinct; numbers use the same face with tabular figures

**Character:** Overpass descends from highway signage, which is the point: it reads as wayfinding. One family, weight does the hierarchy (400 body, 600 controls and labels, 700 headings).

### Hierarchy
- **Display** (700, 2.6rem mobile to 3.75rem from 640px, line-height 1.04, -0.03em): the landing headline only.
- **Headline** (700, 1.875rem; page titles step to 2.25rem from 640px; -0.025em): page titles and section headings. Result headings ("Your seven days", "Your plan") use 1.5rem.
- **Title** (700, 1.25rem; card titles 1.125rem with snug leading): dialog titles, step titles, plan card titles, advice section headings.
- **Lead** (400, 1.125rem, muted): one line of subcopy under a headline, max about 42rem.
- **Body** (400, 1rem, 1.5): running text; AI advice at 1.65 leading capped at 70ch.
- **Control** (600, 0.95rem): buttons, nav links, menu items, field text.
- **Label** (600, 0.875rem): field labels (ink), meal-type names and small captions (muted). Sentence case, no tracking.
- **Figure** (700, 1.875rem, tabular): headline numbers such as calorie ranges and protein grams, with the unit in muted 600 at a smaller size.

### Named Rules
**The Tabular Figures Rule.** Every calorie, gram and second count uses tabular numerals so stops line up down a route.

**The Plain Label Rule.** Labels are sentence case and literal ("Daily calorie goal", "Show portions"). No uppercase tracked labels, no eyebrows above headings.

## Layout

Full viewport width. Pages use a fluid gutter rather than a centred max-width container: 1rem side padding, 1.5rem from 640px, 2.5rem from 1024px, 4rem from 1536px. Readable measure is enforced on text blocks instead (lead about 42rem, advice 70ch).

The landing first viewport is a two-column grid from 1024px: a left column up to 30rem holding headline, lead and the working form, and the route map filling the rest. Below 1024px the map is replaced by a vertical route list in a panel. Plan cards sit in a grid of one, two (768px) and three (1536px) columns, aligned to the top. Forms stack on the landing page and become a single row of fields with the button on the planner page at 1024px.

Rhythm: sections separated by 5rem with a hairline rule; panel padding 1.5rem, 2rem from 640px (2.5rem on the landing target panel); 16px between fields; stops spaced 24px (16px compact).

## Elevation & Depth

A light hybrid: surfaces are separated by tone (ground, white panel, well) and lifted by two soft ambient shadows. Panels never carry a border; floating layers (menus, toasts, select lists) add a 1px rule ring on top of the stronger shadow.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 1px 0 rgb(28 35 33 / 0.04), 0 18px 40px -24px rgb(28 35 33 / 0.28)`): every resting panel (forms, plan cards, result card, progress card) and the active tab.
- **Pop** (`box-shadow: 0 2px 4px rgb(28 35 33 / 0.06), 0 24px 48px -16px rgb(28 35 33 / 0.3)`): things above the page: dialogs, dropdown menus, select lists, toasts.

### Named Rules
**The Soft Lift Rule.** Depth is ambient and diffuse, tinted with ink, never a hard offset. Two levels only: resting panel and floating layer.

## Shapes

Rounded everywhere, with radius growing with surface size: menu items 12px, fields 14px, menus and toasts and note boxes 16px, panels and dialogs 24px. Every control a person presses is a full pill (buttons, nav links, tabs, chips, close and dismiss buttons).

Lines are the recurring geometry. Route strokes have round caps and round joins; corners on the hero path turn through 60-unit arcs, never sharp angles. Vertical route segments are 4px rounded bars, horizontal tracks 4 to 6px. A segment runs from one station to the next and stops; the last station has no line leaving it.

The station is a circle with a thick ring: 16px with a 3.5px ring, 20px with 4.5px, 24px with 5px; on the hero map, radius 18 (22 for the destination) with a 7px stroke.

## Components

### Buttons
Confident, fully round, ink-led.
- **Shape:** pill (9999px).
- **Primary:** ink fill, white control type. Sizes 36px (16px padding, 0.875rem), 44px (20px, 0.95rem), 52px (28px, 1rem). Used for the main action on every screen ("Map my day", "Sign up").
- **Route:** green fill, white text; reserved for continuing along the line (planning meals from a suggestions result).
- **Outline:** white with an inset rule ring; hover darkens the ring and fills well. Secondary entry points and Save.
- **Ghost / Danger / Danger-ghost:** text-only with a well (or danger tint) hover; danger fills red for confirmed deletes only.
- **Hover / Focus / Active:** 200ms colour and shadow transition on the expo ease, a 0.98 press scale, the global focus ring (3px route green at 55%, 2px offset). Disabled at 45% opacity.

### Chips (Goal labels)
- **Style:** pill, 12px bold, a 6px dot in currentColor before the words, state tint ground with state ink text.
- **State:** On target (route mist / route ink), Over goal (orange), Under goal (blue). Always the words, never the dot alone.

### Cards / Containers
- **Corner Style:** 24px.
- **Background:** panel white on ground.
- **Shadow Strategy:** Panel shadow at rest (see Elevation).
- **Border:** none; internal dividers are rule hairlines (card footers, portion rows).
- **Internal Padding:** 24px, 32px on wider screens. Quiet notes use a well box at 16px radius with no shadow.

### Inputs / Fields
- **Style:** 48px tall, well fill, 14px radius, no visible stroke at rest; hover shows a 1px rule ring. Label above in ink label type, hint below in muted.
- **Focus:** fill turns panel white and a 2px route-green ring appears.
- **Error / Disabled:** error replaces the hint with a danger sentence; disabled text goes muted.
- **Select:** same trigger as an input; the list is a floating panel (16px radius, pop shadow, rule ring) with 12px-radius items, well highlight and a green check on the chosen item.

### Navigation
- **Style:** sticky 64px header on frosted ground (85%, blur), hairline rule beneath. Logo mark and wordmark left, plain links right.
- **States:** links are muted control type in a pill; hover goes ink; active gets a well pill and ink text. A 1px rule separates page links from account links; Sign up is a small primary button.
- **Mobile:** below 768px the links collapse into a ghost icon button opening a pop-shadow menu panel.

### Tabs
- **Style:** pill track in well with 4px inset; triggers are muted pills that become white with the Panel shadow and ink text when active.

### Station and Route (signature)
The world's one mark and its line.
- **Station:** white centre, thick ink ring; the destination variant fills amber; a route-ring variant marks a target figure.
- **Route list:** a vertical ordered list where each item has a station and a 4px rounded segment down to the next station. The segment colour carries plan state (green on target, orange over, blue under). Items rise in with 110ms stagger while segments grow from the top.
- **Plan route:** a meal plan rendered as a route list ordered Breakfast, Lunch, Snack, Dinner, last meal as destination; portions fold away under a "Show portions" pill.
- **Hero route map:** one 16px green stroke with rounded arcs and four labelled stops; drawn once on mount over 1100ms (expo ease) via the Web Animations API, so its resting CSS state is the drawn line.
- **Target scale:** a 6px rule track with the target range as a green segment between an ink station (low) and an amber station (high), with floor and ceiling figures beneath.
- **Travel progress:** while the AI works, a panel with the status sentence, an elapsed-seconds count, and an amber station travelling a tinted track (2.4s, ease-in-out). Reduced motion parks it at the centre.
- **Advice route:** AI-written advice sections hang off a 4px green line; each section heading is a station.

### Dialogs and Toasts
- **Dialog:** ink scrim at 35% fading in, a 24px-radius panel with Pop shadow, title in Title type, ghost icon close; confirm dialogs pair a ghost Cancel with a danger action.
- **Toast:** bottom-centre floating panel, 16px radius, pop shadow, rule ring, a state icon (green check, red alert, blue info) beside the sentence, optional route-ink action pill.

## Do's and Don'ts

### Do:
- **Do** build new visuals from the station and the line: ringed dots joined by rounded green strokes, last stop amber.
- **Do** keep screens to two inks at rest and spend colour only on state, always with words beside it.
- **Do** use pill shapes for every pressable control and 24px radius for panels.
- **Do** set every number in tabular figures and put units in muted type.
- **Do** start motion from a visible resting state: draw routes and rise stops over 300 to 1100ms on cubic-bezier(0.16, 1, 0.3, 1), and show the drawn result under reduced motion.
- **Do** end each route segment at its last station.
- **Do** write plain, literal, sentence-case labels.

### Don't:
- **Don't** add eyebrows or uppercase tracked labels above headings.
- **Don't** use Route Green as body text on light grounds; use Route Ink.
- **Don't** use amber for anything but the destination or active stop.
- **Don't** show a state by colour alone.
- **Don't** put borders around panels or use hard offset shadows; lift with the two ambient shadows.
- **Don't** introduce a dark theme or a second typeface.
- **Don't** let an animation start from an empty or invisible state that a capture or restored page could freeze on.
