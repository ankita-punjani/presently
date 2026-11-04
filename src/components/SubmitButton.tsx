"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label, pendingLabel, plain = false }: { label: string; pendingLabel: string; plain?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={plain ? "btn-plain" : "btn-pink"}>
      {pending ? pendingLabel : label}
    </button>
  );
}
