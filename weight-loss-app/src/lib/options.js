export const DIETARY_OPTIONS = [
  { value: 'No restrictions', label: 'No restrictions' },
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Pescatarian', label: 'Pescatarian' },
  { value: 'Gluten-free', label: 'Gluten-free' },
  { value: 'Dairy-free', label: 'Dairy-free' },
  { value: 'Other', label: 'Other…' },
];

export const SEX_OPTIONS = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Other', label: 'Other / prefer not to say' },
];

export const ACTIVITY_OPTIONS = [
  { value: 'Sedentary (little or no exercise)', label: 'Sedentary: little or no exercise' },
  { value: 'Light (1-2 days/week)', label: 'Light: 1–2 days a week' },
  { value: 'Moderate (3-4 days/week)', label: 'Moderate: 3–4 days a week' },
  { value: 'Very active (5+ days/week)', label: 'Very active: 5+ days a week' },
  { value: 'Has a condition that limits exercise', label: 'I have a condition that limits exercise' },
];

export const GOAL_OPTIONS = [
  { value: 'Lose fat', label: 'Lose fat' },
  { value: 'Build muscle', label: 'Build muscle' },
  { value: 'Lose fat and build muscle (recomposition)', label: 'Lose fat and build muscle' },
  { value: 'Maintain weight', label: 'Maintain my weight' },
  { value: 'Other', label: 'Other…' },
];

export const FEET_OPTIONS = [4, 5, 6, 7].map((n) => ({ value: String(n), label: `${n} ft` }));
export const INCH_OPTIONS = Array.from({ length: 12 }, (_, n) => ({ value: String(n), label: `${n} in` }));
