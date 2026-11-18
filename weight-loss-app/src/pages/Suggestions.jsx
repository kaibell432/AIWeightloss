import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
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
import SelectField from '@/components/SelectField';
import GeneratingCard from '@/components/GeneratingCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

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
    const required = ['gender', 'heightFeet', 'heightInches', 'activityLevel', 'dietaryRestrictions', 'healthGoals'];
    if (required.some((k) => !form[k])) {
      toast.error('Please fill in every field.');
      return;
    }

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
      requestAnimationFrame(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Weight suggestions"
        description="Tell us a bit about yourself and get a personalized calorie target and plan."
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FieldGroup className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="age">Age</FieldLabel>
                <Input id="age" name="age" type="number" min="13" max="120" value={form.age} onChange={onInput} required />
              </Field>
              <SelectField id="gender" label="Sex" value={form.gender} onChange={set('gender')} options={SEX_OPTIONS} />

              <Field>
                <FieldLabel htmlFor="weight">Weight (lb)</FieldLabel>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  min="50"
                  max="1000"
                  value={form.weight}
                  onChange={onInput}
                  required
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <SelectField id="heightFeet" label="Height" placeholder="ft" value={form.heightFeet} onChange={set('heightFeet')} options={FEET_OPTIONS} />
                <SelectField id="heightInches" label={<span className="invisible">Inches</span>} placeholder="in" value={form.heightInches} onChange={set('heightInches')} options={INCH_OPTIONS} />
              </div>

              <div className="sm:col-span-2">
                <SelectField
                  id="activityLevel"
                  label="Activity level"
                  value={form.activityLevel}
                  onChange={set('activityLevel')}
                  options={ACTIVITY_OPTIONS}
                />
              </div>

              <div className="space-y-3">
                <SelectField
                  id="dietaryRestrictions"
                  label="Dietary restrictions"
                  value={form.dietaryRestrictions}
                  onChange={set('dietaryRestrictions')}
                  options={DIETARY_OPTIONS}
                />
                {form.dietaryRestrictions === 'Other' && (
                  <Input
                    name="dietaryRestrictionsOther"
                    placeholder="e.g. nut allergy, low FODMAP"
                    aria-label="Other dietary restrictions"
                    value={form.dietaryRestrictionsOther}
                    onChange={onInput}
                    maxLength={120}
                    required
                  />
                )}
              </div>
              <div className="space-y-3">
                <SelectField id="healthGoals" label="Goal" value={form.healthGoals} onChange={set('healthGoals')} options={GOAL_OPTIONS} />
                {form.healthGoals === 'Other' && (
                  <Input
                    name="healthGoalsOther"
                    placeholder="Describe your goal"
                    aria-label="Other goal"
                    value={form.healthGoalsOther}
                    onChange={onInput}
                    maxLength={120}
                    required
                  />
                )}
              </div>
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {loading ? 'Generating…' : 'Get suggestions'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div id="results" className="scroll-mt-20">
        {loading && <GeneratingCard className="mt-8" message="Crunching the numbers. This usually takes 5–15 seconds." />}
        {!loading && result && (
          <SuggestionsResult
            result={result}
            onPlanMeals={() =>
              navigate('/meal-plan-generator', {
                state: { dailyCals: `${result.calorieTarget.min}-${result.calorieTarget.max}` },
              })
            }
          />
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, unit }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {value}
        <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

function SuggestionsResult({ result, onPlanMeals }) {
  const { calorieTarget, proteinTargetGrams, summary, adviceMarkdown } = result;
  const fmt = (n) => n.toLocaleString();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Your personalized plan</CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Daily calories" value={`${fmt(calorieTarget.min)}–${fmt(calorieTarget.max)}`} unit="kcal" />
          <Stat label="Daily protein" value={proteinTargetGrams} unit="g" />
        </div>
        <div className="markdown">
          <ReactMarkdown>{adviceMarkdown}</ReactMarkdown>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Ready to eat at this target?</p>
        <Button onClick={onPlanMeals}>
          Build meal plans <ArrowRight data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  );
}
