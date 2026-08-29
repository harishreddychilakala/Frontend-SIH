import './AIOrb.css';

export default function AIOrb({ size = 'md', animated = true, state = 'idle' }) {
  const sizeMap = {
    sm: { orb: 60, core: 28 },
    md: { orb: 120, core: 56 },
    lg: { orb: 200, core: 90 },
    xl: { orb: 300, core: 130 },
  };

  const { orb, core } = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`ai-orb ai-orb--${size} ${animated ? 'ai-orb--animated' : ''} ai-orb--${state}`}
      style={{ '--orb-size': `${orb}px`, '--core-size': `${core}px` }}
      aria-hidden="true"
    >
      {/* Outer rings */}
      <div className="ai-orb__ring ai-orb__ring--3" />
      <div className="ai-orb__ring ai-orb__ring--2" />
      <div className="ai-orb__ring ai-orb__ring--1" />

      {/* Glow */}
      <div className="ai-orb__glow" />

      {/* Core */}
      <div className="ai-orb__core">
        <div className="ai-orb__inner">
          <div className="ai-orb__particle ai-orb__particle--1" />
          <div className="ai-orb__particle ai-orb__particle--2" />
          <div className="ai-orb__particle ai-orb__particle--3" />
        </div>
      </div>

      {/* Processing dots */}
      {state === 'processing' && (
        <div className="ai-orb__dots">
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
}
