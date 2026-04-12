import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, BrainCircuit } from 'lucide-react';
import { analyzeTask, TaskInsight } from '@/src/lib/gemini';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface TaskAnalysisProps {
  onTaskAnalyzed: (title: string, insight: TaskInsight) => void;
}

export function TaskAnalysis({ onTaskAnalyzed }: TaskAnalysisProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastInsight, setLastInsight] = useState<TaskInsight | null>(null);

  const handleAnalyze = async () => {
    if (!title) {
      toast.error("Please enter a task title");
      return;
    }

    setIsAnalyzing(true);
    try {
      const insight = await analyzeTask(title, description);
      setLastInsight(insight);
      onTaskAnalyzed(title, insight);
      toast.success("Task analyzed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze task. Check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-adhd-important/30 bg-adhd-important/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-adhd-important" /> AI Task Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task-title" className="text-[10px] font-mono uppercase text-muted-foreground">What's on your mind?</Label>
          <Input 
            id="task-title" 
            placeholder="e.g., Clean the kitchen" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="task-desc" className="text-[10px] font-mono uppercase text-muted-foreground">Extra details (optional)</Label>
          <Input 
            id="task-desc" 
            placeholder="It's been a week and I'm overwhelmed..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          />
        </div>

        <Button 
          className="w-full bg-adhd-important text-slate-900 hover:bg-adhd-important/90 font-bold"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isAnalyzing ? "Analyzing..." : "Analyze & Categorize"}
        </Button>

        <AnimatePresence>
          {lastInsight && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded-lg bg-white dark:bg-slate-900 border border-adhd-important/20 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-adhd-important uppercase tracking-tighter">AI INSIGHT</span>
                <span className="font-mono text-[10px] opacity-50">{lastInsight.suggestedFocusTime} MIN FOCUS</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{lastInsight.reasoning}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold block text-[10px] uppercase text-slate-400 mb-1">Break Suggestion</span>
                <p className="text-slate-500">{lastInsight.breakSuggestion}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
