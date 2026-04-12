import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Clock, CheckCircle2, MinusCircle } from 'lucide-react';
import { motion } from 'motion/react';

export type Quadrant = 'urgent-important' | 'important-not-urgent' | 'urgent-not-important' | 'neither';

export interface Task {
  id: string;
  title: string;
  quadrant: Quadrant;
  completed: boolean;
}

interface EisenhowerMatrixProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export function EisenhowerMatrix({ tasks, onToggleTask }: EisenhowerMatrixProps) {
  const getTasksByQuadrant = (q: Quadrant) => tasks.filter(t => t.quadrant === q);

  const quadrants = [
    { 
      id: 'urgent-important' as Quadrant, 
      title: 'DO FIRST', 
      subtitle: 'Urgent & Important', 
      color: 'border-adhd-urgent', 
      bg: 'bg-adhd-urgent/5',
      icon: <AlertCircle className="w-4 h-4 text-adhd-urgent" />
    },
    { 
      id: 'important-not-urgent' as Quadrant, 
      title: 'SCHEDULE', 
      subtitle: 'Important, Not Urgent', 
      color: 'border-adhd-important', 
      bg: 'bg-adhd-important/5',
      icon: <Clock className="w-4 h-4 text-adhd-important" />
    },
    { 
      id: 'urgent-not-important' as Quadrant, 
      title: 'DELEGATE', 
      subtitle: 'Urgent, Not Important', 
      color: 'border-adhd-focus', 
      bg: 'bg-adhd-focus/5',
      icon: <MinusCircle className="w-4 h-4 text-adhd-focus" />
    },
    { 
      id: 'neither' as Quadrant, 
      title: 'ELIMINATE', 
      subtitle: 'Neither', 
      color: 'border-slate-700', 
      bg: 'bg-slate-900/5',
      icon: <CheckCircle2 className="w-4 h-4 text-slate-500" />
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {quadrants.map((q) => (
        <Card key={q.id} className={`flex flex-col border-2 ${q.color} ${q.bg} shadow-sm overflow-hidden`}>
          <CardHeader className="py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-display font-bold tracking-tight flex items-center gap-2">
                  {q.icon} {q.title}
                </CardTitle>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mt-0.5">
                  {q.subtitle}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {getTasksByQuadrant(q.id).length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[200px] p-4">
              <div className="space-y-2">
                {getTasksByQuadrant(q.id).map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm group cursor-pointer"
                    onClick={() => onToggleTask(task.id)}
                  >
                    <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-slate-300' : q.color.replace('border-', 'bg-')}`} />
                    <span className={`text-sm flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </span>
                  </motion.div>
                ))}
                {getTasksByQuadrant(q.id).length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-8 opacity-20 grayscale">
                    <p className="text-xs font-mono">NO TASKS</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
