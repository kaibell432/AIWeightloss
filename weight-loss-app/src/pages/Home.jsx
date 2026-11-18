import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, ClipboardList, Salad, Scale, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Scale,
    title: 'Personalized targets',
    body: 'Get a daily calorie and protein target plus practical advice based on your body, activity and goals.',
    to: '/weight-suggestions',
    cta: 'Get suggestions',
  },
  {
    icon: Salad,
    title: 'Meal plans around foods you love',
    body: 'Pick up to three staple foods and get seven different day plans with calories and protein for every item.',
    to: '/meal-plan-generator',
    cta: 'Plan meals',
  },
];

const STEPS = [
  { icon: ClipboardList, title: 'Tell us about you', body: 'Age, height, weight, activity level and any dietary restrictions.' },
  { icon: Sparkles, title: 'Get your plan', body: 'AI builds a calorie target and meal plans that respect your restrictions.' },
  { icon: Bookmark, title: 'Save what works', body: 'Create a free account to save meal plans and come back to them anytime.' },
];

export default function Home({ isAuthenticated }) {
  return (
    <>
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Reach your weight goals with a plan built for you
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
            Personalized weight management advice and meal plans, generated in seconds.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-6">
              <Link to="/weight-suggestions">
                Get started <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            {isAuthenticated === false && (
              <Button asChild size="lg" variant="outline" className="h-11 px-6">
                <Link to="/register">Create a free account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body, to, cta }) => (
            <Card key={title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
                <Button asChild variant="link" className="mt-2 w-fit px-0">
                  <Link to={to}>
                    {cta} <ArrowRight data-icon="inline-end" />
                  </Link>
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-background">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="mt-4 font-medium">
                  {i + 1}. {title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
