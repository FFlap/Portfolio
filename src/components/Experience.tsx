'use client';

import { portfolioData } from '@/data/portfolio-data';
import ScrollReveal from './ScrollReveal';

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="min-h-screen py-20 px-4 relative z-10 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full flex justify-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center text-white">
          Experience
        </h2>
      </div>

      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-8 md:p-12">
          <div className="relative">
            <div className="space-y-12">
              {experience.map((job, i) => (
                <ScrollReveal key={job.company} delay={i * 0.2} type="slide-left">
                  <div className="relative pl-20">
                    {/* Connecting Line to Next Node */}
                    {i !== experience.length - 1 && (
                      <div
                        className="absolute left-6 top-12 w-px bg-zinc-700 -z-10"
                        style={{ height: 'calc(100% + 3rem)' }}
                      ></div>
                    )}

                    {/* Timeline Logo Node */}
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute left-0 top-0 w-12 h-12 bg-zinc-800 rounded-full border border-zinc-600 flex items-center justify-center z-20 group hover:border-theme transition-colors duration-200 overflow-hidden cursor-pointer"
                    >
                      {job.logo ? (
                        <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-neutral-400 group-hover:text-theme transition-colors">
                          {job.company.charAt(0)}
                        </span>
                      )}
                    </a>

                    {/* Content */}
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {job.role}
                      </h3>

                      <div className="text-lg text-neutral-300 mb-2 font-medium">
                        {job.company}
                      </div>

                      <div className="text-neutral-500 text-sm mb-6 font-mono flex items-center gap-3">
                        <span className="bg-zinc-800 px-2 py-1 rounded text-xs">{job.period}</span>
                        <span>{job.location}</span>
                      </div>

                      <div className="text-neutral-400 leading-relaxed max-w-2xl">
                        <ul className="space-y-3">
                          {job.description.map((desc, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-neutral-600 rounded-full flex-shrink-0"></span>
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
