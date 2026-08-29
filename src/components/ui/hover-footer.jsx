import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail, Phone, MapPin, Globe, Shield, Sparkles,
  ExternalLink, Layers, Award, CheckCircle, FileText
} from 'lucide-react';
import './hover-footer.css';

export const TextHoverEffect = ({
  text = 'BIS SmartAI',
  duration = 0.3,
  className = '',
}) => {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 70"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={`hover-footer__svg ${className}`}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="25%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="75%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#10B981" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="22%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* Base stroke text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="hover-footer__svg-base"
        style={{ opacity: hovered ? 0.6 : 0.2 }}
      >
        {text}
      </text>

      {/* Animated stroke path */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.35"
        className="hover-footer__svg-animated"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.text>

      {/* Interactive masked gradient hover text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.4"
        mask="url(#textMask)"
        className="hover-footer__svg-gradient"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return <div className="hover-footer__bg-gradient" aria-hidden="true" />;
};

export default function HoverFooter() {
  const footerLinks = [
    {
      title: 'Standards & Schemes',
      links: [
        { label: 'Explore Indian Standards (IS)', href: '/standards' },
        { label: 'Scheme I (ISI Mark Certification)', href: '/services' },
        { label: 'Scheme II (CRS Registration)', href: '/services' },
        { label: 'FMCS (Foreign Manufacturers)', href: '/services' },
        { label: 'Compare Standards', href: '/compare' },
      ],
    },
    {
      title: 'Compliance & Tools',
      links: [
        { label: 'Product Compliance Checker', href: '/compliance', pulse: true },
        { label: 'NABL & Apex Testing Labs', href: '/laboratories' },
        { label: 'BIS SmartAI Assistant', href: '/assistant', pulse: true },
        { label: 'Official Manakonline Portal', href: 'https://www.manakonline.in', external: true },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={16} className="hover-footer__contact-icon" />,
      text: 'support@bissmartai.in',
      href: 'mailto:support@bissmartai.in',
    },
    {
      icon: <Phone size={16} className="hover-footer__contact-icon" />,
      text: '+91 11 2323 0131 (BIS Helpdesk)',
      href: 'tel:+911123230131',
    },
    {
      icon: <MapPin size={16} className="hover-footer__contact-icon" />,
      text: 'Manak Bhavan, 9 Bahadur Shah Zafar Marg, New Delhi 110002',
    },
  ];

  const socialLinks = [
    { icon: <Globe size={16} />, label: 'BIS Official', href: 'https://www.bis.gov.in' },
    { icon: <Award size={16} />, label: 'Manakonline', href: 'https://www.manakonline.in' },
    { icon: <Shield size={16} />, label: 'NABL Directory', href: 'https://www.nabl-india.org' },
  ];

  return (
    <footer className="hover-footer">
      <div className="hover-footer__container">
        <div className="hover-footer__grid">
          {/* Brand section */}
          <div className="hover-footer__brand-col">
            <div className="hover-footer__logo-wrap">
              <div className="hover-footer__logo-icon">
                <Shield size={20} />
              </div>
              <span className="hover-footer__brand-title">
                BIS <span className="hover-footer__brand-accent">SmartAI</span>
              </span>
            </div>
            <p className="hover-footer__tagline">
              AI-powered regulatory intelligence for Bureau of Indian Standards (BIS), Quality Control Orders (QCOs), and product certification compliance.
            </p>
            <div className="hover-footer__status-badge">
              <CheckCircle size={12} className="text-emerald" />
              <span>Verified Regulatory Data</span>
            </div>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="hover-footer__col">
              <h4 className="hover-footer__col-title">{section.title}</h4>
              <ul className="hover-footer__links-list">
                {section.links.map((link) => (
                  <li key={link.label} className="hover-footer__link-item">
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="hover-footer__link"
                    >
                      <span>{link.label}</span>
                      {link.external && <ExternalLink size={11} className="hover-footer__ext-icon" />}
                      {link.pulse && <span className="hover-footer__pulse-dot" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div className="hover-footer__col">
            <h4 className="hover-footer__col-title">Regulatory Directory</h4>
            <ul className="hover-footer__contact-list">
              {contactInfo.map((item, i) => (
                <li key={i} className="hover-footer__contact-item">
                  <div className="hover-footer__contact-icon-wrap">{item.icon}</div>
                  {item.href ? (
                    <a href={item.href} className="hover-footer__contact-link">
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover-footer__contact-text">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="hover-footer__divider" />

        {/* Footer bottom */}
        <div className="hover-footer__bottom">
          <div className="hover-footer__social-links">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover-footer__social-btn"
              >
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </div>

          <p className="hover-footer__copyright">
            &copy; {new Date().getFullYear()} BIS SmartAI. Enterprise Standards & Compliance Intelligence.
          </p>
        </div>
      </div>

      {/* Interactive Text Hover Effect Banner */}
      <div className="hover-footer__text-effect-container">
        <TextHoverEffect text="BIS SMARTAI" className="hover-footer__svg-elem" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
