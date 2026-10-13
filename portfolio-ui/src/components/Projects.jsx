import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  MousePointer2,
  MessageCircle,
  ScanFace,
  Gamepad2,
  BookOpen,
} from 'lucide-react';
import ShapeGrid from './ShapeGrid';
import MyProcess from './MyProcess';
import { MorphingCardStack } from './MorphingCardStack';
import './Projects.css';

import mouseImg     from '../assets/projects/mouse.png';
import chatlinaImg  from '../assets/projects/chatlina.jpeg';
import detectionImg from '../assets/projects/object_detection.png';
import gameImg      from '../assets/projects/boundles.PNG';
import courseImg    from '../assets/projects/connect_courses.png';

/* ── Project data for the card stack ── */
const projectCards = [
  {
    id: '01',
    title: 'AI Mouse Controller',
    description: 'Control your mouse cursor effortlessly using live webcam hand gestures, with a simple pinch to click.',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI'],
    link: 'https://github.com/NawyesHi',
    image: mouseImg,
    icon: <MousePointer2 size={20} />,
    subtitle: 'COMPUTER VISION • PYTHON',
  },
  {
    id: '02',
    title: 'ChatLina',
    description: 'An Android messaging app featuring secure authentication and real-time friend management.',
    tags: ['Java', 'Android', 'SQLite'],
    link: 'https://github.com/NawyesHi',
    image: chatlinaImg,
    icon: <MessageCircle size={20} />,
    subtitle: 'ANDROID • MESSAGING',
  },
  {
    id: '03',
    title: 'AI Detection System',
    description: 'A real-time AI model for facial recognition and object detection with instant web-based alerts.',
    tags: ['Python', 'Flask', 'YOLOv8', 'OpenCV'],
    link: 'https://github.com/NawyesHi',
    image: detectionImg,
    icon: <ScanFace size={20} />,
    subtitle: 'AI • RECOGNITION',
  },
  {
    id: '04',
    title: 'Boundless Night',
    description: 'An immersive game featuring procedural gameplay mechanics and a dynamic enemy wave system.',
    tags: ['Unity', 'C#', '2D Game'],
    isConfidential: true,
    confidentialText: 'Confidential • Company Code & Game',
    confidentialTooltip: 'Source code and game assets are confidential to the company I worked with',
    image: gameImg,
    icon: <Gamepad2 size={20} />,
    subtitle: 'GAME DEV • UNITY',
  },
  {
    id: '05',
    title: 'Connect-Courses',
    description: 'An online course platform featuring an AI chatbot and integrated Flouci API for secure payments.',
    tags: ['HTML', 'PHP', 'Bootstrap', 'Flouci API'],
    link: 'https://github.com/NawyesHi',
    image: courseImg,
    icon: <BookOpen size={20} />,
    subtitle: 'WEB DEV • E-LEARNING',
  },
];

/* ── Corner SVG (UIverse) ── */
const CornerSVG = () => (
  <svg
    className="why-corner"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-1 1 32 32"
    aria-hidden="true"
  >
    <path d="M32,32C14.355,32,0,17.645,0,0h.985c0,17.102,13.913,31.015,31.015,31.015v.985Z" />
  </svg>
);

/* ── Why Me Button ── */
function WhyMeButton({ active, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 18 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
      viewport={{ once: true }}
    >
      <div className="why-container">
        <div className="why-drawer why-drawer--top"  aria-hidden="true">Why choose me?</div>
        <div className="why-drawer why-drawer--bottom" aria-hidden="true">Find out more</div>

        <button
          type="button"
          className={`why-btn${active ? ' why-btn--active' : ''}`}
          aria-expanded={active}
          aria-controls="my-process"
          onClick={onClick}
        >
          <span className="why-btn__text">{active ? 'Close ↑' : 'Why Me'}</span>
        </button>

        <CornerSVG /><CornerSVG /><CornerSVG /><CornerSVG />
      </div>
    </motion.div>
  );
}

/* ── Section header entrance variants ── */
const headerVariants = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/* ── Main Projects section ── */
export default function Projects() {
  const [isDesktop,   setIsDesktop]   = useState(false);
  const [showProcess, setShowProcess] = useState(false);
  const sectionRef = useRef(null);
  const processRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headerY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    setIsDesktop(mq.matches);
    const h = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (!showProcess) return;
    const t = setTimeout(() => {
      processRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 140);
    return () => clearTimeout(t);
  }, [showProcess]);

  return (
    <section id="projects" className="section projects-section" ref={sectionRef}>

      {/* Background grid */}
      <div className="projects-shapegrid-container">
        {isDesktop && (
          <ShapeGrid
            speed={0.1}
            squareSize={56}
            direction="diagonal"
            borderColor="rgba(217, 38, 53, 0.13)"
            hoverFillColor="#d92635"
            shape="square"
            hoverTrailAmount={0}
          />
        )}
      </div>

      <div className="projects-header-wrapper">
        <div className="projects-inner">

          {/* ── Section header ── */}
          <motion.div className="projects__header" style={{ y: headerY }}>
            <motion.div
              variants={headerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-50px' }}
              className="projects__header-copy"
            >
              <p className="section-label">Selected Work</p>
              <h2 className="section-title">
                Things I've <span className="gradient-text">built</span>
              </h2>
              <p className="projects__lede">
                Products at the intersection of software and AI — from computer
                vision to full-stack platforms.
              </p>
            </motion.div>

            <WhyMeButton active={showProcess} onClick={() => setShowProcess((v) => !v)} />
          </motion.div>

          {/* ── My Process panel ── */}
          <AnimatePresence initial={false}>
            {showProcess && (
              <motion.div
                id="my-process"
                ref={processRef}
                className="projects__process"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <MyProcess />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Morphing Card Stack ── */}
          <motion.div
            className="projects__stack-wrapper"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <MorphingCardStack
              cards={projectCards}
              defaultLayout="stack"
              onCardClick={(card) => console.log('Card clicked:', card.title)}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
