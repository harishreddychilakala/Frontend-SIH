'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Shield, CheckCircle, Award, Play, Pause, ChevronLeft, ChevronRight,
  Flame, Zap, Cpu, Sun, Layers, Activity, Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';
import './hero-scroll-video-pin-reveal.css';

export const BIS_MEDIA_ITEMS = [
  {
    id: 'steel',
    type: 'video',
    videoSrc: 'https://res.cloudinary.com/dsuwzuaxp/video/upload/856381-hd_1920_1080_30fps_gsq11b.mp4',
    thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80&auto=format&fit=crop',
    imageSrc: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format&fit=crop',
    title: 'IS 1786:2008 — High Strength TMT Steel Bars',
    shortTitle: 'IS 1786 · Steel',
    category: 'Structural Steel & Construction Infrastructure',
    scheme: 'Scheme I (ISI Mark)',
    badge: 'QCO Mandatory',
    badgeColor: '#38bdf8',
    icon: Layers,
    telemetry: { standard: 'IS 1786:2008', yieldStress: 'Fe 500D / 550D', elongation: 'Min 16.0%', carbonEq: 'Max 0.42%' },
    testingClauses: [
      'Tensile & 0.2% Proof Stress (Clause 9.1)',
      'Bend & Rebend Ductility Test (Clause 9.3)',
      'Chemical Spectrometry & Carbon Equivalent'
    ],
    labType: 'Apex Metallurgical & NABL Accredited Laboratory',
  },
  {
    id: 'led',
    type: 'image',
    thumb: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=200&q=80&auto=format&fit=crop',
    imageSrc: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=1920&q=80&auto=format&fit=crop',
    title: 'IS 16102 (Part 1 & 2) — Self-Ballasted LED Luminaires',
    shortTitle: 'IS 16102 · LED Lighting',
    category: 'Smart Electronics, Commercial & Home Lighting',
    scheme: 'Scheme II (CRS Registration)',
    badge: 'CRS Mandatory',
    badgeColor: '#60a5fa',
    icon: Zap,
    telemetry: { standard: 'IS 16102', powerFactor: '> 0.90 PF', thdHarmonics: '< 15%', ingressRating: 'IP65 Tested' },
    testingClauses: [
      'Photobiological Optical Safety (Clause 8.1)',
      'Harmonics & Electromagnetic Compatibility (EMC)',
      'High-Voltage Insulation Resistance Breakdown'
    ],
    labType: 'BIS-Recognized Photometry & Electrical Lab',
  },
  {
    id: 'battery',
    type: 'image',
    thumb: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&q=80&auto=format&fit=crop',
    imageSrc: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1920&q=80&auto=format&fit=crop',
    title: 'IS 16046 (Part 2) / IEC 62133 — Lithium-Ion EV Batteries',
    shortTitle: 'IS 16046 · Li-Ion Battery',
    category: 'Energy Storage & Electric Mobility Powertrains',
    scheme: 'Scheme II (CRS Mandatory)',
    badge: 'High Impact Safety',
    badgeColor: '#a78bfa',
    icon: Cpu,
    telemetry: { standard: 'IS 16046-2', thermalRunaway: 'Pass at 130°C', dropHeight: '1.0m Free Fall', shortCircuit: '< 80mΩ at 55°C' },
    testingClauses: [
      'Continuous Low-Rate Overcharging Thermal Test',
      'External Short Circuit at 55°C Ambient',
      'Drop Test & Free Fall Impact Verification'
    ],
    labType: 'Apex Battery Testing Facility & NABL Test House',
  },
  {
    id: 'solar',
    type: 'image',
    thumb: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&q=80&auto=format&fit=crop',
    imageSrc: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1920&q=80&auto=format&fit=crop',
    title: 'IS 14286 — Crystalline Silicon Terrestrial PV Modules',
    shortTitle: 'IS 14286 · Solar PV',
    category: 'Renewable Clean Energy & Solar Grid Equipment',
    scheme: 'Scheme II (CRS Mandatory)',
    badge: 'MNRE Aligned',
    badgeColor: '#fbbf24',
    icon: Sun,
    telemetry: { standard: 'IS 14286', tempCycling: '-40°C to +85°C', mechLoad: '5400 Pa Wind/Snow', dampHeat: '85°C / 85% RH' },
    testingClauses: [
      'Thermal Cycling Test (-40°C to +85°C, 200 cycles)',
      'Humidity Freeze & Damp Heat 85/85 Test',
      'Static Mechanical Load 5400 Pa Snow & Wind'
    ],
    labType: 'National Solar Testing Centre & Regional Labs',
  },
  {
    id: 'gold',
    type: 'image',
    thumb: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80&auto=format&fit=crop',
    imageSrc: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80&auto=format&fit=crop',
    title: 'IS 1417 — Gold & Gold Alloys Jewellery Hallmarking',
    shortTitle: 'IS 1417 · Hallmarking',
    category: 'Precious Metals, Purity Assay & Consumer Protection',
    scheme: 'BIS Hallmarking Scheme',
    badge: '6-Digit HUID Mandatory',
    badgeColor: '#f59e0b',
    icon: Award,
    telemetry: { standard: 'IS 1417:2016', purityGrade: '22K (916) / 18K (750)', assayMethod: 'Fire Assay Protocol', tracking: '6-Digit HUID Laser' },
    testingClauses: [
      'Fire Assay Cupellation Precision Method',
      'X-Ray Fluorescence (XRF) Multi-Element Spectrometry',
      '6-Digit Alphanumeric HUID Laser Micro-Engraving'
    ],
    labType: 'BIS-Recognized Assaying & Hallmarking Centre (AHC)',
  },
  {
    id: 'medical',
    type: 'image',
    thumb: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&q=80&auto=format&fit=crop',
    imageSrc: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80&auto=format&fit=crop',
    title: 'IS 13450 / IEC 60601 — Medical Electrical Equipment',
    shortTitle: 'IS 13450 · Medical Devices',
    category: 'Healthcare & Clinical Diagnostic Safety Systems',
    scheme: 'Scheme I (ISI Mark / CDSCO)',
    badge: 'Class A-D Regulated',
    badgeColor: '#34d399',
    icon: Activity,
    telemetry: { standard: 'IS 13450-1', dielectric: '4000V Isolation', leakageCurrent: '< 10µA Patient Aux', emcSafety: 'IEC 60601-1-2' },
    testingClauses: [
      'Dielectric Voltage Withstand & Patient Isolation',
      'Earth Leakage & Enclosure Current Safety',
      'Electromagnetic Immunity in Critical Care Settings'
    ],
    labType: 'Apex Bio-Medical Testing & NABL Facility',
  },
];

