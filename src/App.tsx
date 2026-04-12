import React, { useState } from 'react';
import { EisenhowerMatrix, Task, Quadrant } from '@/src/components/EisenhowerMatrix';
import { FocusTimer } from '@/src/components/FocusTimer';
import { HabitTracker } from '@/src/components/HabitTracker';
import { TaskAnalysis } from '@/src/components/TaskAnalysis';
import { TaskInsight } from '@/src/lib/gemini';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Settings, 
  Bell, 
  Search,
  Brain,
  Zap,
  Menu,
  X,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Finish Project Proposal', quadrant: 'urgent-important', completed: false },
    { id: '2', title: 'Weekly Meal Prep', quadrant: 'important-not-urgent', completed: false },
    { id: '3', title: 'Reply to Emails', quadrant: 'urgent-not-important', completed: false },
    { id: '4', title: 'Organize Desktop', quadrant: 'neither', completed: true },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleTaskAnalyzed = (title: string, insight: TaskInsight) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      quadrant: insight.priority as Quadrant,
      completed: false
    };
    setTasks([newTask, ...tasks]);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 font-sans selection:bg-adhd-focus selection:text-slate-900">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 font-display font-bold text-xl tracking-tighter"
            >
              <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white dark:text-slate-900" />
              </div>
              CHIEF <span className="text-adhd-focus">v2.0</span>
            </motion.div>
          ) : (
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center mx-auto">
              <Brain className="w-5 h-5 text-white dark:text-slate-900" />
            </div>
          )}
        </div>

        <nav className="mt-8 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active isOpen={isSidebarOpen} />
          <SidebarItem icon={<CalendarIcon />} label="Calendar" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Zap />} label="Focus" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Bell />} label="Notifications" isOpen={isSidebarOpen} />
          <div className="pt-8">
            <SidebarItem icon={<Settings />} label="Settings" isOpen={isSidebarOpen} />
          </div>
        </nav>

        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute bottom-6 right-6"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight mb-2">
              Good Morning, <span className="text-adhd-focus">Chief</span>
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">
              Saturday, April 11 • Energy: High
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-adhd-focus/50 w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-adhd-focus flex items-center justify-center font-bold">
              FY
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column: Matrix & Analysis */}
          <div className="xl:col-span-8 space-y-8">
            <Tabs defaultValue="matrix" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <TabsTrigger value="matrix" className="rounded-lg px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Matrix</TabsTrigger>
                  <TabsTrigger value="list" className="rounded-lg px-6 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">List View</TabsTrigger>
                </TabsList>
                <Button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full px-6 font-bold">
                  <Plus className="w-4 h-4 mr-2" /> New Task
                </Button>
              </div>
              
              <TabsContent value="matrix" className="mt-0">
                <EisenhowerMatrix tasks={tasks} onToggleTask={handleToggleTask} />
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <Card className="border-slate-200 dark:border-slate-800">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className={`rounded-full h-6 w-6 ${task.completed ? 'bg-green-500 border-green-500 text-white' : ''}`}
                            onClick={() => handleToggleTask(task.id)}
                          >
                            {task.completed && <CheckCircle2 className="h-4 w-4" />}
                          </Button>
                          <span className={`flex-1 font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</span>
                          <Badge variant="outline" className="font-mono text-[10px] uppercase">{task.quadrant.replace('-', ' ')}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Calendar Placeholder */}
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
              <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <CardTitle className="text-sm font-display font-bold flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-adhd-focus" /> Google Calendar Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[400px] bg-slate-100 dark:bg-slate-900/20 flex items-center justify-center relative">
                <div className="text-center space-y-4 z-10">
                  <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Calendar Embedded View</p>
                  <Button variant="outline" className="border-slate-300 dark:border-slate-700">Connect Account</Button>
                </div>
                {/* Mock Calendar Grid */}
                <div className="absolute inset-0 opacity-10 grid grid-cols-7 grid-rows-5 gap-px bg-slate-300 dark:bg-slate-700">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-950" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Timer, Habits, AI */}
          <div className="xl:col-span-4 space-y-8">
            <FocusTimer />
            <TaskAnalysis onTaskAnalyzed={handleTaskAnalyzed} />
            <HabitTracker />
            
            {/* Automation Status */}
            <Card className="border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Automation Status</span>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">ACTIVE</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">N8N Workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">Slack Notifications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                    <span className="text-sm font-medium text-slate-500">Email Processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, isOpen = true }: { icon: React.ReactNode, label: string, active?: boolean, isOpen?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'} ${!isOpen ? 'justify-center' : ''}`}>
      <div className="w-5 h-5">{icon}</div>
      {isOpen && <span className="font-medium text-sm">{label}</span>}
    </div>
  );
}

