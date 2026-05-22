'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';

const GUMROAD_URL = 'https://elevehired.gumroad.com/l/pllrsk';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7B6FFF 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #A892FF 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #6C5CE7 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            {/* Badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#7B6FFF] bg-[#7B6FFF]/10 border border-[#7B6FFF]/20 px-3 py-1.5 rounded-full uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B6FFF] animate-pulse" />
                AI-Powered · Élève Emporium
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              The resume that gets you{' '}
              <span className="gradient-text">in the room.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg text-[#7E7D9A] leading-relaxed mb-8 max-w-lg"
            >
              ATS-optimized resumes and cover letters in seconds. Designed to open doors, not get filtered out.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4 mb-10"
            >
              <a
                href={GUMROAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-base px-6 py-3.5"
              >
                <Zap size={16} />
                Get Instant Access
                <ArrowRight size={16} />
              </a>
              <a href="#generator" className="btn-secondary text-base px-6 py-3.5">
                Try it free →
              </a>
            </motion.div>

            {/* Pricing note */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-sm text-[#4A4A60] font-medium tracking-wide uppercase"
            >
              $29 · One-time payment · Lifetime access
            </motion.div>

            {/* Trust badges */}
            <motion.div
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4 mt-8"
            >
              {[
                'Cover Letters',
                'ATS-Optimized Resumes',
                'Interview Prep',
                'LinkedIn Summaries',
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-[#7E7D9A]">
                  <CheckCircle size={12} className="text-[#4EE8B5]" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Product Preview */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="relative hidden lg:block"
          >
            {/* Floating glow behind card */}
            <div
              className="absolute inset-0 -m-8 rounded-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(123,111,255,0.3) 0%, transparent 70%)' }}
            />

            {/* Main preview card */}
            <div
              className="relative rounded-2xl overflow-hidden animate-float"
              style={{
                background: 'linear-gradient(145deg, #0C0E1A, #121528)',
                border: '1px solid rgba(123,111,255,0.2)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(123,111,255,0.1)',
              }}
            >
              {/* Card header bar */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-4 rounded-full bg-white/[0.04] flex items-center px-2">
                    <span className="text-[10px] text-[#4A4A60]">Élève — AI Resume Generator</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Tab bar */}
                <div
                  className="flex gap-1 p-1 rounded-lg mb-5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {['✉ Cover Letter', '📄 Resume', '💼 LinkedIn'].map((tab, i) => (
                    <div
                      key={tab}
                      className={`flex-1 text-center py-2 rounded-md text-xs font-medium transition-all ${
                        i === 1
                          ? 'bg-[#7B6FFF]/15 text-[#A892FF] border border-[#7B6FFF]/30'
                          : 'text-[#4A4A60]'
                      }`}
                    >
                      {tab}
                    </div>
                  ))}
                </div>

                {/* Mock output card */}
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: 'rgba(123,111,255,0.05)',
                    border: '1px solid rgba(123,111,255,0.15)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-medium text-[#7E7D9A] uppercase tracking-widest">
                      Your Resume
                    </span>
                    <span
                      className="text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{
                        background: 'rgba(78,232,181,0.1)',
                        color: '#4EE8B5',
                        border: '1px solid rgba(78,232,181,0.2)',
                      }}
                    >
                      Ready
                    </span>
                  </div>

                  {/* Mock resume lines */}
                  {[
                    { w: '60%', bold: true, h: '10px' },
                    { w: '40%', bold: false, h: '8px' },
                    { w: '80%', bold: false, h: '7px' },
                    { w: '70%', bold: false, h: '7px' },
                    { w: '55%', bold: false, h: '7px' },
                    { w: '75%', bold: false, h: '7px' },
                    { w: '65%', bold: false, h: '7px' },
                  ].map((line, i) => (
                    <div
                      key={i}
                      className={`mb-1.5 rounded`}
                      style={{
                        width: line.w,
                        height: line.h,
                        background: line.bold ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                        marginTop: i === 2 ? '8px' : undefined,
                      }}
                    />
                  ))}
                </div>

                {/* ATS Score mini */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-medium text-[#7E7D9A] uppercase tracking-widest">
                      ATS Score
                    </span>
                    <span className="text-lg font-bold text-[#7B6FFF]" style={{ fontFamily: 'Space Grotesk' }}>
                      92%
                    </span>
                  </div>
                  {[
                    { label: 'Keyword Match', pct: 88 },
                    { label: 'Format Score', pct: 95 },
                    { label: 'Impact Score', pct: 91 },
                  ].map((bar) => (
                    <div key={bar.label} className="mb-2">
                      <div className="flex justify-between text-[9px] text-[#4A4A60] mb-1">
                        <span>{bar.label}</span>
                        <span>{bar.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bar.pct}%`,
                            background: 'linear-gradient(90deg, #7B6FFF, #A892FF)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-4 -right-4 px-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background: 'linear-gradient(135deg, #0C0E1A, #121528)',
                border: '1px solid rgba(78,232,181,0.3)',
                color: '#4EE8B5',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              ✦ Strong Match
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background: 'linear-gradient(135deg, #0C0E1A, #121528)',
                border: '1px solid rgba(123,111,255,0.3)',
                color: '#A892FF',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              ✓ Interview Ready
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #06070F)' }}
      />
    </section>
  );
}
