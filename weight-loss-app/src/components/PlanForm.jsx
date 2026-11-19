import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cx } from '@/lib/cx';
import { DIETARY_OPTIONS } from '@/lib/options';
import { Button, Spinner } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { Select } from '@/components/ui/select';

export const EMPTY_PLAN_FORM = { dailyCals: '', foods: '', dietaryRestrictions: '', dietaryRestrictionsOther: '' };

// Turns the form into the API body: "chicken, rice" -> stapleFood1/2/3.
export function toPlanRequest(form) {
  const [stapleFood1 = '', stapleFood2 = '', stapleFood3 = ''] = form.foods
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean);
  return {
    dailyCals: form.dailyCals,
    stapleFood1,
    stapleFood2,
    stapleFood3,
    dietaryRestrictions:
      form.dietaryRestrictions === 'Other' ? form.dietaryRestrictionsOther : form.dietaryRestrictions || 'No restrictions',
  };
}

// layout: "stack" (landing hero) or "row" (planner page, full width).
export default function PlanForm({ initial = EMPTY_PLAN_FORM, onSubmit, loading, layout = 'stack', className }) {
  const [form, setForm] = useState({ ...EMPTY_PLAN_FORM, ...initial });
  const onInput = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const row = layout === 'row';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className={cx('rounded-panel bg-panel p-5 shadow-panel sm:p-6', className)}
    >
      <div className={cx('grid gap-4', row && 'lg:grid-cols-[1fr_1.4fr_1fr_auto] lg:items-start')}>
        <Field
          label="Daily calorie goal"
          htmlFor="dailyCals"
          hint={
            <>
              Not sure?{' '}
              <Link to="/weight-suggestions" className="font-semibold text-route-ink underline">
                Find your target
              </Link>
            </>
          }
        >
          <Input
            id="dailyCals"
            name="dailyCals"
            placeholder="1800 or 1800-2000"
            value={form.dailyCals}
            onChange={onInput}
            pattern=".*\d{3,5}.*"
            title="Enter a number like 1800, or a range like 1800-2000"
            maxLength={30}
            inputMode="numeric"
            required
          />
        </Field>
        <Field label="Foods you like" htmlFor="foods" hint="Up to 3, separated by commas">
          <Input
            id="foods"
            name="foods"
            placeholder="chicken, rice, eggs"
            value={form.foods}
            onChange={onInput}
            maxLength={150}
            required
          />
        </Field>
        <Field label="Dietary restrictions" htmlFor="dietaryRestrictions">
          <Select
            id="dietaryRestrictions"
            value={form.dietaryRestrictions}
            onValueChange={(v) => setForm((f) => ({ ...f, dietaryRestrictions: v }))}
            options={DIETARY_OPTIONS}
            placeholder="No restrictions"
          />
          {form.dietaryRestrictions === 'Other' && (
            <Input
              name="dietaryRestrictionsOther"
              aria-label="Describe your dietary restrictions"
              placeholder="e.g. nut allergy"
              value={form.dietaryRestrictionsOther}
              onChange={onInput}
              maxLength={120}
              required
              className="mt-2"
            />
          )}
        </Field>
        <Button type="submit" size="lg" disabled={loading} className={cx('w-full', row ? 'lg:mt-[1.625rem] lg:w-auto' : 'mt-1')}>
          {loading ? <Spinner /> : null}
          {loading ? 'Mapping your day…' : 'Map my day'}
          {!loading && <ArrowRight />}
        </Button>
      </div>
    </form>
  );
}
