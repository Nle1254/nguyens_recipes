"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Validation schemas
const authSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters"),
});

const signupSchema = authSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type AuthState = {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Validate input
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = authSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      error: "Invalid credentials",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return {
      error: error.message === "Invalid login credentials"
        ? "Invalid email or password"
        : error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/recipes");
}

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  // Validate input with stricter password requirements
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = signupSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      error: "Please fix the errors below",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    // Handle specific Supabase errors
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists" };
    }
    return { error: error.message };
  }

  return {
    success: true,
  };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
