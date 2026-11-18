import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, Scale, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import {
  ACTIVITY_OPTIONS,
  DIETARY_OPTIONS,
  FEET_OPTIONS,
  GOAL_OPTIONS,
  INCH_OPTIONS,
  SEX_OPTIONS,
} from '@/lib/options';
import PageHeader from '@/components/PageHeader';
import SelectField from '@/components/SelectField';
import GeneratingCard from '@/components/GeneratingCard';

const EMPTY = {
  age: '',
  gender: '',
  weight: '',
  heightFeet: '',
  heightInches: '',
  activityLevel: '',
  dietaryRestrictions: '',
  dietaryRestrictionsOther: '',
  healthGoals: '',
  healthGoalsOther: '',
};

export default function Suggestions({ result, setResult }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (name) => (value) => setForm((f) => ({ ...f, [name]: value }));
  const onInput = (e) => set(e.target.name)(e.target.value);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api('/getSuggestions', {
        method: 'POST',
        body: {
          ...form,
          dietaryRestrictions:
            form.dietaryRestrictions === 'Other' ? form.dietaryRestrictionsOther : form.dietaryRestrictions,
          healthGoals: form.healthGoals === 'Other' ? form.healthGoalsOther : form.healthGoals,
        },
      });
      setResult(data.suggestions);
      if (window.innerWidth < 1024) {
        requestAnimationFrame(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }));
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Weight suggestions"
        description="Tell us a bit about yourself and get a personalized calorie target and plan."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <form onSubmit={handleSubmit} className="card card-border h-fit bg-base-100 lg:col-span-5 xl:col-span-4">
          <div className="card-body gap-0">
            <div className="grid gap-x-4 sm:grid-cols-2">
              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="age">Age</label>
                <input id="age" name="age" type="number" min="13" max="120" className="input w-full" value={form.age} onChange={onInput} required />
              </fieldset>
              <SelectField id="gender" label="Sex" value={form.gender} onChange={set('gender')} options={SEX_OPTIONS} />

              <fieldset className="fieldset">
                <label className="fieldset-legend" htmlFor="weight">Weight</label>
                <label className="input w-full">
                  <input id="weight" name="weight" type="number" min="50" max="1000" value={form.weight} onChange={onInput} required />
                  <span className="label">lb</span>
                </label>
              </fieldset>
              <div className="grid grid-cols-2 gap-2">
                <SelectField id="heightFeet" label="Height" placeholder="ft" value={form.heightFeet} onChange={set('heightFeet')} options={FEET_OPTIONS} />
                <SelectField id="heightInches" label={<span className="invisible">in</span>} placeholder="in" value={form.heightInches} onChange={set('heightInches')} options={INCH_OPTIONS} />
              </div>
            </div>

            <SelectField id="activityLevel" label="Activity level" value={form.activityLevel} onChange={set('activityLevel')} options={ACTIVITY_OPTIONS} />

            <div className="grid gap-x-4 sm:grid-cols-2">
              <div>
                <SelectField id="dietaryRestrictions" label="Dietary restrictions" value={form.dietaryRestrictions} onChange={set('dietaryRestrictions')} options={DIETARY_OPTIONS} />
                {form.dietaryRestrictions === 'Other' && (
                  <input name="dietaryRestrictionsOther" className="input mt-1 w-full" placeholder="e.g. nut allergy" aria-label="Other dietary restrictions" value={form.dietaryRestrictionsOther} onChange={onInput} maxLength={120} required />
                )}
              </div>
              <div>
                <SelectField id="healthGoals" label="Goal" value={form.healthGoals} onChange={set('healthGoals')} options={GOAL_OPTIONS} />
                {form.healthGoals === 'Other' && (
                  <input name="healthGoalsOther" className="input mt-1 w-full" placeholder="Describe your goal" aria-label="Other goal" value={form.healthGoalsOther} onChange={onInput} maxLength={120} required />
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-6 w-full" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : <Sparkles className="size-4" />}
              {loading ? 'Generating…' : 'Get suggestions'}
            </button>
          </div>
        </form>

        <div id="results" className="scroll-mt-20 lg:col-span-7 xl:col-span-8">
          {loading ? (
            <GeneratingCard message="Crunching the numbers. This usually takes 5–15 seconds." />
          ) : result ? (
            <SuggestionsResult
              result={result}
              onPlanMeals={() =>
                navigate('/meal-plan-generator', {
                  state: { dailyCals: `${result.calorieTarget.min}-${result.calorieTarget.max}` },
                })
              }
            />
          ) : (
            <div className="hidden h-full min-h-80 flex-col items-center justify-center rounded-box border border-dashed border-base-300 p-10 text-center lg:flex">
              <Scale className="size-10 text-base-content/30" />
              <p className="mt-3 font-semibold">Your plan will appear here</p>
              <p className="mt-1 text-sm text-base-content/60">Fill in the form and select Get suggestions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SuggestionsResult({ result, onPlanMeals }) {
  const { calorieTarget, proteinTargetGrams, summary, adviceMarkdown } = result;
  const fmt = (n) => n.toLocaleString();

  return (
    <div className="card card-border bg-base-100">
      <div className="card-body gap-5">
        <div>
          <h2 className="card-title text-xl">Your personalized plan</h2>
          <p className="mt-1 text-base-content/70">{summary}</p>
        </div>

        <div className="stats stats-vertical w-full border border-base-300 sm:stats-horizontal">
          <div className="stat">
            <div className="stat-title">Daily calories</div>
            <div className="stat-value text-primary tabular-nums">
              {fmt(calorieTarget.min)}–{fmt(calorieTarget.max)}
            </div>
            <div className="stat-desc">kcal per day</div>
          </div>
          <div className="stat">
            <div className="stat-title">Daily protein</div>
            <div className="stat-value tabular-nums">{proteinTargetGrams}g</div>
            <div className="stat-desc">grams per day</div>
          </div>
        </div>

        <div className="markdown max-w-none">
          <ReactMarkdown>{adviceMarkdown}</ReactMarkdown>
        </div>

        <div className="card-actions items-center justify-between border-t border-base-300 pt-4">
          <span className="text-sm text-base-content/70">Ready to eat at this target?</span>
          <button className="btn btn-primary" onClick={onPlanMeals}>
            Build meal plans <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
