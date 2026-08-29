/**
 * HeroCarousel — adapted for React/Vite/JSX (no TypeScript, no Tailwind, no shadcn).
 * 
 * A full-bleed editorial hero strip. The focused card unfurls to full height
 * while its neighbours stay clipped to half. The whole background re-grades
 * to each card's accent colour on focus.
 *
 * Dependencies: framer-motion
 */
import * as React from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import './HeroCarousel.css';

const CARD_H = 0.264;
const CARD_AR = 0.75;
const GAP = 0.038;
const STRIP_TOP = 0.5;
const TITLE = 0.067;
const LABEL = 0.0103;
const PAD = 0.017;
const RAIL = 0.2;

const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN = 420;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * @param {{
 *   items: { id?: string|number, title: string, image: string, credit?: string, meta?: string[], accent?: string }[],
 *   index?: number,
 *   defaultIndex?: number,
 *   onIndexChange?: (index: number) => void,
 *   brand?: React.ReactNode,
 *   onBack?: () => void,
 *   onMenu?: () => void,
 *   autoplay?: boolean,
 *   autoplayDelay?: number,
 *   className?: string,
 * }} props
 */
export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  brand,
  onBack,
  onMenu,
  autoplay = false,
  autoplayDelay = 4000,
  className = '',
}) {
  const stageRef = React.useRef(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex);
  const [dragging, setDragging] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();

  const last = items.length - 1;
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last));

  const go = React.useCallback(
    (next) => {
      const clamped = clamp(next, 0, Math.max(0, last));
      if (controlled === undefined) setUncontrolled(clamped);
      if (clamped !== index) onIndexChange?.(clamped);
    },
    [controlled, index, last, onIndexChange],
  );

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const fullH = clamp(box.h * CARD_H, 96, 360);
  const halfH = fullH / 2;
  const cardW = fullH * CARD_AR;
  const gap = Math.max(4, Math.round(cardW * GAP));
  const step = cardW + gap;
  const pad = Math.max(16, Math.round(box.w * PAD));
  const label = Math.max(9, Math.round(box.h * LABEL));

  const xFor = React.useCallback(
    (i) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW],
  );
  const x = useMotionValue(0);
  const target = xFor(index);

  const swing = reduced ? { duration: 0 } : { duration: 0.7, ease: 'easeOut' };
  const spring = reduced
    ? { duration: 0 }
    : { type: 'spring', stiffness: 260, damping: 34, mass: 0.9 };

  React.useEffect(() => {
    if (dragging) return;
    const run = animate(x, target, spring);
    return () => run.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, dragging, reduced, x]);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let acc = 0;
    let until = 0;

    const onWheel = (e) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const stuck = (delta > 0 && index === last) || (delta < 0 && index === 0);
      if (stuck) { acc = 0; return; }
      e.preventDefault();
      const now = e.timeStamp;
      if (now < until) return;
      acc += delta;
      if (Math.abs(acc) < WHEEL_THRESHOLD) return;
      go(index + Math.sign(acc));
      acc = 0;
      until = now + WHEEL_COOLDOWN;
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [go, index, last]);

  React.useEffect(() => {
    if (!autoplay || paused || dragging || items.length < 2) return;
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      autoplayDelay,
    );
    return () => window.clearTimeout(id);
  }, [autoplay, autoplayDelay, dragging, go, index, items.length, last, paused]);

  const active = items[index];
  if (!active) return null;

  const lines = active.title.split('\n');
  const accent = active.accent ?? '#8a8a8a';

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="BIS Compliance Showcase"
      onKeyDown={(e) => {
        const keys = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: last };
        if (!(e.key in keys)) return;
        e.preventDefault();
        go(keys[e.key]);
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`hero-carousel ${className}`}
    >
      {/* Background: focused photo re-graded to its accent colour */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="hero-carousel__bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          <motion.img
            src={active.image}
            alt=""
            aria-hidden
            draggable={false}
            className="hero-carousel__bg-img"
            initial={{ scale: reduced ? 1.28 : 1.42 }}
            animate={{ scale: 1.28 }}
            transition={reduced ? { duration: 0 } : { duration: 6, ease: 'linear' }}
          />
          <div
            className="hero-carousel__color-layer"
            style={{ backgroundColor: accent, mixBlendMode: 'color' }}
          />
          <div
            className="hero-carousel__multiply-layer"
            style={{ backgroundColor: accent, mixBlendMode: 'multiply' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient wash + grain overlay */}
      <div className="hero-carousel__gradient" />
      <div
        aria-hidden
        className="hero-carousel__grain"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Top bar */}
      <div
        className="hero-carousel__topbar"
        style={{ top: Math.max(16, box.h * 0.029), gap: `${Math.max(20, box.w * 0.06)}px` }}
      >
        {onBack && (
          <button type="button" onClick={onBack} className="hero-carousel__topbar-btn" style={{ fontSize: label * 1.15 }}>
            <span aria-hidden>↖</span> Back
          </button>
        )}
        {brand && (
          <div className="hero-carousel__brand" style={{ fontSize: label * 1.35 }}>
            {brand}
          </div>
        )}
        {onMenu && (
          <button type="button" onClick={onMenu} className="hero-carousel__topbar-btn" style={{ fontSize: label * 1.15 }}>
            Menu <span aria-hidden>☰</span>
          </button>
        )}
      </div>

      {/* Headline block above the strip */}
      <div
        className="hero-carousel__headline-block"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.028),
        }}
      >
        <div className="hero-carousel__headline-inner">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h2
              key={index}
              className="hero-carousel__title"
              style={{ fontSize: Math.max(24, Math.round(box.h * TITLE)) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              {lines.map((line, i) => (
                <span key={i} className="hero-carousel__title-line">
                  <motion.span
                    className="hero-carousel__title-line-inner"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </AnimatePresence>

          {active.credit && (
            <motion.p
              key={`credit-${index}`}
              className="hero-carousel__credit"
              style={{ fontSize: label }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {active.credit}
            </motion.p>
          )}

          {active.meta?.length > 0 && (
            <div className="hero-carousel__meta" style={{ gap: `${Math.max(16, box.w * 0.055)}px` }}>
              {active.meta.map((fact, i) => (
                <motion.span
                  key={`${index}-${fact}`}
                  className="hero-carousel__meta-fact"
                  style={{ fontSize: label }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.45, delay: 0.12 + i * 0.06 }}
                >
                  {fact}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* The strip */}
      <div
        className="hero-carousel__strip"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <motion.div
          className="hero-carousel__track"
          style={{ gap, x, cursor: dragging ? 'grabbing' : 'grab' }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            const thrown = x.get() + info.velocity.x * 0.12;
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step));
          }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id ?? i}
              type="button"
              aria-label={item.title.replace(/\n/g, ' ')}
              aria-current={i === index}
              onClick={() => go(i)}
              className="hero-carousel__card"
              style={{ width: cardW }}
              animate={{ height: i === index ? fullH : halfH }}
              transition={spring}
            >
              <img
                src={item.image}
                alt=""
                draggable={false}
                className="hero-carousel__card-img"
                style={{ objectPosition: '50% 26%' }}
              />
              <motion.span
                aria-hidden
                className="hero-carousel__card-dimmer"
                animate={{ opacity: i === index ? 0 : 0.18 }}
                transition={spring}
              />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Progress rail */}
      <div
        className="hero-carousel__rail"
        style={{ left: pad, bottom: Math.max(14, box.h * 0.022), width: box.w * RAIL }}
      >
        <div className="hero-carousel__rail-counts" style={{ fontSize: label }}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{String(items.length).padStart(2, '0')}</span>
        </div>
        <div className="hero-carousel__rail-track">
          <motion.div
            className="hero-carousel__rail-thumb"
            style={{ width: `${100 / items.length}%` }}
            animate={{ left: `${(index / items.length) * 100}%` }}
            transition={spring}
          />
        </div>
      </div>
    </div>
  );
}