export const HeroScrollVideoReveal = ({
  topText = (
    <>
      Precision Intelligence for Indian Standards,
      <br />
      Built to Accelerate Every Stage of Compliance
    </>
  ),
  headingText = "Intelligent Compliance Meets Indian Standards",
  subText = "From ISI Mark licensing and mandatory QCO gap audits to NABL testing facilities — navigate regulations with speed and AI clarity.",
  bottomText = (
    <>
      Where Indian Standards, Testing & QCOs
      <br />
      <span className="hero-reveal-highlight">Converge Seamlessly</span>
    </>
  ),
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  // Auto cycle motion photos/video every 5.5 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BIS_MEDIA_ITEMS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex]);

  const currentMedia = BIS_MEDIA_ITEMS[activeIndex];
  const CurrentIcon = currentMedia.icon;

  return (
    <div className={`hero-reveal-container ${className}`}>
      {/* Intro Header */}
      <section className="hero-reveal-intro">
        <div className="hero-reveal-intro-badge">
          <Sparkles size={13} />
          <span>Interactive BIS Standard Showcase</span>
        </div>

        <h2 className="hero-reveal-intro-title">
          {topText}
        </h2>

        <p className="hero-reveal-subtext">
          {subText}
        </p>

        {/* Category Pill Filters */}
        <div className="hero-reveal-tags-row">
          {BIS_MEDIA_ITEMS.map((item, idx) => {
            const TagIcon = item.icon;
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                className={`hero-reveal-tag-pill ${isActive ? 'hero-reveal-tag-pill--active' : ''}`}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsPlaying(false);
                }}
              >
                <TagIcon size={14} style={{ color: item.badgeColor }} />
                <span>{item.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Cinema Showcase Stage */}
      <div className="hero-reveal-stage-section">
        <div className="hero-reveal-stage-card">
          {/* Media Layers with Smooth Crossfade */}
          {BIS_MEDIA_ITEMS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={item.id}
                className={`hero-reveal-media-layer ${
                  isActive ? 'hero-reveal-media-layer--active' : 'hero-reveal-media-layer--inactive'
                }`}
              >
                {item.type === 'video' ? (
                  <video
                    ref={isActive ? videoRef : null}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={item.imageSrc}
                    className="hero-reveal-media-video"
                  >
                    <source src={item.videoSrc} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="hero-reveal-media-img"
                  />
                )}
              </div>
            );
          })}

          {/* Cinematic Lighting Vignettes */}
          <div className="hero-reveal-vignette-top" />
          <div className="hero-reveal-vignette-bottom" />

          {/* Stage Top-Left Badges */}
          <div className="hero-reveal-stage-header">
            <div className="hero-reveal-scheme-badge">
              <Shield size={14} className="text-[#38bdf8]" />
              <span>{currentMedia.scheme}</span>
            </div>

            <div className="hero-reveal-status-badge">
              <CheckCircle size={13} />
              <span>{currentMedia.badge}</span>
            </div>
          </div>

          {/* Stage Top-Right Controls */}
          <div className="hero-reveal-stage-controls">
            <button
              type="button"
              className="hero-reveal-ctrl-btn"
              onClick={() => setIsPlaying((p) => !p)}
              title={isPlaying ? 'Pause Motion Auto-cycle' : 'Resume Motion Auto-cycle'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              type="button"
              className="hero-reveal-ctrl-btn"
              onClick={() => {
                setActiveIndex((prev) => (prev === 0 ? BIS_MEDIA_ITEMS.length - 1 : prev - 1));
                setIsPlaying(false);
              }}
              title="Previous Standard"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="hero-reveal-ctrl-btn"
              onClick={() => {
                setActiveIndex((prev) => (prev + 1) % BIS_MEDIA_ITEMS.length);
                setIsPlaying(false);
              }}
              title="Next Standard"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Interactive BIS Testing Details HUD (Bottom Left) */}
          <div className="hero-reveal-hud-card">
            <h3 className="hero-reveal-hud-title">
              {currentMedia.title}
            </h3>
            <div className="hero-reveal-hud-category">
              {currentMedia.category}
            </div>

            <div className="hero-reveal-hud-clauses-box">
              <div className="hero-reveal-hud-clause-label">
                Mandatory Testing & Quality Clauses
              </div>
              {currentMedia.testingClauses.map((clause, cIdx) => (
                <div key={cIdx} className="hero-reveal-hud-clause-item">
                  <div className="hero-reveal-hud-clause-dot" />
                  <span>{clause}</span>
                </div>
              ))}
            </div>

            <div className="hero-reveal-hud-footer">
              <span>{currentMedia.labType}</span>
              <span className="text-[#38bdf8] font-semibold flex items-center gap-1">
                Verified Intel <Sparkles size={11} />
              </span>
            </div>
          </div>

          {/* Live Telemetry Radar (Bottom Right) */}
          <div className="hero-reveal-telemetry-box">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/10 pb-1">
              Quality Specs
            </div>
            {Object.entries(currentMedia.telemetry).map(([key, val]) => (
              <div key={key} className="hero-reveal-telemetry-item">
                <span className="hero-reveal-telemetry-label capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="hero-reveal-telemetry-val">{val}</span>
              </div>
            ))}
          </div>

          {/* Bottom Thumbnail Strip for Fast Navigation */}
          <div className="hero-reveal-thumb-strip">
            {BIS_MEDIA_ITEMS.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={item.id}
                  className={`hero-reveal-thumb-card ${isActive ? 'hero-reveal-thumb-card--active' : ''}`}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPlaying(false);
                  }}
                >
                  <img
                    src={item.thumb}
                    alt={item.shortTitle}
                    className="hero-reveal-thumb-img"
                  />
                  <span className="hero-reveal-thumb-title">{item.shortTitle}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScrollVideoReveal;
