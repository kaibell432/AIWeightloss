import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import SavedMealPlans from '@/components/SavedMealPlans';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Account() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'saved' ? 'saved' : 'profile';

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title="Your account" />
      <Tabs value={tab} onValueChange={(v) => setParams(v === 'saved' ? { tab: 'saved' } : {}, { replace: true })}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="saved">Saved meal plans</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Profile />
        </TabsContent>
        <TabsContent value="saved" className="mt-6">
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>All fields except username are optional.</CardDescription>
      </CardHeader>
      {!user ? (
        <CardContent className="space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" value={user.username} disabled />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <Input id="firstName" name="firstName" value={user.firstName || ''} onChange={onInput} maxLength={50} autoComplete="given-name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <Input id="lastName" name="lastName" value={user.lastName || ''} onChange={onInput} maxLength={50} autoComplete="family-name" />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" name="email" type="email" value={user.email} onChange={onInput} autoComplete="email" />
                <FieldDescription>Used to email yourself saved meal plans.</FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
