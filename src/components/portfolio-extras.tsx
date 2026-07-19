import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Send, X, Sun, Moon, Sparkles, BookOpen, ArrowUpRight } from "lucide-react";
import { askAssistant } from "@/lib/chat.functions";

/* ---------------- Lenis smooth scroll ---------------- */
export function SmoothScroll() {
  useEffect(() => {
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    (async () => {
      const { default: Lenis } = await import("lenis");
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    })();
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  return null;
}

/* ---------------- Custom cursor ---------------- */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = 0, y = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
    };
    let raf = 0;
    const tick = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      raf = requestAnimationFrame(tick);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const int = t.closest("a,button,[role=button],input,textarea");
      if (ring.current) ring.current.style.transform += int ? " scale(1.6)" : "";
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div ref={ring} className="pointer-events-none fixed top-0 left-0 z-[300] h-8 w-8 rounded-full border border-cyber-cyan/60 mix-blend-difference hidden md:block transition-transform duration-100" />
      <div ref={dot} className="pointer-events-none fixed top-0 left-0 z-[300] h-1.5 w-1.5 rounded-full bg-cyber-cyan hidden md:block" />
    </>
  );
}

/* ---------------- Theme toggle ---------------- */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const d = saved ? saved === "dark" : true;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme"
      className="fixed bottom-6 left-6 z-[80] h-11 w-11 rounded-full glass-strong border border-white/10 grid place-items-center hover-glow">
      {dark ? <Sun className="h-4 w-4 text-cyber-cyan" /> : <Moon className="h-4 w-4 text-cyber-purple" />}
    </button>
  );
}

/* ---------------- Blog / Articles ---------------- */
const ARTICLES = [
  { title: "Zero-Downtime EKS Upgrades with Karpenter", tag: "Kubernetes", read: "8 min",
    excerpt: "A production playbook for rolling control-plane and node upgrades without SLO impact." },
  { title: "GitOps at Scale: Argo CD ApplicationSets", tag: "GitOps", read: "6 min",
    excerpt: "Managing hundreds of environments with pull-request driven promotions and Kustomize overlays." },
  { title: "Shift-Left DevSecOps in GitHub Actions", tag: "Security", read: "10 min",
    excerpt: "Wiring Trivy, Snyk, Checkov and SBOM generation into a single reusable workflow." },
  { title: "Cutting AWS Spend 30% Without Layoffs", tag: "FinOps", read: "7 min",
    excerpt: "Karpenter spot pools, right-sizing signals, and the dashboards that make cost visible to devs." },
  { title: "Terraform Modules That Don't Suck", tag: "IaC", read: "9 min",
    excerpt: "Composable modules, contract testing, and a versioning strategy your platform team will thank you for." },
  { title: "Prometheus SLOs for Multi-Tenant Platforms", tag: "Observability", read: "8 min",
    excerpt: "Burn-rate alerts, error budgets, and how to tell noise from a real incident." },
];

export function Blog() {
  return (
    <section id="blog" className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="font-mono text-xs text-cyber-cyan mb-2">$ cat ~/blog/index.md</div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">Featured Articles</h2>
            <p className="mt-2 text-muted-foreground max-w-xl">Notes from the trenches — Kubernetes, GitOps, DevSecOps, and platform engineering.</p>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 text-sm text-cyber-cyan hover:underline">
            <BookOpen className="h-4 w-4" /> Subscribe for updates
          </a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTICLES.map((a, i) => (
            <motion.article key={a.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group glass rounded-2xl p-6 border border-white/10 hover-glow cursor-pointer">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="px-2 py-1 rounded-full bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30">{a.tag}</span>
                <span>{a.read} read</span>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-gradient transition">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
              <div className="mt-5 flex items-center gap-1 text-xs text-cyber-cyan">
                Read article <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- AI Assistant widget ---------------- */
type Msg = { role: "user" | "assistant"; content: string };

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi 👋 I'm Lokesh's AI assistant. Ask me about his experience, stack, projects, or availability." },
  ]);
  const bottom = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askAssistant);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", content: q }]);
    setBusy(true);
    try {
      const res = await ask({ data: { message: q } });
      setMsgs(m => [...m, { role: "assistant", content: res.reply }]);
    } catch (e) {
      setMsgs(m => [...m, { role: "assistant", content: "Sorry — the assistant is unavailable right now. Please email grlokesh96@gmail.com." }]);
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: "spring" }}
        onClick={() => setOpen(v => !v)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-[90] h-14 w-14 rounded-full bg-gradient-cyber grid place-items-center shadow-[0_0_40px_-8px_rgba(139,92,246,0.7)] hover:scale-110 transition">
        {open ? <X className="h-5 w-5 text-white" /> : <MessageSquare className="h-5 w-5 text-white" />}
        {!open && <span className="absolute inset-0 rounded-full animate-pulse-ring" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[90] w-[min(380px,calc(100vw-3rem))] h-[520px] flex flex-col glass-strong rounded-2xl border border-white/10 overflow-hidden neon-ring">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-gradient-cyber/10">
              <div className="h-8 w-8 rounded-full bg-gradient-cyber grid place-items-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Ask about Lokesh</div>
                <div className="text-[10px] text-cyber-cyan font-mono flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI · online
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3 text-sm">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-gradient-cyber text-white"
                      : "bg-white/5 border border-white/10 text-foreground"
                  }`}>{m.content}</div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-3 py-2 bg-white/5 border border-white/10 text-muted-foreground text-xs font-mono">
                    thinking<span className="blink">▊</span>
                  </div>
                </div>
              )}
              <div ref={bottom} />
            </div>
            <div className="border-t border-white/10 p-3 flex gap-2">
              <input
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") send(); }}
                placeholder="Ask about experience, projects…"
                className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyber-cyan"
              />
              <button onClick={send} disabled={busy || !input.trim()}
                className="rounded-lg bg-gradient-cyber px-3 grid place-items-center disabled:opacity-50">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
