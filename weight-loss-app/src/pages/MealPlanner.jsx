import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Check, Info } from 'lucide-react';
import { api } from '@/lib/api';
import { goalStatus, parseCalorieGoal, planTotals } from '@/lib/plan';
import PageHeader from '@/components/PageHeader';
import PlanForm, { toPlanRequest } from '@/components/PlanForm';
import { Dot, PlanRoute, TravelProgress } from '@/components/route';
import GoalLabel from '@/components/GoalLabel';
import { Button, Spinner } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function MealPlanner({ result, setResult, isAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState({}); // mealPlanNumber -> 'saving' | 'saved'
  const prefill = location.state?.prefill || (location.state?.dailyCals ? { dailyCals: location.state.dailyCals } : undefined);
  const started = useRef(false);

  async function generate(form) {
    setLoading(true);
    try {
      const data = await api('/getMealPlan', { method: 'POST', body: toPlanRequest(form) });
      setResult({ ...data.mealPlanData, goal: parseCalorieGoal(form.dailyCals) });
      setSaved({});
      requestAnimationFrame(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Arriving from the landing form: start right away, once.
  useEffect(() => {
    if (location.state?.autoSubmit && prefill && !started.current) {
      started.current = true;
      navigate('.', { replace: true, state: { prefill } });
      generate(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(plan) {
    if (!isAuthenticated) {
      toast('Log in to save meal plans.', {
        action: { label: 'Log in', onClick: () => navigate('/login', { state: { from: '/meal-plan-generator' } }) },
      });
      return;
    }
    setSaved((s) => ({ ...s, [plan.mealPlanNumber]: 'saving' }));
    try {
      await api('/saveMealPlan', { method: 'POST', body: { mealPlan: { ...plan, notes: result.notes } } });
      setSaved((s) => ({ ...s, [plan.mealPlanNumber]: 'saved' }));
      toast.success('Saved to your account.', { action: { label: 'View', onClick: () => navigate('/account?tab=saved') } });
    } catch (err) {
      setSaved((s) => ({ ...s, [plan.mealPlanNumber]: undefined }));
      toast.error(err.message);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Meal planner"
        description="Seven different days built around the foods you like, each mapped stop by stop."
      />
      <PlanForm layout="row" initial={prefill} onSubmit={generate} loading={loading} />

      <div id="results" className="scroll-mt-24">
        {loading && <TravelProgress className="mt-8" message="Mapping seven days. This can take 15 to 60 seconds." />}
        {!loading && result && <Results result={result} saved={saved} onSave={handleSave} />}
      </div>
    </div>
  );
}

function Results({ result, saved, onSave }) {
  const { mealPlans, stapleFoodConcerns, varietyInStapleFoods, notes, goal } = result;

  return (
    <section className="mt-14" aria-labelledby="plans-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="plans-heading" className="text-2xl font-bold tracking-tight">
          Your seven days
        </h2>
        {goal && (
          <p className="tnum text-muted">
            Goal {goal.min === goal.max ? goal.min.toLocaleString() : `${goal.min.toLocaleString()}–${goal.max.toLocaleString()}`} kcal
            <Dot />
            within 5% counts as on target
          </p>
        )}
      </div>

      {(stapleFoodConcerns || varietyInStapleFoods) && (
        <div className="mt-5 flex gap-3 rounded-2xl bg-well p-4 text-ink sm:p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-muted" />
          <div className="max-w-[75ch] space-y-1.5">
            {stapleFoodConcerns && <p>{stapleFoodConcerns}</p>}
            {varietyInStapleFoods && <p>{varietyInStapleFoods}</p>}
          </div>
        </div>
      )}

      <div className="mt-6 grid items-start gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {mealPlans.map((plan, i) => {
          const totals = planTotals(plan);
          const state = saved[plan.mealPlanNumber];
          return (
            <article
              key={plan.mealPlanNumber}
              className="animate-rise rounded-panel bg-panel p-6 shadow-panel"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <header className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg leading-snug font-bold">
                    Day {plan.mealPlanNumber}: {plan.focus}
                  </h3>
                  <p className="tnum mt-1 text-sm text-muted">
                    {totals.calories.toLocaleString()} kcal<Dot />{totals.protein}g protein
                  </p>
                </div>
                <GoalLabel status={goalStatus(totals.calories, goal)} />
              </header>

              <PlanRoute plan={plan} status={goalStatus(totals.calories, goal)} />

              <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
                {plan.recipes?.[0] ? (
                  <a
                    href={plan.recipes[0].link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-route-ink underline"
                  >
                    Recipe: {plan.recipes[0].title}
                  </a>
                ) : (
                  <span />
                )}
                <Button
                  size="sm"
                  variant={state === 'saved' ? 'ghost' : 'outline'}
                  disabled={Boolean(state)}
                  onClick={() => onSave(plan)}
                  className={state === 'saved' ? 'text-route-ink disabled:opacity-100' : ''}
                >
                  {state === 'saving' ? <Spinner /> : state === 'saved' ? <Check /> : <Bookmark />}
                  {state === 'saved' ? 'Saved' : 'Save'}
                </Button>
              </footer>
            </article>
          );
        })}
      </div>

      {notes && <p className="mt-6 max-w-[75ch] text-sm text-muted">{notes}</p>}
    </section>
  );
}
