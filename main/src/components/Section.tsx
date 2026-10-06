import type { ReactNode } from "react";

type Tone = "light" | "tint" | "glow";
const TONE: Record<Tone, string> = { light: "", tint: "section-tint", glow: "section-glow" };

export default function Section({ id, title, eyebrow, children, tone = "light" }: { id?: string; title?: string; eyebrow?: string; children: ReactNode; tone?: Tone }) {
  return (
    <section id={id} data-rtc-component={`${id || "section"}`} className={`section-pad py-20 ${TONE[tone]}`}>
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {(eyebrow || title) && (
          <div className="reveal">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            {title && <h2 data-rtc-component={`${id || "section"}_heading`} className="section-title gradient-heading mb-10 max-w-4xl">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
