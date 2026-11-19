import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { planTotals } from '@/lib/plan';
import { Dot, PlanRoute, Station } from '@/components/route';
import { Button, Spinner } from '@/components/ui/button';
import { ConfirmDialog, Dialog } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export default function SavedMealPlans() {
  const [plans, setPlans] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [emailing, setEmailing] = useState(false);

  useEffect(() => {
    api('/savedMealPlans')
      .then((d) => setPlans(d.mealPlans))
      .catch((err) => {
        toast.error(err.message);
        setPlans([]);
      });
  }, []);

  async function confirmDelete() {
    const plan = deleting;
    try {
      await api(`/mealPlans/${plan._id}`, { method: 'DELETE' });
      setPlans((ps) => ps.filter((p) => p._id !== plan._id));
      toast.success('Plan deleted.');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function emailPlan(plan) {
    setEmailing(true);
    try {
      const d = await api(`/mealPlans/${plan._id}/export`, { method: 'POST' });
      toast.success(d.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEmailing(false);
    }
  }

  if (plans === null) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-label="Loading saved plans">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-panel bg-well" />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-panel border-2 border-dashed border-rule px-6 py-16 text-center">
        <div className="flex items-center" aria-hidden="true">
          <Station />
          <span className="h-1 w-16 rounded-full bg-rule" />
          <Station tone="stop" />
        </div>
        <p className="mt-5 text-lg font-bold">No saved plans yet</p>
        <p className="mt-1 max-w-sm text-muted">Map a few days in the meal planner and save the ones that fit your week.</p>
        <Button asChild className="mt-6">
          <Link to="/meal-plan-generator">Open the meal planner</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {plans.map((plan, i) => {
          const totals = planTotals(plan);
          return (
            <li key={plan._id} className="animate-rise flex flex-col rounded-panel bg-panel p-6 shadow-panel" style={{ animationDelay: `${i * 50}ms` }}>
              <h3 className="text-lg leading-snug font-bold">{plan.focus || 'Meal plan'}</h3>
              <p className="mt-1 text-sm text-muted">{plan.stapleFoods}</p>
              <p className="tnum mt-3 font-semibold">
                {totals.calories.toLocaleString()} kcal <span className="font-normal text-muted"><Dot />{totals.protein}g protein</span>
              </p>
              <div className="mt-3 flex items-center gap-1" aria-label={`${plan.meals.length} meals`}>
                {plan.meals.map((m, j) => (
                  <span key={j} className="flex items-center gap-1">
                    {j > 0 && <span className="h-1 w-5 rounded-full bg-route" />}
                    <Station size="sm" tone={j === plan.meals.length - 1 ? 'stop' : 'ink'} />
                  </span>
                ))}
              </div>
              {plan.createdAt && <p className="mt-3 text-xs text-muted">Saved {formatDate(plan.createdAt)}</p>}
              <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                <Button variant="outline" size="sm" onClick={() => setViewing(plan)}>
                  View plan
                </Button>
                <Button variant="danger-ghost" size="sm" onClick={() => setDeleting(plan)} aria-label={`Delete ${plan.focus || 'meal plan'}`}>
                  <Trash2 /> Delete
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(o) => !o && setViewing(null)}
        title={viewing?.focus || 'Meal plan'}
        description={viewing && `${viewing.stapleFoods}, ${planTotals(viewing).calories.toLocaleString()} kcal`}
        footer={
          viewing && (
            <Button variant="outline" onClick={() => emailPlan(viewing)} disabled={emailing}>
              {emailing ? <Spinner /> : <Mail />}
              Email it to me
            </Button>
          )
        }
      >
        {viewing && <PlanRoute plan={viewing} defaultOpen />}
        {viewing?.recipes?.length > 0 && (
          <div className="mt-6 border-t border-rule pt-4">
            <p className="text-sm font-semibold text-muted">Dinner recipe ideas</p>
            <ul className="mt-1.5 space-y-1">
              {viewing.recipes.map((r) => (
                <li key={r.title}>
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-route-ink underline">
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this plan?"
        description={`"${deleting?.focus}" will be removed from your account. This can't be undone.`}
        confirmLabel="Delete plan"
        onConfirm={confirmDelete}
      />
    </>
  );
}
