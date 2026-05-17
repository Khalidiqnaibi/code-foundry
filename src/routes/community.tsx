import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GitPullRequest, MessageSquare, Users, Star, ArrowRight } from "lucide-react";
import { Card, Btn, Badge } from "@/components/ui-kit";

export const Route = createFileRoute("/community")({
  head: () => ({ meta: [{ title: "Community & Projects · CodePath" }] }),
  component: CommunityPage,
});

const projects = [
  { name: "URL Shortener API", tags: ["Node", "Postgres"], members: 4, stars: 28, open: 3 },
  { name: "Realtime Chat", tags: ["React", "WebSocket"], members: 3, stars: 41, open: 2 },
  { name: "Markdown Notes", tags: ["TypeScript", "Tauri"], members: 2, stars: 12, open: 5 },
  { name: "Mini Compiler", tags: ["Rust"], members: 5, stars: 64, open: 1 },
  { name: "Habit Tracker", tags: ["Next.js"], members: 3, stars: 19, open: 4 },
  { name: "Algorithm Visualizer", tags: ["Canvas", "TS"], members: 4, stars: 88, open: 2 },
];

function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Collaborative Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Join a team building something real. Practice PRs, code review, and shipping.</p>
        </div>
        <Btn>Start a project <ArrowRight className="w-4 h-4" /></Btn>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -3 }}>
            <Card className="p-5 h-full hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between">
                <div className="font-semibold">{p.name}</div>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Star className="w-3 h-3" /> {p.stars}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((t) => <Badge key={t} variant="muted">{t}</Badge>)}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="w-3 h-3" /> {p.members} members</span>
                <span className="inline-flex items-center gap-1"><GitPullRequest className="w-3 h-3" /> {p.open} open PRs</span>
                <span className="inline-flex items-center gap-1"><MessageSquare className="w-3 h-3" /> active</span>
              </div>
              <Btn variant="outline" className="mt-4 w-full">Join team</Btn>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
