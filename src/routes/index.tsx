import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, Sparkles, Bug, GitBranch, Eye, FolderKanban, GitPullRequest, Users, CheckCircle2, Circle,
} from "lucide-react";
import { Btn, Card, Badge } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodePath — Learn Real Programming Skills" },
      { name: "description", content: "Interactive platform with AI feedback, visual algorithms, and project-based learning for CS students." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Eye, title: "Visualized Concepts", desc: "Watch algorithms come to life with interactive animations." },
  { icon: Bug, title: "Debugging Assistant", desc: "Step through your code with intelligent breakpoints." },
  { icon: Sparkles, title: "AI Hints", desc: "Get contextual nudges instead of full spoilers." },
  { icon: GitBranch, title: "Git Workflow Simulation", desc: "Practice real branching, PRs, and merges safely." },
  { icon: FolderKanban, title: "Project-Based Learning", desc: "Build real apps to apply every concept you learn." },
  { icon: Users, title: "Collaborative Teams", desc: "Pair with peers on team projects and reviews." },
];

function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg grid-bg-fade pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[oklch(0.65_0.2_200)]/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge variant="info" className="mb-5">
              <Sparkles className="w-3 h-3" /> New: AI-powered code review
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Learn <span className="text-gradient">Real Programming</span> Skills
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
              Short concept videos, interactive coding labs, and an AI mentor that
              actually reviews your code. From your first variable to your capstone project.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/lab">
                <Btn size="lg">Start Coding Free <ArrowRight className="w-4 h-4" /></Btn>
              </Link>
              <Link to="/courses">
                <Btn size="lg" variant="outline">Explore Courses</Btn>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> No credit card</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 30+ hands-on labs</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Trusted by 12k+ students</div>
            </div>
          </motion.div>

          {/* Code preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-12 max-w-3xl"
          >
            <Card className="overflow-hidden shadow-xl">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/40">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">fibonacci.py</span>
              </div>
              <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
<span className="text-muted-foreground"># Compute the nth Fibonacci number</span>{"\n"}
<span className="text-[oklch(0.7_0.18_300)]">def</span> <span className="text-[oklch(0.7_0.18_200)]">fib</span>(n):{"\n"}
{"    "}<span className="text-[oklch(0.7_0.18_300)]">if</span> n {"<"}= <span className="text-warning">1</span>: <span className="text-[oklch(0.7_0.18_300)]">return</span> n{"\n"}
{"    "}<span className="text-[oklch(0.7_0.18_300)]">return</span> fib(n - <span className="text-warning">1</span>) + fib(n - <span className="text-warning">2</span>){"\n"}{"\n"}
<span className="text-success">{"// ✓ AI: Try memoization to bring this to O(n)"}</span>
              </pre>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to actually learn</h2>
          <p className="mt-3 text-muted-foreground">Not just videos. A complete loop of watch → build → review.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <Card className="p-6 h-full transition-colors hover:border-primary/40">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <div className="font-semibold">{f.title}</div>
                <div className="mt-1.5 text-sm text-muted-foreground">{f.desc}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community teaser */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Learn by building, together</h2>
              <p className="mt-2 text-muted-foreground">Join collaborative projects with built-in PR reviews.</p>
            </div>
            <Link to="/community"><Btn variant="outline">Browse projects <ArrowRight className="w-4 h-4" /></Btn></Link>
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-4">
            {/* Mini kanban */}
            <Card className="p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium">URL Shortener · sprint 3</div>
                <Badge variant="info">in progress</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { col: "Todo", items: ["Rate limiter", "Analytics page"] },
                  { col: "In Progress", items: ["Auth flow"] },
                  { col: "Done", items: ["Schema", "Hashing util"] },
                ].map((c) => (
                  <div key={c.col} className="rounded-lg bg-muted/50 p-2.5">
                    <div className="text-xs font-medium text-muted-foreground mb-2 px-1">{c.col}</div>
                    <div className="space-y-2">
                      {c.items.map((it) => (
                        <div key={it} className="rounded-md bg-card border border-border p-2.5 text-xs">
                          {it}
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)]" />
                            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-warning to-destructive -ml-2 border border-card" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* PRs */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <GitPullRequest className="w-4 h-4 text-success" />
                <div className="font-medium">Open Pull Requests</div>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { t: "Add rate limiting middleware", who: "@maya", open: true },
                  { t: "Refactor auth utils", who: "@dev_jin", open: true },
                  { t: "Fix flaky tests", who: "@sam", open: false },
                ].map((p) => (
                  <div key={p.t} className="flex items-start gap-2.5">
                    {p.open ? <GitPullRequest className="w-4 h-4 text-success mt-0.5" /> : <Circle className="w-4 h-4 text-muted-foreground mt-0.5" />}
                    <div>
                      <div>{p.t}</div>
                      <div className="text-xs text-muted-foreground">{p.who}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Join card */}
          <Card className="mt-4 p-6 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-card to-[oklch(0.65_0.2_200)]/10 border-primary/30">
            <div>
              <div className="font-semibold">Join a Project Team</div>
              <div className="text-sm text-muted-foreground">Get matched with peers building real apps this week.</div>
            </div>
            <Btn>Find my team <ArrowRight className="w-4 h-4" /></Btn>
          </Card>
        </div>
      </section>
    </div>
  );
}
