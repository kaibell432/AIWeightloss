import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  if (status === 'over') return <Badge variant="destructive">Over goal</Badge>;
  if (status === 'under') return <Badge variant="secondary">Under goal</Badge>;
  return null;
}

export default function MealPlanView({ plan }) {
  return (
    <div className="space-y-5">
      {plan.meals.map((meal, i) => {
        const protein = meal.protein ?? sumProtein(meal.items);
        return (
          <section key={i}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h4 className="font-medium">
                <span className="text-muted-foreground">{meal.mealType}:</span> {meal.mealName}
              </h4>
              <p className="text-sm tabular-nums text-muted-foreground">
                {meal.calories} kcal · {protein}g protein
              </p>
            </div>
            <ul className="mt-2 divide-y rounded-lg border text-sm">
              {meal.items.map((item, j) => (
                <li key={j} className="flex items-center justify-between gap-4 px-3 py-2">
                  <span>{item.item}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {item.calories} kcal · {item.protein}g
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {plan.recipes?.length > 0 && (
        <>
          <Separator />
          <section>
            <h4 className="text-sm font-medium">Dinner recipe ideas</h4>
            <ul className="mt-2 space-y-1 text-sm">
              {plan.recipes.map((r) => (
                <li key={r.title}>
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                  >
                    {r.title} <ExternalLink className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
