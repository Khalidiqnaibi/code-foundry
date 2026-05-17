import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Coffee, Boxes, Network, GitBranch, Globe, Brain, Lock, CheckCircle2, Clock, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Progress, Badge, Btn } from "@/components/ui-kit";

export const Route = createFileRoute("/courses")({
  head: () => ({ meta: [{ title: "Courses · CodePath" }] }),
  component: CoursesPage,
});

type State = "active" | "locked" | "complete" | "new";

const courses: {
  name: string; icon: LucideIcon; difficulty: "Beginner" | "Intermediate";
  hours: string; progress: number; state: State; accent: string;
}[] = [
  { name: "Java OOP", icon: Coffee, difficulty: "Intermediate", hours: "18h", progress: 45, state: "active", accent: "text-warning bg-warning/15" },
  { name: "C++ Data Structures", icon: Boxes, difficulty: "Intermediate", hours: "26h", progress: 12, state: "active", accent: "text-primary bg-primary/15" },
  { name: "Algorithms", icon: Network, difficulty: "Intermediate", hours: "32h", progress: 0, state: "locked", accent: "text-muted-foreground bg-muted" },
  { name: "Git & GitHub", icon: GitBranch, difficulty: "Beginner", hours: "6h", progress: 100, state: "complete", accent: "text-success bg-success/15" },
  { name: "Web Development", icon: Globe, difficulty: "Beginner", hours: "22h", progress: 0, state: "new", accent: "text-[oklch(0.7_0.18_200)] bg-[oklch(0.7_0.18_200)]/15" },
  { name: "Problem Solving", icon: Brain, difficulty: "Beginner", hours: "14h", progress: 0, state: "new", accent: "text-[oklch(0.7_0.18_300)] bg-[oklch(0.7_0.18_300)]/15" },
];

function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">Project-based curriculum, designed for beginners and CS students.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c, i) => {
          const locked = c.state === "locked";
          return (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
            >
              <Card className={`p-6 h-full transition-all hover:border-primary/40 hover:shadow-md ${locked ? "opacity-70" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.accent}`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  {c.state === "complete" && <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>}
                  {c.state === "locked" && <Badge variant="muted"><Lock className="w-3 h-3" /> Locked</Badge>}
                  {c.state === "active" && <Badge variant="info">In progress</Badge>}
                  {c.state === "new" && <Badge>New</Badge>}
                </div>

                <h3 className="mt-4 font-semibold text-lg tracking-tight">{c.name}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{c.difficulty}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {c.hours}</span>
                </div>

                <div className="mt-5">
                  {c.state !== "locked" && c.state !== "new" && (
                    <>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Progress</span><span>{c.progress}%</span>
                      </div>
                      <Progress value={c.progress} />
                    </>
                  )}
                  {c.state === "new" && <div className="h-6 text-xs text-muted-foreground">Not started</div>}
                  {c.state === "locked" && <div className="h-6 text-xs text-muted-foreground">Complete prerequisites to unlock</div>}
                </div>

                <Btn
                  className="mt-4 w-full"
                  variant={c.state === "complete" ? "outline" : "primary"}
                  disabled={locked}
                >
                  {c.state === "complete" ? "Review" : c.state === "active" ? "Continue" : "Start"}
                  {!locked && <ArrowRight className="w-4 h-4" />}
                </Btn>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
