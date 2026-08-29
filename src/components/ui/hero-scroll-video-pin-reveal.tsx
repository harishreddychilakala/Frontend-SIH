'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TagItem {
  id?: string;
  text: string;
  background: string;
  color?: string;
}

export interface HeroScrollVideoRevealProps {
  topText?: React.ReactNode;
  headingText?: React.ReactNode;
  tags?: TagItem[];
  subText?: string;
  videoSrc?: string;
  bottomText?: React.ReactNode;
  badgeImgSrc?: string;
  className?: string;
}

export const DEFAULT_TAGS: TagItem[] = [
  { text: 'IS 1786 · TMT Steel Bars', background: '#0f172a', color: '#38bdf8' },
  { text: 'IS 16102 · LED Luminaires', background: '#1e293b', color: '#60a5fa' },
  { text: 'Scheme I · ISI Mark Certified', background: '#1e1b4b', color: '#a78bfa' },
  { text: 'NABL & Apex Testing Labs', background: '#064e3b', color: '#34d399' },
  { text: 'Mandatory QCO Audits', background: '#312e81', color: '#c084fc' },
];

export const HeroScrollVideoReveal: React.FC<HeroScrollVideoRevealProps> = ({
  topText = (
    <>
      Intelligent Compliance Built for India's Future,
      <br />
      Powered by AI Evidence
    </>
  ),
  headingText = (
    <>
      Navigate 20,000+ Standards. <br />
      Accelerate BIS Certification.
    </>
  ),
  tags = DEFAULT_TAGS,
  subText = 'Explore standards, check mandatory QCO deadlines, and locate accredited testing laboratories in real time.',
  videoSrc = 'https://res.cloudinary.com/dsuwzuaxp/video/upload/856381-hd_1920_1080_30fps_gsq11b.mp4',
  bottomText = (
    <>
      Where Indian Standards
      <br />
      meet intelligent automation
    </>
  ),
  badgeImgSrc = 'https://i.ibb.co/kgFKP37B/rotate-text.png',
  className = '',
}) => {
  const benefitRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const paraRef = useRef<HTMLHeadingElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    const wordElements = paraRef.current
      ? Array.from(paraRef.current.querySelectorAll('.reveal-word'))
      : [];

    if (wordElements.length > 0) {
      gsap.set(wordElements, { opacity: 0, rotate: 6, yPercent: 25 });
    }

    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: benefitRef.current,
        start: 'top 75%',
        end: 'top 10%',
        scrub: 1.2,
      },
    });

    if (wordElements.length > 0) {
      revealTl.to(wordElements, {
        stagger: 0.15,
        opacity: 1,
        rotate: 0,
        yPercent: 0,
        ease: 'power1.out',
      });
    }

    tagRefs.current.forEach((tagEl) => {
      if (tagEl) {
        revealTl.to(
          tagEl,
          {
            duration: 0.8,
            opacity: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            ease: 'circ.out',
          },
          '>-0.3'
        );
      }
    });

    const mm = gsap.matchMedia();

    mm.add('(max-width: 639.9px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(18% at 50% 50%)' });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=1200',
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: (self) => {
            if (self.spacer) self.spacer.style.backgroundColor = '#0b0f19';
            if (self.pin) self.pin.style.backgroundColor = '#0b0f19';
          },
          onToggle: (self) => {
            if (self.spacer) self.spacer.style.backgroundColor = '#0b0f19';
            if (self.pin) self.pin.style.backgroundColor = '#0b0f19';
          },
        },
      });

      vpTl.fromTo(
        videoBoxRef.current,
        { clipPath: 'circle(18% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', ease: 'none' }
      );
    });

    mm.add('(min-width: 640px) and (max-width: 1023.9px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(12% at 50% 50%)' });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=1600',
          scrub: 1.3,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: (self) => {
            if (self.spacer) self.spacer.style.backgroundColor = '#0b0f19';
            if (self.pin) self.pin.style.backgroundColor = '#0b0f19';
          },
          onToggle: (self) => {
            if (self.spacer) self.spacer.style.backgroundColor = '#0b0f19';
            if (self.pin) self.pin.style.backgroundColor = '#0b0f19';
          },
        },
      });

      vpTl.fromTo(
        videoBoxRef.current,
        { clipPath: 'circle(12% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', ease: 'none' }
      );
    });

    mm.add('(min-width: 1024px)', () => {
      gsap.set(videoBoxRef.current, { clipPath: 'circle(8% at 50% 50%)' });

      const vpTl = gsap.timeline({
        scrollTrigger: {
          trigger: videoWrapperRef.current,
          start: 'top top',
          end: '+=2000',
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onRefresh: (self) => {
            if (self.spacer) self.spacer.style.backgroundColor = '#0b0f19';
            if (self.pin) self.pin.style.backgroundColor = '#0b0f19';
          },
          onToggle: (self) => {
            if (self.spacer) self.spacer.style.backgroundColor = '#0b0f19';
            if (self.pin) self.pin.style.backgroundColor = '#0b0f19';
          },
        },
      });

      vpTl.fromTo(
        videoBoxRef.current,
        { clipPath: 'circle(8% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', ease: 'none' }
      );
    });

    return () => {
      revealTl.kill();
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const renderHeading = () => {
    if (typeof headingText === 'string') {
      return headingText.split(' ').map((word, i) => (
        <span
          key={i}
          className="reveal-word inline-block origin-left mr-[0.28em] will-change-transform"
        >
          {word}
        </span>
      ));
    }
    return headingText;
  };

  return (
    <div
      className={`w-full bg-[#0b0f19] text-[#f3f4f6] font-sans overflow-x-hidden ${className}`}
      style={{ backgroundColor: '#0b0f19', color: '#f3f4f6' }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .pin-spacer {
              background-color: #0b0f19 !important;
            }
          `,
        }}
      />

      <section
        className="w-full min-h-[50vh] sm:min-h-[60vh] flex justify-center items-center text-center px-4 sm:px-8 py-16 text-[clamp(1.75rem,3.8vw,3.5rem)] font-bold tracking-tight leading-tight text-white relative z-10 bg-[#0b0f19]"
        style={{ backgroundColor: '#0b0f19' }}
      >
        <div className="max-w-4xl mx-auto opacity-90">
          {topText}
        </div>
      </section>

      <section
        ref={benefitRef}
        className="relative w-full pb-16 md:pb-24 bg-[#0b0f19]"
        style={{ backgroundColor: '#0b0f19' }}
      >
        <div
          className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center text-center relative z-10 bg-[#0b0f19]"
          style={{ backgroundColor: '#0b0f19' }}
        >
          <div className="w-full mb-8 sm:mb-12 md:mb-14">
            <h2
              ref={paraRef}
              className="text-[clamp(2.2rem,4.8vw,4.5rem)] font-extrabold tracking-tight leading-tight text-white overflow-visible"
            >
              {renderHeading()}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 max-w-4xl mx-auto my-4 sm:my-6 mb-8 sm:mb-12">
            {tags.map((tag, idx) => (
              <div
                key={tag.id || `tag-${idx}`}
                ref={(el) => {
                  tagRefs.current[idx] = el;
                }}
                className="px-5 sm:px-7 py-2 sm:py-3.5 rounded-full text-[clamp(0.85rem,1.4vw,1.25rem)] font-semibold tracking-tight opacity-0 shadow-2xl border border-white/10 will-change-[clip-path,opacity]"
                style={{
                  backgroundColor: tag.background,
                  color: tag.color || '#ffffff',
                  clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                }}
              >
                {tag.text}
              </div>
            ))}
          </div>

          {subText && (
            <p className="text-[clamp(0.95rem,1.3vw,1.2rem)] text-slate-400 font-normal max-w-2xl mt-2 sm:mt-4 px-4 leading-relaxed">
              {subText}
            </p>
          )}
        </div>

        <div className="relative w-full bg-[#0b0f19]" style={{ backgroundColor: '#0b0f19' }}>
          <div
            ref={videoWrapperRef}
            className="w-full h-screen flex justify-center items-center relative overflow-hidden bg-[#0b0f19]"
            style={{ backgroundColor: '#0b0f19' }}
          >
            <div
              className="absolute inset-0 w-full h-full pointer-events-none bg-[#0b0f19]"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#0b0f19',
                zIndex: 1,
              }}
            />

            <div
              ref={videoBoxRef}
              className="relative w-full h-full overflow-hidden flex justify-center items-center bg-[#0b0f19] will-change-[clip-path]"
              style={{ backgroundColor: '#0b0f19', zIndex: 2 }}
            >
              {badgeImgSrc && (
                <img
                  src={badgeImgSrc}
                  alt="BIS Certification Badge"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 z-20 pointer-events-none animate-[spin_18s_linear_infinite] opacity-80 select-none"
                />
              )}

              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                className="w-full h-full object-cover bg-[#0b0f19]"
                style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#0b0f19' }}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex justify-center items-center shadow-xl">
                  <img
                    src="https://i.ibb.co/Q3RY2jTB/play-icon.png"
                    alt="play"
                    className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="w-full min-h-[40vh] sm:min-h-[50vh] flex justify-center items-center text-center px-4 sm:px-8 py-16 text-[clamp(1.75rem,3.8vw,3.5rem)] font-bold tracking-tight leading-tight text-white relative z-10 bg-[#0b0f19]"
        style={{ backgroundColor: '#0b0f19' }}
      >
        <div className="max-w-3xl mx-auto opacity-90">
          {bottomText}
        </div>
      </section>
    </div>
  );
};

export default HeroScrollVideoReveal;
