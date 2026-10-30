"use client";

import { useRef } from "react";
import { SubmitButton } from "./SubmitButton";

type Props = {
  name: string;
  keepLabel: string;
  warning?: string;
  action: () => Promise<void>;
};

export function DeleteButton({ name, keepLabel, warning, action }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialog.current?.showModal()} className="btn-plain">
        Delete
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="delete-title"
        className="sticker m-auto w-[calc(100%-2rem)] max-w-md p-6 text-ink backdrop:bg-ink/50"
      >
        <p className="text-4xl" aria-hidden>🗑️</p>
        <h2 id="delete-title" className="mt-2 font-display text-2xl font-bold">Delete {name}?</h2>
        <p className="mt-1 text-ink/70">Are you sure? {warning} This can’t be undone.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <form action={action}>
            <SubmitButton label="Yes, delete" pendingLabel="Deleting…" />
          </form>
          <button type="button" onClick={() => dialog.current?.close()} className="btn-plain">
            {keepLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
