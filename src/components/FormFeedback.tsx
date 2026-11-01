import type { FormState } from "@/lib/validation";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p id={`${id}-error`} className="mt-1 text-sm font-medium text-pink">{message}</p>;
}

// Errors can sit far above the button on a phone, so say so next to it.
export function FormSummary({ errors }: { errors: FormState["errors"] }) {
  const count = Object.keys(errors).length;
  if (count === 0) return null;
  return (
    <p role="alert" className="rounded-xl border-2 border-ink bg-pink/15 px-4 py-3 text-sm font-semibold">
      {count === 1 ? "One thing needs fixing" : `${count} things need fixing`} before we can save ☝️
    </p>
  );
}

export function fieldProps(id: string, errors: FormState["errors"], extraClass = "") {
  return {
    id,
    name: id,
    className: `field ${extraClass} ${errors[id] ? "field-error" : ""}`,
    "aria-invalid": Boolean(errors[id]),
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  };
}
