import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Cpu, GitBranch, Boxes, BarChart3 } from "lucide-react";
import { Card, Btn, Badge } from "@/components/ui-kit";

export const Route = createFileRoute("/visual")({
  head: () => ({ meta: [{ title: "Visual Learning · CodePath" }] }),
  component: VisualPage,
});

type Tab = "sort" | "recursion" | "memory" | "git";

function VisualPage() {
  const [tab, setTab] = useState<Tab>("sort");

  const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: "sort", label: "Sorting", icon: BarChart3 },
    { id: "recursion", label: "Recursion Tree", icon: Cpu },
    { id: "memory", label: "Memory Diagram", icon: Boxes },
    { id: "git", label: "Git Branching", icon: GitBranch },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Visual Learning Playground</h1>
        <p className="text-sm text-muted-foreground mt-1">See how it works before you write it.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
            {tab === t.id && (
              <motion.span layoutId="vis-tab" className="absolute -bottom-px inset-x-0 h-0.5 bg-primary rounded-t" />
            )}
          </button>
        ))}
      </div>

      {tab === "sort" && <SortViz />}
      {tab === "recursion" && <RecursionViz />}
      {tab === "memory" && <MemoryViz />}
      {tab === "git" && <GitViz />}
    </div>
  );
}

/* -------------------- Bubble sort -------------------- */
function SortViz() {
  const [arr, setArr] = useState<number[]>(() => shuffle([8, 3, 5, 1, 7, 2, 9, 4, 6]));
  const [running, setRunning] = useState(false);
  const [hl, setHl] = useState<[number, number] | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const state = useRef({ i: 0, j: 0 });

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const step = () => {
    setArr((a) => {
      const n = a.length;
      const { i, j } = state.current;
      if (i >= n - 1) { setRunning(false); setHl(null); return a; }
      const copy = a.slice();
      setHl([j, j + 1]);
      if (copy[j] > copy[j + 1]) [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
      if (j + 1 >= n - 1 - i) { state.current = { i: i + 1, j: 0 }; }
      else state.current = { i, j: j + 1 };
      return copy;
    });
  };

  useEffect(() => {
    if (!running) return;
    timer.current = setTimeout(step, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [arr, running]);

  const reset = () => {
    setRunning(false);
    state.current = { i: 0, j: 0 };
    setHl(null);
    setArr(shuffle([8, 3, 5, 1, 7, 2, 9, 4, 6]));
  };

  const max = Math.max(...arr);
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="font-semibold">Bubble Sort</div>
          <div className="text-xs text-muted-foreground mt-0.5">Compares adjacent items, swaps if out of order. O(n²)</div>
        </div>
        <div className="flex gap-2">
          <Btn size="sm" variant="outline" onClick={reset}><RotateCcw className="w-3.5 h-3.5" /> Reset</Btn>
          <Btn size="sm" onClick={() => setRunning((r) => !r)}>
            {running ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Run</>}
          </Btn>
        </div>
      </div>
      <div className="h-56 flex items-end justify-center gap-2 px-2">
        {arr.map((v, i) => {
          const isHl = hl?.includes(i);
          return (
            <motion.div
              key={i}
              layout
              className={`w-9 rounded-t-md flex items-end justify-center text-xs font-mono pb-1 ${
                isHl ? "bg-warning text-warning-foreground" : "bg-primary/80 text-primary-foreground"
              }`}
              animate={{ height: `${(v / max) * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >{v}</motion.div>
          );
        })}
      </div>
    </Card>
  );
}

function shuffle<T>(a: T[]) { return a.slice().sort(() => Math.random() - 0.5); }

/* -------------------- Recursion tree -------------------- */
function RecursionViz() {
  type Node = { v: number; l?: Node; r?: Node };
  const build = (n: number): Node => n <= 1 ? { v: n } : { v: n, l: build(n - 1), r: build(n - 2) };
  const tree = build(5);

  const render = (n: Node, depth = 0): React.ReactElement => (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: depth * 0.05 }}
        className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-mono border ${
          n.v <= 1 ? "bg-success/15 text-success border-success/40" : "bg-primary/15 text-primary border-primary/30"
        }`}
      >fib({n.v})</motion.div>
      {(n.l || n.r) && (
        <>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-start gap-4 relative">
            {n.l && render(n.l, depth + 1)}
            {n.r && render(n.r, depth + 1)}
          </div>
        </>
      )}
    </div>
  );

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="font-semibold">Fibonacci Recursion Tree</div>
          <div className="text-xs text-muted-foreground mt-0.5">Each call branches into <code className="font-mono">fib(n-1)</code> + <code className="font-mono">fib(n-2)</code> until base cases.</div>
        </div>
        <Badge variant="success">O(2ⁿ) without memo</Badge>
      </div>
      <div className="overflow-x-auto pb-4">
        <div className="min-w-max flex justify-center">{render(tree)}</div>
      </div>
    </Card>
  );
}

/* -------------------- Memory diagram -------------------- */
function MemoryViz() {
  return (
    <Card className="p-6">
      <div className="font-semibold mb-1">Stack & Heap Memory</div>
      <div className="text-xs text-muted-foreground mb-5">A variable on the stack pointing to an object allocated on the heap.</div>
      <div className="grid md:grid-cols-2 gap-6 relative">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Stack</div>
          <div className="space-y-2">
            {[
              { name: "main()", val: "" },
              { name: "user", val: "→ 0x4a2f", id: "stack-ptr" },
              { name: "count", val: "42" },
            ].map((r) => (
              <div key={r.name} id={r.id} className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border bg-muted/40 font-mono text-sm">
                <span className="text-muted-foreground">{r.name}</span>
                <span className={r.id ? "text-primary" : ""}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Heap</div>
          <motion.div
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            id="heap-obj"
            className="p-4 rounded-lg border border-primary/40 bg-primary/5 font-mono text-sm"
          >
            <div className="text-xs text-muted-foreground mb-2">0x4a2f — User</div>
            <div>name: <span className="text-success">"Alex"</span></div>
            <div>xp: <span className="text-warning">2840</span></div>
            <div>streak: <span className="text-warning">7</span></div>
          </motion.div>
        </div>
        {/* Arrow */}
        <svg className="hidden md:block absolute pointer-events-none" style={{ left: "47%", top: "78px", width: "10%", height: "40px" }} viewBox="0 0 100 40">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
            </marker>
          </defs>
          <path d="M5 20 L 90 20" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arr)" className="text-primary" />
        </svg>
      </div>
    </Card>
  );
}

/* -------------------- Git graph -------------------- */
function GitViz() {
  const commits = [
    { id: "a1", branch: "main", x: 1, y: 0, label: "init" },
    { id: "a2", branch: "main", x: 1, y: 1, label: "setup" },
    { id: "b1", branch: "feature", x: 3, y: 2, label: "feat: ui" },
    { id: "b2", branch: "feature", x: 3, y: 3, label: "feat: api" },
    { id: "a3", branch: "main", x: 1, y: 4, label: "merge" },
  ];
  const scale = 60;
  const w = 360, h = (commits.length + 1) * scale;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-semibold">Git Branching Graph</div>
          <div className="text-xs text-muted-foreground mt-0.5">A feature branch diverges from <code className="font-mono">main</code> and merges back.</div>
        </div>
        <div className="flex gap-2">
          <Badge variant="info">main</Badge>
          <Badge variant="warning">feature</Badge>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-md mx-auto">
        {/* main line */}
        <line x1={1 * scale + 20} y1={0} x2={1 * scale + 20} y2={h} stroke="currentColor" className="text-primary/60" strokeWidth="2" />
        {/* feature branch lines */}
        <path d={`M ${1 * scale + 20} ${1.5 * scale} C ${1 * scale + 20} ${2 * scale}, ${3 * scale + 20} ${1.5 * scale}, ${3 * scale + 20} ${2 * scale}`}
          stroke="currentColor" className="text-warning/70" strokeWidth="2" fill="none" />
        <line x1={3 * scale + 20} y1={2 * scale} x2={3 * scale + 20} y2={3 * scale} stroke="currentColor" className="text-warning/70" strokeWidth="2" />
        <path d={`M ${3 * scale + 20} ${3 * scale} C ${3 * scale + 20} ${4 * scale}, ${1 * scale + 20} ${3.5 * scale}, ${1 * scale + 20} ${4 * scale}`}
          stroke="currentColor" className="text-warning/70" strokeWidth="2" fill="none" />

        {commits.map((c, i) => (
          <g key={c.id}>
            <motion.circle
              cx={c.x * scale + 20} cy={c.y * scale + 20}
              r={10}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
              className={c.branch === "main" ? "fill-primary" : "fill-warning"}
            />
            <text x={c.x * scale + 40} y={c.y * scale + 24} className="fill-foreground" fontSize="11" fontFamily="monospace">
              {c.id} <tspan className="fill-muted-foreground">· {c.label}</tspan>
            </text>
          </g>
        ))}
      </svg>
    </Card>
  );
}
