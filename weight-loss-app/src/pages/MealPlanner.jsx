import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Check, Info, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import { DIETARY_OPTIONS } from '@/lib/options';
import PageHeader from '@/components/PageHeader';
import SelectField from '@/components/SelectField';
import GeneratingCard from '@/components/GeneratingCard';
import MealPlanView, { GoalBadge, goalStatus, parseCalorieGoal, planTotals } from '@/components/MealPlanView';

export default function MealPlanner({ result, setResult, isAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dailyCals: location.state?.dailyCals || '',
    stapleFood1: '',
    stapleFood2: '',
    stapleFood3: '',
    dietaryRestrictions: '',
    dietaryRestrictionsOther: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState({}); // mealPlanNumber -> 'saving' | 'saved'

  const onInput = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api('/getMealPlan', {
        method: 'POST',
        body: {
          ...form,
          dietaryRestrictions:
            form.dietaryRestrictions === 'Other' ? form.dietaryRestrictionsOther : form.dietaryRestrictions,
        },
      });
      setResult({ ...data.mealPlanData, goal: parseCalorieGoal(form.dailyCals) });
      setSaved({});
      requestAnimationFrame(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(plan) {
    if (!isAuthenticated) {
      toast('Log in to save meal plans', {
        action: { label: 'Log in', onClick: () => navigate('/login', { state: { from: '/meal-plan-generator' } }) },
      });
      return;
    }
    setSaved((s) => ({ ...s, [plan.mealPlanNumber]: 'saving' }));
    try {
      await api('/saveMealPlan', { method: 'POST', body: { mealPlan: { ...plan, notes: result.notes } } });
      setSaved((s) => ({ ...s, [plan.mealPlanNumber]: 'saved' }));
      toast.success('Saved to your account', {
        action: { label: 'View', onClick: () => navigate('/account?tab=saved') },
      });
    } catch (err) {
      setSaved((s) => ({ ...s, [plan.mealPlanNumber]: undefined }));
      toast.error(err.message);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Meal planner"
        description="Choose up to three staple foods and get seven different day plans that hit your calorie goal."
      />

      <form onSubmit={handleSubmit} className="card card-border bg-base-100">
        <div className="card-body">
          <div className="grid gap-x-4 md:grid-cols-2 xl:grid-cols-12">
            <fieldset className="fieldset xl:col-span-3">
              <label className="fieldset-legend" htmlFor="dailyCals">Daily calorie goal</label>
              <input
                id="dailyCals"
                name="dailyCals"
                className="input w-full"
                placeholder="e.g. 1800 or 1800-2000"
                value={form.dailyCals}
                onChange={onInput}
                pattern=".*\d{3,5}.*"
                maxLength={30}
                required
              />
              <p className="label">
                Not sure?{' '}
                <Link to="/weight-suggestions" className="link link-primary">
                  Get a personalized target
                </Link>
              </p>
            </fieldset>

            <fieldset className="fieldset md:col-span-2 xl:col-span-6">
              <label className="fieldset-legend" htmlFor="stapleFood1">Staple foods (up to 3)</label>
              <div className="grid gap-2 sm:grid-cols-3">
                <input id="stapleFood1" name="stapleFood1" className="input w-full" placeholder="e.g. chicken" value={form.stapleFood1} onChange={onInput} maxLength={60} required />
                <input name="stapleFood2" className="input w-full" aria-label="Staple food 2" placeholder="optional" value={form.stapleFood2} onChange={onInput} maxLength={60} />
                <input name="stapleFood3" className="input w-full" aria-label="Staple food 3" placeholder="optional" value={form.stapleFood3} onChange={onInput} maxLength={60} />
              </div>
            </fieldset>

            <div className="md:col-start-2 md:row-start-1 xl:col-span-3 xl:col-start-auto xl:row-start-auto">
              <SelectField
                id="dietaryRestrictions"
                label="Dietary restrictions"
                value={form.dietaryRestrictions}
                onChange={(v) => setForm((f) => ({ ...f, dietaryRestrictions: v }))}
                options={DIETARY_OPTIONS}
              />
              {form.dietaryRestrictions === 'Other' && (
                <input
                  name="dietaryRestrictionsOther"
                  className="input mt-1 w-full"
                  placeholder="e.g. nut allergy"
                  aria-label="Other dietary restrictions"
                  value={form.dietaryRestrictionsOther}
                  onChange={onInput}
                  maxLength={120}
                  required
                />
              )}
            </div>
          </div>

          <div className="card-actions mt-2">
            <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : <Sparkles className="size-4" />}
              {loading ? 'Generating…' : 'Generate meal plans'}
            </button>
          </div>
        </div>
      </form>

      <div id="results" className="scroll-mt-20">
        {loading && <GeneratingCard className="mt-6" message="Building 7 meal plans. This can take 15–60 seconds." />}
        {!loading && result && <Results result={result} saved={saved} onSave={handleSave} />}
      </div>
    </div>
  );
}

function Results({ result, saved, onSave }) {
  const { mealPlans, stapleFoodConcerns, varietyInStapleFoods, notes, goal } = result;

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold">Your meal plans</h2>

      {(stapleFoodConcerns || varietyInStapleFoods) && (
        <div role="alert" className="alert alert-info alert-soft items-start">
          <Info className="size-5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">About your staple foods</p>
            {stapleFoodConcerns && <p>{stapleFoodConcerns}</p>}
            {varietyInStapleFoods && <p>{varietyInStapleFoods}</p>}
          </div>
        </div>
      )}

      <div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {mealPlans.map((plan) => {
          const totals = planTotals(plan);
          const state = saved[plan.mealPlanNumber];
          return (
            <div key={plan.mealPlanNumber} className="card card-border bg-base-100">
              <div className="card-body">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="card-title">
                    {plan.mealPlanNumber}. {plan.focus}
                  </h3>
                  <GoalBadge status={goalStatus(totals.calories, goal)} />
                </div>
                <p className="text-sm tabular-nums text-base-content/70">
                  {totals.calories.toLocaleString()} kcal · {totals.protein}g protein
                </p>
                <div className="mt-2">
                  <MealPlanView plan={plan} />
                </div>
                <div className="card-actions mt-3 justify-end">
                  <button
                    className={`btn btn-sm ${state === 'saved' ? 'btn-success btn-soft' : 'btn-primary btn-outline'}`}
                    disabled={Boolean(state)}
                    onClick={() => onSave(plan)}
                  >
                    {state === 'saving' ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : state === 'saved' ? (
                      <Check className="size-4" />
                    ) : (
                      <Bookmark className="size-4" />
                    )}
                    {state === 'saved' ? 'Saved' : 'Save plan'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {notes && <p className="text-xs text-base-content/60">{notes}</p>}
    </div>
  );
}
