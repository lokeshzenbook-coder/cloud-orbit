import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Cloud, Server, Shield, GitBranch, Container, Terminal, Zap, Activity,
  Github, Linkedin, Mail, Download, ExternalLink, ArrowRight, Cpu,
  Database, Lock, Boxes, Workflow, GaugeCircle, Rocket, Award, Code2,
  ChevronRight, Command, Sparkles, Globe, Layers, Play, CircleCheck,
  FileCode, ShieldCheck, Bug, KeyRound, PackageSearch, ScrollText,
  ArrowUpRight, Menu, X, Phone, MapPin, Star, GitPullRequest,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "G R Lokesh — Senior DevOps & DevSecOps Engineer" },
      {
        name: "description",
        content:
          "Interactive cloud-ops portfolio. AWS, Kubernetes, Terraform, GitOps, DevSecOps pipelines. 8+ years shipping reliable, secure platforms.",
      },
    ],
  }),
});

/* -------------------------------------------------------------- Data --- */

const NAV = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "architecture", label: "Architecture" },
  { id: "pipeline", label: "Pipeline" },
  { id: "security", label: "Security" },
  { id: "contact", label: "Contact" },
];

const TYPING = [
  "Building Cloud Infrastructure",
  "Automating Everything",
  "Securing Kubernetes",
  "Engineering Reliable Platforms",
  "Enabling Continuous Delivery",
];

const STATS = [
  { label: "Years Experience", value: 8, suffix: "+" },
  { label: "Projects Delivered", value: 120, suffix: "+" },
  { label: "K8s Clusters", value: 40, suffix: "" },
  { label: "CI/CD Pipelines", value: 300, suffix: "+" },
  { label: "Uptime SLA", value: 99.99, suffix: "%", decimals: 2 },
  { label: "Cost Savings", value: 42, suffix: "%" },
];

const SKILL_CATEGORIES = [
  {
    name: "Cloud", icon: Cloud, color: "#3B82F6",
    skills: [
      { name: "AWS", level: 95, years: 7 },
      { name: "Azure", level: 78, years: 4 },
      { name: "GCP", level: 72, years: 3 },
      { name: "Cloudflare", level: 82, years: 4 },
    ],
  },
  {
    name: "Containers & Orchestration", icon: Container, color: "#8B5CF6",
    skills: [
      { name: "Kubernetes", level: 96, years: 6 },
      { name: "Docker", level: 95, years: 8 },
      { name: "Helm", level: 90, years: 5 },
      { name: "Istio", level: 74, years: 3 },
    ],
  },
  {
    name: "Infrastructure as Code", icon: FileCode, color: "#06B6D4",
    skills: [
      { name: "Terraform", level: 94, years: 6 },
      { name: "Pulumi", level: 70, years: 2 },
      { name: "Ansible", level: 86, years: 6 },
      { name: "CloudFormation", level: 80, years: 5 },
    ],
  },
  {
    name: "CI/CD & GitOps", icon: GitBranch, color: "#3B82F6",
    skills: [
      { name: "GitHub Actions", level: 95, years: 5 },
      { name: "Argo CD", level: 90, years: 4 },
      { name: "GitLab CI", level: 85, years: 5 },
      { name: "Jenkins", level: 80, years: 6 },
    ],
  },
  {
    name: "Observability", icon: Activity, color: "#8B5CF6",
    skills: [
      { name: "Prometheus", level: 92, years: 5 },
      { name: "Grafana", level: 92, years: 5 },
      { name: "Datadog", level: 84, years: 4 },
      { name: "ELK Stack", level: 80, years: 4 },
    ],
  },
  {
    name: "Security & DevSecOps", icon: Shield, color: "#06B6D4",
    skills: [
      { name: "Trivy", level: 90, years: 4 },
      { name: "Snyk", level: 85, years: 3 },
      { name: "Vault", level: 84, years: 4 },
      { name: "Checkov / Semgrep", level: 82, years: 3 },
    ],
  },
];

