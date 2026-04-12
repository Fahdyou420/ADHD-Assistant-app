import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Zap, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusTimerProps {
  initialMinutes?: number;
  onComplete?: () => void;
}

export function FocusTimer({ initialMinutes = 25, onComplete }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(80); // 0-100

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete?.();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialMinutes * 60 - timeLeft) / (initialMinutes * 60)) * 100;

  return (
    <Card className="w-full bg-slate-900 text-white border-adhd-focus/30 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-adhd-focus/20">
        <motion.div 
          className="h-full bg-adhd-focus shadow-[0_0_10px_rgba(0,212,255,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono uppercase tracking-widest text-adhd-focus flex items-center gap-2">
          <Zap className="w-4 h-4" /> Focus Session
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center py-6">
        <div className="text-6xl font-display font-bold mb-6 tracking-tighter">
          {formatTime(timeLeft)}
        </div>
        
        <div className="flex gap-4 mb-8">
          <Button 
            size="lg" 
            variant={isActive ? "outline" : "default"}
            className={isActive ? "border-adhd-focus text-adhd-focus hover:bg-adhd-focus/10" : "bg-adhd-focus text-slate-900 hover:bg-adhd-focus/90"}
            onClick={toggleTimer}
          >
            {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isActive ? "Pause" : "Start"}
          </Button>
          <Button size="lg" variant="ghost" onClick={resetTimer} className="text-slate-400 hover:text-white">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>ENERGY LEVEL</span>
            <span>{energyLevel}%</span>
          </div>
          <Progress value={energyLevel} className="h-1.5 bg-slate-800" />
          <div className="flex justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-[10px] h-7 border-slate-700 hover:bg-slate-800"
              onClick={() => setEnergyLevel(Math.min(100, energyLevel + 10))}
            >
              <Coffee className="w-3 h-3 mr-1" /> Recharge
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
