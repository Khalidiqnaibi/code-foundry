import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Flame, Trophy, Clock, BookOpenCheck, ArrowRight, Play, Sparkles,
} from "lucide-react";
import { Card, Progress, Btn, Badge } from "@/components/ui-kit";
import { AIChatWidget } from "@/components/AIChatWidget";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · CodePath" }] }),
  component: DashboardPage,
});

const stats = [
  { label: "Coding Streak", value: "7", suffix: "days", icon: Flame, accent: "text-warning bg-warning/15" },
  { label: "Total XP", value: "2,840", icon: Trophy, accent: "text-primary bg-primary/15" },
  { label: "Hours Spent", value: "38.5", icon: Clock, accent: "text-[oklch(0.7_0.18_200)] bg-[oklch(0.7_0.18_200)]/15" },
  { label: "Completed Lessons", value: "62", icon: BookOpenCheck, accent: "text-success bg-success/15" },
];

const courses = [
  { name: "Java OOP", progress: 45 },
  { name: "C++ Data Structures", progress: 12 },
  { name: "Git & GitHub", progress: 100 },
];

const recent = [
  { course: "Java OOP", lesson: "Inheritance & Polymorphism", min: 8 },
  { course: "C++ Data Structures", lesson: "Linked List basics", min: 12 },
  { course: "Git & GitHub", lesson: "Rebasing vs merging", min: 5 },
];

function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Alex</h1>
          <p className="text-sm text-muted-foreground mt-1">You're 3 lessons away from your weekly goal.</p>
        </div>
        <Link to="/lab"><Btn>Resume learning <ArrowRight className="w-4 h-4" /></Btn></Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="mt-2 text-2xl font-bold tracking-tight">
                    {s.value} {s.suffix && <span className="text-base font-medium text-muted-foreground">{s.suffix}</span>}
                  </div>
                </div>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.accent}`}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="font-semibold">Active Courses</div>
            <Link to="/courses" className="text-sm text-primary hover:underline">All courses</Link>
          </div>
          <div className="space-y-5">
            {courses.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">{c.progress}%</span>
                </div>
                <Progress value={c.progress} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-[oklch(0.65_0.2_200)]/10 border-primary/30">
          <Badge variant="info" className="mb-3"><Sparkles className="w-3 h-3" /> Recommended next</Badge>
          <div className="font-semibold text-lg">Hash Maps & Sets</div>
          <p className="text-sm text-muted-foreground mt-1.5">Builds on what you finished yesterday. ~20 minutes.</p>
          <Btn className="mt-4 w-full">Start lesson <ArrowRight className="w-4 h-4" /></Btn>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="font-semibold mb-4">Recent Lessons</div>
        <div className="divide-y divide-border">
          {recent.map((r) => (
            <div key={r.lesson} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <Play className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.lesson}</div>
                <div className="text-xs text-muted-foreground">{r.course} · {r.min} min</div>
              </div>
              <Btn size="sm" variant="outline">Resume</Btn>
            </div>
          ))}
        </div>
      </Card>

      <AIChatWidget />
    </div>
  );
}
