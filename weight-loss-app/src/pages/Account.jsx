import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import SavedMealPlans from '@/components/SavedMealPlans';
import { Button, Spinner } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';

export default function Account() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'saved' ? 'saved' : 'profile';

  return (
    <div className="page">
      <Tabs value={tab} onValueChange={(v) => setParams(v === 'saved' ? { tab: 'saved' } : {}, { replace: true })}>
        <PageHeader title="Your account">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="saved">Saved plans</TabsTrigger>
          </TabsList>
        </PageHeader>
        <TabsContent value="profile" className="focus-visible:outline-none">
          <Profile />
        </TabsContent>
        <TabsContent value="saved" className="focus-visible:outline-none">
          <SavedMealPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/user')
      .then((d) => setUser({ ...d.user, email: d.user.email || '' }))
      .catch((err) => toast.error(err.message));
  }, []);

  const onInput = (e) => setUser((u) => ({ ...u, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const d = await api('/user', {
        method: 'PUT',
        body: { firstName: user.firstName, lastName: user.lastName, email: user.email },
      });
      setUser({ ...d.user, email: d.user.email || '' });
      toast.success(d.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <div className="h-48 animate-pulse rounded-panel bg-well" aria-label="Loading profile" />;
  }

  return (
    <form onSubmit={handleSubmit} className="animate-rise rounded-panel bg-panel p-6 shadow-panel sm:p-8">
      <p className="text-muted">Only your username is required. Everything else is optional.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Username" htmlFor="username">
          <Input id="username" value={user.username} disabled />
        </Field>
        <Field label="First name" htmlFor="firstName">
          <Input id="firstName" name="firstName" value={user.firstName || ''} onChange={onInput} maxLength={50} autoComplete="given-name" />
        </Field>
        <Field label="Last name" htmlFor="lastName">
          <Input id="lastName" name="lastName" value={user.lastName || ''} onChange={onInput} maxLength={50} autoComplete="family-name" />
        </Field>
        <Field label="Email" htmlFor="email" hint="Used to email yourself saved plans.">
          <Input id="email" name="email" type="email" value={user.email} onChange={onInput} autoComplete="email" />
        </Field>
      </div>
      <Button type="submit" disabled={saving} className="mt-7">
        {saving && <Spinner />}
        Save changes
      </Button>
    </form>
  );
}
