"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Mode = "signup" | "login";
type Errors = Partial<Record<"name" | "email" | "password" | "form", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(mode: Mode, name: string, email: string, password: string): Errors {
  const errors: Errors = {};
  if (mode === "signup" && !name.trim()) errors.name = "What should we call you? 🙂";
  if (!email.trim()) errors.email = "We need your email to find your account.";
  else if (!EMAIL_RE.test(email.trim())) errors.email = "That email looks a little off. Check for typos?";
  if (!password) errors.password = "Don't forget your password!";
  else if (mode === "signup" && password.length < 8) errors.password = "Make it at least 8 characters 💪";
  return errors;
}

// Turn Better Auth error codes into friendly copy.
function friendly(code: string | undefined, mode: Mode): string {
  switch (code) {
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "That email already has an account. Try logging in instead?";
    case "INVALID_EMAIL_OR_PASSWORD":
      return "That email and password don't match. Try again?";
    default:
      return mode === "signup"
        ? "Something went wrong creating your account. Try again in a sec."
        : "Something went wrong logging you in. Try again in a sec.";
  }
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(mode, name, email, password);
    setErrors(found);
    if (Object.keys(found).length) return;

    setPending(true);
    const { error } =
      mode === "signup"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
    setPending(false);

    if (error) {
      setErrors({ form: friendly(error.code, mode) });
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  // Clear a field's error as soon as the user edits it.
  function clear(field: keyof Errors) {
    if (!errors[field] && !errors.form) return;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      delete next.form;
      return next;
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="sticker space-y-4 p-6 sm:p-8">
      {errors.form && (
        <p role="alert" className="rounded-xl border-2 border-ink bg-pink/15 px-4 py-3 text-sm font-semibold">
          {errors.form}
        </p>
      )}

      {mode === "signup" && (
        <div>
          <label htmlFor="name" className="label">Your name</label>
          <input
            id="name"
            className={`field ${errors.name ? "field-error" : ""}`}
            placeholder="Ankita"
            autoComplete="name"
            value={name}
            onChange={(e) => { setName(e.target.value); clear("name"); }}
          />
          {errors.name && <p className="mt-1 text-sm font-medium text-pink">{errors.name}</p>}
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">Email</label>
        <input
          id="email"
          type="email"
          className={`field ${errors.email ? "field-error" : ""}`}
          placeholder="you@berkeley.edu"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clear("email"); }}
        />
        {errors.email && <p className="mt-1 text-sm font-medium text-pink">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="label">Password</label>
        <input
          id="password"
          type="password"
          className={`field ${errors.password ? "field-error" : ""}`}
          placeholder={mode === "signup" ? "8+ characters" : "Your password"}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => { setPassword(e.target.value); clear("password"); }}
        />
        {errors.password && <p className="mt-1 text-sm font-medium text-pink">{errors.password}</p>}
      </div>

      <button type="submit" disabled={pending} className="btn-pink w-full">
        {pending
          ? mode === "signup" ? "Wrapping it up…" : "Logging in…"
          : mode === "signup" ? "Create my account 🎁" : "Log in"}
      </button>

      <p className="text-center text-sm">
        {mode === "signup" ? (
          <>Already have an account? <Link href="/login" className="font-semibold underline decoration-pink decoration-2 underline-offset-4">Log in</Link></>
        ) : (
          <>New here? <Link href="/signup" className="font-semibold underline decoration-pink decoration-2 underline-offset-4">Make an account</Link></>
        )}
      </p>
    </form>
  );
}
