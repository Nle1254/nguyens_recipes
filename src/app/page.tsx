import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";

interface PageProps {
  searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function LandingPage({ searchParams }: PageProps) {
  // Check if user is already authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/recipes");
  }

  const params = await searchParams;
  const message = params.message;
  const error = params.error;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(194, 65, 12, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(194, 65, 12, 0.06) 0%, transparent 50%)`,
        }}
      />

      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nguyen&apos;s Recipes
          </h1>
          <p
            className="text-lg"
            style={{ color: "var(--color-muted)" }}
          >
            Your personal recipe collection
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-sm text-center">
            {message}
          </div>
        )}

        {error === "auth-code-error" && (
          <div className="error-message mb-6 text-center">
            There was an error confirming your email. Please try again.
          </div>
        )}

        {/* Auth Form */}
        <div
          className="p-8 rounded-xl shadow-sm"
          style={{
            backgroundColor: "var(--color-input-bg)",
            border: "1px solid var(--color-border)",
          }}
        >
          <AuthForm />
        </div>

        {/* Footer */}
        <p
          className="mt-8 text-center text-sm"
          style={{ color: "var(--color-muted)" }}
        >
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
