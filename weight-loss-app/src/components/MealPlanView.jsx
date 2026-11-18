import { ExternalLink } from 'lucide-react';

const sumProtein = (items) => items.reduce((s, i) => s + (Number(i.protein) || 0), 0);

// Parses "1800", "1800-2000", "1,800 to 2,000" into { min, max }.
export function parseCalorieGoal(text = '') {
  const nums = (String(text).replace(/,/g, '').match(/\d{3,5}/g) || []).map(Number);
  if (!nums.length) return null;
  return { min: Math.min(...nums), max: Math.max(...nums) };
}

export function planTotals(plan) {
  const calories = plan.totalCalories ?? plan.meals.reduce((s, m) => s + (Number(m.calories) || 0), 0);
  const protein = plan.totalProtein ?? plan.meals.reduce((s, m) => s + (m.protein ?? sumProtein(m.items)), 0);
  return { calories, protein };
}

// Within 5% of the goal range counts as on target.
export function goalStatus(calories, goal) {
  if (!goal) return null;
  if (calories > goal.max * 1.05) return 'over';
  if (calories < goal.min * 0.95) return 'under';
  return 'ok';
}

export function GoalBadge({ status }) {
  if (status === 'over') return <span className="badge badge-error badge-soft">Over goal</span>;
  if (status === 'under') return <span className="badge badge-warning badge-soft">Under goal</span>;
  if (status === 'ok') return <span className="badge badge-success badge-soft">On target</span>;
  return null;
}

export default function MealPlanView({ plan }) {
  return (
    <div className="space-y-4">
      {plan.meals.map((meal, i) => {
        const protein = meal.protein ?? sumProtein(meal.items);
        return (
          <section key={i}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h4 className="font-semibold">
                <span className="text-base-content/60">{meal.mealType}:</span> {meal.mealName}
              </h4>
              <span className="text-sm tabular-nums text-base-content/60">
                {meal.calories} kcal · {protein}g protein
              </span>
            </div>
            <ul className="list mt-1 rounded-box bg-base-200/60 text-sm">
              {meal.items.map((item, j) => (
                <li key={j} className="list-row py-2">
                  <span className="list-col-grow">{item.item}</span>
                  <span className="tabular-nums text-base-content/60">
                    {item.calories} kcal · {item.protein}g
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {plan.recipes?.length > 0 && (
        <section>
          <div className="divider my-1" />
          <h4 className="text-sm font-semibold">Dinner recipe ideas</h4>
          <ul className="mt-1 space-y-1 text-sm">
            {plan.recipes.map((r) => (
              <li key={r.title}>
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-primary inline-flex items-center gap-1"
                >
                  {r.title} <ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
