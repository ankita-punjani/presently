type Props = { label: string; value: string; tint: string; tilt?: string };

export function StatCard({ label, value, tint, tilt = "" }: Props) {
  return (
    <div className={`sticker ${tint} ${tilt} p-4 transition sm:p-5 hover:rotate-0`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-4xl">{value}</p>
    </div>
  );
}
