'use client';

import { motion } from 'framer-motion';
import { Target, FileText, MessageSquare, Download, Sparkles, TrendingUp } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Subtle glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,111,255,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#7B6FFF] bg-[#7B6FFF]/10 border border-[#7B6FFF]/20 px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Sparkles size={12} />
            Everything you need
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Built to get you{' '}
            <span className="gradient-text">hired.</span>
          </h2>
          <p className="text-[#7E7D9A] text-lg max-w-xl mx-auto">
            One tool that handles every part of your job application — from the first draft to the interview room.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 1 — ATS Intelligence (large) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            className="lg:col-span-2 group relative rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:scale-[1.01]"
            style={{
              background: 'linear-gradient(145deg, #0C0E1A, #121528)',
              border: '1px solid rgba(123,111,255,0.15)',
            }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 30% 50%, rgba(123,111,255,0.08) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#7B6FFF]/10 border border-[#7B6FFF]/20">
                  <Target size={20} className="text-[#7B6FFF]" />
                </div>
                <div className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest">ATS Intelligence</div>
              </div>

              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Know your score before you send it.
              </h3>
              <p className="text-[#7E7D9A] leading-relaxed mb-8 max-w-md">
                Every resume is analyzed against the job you&apos;re applying for. Keyword match, format quality, impact strength — scored and explained, with specific improvements you can act on before submitting.
              </p>

              {/* Score visualization */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white">ATS Score Analysis</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-2xl font-bold"
                      style={{ fontFamily: 'Space Grotesk', color: '#7B6FFF' }}
                    >
                      82%
                    </span>
                    <span className="text-xs text-[#4EE8B5] bg-[#4EE8B5]/10 border border-[#4EE8B5]/20 px-2 py-0.5 rounded-full">
                      Strong Match
                    </span>
                  </div>
                </div>
                {[
                  { label: 'Keyword Match', value: 78, color: '#7B6FFF' },
                  { label: 'Format & Structure', value: 90, color: '#A892FF' },
                  { label: 'Impact & Action Verbs', value: 76, color: '#4EE8B5' },
                ].map((bar) => (
                  <div key={bar.label} className="mb-3">
                    <div className="flex justify-between text-xs text-[#7E7D9A] mb-1.5">
                      <span>{bar.label}</span>
                      <span>{bar.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${bar.color}, rgba(255,255,255,0.5))` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Interview Prep */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] } } }}
            className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, #0C0E1A, #121528)',
              border: '1px solid rgba(78,232,181,0.12)',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 70% 30%, rgba(78,232,181,0.06) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <div className="p-2.5 rounded-xl bg-[#4EE8B5]/10 border border-[#4EE8B5]/20 w-fit mb-4">
                <MessageSquare size={20} className="text-[#4EE8B5]" />
              </div>
              <div className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest mb-3">Interview Prep</div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Walk in ready, not rehearsing.
              </h3>
              <p className="text-[#7E7D9A] text-sm leading-relaxed mb-6">
                Tailored questions, talking points, and answer frameworks built around the exact job you&apos;re applying for.
              </p>

              {/* Mini question preview */}
              <div className="space-y-2">
                {[
                  'Tell me about a challenging project you led end-to-end.',
                  'How do you handle competing priorities under a deadline?',
                  'Walk me through a time you improved a process.',
                ].map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ background: 'rgba(78,232,181,0.15)', color: '#4EE8B5' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs text-[#7E7D9A] leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Templates */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] } } }}
            className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, #0C0E1A, #121528)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 30% 70%, rgba(123,111,255,0.06) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <div className="p-2.5 rounded-xl bg-[#A892FF]/10 border border-[#A892FF]/20 w-fit mb-4">
                <FileText size={20} className="text-[#A892FF]" />
              </div>
              <div className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest mb-3">The Output</div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Resumes you&apos;d actually send.
              </h3>
              <p className="text-[#7E7D9A] text-sm leading-relaxed mb-6">
                Choose from four premium templates. Every line written, formatted, and structured to read as professional — not generated.
              </p>

              {/* Template grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: '🖤 Modern', sub: 'Dark header · Clean', free: true },
                  { name: '🤍 Minimal', sub: 'Ultra clean · Elegant', free: true },
                  { name: '🏆 Executive', sub: 'Sidebar · Premium', free: false },
                  { name: '✨ Elegant', sub: 'Two-column · Gold', free: false },
                ].map((tpl) => (
                  <div
                    key={tpl.name}
                    className={`p-2.5 rounded-lg text-xs ${tpl.free ? 'opacity-100' : 'opacity-50'}`}
                    style={{
                      background: tpl.free ? 'rgba(123,111,255,0.08)' : 'rgba(255,255,255,0.03)',
                      border: tpl.free ? '1px solid rgba(123,111,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div className="font-medium text-white mb-0.5">{tpl.name}</div>
                    <div className="text-[10px] text-[#4A4A60]">{tpl.sub}</div>
                    {!tpl.free && (
                      <div className="text-[9px] text-[#7B6FFF] mt-1 font-medium">Unlock with $29</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 4 — LinkedIn Summary */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] } } }}
            className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, #0C0E1A, #121528)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 60% 40%, rgba(168,146,255,0.06) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <div className="p-2.5 rounded-xl bg-[#7B6FFF]/10 border border-[#7B6FFF]/20 w-fit mb-4">
                <TrendingUp size={20} className="text-[#7B6FFF]" />
              </div>
              <div className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest mb-3">LinkedIn Summary</div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                A profile that gets recruiter replies.
              </h3>
              <p className="text-[#7E7D9A] text-sm leading-relaxed mb-4">
                Generate a LinkedIn About section that sounds like you — confident, specific, and optimized to attract the right opportunities.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Confident', 'Warm', 'Creative'].map((tone) => (
                  <span
                    key={tone}
                    className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#7E7D9A' }}
                  >
                    {tone}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 5 — PDF Download */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] } } }}
            className="group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, #0C0E1A, #121528)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 40% 60%, rgba(78,232,181,0.04) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <div className="p-2.5 rounded-xl bg-[#4EE8B5]/10 border border-[#4EE8B5]/20 w-fit mb-4">
                <Download size={20} className="text-[#4EE8B5]" />
              </div>
              <div className="text-xs font-medium text-[#7E7D9A] uppercase tracking-widest mb-3">Instant PDF</div>
              <h3
                className="text-xl font-bold text-white mb-3"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Download and apply.
              </h3>
              <p className="text-[#7E7D9A] text-sm leading-relaxed">
                Copy your output, download a formatted PDF, or regenerate with a different tone. Everything submittable in one click.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
