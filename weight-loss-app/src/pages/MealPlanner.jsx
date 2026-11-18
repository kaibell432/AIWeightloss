import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bookmark, Check, Info, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { DIETARY_OPTIONS } from '@/lib/options';
import PageHeader from '@/components/PageHeader';
import SelectField from '@/components/SelectField';
import GeneratingCard from '@/components/GeneratingCard';
import MealPlanView, { GoalBadge, goalStatus, parseCalorieGoal, planTotals } from '@/components/MealPlanView';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

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
    if (!form.dietaryRestrictions) {
      toast.error('Please choose your dietary restrictions.');
      return;
    }
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        title="Meal planner"
        description="Choose up to three staple foods and get seven different day plans that hit your calorie goal."
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="dailyCals">Daily calorie goal</FieldLabel>
                <Input
                  id="dailyCals"
                  name="dailyCals"
                  placeholder="e.g. 1800 or 1800-2000"
                  value={form.dailyCals}
                  onChange={onInput}
                  pattern=".*\d{3,5}.*"
                  maxLength={30}
                  required
                />
                <FieldDescription>
                  Not sure? <Link to="/weight-suggestions" className="text-primary underline-offset-4 hover:underline">Get a personalized target</Link>.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="stapleFood1">Staple foods</FieldLabel>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input id="stapleFood1" name="stapleFood1" placeholder="e.g. chicken" value={form.stapleFood1} onChange={onInput} maxLength={60} required />
                  <Input name="stapleFood2" aria-label="Staple food 2" placeholder="optional" value={form.stapleFood2} onChange={onInput} maxLength={60} />
                  <Input name="stapleFood3" aria-label="Staple food 3" placeholder="optional" value={form.stapleFood3} onChange={onInput} maxLength={60} />
                </div>
              </Field>

              <div className="space-y-3">
                <SelectField
                  id="dietaryRestrictions"
                  label="Dietary restrictions"
                  value={form.dietaryRestrictions}
                  onChange={(v) => setForm((f) => ({ ...f, dietaryRestrictions: v }))}
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
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {loading ? 'Generating…' : 'Generate meal plans'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div id="results" className="scroll-mt-20">
        {loading && (
          <GeneratingCard className="mt-8" message="Building 7 meal plans. This can take 15–60 seconds." />
        )}
        {!loading && result && <Results result={result} saved={saved} onSave={handleSave} />}
      </div>
    </div>
  );
}

function Results({ result, saved, onSave }) {
  const { mealPlans, stapleFoodConcerns, varietyInStapleFoods, notes, goal } = result;

  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Your meal plans</h2>

      {(stapleFoodConcerns || varietyInStapleFoods) && (
        <Alert>
          <Info />
          <AlertTitle>About your staple foods</AlertTitle>
          <AlertDescription className="space-y-1">
            {stapleFoodConcerns && <p>{stapleFoodConcerns}</p>}
            {varietyInStapleFoods && <p>{varietyInStapleFoods}</p>}
          </AlertDescription>
        </Alert>
      )}

      <Accordion type="single" collapsible defaultValue="plan-1" className="rounded-lg border">
        {mealPlans.map((plan) => {
          const totals = planTotals(plan);
          const state = saved[plan.mealPlanNumber];
          return (
            <AccordionItem key={plan.mealPlanNumber} value={`plan-${plan.mealPlanNumber}`} className="px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left">
                  <span className="font-medium">
                    {plan.mealPlanNumber}. {plan.focus}
                  </span>
                  <span className="text-sm font-normal tabular-nums text-muted-foreground">
                    {totals.calories.toLocaleString()} kcal · {totals.protein}g protein
                  </span>
                  <GoalBadge status={goalStatus(totals.calories, goal)} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <MealPlanView plan={plan} />
                <div className="mt-5 flex justify-end">
                  <Button
                    variant={state === 'saved' ? 'secondary' : 'outline'}
                    disabled={Boolean(state)}
                    onClick={() => onSave(plan)}
                  >
                    {state === 'saving' ? <Loader2 className="animate-spin" /> : state === 'saved' ? <Check /> : <Bookmark />}
                    {state === 'saved' ? 'Saved' : 'Save plan'}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {notes && <p className="text-xs text-muted-foreground">{notes}</p>}
    </div>
  );
}
