"use client";

import { useState } from "react";

export function ShareLink({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(new URL(path, window.location.origin).href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={copy} className="btn-pink">
      {copied ? "Copied ✅" : "Copy link 🔗"}
    </button>
  );
}
