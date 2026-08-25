export function SpecTag({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-l-2 border-electric/40 pl-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">{k}</span>
      <span className="font-mono text-sm tracking-[0.1em] text-white">{v}</span>
    </div>
  );
}
