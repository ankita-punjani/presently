const STYLES: Record<string, string> = {
  idea: "bg-lilac/50",
  bought: "bg-tangerine/40",
  given: "bg-lime",
};

const LABELS: Record<string, string> = {
  idea: "💡 Idea",
  bought: "🛍️ Bought",
  given: "🎉 Given",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-3 py-0.5 text-sm font-semibold ${STYLES[status] ?? ""}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
