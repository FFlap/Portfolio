'use client';

import { portfolioData } from '@/data/portfolio-data';
import ScrollReveal from './ScrollReveal';
import ScrollTyping from './ScrollTyping';

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="min-h-screen py-20 px-4 relative z-10 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full flex justify-center">
        <ScrollTyping
          text="< Experience />"
          cursorColor="#c084fc"
          className="text-4xl md:text-5xl font-bold mb-16 text-center text-white"
        />
      </div>

      <div className="max-w-5xl mx-auto w-full flex justify-center">
        <div className="relative">
          <div className="space-y-12">
            {experience.map((job, i) => (
              <ScrollReveal key={job.company} delay={i * 0.2} type="slide-left">
                <div className="relative pl-24">
                  {/* Connecting Line to Next Node (not for last item) */}
                  {i !== experience.length - 1 && (
                    <div
                      className="absolute left-8 top-8 w-0.5 bg-gray-800 -z-10"
                      style={{ height: 'calc(100% + 3rem)' }}
                    ></div>
                  )}

                  {/* Timeline Logo Node */}
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute left-0 top-0 w-16 h-16 bg-gray-900 rounded-full border-2 border-gray-700 flex items-center justify-center z-20 group hover:border-purple-500 transition-colors duration-300 overflow-hidden cursor-pointer"
                  >
                    {job.logo ? (
                      <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">
                        {job.company.charAt(0)}
                      </span>
                    )}
                  </a>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-3xl font-bold text-white mb-1 hover:underline decoration-purple-500 decoration-2 underline-offset-4 cursor-pointer">
                      {job.role}
                    </h3>

                    <div className="text-xl text-gray-300 mb-2 font-medium">
                      {job.company}
                    </div>

                    <div className="text-gray-500 text-sm mb-6 font-mono flex items-center gap-3">
                      <span className="bg-gray-800 px-2 py-1 rounded text-xs">{job.period}</span>
                      <span>{job.location}</span>
                    </div>

                    <div className="text-gray-400 leading-relaxed max-w-2xl">
                      <ul className="space-y-3">
                        {job.description.map((desc, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
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
    </section>
  );
}
