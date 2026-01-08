"use client";

import { useActionState, useState, useEffect } from "react";
import { login, signup, type AuthState } from "@/actions/auth-actions";

const initialState: AuthState = {};

export function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(
    login,
    initialState
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signup,
    initialState
  );

  const state = mode === "login" ? loginState : signupState;
  const action = mode === "login" ? loginAction : signupAction;
  const isPending = mode === "login" ? loginPending : signupPending;

  // Reset state when switching modes
  useEffect(() => {
    // States are managed by useActionState, they reset on form submission
  }, [mode]);

  // Show success message for signup
  if (signupState.success && mode === "signup") {
    return (
      <div className="text-center">
        <div className="success-message mb-4">
          <strong>Check your email!</strong>
          <p className="mt-1">
            We&apos;ve sent you a confirmation link. Please check your inbox and
            click the link to activate your account.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMode("login")}
          className="btn btn-secondary w-full"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Mode Toggle */}
      <div
        className="flex mb-6 p-1 rounded-lg"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <button
          type="button"
          onClick={() => setMode("login")}
          className="flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor:
              mode === "login" ? "var(--color-input-bg)" : "transparent",
            color:
              mode === "login"
                ? "var(--color-foreground)"
                : "var(--color-muted)",
            boxShadow:
              mode === "login" ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className="flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor:
              mode === "signup" ? "var(--color-input-bg)" : "transparent",
            color:
              mode === "signup"
                ? "var(--color-foreground)"
                : "var(--color-muted)",
            boxShadow:
              mode === "signup" ? "0 1px 2px rgba(0, 0, 0, 0.05)" : "none",
          }}
        >
          Create Account
        </button>
      </div>

      {/* Error Message */}
      {state.error && <div className="error-message mb-4">{state.error}</div>}

      {/* Form */}
      <form action={action} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={`input ${state.fieldErrors?.email ? "input-error" : ""}`}
            disabled={isPending}
          />
          {state.fieldErrors?.email && (
            <p className="field-error">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            placeholder={mode === "signup" ? "Min 8 chars, upper, lower, number" : "••••••••"}
            minLength={8}
            className={`input ${state.fieldErrors?.password ? "input-error" : ""}`}
            disabled={isPending}
          />
          {state.fieldErrors?.password && (
            <p className="field-error">{state.fieldErrors.password[0]}</p>
          )}
          {mode === "signup" && !state.fieldErrors?.password && (
            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--color-muted)" }}
            >
              Must include uppercase, lowercase, and a number
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-full"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="spinner" />
              {mode === "login" ? "Signing in..." : "Creating account..."}
            </span>
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Forgot Password (login mode only) */}
      {mode === "login" && (
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm hover:underline"
            style={{ color: "var(--color-primary)" }}
            onClick={() => {
              // TODO: Implement forgot password
              alert("Forgot password functionality coming soon");
            }}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
}
