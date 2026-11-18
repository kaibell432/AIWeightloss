import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

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
    <div className="flex justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  value={form.username}
                  onChange={onInput}
                  required
                  autoFocus
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={mode === 'register' ? 8 : undefined}
                  value={form.password}
                  onChange={onInput}
                  required
                />
                {mode === 'register' && <FieldDescription>At least 8 characters.</FieldDescription>}
              </Field>
              {error && <FieldError>{error}</FieldError>}
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              {copy.submit}
            </Button>
            <p className="text-sm text-muted-foreground">
              {copy.switchText}{' '}
              <Link to={copy.switchLink} state={location.state} className="text-primary underline-offset-4 hover:underline">
                {copy.switchLabel}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
