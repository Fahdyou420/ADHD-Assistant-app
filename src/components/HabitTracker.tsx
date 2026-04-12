import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Flame, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', title: 'Morning Meds', streak: 12, completedToday: true },
    { id: '2', title: 'Drink 2L Water', streak: 5, completedToday: false },
    { id: '3', title: '15min Movement', streak: 3, completedToday: false },
  ]);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          completedToday: !h.completedToday,
          streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  return (
    <Card className="border-adhd-habit/30 bg-adhd-habit/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-adhd-habit" /> Daily Streaks
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{habit.title}</span>
              <span className="text-[10px] font-mono text-adhd-habit flex items-center gap-1">
                <Flame className="w-3 h-3" /> {habit.streak} DAY STREAK
              </span>
            </div>
            <Button
              size="icon"
              variant={habit.completedToday ? "default" : "outline"}
              className={`rounded-full h-8 w-8 ${habit.completedToday ? 'bg-adhd-habit hover:bg-adhd-habit/90' : 'border-adhd-habit/30 text-adhd-habit'}`}
              onClick={() => toggleHabit(habit.id)}
            >
              <CheckCircle2 className="h-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
