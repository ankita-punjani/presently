import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Log in · Presently 🎀" };

export default async function LogInPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Welcome back 👋</h1>
      <p className="mb-6 mt-2 text-ink/70">Your people are waiting.</p>
      <AuthForm mode="login" />
    </div>
  );
}
