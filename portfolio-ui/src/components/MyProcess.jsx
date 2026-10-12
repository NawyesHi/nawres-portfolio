import { motion } from 'framer-motion';
import './MyProcess.css';

const steps = [
  {
    id: '01',
    title: 'Consultation & Requirements',
    kicker: 'Listen first',
    text: 'Every collaboration starts with a real conversation. I map your goals, users, and constraints so the brief is honest, the scope is clear, and we never build the wrong thing fast.',
  },
  {
    id: '02',
    title: 'Smart Architecture & Design',
    kicker: 'Think before we ship',
    text: 'I design systems that can grow with you — clean architecture, scalable data flow, and interfaces that feel inevitable. The foundation is solid before a single feature is rushed.',
  },
  {
    id: '03',
    title: 'Agile Implementation & AI Integration',
    kicker: 'Build in public cycles',
    text: 'You see progress in tight, visible sprints. Where AI genuinely amplifies the product — vision, language, automation — I integrate it with care, production discipline, and no hype.',
  },
  {
    id: '04',
    title: 'Deployment & Continuous Support',
    kicker: 'Stay after launch',
    text: 'Launch is the starting line. I ship with confidence, watch what matters, and remain in your corner so the product keeps getting sharper long after go-live.',
  },
];

const icons = {
  '01': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  '02': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  '03': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  '04': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2v8l3 3" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  ),
};

export default function MyProcess() {
  return (
    <div className="my-process">
      <div className="my-process__intro">
        <p className="section-label">How I work</p>
        <h3 className="my-process__heading">My process</h3>
        <p className="my-process__lede">
          A focused path from idea to production — built for founders and teams who want an AI &amp; software partner they can trust.
        </p>
      </div>

      <ol className="my-process__timeline">
        <span className="my-process__spine" aria-hidden="true" />

        {steps.map((step, index) => {
          const side = index % 2 === 0 ? 'left' : 'right';
          return (
            <motion.li
              key={step.id}
              className={`my-process__item my-process__item--${side}`}
              initial={{ opacity: 0, y: 36, x: side === 'left' ? -28 : 28 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <article className="my-process__card">
                <span className="my-process__kicker">{step.kicker}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </article>

              <div className="my-process__node" aria-hidden="true">
                <span className="my-process__icon">{icons[step.id]}</span>
                <span className="my-process__index">{step.id}</span>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <motion.a
        href="#contact"
        className="my-process__cta"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        Let's build together
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </motion.a>
    </div>
  );
}
