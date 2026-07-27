import { motion, AnimatePresence } from "framer-motion";

const overlayTransition = { type: "spring", stiffness: 320, damping: 32 };

/**
 * Card individual do Playground.
 *
 * Dois modos de interação, mutuamente exclusivos:
 * - "hover" (desktop): "expande" com scale + sombra (nunca muda col/row-span,
 *   pra não recalcular a posição dos cards vizinhos no Grid) e revela o overlay.
 * - "tap" (mobile/touch): mesmo efeito de scale, disparado por toque.
 */
export default function PlaygroundCard({
  item,
  expanded,
  interactive,
  onHoverStart,
  onHoverEnd,
  onTap,
  spanClassName = "",
}) {
  const isTap = interactive === "tap";

  return (
    <motion.div
      layout
      transition={overlayTransition}
      onHoverStart={interactive === "hover" ? onHoverStart : undefined}
      onHoverEnd={interactive === "hover" ? onHoverEnd : undefined}
      onClick={isTap ? onTap : undefined}
      role={isTap ? "button" : undefined}
      tabIndex={isTap ? 0 : undefined}
      onKeyDown={
        isTap
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onTap?.();
              }
            }
          : undefined
      }
      aria-expanded={isTap ? expanded : undefined}
      style={{ zIndex: expanded ? 10 : 0 }}
      className={`group relative isolate flex origin-center overflow-hidden rounded-ds border border-line-onDark bg-ink-alt transition-[transform,box-shadow] duration-300 ease-out ${
        expanded ? "scale-[1.06] shadow-2xl shadow-black/50" : "scale-100 shadow-none"
      } ${spanClassName}`}
    >
      {item.mediaType === "video" ? (
        <video
          className={`h-full w-full object-cover transition-transform duration-500 ${
            expanded ? "scale-105" : "scale-100"
          }`}
          src={item.mediaUrl}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          className={`h-full w-full object-cover transition-transform duration-500 ${
            expanded ? "scale-105" : "scale-100"
          }`}
          src={item.mediaUrl}
          alt={item.title}
          loading="lazy"
        />
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={overlayTransition}
            className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-ink via-ink/85 to-transparent p-4 pt-10 sm:p-5 sm:pt-12"
          >
            <h3 className="font-display text-base font-semibold text-onDark sm:text-lg">
              {item.title}
            </h3>
            <p className="line-clamp-2 text-sm text-onDark-muted">{item.description}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-medium text-onDark-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            {item.prototypeUrl && (
              <a
                href={item.prototypeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="mt-1 inline-flex w-fit items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-onDark"
              >
                Visualizar Protótipo ↗
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
