"use client";

import { motion } from "framer-motion";

/**
 * Shared page shell: dark mesh background + optional floating icons.
 * Keeps every page visually consistent.
 */
export default function PageShell({ icons, children, className = "", contentClassName = "" }) {
  return (
    <div className={`page-shell relative min-h-screen overflow-hidden ${className}`}>
      <div className="mesh-bg absolute inset-0" aria-hidden="true" />
      {icons && (
        <div className="absolute inset-0">
          {icons}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`relative z-10 ${contentClassName}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function PageHeader({ icon, title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h1 className="section-title flex items-center justify-center gap-3">
        {icon}
        <span>{title}</span>
      </h1>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}
