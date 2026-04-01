type Props = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="card relative overflow-hidden px-5 py-5">
      <div className="absolute right-3 top-3 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(126,145,180,0.12),transparent_68%)]" />
      <div className="relative">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <p className="metric-value mt-6 text-ink">{value}</p>
        {hint ? <p className="mt-3 max-w-[26ch] text-[11px] leading-5 text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}
