"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheck,
  FaCrown,
  FaHeadphones,
  FaInfinity,
  FaMicrophone,
} from "react-icons/fa";
import Link from "next/link";

import PageShell from "@/components/PageShell";
import { getSession } from "@/lib/auth-client";

const PLANS = [
  {
    name: "Basic",
    price: "$9.99",
    period: "/month",
    tagline: "For trying things out",
    icon: <FaMicrophone className="text-2xl" />,
    gradient: "from-blue-500 to-indigo-500",
    popular: false,
    features: [
      "100 voice generations / month",
      "20 AI images / month",
      "Standard quality output",
      "All voice effects",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "/month",
    tagline: "For serious creators",
    icon: <FaHeadphones className="text-2xl" />,
    gradient: "from-fuchsia-500 to-violet-500",
    popular: true,
    features: [
      "Unlimited generations",
      "High-quality outputs",
      "Priority generation queue",
      "Full usage history sync",
      "WAV downloads",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$49.99",
    period: "/month",
    tagline: "For teams & studios",
    icon: <FaCrown className="text-2xl" />,
    gradient: "from-amber-500 to-orange-500",
    popular: false,
    features: [
      "Everything in Pro",
      "API access with keys",
      "Custom voice training",
      "Team workspaces",
      "Dedicated account manager",
      "99.9% uptime SLA",
    ],
  },
];

export default function Pricing() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getSession()));
  }, []);

  return (
    <PageShell contentClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <span className="badge mx-auto">Pricing</span>
        <h1 className="mt-4 section-title">Simple, honest pricing</h1>
        <p className="section-subtitle">
          Start free and upgrade when you need more power. Cancel anytime.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className={`glass-card relative flex flex-col p-8 ${
              plan.popular
                ? "!border-indigo-400/50 shadow-[0_0_50px_-15px_rgba(129,140,248,0.45)]"
                : ""
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                MOST POPULAR
              </span>
            )}

            <div className="text-center">
              <span className={`inline-flex rounded-xl bg-gradient-to-br ${plan.gradient} p-3.5 text-white shadow-lg`}>
                {plan.icon}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.tagline}</p>
              <p className="mt-4 flex items-end justify-center gap-1">
                <span className="font-display text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-400">{plan.period}</span>
              </p>
            </div>

            <ul className="mt-7 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <FaCheck className="mt-1 shrink-0 text-emerald-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href={loggedIn ? "/voice-generator" : "/signup"}
              className={`mt-8 w-full justify-center ${plan.popular ? "btn-primary" : "btn-secondary"}`}
            >
              {loggedIn ? `Use ${plan.name} benefits` : `Choose ${plan.name}`}
            </Link>
          </motion.div>
        ))}
      </div>

      <p data-reveal className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2 text-center text-xs text-slate-500">
        <FaInfinity /> All plans include unlimited projects and history tracking.
      </p>
    </PageShell>
  );
}
