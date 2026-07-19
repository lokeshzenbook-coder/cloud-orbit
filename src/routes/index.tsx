import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { SmoothScroll, CustomCursor, Blog, AIAssistant, ARTICLES } from "@/components/portfolio-extras";
import { supabase } from "@/integrations/supabase/client";
import {
  Cloud, Server, Shield, GitBranch, Container, Terminal, Zap, Activity,
  Github, Linkedin, Mail, Download, ExternalLink, ArrowRight, Cpu,
  Database, Lock, Boxes, Workflow, GaugeCircle, Rocket, Award, Code2,
  ChevronRight, Command, Sparkles, Globe, Layers, Play, CircleCheck,
  FileCode, ShieldCheck, Bug, KeyRound, PackageSearch, ScrollText,
  ArrowUpRight, Menu, X, Phone, MapPin, Star, GitPullRequest,
} from "lucide-react";

async function trackResumeDownload(source: "hero" | "contact") {
  try {
    await supabase.from("resume_downloads").insert({
      source,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
      referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) || null : null,
    });
  } catch (e) {
    console.warn("resume download tracking failed", e);
  }
}

function ResumePreviewModal() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<"hero" | "contact">("hero");
  const [loaded, setLoaded] = useState(false);
  const pdfUrl = "/GR_Lokesh_Resume.pdf";
  const titleId = "resume-preview-title";
  const descId = "resume-preview-desc";
  const downloadBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as { source?: "hero" | "contact" } | undefined;
      lastFocusRef.current = (document.activeElement as HTMLElement) ?? null;
      setSource(detail?.source ?? "hero");
      setLoaded(false);
      setOpen(true);
    };
    window.addEventListener("open-resume-preview", onOpen as EventListener);
    return () => window.removeEventListener("open-resume-preview", onOpen as EventListener);
  }, []);

  // Focus management + focus trap + Escape
  useEffect(() => {
    if (!open) {
      lastFocusRef.current?.focus?.();
      return;
    }
    // move focus into the dialog on open
    const t = window.setTimeout(() => downloadBtnRef.current?.focus(), 30);

    const getFocusable = (): HTMLElement[] => {
      const root = dialogRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleDownload = async () => {
    await trackResumeDownload(source);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "GR_Lokesh_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] grid place-items-center p-4 sm:p-8 bg-black/70 backdrop-blur-md"
          onClick={() => setOpen(false)}
          aria-hidden={false}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden glass border border-white/10 shadow-[0_30px_80px_-20px_rgba(59,130,246,0.4)] flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan/60"
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2 min-w-0">
                <ScrollText className="h-4 w-4 text-cyber-cyan shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <h2 id={titleId} className="text-sm font-medium truncate">GR_Lokesh_Resume.pdf</h2>
                  <p id={descId} className="text-[11px] font-mono text-muted-foreground truncate">
                    Resume preview · source: {source}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  ref={downloadBtnRef}
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-gradient-cyber text-white shadow-[0_10px_30px_-10px_rgba(59,130,246,0.7)] hover:opacity-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> Download
                </button>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-white/15 glass hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan/60"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> New tab
                </a>
                <button
                  ref={closeBtnRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close resume preview"
                  className="p-2 rounded-lg border border-white/10 hover:bg-white/[0.06] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan/60"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="relative flex-1 bg-[#0b1020]">
              {!loaded && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute inset-0 grid place-items-center text-muted-foreground font-mono text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyber-cyan animate-pulse" aria-hidden="true" />
                    loading preview…
                  </div>
                </div>
              )}
              <iframe
                title="Resume PDF preview"
                aria-label="Resume PDF preview. Use the Download button to save the file."
                src={`${pdfUrl}#view=FitH&toolbar=0`}
                className="absolute inset-0 h-full w-full"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


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
  { id: "impact", label: "Impact" },
  { id: "architecture", label: "Architecture" },
  { id: "pipeline", label: "Pipeline" },
  { id: "security", label: "Security" },
  { id: "blog", label: "Blog" },
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
  { label: "Years Experience", value: 6, suffix: "+" },
  { label: "Microservices Shipped", value: 45, suffix: "+" },
  { label: "EKS Environments", value: 12, suffix: "" },
  { label: "Deploy Time Reduced", value: 60, suffix: "%" },
  { label: "Uptime SLA", value: 99.9, suffix: "%", decimals: 1 },
  { label: "Cloud Cost Savings", value: 30, suffix: "%" },
];

const SKILL_CATEGORIES = [
  {
    name: "Cloud", icon: Cloud, color: "#3B82F6",
    skills: [
      { name: "AWS", level: 95, years: 6 },
      { name: "Azure", level: 78, years: 3 },
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
  { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF / Linux Foundation", id: "CKA", date: "Target 2026" },
  { name: "B.Tech, Civil Engineering", issuer: "Annamacharya Institute of Technology & Science", id: "AITS", date: "2015 – 2019" },
];

const EXPERIENCE = [
  {
    role: "AWS DevOps Engineer",
    company: "ASICS Technologies, India",
    period: "Jul 2024 — Jul 2026",
    stack: ["AWS EKS", "GitHub Actions", "Argo CD", "Terraform", "Istio", "Datadog"],
    bullets: [
      "Built GitHub Actions + Argo CD pipelines for 15+ microservices; cut release time by 60%.",
      "Rolled out GitOps across Dev/QA/UAT/Prod EKS clusters, reducing prod incidents by 30%.",
      "Integrated SonarQube, Trivy, Snyk, and Checkov for pre-deployment security gates.",
      "Tuned HPA, Cluster Autoscaler, and Karpenter — reduced AWS spend by 30%.",
      "Deployed Istio + ALB for mTLS traffic routing; MTTR down 50% with Datadog + Alertmanager.",
    ],
  },
  {
    role: "DevOps Engineer",
    company: "Larsen & Toubro Construction (L&T), India",
    period: "Sep 2021 — Jul 2024",
    stack: ["GitLab CI/CD", "Argo CD", "Docker", "Helm", "Vault", "Ansible"],
    bullets: [
      "Automated build, test, security scan, and K8s deploy for 20+ microservices via GitLab CI + Argo CD.",
      "Secured Jenkins pipelines with RBAC, OIDC, and HashiCorp Vault — 80% less unauthorized access risk.",
      "Multi-stage Docker builds reduced image size by 60%; ran Blue-Green + Canary rollouts on EKS.",
      "Debugged CrashLoopBackOff, ImagePullBackOff, OOMKilled; automated servers with Ansible (-80% toil).",
    ],
  },
  {
    role: "Cloud Support Associate",
    company: "Progile Infotech, India",
    period: "Apr 2020 — Aug 2021",
    stack: ["AWS EC2/S3/IAM", "Jenkins", "Bash", "Python", "Jira ITIL"],
    bullets: [
      "L1/L2 support for AWS infra (EC2, S3, VPC, IAM); enforced least-privilege IAM + MFA.",
      "Automated backup / DR with Lambda + EBS snapshots — 70% less data-loss risk.",
      "Right-sizing + auto-shutdown scripts cut AWS cost by 30%.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Cloud-Native Trading & Portfolio Platform",
    tagline: "GitOps + DevSecOps for 15+ trading microservices",
    stack: ["EKS", "GitHub Actions", "Argo CD", "Istio", "Terraform", "Trivy"],
    outcome: "99.9% uptime · release cycle -60%",
    icon: ShieldCheck,
  },
  {
    title: "Remote-Controlled Smart Devices (IoT)",
    tagline: "Jenkins + Argo CD delivery for connected device fleet",
    stack: ["Jenkins", "Argo CD", "Ansible", "EKS", "PostgreSQL", "Redis"],
    outcome: "Release time -40% · image size -40%",
    icon: Boxes,
  },
  {
    title: "Continuous Personal Health — Philips Healthcare",
    tagline: "Jenkins CI/CD across Test → QA → UAT → Prod",
    stack: ["Jenkins", "Maven", "Docker", "Tomcat", "Ansible"],
    outcome: "Build success 99% · daily releases",
    icon: GitBranch,
  },
  {
    title: "Digital Products & Subscriptions Platform",
    tagline: "L1/L2 ops across AWS + Azure with DR automation",
    stack: ["AWS", "Azure", "Lambda", "EBS Snapshots", "Jira"],
    outcome: "Cloud cost -30% · MTTR -30%",
    icon: Workflow,
  },
  {
    title: "Multi-Env EKS Platform",
    tagline: "Terraform modules with S3/DynamoDB remote state",
    stack: ["Terraform", "EKS", "IAM", "VPC", "ALB"],
    outcome: "Provisioning time -60%",
    icon: Layers,
  },
  {
    title: "Observability & SRE Stack",
    tagline: "Prometheus + Grafana + ELK + Alertmanager on EKS",
    stack: ["Prometheus", "Grafana", "ELK", "Datadog"],
    outcome: "Detection time -65% · MTTR -50%",
    icon: Activity,
  },
];

const ARCH_NODES = [
  { id: "route53", label: "Route 53", desc: "DNS, health-checked failover" },
  { id: "cf", label: "CloudFront", desc: "Global CDN + WAF" },
  { id: "alb", label: "ALB", desc: "TLS termination, path routing" },
  { id: "eks", label: "EKS Cluster", desc: "Karpenter-managed, multi-AZ" },
  { id: "svc", label: "Services / Pods", desc: "Istio mTLS, NGINX Ingress" },
  { id: "rds", label: "RDS + Redis", desc: "PostgreSQL multi-AZ, ElastiCache" },
  { id: "s3", label: "S3 + CloudWatch", desc: "Encrypted objects, log aggregation" },
  { id: "obs", label: "Prometheus + Grafana", desc: "SLOs, alerts, dashboards" },
  { id: "gitops", label: "Argo CD ← GitHub Actions", desc: "GitOps continuous delivery" },
];

const PIPELINE_STAGES = [
  { name: "Git Push", icon: GitBranch },
  { name: "Lint", icon: Code2 },
  { name: "Unit Tests", icon: CircleCheck },
  { name: "SonarQube", icon: Bug },
  { name: "Secrets Scan", icon: KeyRound },
  { name: "Checkov", icon: FileCode },
  { name: "Docker Build", icon: Container },
  { name: "Trivy Scan", icon: PackageSearch },
  { name: "Snyk", icon: ScrollText },
  { name: "Sign", icon: ShieldCheck },
  { name: "ECR / JFrog", icon: Boxes },
  { name: "Argo CD", icon: Rocket },
  { name: "EKS Deploy", icon: Server },
  { name: "Datadog", icon: Activity },
];

const TESTIMONIALS = [
  { name: "Engineering Lead", role: "ASICS Technologies", quote: "Lokesh turned our EKS delivery into a boring, predictable pipeline. GitOps rollouts across four environments just work." },
  { name: "Platform Manager", role: "L&T Construction", quote: "Deep Kubernetes and DevSecOps knowledge. Our Jenkins + Vault hardening plan closed audit findings in a single sprint." },
  { name: "Cloud Operations", role: "Progile Infotech", quote: "Reliable on-call partner. Cut our AWS bill by 30% and wrote the DR runbooks the rest of the team still uses." },
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
  children, variant = "primary", href, onClick, className = "", download, target, rel,
}: {
  children: React.ReactNode; variant?: "primary" | "ghost" | "outline";
  href?: string; onClick?: () => void; className?: string;
  download?: boolean | string; target?: string; rel?: string;
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
         download={download as any} target={target} rel={rel}
         onClick={onClick}
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

function HL({ children, gradient, accent }: { children: React.ReactNode; gradient?: boolean; accent?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial={reduce ? false : { opacity: 0.4, filter: "blur(4px)", y: 4 }}
      whileInView={reduce ? undefined : { opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
      whileHover={
        reduce
          ? undefined
          : {
              textShadow: gradient
                ? "0 0 12px rgba(0,229,255,0.6)"
                : "0 0 10px rgba(255,255,255,0.5)",
              y: -1,
            }
      }
      className={
        "relative inline-block cursor-default transition-colors " +
        (gradient
          ? "text-gradient font-semibold"
          : accent
          ? "text-white font-medium"
          : "text-white")
      }
    >
      {children}
    </motion.span>
  );
}

function Hero() {
  const reduce = useReducedMotion();
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              reduce
                ? { opacity: 1, y: 0 }
                : {
                    opacity: 1,
                    y: 0,
                    boxShadow: [
                      "0 0 0 0 rgba(0,229,255,0.0), 0 0 12px rgba(0,229,255,0.25)",
                      "0 0 0 6px rgba(0,229,255,0.0), 0 0 24px rgba(0,229,255,0.55)",
                      "0 0 0 0 rgba(0,229,255,0.0), 0 0 12px rgba(0,229,255,0.25)",
                    ],
                  }
            }
            transition={
              reduce
                ? { duration: 0.3 }
                : {
                    opacity: { duration: 0.5 },
                    y: { duration: 0.5 },
                    boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                  }
            }
            whileHover={reduce ? undefined : { scale: 1.04 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono min-h-[26px] border border-cyber-cyan/40 bg-cyber-cyan/5">
            <span className="relative flex h-2 w-2">
              {!reduce && <span className="absolute inset-0 rounded-full bg-cyber-cyan animate-ping opacity-75" />}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan" />
            </span>
            <span className="font-semibold tracking-wide uppercase text-gradient">Open to New Opportunities</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-balance">
            Hi, I'm <span className="text-gradient">&nbsp;G R Lokesh</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground max-w-xl text-pretty">
            <HL accent>DevOps, DevSecOps, and Platform</HL> Engineer with <HL gradient>6+ years</HL> of experience designing, automating, and operating <HL>production-grade cloud infrastructure</HL>. Specialized in <HL>Kubernetes (Amazon EKS)</HL>, <HL>Terraform</HL>, <HL>GitOps (Argo CD)</HL>, <HL>CI/CD automation</HL>, <HL>Infrastructure as Code</HL>, <HL>container security</HL>, <HL>observability</HL>, and <HL>cloud-native platform engineering</HL> to deliver <HL gradient>secure, resilient, and highly available</HL> applications at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-6 text-sm sm:text-base md:text-lg font-mono truncate">
            <span className="text-muted-foreground">$ </span><TypingText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton href="#contact" variant="primary">
              <Sparkles className="h-4 w-4" /> Hire me
            </MagneticButton>
            <MagneticButton href="#projects" variant="outline">
              <Rocket className="h-4 w-4" /> View projects
            </MagneticButton>
            <MagneticButton variant="outline" onClick={() => window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { source: "hero" } }))}>
              <Download className="h-4 w-4" /> Download resume
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-muted-foreground">
            <a href="https://github.com/grlokesh96" target="_blank" rel="noreferrer" className="shrink-0 hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
            <a href="https://www.linkedin.com/in/grlokesh96" target="_blank" rel="noreferrer" className="shrink-0 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="mailto:grlokesh96@gmail.com" className="shrink-0 hover:text-white transition-colors"><Mail className="h-5 w-5" /></a>
            <div className="hidden sm:block h-4 w-px bg-white/10 shrink-0" />
            <span className="text-xs font-mono truncate">Hyderabad · Open to roles</span>
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
          title={<>Engineering platforms that <HL gradient>don't wake me up</HL></>}
          description="Results-driven AWS DevOps Engineer with 5+ years architecting cloud-native platforms, Kubernetes infrastructure, GitOps workflows, and DevSecOps pipelines across production environments."
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-2 glass rounded-3xl p-8 hover-glow">
            <div className="font-mono text-xs text-cyber-cyan mb-4">~/philosophy</div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p><span className="text-white">Automate the boring, protect the important.</span>{" "}
                I treat infrastructure as a product — with developers as users, uptime as the SLA,
                and platform capabilities as the roadmap.</p>
              <p>Deep expertise in Terraform, Ansible, Docker, and Amazon EKS, with CI/CD across
                GitHub Actions, Jenkins, GitLab CI, and Argo CD. I embed SonarQube, Trivy, Snyk, and
                Checkov into every stage of delivery.</p>
              <p>Track record: <span className="text-white">−60% deploy time</span>,{" "}
                <span className="text-white">−30% cloud cost</span>,{" "}
                <span className="text-white">−50% MTTR</span>, and{" "}
                <span className="text-white">99.9% uptime</span> across Dev, QA, UAT, and Prod.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
              {["GitOps", "IaC", "IRSA / OIDC", "Vault", "Karpenter", "Istio"].map(t => (
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
                <span>AWS DevOps Engineer at ASICS Technologies — 15+ microservices on EKS.</span></li>
              <li className="flex gap-3"><Shield className="h-4 w-4 mt-0.5 text-cyber-purple" />
                <span>Hardening GitOps delivery with Trivy, Snyk, Checkov, and Vault.</span></li>
              <li className="flex gap-3"><Zap className="h-4 w-4 mt-0.5 text-cyber-cyan" />
                <span>Scaling EKS workloads with Karpenter + HPA + Cluster Autoscaler.</span></li>
              <li className="flex gap-3"><Award className="h-4 w-4 mt-0.5 text-cyber-blue" />
                <span>Preparing for AWS SAA, CKA, and Terraform Associate.</span></li>
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
          title={<>Skills <HL gradient>dashboard</HL></>}
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
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
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

/* ------------------------------------------------------ Achievements --- */

const ACHIEVEMENTS = [
  {
    category: "AWS EKS",
    icon: Boxes,
    color: "#3B82F6",
    date: "2024 – 2026",
    org: "ASICS Technologies",
    headline: "Multi-tenant EKS platform for 15+ microservices",
    metrics: [
      { k: "Uptime SLA", v: "99.95%" },
      { k: "Node cost", v: "−42%" },
      { k: "Pod scale-out", v: "< 40s" },
    ],
    bullets: [
      "Migrated managed node groups to Karpenter with spot-first pools across 3 AZs.",
      "Enforced network policies + Istio mTLS across 4 namespaces and 15+ services.",
      "Cut cold-start on autoscaling events from ~3 min to under 40s.",
    ],
  },
  {
    category: "GitOps",
    icon: GitBranch,
    color: "#8B5CF6",
    date: "2023 – 2025",
    org: "L&T Construction · ASICS",
    headline: "Argo CD ApplicationSets across 12 environments",
    metrics: [
      { k: "Deploy time", v: "−60%" },
      { k: "Failed rollouts", v: "−75%" },
      { k: "MTTR", v: "−50%" },
    ],
    bullets: [
      "Replaced 40+ hand-rolled Jenkins jobs with a single GitOps promotion flow.",
      "Introduced progressive delivery (Argo Rollouts) with automated analysis gates.",
      "Every prod change now auditable via a signed Git commit — zero drift in 9 months.",
    ],
  },
  {
    category: "IaC",
    icon: FileCode,
    color: "#06B6D4",
    date: "2021 – 2024",
    org: "Larsen & Toubro Construction",
    headline: "Terraform across 12 AWS accounts, 200+ modules reused",
    metrics: [
      { k: "Account provisioning", v: "2 days → 25 min" },
      { k: "Drift incidents", v: "−90%" },
      { k: "Modules reused", v: "18" },
    ],
    bullets: [
      "Built a composable Terraform module library with Terratest + Checkov in CI.",
      "Landing zone via AWS Control Tower + Terraform bootstrap on every new account.",
      "Enforced least-privilege IAM via reusable policy modules and IRSA for workloads.",
    ],
  },
  {
    category: "Secure CI/CD",
    icon: ShieldCheck,
    color: "#22D3EE",
    date: "2022 – 2026",
    org: "Cross-org platform work",
    headline: "DevSecOps pipeline shift-left across 45+ services",
    metrics: [
      { k: "Critical CVEs in prod", v: "−96%" },
      { k: "Pipeline duration", v: "22m → 7m" },
      { k: "SBOM coverage", v: "100%" },
    ],
    bullets: [
      "Wired SonarQube, Trivy, Snyk, Checkov, and SBOM generation into one reusable workflow.",
      "Signed images with Cosign; Argo CD verifies signatures before promoting to prod.",
      "Secrets moved from CI variables to HashiCorp Vault + IRSA — zero long-lived creds.",
    ],
  },
  {
    category: "FinOps",
    icon: GaugeCircle,
    color: "#A78BFA",
    date: "2024 – 2025",
    org: "ASICS Technologies",
    headline: "Cloud cost program with per-team showback",
    metrics: [
      { k: "Monthly AWS bill", v: "−30%" },
      { k: "Idle spend", v: "−68%" },
      { k: "Right-sizing PRs", v: "120+" },
    ],
    bullets: [
      "Karpenter spot pools + consolidation; graviton adoption where compatible.",
      "Grafana cost dashboards per namespace made spend visible to product teams.",
      "Automated nightly shutdown of non-prod EKS node groups and RDS instances.",
    ],
  },
  {
    category: "Observability",
    icon: Activity,
    color: "#34D399",
    date: "2022 – 2024",
    org: "Larsen & Toubro Construction",
    headline: "Prometheus + Grafana + Loki stack, SLO-driven",
    metrics: [
      { k: "Alert noise", v: "−70%" },
      { k: "SLOs tracked", v: "45" },
      { k: "P1 detection", v: "< 90s" },
    ],
    bullets: [
      "Rolled out burn-rate alerting on error budgets — retired 200+ symptom-based alerts.",
      "Unified logs, metrics, and traces (OpenTelemetry) behind a single Grafana pane.",
      "On-call satisfaction score went from 2.9 → 4.4 / 5 in two quarters.",
    ],
  },
];

function Achievements() {
  return (
    <section id="impact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="// impact"
          title={<>Measurable <HL gradient>outcomes</HL>, not vibes</>}
          description="Selected results from AWS EKS, GitOps, Infrastructure-as-Code, and secure CI/CD work across the last five years."
        />

        <div className="grid md:grid-cols-2 gap-5">
          {ACHIEVEMENTS.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.article
                key={a.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group relative glass rounded-3xl p-6 md:p-7 border border-white/10 hover-glow overflow-hidden"
              >
                <div
                  className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
                  style={{ background: `radial-gradient(circle, ${a.color} 0%, transparent 70%)` }}
                />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl grid place-items-center border border-white/10"
                      style={{ background: `${a.color}22`, color: a.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-cyber-cyan">
                        {a.category}
                      </div>
                      <div className="text-xs text-muted-foreground">{a.org}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                    {a.date}
                  </span>
                </div>

                <h3 className="mt-5 text-lg md:text-xl font-semibold leading-snug">
                  {a.headline}
                </h3>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {a.metrics.map((m) => (
                    <div
                      key={m.k}
                      className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-center"
                    >
                      <div
                        className="font-display text-lg md:text-xl font-bold leading-none"
                        style={{ color: a.color }}
                      >
                        {m.v}
                      </div>
                      <div className="mt-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                        {m.k}
                      </div>
                    </div>
                  ))}
                </div>

                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {a.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <CircleCheck
                        className="h-4 w-4 mt-0.5 shrink-0"
                        style={{ color: a.color }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
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
          title={<>Selected <HL gradient>projects</HL></>}
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
          title={<>Interactive <HL gradient>cloud topology</HL></>}
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
          title={<>Secure delivery <HL gradient>pipeline</HL></>}
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
          title={<>Security <HL gradient>command center</HL></>}
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
  const [dlCount, setDlCount] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { count } = await supabase
        .from("resume_downloads")
        .select("*", { count: "exact", head: true });
      if (!cancelled) setDlCount(count ?? 0);
    };
    load();
    const ch = supabase
      .channel("resume_downloads_count")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "resume_downloads" },
        () => setDlCount((c) => (c ?? 0) + 1),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, []);
  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-8">
        <div>
          <SectionHeading
            eyebrow="// contact"
            title={<>Let's ship <HL gradient>something reliable</HL></>}
            description="Available for platform, DevSecOps, and cloud engineering roles. Consulting welcome."
          />
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-cyber-cyan" />
              <a href="mailto:grlokesh96@gmail.com" className="hover:text-white">grlokesh96@gmail.com</a>
            </div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-cyber-purple" />
              <span>+91 91009 48285</span>
            </div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-cyber-blue" />
              <span>Hyderabad, India · Remote-friendly</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton variant="primary" onClick={() => window.dispatchEvent(new CustomEvent("open-resume-preview", { detail: { source: "contact" } }))}>
              <Download className="h-4 w-4" /> Download resume
            </MagneticButton>
            <MagneticButton href="https://github.com/grlokesh96" variant="outline"><Github className="h-4 w-4" /> GitHub</MagneticButton>
            <MagneticButton href="https://www.linkedin.com/in/grlokesh96" variant="outline"><Linkedin className="h-4 w-4" /> LinkedIn</MagneticButton>
            <MagneticButton href="mailto:grlokesh96@gmail.com" variant="outline"><Mail className="h-4 w-4" /> Email</MagneticButton>
          </div>
          <div className="mt-3 text-xs font-mono text-muted-foreground flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-cyber-cyan" />
            <span>résumé downloads:&nbsp;
              <span className="text-white tabular-nums">{dlCount === null ? "—" : dlCount.toLocaleString()}</span>
            </span>
            <span className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 bg-white/[0.04] border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> live
            </span>
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
            <span className="text-gradient">grlokesh</span>
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

type SearchItem = {
  kind: "Section" | "Project" | "Experience" | "Article";
  label: string;
  sub?: string;
  href: string;
  tokens: string; // pre-lowercased haystack
};

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const n of NAV) {
    items.push({
      kind: "Section", label: n.label, sub: `Jump to #${n.id}`,
      href: `#${n.id}`,
      tokens: `${n.label} ${n.id}`.toLowerCase(),
    });
  }
  for (const p of PROJECTS) {
    items.push({
      kind: "Project", label: p.title, sub: `${p.tagline} — ${p.outcome}`,
      href: "#projects",
      tokens: `${p.title} ${p.tagline} ${p.outcome} ${p.stack.join(" ")}`.toLowerCase(),
    });
  }
  for (const e of EXPERIENCE) {
    items.push({
      kind: "Experience", label: `${e.role} · ${e.company}`, sub: `${e.period} — ${e.stack.join(", ")}`,
      href: "#experience",
      tokens: `${e.role} ${e.company} ${e.period} ${e.stack.join(" ")} ${e.bullets.join(" ")}`.toLowerCase(),
    });
  }
  for (const a of ARTICLES) {
    items.push({
      kind: "Article", label: a.title, sub: `${a.tag} · ${a.read} — ${a.excerpt}`,
      href: "#blog",
      tokens: `${a.title} ${a.tag} ${a.excerpt}`.toLowerCase(),
    });
  }
  return items;
}

/** Subsequence fuzzy match with proximity + word-boundary boosts. Returns null if no match. */
function fuzzyScore(query: string, hay: string): number | null {
  if (!query) return 0;
  let qi = 0, score = 0, streak = 0, lastIdx = -1;
  for (let i = 0; i < hay.length && qi < query.length; i++) {
    if (hay[i] === query[qi]) {
      let s = 4;
      if (i === 0 || hay[i - 1] === " " || hay[i - 1] === "-" || hay[i - 1] === "/") s += 6;
      if (lastIdx === i - 1) { streak++; s += streak * 3; } else { streak = 0; }
      score += s;
      lastIdx = i;
      qi++;
    }
  }
  if (qi < query.length) return null;
  // Prefer shorter haystacks a bit
  return score - Math.min(hay.length * 0.05, 20);
}

const KIND_COLOR: Record<SearchItem["kind"], string> = {
  Section: "text-cyber-cyan",
  Project: "text-cyber-purple",
  Experience: "text-emerald-400",
  Article: "text-amber-400",
};

/** Wrap up to N matches of `query` inside the target section with <mark class="portfolio-hl">.
 *  Auto-cleans previous highlights. Scrolls the first hit into view. */
function highlightInPage(targetHash: string, query: string) {
  // Clean any prior highlights
  document.querySelectorAll("mark.portfolio-hl").forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    while (m.firstChild) parent.insertBefore(m.firstChild, m);
    parent.removeChild(m);
    parent.normalize();
  });

  const id = targetHash.replace(/^#/, "");
  const root = (id && document.getElementById(id)) || document.body;
  const q = query.trim();
  if (!q) return;

  const needle = q.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "MARK" || tag === "INPUT" || tag === "TEXTAREA") return NodeFilter.FILTER_REJECT;
      return node.nodeValue.toLowerCase().includes(needle) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  const hits: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode()) && hits.length < 40) hits.push(n as Text);

  const created: HTMLElement[] = [];
  for (const textNode of hits) {
    const text = textNode.nodeValue!;
    const lower = text.toLowerCase();
    const frag = document.createDocumentFragment();
    let i = 0;
    while (i < text.length) {
      const idx = lower.indexOf(needle, i);
      if (idx === -1) { frag.appendChild(document.createTextNode(text.slice(i))); break; }
      if (idx > i) frag.appendChild(document.createTextNode(text.slice(i, idx)));
      const mark = document.createElement("mark");
      mark.className = "portfolio-hl";
      mark.textContent = text.slice(idx, idx + needle.length);
      frag.appendChild(mark);
      created.push(mark);
      i = idx + needle.length;
    }
    textNode.parentNode?.replaceChild(frag, textNode);
  }

  if (created.length) {
    created[0].classList.add("is-primary");
    setTimeout(() => created[0].scrollIntoView({ behavior: "smooth", block: "center" }), 220);
  }

  // Auto-clean after a while
  window.setTimeout(() => {
    created.forEach((m) => {
      const parent = m.parentNode;
      if (!parent) return;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize();
    });
  }, 6000);
}


const FILTERS: ("All" | SearchItem["kind"])[] = ["All", "Section", "Project", "Experience", "Article"];

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const index = useMemo(() => buildSearchIndex(), []);
  const listRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const query = q.trim().toLowerCase();
    const c: Record<string, number> = { All: 0, Section: 0, Project: 0, Experience: 0, Article: 0 };
    for (const item of index) {
      if (query && fuzzyScore(query, item.tokens) === null) continue;
      c[item.kind]++;
      c.All++;
    }
    return c;
  }, [q, index]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const pool = filter === "All" ? index : index.filter(i => i.kind === filter);
    if (!query) {
      return filter === "All" ? pool.filter(i => i.kind === "Section") : pool;
    }
    const scored: { item: SearchItem; score: number }[] = [];
    for (const item of pool) {
      const s = fuzzyScore(query, item.tokens);
      if (s !== null) scored.push({ item, score: s });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 20).map(s => s.item);
  }, [q, index, filter]);

  useEffect(() => { setActive(0); }, [q, open, filter]);
  useEffect(() => { if (!open) { setQ(""); setFilter("All"); } }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(results.length - 1, a + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
      else if (e.key === "Tab") {
        e.preventDefault();
        const dir = e.shiftKey ? -1 : 1;
        const i = FILTERS.indexOf(filter);
        setFilter(FILTERS[(i + dir + FILTERS.length) % FILTERS.length]);
      }
      else if (e.key === "Enter") {
        const it = results[active];
        if (it) {
          const query = q.trim();
          window.location.hash = it.href;
          onClose();
          window.setTimeout(() => highlightInPage(it.href, query || it.label), 260);
        }
      }

    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose, filter]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm grid place-items-start pt-24 px-4">
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl glass-strong rounded-2xl overflow-hidden neon-ring">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <Command className="h-4 w-4 text-cyber-cyan" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                     placeholder="Search sections, projects, experience, articles…"
                     className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">esc</kbd>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 overflow-x-auto">
              {FILTERS.map((f) => {
                const isActive = filter === f;
                const count = counts[f] ?? 0;
                return (
                  <button key={f} type="button" onClick={() => setFilter(f)}
                    className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider transition ${
                      isActive
                        ? "bg-cyber-cyan/20 text-cyber-cyan ring-1 ring-cyber-cyan/40"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}>
                    {f}
                    <span className={`text-[10px] px-1 rounded ${isActive ? "bg-cyber-cyan/20" : "bg-white/5"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div ref={listRef} className="max-h-96 overflow-auto p-2">
              {results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No matches {q && <>for <span className="font-mono text-cyber-cyan">"{q}"</span></>} in <span className="text-cyber-purple">{filter}</span>
                </div>
              )}
              {results.map((it, i) => (
                <a key={`${it.kind}-${it.label}-${i}`} href={it.href} data-idx={i}
                   onMouseEnter={() => setActive(i)}
                   onClick={() => {
                     const query = q.trim();
                     onClose();
                     window.setTimeout(() => highlightInPage(it.href, query || it.label), 260);
                   }}

                   className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                     i === active ? "bg-white/10" : "hover:bg-white/5"
                   }`}>
                  <span className={`font-mono text-[10px] uppercase tracking-wider w-16 ${KIND_COLOR[it.kind]}`}>
                    {it.kind}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{it.label}</div>
                    {it.sub && <div className="truncate text-xs text-muted-foreground">{it.sub}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-cyber-purple shrink-0" />
                </a>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 text-[10px] font-mono text-muted-foreground">
              <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
              <span>↹ filter · ↑↓ nav · ↵ open · esc close</span>
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
                <span className="text-white">lokesh@portfolio</span>
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
        <Achievements />
        <Architecture />
        <Pipeline />
        <Security />
        <GitHubStrip />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} />
      <ResumePreviewModal />
      <SmoothScroll />
      <CustomCursor />
      
      <AIAssistant />
    </div>
  );
}
