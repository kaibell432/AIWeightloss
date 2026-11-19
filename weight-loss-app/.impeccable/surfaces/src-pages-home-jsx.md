---
version: 1
slug: "src-pages-home-jsx"
primary_target: "src/pages/Home.jsx"
related_targets: ["src/pages/Suggestions.jsx","src/pages/MealPlanner.jsx","src/pages/Account.jsx","src/pages/AuthPage.jsx"]
---

# Surface: whole app (landing first)

Scope: landing page (Persuade, primary showcase) plus the app screens it sets the world for: Weight
suggestions, Meal planner, Account/Saved plans, Login/Register (Operate). Stack: React + Radix UI
primitives + Tailwind. Full viewport width layouts.

Audience/job: portfolio reviewers first; people who find weight loss intimidating and want a plan without
logging. Action: generate a plan (the meal planner form works on the landing page itself).
Constraints: clean, easy, not overwhelming; flowing animation; rounded corners; no generic-SaaS look,
no gym-bro energy. No invented testimonials or stats.

## Direction contract

THESIS: Your day is a route. Meals are stops on one clear line, so the visitor always sees where they
are and what comes next. Refuses the category default of a gradient hero over three feature cards.

OWN-WORLD: Warm off-white ground, near-black ink, one route green, one amber for the destination/active
stop, soft gray panels. Rounded everything: pill buttons, 16–28px panel radii, round station dots with
thick rings, route lines with rounded corners and caps. At rest two inks; colour only carries meaning
(on target, over, under, saved). Plain literal labels.

STORY: The visitor understands that a few facts and the foods they like become a mapped day; believes it
because the line shows a real example plan with real calorie stops; acts by filling the form and pressing
Map my day.

FIRST VIEWPORT: Left column: headline "A clear plan for today. No logging." with one line of subcopy, then
a white rounded form panel (calorie goal, foods you like, dietary restrictions, pill button). Right two
thirds: one green route line drawing itself across the page with four stops (Breakfast, Lunch, Snack,
Dinner) and kcal under each; Dinner is the amber destination. Nav: wordmark left, plain links right.

FORM: Transit route map and calm wayfinding, candidate 6 of my ordered list. seed:97c4d3164e09144b.
Raises: lines draw in as content arrives (zine); a marker travels the line while the AI works, with
elapsed time (teletext); two inks at rest, colour only for state (silkscreen); plain literal labels
(industrial quotes). Signature interaction: the route draws itself, and meal plans render as their own
lines with stops. Motion grammar: stroke draw-on and gentle rise, 300–600ms ease-out, reduced motion
shows the drawn state.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
