import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BISThinking.css";

/* ─── Shining Text ─────────────────────────────────────────── */
function ShiningText({ text, className = "" }) {
  return (
    <motion.span
      className={`bis-shining-text ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
    >
      {text}
    </motion.span>
  );
}

/* ─── Animated Brain / Neural Icon ────────────────────────── */
function NeuralIcon() {
  return (
    <svg
      className="bis-neural-icon"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="4" fill="url(#nodeGrad)" />
      <circle cx="24" cy="8" r="2.5" fill="url(#nodeGrad2)" opacity="0.8" />
      <circle cx="38" cy="16" r="2.5" fill="url(#nodeGrad2)" opacity="0.8" />
      <circle cx="38" cy="32" r="2.5" fill="url(#nodeGrad2)" opacity="0.8" />
      <circle cx="24" cy="40" r="2.5" fill="url(#nodeGrad2)" opacity="0.8" />
      <circle cx="10" cy="32" r="2.5" fill="url(#nodeGrad2)" opacity="0.8" />
      <circle cx="10" cy="16" r="2.5" fill="url(#nodeGrad2)" opacity="0.8" />
      <line x1="24" y1="24" x2="24" y2="10.5" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="24" y1="24" x2="36" y2="17.5" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="24" y1="24" x2="36" y2="30.5" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="24" y1="24" x2="24" y2="37.5" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="24" y1="24" x2="12" y2="30.5" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="24" y1="24" x2="12" y2="17.5" stroke="url(#lineGrad)" strokeWidth="1" strokeOpacity="0.5" />
      <defs>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#6366F1" />
        </radialGradient>
        <radialGradient id="nodeGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#3B82F6" />
        </radialGradient>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Thinking Step ────────────────────────────────────────── */
function ThinkingStep({ step, index, isActive, isComplete }) {
  return (
    <motion.div
      className={`bis-step ${isActive ? "bis-step--active" : ""} ${isComplete ? "bis-step--complete" : ""}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.18, duration: 0.45, ease: "easeOut" }}
      role="listitem"
    >
      <div className="bis-step__indicator">
        {isComplete ? (
          <motion.div
            className="bis-step__check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <svg viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        ) : isActive ? (
          <motion.div
            className="bis-step__pulse"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        ) : (
          <div className="bis-step__dot" />
        )}
      </div>
      <div className="bis-step__content">
        <span className="bis-step__label">{step.label}</span>
        {isActive && (
          <motion.span
            className="bis-step__detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {step.detail}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Thinking Dots ────────────────────────────────────────── */
function ThinkingDots() {
  return (
    <span className="bis-dots" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="bis-dots__dot"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

/* ─── Token Counter ────────────────────────────────────────── */
function TokenCounter({ isRunning }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 12 + 3));
    }, 120);
    return () => clearInterval(id);
  }, [isRunning]);

  return (
    <div className="bis-token-counter">
      <span className="bis-token-counter__label">Tokens</span>
      <motion.span
        className="bis-token-counter__value"
        key={count}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {count.toLocaleString()}
      </motion.span>
    </div>
  );
}

/* ─── Main BIS Thinking Component ─────────────────────────── */
const THINKING_STEPS = [
  { label: "Parsing your request", detail: "Understanding context and intent…" },
  { label: "Searching knowledge base", detail: "Retrieving relevant information…" },
  { label: "Reasoning & analysis", detail: "Applying multi-step inference…" },
  { label: "Formulating response", detail: "Structuring optimal output…" },
];

export default function BISThinking({
  isVisible = true,
  thinkingText = "BIS AI is thinking",
  onComplete,
  autoCompleteDelay = 5000,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    setActiveStep(0);
    setCompletedSteps([]);
    setIsDone(false);

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next >= THINKING_STEPS.length) {
          clearInterval(interval);
          setIsDone(true);
          onComplete?.();
          return prev;
        }
        setCompletedSteps((c) => [...c, prev]);
        return next;
      });
    }, autoCompleteDelay / THINKING_STEPS.length);

    return () => clearInterval(interval);
  }, [isVisible, autoCompleteDelay]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bis-thinking"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          role="status"
          aria-label="BIS AI is processing your request"
        >
          {/* Ambient glow */}
          <div className="bis-thinking__glow" aria-hidden="true" />

          {/* Header */}
          <div className="bis-thinking__header">
            {/* Orb */}
            <div className="bis-thinking__orb" aria-hidden="true">
              <motion.div
                className="bis-orb__ring bis-orb__ring--3"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              />
              <motion.div
                className="bis-orb__ring bis-orb__ring--2"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
              />
              <motion.div
                className="bis-orb__ring bis-orb__ring--1"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              <div className="bis-orb__core">
                <NeuralIcon />
              </div>
            </div>

            {/* Title & badge */}
            <div className="bis-thinking__title-group">
              <div className="bis-thinking__brand">
                <span className="bis-thinking__brand-name">BIS</span>
                <span className="bis-thinking__brand-ai">AI</span>
                <span className="bis-thinking__brand-badge">
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ●
                  </motion.span>
                  LIVE
                </span>
              </div>
              <div className="bis-thinking__subtitle">
                <ShiningText text={thinkingText} />
                <ThinkingDots />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="bis-thinking__divider" aria-hidden="true">
            <motion.div
              className="bis-thinking__divider-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>

          {/* Steps */}
          <div className="bis-thinking__steps" role="list">
            {THINKING_STEPS.map((step, i) => (
              <ThinkingStep
                key={step.label}
                step={step}
                index={i}
                isActive={!isDone && activeStep === i}
                isComplete={completedSteps.includes(i) || isDone}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="bis-thinking__footer">
            <TokenCounter isRunning={!isDone} />
            <div className="bis-thinking__model-tag">
              <svg className="bis-thinking__model-icon" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              BIS Neural v2
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
