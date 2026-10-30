import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Sign up · Presently 🎀" };

export default async function SignUpPage() {
  if (await getSession()) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md pt-6">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Make your gift list 🎁</h1>
      <p className="mb-6 mt-2 text-ink/70">Free forever. Takes 20 seconds.</p>
      <AuthForm mode="signup" />
    </div>
  );
}
