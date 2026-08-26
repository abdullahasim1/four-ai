"use client";

import { motion } from "framer-motion";
import { FaFacebook, FaGithub, FaLinkedin, FaUsers } from "react-icons/fa";

import PageShell from "@/components/PageShell";

const saifImage = "/images/saif.jpg";
const abdullahImage = "/images/abdullah.jpg";
const adeelImage = "/images/adeel.jpg";
const malikImage = "/images/malik.jpg";

const TEAM = [
  {
    name: "Saif Ur Rahman",
    role: "Lead Developer",
    img: saifImage,
    description: "Full-stack developer with a focus on AI and machine learning.",
    socials: {
      github: "https://github.com/saif-9-coder",
      linkedin: "https://www.linkedin.com/in/saif-ur-rahman-677b2b25b/",
      facebook: "https://www.facebook.com/saif.ur.rahman.321107",
    },
  },
  {
    name: "Abdullah Bin Asim",
    role: "Frontend Developer",
    img: abdullahImage,
    description: "Frontend specialist who loves crafting clean, delightful interfaces.",
    socials: {
      github: "https://github.com/abdullahasim1",
      linkedin: "https://www.linkedin.com/in/abdullah-bin-asim-654287267/",
      facebook: "https://www.facebook.com/asim.sahkeel.1",
    },
  },
  {
    name: "M Adeel Gujar",
    role: "Backend Developer",
    img: adeelImage,
    description: "Backend engineer specializing in scalable, reliable architecture.",
    socials: {
      linkedin: "https://www.linkedin.com/in/adeel-hayyat-371597336/",
      facebook: "https://www.facebook.com/adeel.gujjar.158718",
    },
  },
  {
    name: "Malik Mujahid Azam Lail",
    role: "UI/UX Designer",
    img: malikImage,
    description: "Creative designer focused on human-centered experiences.",
    socials: {
      linkedin: "https://www.linkedin.com/in/mujahid-azam-34b477340/",
      facebook: "https://www.facebook.com/muhammad.mujahid.azam.2025",
    },
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, delay },
});

export default function Team() {
  return (
    <PageShell contentClassName="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div data-reveal className="mx-auto max-w-2xl text-center">
        <span className="badge mx-auto"><FaUsers /> Our team</span>
        <h1 className="mt-4 section-title">The people behind Four AI</h1>
        <p className="section-subtitle">
          A small team of builders and designers passionate about making AI creation accessible.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((member, i) => (
          <motion.div key={member.name} {...fadeUp(i * 0.08)}>
            <div className="glass-card group h-full overflow-hidden text-center transition-all hover:-translate-y-1.5 hover:border-indigo-400/30">
              {/* Photo */}
              <div className="relative mx-auto mt-8 h-28 w-28">
                <img
                  src={member.img}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full rounded-full object-cover ring-4 ring-white/10 transition-all group-hover:ring-indigo-400/40"
                />
                <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-40 blur-lg" />
              </div>

              <div className="p-5 pt-4">
                <h3 className="font-semibold leading-snug text-white">{member.name}</h3>
                <p className="mt-1 text-sm font-medium text-indigo-300">{member.role}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{member.description}</p>

                <div className="mt-5 flex justify-center gap-2.5 border-t border-white/5 pt-4">
                  {[
                    { key: "github", Icon: FaGithub },
                    { key: "linkedin", Icon: FaLinkedin },
                    { key: "facebook", Icon: FaFacebook },
                  ]
                    .filter(({ key }) => member.socials[key])
                    .map(({ key, Icon }) => (
                      <a
                        key={key}
                        href={member.socials[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on ${key}`}
                        className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition-all hover:-translate-y-0.5 hover:border-indigo-400/40 hover:text-indigo-300"
                      >
                        <Icon size={14} />
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
