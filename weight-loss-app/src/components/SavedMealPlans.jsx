import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, Salad, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import MealPlanView, { planTotals } from '@/components/MealPlanView';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '');

export default function SavedMealPlans() {
  const [plans, setPlans] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [emailing, setEmailing] = useState(false);

  useEffect(() => {
    api('/savedMealPlans')
      .then((d) => setPlans(d.mealPlans))
      .catch((err) => {
        toast.error(err.message);
        setPlans([]);
      });
  }, []);

  async function confirmDelete() {
    const plan = deleting;
    setDeleting(null);
    try {
      await api(`/mealPlans/${plan._id}`, { method: 'DELETE' });
      setPlans((ps) => ps.filter((p) => p._id !== plan._id));
      toast.success('Meal plan deleted');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function emailPlan(plan) {
    setEmailing(true);
    try {
      const d = await api(`/mealPlans/${plan._id}/export`, { method: 'POST' });
      toast.success(d.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEmailing(false);
    }
  }

  if (plans === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-14 text-center">
        <Salad className="size-8 text-muted-foreground" />
        <p className="mt-3 font-medium">No saved meal plans yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Generate some plans and save the ones you like.</p>
        <Button asChild className="mt-5">
          <Link to="/meal-plan-generator">Open meal planner</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => {
          const totals = planTotals(plan);
          return (
            <Card key={plan._id}>
              <CardHeader>
                <CardTitle>{plan.focus || 'Meal plan'}</CardTitle>
                <CardDescription>
                  {plan.stapleFoods}
                  <br />
                  <span className="tabular-nums">
                    {totals.calories.toLocaleString()} kcal · {totals.protein}g protein
                  </span>
                  {plan.createdAt && <> · Saved {formatDate(plan.createdAt)}</>}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewing(plan)}>
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-destructive hover:text-destructive"
                  onClick={() => setDeleting(plan)}
                  aria-label={`Delete ${plan.focus || 'meal plan'}`}
                >
                  <Trash2 /> Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={Boolean(viewing)} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.focus || 'Meal plan'}</DialogTitle>
                <DialogDescription>Staple foods: {viewing.stapleFoods}</DialogDescription>
              </DialogHeader>
              <MealPlanView plan={viewing} />
              <DialogFooter>
                <Button variant="outline" onClick={() => emailPlan(viewing)} disabled={emailing}>
                  {emailing ? <Loader2 className="animate-spin" /> : <Mail />}
                  Email to me
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this meal plan?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.focus}&rdquo; will be permanently removed from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
