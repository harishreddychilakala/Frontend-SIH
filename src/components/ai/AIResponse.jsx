import { 
  CheckCircle, AlertTriangle, ExternalLink, Shield, FileText, 
  FlaskConical, Award, ChevronDown, ChevronUp, HelpCircle, 
  Check, Copy, Sparkles, ArrowRight, Layers, Bookmark
} from 'lucide-react';
import { useState } from 'react';
import './AIResponse.css';

/**
 * Format inline text for bolding, code, standard references, and italics
 */
function renderInlineMarkdown(text) {
  if (!text) return null;

  // Split by bold (**...**) and inline code (`...`)
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="ai-response__strong">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="ai-response__code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/**
 * Extract bullet items from a block of text, supporting both newline bullets (*, -)
 * and inline bullet asterisks (* Item 1 * Item 2)
 */
function extractBullets(rawText) {
  if (!rawText) return { intro: '', bullets: [] };

  // Check if text has bullet markers
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const bullets = [];
  const introParts = [];

  for (const line of lines) {
    if (line.startsWith('* ') || line.startsWith('- ') || line.startsWith('• ')) {
      bullets.push(line.replace(/^[\*\-•]\s*/, ''));
    } else if (line.includes(' * ') || line.includes(' - ')) {
      // Split inline asterisks/dashes
      const subParts = line.split(/(?:^|\s+)[\*\-•]\s+/).filter(Boolean);
      if (subParts.length > 1) {
        if (!line.startsWith('*') && !line.startsWith('-')) {
          introParts.push(subParts[0]);
          bullets.push(...subParts.slice(1));
        } else {
          bullets.push(...subParts);
        }
      } else {
        introParts.push(line);
      }
    } else {
      introParts.push(line);
    }
  }

  return {
    intro: introParts.join(' '),
    bullets,
  };
}

/**
 * Parse structured markdown answer into structured sections (Overview, Step Cards, Lists)
 */
function parseAnswerStructure(text) {
  if (!text) return { overview: '', steps: [], generalBlocks: [] };

  // Normalize step markers (e.g. "### Step 1:" or "Step 1:" on newlines)
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/###\s*Step\s*(\d+)/gi, '\n### Step $1')
    .replace(/(?:^|\n)Step\s*(\d+)[\:\.\-]\s*/gi, '\n### Step $1: ');

  // Split by markdown headers
  const sections = normalized.split(/\n(?=###\s+)/g);
  const steps = [];
  const generalBlocks = [];
  let overview = '';

  for (let i = 0; i < sections.length; i++) {
    const rawSection = sections[i].trim();
    if (!rawSection) continue;

    const stepMatch = rawSection.match(/^###\s+Step\s*(\d+)?[\:\.\-]?\s*(.*?)(?:\n|$)([\s\S]*)/i);
    const headerMatch = rawSection.match(/^###\s+(.*?)(?:\n|$)([\s\S]*)/i);

    if (stepMatch) {
      const stepNumber = stepMatch[1] || `${steps.length + 1}`;
      const stepTitle = stepMatch[2].trim();
      const stepContent = stepMatch[3] ? stepMatch[3].trim() : '';
      const { intro, bullets } = extractBullets(stepContent);

      steps.push({
        number: stepNumber,
        title: stepTitle,
        intro,
        bullets,
      });
    } else if (headerMatch && i > 0) {
      const sectionTitle = headerMatch[1].trim();
      const sectionBody = headerMatch[2] ? headerMatch[2].trim() : '';
      const { intro, bullets } = extractBullets(sectionBody);

      generalBlocks.push({
        title: sectionTitle,
        intro,
        bullets,
      });
    } else {
      if (i === 0 && !rawSection.startsWith('###')) {
        overview = rawSection;
      } else {
        const { intro, bullets } = extractBullets(rawSection);
        generalBlocks.push({
          title: null,
          intro,
          bullets,
        });
      }
    }
  }

  return { overview, steps, generalBlocks };
}

export default function AIResponse({ answer }) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!answer) return null;

  const answerText = answer.answer || answer.summary || '';
  const standard = answer.applicable_standard || answer.standard;
  const requirements = answer.requirements || [];
  const qco = answer.qco;
  const testing = answer.testing;
  const certification = answer.certification;
  const precautions = answer.consumer_precautions || answer.precautions || [];
  const sources = answer.sources || [];
  const verificationStatus = answer.verification_status || standard?.verification_status || 'needs_verification';

  const { overview, steps, generalBlocks } = parseAnswerStructure(answerText);

  const handleCopy = () => {
    navigator.clipboard.writeText(answerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-response animate-fade-in">
      {/* Top Banner / Verification Badge */}
      <div className="ai-response__header-bar">
          <span className="verified-badge">
            <CheckCircle size={12} /> Verified BIS Intelligence
          </span>

        <button
          className="btn btn-ghost btn-sm ai-response__copy-btn"
          onClick={handleCopy}
          title="Copy response"
        >
          {copied ? (
            <>
              <Check size={12} className="text-success" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>

      {/* Main Executive Summary / Overview Card */}
      {overview && (
        <div className="ai-response__overview-card">
          <div className="ai-response__overview-badge">
            <Sparkles size={13} />
            <span>Executive Summary</span>
          </div>
          <div className="ai-response__overview-text">
            {renderInlineMarkdown(overview)}
          </div>
        </div>
      )}

      {/* Multi-Step Timeline Cards (If Steps Detected) */}
      {steps.length > 0 && (
        <div className="ai-response__steps-container">
          <div className="ai-response__steps-header">
            <Layers size={14} className="text-blue-light" />
            <span>Step-by-Step Implementation Process ({steps.length} Steps)</span>
          </div>

          <div className="ai-response__steps-timeline">
            {steps.map((step, idx) => (
              <div key={idx} className="ai-response__step-card">
                <div className="ai-response__step-badge-wrap">
                  <div className="ai-response__step-num">
                    {String(step.number || idx + 1).padStart(2, '0')}
                  </div>
                  {idx < steps.length - 1 && <div className="ai-response__step-line" />}
                </div>

                <div className="ai-response__step-content">
                  <h4 className="ai-response__step-title">
                    {renderInlineMarkdown(step.title)}
                  </h4>

                  {step.intro && (
                    <p className="ai-response__step-intro">
                      {renderInlineMarkdown(step.intro)}
                    </p>
                  )}

                  {step.bullets && step.bullets.length > 0 && (
                    <ul className="ai-response__step-bullets">
                      {step.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="ai-response__step-bullet-item">
                          <div className="ai-response__bullet-icon">
                            <ArrowRight size={11} />
                          </div>
                          <span>{renderInlineMarkdown(b)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Formatted Blocks (If No Steps or Additional Sections) */}
      {generalBlocks.length > 0 && (
        <div className="ai-response__blocks">
          {generalBlocks.map((block, bIdx) => (
            <div key={bIdx} className="ai-response__block-card">
              {block.title && (
                <h4 className="ai-response__block-title">
                  {renderInlineMarkdown(block.title)}
                </h4>
              )}

              {block.intro && (
                <p className="ai-response__block-intro">
                  {renderInlineMarkdown(block.intro)}
                </p>
              )}

              {block.bullets && block.bullets.length > 0 && (
                <ul className="ai-response__block-bullets">
                  {block.bullets.map((b, itemIdx) => (
                    <li key={itemIdx} className="ai-response__block-bullet-item">
                      <CheckCircle size={13} className="ai-response__bullet-check" />
                      <span>{renderInlineMarkdown(b)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Structured Cards Grid: Standard, QCO, Requirements, Testing, Certification */}
      <div className="ai-response__structured-grid">
        {/* Applicable Standard */}
        {standard && (
          <div className="ai-response__card ai-response__card--standard">
            <div className="ai-response__card-header">
              <FileText size={14} className="text-blue-light" />
              <span>Applicable Indian Standard</span>
            </div>
            <div className="ai-response__card-body">
              <div className="ai-response__standard-badge">
                {standard.reference || standard.number || 'Indian Standard'}
              </div>
              <div className="ai-response__standard-title-text">{standard.title}</div>
              {standard.applicability && (
                <p className="ai-response__card-subtext">{standard.applicability}</p>
              )}
              <div className="ai-response__tag-row">
                <span className="badge badge-success">{standard.status || 'Active'}</span>
                <span className="badge badge-muted">Scheme-I / ISI</span>
              </div>
            </div>
          </div>
        )}

        {/* QCO Mandatory Order */}
        {qco && (
          <div className="ai-response__card ai-response__card--qco">
            <div className="ai-response__card-header">
              <Shield size={14} className="text-warning" />
              <span>Quality Control Order (QCO)</span>
            </div>
            <div className="ai-response__card-body">
              {typeof qco === 'string' ? (
                <p className="ai-response__card-text">{qco}</p>
              ) : (
                <>
                  <div className="ai-response__qco-ref">{qco.reference || 'Mandatory QCO Order'}</div>
                  <p className="ai-response__card-text">
                    {qco.details || (qco.applicable ? 'Mandatory BIS certification applicable before sale.' : 'Voluntary compliance standard.')}
                  </p>
                  {qco.effective_date && (
                    <div className="ai-response__qco-date">
                      <strong>Effective Date:</strong> {qco.effective_date}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Key Requirements */}
        {requirements && requirements.length > 0 && (
          <div className="ai-response__card ai-response__card--requirements">
            <div className="ai-response__card-header">
              <CheckCircle size={14} className="text-success" />
              <span>Key Compliance Requirements</span>
            </div>
            <ul className="ai-response__list">
              {requirements.map((req, i) => {
                const text = typeof req === 'string' ? req : req.text;
                return (
                  <li key={i} className="ai-response__list-item">
                    <CheckCircle size={13} className="text-success flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Testing Requirements */}
        {testing && (Array.isArray(testing) ? testing.length > 0 : !!testing) && (
          <div className="ai-response__card ai-response__card--testing">
            <div className="ai-response__card-header">
              <FlaskConical size={14} className="text-purple-light" />
              <span>Testing & Lab Protocol</span>
            </div>
            {Array.isArray(testing) ? (
              <ul className="ai-response__list">
                {testing.map((t, i) => (
                  <li key={i} className="ai-response__list-item">
                    <FlaskConical size={13} className="text-purple-light flex-shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ai-response__card-text">{testing}</p>
            )}
          </div>
        )}

        {/* Certification Process */}
        {certification && (Array.isArray(certification) ? certification.length > 0 : !!certification) && (
          <div className="ai-response__card ai-response__card--certification">
            <div className="ai-response__card-header">
              <Award size={14} className="text-warning" />
              <span>Certification Pathway</span>
            </div>
            {Array.isArray(certification) ? (
              <ul className="ai-response__list">
                {certification.map((c, i) => (
                  <li key={i} className="ai-response__list-item">
                    <Award size={13} className="text-warning flex-shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ai-response__card-text">{certification}</p>
            )}
          </div>
        )}

        {/* Consumer & Buyer Safety Precautions */}
        {precautions && precautions.length > 0 && (
          <div className="ai-response__card ai-response__card--precautions">
            <div className="ai-response__card-header">
              <Shield size={14} className="text-cyan" />
              <span>Consumer &amp; Buyer Safety Precautions</span>
            </div>
            <ul className="ai-response__list">
              {precautions.map((p, i) => {
                const text = typeof p === 'string' ? p : p.text;
                return (
                  <li key={i} className="ai-response__list-item">
                    <CheckCircle size={13} className="text-cyan flex-shrink-0" />
                    <span>{renderInlineMarkdown(text)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Official Sources & References */}
      {sources && sources.length > 0 && (
        <div className="ai-response__sources-section">
          <button
            className="ai-response__sources-toggle-btn"
            onClick={() => setSourcesExpanded(!sourcesExpanded)}
            aria-expanded={sourcesExpanded}
          >
            <div className="flex items-center gap-2">
              <ExternalLink size={13} />
              <span>Official Regulatory Sources & References ({sources.length})</span>
            </div>
            {sourcesExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {sourcesExpanded && (
            <div className="ai-response__sources-grid animate-fade-in">
              {sources.map((source, i) => {
                const docName = source.document || source.title || 'BIS Standard Document';
                const isPdf = !!source.document || (docName && docName.toLowerCase().endsWith('.pdf'));
                return (
                  <div key={i} className="ai-response__source-box">
                    <div className="flex items-center justify-between gap-2">
                      <span className="badge badge-muted text-xs">
                        {isPdf ? (source.domain || 'PDF Document') : (source.source_type || 'Official Portal')}
                      </span>
                      {source.similarity && (
                        <span className="text-xs font-semibold text-blue-light">
                          {Math.round(source.similarity * 100)}% match
                        </span>
                      )}
                      {!source.similarity && (
                        <span className="ai-response__source-domain">{source.domain || 'bis.gov.in'}</span>
                      )}
                    </div>
                    <div className="ai-response__source-box-title flex items-center gap-1.5 mt-1">
                      {isPdf && <FileText size={13} className="text-blue-light flex-shrink-0" />}
                      <span className="truncate">{docName}</span>
                    </div>
                    {(source.standard || source.section || source.page) && (
                      <div className="flex flex-wrap gap-2 text-xs text-secondary mt-1">
                        {source.standard && <span className="font-semibold text-primary">{source.standard}</span>}
                        {source.section && <span>• {source.section}</span>}
                        {source.page && <span className="badge badge-subtle text-xs">Page {source.page}</span>}
                      </div>
                    )}
                    {source.relevance && (
                      <p className="ai-response__source-box-desc">{source.relevance}</p>
                    )}
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-secondary btn-sm ai-response__source-link"
                      >
                        <ExternalLink size={11} /> Open Portal
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
