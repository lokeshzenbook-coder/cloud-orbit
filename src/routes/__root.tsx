import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  useEffect(() => {
    document.title = "404 — Page not found · G R Lokesh";
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs text-cyber-cyan mb-4">$ kubectl get page --name=404</div>
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Pod not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This route isn't scheduled on any node in G R Lokesh's cluster.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-cyber px-5 py-2.5 text-sm font-medium text-white hover-glow"
          >
            Return to cluster
          </Link>
        </div>
      </div>
    </div>
  );
}


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Deployment failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">Rolling back and retrying.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-gradient-cyber px-4 py-2 text-sm font-medium text-white"
          >
            Retry deploy
          </button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "G R Lokesh — Senior DevOps & DevSecOps Engineer" },
      {
        name: "description",
        content:
          "Interactive cloud-ops portfolio. AWS, Kubernetes, Terraform, GitOps, DevSecOps pipelines. 8+ years shipping reliable, secure platforms.",
      },
      { name: "author", content: "G R Lokesh" },
      { name: "theme-color", content: "#050816" },
      { property: "og:title", content: "G R Lokesh — Senior DevOps & DevSecOps Engineer" },
      {
        property: "og:description",
        content:
          "Interactive cloud-ops portfolio. AWS, Kubernetes, Terraform, GitOps, DevSecOps pipelines. 8+ years shipping reliable, secure platforms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "G R Lokesh — Senior DevOps & DevSecOps Engineer" },
      { name: "twitter:description", content: "Interactive cloud-ops portfolio. AWS, Kubernetes, Terraform, GitOps, DevSecOps pipelines. 8+ years shipping reliable, secure platforms." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/22bdcbd2-26ba-4702-af95-9911781181cf/id-preview-e8c912fc--a67312a8-020b-40e9-9865-10f113ecd972.lovable.app-1784472364114.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/22bdcbd2-26ba-4702-af95-9911781181cf/id-preview-e8c912fc--a67312a8-020b-40e9-9865-10f113ecd972.lovable.app-1784472364114.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // DNS + TCP + TLS warmup for Google Fonts before the CSS request fires
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      // High-priority preload of the fonts CSS itself so the browser can start
      // discovering the underlying woff2 files ASAP; the stylesheet below still
      // applies it. `display=swap` renders fallback immediately, `display=optional`
      // would drop late loads — swap keeps visual consistency once fonts land.
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
        fetchpriority: "high",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
