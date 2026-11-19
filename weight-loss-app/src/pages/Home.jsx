import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PlanForm from '@/components/PlanForm';
import { Dot, RouteList, RouteMap, Station, TargetScale } from '@/components/route';
import { Button } from '@/components/ui/button';

const EXAMPLE = [
  { label: 'Breakfast', meal: 'Greek yogurt, berries, oats', kcal: 420 },
  { label: 'Lunch', meal: 'Chicken and rice bowl', kcal: 640 },
  { label: 'Snack', meal: 'Apple and peanut butter', kcal: 230 },
  { label: 'Dinner', meal: 'Lemon herb chicken, greens', kcal: 760 },
];

const STEPS = [
  { title: 'Tell us what you eat', body: 'Your calorie goal and up to three foods you already like.' },
  { title: 'Get seven days mapped', body: 'Seven different day plans, with calories and protein for every portion.' },
  { title: 'Keep the ones that fit', body: 'Save plans to a free account and come back to them anytime.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* First viewport: the offer, the working form, and the line itself */}
      <section className="page grid items-center gap-x-12 gap-y-10 pt-12 pb-16 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[minmax(0,30rem)_1fr] lg:py-10 xl:gap-x-20">
        <div className="animate-rise">
          <h1 className="text-[2.6rem] leading-[1.04] font-bold tracking-[-0.03em] sm:text-6xl">
            A clear plan for today. No logging.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Tell us your goal and the foods you already like. We map out the day, stop by stop.
          </p>
          <PlanForm
            className="mt-8"
            onSubmit={(form) => navigate('/meal-plan-generator', { state: { prefill: form, autoSubmit: true } })}
          />
        </div>

        <div className="hidden lg:block">
          <RouteMap className="mx-auto max-w-[56rem]" />
        </div>

        <div className="rounded-panel bg-panel p-6 shadow-panel lg:hidden">
          <p className="mb-5 text-sm font-semibold text-muted">Example day, 2,050 kcal</p>
          <RouteList
            stops={EXAMPLE.map((s, i) => ({
              end: i === EXAMPLE.length - 1,
              content: (
                <>
                  <p className="font-bold">{s.label}</p>
                  <p className="text-sm text-muted">
                    {s.meal}<Dot /><span className="tnum font-semibold">{s.kcal} kcal</span>
                  </p>
                </>
              ),
            }))}
          />
        </div>
      </section>

      {/* How it works: the route, three stops */}
      <section className="page border-t border-rule py-20">
        <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative flex gap-4 md:block">
              {i < STEPS.length - 1 && (
                <>
                  <span aria-hidden="true" className="absolute top-2.5 -bottom-[3.125rem] left-[9px] w-1 rounded-full bg-route md:hidden" />
                  <span aria-hidden="true" className="absolute top-2 left-2.5 hidden h-1 w-[calc(100%+2rem)] rounded-full bg-route md:block" />
                </>
              )}
              <Station tone={i === STEPS.length - 1 ? 'stop' : 'ink'} className="relative" />
              <div className="md:mt-6">
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-1.5 max-w-xs text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Second entry point: find the calorie target first */}
      <section className="page">
        <div className="grid items-center gap-10 rounded-panel bg-panel p-6 shadow-panel sm:p-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Not sure what to aim for?</h2>
            <p className="mt-3 max-w-lg text-lg text-muted">
              Answer seven quick questions and get a daily calorie range, a protein target, and advice that fits your
              life. Then plan meals at that target in one click.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-7">
              <Link to="/weight-suggestions">
                Find my target <ArrowRight />
              </Link>
            </Button>
          </div>
          <div aria-hidden="true">
            <p className="tnum text-2xl font-bold">
              2,000–2,200 <span className="text-base font-semibold text-muted">kcal a day</span>
            </p>
            <div className="mt-5">
              <TargetScale min={2000} max={2200} />
            </div>
            <p className="mt-3 text-sm text-muted">Example target for a moderately active adult</p>
          </div>
        </div>
      </section>
    </>
  );
}
