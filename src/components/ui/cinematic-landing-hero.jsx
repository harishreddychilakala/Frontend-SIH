// src/components/ui/cinematic-landing-hero.jsx
"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
    position: absolute; inset: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
    background-size: 60px 60px;
    background-image: 
      linear-gradient(to right, color-mix(in srgb, var(--color-foreground, #e5e5e5) 5%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground, #e5e5e5) 5%, transparent) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  .text-3d-matte {
    color: #e5e7eb;
    text-shadow: 
      0 10px 30px rgba(229,231,235,0.2), 
      0 2px 4px rgba(229,231,235,0.1);
  }

  .text-silver-matte {
    background: linear-gradient(180deg, #f9fafb 0%, rgba(229,231,235,0.4) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: 
      drop-shadow(0px 10px 20px rgba(229,231,235,0.15)) 
      drop-shadow(0px 2px 4px rgba(229,231,235,0.10));
  }

  .text-card-silver-matte {
    background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transform: translateZ(0);
    filter: 
      drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) 
      drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  .premium-depth-card {
    background: linear-gradient(145deg, #162C6D 0%, #0A101D 100%);
    box-shadow: 
      0 40px 100px -20px rgba(0,0,0,0.9),
      0 20px 40px -20px rgba(0,0,0,0.8),
      inset 0 1px 2px rgba(255,255,255,0.2),
      inset 0 -2px 4px rgba(0,0,0,0.8);
    border: 1px solid rgba(255,255,255,0.04);
    position: relative;
  }

  .card-sheen {
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
    background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
    mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .iphone-bezel {
    background-color: #111;
    box-shadow: 
      inset 0 0 0 2px #52525B,
      inset 0 0 0 7px #000,
      0 40px 80px -15px rgba(0,0,0,0.9),
      0 15px 25px -5px rgba(0,0,0,0.7);
    transform-style: preserve-3d;
  }

  .hardware-btn {
    background: linear-gradient(90deg, #404040 0%, #171717 100%);
    box-shadow: 
      -2px 0 5px rgba(0,0,0,0.8),
      inset -1px 0 1px rgba(255,255,255,0.15),
      inset 1px 0 2px rgba(0,0,0,0.8);
    border-left: 1px solid rgba(255,255,255,0.05);
  }

  .screen-glare {
    background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
    background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
    box-shadow: 
      0 10px 20px rgba(0,0,0,0.3),
      inset 0 1px 1px rgba(255,255,255,0.05),
      inset 0 -1px 1px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
    background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 
      0 0 0 1px rgba(255,255,255,0.1),
      0 25px 50px -12px rgba(0,0,0,0.8),
      inset 0 1px 1px rgba(255,255,255,0.2),
      inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  .btn-modern-light, .btn-modern-dark {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
    background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
    color: #0F172A;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
    text-decoration: none;
  }
  .btn-modern-light:hover { transform: translateY(-3px); box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06); }
  .btn-modern-light:active { transform: translateY(1px); background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%); box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1); }

  .btn-modern-dark {
    background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
    color: #FFFFFF;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
    text-decoration: none;
  }
  .btn-modern-dark:hover { transform: translateY(-3px); background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%); box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2); }
  .btn-modern-dark:active { transform: translateY(1px); background: #18181B; box-shadow: 0 0 0 1px rgba(255,255,255,0.05), inset 0 3px 8px rgba(0,0,0,0.9); }

  .progress-ring {
    transform: rotate(-90deg);
    transform-origin: center;
    stroke-dasharray: 402;
    stroke-dashoffset: 402;
    stroke-linecap: round;
  }

  @keyframes ch-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .ch-pulse { animation: ch-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }

  /* Responsive helpers (Tailwind-free) */
  .ch-hidden-mobile { display: none; }
  @media (min-width: 768px) {
    .ch-hidden-mobile { display: block; }
  }
  .ch-grid-desktop {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  @media (min-width: 1024px) {
    .ch-grid-desktop {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      justify-content: initial;
      align-items: center;
    }
  }
  .ch-text-right {
    display: flex;
    justify-content: center;
  }
  @media (min-width: 1024px) {
    .ch-text-right { justify-content: flex-end; }
  }
  .ch-cta-row {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  @media (min-width: 640px) {
    .ch-cta-row { flex-direction: row; }
  }
`;

export function CinematicHero({
  brandName = "BIS AI",
  tagline1 = "Intelligence for",
  tagline2 = "Indian Standards.",
  cardHeading = "Compliance, reimagined.",
  cardDescription = (
    <>
      <span style={{ color: '#fff', fontWeight: 600 }}>BIS SmartAI</span> empowers manufacturers, importers, and compliance officers with real-time BIS standard lookup, QCO tracking, and ISI certification guidance.
    </>
  ),
  metricValue = 1200,
  metricLabel = "Standards Tracked",
  ctaHeading = "Know your standards.",
  ctaDescription = "Join thousands of Indian manufacturers and compliance professionals getting instant BIS intelligence.",
  className,
  ...props
}) {
  const containerRef = useRef(null);
  const mainCardRef = useRef(null);
  const mockupRef = useRef(null);
  const requestRef = useRef(0);

  // High-Performance Mouse Interaction
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (window.scrollY > window.innerHeight * 2) return;
      cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current && mockupRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
          const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
          gsap.to(mockupRef.current, { rotationY: xVal * 12, rotationX: -yVal * 12, ease: "power3.out", duration: 1.2 });
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => { window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(requestRef.current); };
  }, []);

  // Cinematic Scroll Timeline
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      const introTl = gsap.timeline({ delay: 0.3 });
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to([".hero-text-wrapper", ".bg-grid-theme"], { scale: 1.15, filter: "blur(20px)", opacity: 0.2, ease: "power2.inOut", duration: 2 }, 0)
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 })
        .fromTo(".mockup-scroll-wrapper",
          { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
          { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8")
        .fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "back.out(1.2)", duration: 1.5 }, "-=1.5")
        .to(".progress-ring", { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" }, "-=1.2")
        .to(".counter-val", { innerHTML: metricValue, snap: { innerHTML: 1 }, duration: 2, ease: "expo.out" }, "-=2.0")
        .fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=2.0")
        .fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
        .fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
          scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
        })
        .to(".main-card", {
          width: isMobile ? "92vw" : "85vw",
          height: isMobile ? "92vh" : "85vh",
          borderRadius: isMobile ? "32px" : "40px",
          ease: "expo.inOut", duration: 1.8,
        }, "pullback")
        .to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
        .to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });
    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080c14',
        color: '#e5e7eb',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        WebkitFontSmoothing: 'antialiased',
        perspective: '1500px',
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div className="bg-grid-theme" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.5 }} aria-hidden="true" />

      {/* Hero Tagline Text */}
      <div className="hero-text-wrapper" style={{ position: 'absolute', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100vw', padding: '0 1rem' }}>
        <h1 className="text-track gsap-reveal text-3d-matte" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 800, letterSpacing: '-0.04em' }}>
          {tagline2}
        </h1>
      </div>

      {/* CTA Section */}
      <div className="cta-wrapper gsap-reveal" style={{ position: 'absolute', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100vw', padding: '0 1.5rem', pointerEvents: 'auto' }}>
        <h2 className="text-silver-matte" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          {ctaHeading}
        </h2>
        <p style={{ color: 'rgba(147,197,253,0.7)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', marginBottom: '3rem', maxWidth: '36rem', fontWeight: 300, lineHeight: 1.7 }}>
          {ctaDescription}
        </p>
        <div className="ch-cta-row">
          <a href="/assistant" aria-label="Try BIS SmartAI" className="btn-modern-light" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: '1.25rem', border: 'none', cursor: 'pointer' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280', marginBottom: '-2px' }}>Get Started</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>BIS Assistant</div>
            </div>
          </a>
          <a href="/standards" aria-label="Browse Standards" className="btn-modern-dark" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem 2rem', borderRadius: '1.25rem', border: 'none', cursor: 'pointer' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(161,161,170,0.8)', marginBottom: '-2px' }}>Explore</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>Standards</div>
            </div>
          </a>
        </div>
      </div>

      {/* Main Deep Blue Card */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', perspective: '1500px' }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card gsap-reveal"
          style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', width: '92vw', height: '92vh', borderRadius: 32 }}
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* Card Inner Grid */}
          <div className="ch-grid-desktop" style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem', zIndex: 10 }}>

            {/* Brand Name — right on desktop, top on mobile */}
            <div className="card-right-text gsap-reveal ch-text-right" style={{ order: 1, zIndex: 20, width: '100%' }}>
              <h2 className="text-card-silver-matte" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                {brandName}
              </h2>
            </div>

            {/* iPhone Mockup — center */}
            <div className="mockup-scroll-wrapper" style={{ order: 2, position: 'relative', width: '100%', height: 'clamp(280px, 50vh, 600px)', display: 'flex', alignItems: 'center', justifyContent: 'center', perspective: '1000px' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.7)', transformOrigin: 'center' }}>
                <div ref={mockupRef} className="iphone-bezel" style={{ position: 'relative', width: 280, height: 580, borderRadius: 48, display: 'flex', flexDirection: 'column' }}>
                  {/* Buttons */}
                  {[{top:120,h:25},{top:160,h:45},{top:220,h:45}].map((b,i) => (
                    <div key={i} className="hardware-btn" style={{ position:'absolute', top:b.top, left:-3, width:3, height:b.h, borderRadius:'4px 0 0 4px', zIndex:0 }} aria-hidden="true" />
                  ))}
                  <div className="hardware-btn" style={{ position:'absolute', top:170, right:-3, width:3, height:70, borderRadius:'0 4px 4px 0', zIndex:0, transform:'scaleX(-1)' }} aria-hidden="true" />

                  {/* Screen */}
                  <div style={{ position:'absolute', inset:7, background:'#050914', borderRadius:40, overflow:'hidden', boxShadow:'inset 0 0 15px rgba(0,0,0,1)', color:'#fff', zIndex:10 }}>
                    <div className="screen-glare" style={{ position:'absolute', inset:0, zIndex:40, pointerEvents:'none' }} aria-hidden="true" />

                    {/* Dynamic Island */}
                    <div style={{ position:'absolute', top:5, left:'50%', transform:'translateX(-50%)', width:100, height:28, background:'#000', borderRadius:20, zIndex:50, display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'0 12px', boxShadow:'inset 0 -1px 2px rgba(255,255,255,0.1)' }}>
                      <div className="ch-pulse" style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px rgba(34,197,94,0.8)' }} />
                    </div>

                    {/* App UI */}
                    <div style={{ position:'relative', width:'100%', height:'100%', paddingTop:48, paddingLeft:20, paddingRight:20, paddingBottom:32, display:'flex', flexDirection:'column' }}>
                      {/* Header */}
                      <div className="phone-widget" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
                        <div>
                          <div style={{ fontSize:10, color:'#a1a1aa', textTransform:'uppercase', letterSpacing:'0.15em', fontWeight:700, marginBottom:4 }}>Today</div>
                          <div style={{ fontSize:18, fontWeight:700, color:'#fff' }}>Standards</div>
                        </div>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.05)', color:'#d4d4d8', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 4px 12px rgba(0,0,0,0.5)' }}>AI</div>
                      </div>

                      {/* Progress Ring */}
                      <div className="phone-widget" style={{ position:'relative', width:176, height:176, margin:'0 auto 32px', display:'flex', alignItems:'center', justifyContent:'center', filter:'drop-shadow(0 15px 25px rgba(0,0,0,0.8))' }}>
                        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} aria-hidden="true">
                          <circle cx="88" cy="88" r="64" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                          <circle className="progress-ring" cx="88" cy="88" r="64" fill="none" stroke="#3B82F6" strokeWidth="12" />
                        </svg>
                        <div style={{ textAlign:'center', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center' }}>
                          <span className="counter-val" style={{ fontSize:36, fontWeight:800, letterSpacing:'-0.04em', color:'#fff' }}>0</span>
                          <span style={{ fontSize:8, color:'rgba(147,197,253,0.5)', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:700, marginTop:2 }}>{metricLabel}</span>
                        </div>
                      </div>

                      {/* Widgets */}
                      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                        {[
                          { color:'blue', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                          { color:'emerald', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /> },
                        ].map((w, i) => (
                          <div key={i} className="phone-widget widget-depth" style={{ borderRadius:16, padding:12, display:'flex', alignItems:'center' }}>
                            <div style={{ width:40, height:40, borderRadius:12, background:`linear-gradient(135deg, rgba(${w.color==='blue'?'59,130,246':'16,185,129'},0.2) 0%, rgba(${w.color==='blue'?'37,99,235':'5,150,105'},0.05) 100%)`, display:'flex', alignItems:'center', justifyContent:'center', marginRight:12, border:`1px solid rgba(${w.color==='blue'?'147,197,253':'52,211,153'},0.2)` }}>
                              <svg style={{ width:16, height:16, color: w.color==='blue'?'#60a5fa':'#34d399', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">{w.icon}</svg>
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ height:8, width:80, background:'#d4d4d8', borderRadius:4, marginBottom:8 }} />
                              <div style={{ height:6, width:48, background:'#52525b', borderRadius:4 }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Home indicator */}
                      <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', width:120, height:4, background:'rgba(255,255,255,0.2)', borderRadius:4 }} />
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="floating-badge floating-ui-badge" style={{ position:'absolute', top:24, left:-15, display:'flex', alignItems:'center', gap:12, borderRadius:16, padding:'12px 16px', zIndex:30 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(180deg,rgba(59,130,246,0.2),rgba(37,99,235,0.1))', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(147,197,253,0.3)' }}>
                    <span style={{ fontSize:18 }} aria-hidden="true">✅</span>
                  </div>
                  <div>
                    <p style={{ color:'#fff', fontSize:13, fontWeight:700, margin:0, letterSpacing:'-0.01em' }}>BIS Certified</p>
                    <p style={{ color:'rgba(147,197,253,0.5)', fontSize:11, fontWeight:500, margin:0 }}>QCO Compliant</p>
                  </div>
                </div>

                <div className="floating-badge floating-ui-badge" style={{ position:'absolute', bottom:80, right:-15, display:'flex', alignItems:'center', gap:12, borderRadius:16, padding:'12px 16px', zIndex:30 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(180deg,rgba(99,102,241,0.2),rgba(79,70,229,0.1))', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(165,180,252,0.3)' }}>
                    <span style={{ fontSize:18 }} aria-hidden="true">🛡️</span>
                  </div>
                  <div>
                    <p style={{ color:'#fff', fontSize:13, fontWeight:700, margin:0 }}>ISI Mark</p>
                    <p style={{ color:'rgba(147,197,253,0.5)', fontSize:11, fontWeight:500, margin:0 }}>Verified instantly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Left — accountability text */}
            <div className="card-left-text gsap-reveal" style={{ order: 3, display:'flex', flexDirection:'column', justifyContent:'center', textAlign:'center', zIndex:20, width:'100%', padding:'0 1rem' }}>
              <h3 style={{ color:'#fff', fontSize:'clamp(1.5rem,3vw,2.5rem)', fontWeight:700, marginBottom:12, letterSpacing:'-0.02em' }}>
                {cardHeading}
              </h3>
              <p className="ch-hidden-mobile" style={{ color:'rgba(147,197,253,0.7)', fontSize:'clamp(0.875rem,1.5vw,1.125rem)', fontWeight:400, lineHeight:1.7, maxWidth:'24rem', margin:'0 auto' }}>
                {cardDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
