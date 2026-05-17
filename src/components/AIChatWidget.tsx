import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const seed: Msg[] = [
  { role: "ai", text: "Hi Alex! I'm your AI mentor. Ask me anything — concepts, debugging, or *code reviews*." },
];

const canned: Record<string, string> = {
  default:
    "Great question. Here's a quick approach:\n\n1. **Restate the problem** in your own words\n2. **Sketch inputs/outputs**\n3. Pick a data structure that fits the operations you need most\n\nWant me to walk through a specific example?",
  recursion:
    "Recursion = a function that calls itself on a smaller subproblem.\n\n```py\ndef fact(n):\n    if n <= 1: return 1\n    return n * fact(n-1)\n```\n\nAlways define a **base case** first.",
};

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const key = t.toLowerCase().includes("recursion") ? "recursion" : "default";
      setMsgs((m) => [...m, { role: "ai", text: canned[key] }]);
      setLoading(false);
    }, 700);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.2_200)] text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Open AI mentor"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-30 w-[360px] max-w-[calc(100vw-3rem)] h-[460px] rounded-xl border border-border bg-popover shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary/15 text-primary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">AI Mentor</div>
                  <div className="text-[10px] text-success">● online</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-accent"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>{m.text}</div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-border flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 h-9 px-3 rounded-md bg-muted/60 border border-transparent focus:bg-background focus:border-border focus:outline-none text-sm"
              />
              <button type="submit" className="h-9 w-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
