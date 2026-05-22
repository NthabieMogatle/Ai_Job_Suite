'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does Élève compare to other AI resume tools?',
    a: "Most AI resume tools give you a template and fill in your info. Élève goes further: it generates content tailored to a specific job description, scores your resume against ATS systems, tells you what to fix, and gives you interview questions based on your exact background. Plus a LinkedIn summary generator.",
  },
  {
    q: 'What do I get for $29?',
    a: "Lifetime access to unlimited generations across all three tools (cover letters, resumes, LinkedIn summaries), all four resume templates (including Executive and Elegant), ATS scoring, auto-improvement from ATS tips, and interview prep — all powered by Claude AI.",
  },
  {
    q: "Will the resume sound like AI wrote it?",
    a: "No. We've tuned the prompts specifically to avoid AI patterns — banned words like 'leverage', 'synergy', 'robust', and em dashes. The output is deliberately written to vary sentence rhythm and sound like a real person. Many users say they couldn't tell it wasn't written by a human.",
  },
  {
    q: 'How does the free tier work?',
    a: "You get 2 free generations without purchasing. Cover letters are more generous (99 free uses). After that, you'll be prompted to unlock full access for $29. There's no credit card required to try.",
  },
  {
    q: 'How do I unlock the Executive and Elegant templates?',
    a: 'After purchasing on Gumroad, check your receipt for the premium access code. Enter it in the Resume tab under "Have a premium code?" to unlock both premium templates instantly.',
  },
  {
    q: 'Does it work for any industry?',
    a: 'Yes. The AI detects your industry from the job title and adapts its language, action verbs, and structure accordingly. It works for tech, healthcare, finance, marketing, education, retail, legal, engineering, and more.',
  },
  {
    q: "Can I use it if I'm entry-level with no experience?",
    a: "Absolutely. The AI is specifically instructed to emphasize transferable skills, coursework, personal projects, and volunteer work when experience is limited. It never fabricates credentials.",
  },
  {
    q: 'Is my data safe?',
    a: "Your form data is used only to generate your document — it's sent to the Anthropic API for generation and isn't stored on our servers. We only track your email and usage count to enforce the free tier limit.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-28">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Questions?{' '}
            <span className="gradient-text">Answered.</span>
          </h2>
          <p className="text-[#7E7D9A] text-lg">
            Everything you need to know before you start.
          </p>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-white/[0.02]"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span
                  className={`text-sm font-medium leading-relaxed transition-colors ${openIdx === i ? 'text-white' : 'text-[#B8B7D0]'}`}
                >
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-colors ${openIdx === i ? 'text-[#7B6FFF]' : 'text-[#4A4A60]'}`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className="px-5 pb-5"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <p className="pt-4 text-sm text-[#7E7D9A] leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
