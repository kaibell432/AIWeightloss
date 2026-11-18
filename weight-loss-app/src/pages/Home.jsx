import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, ClipboardList, Salad, Scale, Sparkles } from 'lucide-react';

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
      <section className="hero bg-base-200 px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <div className="hero-content max-w-4xl text-center">
          <div>
            <h1 className="text-4xl font-bold text-balance sm:text-6xl">
              Reach your weight goals with a plan built for you
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-base-content/70">
              Personalized weight management advice and meal plans, generated in seconds.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/weight-suggestions" className="btn btn-primary btn-lg">
                Get started <ArrowRight className="size-5" />
              </Link>
              {isAuthenticated === false && (
                <Link to="/register" className="btn btn-outline btn-lg">
                  Create a free account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="page py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body, to, cta }) => (
            <div key={title} className="card card-border bg-base-100">
              <div className="card-body">
                <Icon className="size-8 text-primary" />
                <h2 className="card-title mt-2">{title}</h2>
                <p className="text-base-content/70">{body}</p>
                <div className="card-actions mt-2">
                  <Link to={to} className="btn btn-primary btn-outline btn-sm">
                    {cta} <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200">
        <div className="page py-14">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <ul className="steps steps-vertical mt-8 w-full sm:steps-horizontal">
            {STEPS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="step step-primary">
                <div className="px-4 py-2 text-left sm:text-center">
                  <Icon className="mb-1 inline size-5 text-primary" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-base-content/70">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
