import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import {
  ACTIVITY_OPTIONS,
  DIETARY_OPTIONS,
  FEET_OPTIONS,
  GOAL_OPTIONS,
  INCH_OPTIONS,
  SEX_OPTIONS,
} from '@/lib/options';
import PageHeader from '@/components/PageHeader';
import { Station, TargetScale, TravelProgress } from '@/components/route';
import { Button, Spinner } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

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

const REQUIRED_SELECTS = {
  gender: 'sex',
  heightFeet: 'height (feet)',
  heightInches: 'height (inches)',
  activityLevel: 'activity level',
  healthGoals: 'goal',
};

export default function Suggestions({ result, setResult }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (name) => (value) => setForm((f) => ({ ...f, [name]: value }));
  const onInput = (e) => set(e.target.name)(e.target.value);

  async function handleSubmit(e) {
    e.preventDefault();
    const missing = Object.entries(REQUIRED_SELECTS).filter(([k]) => !form[k]).map(([, label]) => label);
    if (missing.length) {
      toast.error(`Please choose your ${missing.join(', ')}.`);
      return;
    }
    setLoading(true);
    try {
      const data = await api('/getSuggestions', {
        method: 'POST',
        body: {
          ...form,
          dietaryRestrictions:
            form.dietaryRestrictions === 'Other'
              ? form.dietaryRestrictionsOther
              : form.dietaryRestrictions || 'No restrictions',
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
        description="Seven quick questions. You get a daily calorie range, a protein target, and advice that fits."
      />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,26rem)_1fr] xl:grid-cols-[minmax(0,28rem)_1fr] xl:gap-12">
        <form onSubmit={handleSubmit} className="rounded-panel bg-panel p-5 shadow-panel sm:p-6 lg:sticky lg:top-24">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" htmlFor="age">
              <Input id="age" name="age" type="number" min="13" max="120" inputMode="numeric" value={form.age} onChange={onInput} required />
            </Field>
            <Field label="Sex" htmlFor="gender">
              <Select id="gender" value={form.gender} onValueChange={set('gender')} options={SEX_OPTIONS} />
            </Field>
            <Field label="Weight" htmlFor="weight">
              <Input id="weight" name="weight" type="number" min="50" max="1000" inputMode="numeric" suffix="lb" value={form.weight} onChange={onInput} required />
            </Field>
            <Field label="Height" htmlFor="heightFeet">
              <div className="grid grid-cols-2 gap-2">
                <Select id="heightFeet" value={form.heightFeet} onValueChange={set('heightFeet')} options={FEET_OPTIONS} placeholder="ft" />
                <Select id="heightInches" value={form.heightInches} onValueChange={set('heightInches')} options={INCH_OPTIONS} placeholder="in" />
              </div>
            </Field>
            <Field label="Activity level" htmlFor="activityLevel" className="col-span-2">
              <Select id="activityLevel" value={form.activityLevel} onValueChange={set('activityLevel')} options={ACTIVITY_OPTIONS} />
            </Field>
            <Field label="Goal" htmlFor="healthGoals" className="col-span-2 sm:col-span-1">
              <Select id="healthGoals" value={form.healthGoals} onValueChange={set('healthGoals')} options={GOAL_OPTIONS} />
              {form.healthGoals === 'Other' && (
                <Input name="healthGoalsOther" aria-label="Describe your goal" placeholder="Describe your goal" value={form.healthGoalsOther} onChange={onInput} maxLength={120} required className="mt-2" />
              )}
            </Field>
            <Field label="Dietary restrictions" htmlFor="dietaryRestrictions" className="col-span-2 sm:col-span-1">
              <Select id="dietaryRestrictions" value={form.dietaryRestrictions} onValueChange={set('dietaryRestrictions')} options={DIETARY_OPTIONS} placeholder="No restrictions" />
              {form.dietaryRestrictions === 'Other' && (
                <Input name="dietaryRestrictionsOther" aria-label="Describe your dietary restrictions" placeholder="e.g. nut allergy" value={form.dietaryRestrictionsOther} onChange={onInput} maxLength={120} required className="mt-2" />
              )}
            </Field>
          </div>
          <Button type="submit" size="lg" disabled={loading} className="mt-6 w-full">
            {loading && <Spinner />}
            {loading ? 'Working out your target…' : 'Get my suggestions'}
          </Button>
        </form>

        <div id="results" className="scroll-mt-24">
          {loading ? (
            <TravelProgress message="Working out your target. This usually takes 5 to 15 seconds." />
          ) : result ? (
            <SuggestionsResult
              result={result}
              onPlanMeals={() =>
                navigate('/meal-plan-generator', {
                  state: { prefill: { dailyCals: `${result.calorieTarget.min}-${result.calorieTarget.max}` } },
                })
              }
            />
          ) : (
            <EmptyRoute />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyRoute() {
  const stops = ['Your daily calorie range', 'Your protein target', 'Advice for food, activity and habits'];
  return (
    <div className="hidden rounded-panel border-2 border-dashed border-rule p-10 lg:block">
      <p className="font-semibold">Your results will appear here</p>
      <ol className="relative mt-6 space-y-5">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[9px] w-1 rounded-full bg-rule" />
        {stops.map((s) => (
          <li key={s} className="relative flex items-center gap-4 text-muted">
            <span aria-hidden="true" className="size-5 shrink-0 rounded-full border-[4.5px] border-rule bg-ground" />
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function SuggestionsResult({ result, onPlanMeals }) {
  const { calorieTarget, proteinTargetGrams, summary, adviceMarkdown } = result;
  const fmt = (n) => n.toLocaleString();

  return (
    <article className="animate-rise rounded-panel bg-panel p-6 shadow-panel sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight">Your plan</h2>
      <p className="mt-2 max-w-[70ch] text-lg text-muted">{summary}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-sm font-semibold text-muted">Daily calories</p>
          <p className="tnum mt-1 text-3xl font-bold">
            {fmt(calorieTarget.min)}–{fmt(calorieTarget.max)} <span className="text-lg font-semibold text-muted">kcal</span>
          </p>
          <div className="mt-4 max-w-xl">
            <TargetScale min={calorieTarget.min} max={calorieTarget.max} />
          </div>
        </div>
        <div className="flex items-center gap-3 md:pb-7">
          <Station tone="route" />
          <p>
            <span className="tnum text-3xl font-bold">{proteinTargetGrams}g</span>{' '}
            <span className="text-muted">protein a day</span>
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-rule pt-8">
        <div className="advice">
          <ReactMarkdown>{adviceMarkdown}</ReactMarkdown>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">Next stop: meals at {fmt(calorieTarget.min)}–{fmt(calorieTarget.max)} kcal.</p>
        <Button variant="route" onClick={onPlanMeals}>
          Plan my meals <ArrowRight />
        </Button>
      </div>
    </article>
  );
}
