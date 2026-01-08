import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/actions/auth-actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Recipes",
};

export default async function RecipesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-700">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              My Recipes
            </h1>
            <p className="mt-1 text-sm text-muted">
              Welcome back, {user.email}
            </p>
          </div>
          <form action={logout}>
            <button type="submit" className="btn btn-secondary">
              Sign Out
            </button>
          </form>
        </header>

        <div className="text-center py-16 rounded-xl bg-input border border-default">
          <div className="text-5xl mb-4" role="img" aria-label="Chef hat">
            👨‍🍳
          </div>
          <h2 className="text-xl font-semibold mb-2">No recipes yet</h2>
          <p className="mb-6 text-muted">
            Start building your collection by adding your first recipe.
          </p>
          <Link href="/recipes/new" className="btn btn-primary">
            Add Your First Recipe
          </Link>
        </div>
      </div>
    </main>
  );
}