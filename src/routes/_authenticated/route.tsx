import { createFileRoute, Outlet, useNavigate, useHydrated } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [status, setStatus] = useState<"checking" | "authed" | "anon">("checking");

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data.user) {
        setStatus("anon");
        navigate({ to: "/auth", replace: true });
      } else {
        setStatus("authed");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // Match the server-rendered Suspense(fallback=null) on the very first client
  // render so hydration succeeds; reveal UI after hydration.
  if (!hydrated) return null;

  if (status !== "authed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-xs text-muted-foreground font-mono">
        $ auth --verify …
      </div>
    );
  }

  return <Outlet />;
}