const CERTIFICATIONS = [
  { name: "AWS Solutions Architect – Professional", issuer: "Amazon Web Services", id: "AWS-SAP-2024-8842", date: "Mar 2024" },
  { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF / Linux Foundation", id: "CKA-2023-1147", date: "Aug 2023" },
  { name: "Certified Kubernetes Security (CKS)", issuer: "CNCF / Linux Foundation", id: "CKS-2024-0219", date: "Jan 2024" },
  { name: "HashiCorp Terraform Associate", issuer: "HashiCorp", id: "TF-2023-5567", date: "Jun 2023" },
  { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", id: "AWS-DVA-2022", date: "Feb 2022" },
  { name: "Azure Administrator Associate", issuer: "Microsoft", id: "AZ-104-2023", date: "Oct 2023" },
];

const EXPERIENCE = [
  {
    role: "Senior DevOps Engineer",
    company: "Nimbus Financial",
    period: "2023 — Present",
    stack: ["AWS", "EKS", "Terraform", "Argo CD", "Vault"],
    bullets: [
      "Owned platform serving 12M requests/day across 40+ EKS clusters.",
      "Cut deploy time from 42m to 6m with GitOps rollout automation.",
      "Achieved 99.99% uptime with multi-region active/active DR.",
    ],
  },
  {
    role: "DevSecOps Engineer",
    company: "Helion Health",
    period: "2021 — 2023",
    stack: ["Kubernetes", "Trivy", "Snyk", "GitHub Actions", "OPA"],
    bullets: [
      "Introduced SLSA-3 supply-chain pipeline with Cosign + SBOM.",
      "Reduced critical CVEs in production images by 87%.",
      "Built policy-as-code guardrails via OPA / Kyverno.",
    ],
  },
  {
    role: "Cloud Engineer",
    company: "Vector Labs",
    period: "2019 — 2021",
    stack: ["AWS", "Terraform", "Jenkins", "Ansible"],
    bullets: [
      "Migrated 200+ VMs to containerized EKS workloads.",
      "Built landing zone for 15 AWS accounts with Control Tower.",
    ],
  },
  {
    role: "Site Reliability Engineer",
    company: "Northwind Media",
    period: "2017 — 2019",
    stack: ["Docker", "Prometheus", "Grafana", "Bash"],
    bullets: [
      "Implemented SLO-based alerting; reduced pages 62%.",
      "Automated runbooks with Python & Ansible.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Enterprise DevSecOps Pipeline",
    tagline: "SLSA-3 supply chain with Cosign + SBOM",
    stack: ["GitHub Actions", "Trivy", "Cosign", "Argo CD", "EKS"],
    outcome: "87% fewer critical CVEs in prod",
    icon: ShieldCheck,
  },
  {
    title: "GitOps Platform",
    tagline: "Multi-cluster app delivery across 40 EKS clusters",
    stack: ["Argo CD", "Kustomize", "Helm", "Terraform"],
    outcome: "6-minute mean deploy time",
    icon: GitBranch,
  },
  {
    title: "AWS EKS Production Cluster",
    tagline: "Multi-tenant EKS with Karpenter + Istio",
    stack: ["EKS", "Karpenter", "Istio", "Cilium"],
    outcome: "38% compute cost savings",
    icon: Boxes,
  },
  {
    title: "K8s Monitoring Stack",
    tagline: "Prometheus federation with Grafana Mimir",
    stack: ["Prometheus", "Mimir", "Loki", "Tempo"],
    outcome: "40M active series, 15s scrape",
    icon: Activity,
  },
  {
    title: "Terraform Landing Zone",
    tagline: "Multi-account AWS baseline with Control Tower",
    stack: ["Terraform", "Control Tower", "SCPs"],
    outcome: "15 accounts, 100% policy compliance",
    icon: Layers,
  },
  {
    title: "Platform Engineering Framework",
    tagline: "Self-service developer platform with Backstage",
    stack: ["Backstage", "Crossplane", "ArgoCD"],
    outcome: "Onboarding: 3 days → 45 minutes",
    icon: Workflow,
  },
];

const ARCH_NODES = [
  { id: "route53", label: "Route 53", desc: "DNS, health-checked failover across regions" },
  { id: "cf", label: "CloudFront", desc: "Global CDN with WAF + Shield" },
  { id: "alb", label: "ALB", desc: "Application load balancer, TLS termination" },
  { id: "eks", label: "EKS Cluster", desc: "Karpenter-managed, multi-AZ" },
  { id: "svc", label: "Services / Pods", desc: "Istio mTLS mesh, Cilium NetworkPolicy" },
  { id: "rds", label: "RDS + Redis", desc: "Aurora PG multi-AZ, ElastiCache" },
  { id: "s3", label: "S3 + CloudWatch", desc: "Encrypted objects, log aggregation" },
  { id: "obs", label: "Prometheus + Grafana", desc: "SLOs, alerts, dashboards" },
  { id: "gitops", label: "Argo CD ← GitHub Actions", desc: "GitOps continuous delivery" },
];

const PIPELINE_STAGES = [
  { name: "Git Push", icon: GitBranch },
  { name: "Lint", icon: Code2 },
  { name: "Unit Tests", icon: CircleCheck },
  { name: "SAST", icon: Bug },
  { name: "Secrets Scan", icon: KeyRound },
  { name: "IaC Scan", icon: FileCode },
  { name: "Docker Build", icon: Container },
  { name: "Image Scan", icon: PackageSearch },
  { name: "SBOM", icon: ScrollText },
  { name: "Cosign", icon: ShieldCheck },
  { name: "ECR Push", icon: Boxes },
  { name: "Argo CD", icon: Rocket },
  { name: "EKS Deploy", icon: Server },
  { name: "Monitoring", icon: Activity },
];

const TESTIMONIALS = [
  { name: "Priya Menon", role: "VP Engineering, Nimbus Financial", quote: "Alex rebuilt our platform from a monolith of tickets into a self-service system. Deploys dropped from hours to minutes." },
  { name: "Marcus Chen", role: "CTO, Helion Health", quote: "Best DevSecOps hire we ever made. Our audit prep went from weeks to a single pipeline run." },
  { name: "Sofia Ortiz", role: "Head of Platform, Vector Labs", quote: "A rare mix of deep AWS expertise and calm, thoughtful engineering. Ships things that don't break." },
];

/* -------------------------------------------------- Reusable components --- */

function useCountUp(target: number, duration = 1500, start = false, decimals = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return decimals ? value.toFixed(decimals) : Math.round(value).toString();
}

function StatCard({ stat, delay }: { stat: typeof STATS[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const shown = useCountUp(stat.value, 1600, inView, stat.decimals ?? 0);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }} viewport={{ once: true }}
      className="glass rounded-2xl p-6 hover-glow"
    >
      <div className="text-3xl md:text-4xl font-display font-bold text-gradient">
        {shown}{stat.suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
}

function MagneticButton({
  children, variant = "primary", href, onClick, className = "",
}: {
  children: React.ReactNode; variant?: "primary" | "ghost" | "outline";
  href?: string; onClick?: () => void; className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const r = (ref.current as HTMLElement)?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25 });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const base = "relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-colors group overflow-hidden";
  const variants = {
    primary: "bg-gradient-cyber text-white shadow-[0_10px_40px_-10px_rgba(59,130,246,0.7)]",
    outline: "border border-white/15 text-foreground glass",
    ghost: "text-foreground/80 hover:text-white",
  } as const;

  const inner = (
    <motion.span
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href}
         onMouseMove={handleMove} onMouseLeave={reset}
         className={`${base} ${variants[variant]} ${className}`}>
        {variant === "primary" && (
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg,#8B5CF6,#06B6D4,#3B82F6)" }} />
        )}
        <span className="relative">{inner}</span>
      </a>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} onClick={onClick}
            onMouseMove={handleMove} onMouseLeave={reset}
            className={`${base} ${variants[variant]} ${className}`}>
      <span className="relative">{inner}</span>
    </button>
  );
}

function TypingText() {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const full = TYPING[i];
    const speed = del ? 40 : 70;
    const t = setTimeout(() => {
      if (!del) {
        const next = full.slice(0, txt.length + 1);
        setTxt(next);
        if (next === full) setTimeout(() => setDel(true), 1400);
      } else {
        const next = full.slice(0, txt.length - 1);
        setTxt(next);
        if (next.length === 0) { setDel(false); setI((i + 1) % TYPING.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [txt, del, i]);

  return (
    <span className="font-mono text-cyber-cyan">
      {txt}<span className="blink text-cyber-blue">▍</span>
    </span>
  );
}

function Particles() {
  const dots = useMemo(
    () => Array.from({ length: 40 }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      s: Math.random() * 2 + 1, d: Math.random() * 8 + 6, delay: Math.random() * 5,
    })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((p, i) => (
        <span key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s,
                background: i % 3 === 0 ? "#06B6D4" : i % 3 === 1 ? "#8B5CF6" : "#3B82F6",
                boxShadow: `0 0 ${p.s * 4}px currentColor`, color: "inherit",
                animation: `float-slow ${p.d}s ease-in-out ${p.delay}s infinite`,
              }} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- Nav --- */

function Nav({ onCmd }: { onCmd: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    h(); window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "py-3" : "py-5"}`}>
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between rounded-2xl transition-all
                      ${scrolled ? "glass-strong px-4" : ""}`}>
        <a href="#hero" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-cyber">
            <Terminal className="h-4 w-4 text-white" />
            <span className="absolute inset-0 rounded-lg animate-pulse-ring" />
          </span>
          <span className="text-gradient">G R Lokesh</span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`}
               className="px-3 py-1.5 text-sm text-muted-foreground hover:text-white transition-colors relative group">
              {n.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-gradient-cyber scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={onCmd}
                  className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-white">
            <Command className="h-3.5 w-3.5" /> <span>⌘K</span>
          </button>
          <MagneticButton href="#contact" className="hidden sm:inline-flex" variant="primary">
            <Mail className="h-4 w-4" /> Hire me
          </MagneticButton>
          <button className="lg:hidden p-2 rounded-lg glass" onClick={() => setOpen(o => !o)} aria-label="menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mx-4 mt-2 glass-strong rounded-2xl p-4">
            {NAV.map(n => (
              <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                 className="block py-2 text-sm text-muted-foreground hover:text-white">{n.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ------------------------------------------------------------- Hero --- */

function Hero() {
  const orbitItems = [
    { label: "AWS", color: "#FF9900", r: 130, dur: 22 },
    { label: "K8s", color: "#326CE5", r: 130, dur: 22, offset: 90 },
    { label: "Docker", color: "#2496ED", r: 130, dur: 22, offset: 180 },
    { label: "Terraform", color: "#7B42BC", r: 130, dur: 22, offset: 270 },
    { label: "Argo", color: "#EF7B4D", r: 200, dur: 30 },
    { label: "Vault", color: "#FFEC6E", r: 200, dur: 30, offset: 120 },
    { label: "Istio", color: "#466BB0", r: 200, dur: 30, offset: 240 },
  ];

  return (
    <section id="hero" className="relative min-h-screen pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-hero)" }} />
      <Particles />

      {/* Floating blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full blur-3xl opacity-40 animate-float-slow"
           style={{ background: "radial-gradient(circle,#3B82F6,transparent 60%)" }} />
      <div className="absolute top-40 -right-20 w-96 h-96 rounded-full blur-3xl opacity-40 animate-float-slow"
           style={{ background: "radial-gradient(circle,#8B5CF6,transparent 60%)", animationDelay: "3s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-cyber-cyan">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-cyber-cyan animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan" />
            </span>
            status: <span className="text-white">operational</span> · region: us-east-1
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05]">
            Hi, I'm <span className="text-gradient">Alex Rivera</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl">
            Senior <span className="text-white">DevOps & DevSecOps</span> Engineer shipping
            secure, self-healing cloud platforms at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-6 text-base md:text-lg">
            <span className="text-muted-foreground">$ </span><TypingText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href="#contact" variant="primary">
              <Sparkles className="h-4 w-4" /> Hire me
            </MagneticButton>
            <MagneticButton href="#projects" variant="outline">
              <Rocket className="h-4 w-4" /> View projects
            </MagneticButton>
            <MagneticButton href="#" variant="outline">
              <Download className="h-4 w-4" /> Resume
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-10 flex items-center gap-5 text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-xs font-mono">Available Q2 2026</span>
          </motion.div>
        </div>

        {/* Orbit visualization */}
        <div className="relative h-[420px] hidden lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* concentric rings */}
            {[100, 150, 210].map((r, i) => (
              <div key={i} className="absolute rounded-full border border-white/10"
                   style={{ width: r * 2, height: r * 2 }} />
            ))}
            {/* dashed rotating ring */}
            <motion.div
              className="absolute rounded-full border border-dashed border-cyber-purple/40"
              style={{ width: 340, height: 340 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />

            {/* core */}
            <div className="relative h-28 w-28 rounded-full bg-gradient-cyber flex items-center justify-center animate-gradient"
                 style={{ boxShadow: "0 0 60px rgba(59,130,246,0.6), 0 0 120px rgba(139,92,246,0.4)" }}>
              <Cloud className="h-10 w-10 text-white" />
              <span className="absolute inset-0 rounded-full animate-pulse-ring" />
            </div>

            {/* orbit items */}
            {orbitItems.map((o, i) => (
              <div key={i}
                   className="absolute h-12 w-12 rounded-xl glass-strong flex items-center justify-center text-[10px] font-mono"
                   style={{
                     // @ts-expect-error css var
                     "--r": `${o.r}px`,
                     animation: `orbit ${o.dur}s linear infinite`,
                     animationDelay: `-${(o.offset ?? 0) / 360 * o.dur}s`,
                     color: o.color, borderColor: `${o.color}55`,
                     boxShadow: `0 0 20px ${o.color}55`,
                   }}>
                {o.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ About --- */

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: React.ReactNode; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} viewport={{ once: true }}
      className="max-w-3xl mb-12">
      <div className="font-mono text-xs text-cyber-cyan uppercase tracking-widest">{eyebrow}</div>
      <h2 className="mt-2 text-3xl md:text-5xl font-display font-bold">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground">{description}</p>}
    </motion.div>
  );
}

function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// about"
          title={<>Engineering platforms that <span className="text-gradient">don't wake me up</span></>}
          description="Eight years turning fragile infrastructure into calm, boring systems. I care about developer experience, security by default, and pipelines that ship on Friday afternoon."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-2 glass rounded-3xl p-8 hover-glow">
            <div className="font-mono text-xs text-cyber-cyan mb-4">~/philosophy</div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p><span className="text-white">Automate the boring, protect the important.</span>{" "}
                I treat infrastructure like a product — with users (developers), an SLA (uptime),
                and a roadmap (platform capabilities).</p>
              <p>Every incident is a design flaw waiting to be codified into a guardrail.
                Every runbook is a script I haven't written yet.</p>
              <p>I default to GitOps, policy-as-code, and security scanned at every step of the
                supply chain. Deploys should be dull.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
              {["GitOps", "IaC", "Zero Trust", "SLSA-3", "Platform Engineering", "Well-Architected"].map(t => (
                <span key={t} className="px-2.5 py-1 rounded-md glass border border-white/10 text-cyber-cyan">{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass rounded-3xl p-8 hover-glow">
            <div className="font-mono text-xs text-cyber-cyan mb-4">~/currently</div>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3"><Server className="h-4 w-4 mt-0.5 text-cyber-blue" />
                <span>Leading platform team at a fintech, 40+ EKS clusters.</span></li>
              <li className="flex gap-3"><Shield className="h-4 w-4 mt-0.5 text-cyber-purple" />
                <span>Rolling out SLSA-3 supply chain across all services.</span></li>
              <li className="flex gap-3"><Zap className="h-4 w-4 mt-0.5 text-cyber-cyan" />
                <span>Writing about Karpenter, Argo Rollouts, and OPA.</span></li>
              <li className="flex gap-3"><Award className="h-4 w-4 mt-0.5 text-cyber-blue" />
                <span>Studying for CKS re-certification.</span></li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 0.05} />)}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Skills --- */

function Skills() {
  const [active, setActive] = useState(0);
  const cat = SKILL_CATEGORIES[active];

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// stack"
          title={<>Skills <span className="text-gradient">dashboard</span></>}
          description="Live-view of the tools I ship with. Hover for context, click a category to drill in."
        />

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="glass rounded-2xl p-3 space-y-1">
            {SKILL_CATEGORIES.map((c, i) => {
              const Icon = c.icon;
              const isActive = i === active;
              return (
                <button key={c.name} onClick={() => setActive(i)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-sm transition-all
                                    ${isActive ? "bg-white/5 border border-white/10" : "hover:bg-white/5 border border-transparent"}`}>
                  <span className="h-8 w-8 rounded-lg grid place-items-center"
                        style={{ background: `${c.color}22`, color: c.color }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={isActive ? "text-white" : "text-muted-foreground"}>{c.name}</span>
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 text-cyber-cyan" />}
                </button>
              );
            })}
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-lg grid place-items-center"
                      style={{ background: `${cat.color}22`, color: cat.color }}>
                  <cat.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-display text-xl font-semibold">{cat.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{cat.skills.length} tools · production</div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> healthy
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {cat.skills.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-4 rounded-xl border border-white/10 bg-white/[0.02] hover-glow overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs font-mono text-muted-foreground">{s.years}y</div>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${cat.color}, #06B6D4)` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-mono">
                    <span className="text-muted-foreground">proficiency</span>
                    <span style={{ color: cat.color }}>{s.level}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Certifications --- */

function Certs() {
  return (
    <section id="certifications" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="// credentials" title={<>Certifications</>} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTIFICATIONS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative rounded-2xl p-6 glass hover-glow overflow-hidden">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
                   style={{ background: "radial-gradient(circle, #8B5CF6, transparent 60%)" }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="h-10 w-10 rounded-xl bg-gradient-cyber grid place-items-center">
                    <Award className="h-5 w-5 text-white" />
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">{c.date}</span>
                </div>
                <h3 className="mt-4 font-display font-semibold leading-snug">{c.name}</h3>
                <div className="mt-1 text-xs text-muted-foreground">{c.issuer}</div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyber-cyan">ID: {c.id}</span>
                  <button className="text-xs inline-flex items-center gap-1 text-white/80 hover:text-white">
                    Verify <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Experience --- */

function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="// timeline" title={<>Experience</>} />
        <div className="relative pl-6 md:pl-10">
          <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyber-blue via-cyber-purple to-cyber-cyan" />
          <div className="space-y-8">
            {EXPERIENCE.map((e, i) => (
              <motion.div
                key={e.company}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="relative">
                <span className="absolute -left-[22px] md:-left-[30px] top-4 h-4 w-4 rounded-full bg-cyber-blue ring-4 ring-cyber-blue/20 animate-pulse-ring" />
                <div className="glass rounded-2xl p-6 hover-glow">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-display text-lg font-semibold">{e.role}</div>
                      <div className="text-sm text-cyber-cyan font-mono">{e.company}</div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">{e.period}</div>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {e.bullets.map(b => (
                      <li key={b} className="flex gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-cyber-purple flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {e.stack.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-white/10 bg-white/[0.03] text-cyber-cyan">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Projects --- */

function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// shipped"
          title={<>Selected <span className="text-gradient">projects</span></>}
          description="Real infrastructure that powered real businesses. Numbers below are measured, not marketed."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
                style={{ transformStyle: "preserve-3d" }}
                className="group relative rounded-2xl p-6 glass hover-glow overflow-hidden">
                {/* animated corner */}
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-30 group-hover:opacity-70 transition-opacity"
                     style={{ background: `radial-gradient(circle, ${i % 2 ? "#06B6D4" : "#8B5CF6"}, transparent 60%)` }} />
                <div className="relative flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <span className="h-10 w-10 rounded-xl bg-gradient-cyber grid place-items-center">
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-1 rounded-md border border-white/10 text-cyber-cyan">
                      case study
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-[11px] font-mono border border-white/10 bg-white/[0.03]">{t}</span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <div className="text-sm">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">outcome</div>
                      <div className="font-medium text-cyber-cyan">{p.outcome}</div>
                    </div>
                    <button className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white group/link">
                      Read <ArrowUpRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------- AWS Architecture --- */

function Architecture() {
  const [active, setActive] = useState<string | null>(null);
  const activeNode = ARCH_NODES.find(n => n.id === active);

  return (
    <section id="architecture" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// aws · reference architecture"
          title={<>Interactive <span className="text-gradient">cloud topology</span></>}
          description="Click any node to inspect. This is the pattern I ship for production workloads on AWS."
        />

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="glass rounded-3xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="relative grid gap-3">
              {ARCH_NODES.map((n, i) => (
                <div key={n.id} className="flex flex-col items-center">
                  <button
                    onClick={() => setActive(n.id === active ? null : n.id)}
                    className={`w-full max-w-md flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                                ${active === n.id
                                  ? "bg-white/10 border-cyber-cyan/50 neon-ring"
                                  : "glass border-white/10 hover:border-cyber-purple/40"}`}>
                    <span className="h-8 w-8 rounded-lg grid place-items-center bg-gradient-cyber">
                      <Server className="h-4 w-4 text-white" />
                    </span>
                    <span className="text-sm font-medium">{n.label}</span>
                    <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                      layer {i + 1}
                    </span>
                  </button>
                  {i < ARCH_NODES.length - 1 && (
                    <svg width="2" height="30" className="my-1 overflow-visible">
                      <line x1="1" y1="0" x2="1" y2="30" stroke="url(#g)" strokeWidth="2" className="dash-flow" />
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 sticky top-24 h-fit">
            <div className="font-mono text-xs text-cyber-cyan mb-3">// inspector</div>
            {activeNode ? (
              <motion.div key={activeNode.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="font-display text-xl font-semibold">{activeNode.label}</div>
                <p className="mt-2 text-sm text-muted-foreground">{activeNode.desc}</p>
                <div className="mt-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-muted-foreground">region</span><span>us-east-1</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">tf module</span><span className="text-cyber-cyan">v2.14.0</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">status</span><span className="text-emerald-400">healthy</span></div>
                </div>
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a node to see its purpose, module version, and health.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- CI/CD Pipeline --- */

function Pipeline() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % PIPELINE_STAGES.length), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="pipeline" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// devsecops · ci-cd"
          title={<>Secure delivery <span className="text-gradient">pipeline</span></>}
          description="From git push to production, every stage is signed, scanned, and observable."
        />

        <div className="glass rounded-3xl p-6 md:p-10 overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {PIPELINE_STAGES.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isPast = i < step;
              return (
                <motion.div
                  key={s.name}
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  className={`relative rounded-xl p-3 border text-center transition-colors
                              ${isActive ? "border-cyber-cyan bg-cyber-cyan/10" :
                                isPast ? "border-cyber-blue/40 bg-cyber-blue/5" :
                                "border-white/10 bg-white/[0.02]"}`}>
                  <div className="mx-auto h-9 w-9 rounded-lg grid place-items-center"
                       style={{ background: isActive ? "linear-gradient(135deg,#3B82F6,#8B5CF6)" : "rgba(255,255,255,0.05)" }}>
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-cyber-cyan"}`} />
                  </div>
                  <div className="mt-2 text-[11px] font-mono">{s.name}</div>
                  {isActive && <span className="absolute inset-0 rounded-xl animate-pulse-ring pointer-events-none" />}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-black/40 font-mono text-xs border border-white/10">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="ml-2">runner-01 · ubuntu-24.04</span>
            </div>
            <div className="space-y-1">
              <div><span className="text-cyber-cyan">$</span> gh workflow run deploy.yml --ref main</div>
              <div className="text-emerald-400">✓ Lint · 4.2s</div>
              <div className="text-emerald-400">✓ Unit tests (128 passed) · 12.7s</div>
              <div className="text-emerald-400">✓ Trivy scan · 0 critical, 0 high</div>
              <div className="text-emerald-400">✓ SBOM generated · sbom.spdx.json</div>
              <div className="text-emerald-400">✓ Cosign sign · sha256:8f2a…c11d</div>
              <div className="text-cyber-cyan">→ Argo CD sync · syncing (revision f83aa10)…</div>
              <div className="text-white/50">deploy time: 5m 42s · pods healthy 12/12</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------- Security Center --- */

function Security() {
  const metrics = [
    { label: "Security Score", value: "A+", sub: "94/100", color: "#10B981" },
    { label: "Critical CVEs", value: "0", sub: "last 30d", color: "#06B6D4" },
    { label: "Signed Images", value: "100%", sub: "cosign", color: "#3B82F6" },
    { label: "Policy Violations", value: "3", sub: "auto-remediated", color: "#8B5CF6" },
  ];
  const scans = [
    { name: "Container images", value: 98 },
    { name: "IaC (Checkov)", value: 100 },
    { name: "Secrets (Gitleaks)", value: 100 },
    { name: "SAST (Semgrep)", value: 92 },
    { name: "Runtime (Falco)", value: 96 },
  ];

  return (
    <section id="security" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// devsecops · posture"
          title={<>Security <span className="text-gradient">command center</span></>}
        />

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {metrics.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover-glow relative overflow-hidden">
              <div className="absolute top-3 right-3 h-2 w-2 rounded-full animate-pulse" style={{ background: m.color }} />
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{m.label}</div>
              <div className="mt-3 font-display text-4xl font-bold" style={{ color: m.color }}>{m.value}</div>
              <div className="mt-1 text-xs text-muted-foreground font-mono">{m.sub}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-cyber-cyan" />
              <div className="font-display font-semibold">Scan coverage</div>
            </div>
            <div className="space-y-4">
              {scans.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.name}</span>
                    <span className="font-mono text-cyber-cyan">{s.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.value}%` }}
                                viewport={{ once: true }} transition={{ duration: 1 }}
                                className="h-full rounded-full bg-gradient-cyber" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-cyber-purple" />
              <div className="font-display font-semibold">Live cluster feed</div>
            </div>
            <div className="space-y-2 font-mono text-xs">
              {[
                { t: "12:04:17", tag: "OK", msg: "pod api-7c9 · healthy", c: "text-emerald-400" },
                { t: "12:04:12", tag: "OK", msg: "hpa scaled web-frontend 6→9", c: "text-cyber-cyan" },
                { t: "12:03:58", tag: "SEC", msg: "policy allow · admission ns=prod", c: "text-cyber-purple" },
                { t: "12:03:41", tag: "OK", msg: "argocd sync payments · Synced", c: "text-emerald-400" },
                { t: "12:03:22", tag: "WARN", msg: "node cpu 82% · pending scale", c: "text-yellow-400" },
                { t: "12:03:04", tag: "OK", msg: "cert-manager renewed *.prod.io", c: "text-emerald-400" },
              ].map((l, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-muted-foreground">{l.t}</span>
                  <span className={`w-10 ${l.c}`}>[{l.tag}]</span>
                  <span className="text-white/80">{l.msg}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------ GitHub + Testimonials --- */

function GitHubStrip() {
  const langs = [
    { name: "Go", pct: 34, color: "#00ADD8" },
    { name: "Python", pct: 28, color: "#3776AB" },
    { name: "HCL", pct: 18, color: "#7B42BC" },
    { name: "YAML", pct: 12, color: "#CB171E" },
    { name: "Bash", pct: 8,  color: "#4EAA25" },
  ];
  const heat = Array.from({ length: 7 * 26 }, () => Math.random());

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 hover-glow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Github className="h-4 w-4 text-cyber-cyan" />
              <span className="font-display font-semibold">Contribution heatmap</span>
            </div>
            <span className="text-xs font-mono text-muted-foreground">1,842 commits · last 12mo</span>
          </div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(26, minmax(0,1fr))" }}>
            {heat.map((v, i) => (
              <div key={i} className="aspect-square rounded-sm"
                   style={{
                     background: v > 0.85 ? "#06B6D4"
                              : v > 0.6 ? "#3B82F6"
                              : v > 0.3 ? "#3B82F655"
                              : "rgba(255,255,255,0.05)",
                   }} />
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 hover-glow">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="h-4 w-4 text-cyber-purple" />
            <span className="font-display font-semibold">Top languages</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex mb-4">
            {langs.map(l => <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />)}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {langs.map(l => (
              <div key={l.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ background: l.color }} />
                <span>{l.name}</span>
                <span className="ml-auto text-muted-foreground font-mono">{l.pct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Star, label: "Stars", val: "1.2k" },
              { icon: GitPullRequest, label: "PRs", val: "412" },
              { icon: Boxes, label: "Repos", val: "68" },
            ].map(x => (
              <div key={x.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <x.icon className="h-4 w-4 mx-auto text-cyber-cyan" />
                <div className="mt-1 font-display font-bold">{x.val}</div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">{x.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading eyebrow="// signals" title={<>What people say</>} />
        <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-40"
               style={{ background: "radial-gradient(circle,#8B5CF6,transparent 60%)" }} />
          <AnimatePresence mode="wait">
            <motion.blockquote key={t.name}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="relative">
              <p className="font-display text-xl md:text-2xl leading-snug">"{t.quote}"</p>
              <footer className="mt-6 text-sm">
                <div className="font-medium">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
          <div className="mt-6 flex gap-2">
            {TESTIMONIALS.map((_, k) => (
              <button key={k} onClick={() => setI(k)}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-gradient-cyber" : "w-4 bg-white/15"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Contact --- */

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-8">
        <div>
          <SectionHeading
            eyebrow="// contact"
            title={<>Let's ship <span className="text-gradient">something reliable</span></>}
            description="Available for platform, DevSecOps, and cloud engineering roles. Consulting welcome."
          />
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-cyber-cyan" />
              <a href="mailto:hello@alexrivera.dev" className="hover:text-white">hello@alexrivera.dev</a>
            </div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-cyber-purple" />
              <span>+1 (415) 555-0198</span>
            </div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-cyber-blue" />
              <span>San Francisco · Remote-friendly</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href="#" variant="outline"><Github className="h-4 w-4" /> GitHub</MagneticButton>
            <MagneticButton href="#" variant="outline"><Linkedin className="h-4 w-4" /> LinkedIn</MagneticButton>
            <MagneticButton href="#" variant="outline"><Download className="h-4 w-4" /> Resume</MagneticButton>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="glass rounded-3xl p-6 md:p-8 space-y-4 hover-glow">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" placeholder="Ada Lovelace" required />
            <Field label="Email" type="email" placeholder="ada@enterprise.io" required />
          </div>
          <Field label="Company" placeholder="Acme Cloud" />
          <Field label="Subject" placeholder="Platform hire · Q1" />
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Message</label>
            <textarea rows={5} required
                      className="mt-1 w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm outline-none focus:border-cyber-cyan/60 focus:ring-2 focus:ring-cyber-cyan/20 transition"
                      placeholder="Tell me about the platform you're building…" />
          </div>
          <MagneticButton variant="primary" onClick={() => {}} className="w-full justify-center">
            {sent ? <><CircleCheck className="h-4 w-4" /> Sent — I'll reply within 24h</>
                  : <>Send message <ArrowRight className="h-4 w-4" /></>}
          </MagneticButton>
        </form>
      </div>
    </section>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</label>
      <input {...props}
        className="mt-1 w-full rounded-xl bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-cyber-cyan/60 focus:ring-2 focus:ring-cyber-cyan/20 transition" />
    </div>
  );
}

/* ----------------------------------------------------------- Footer --- */

function Footer() {
  return (
    <footer className="relative pt-16 pb-8 border-t border-white/5 overflow-hidden">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-cyber opacity-60" />
      <svg className="absolute inset-x-0 bottom-0 w-full opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave" x1="0" x2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <motion.path fill="none" stroke="url(#wave)" strokeWidth="2"
          initial={{ d: "M0,60 C300,20 900,100 1200,60" }}
          animate={{ d: ["M0,60 C300,20 900,100 1200,60","M0,60 C300,100 900,20 1200,60","M0,60 C300,20 900,100 1200,60"] }}
          transition={{ duration: 8, repeat: Infinity }} />
      </svg>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold">
            <span className="h-7 w-7 rounded-lg bg-gradient-cyber grid place-items-center">
              <Terminal className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="text-gradient">alex.rivera</span>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} · Built with care & Kubernetes
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="hover:text-white"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-white"><Linkedin className="h-4 w-4" /></a>
            <a href="#hero" className="hover:text-white text-xs font-mono">↑ top</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------------------- Command Palette (⌘K) --- */

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = NAV.map(n => ({ label: `Jump to ${n.label}`, href: `#${n.id}` }));
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm grid place-items-start pt-24 px-4">
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-strong rounded-2xl overflow-hidden neon-ring">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <Command className="h-4 w-4 text-cyber-cyan" />
              <input autoFocus placeholder="Type a command or search…"
                     className="flex-1 bg-transparent outline-none text-sm" />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">esc</kbd>
            </div>
            <div className="max-h-80 overflow-auto p-2">
              {items.map(it => (
                <a key={it.href} href={it.href} onClick={onClose}
                   className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-sm">
                  <ChevronRight className="h-4 w-4 text-cyber-purple" />
                  <span>{it.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------------------------------------- Root Page --- */

function Portfolio() {
  const [cmd, setCmd] = useState(false);
  const [booted, setBooted] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1800);
    const kd = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd(v => !v); }
      if (e.key === "Escape") setCmd(false);
    };
    window.addEventListener("keydown", kd);
    return () => { clearTimeout(t); window.removeEventListener("keydown", kd); };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Boot screen */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[200] bg-[#050816] grid place-items-center">
            <div className="font-mono text-sm text-cyber-cyan max-w-md w-full px-6">
              <div className="mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span className="text-white">alex@portfolio</span>
                <span className="text-muted-foreground">~ $ ./boot.sh</span>
              </div>
              {[
                "initializing kubernetes context…",
                "loading AWS credentials · ok",
                "starting argo-cd controllers · ok",
                "provisioning cluster · ready",
                "mounting portfolio · done",
              ].map((l, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.25 }}
                  className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-muted-foreground">{l}</span>
                </motion.div>
              ))}
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }}
                className="mt-4 h-1 rounded-full bg-gradient-cyber" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress */}
      <motion.div style={{ width }} className="fixed top-0 left-0 h-0.5 bg-gradient-cyber z-[60] shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

      <Nav onCmd={() => setCmd(true)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Certs />
        <Experience />
        <Projects />
        <Architecture />
        <Pipeline />
        <Security />
        <GitHubStrip />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} />
    </div>
  );
}
