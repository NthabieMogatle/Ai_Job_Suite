'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Cpu, Rocket } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    number: '01',
    title: 'Fill in your details',
    description:
      'Enter your name, target role, skills, and experience. Paste the job description for maximum tailoring — or skip it for a strong general draft.',
    color: '#7B6FFF',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'AI does the work',
    description:
      'Claude AI writes your document in seconds — tailored, ATS-optimized, and sounding like a real person. Not a template. Not filler.',
    color: '#A892FF',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Download and apply',
    description:
      'Get your ATS score, run through the interview prep questions, and download a polished PDF. Ready to submit.',
    color: '#4EE8B5',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Up and running in{' '}
            <span className="gradient-text">60 seconds.</span>
          </h2>
          <p className="text-[#7E7D9A] text-lg max-w-md mx-auto">
            No account setup. No complicated forms. Just fill in the basics and go.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting line — desktop */}
          <div
            className="hidden md:block absolute top-12 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, rgba(123,111,255,0.3), rgba(168,146,255,0.3), rgba(78,232,181,0.3))' }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              <div
                className="rounded-2xl p-8 h-full transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(145deg, #0C0E1A, #121528)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Number + icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
                  >
                    <step.icon size={22} style={{ color: step.color }} />
                  </div>
                  <span
                    className="text-4xl font-bold"
                    style={{ fontFamily: 'Space Grotesk', color: `${step.color}20` }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-[#7E7D9A] text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
