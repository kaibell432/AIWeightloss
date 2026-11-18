import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from '@/lib/toast';
import PageHeader from '@/components/PageHeader';
import SavedMealPlans from '@/components/SavedMealPlans';

export default function Account() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'saved' ? 'saved' : 'profile';
  const select = (t) => setParams(t === 'saved' ? { tab: 'saved' } : {}, { replace: true });

  return (
    <div className="page">
      <PageHeader title="Your account" />
      <div role="tablist" className="tabs tabs-box mb-6 w-fit">
        <button role="tab" aria-selected={tab === 'profile'} className={`tab ${tab === 'profile' ? 'tab-active' : ''}`} onClick={() => select('profile')}>
          Profile
        </button>
        <button role="tab" aria-selected={tab === 'saved'} className={`tab ${tab === 'saved' ? 'tab-active' : ''}`} onClick={() => select('saved')}>
          Saved meal plans
        </button>
      </div>
      {tab === 'profile' ? <Profile /> : <SavedMealPlans />}
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
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-16" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card card-border bg-base-100">
      <div className="card-body">
        <p className="text-sm text-base-content/70">All fields except username are optional.</p>
        <div className="grid gap-x-4 md:grid-cols-2 xl:grid-cols-4">
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="username">Username</label>
            <input id="username" className="input w-full" value={user.username} disabled />
          </fieldset>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" className="input w-full" value={user.firstName || ''} onChange={onInput} maxLength={50} autoComplete="given-name" />
          </fieldset>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" className="input w-full" value={user.lastName || ''} onChange={onInput} maxLength={50} autoComplete="family-name" />
          </fieldset>
          <fieldset className="fieldset">
            <label className="fieldset-legend" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input w-full" value={user.email} onChange={onInput} autoComplete="email" />
            <p className="label">Used to email yourself saved meal plans.</p>
          </fieldset>
        </div>
        <div className="card-actions mt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="loading loading-spinner loading-sm" />}
            Save changes
          </button>
        </div>
      </div>
    </form>
  );
}
