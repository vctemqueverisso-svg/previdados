type Props = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-8 border-b border-[rgba(24,38,63,0.08)] pb-7">
      <p className="eyebrow">Painel juridico</p>
      <h2 className="mt-3 max-w-4xl text-[2.45rem] font-semibold leading-[1.02] text-ink md:text-[3.25rem]">{title}</h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">{description}</p>
    </div>
  );
}
