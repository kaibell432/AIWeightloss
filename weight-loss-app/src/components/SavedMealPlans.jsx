import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Salad, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import Modal from '@/components/Modal';
import MealPlanView, { planTotals } from '@/components/MealPlanView';

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
    setDeleting(null);
    try {
      await api(`/mealPlans/${plan._id}`, { method: 'DELETE' });
      setPlans((ps) => ps.filter((p) => p._id !== plan._id));
      toast.success('Meal plan deleted');
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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-36" />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-box border border-dashed border-base-300 px-6 py-16 text-center">
        <Salad className="size-10 text-base-content/40" />
        <p className="mt-3 font-semibold">No saved meal plans yet</p>
        <p className="mt-1 text-sm text-base-content/70">Generate some plans and save the ones you like.</p>
        <Link to="/meal-plan-generator" className="btn btn-primary mt-5">
          Open meal planner
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {plans.map((plan) => {
          const totals = planTotals(plan);
          return (
            <div key={plan._id} className="card card-border bg-base-100">
              <div className="card-body">
                <h3 className="card-title">{plan.focus || 'Meal plan'}</h3>
                <p className="text-sm text-base-content/70">{plan.stapleFoods}</p>
                <p className="text-sm tabular-nums">
                  {totals.calories.toLocaleString()} kcal · {totals.protein}g protein
                </p>
                {plan.createdAt && <p className="text-xs text-base-content/50">Saved {formatDate(plan.createdAt)}</p>}
                <div className="card-actions mt-2 justify-between">
                  <button className="btn btn-sm btn-primary btn-outline" onClick={() => setViewing(plan)}>
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-ghost text-error"
                    onClick={() => setDeleting(plan)}
                    aria-label={`Delete ${plan.focus || 'meal plan'}`}
                  >
                    <Trash2 className="size-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} className="max-w-3xl">
        {viewing && (
          <>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3"
              onClick={() => setViewing(null)}
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <h3 className="text-lg font-bold">{viewing.focus || 'Meal plan'}</h3>
            <p className="mb-4 text-sm text-base-content/70">Staple foods: {viewing.stapleFoods}</p>
            <MealPlanView plan={viewing} />
            <div className="modal-action">
              <button className="btn btn-outline" onClick={() => emailPlan(viewing)} disabled={emailing}>
                {emailing ? <span className="loading loading-spinner loading-sm" /> : <Mail className="size-4" />}
                Email to me
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)}>
        <h3 className="text-lg font-bold">Delete this meal plan?</h3>
        <p className="py-3 text-base-content/70">
          &ldquo;{deleting?.focus}&rdquo; will be permanently removed from your account.
        </p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => setDeleting(null)}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
