import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Sparkles, Search, CheckCircle } from "lucide-react";

// ─── BIS SmartAI Products (Unsplash images) ─────────────────────────────────
export const BIS_PRODUCTS = [
  {
    title: "IS 1786 — TMT Steel Bars",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 16102 — LED Luminaires",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 16046 — Li-Ion Batteries",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 302-2-15 — Electric Kettles",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 13252 — IT Equipment Safety",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 269 — Portland Cement",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 13450 — Medical Devices",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 7387 — Water Purifiers",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 694 — PVC Cables",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "IS 616 — Power Transformers",
    link: "/standards",
    thumbnail:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "QCO Compliance Audit",
    link: "/compliance",
    thumbnail:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "NABL Testing Labs",
    link: "/laboratories",
    thumbnail:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "Standards Comparison",
    link: "/compare",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "BIS Scheme I — ISI Mark",
    link: "/services",
    thumbnail:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=600&fit=crop&q=80&auto=format",
  },
  {
    title: "AI Standards Intelligence",
    link: "/assistant",
    thumbnail:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=600&fit=crop&q=80&auto=format",
  },
];

// ─── Hero Header ─────────────────────────────────────────────────────────────
export const HeroParallaxHeader = ({ heroSearch, setHeroSearch, onSubmit }) => {
  return (
    <div className="parallax-header">
      <div className="parallax-badge">
        <Sparkles size={13} />
        <span>Next-Gen AI Platform for Indian Standards &amp; BIS Compliance</span>
      </div>

      <h1 className="parallax-headline">
        Intelligent Compliance for
        <br />
        <span className="parallax-headline-gradient">
          Indian Standards &amp; QCOs
        </span>
      </h1>

      <p className="parallax-subheadline">
        Navigate Bureau of Indian Standards (BIS) regulations, mandatory Quality
        Control Orders (QCOs), testing clauses, and certification schemes with
        evidence-backed AI intelligence.
      </p>

      <form onSubmit={onSubmit} className="parallax-search-form">
        <div className="parallax-search-inner">
          <Search size={18} className="parallax-search-icon" />
          <input
            type="text"
            className="parallax-search-input"
            placeholder="Ask about any product or standard (e.g., 'Is BIS mandatory for LED drivers?')..."
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
          />
          <button type="submit" className="parallax-search-btn">
            <span>Ask AI</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </form>

      <div className="parallax-trust-row">
        <div className="parallax-trust-item">
          <CheckCircle size={14} />
          <span>Evidence-Backed Verification</span>
        </div>
        <span className="parallax-trust-sep">•</span>
        <div className="parallax-trust-item">
          <Shield size={14} />
          <span>Official Gazette &amp; Manakonline Cross-Referencing</span>
        </div>
      </div>

      <div className="parallax-cta-row">
        <Link to="/dashboard" className="btn btn-gradient btn-lg">
          Launch App <ArrowRight size={16} />
        </Link>
        <Link to="/compliance" className="btn btn-secondary btn-lg">
          Free Compliance Check
        </Link>
      </div>

      <div className="parallax-scroll-hint">
        <span>Scroll to explore</span>
        <div className="parallax-scroll-arrow">↓</div>
      </div>
    </div>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
export const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="parallax-product-card"
    >
      <Link to={product.link} className="parallax-product-link">
        <img
          src={product.thumbnail}
          height={600}
          width={600}
          className="parallax-product-img"
          alt={product.title}
          loading="lazy"
        />
      </Link>
      <div className="parallax-product-overlay" />
      <h2 className="parallax-product-title">{product.title}</h2>
    </motion.div>
  );
};

// ─── Main HeroParallax ────────────────────────────────────────────────────────
export const HeroParallax = ({ products, heroSearch, setHeroSearch, onSubmit }) => {
  const firstRow = products.slice(0, 7);
  const secondRow = products.slice(7, 14);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.35, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [-550, 400]),
    springConfig
  );

  return (
    <div ref={ref} className="hero-parallax-root">
      <div className="hero-parallax-glow" aria-hidden="true" />
      <div className="hero-parallax-glow hero-parallax-glow--2" aria-hidden="true" />

      <HeroParallaxHeader
        heroSearch={heroSearch}
        setHeroSearch={setHeroSearch}
        onSubmit={onSubmit}
      />

      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="hero-parallax-rows"
      >
        <motion.div className="hero-parallax-row hero-parallax-row--reverse">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>

        <motion.div className="hero-parallax-row">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroParallax;
