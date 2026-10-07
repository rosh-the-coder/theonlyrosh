'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLightbox, type ZoomShot } from '@/components/careeros/motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const posts = [
  {
    src: '/Work/CareerOS/reddit-1.png',
    width: 689,
    height: 221,
    title: 'ChatGPT adds fake keywords',
    caption: 'AI-assisted tailoring can add experience the applicant doesn’t actually have.',
    alt: 'Reddit post from r/jobsearchhacks about ChatGPT adding résumé keywords the writer does not have experience with.',
  },
  {
    src: '/Work/CareerOS/reddit-2.png',
    width: 746,
    height: 344,
    title: 'Still takes 20–40 mins',
    caption: 'Even with AI, some job seekers still spend significant time on each application.',
    alt: 'Reddit post from r/jobsearch about tailoring a résumé still taking 20 to 40 minutes per application.',
  },
  {
    src: '/Work/CareerOS/reddit-3.png',
    width: 752,
    height: 583,
    title: 'Hard to do at scale',
    caption: 'Tailoring every résumé becomes difficult to sustain across many applications.',
    alt: 'Reddit post from r/jobsearchhacks about spending 30 or 40 minutes tailoring one application and struggling to do that at scale.',
  },
  {
    src: '/Work/CareerOS/reddit-4.png',
    width: 750,
    height: 439,
    title: 'Rewriting gets draining',
    caption: 'Manual tailoring across 100+ applications becomes repetitive and exhausting.',
    alt: 'Reddit post from r/jobsearchhacks about tailoring résumés for more than 100 applications feeling draining.',
  },
] as const;

const gallery: ZoomShot[] = posts.map((post) => ({
  src: post.src,
  alt: post.alt,
  width: post.width,
  height: post.height,
  title: post.title,
  caption: post.caption,
}));

export default function CommunityCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const open = useLightbox();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const scrollByCard = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>('[data-community-card]');
    const amount = (card?.offsetWidth ?? 320) + 16;
    scroller.scrollBy({ left: direction * amount, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8f8f86]">Examples from job-search communities</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#C6F135] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6F135]"
            aria-label="Previous examples"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#C6F135] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C6F135]"
            aria-label="Next examples"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <motion.div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-color:rgba(255,255,255,0.28)_transparent] [scrollbar-width:thin]"
        tabIndex={0}
        aria-label="Job-search community examples"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {posts.map((item, index) => (
          <motion.article
            key={item.src}
            data-community-card
            className="careeros-reveal group w-[min(78vw,340px)] shrink-0 snap-start"
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
            }}
            whileHover={canHover ? { y: -3, transition: { duration: 0.3, ease: EASE } } : undefined}
          >
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                const scroller = scrollerRef.current;
                const left = scroller?.scrollLeft ?? 0;
                open({ images: gallery, index, trigger: event.currentTarget });
                const restore = () => {
                  if (scroller) scroller.scrollLeft = left;
                };
                restore();
                requestAnimationFrame(restore);
              }}
              className="w-full cursor-zoom-in rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C6F135]"
            >
              <span className="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#10140c] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:group-hover:border-white/35">
                <Image
                  src={item.src}
                  alt=""
                  width={item.width}
                  height={item.height}
                  sizes="340px"
                  style={{ width: '100%', height: '220px', objectFit: 'cover', objectPosition: 'top' }}
                  className="w-full"
                />
                <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/20 bg-[#0B0B0B]/75 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#f4f0e6] opacity-90 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
                  View larger
                </span>
              </span>
              <span className="mt-3 block text-sm font-medium text-[#f4f0e6]">{item.title}</span>
              <span className="mt-1 block text-sm leading-6 text-[#9c9c94]">{item.caption}</span>
            </button>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
