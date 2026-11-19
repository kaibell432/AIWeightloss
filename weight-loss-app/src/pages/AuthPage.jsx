import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button, Spinner } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { toast } from '@/components/ui/toast';

const COPY = {
  login: {
    title: 'Welcome back',
    description: 'Log in to see your saved meal plans.',
    submit: 'Log in',
    endpoint: '/login',
    switchText: 'New here?',
    switchLink: '/register',
    switchLabel: 'Create an account',
  },
  register: {
    title: 'Create your account',
    description: 'Save the plans you like and come back to them anytime. Free.',
    submit: 'Create account',
    endpoint: '/register',
    switchText: 'Already have an account?',
    switchLink: '/login',
    switchLabel: 'Log in',
  },
};

export default function AuthPage({ mode, onAuthenticated }) {
  const copy = COPY[mode];
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onInput = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api(copy.endpoint, { method: 'POST', body: form });
      onAuthenticated();
      toast.success(data.message);
      navigate(location.state?.from || (mode === 'register' ? '/account' : '/'), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page flex justify-center py-16 sm:py-24">
      <form onSubmit={handleSubmit} className="animate-rise w-full max-w-md rounded-panel bg-panel p-6 shadow-panel sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-1.5 text-muted">{copy.description}</p>

        <div className="mt-7 grid gap-4">
          <Field label="Username" htmlFor="username">
            <Input id="username" name="username" autoComplete="username" autoCapitalize="none" value={form.username} onChange={onInput} required autoFocus />
          </Field>
          <Field label="Password" htmlFor="password" hint={mode === 'register' ? 'At least 8 characters.' : undefined} error={error}>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? 8 : undefined}
              value={form.password}
              onChange={onInput}
              aria-invalid={error ? true : undefined}
              required
            />
          </Field>
        </div>

        <Button type="submit" size="lg" disabled={loading} className="mt-7 w-full">
          {loading && <Spinner />}
          {copy.submit}
        </Button>
        <p className="mt-5 text-center text-sm text-muted">
          {copy.switchText}{' '}
          <Link to={copy.switchLink} state={location.state} className="font-semibold text-route-ink underline">
            {copy.switchLabel}
          </Link>
        </p>
      </form>
    </div>
  );
}
