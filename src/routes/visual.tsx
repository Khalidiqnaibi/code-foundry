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
const SORT_VALUES = [8, 3, 5, 1, 7, 2, 9, 4, 6];
type SortState = { arr: number[]; i: number; j: number; hl: [number, number] | null; done: boolean };

const createSortState = (arr = SORT_VALUES): SortState => ({ arr, i: 0, j: 0, hl: null, done: false });

function SortViz() {
  const [sort, setSort] = useState<SortState>(() => createSortState());
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { arr, hl } = sort;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const step = React.useCallback(() => {
    setSort((current) => {
      const n = current.arr.length;
      if (current.done || current.i >= n - 1) return { ...current, hl: null, done: true };

      const nextArr = current.arr.slice();
      const active: [number, number] = [current.j, current.j + 1];
      if (nextArr[current.j] > nextArr[current.j + 1]) {
        [nextArr[current.j], nextArr[current.j + 1]] = [nextArr[current.j + 1], nextArr[current.j]];
      }

      const endOfPass = current.j + 1 >= n - 1 - current.i;
      const nextI = endOfPass ? current.i + 1 : current.i;
      const nextJ = endOfPass ? 0 : current.j + 1;
      const done = nextI >= n - 1;

      return { arr: nextArr, i: nextI, j: nextJ, hl: done ? null : active, done };
    });
  }, []);

  useEffect(() => {
    if (!running || sort.done) return;
    timer.current = setTimeout(step, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [running, sort, step]);

  useEffect(() => {
    if (sort.done && running) setRunning(false);
  }, [running, sort.done]);

  const reset = () => {
    setRunning(false);
    setSort(createSortState(shuffle(SORT_VALUES)));
  };

  const toggleRun = () => {
    if (running) {
      setRunning(false);
      return;
    }

    if (sort.done) setSort(createSortState(shuffle(SORT_VALUES)));
    setRunning(true);
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
          <Btn size="sm" onClick={toggleRun}>
            {running ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Run</>}
          </Btn>
        </div>
      </div>
      <div className="h-56 flex items-end justify-center gap-2 px-2">
        {arr.map((v, i) => {
          const isHl = hl?.includes(i);
          return (
            <motion.div
              key={v}
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
type FibNode = { id: string; v: number; depth: number; x: number; l?: FibNode; r?: FibNode };

function layoutFib(n: number): { root: FibNode; width: number; depth: number } {
  let leafIdx = 0;
  let maxDepth = 0;
  const build = (v: number, depth: number, path: string): FibNode => {
    maxDepth = Math.max(maxDepth, depth);
    if (v <= 1) {
      const x = leafIdx++;
      return { id: path, v, depth, x };
    }
    const l = build(v - 1, depth + 1, path + "L");
    const r = build(v - 2, depth + 1, path + "R");
    return { id: path, v, depth, x: (l.x + r.x) / 2, l, r };
  };
  const root = build(n, 0, "R");
  return { root, width: leafIdx, depth: maxDepth };
}

function RecursionViz() {
  const [n, setN] = useState(5);
  const { root, width, depth } = layoutFib(n);
  const colW = 56;
  const rowH = 78;
  const padX = 28;
  const padY = 28;
  const svgW = Math.max(320, width * colW + padX * 2);
  const svgH = (depth + 1) * rowH + padY * 2;

  const nodes: FibNode[] = [];
  const edges: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  const walk = (node: FibNode) => {
    nodes.push(node);
    const px = padX + node.x * colW + colW / 2;
    const py = padY + node.depth * rowH;
    for (const c of [node.l, node.r]) {
      if (!c) continue;
      const cx = padX + c.x * colW + colW / 2;
      const cy = padY + c.depth * rowH;
      edges.push({ x1: px, y1: py + 18, x2: cx, y2: cy - 18, key: node.id + "-" + c.id });
      walk(c);
    }
  };
  walk(root);

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="font-semibold">Fibonacci Recursion Tree</div>
          <div className="text-xs text-muted-foreground mt-0.5">Each call branches into <code className="font-mono">fib(n-1)</code> + <code className="font-mono">fib(n-2)</code>.</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-md border border-border overflow-hidden">
            {[3, 4, 5, 6].map((k) => (
              <button
                key={k}
                onClick={() => setN(k)}
                className={`px-2.5 py-1 text-xs font-mono transition-colors ${
                  n === k ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                }`}
              >fib({k})</button>
            ))}
          </div>
          <Badge variant="success">O(2ⁿ)</Badge>
        </div>
      </div>
      <div className="overflow-x-auto pb-2">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="max-w-full h-auto block mx-auto">
          {edges.map((e, i) => (
            <motion.line
              key={e.key}
              x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="currentColor" className="text-border" strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.03 * i, duration: 0.25 }}
            />
          ))}
          {nodes.map((nd, i) => {
            const cx = padX + nd.x * colW + colW / 2;
            const cy = padY + nd.depth * rowH;
            const isBase = nd.v <= 1;
            return (
              <motion.g
                key={nd.id}
                initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.03 * i, type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                <circle
                  cx={cx} cy={cy} r={18}
                  className={isBase ? "fill-success/15 stroke-success/50" : "fill-primary/15 stroke-primary/40"}
                  strokeWidth="1.5"
                />
                <text
                  x={cx} y={cy + 4} textAnchor="middle"
                  className={`font-mono text-[11px] ${isBase ? "fill-success" : "fill-primary"}`}
                >fib({nd.v})</text>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}

/* -------------------- Memory diagram -------------------- */
function MemoryViz() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ptrRef = useRef<HTMLDivElement>(null);
  const heapRef = useRef<HTMLDivElement>(null);
  const [arrow, setArrow] = useState<{ d: string } | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useEffect(() => {
    const compute = () => {
      const c = containerRef.current;
      const p = ptrRef.current;
      const h = heapRef.current;
      if (!c || !p || !h) return;
      const cb = c.getBoundingClientRect();
      const pb = p.getBoundingClientRect();
      const hb = h.getBoundingClientRect();
      setSize({ w: cb.width, h: cb.height });
      const stacked = hb.top >= pb.bottom - 2;
      let x1: number, y1: number, x2: number, y2: number, d: string;
      if (stacked) {
        x1 = pb.left + pb.width / 2 - cb.left;
        y1 = pb.bottom - cb.top;
        x2 = hb.left + hb.width / 2 - cb.left;
        y2 = hb.top - cb.top;
        const my = (y1 + y2) / 2;
        d = `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
      } else {
        x1 = pb.right - cb.left;
        y1 = pb.top + pb.height / 2 - cb.top;
        x2 = hb.left - cb.left;
        y2 = hb.top + 24 - cb.top;
        const mx = (x1 + x2) / 2;
        d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
      }
      setArrow({ d });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    if (heapRef.current) ro.observe(heapRef.current);
    window.addEventListener("resize", compute);
    return () => { ro.disconnect(); window.removeEventListener("resize", compute); };
  }, []);

  return (
    <Card className="p-4 sm:p-6">
      <div className="font-semibold mb-1">Stack & Heap Memory</div>
      <div className="text-xs text-muted-foreground mb-5">A variable on the stack pointing to an object allocated on the heap.</div>
      <div ref={containerRef} className="grid md:grid-cols-2 gap-8 md:gap-10 relative">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Stack</div>
          <div className="space-y-2">
            <MemRow name="main()" val="" />
            <div ref={ptrRef}>
              <MemRow name="user" val="→ 0x4a2f" highlight />
            </div>
            <MemRow name="count" val="42" />
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Heap</div>
          <motion.div
            ref={heapRef}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-lg border border-primary/40 bg-primary/5 font-mono text-sm"
          >
            <div className="text-xs text-muted-foreground mb-2">0x4a2f — User</div>
            <div>name: <span className="text-success">"Alex"</span></div>
            <div>xp: <span className="text-warning">2840</span></div>
            <div>streak: <span className="text-warning">7</span></div>
          </motion.div>
        </div>
        {arrow && size.w > 0 && (
          <svg
            className="absolute inset-0 pointer-events-none text-primary"
            width={size.w} height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            <defs>
              <marker id="mem-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
              </marker>
            </defs>
            <motion.path
              d={arrow.d}
              stroke="currentColor" strokeWidth="1.5" fill="none"
              markerEnd="url(#mem-arr)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
            />
          </svg>
        )}
      </div>
    </Card>
  );
}

function MemRow({ name, val, highlight }: { name: string; val: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-md border border-border bg-muted/40 font-mono text-sm">
      <span className="text-muted-foreground">{name}</span>
      <span className={highlight ? "text-primary" : ""}>{val}</span>
    </div>
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
