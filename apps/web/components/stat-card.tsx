type Props = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: Props) {
  return (
    <div className="card relative overflow-hidden p-5">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(126,145,180,0.14),transparent_68%)]" />
      <p className="text-[13px] font-medium text-slate-600">{label}</p>
      <p className="metric-value mt-5 text-ink">{value}</p>
      {hint ? <p className="mt-2 max-w-[24ch] text-[11px] leading-5 text-slate-500">{hint}</p> : null}
    </div>
  );
}
