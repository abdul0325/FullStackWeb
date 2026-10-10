"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { FaPaperPlane } from "react-icons/fa";
import PopButton from "../../ui/pop-button";

export default function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  // Set on mount; the API rejects submissions faster than its minimum fill time.
  const startedAt = useRef(0);

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!form.current) return;

    const honeypot =
      (form.current.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          company: honeypot,
          startedAt: startedAt.current,
        }),
      });

      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? `Request failed (${res.status})`);
      }

      setSent(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSent(false);
      }, 3000);
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Failed to send message. Please try again or email me directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      ref={form}
      onSubmit={sendEmail}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="relative flex h-full flex-col p-5 lg:p-10"
    >
      <div className="relative z-10 flex h-full flex-col">
        {/* Honeypot — invisible to people, filled by bots. Rejected server-side. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        {/* Header */}

        <div className="mb-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

            <span className="text-xs font-mono uppercase tracking-[3px] text-violet-700">
              Available for projects
            </span>
          </div>

          <h3 className="text-3xl font-bold tracking-tighter text-zinc-900 lg:text-4xl">
            Let&apos;s create
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent">
              the extraordinary
            </span>
          </h3>

          <p className="mt-4 text-zinc-600">
            Senior engineer ready for your next ambitious project.
          </p>
        </div>

        {/* Form */}

        <div className="flex-1 space-y-7">
          {/* Name */}

          <div>
            <label className="mb-2 flex items-center gap-3 text-sm font-medium text-zinc-500">
              <User className="h-4 w-4" />
              FULL NAME
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Rivera"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-4 outline-none transition-all placeholder:text-zinc-400 hover:placeholder:text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-200"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-2 flex items-center gap-3 text-sm font-medium text-zinc-500">
              <Mail className="h-4 w-4" />
              EMAIL
            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-4 outline-none transition-all placeholder:text-zinc-400 hover:placeholder:text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-200"
            />
          </div>

          {/* Subject */}

          <div>
            <label className="mb-2 flex items-center gap-3 text-sm font-medium text-zinc-500">
              <Briefcase className="h-4 w-4" />
              SUBJECT
            </label>

            <input
              type="text"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Project Discussion"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-6 py-4 outline-none transition-all placeholder:text-zinc-400 hover:placeholder:text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-200"
            />
          </div>

          {/* Message */}

          <div>
            <label className="mb-2 flex items-center gap-3 text-sm font-medium text-zinc-500">
              <MessageSquare className="h-4 w-4" />
              TELL ME MORE
            </label>

            <textarea
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              className="min-h-[130px] w-full resize-y rounded-3xl border border-zinc-200 bg-white px-6 py-4 outline-none transition-all placeholder:text-zinc-400 hover:placeholder:text-black focus:border-violet-500 focus:ring-1 focus:ring-violet-200"
            />
          </div>
        </div>

        {/* Status */}

        {error && (
          <p role="alert" className="mt-6 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Button */}

        <div className="mt-8 flex justify-center">
          <div className="w-full md:w-[60%]">
            <PopButton
              type="submit"
              disabled={loading}
              className="flex w-full justify-center gap-2 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Sending..."
              ) : sent ? (
                "Message Sent ✓"
              ) : (
                <>
                  SEND MESSAGE
                  <FaPaperPlane className="transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                </>
              )}
            </PopButton>
          </div>
        </div>
      </div>
    </motion.form>
  );
}