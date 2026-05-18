import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, RotateCcw, Maximize2, Sparkles, CheckCircle2, AlertCircle,
  Loader2, Lightbulb, ChevronRight, FileCode2,
} from "lucide-react";
import { Card, Btn, Badge } from "@/components/ui-kit";

export const Route = createFileRoute("/lab")({
  head: () => ({ meta: [{ title: "Interactive Lab · CodePath" }] }),
  component: LabPage,
});

const concepts = [
  { id: 1, title: "Variables & Functions", type: "Concept", duration: "4:32" },
  { id: 2, title: "Conditionals", type: "Concept", duration: "3:50" },
  { id: 3, title: "Loops", type: "Concept", duration: "5:10" },
  { id: 4, title: "Capstone: Tip Calculator", type: "Capstone", duration: "12:00" },
];

const starter = `// Concept 1: Variables & Functions
// Write a function 'greet(name)' that returns "Hello, <name>!"

function greet(name) {
  // your code here
}

console.log(greet("Alex"));`;

const capstoneStarter = `// Capstone: Tip Calculator
// Build it from scratch. The AI will guide each submission.

`;

type Eval = null | { ok: boolean; msg: string; advice: string };

function LabPage() {
  const [active, setActive] = useState(concepts[0]);
  const [code, setCode] = useState(starter);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Eval>(null);

  const isCapstone = active.type === "Capstone";

  const onSelect = (c: typeof concepts[number]) => {
    setActive(c);
    setCode(c.type === "Capstone" ? capstoneStarter : starter);
    setResult(null);
  };

  const submit = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const ok = code.includes("return") && code.includes("Hello") || isCapstone && code.trim().length > 40;
      setResult(
        ok
          ? { ok: true, msg: "All tests passed (3/3). Nice work.", advice: "Consider extracting magic strings into constants. For larger programs, template literals (`Hello, ${name}!`) read cleaner than concatenation." }
          : { ok: false, msg: "Test failed: greet(\"Alex\") returned undefined.", advice: "You're missing a return statement inside greet. Functions return undefined by default — explicitly return the greeting string." }
      );
      setLoading(false);
    }, 1100);
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-3.5rem)]">
      {/* Lesson stepper */}
      <div className="border-b border-border px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-muted-foreground mr-2 shrink-0">Lesson flow:</span>
        {concepts.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              active.id === c.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              active.id === c.id ? "bg-primary-foreground/20" : "bg-muted"
            }`}>{i + 1}</span>
            {c.title}
            {i < concepts.length - 1 && <ChevronRight className="w-3 h-3 opacity-50 -mr-1" />}
          </button>
        ))}
      </div>

      <div className="flex-1 grid lg:grid-cols-2 lg:min-h-0">
        {/* Left: video + theory */}
        <div className="border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={isCapstone ? "warning" : "info"}>{active.type}</Badge>
              <span className="text-xs text-muted-foreground">{active.duration}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{active.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isCapstone ? "Full-project lesson: write the code from scratch with step-by-step AI guidance." : "Short concept video — then apply it in a small challenge."}
            </p>

            {/* Video player */}
            <div className="mt-4 aspect-video rounded-xl border border-border bg-gradient-to-br from-muted to-card relative overflow-hidden group">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                >
                  <Play className="w-7 h-7 ml-1" />
                </motion.button>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full w-1/4 bg-primary" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/80 mt-1.5">
                  <span>1:08 / {active.duration}</span>
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Challenge */}
            <Card className="mt-5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-warning/15 text-warning flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm">Small Code Challenge</div>
              </div>
              {isCapstone ? (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Build a <span className="text-foreground font-medium">tip calculator</span> from scratch. It should:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Accept a bill amount and tip percentage</li>
                    <li>Return total per person for a given party size</li>
                    <li>Round amounts to 2 decimals</li>
                  </ul>
                  <p className="text-xs">Submit at any time — the AI will guide you step by step.</p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Write a function <code className="font-mono text-foreground bg-muted px-1 rounded">greet(name)</code> that returns the string <code className="font-mono text-foreground bg-muted px-1 rounded">"Hello, &lt;name&gt;!"</code>.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Must <span className="text-foreground">return</span>, not log</li>
                    <li>Use template literals or concatenation</li>
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right: editor + AI */}
        <div className="flex flex-col lg:min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <FileCode2 className="w-4 h-4" /> challenge.js
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setCode(isCapstone ? capstoneStarter : starter)} className="p-1.5 rounded hover:bg-accent" title="Reset">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-card">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[260px] p-4 font-mono text-sm bg-transparent focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* AI Eval */}
          <div className="border-t border-border p-4 bg-muted/20 lg:max-h-[55%] lg:overflow-y-auto shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">AI Evaluator</span>
              </div>
              <Btn onClick={submit} disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Evaluating…</> : "Submit Code"}
              </Btn>
            </div>

            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-xs text-muted-foreground">
                  Submit your code and the AI will validate and give feedback.
                </motion.div>
              )}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <div className="h-3 rounded bg-muted animate-pulse w-3/4" />
                  <div className="h-3 rounded bg-muted animate-pulse w-1/2" />
                </motion.div>
              )}
              {result && (
                <motion.div key={result.ok ? "ok" : "err"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${
                    result.ok
                      ? "bg-success/10 border-success/30 text-success"
                      : "bg-destructive/10 border-destructive/30 text-destructive"
                  }`}>
                    {result.ok ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                    <div className="text-sm font-medium">{result.msg}</div>
                  </div>
                  <Card className="p-3.5 border-primary/30">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold">AI Advice</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.advice}</p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
