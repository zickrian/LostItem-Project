import { Reveal } from "./Reveal";

export function SectionHeader({
  title, subtitle, center = true,
}: { title: string; subtitle?: string; center?: boolean }) {
  const align = center ? "text-center" : "text-left";
  return (
    <>
      <Reveal as="h2" preset="fadeUp" className={`${align} text-4xl md:text-5xl font-extrabold text-slate-900`}>
        {title}
      </Reveal>
      {subtitle && (
        <Reveal as="p" preset="fadeUp" delay={0.1} className={`mt-3 ${align} text-slate-500`}>
          {subtitle}
        </Reveal>
      )}
    </>
  );
}
