import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
} from 'framer-motion';
import './ProjectCard.css';

/* ── Detect prefers-reduced-motion ── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const h = (e) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}

export default function ProjectCard({ project, isFeatured = false, staggerDelay = 0 }) {
  const cardRef       = useRef(null);
  const [count, setCount] = useState(0);
  const reduced       = usePrefersReducedMotion();
  const targetCount   = parseInt(project.id, 10);

  /* ── Animated number counter ── */
  useEffect(() => {
    if (reduced) { setCount(targetCount); return; }
    const t = setTimeout(() => {
      const ctrl = animate(0, targetCount, {
        duration: 0.85,
        ease: 'easeOut',
        onUpdate: (v) => setCount(Math.round(v)),
      });
      return () => ctrl.stop();
    }, staggerDelay * 1000 + 500);
    return () => clearTimeout(t);
  }, [targetCount, staggerDelay, reduced]);

  /* ── Spring-based 3D tilt values ── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 280, damping: 38 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), cfg);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), cfg);

  /* ── Parallax image ── */
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [-13, 13]), cfg);
  const imgY = useSpring(useTransform(my, [-0.5, 0.5], [-9, 9]), cfg);

  /* ── Cursor glow spot ── */
  const glowL = useTransform(mx, [-0.5, 0.5], ['10%', '90%']);
  const glowT = useTransform(my, [-0.5, 0.5], ['10%', '90%']);

  const onMove = useCallback((e) => {
    if (!cardRef.current || reduced) return;
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mx, my, reduced]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <div
      ref={cardRef}
      className={`pcard${isFeatured ? ' pcard--featured' : ''}`}
      style={{ '--card-accent': project.accentColor }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Cursor-tracking glow blob */}
      {!reduced && (
        <motion.div
          className="pcard__glow-spot"
          style={{ left: glowL, top: glowT }}
          aria-hidden="true"
        />
      )}

      {/* Ambient aura (CSS hover) */}
      <div className="pcard__aura" aria-hidden="true" />

      {/* ── Tilt layer (Framer Motion) ─────────────────────── */}
      <motion.div
        className="pcard__tilt"
        style={reduced ? {} : { rotateX: rotX, rotateY: rotY }}
      >
        {/* ── Flip layer (CSS :hover) ───────────────────────── */}
        <div className="pcard__inner">

          {/* ════ FRONT ════ */}
          <div className="pcard__face pcard__front">
            {/* Parallax image container */}
            <motion.div
              className="pcard__img-wrap"
              style={reduced ? {} : { x: imgX, y: imgY }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="pcard__img"
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/600x500/111/fff?text=' +
                    encodeURIComponent(project.title);
                }}
              />
            </motion.div>

            {/* Gradient overlays */}
            <div className="pcard__grad-base"  aria-hidden="true" />
            <div className="pcard__grad-hover" aria-hidden="true" />

            {/* Text content */}
            <div className="pcard__content">
              {/* Number badge */}
              <div className="pcard__badge">
                <span className="pcard__badge-num">
                  {String(count).padStart(2, '0')}
                </span>
                <span className="pcard__badge-line" aria-hidden="true" />
              </div>

              {/* Bottom info */}
              <div className="pcard__bottom">
                <span className="pcard__sub">{project.subtitle}</span>
                <h3 className="pcard__title">{project.title}</h3>
                <motion.span
                  className="pcard__cta"
                  aria-hidden="true"
                  animate={reduced ? {} : { x: [0, 6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Hover to explore →
                </motion.span>
              </div>
            </div>
          </div>

          {/* ════ BACK ════ */}
          <div className="pcard__face pcard__back">
            {/* Big watermark number */}
            <div className="pcard__watermark" aria-hidden="true">{project.id}</div>

            <div className="pcard__back-body">
              <span className="pcard__back-sub">{project.subtitle}</span>
              <h4 className="pcard__back-title">{project.title}</h4>
              <p className="pcard__back-desc">{project.desc}</p>
            </div>

            <div className="pcard__back-footer">
              <div className="pcard__tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="pcard__tag">{tag}</span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pcard__discover"
              >
                View Project
                <svg
                  width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>

        </div>{/* /pcard__inner */}
      </motion.div>{/* /pcard__tilt */}
    </div>
  );
}
