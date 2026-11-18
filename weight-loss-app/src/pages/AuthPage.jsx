import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';

const COPY = {
  login: {
    title: 'Welcome back',
    description: 'Log in to see your saved meal plans.',
    submit: 'Log in',
    endpoint: '/login',
    switchText: "Don't have an account?",
    switchLink: '/register',
    switchLabel: 'Sign up',
  },
  register: {
    title: 'Create your account',
    description: 'Save meal plans and pick up where you left off.',
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
    <div className="page flex justify-center py-16">
      <form onSubmit={handleSubmit} className="card card-border w-full max-w-md bg-base-100">
        <div className="card-body">
          <h1 className="card-title text-2xl">{copy.title}</h1>
          <p className="text-base-content/70">{copy.description}</p>

          <fieldset className="fieldset mt-2">
            <label className="fieldset-legend" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              className="input w-full"
              autoComplete="username"
              autoCapitalize="none"
              value={form.username}
              onChange={onInput}
              required
              autoFocus
            />
            <label className="fieldset-legend" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="input w-full"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? 8 : undefined}
              value={form.password}
              onChange={onInput}
              required
            />
            {mode === 'register' && <p className="label">At least 8 characters.</p>}
          </fieldset>

          {error && (
            <div role="alert" className="alert alert-error alert-soft py-2 text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary mt-2 w-full" disabled={loading}>
            {loading && <span className="loading loading-spinner loading-sm" />}
            {copy.submit}
          </button>
          <p className="mt-2 text-center text-sm text-base-content/70">
            {copy.switchText}{' '}
            <Link to={copy.switchLink} state={location.state} className="link link-primary">
              {copy.switchLabel}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
