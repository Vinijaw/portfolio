import { useState } from "react";
import PlaygroundCard from "./PlaygroundCard.jsx";
import { playgroundItems } from "../../data/playgroundItems.js";

// Spans do bento grid desktop (grid-cols-4), por tamanho do item.
// Fixos mesmo no hover: o card "cresce" via transform (scale), nunca via
// col-span/row-span — mudar o span no hover faz o Grid recalcular a posição
// de todos os outros cards a cada passada de mouse (eles pulam de lugar e
// podem sair da área visível, que é cortada em 85vh).
const SPAN_MAP = {
  lg: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2 md:row-span-1",
  tall: "md:col-span-1 md:row-span-2",
  sm: "md:col-span-1 md:row-span-1",
};

const MOBILE_CARD_COUNT = 3;

export default function PlaygroundSection() {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeMobileId, setActiveMobileId] = useState(null);

  const mobileItems = playgroundItems.slice(0, MOBILE_CARD_COUNT);

  return (
    <section id="playground" className="bg-ink py-section">
      <div className="mx-auto max-w-container px-6">
        <p className="tag tag--onDark">Laboratório</p>
        <h2 className="max-w-none font-display text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[1.05] tracking-tight text-onDark">
          Playground <span className="text-accent">•</span>{" "}
          <em className="not-italic text-accent">Experimentos</em>
        </h2>
        <p className="mt-4 max-w-[60ch] text-onDark-muted">
          Microinterações, conceitos de interface e testes rápidos de UI — sem processo
          detalhado, só o resultado visual.
        </p>

        {/* ===================== DESKTOP: bento grid ===================== */}
        <div className="relative isolate mt-10 hidden md:block">
          <div className="max-h-[85vh] overflow-hidden">
            <div className="grid grid-cols-4 auto-rows-[170px] grid-flow-dense gap-5">
              {playgroundItems.map((item) => (
                <PlaygroundCard
                  key={item.id}
                  item={item}
                  expanded={hoveredId === item.id}
                  interactive="hover"
                  onHoverStart={() => setHoveredId(item.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  spanClassName={SPAN_MAP[item.size]}
                />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 bg-gradient-to-t from-ink to-transparent" />
          <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center">
            <a href="/playground" className="btn btn--primary">
              Ver todos os experimentos
            </a>
          </div>
        </div>

        {/* ===================== MOBILE: lista de 3 cards ===================== */}
        <div className="mt-10 flex flex-col gap-5 md:hidden">
          {mobileItems.map((item, index) => {
            const isLast = index === mobileItems.length - 1;
            const expanded = activeMobileId === item.id;

            const card = (
              <PlaygroundCard
                item={item}
                expanded={expanded}
                interactive="tap"
                onTap={() => setActiveMobileId(expanded ? null : item.id)}
                spanClassName="aspect-[4/3] w-full"
              />
            );

            if (!isLast) {
              return <div key={item.id}>{card}</div>;
            }

            return (
              <div key={item.id} className="relative isolate">
                {card}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 rounded-b-ds bg-gradient-to-t from-ink to-transparent" />
                <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center">
                  <a href="/playground" className="btn btn--primary">
                    Ver todos os experimentos
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
