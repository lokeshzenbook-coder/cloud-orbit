import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const RESUME_CONTEXT = `
You are the AI portfolio assistant for G R Lokesh, a Senior DevOps / DevSecOps Engineer based in Hyderabad, India.
Answer questions from recruiters and engineers concisely (2-4 short paragraphs max, use markdown bullets where helpful).
Be friendly, factual, and never invent information not present below. If asked something unknown, suggest emailing grlokesh96@gmail.com.

# Profile
- Name: G R Lokesh
- Role: Senior AWS DevOps / DevSecOps Engineer
- Location: Hyderabad, India
- Email: grlokesh96@gmail.com
- Phone: +91 91009 48285
- GitHub / LinkedIn: grlokesh96
- Experience: 5+ years shipping cloud-native platforms

# Core Stack
AWS (EKS, EC2, VPC, IAM, S3, RDS, CloudFront, Route53), Kubernetes, Docker, Helm,
Terraform, Ansible, Argo CD (GitOps), Jenkins, GitHub Actions, GitLab CI,
Prometheus, Grafana, ELK, CloudWatch,
DevSecOps: SonarQube, Trivy, Snyk, Checkov, Vault, SBOM,
Languages: Python, Bash, Go, YAML.

# Experience
- ASICS Technologies — Senior DevOps Engineer (Jul 2024 – Jul 2026)
  Built EKS multi-tenant platform, GitOps with Argo CD, Istio service mesh,
  Karpenter autoscaling. Reduced deploy time 60%, cut cloud spend 30%.
- Larsen & Toubro Construction — DevOps Engineer (Sep 2021 – Jul 2024)
  Terraform IaC across 12 AWS accounts, Jenkins → GitHub Actions migration,
  Prometheus/Grafana observability stack for 45+ microservices.
- Progile Infotech — Cloud Engineer (Apr 2020 – Aug 2021)
  AWS infrastructure automation, CI/CD pipelines, container onboarding.

# Education
B.Tech, Civil Engineering — AITS (2015 – 2019). Self-taught into cloud/DevOps.

# Certifications (achieved / in-progress)
AWS Solutions Architect Associate, Certified Kubernetes Administrator (CKA),
HashiCorp Terraform Associate, AWS Developer Associate.

# Flagship Projects
1. Enterprise DevSecOps Pipeline — GitHub Actions + Trivy + Snyk + SBOM + Argo CD → EKS.
2. Multi-tenant EKS Platform — Karpenter, Istio, cost dashboards.
3. GitOps Migration — Jenkins → Argo CD, 60% faster deploys, full audit trail.
4. Cloud Cost Optimization — Spot/Karpenter + right-sizing → 30% savings.

# Philosophy
"Infrastructure is a product." Prioritize developer experience, observability,
security-as-code, and least-privilege by default.
`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as { message?: unknown };
    if (typeof obj?.message !== "string" || !obj.message.trim()) {
      throw new Error("message required");
    }
    return { message: obj.message.slice(0, 1000) };
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: RESUME_CONTEXT,
      prompt: data.message,
    });
    return { reply: text };
  });
