"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LogOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logOut() {
    setPending(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={logOut} disabled={pending} className="btn-plain py-2 text-sm">
      {pending ? "Bye…" : "Log out 👋"}
    </button>
  );
}
