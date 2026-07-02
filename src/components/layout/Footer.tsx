"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebookMessenger } from "react-icons/fa";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/abdul0325",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abdul-rehman-961428265/",
    icon: FaLinkedin,
  },
  {
    label: "Messenger",
    href: "https://web.facebook.com/profile.php?id=100071110743530&_rdc=1&_rdr#",
    icon: FaFacebookMessenger,
  },
  {
    label: "Email",
    href: "mailto:abdulrehman.fullstackdev@gmail.com",
    icon: Mail,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-zinc-100 bg-white pt-7 pb-5">
      {/* Elegant Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[380px] w-[580px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-400/15 via-fuchsia-400/10 to-cyan-400/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-14">
          {/* Brand & Bio */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5 text-center lg:text-left"
          >
            <div>
              <h3 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-violet-700 to-zinc-900 bg-clip-text text-transparent">
                Abdul Rehman
              </h3>
              <p className="mt-2 text-lg text-zinc-600">Full Stack Engineer &amp; AI Systems Architect</p>
            </div>

            <p className="mt-5 max-w-md text-zinc-600 leading-relaxed">
              Crafting scalable systems, delightful interfaces, and intelligent products 
              with precision and passion.
            </p>

            {/* Social Links */}
            <div className="mt-10 flex justify-center gap-4 lg:justify-start lg:gap-6">
              {socialLinks.map(({ href, icon: Icon, label }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -8, scale: 1.15 }}
                  whileTap={{ scale: 0.92 }}
                  className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-500 transition-all duration-300 hover:border-violet-500 hover:bg-violet-50 hover:text-violet-600 hover:shadow-xl hover:shadow-violet-500/10"
                >
                  <Icon size={24} className="transition-transform duration-300 group-hover:scale-110" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-3 hidden lg:flex flex-col"
          >
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-zinc-500">Navigation</h4>
            <div className="flex flex-col gap-4 text-[15px]">
              {["Home", "About", "Projects", "Skills", "Contact"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="group inline-flex items-center gap-2 text-zinc-600 hover:text-violet-700 transition-all duration-200 hover:pl-2"
                  >
                    <span className="transition-all group-hover:text-violet-600">→</span>
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Expertise */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 hidden lg:flex flex-col"
          >
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-widest text-zinc-500">Expertise</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {[
                "System Design",
                "AI/ML Integration",
                "Cloud Architecture",
                "Full Stack Development",
                "Performance Optimization",
                "Technical Leadership"
              ].map((skill, i) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="font-medium text-zinc-700 hover:text-violet-700 transition-colors cursor-default"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-4 text-center text-sm text-zinc-500 md:flex-row md:text-left">
          <p>© {year} Abdul Rehman. All rights reserved.</p>
          
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-2 font-medium hover:text-zinc-900 transition-all duration-300 text-nowrap"
            >
              Back to top
              <div className="rounded-full border border-zinc-300 p-1.5 group-hover:border-violet-400 transition-colors">
                <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
              </div>
            </button>
            
            <p className="font-mono text-xs tracking-[2px] text-violet-600">ENGINEERED WITH EXCELLENCE</p>
          </div>
        </div>
      </div>
    </footer>
  );
}