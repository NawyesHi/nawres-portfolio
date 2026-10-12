import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef();
  const videoRef = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 2,
        y: (e.clientY / innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const openVideo = () => {
    setIsVideoOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 100);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.18, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const particles = Array.from({ length: 15 });

  return (
    <section id="home" className="hero" ref={heroRef}>

      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            className="hero__video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="hero__modal-close" onClick={closeVideo}>✕</button>
            <div className="hero__modal-content">
              <video
                ref={videoRef}
                src="/Intro_nawyes.mp4"
                className="hero__modal-video"
                controls
                playsInline
                autoPlay
              />
            </div>
            <div className="hero__modal-backdrop" onClick={closeVideo} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hero__background">
      </div>

      <div className="hero__particles">
        {particles.map((_, i) => (
          <div key={i} className="hero__particle" />
        ))}
      </div>

      {/* ── Layer 1: Giant name SOLID (Behind Portrait) ── */}
      <div
        className="hero__name-layer hero__name-layer--back"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * -8}px), calc(-50% + ${mousePos.y * -5}px))`,
        }}
      >
        <span className="hero__name-solid">NAWRES</span>
      </div>

      {/* ── Layer 2: Portrait image (Sandwiched) ── */}
      <motion.div
        className="hero__portrait-layer"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.25 }}
        style={{
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 8}px)`,
        }}
      >
        <div className="hero__portrait-frame">
          <img
            src="/nawres.png"
            alt="Nawres Hidri"
            className="hero__portrait-img"
          />
          <div className="hero__portrait-fade" />
          <button className="hero__floating-play-btn" onClick={openVideo}>
            <div className="hero__play-circle">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="hero__play-text">PLAY REEL</span>
          </button>
        </div>
      </motion.div>

      {/* ── Layer 3: Giant name OUTLINE (In Front of Portrait) ── */}
      <div
        className="hero__name-layer hero__name-layer--front"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * -8}px), calc(-50% + ${mousePos.y * -5}px))`,
        }}
      >
        <span className="hero__name-outline">NAWRES</span>
      </div>

      {/* ── Layer 4: Foreground Content ── */}
      <div className="hero__content-layer">
        <div className="hero__content-left">
          <motion.div
            className="hero__role-tag"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="hero__role-dot" />
            FREELANCER
          </motion.div>

          <motion.p
            className="hero__intro"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Crafting digital experiences with precision
            and purpose — where <em>engineering meets artistry</em>.
          </motion.p>

          <motion.div
            className="hero__cta-group"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <a href="#projects" className="hero__cta-primary">
              View My Work
              <span className="hero__cta-arrow">→</span>
            </a>
            <a href="#contact" className="hero__cta-secondary">
              Get In Touch
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="hero__scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">SCROLL</span>
      </motion.div>
    </section>
  );
}
