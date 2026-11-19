# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primarily a **portfolio piece**: the audience that matters most is employers and clients judging the
developer's skill through a working, deployed product. Secondary audience: anyone who wants help
reaching a weight goal (losing fat, building muscle, or maintaining) without the effort of a tracker.

## Product Purpose

An AI-powered helper that turns a few facts about a person into a practical plan:

- **Weight suggestions:** from age, sex, height, weight, activity level, dietary restrictions and goal,
  produce a daily calorie range, a protein target, and personalized advice.
- **Meal planner:** from a calorie goal, up to three staple foods and dietary restrictions, produce seven
  different one-day meal plans with calories and protein for every item, plus dinner recipe ideas.
- **Saved plans:** with an optional account, save meal plans, view them later, delete them, or email them.

Success: a visitor gets a useful, specific plan in under a minute, and a reviewer of the portfolio sees a
polished, well-engineered product.

## Positioning

The anti-tracker. Unlike MyFitnessPal-style apps, it asks for no daily food logging. It builds plans around
staple foods the person already eats, speaks in an encouraging, never-shaming voice, and the core features
work without an account (signing up only adds saving).

## Operating Context

- Used in short sessions: fill a form, wait for the AI (about 5–15s for suggestions, 15–60s for meal plans
  when the model is busy), read the result, optionally save it.
- The suggestions result hands its calorie range straight into the meal planner.
- Hosted on Render's free tier, which sleeps when idle; the first visit can take up to a minute to wake.

## Capabilities and Constraints

- **Stack (binding):** React 19 + Vite, **Radix UI** for components, **Tailwind CSS** for styling. Do not use
  daisyUI or shadcn/ui. Lucide icons are currently in use. Express + MongoDB backend, Gemini AI.
- Must stay within free tiers (Render, MongoDB Atlas, Gemini API free quota).
- AI output is advisory, not medical advice; the app always says to consult a healthcare professional.
- Units are US customary (lb, ft/in).
- Nutrition values are AI estimates; recipe links are web searches, not model-invented URLs.
- Email export exists but is disabled until SMTP is configured.
- **Undecided:** the product name. "Weight Loss App" is a placeholder.

## Brand Commitments

- Voice: supportive, encouraging, practical, never shaming about weight or food.
- No committed name, logo, palette or typography yet.

## Evidence on Hand

- No real testimonials, user counts, reviews, or press. Future work must not fabricate any.
- The old placeholder testimonials ("This app helped me lose ___") were removed deliberately.

## Product Principles

1. **Useful in one sitting.** A visitor gets a concrete plan without signing up or logging anything.
2. **Meet people where they eat.** Plans start from foods the person already likes.
3. **Kind and honest.** Encouraging tone, clear caveats about AI estimates and medical advice.
4. **Show the craft.** As a portfolio piece, every screen should read as deliberate, polished engineering.
