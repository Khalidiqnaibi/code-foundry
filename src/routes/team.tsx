import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Code2, Github, Linkedin } from "lucide-react";
import { Card, Badge } from "@/components/ui-kit";
import logo from "@/assets/logo.jpg";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "The Team · CodePath" },
      { name: "description", content: "Meet the team that built CodePath." },
    ],
  }),
  component: TeamPage,
});

const team = [
  { name: "Khalid Iqnaibi", role: "Full-Stack Developer", initials: "KI", accent: "from-primary to-[oklch(0.65_0.2_240)]" },
  { name: "Alaa Albustanji", role: "Frontend & UX", initials: "AA", accent: "from-[oklch(0.7_0.18_300)] to-[oklch(0.65_0.2_260)]" },
  { name: "Seba Awwad", role: "Product & Design", initials: "SA", accent: "from-[oklch(0.7_0.18_200)] to-primary" },
  { name: "Aseel Shalalfeh", role: "Backend & Data", initials: "AS", accent: "from-success to-[oklch(0.7_0.18_180)]" },
  { name: "Ameer Salhab", role: "Engineering & QA", initials: "AS", accent: "from-warning to-[oklch(0.7_0.2_40)]" },
];

function TeamPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="CodePath logo"
            className="h-20 md:h-24 w-auto rounded-xl shadow-lg shadow-primary/10"
          />
        </div>
        <Badge variant="info" className="mb-4">
          <Code2 className="w-3 h-3" /> Built by
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          The <span className="text-gradient">CodePath</span> Team
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          A small crew of builders, designers, and learners crafting a better way to
          learn programming.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
          >
            <Card className="p-6 h-full hover:border-primary/40 hover:shadow-lg transition-all">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.accent} flex items-center justify-center text-white text-xl font-semibold shadow-md`}
              >
                {m.initials}
              </div>
              <h3 className="mt-5 font-semibold text-lg tracking-tight">{m.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
              <div className="mt-4 flex gap-2">
                <a
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
