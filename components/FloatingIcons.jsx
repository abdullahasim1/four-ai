"use client";

import { cloneElement, isValidElement, useMemo } from "react";
import { motion } from "framer-motion";

const PALETTE = [
  "text-indigo-400/25",
  "text-violet-400/25",
  "text-fuchsia-400/20",
  "text-sky-400/20",
  "text-purple-400/25",
];

// Deterministic pseudo-random so positions are stable across renders
function seeded(i, salt) {
  const x = Math.sin(i * 9973 + salt * 31) * 10000;
  return x - Math.floor(x);
}

// Accepts either a component (FaMagic) or an element (<FaMagic />)
function renderIcon(Icon, sizeRem) {
  if (!Icon) return null;
  const style = { fontSize: `${sizeRem}rem` };
  if (isValidElement(Icon)) {
    return cloneElement(Icon, { style: { ...Icon.props.style, ...style } });
  }
  const Component = Icon;
  return <Component style={style} />;
}

export default function FloatingIcons({ icons = [], count = 10 }) {
  const items = useMemo(
    () =>
      Array.from({ length: Math.min(count, icons.length || count) }, (_, i) => ({
        Icon: icons[i % icons.length],
        left: seeded(i, 1) * 90 + 2,
        top: seeded(i, 2) * 85 + 2,
        size: 1.6 + seeded(i, 3) * 2.2,
        duration: 9 + seeded(i, 4) * 8,
        delay: seeded(i, 5) * 4,
        color: PALETTE[i % PALETTE.length],
      })),
    [icons, count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.color}`}
          style={{ left: `${item.left}%`, top: `${item.top}%` }}
          animate={{ y: [-18, 18, -18], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
        >
          {renderIcon(item.Icon, item.size)}
        </motion.div>
      ))}
    </div>
  );
}
