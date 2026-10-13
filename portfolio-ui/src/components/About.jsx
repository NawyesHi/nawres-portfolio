import { motion } from 'framer-motion';
import './About.css';

const skills = [
  { name: 'Python (Machine Learning / AI)', level: 95, category: 'AI & Data' },
  { name: 'Web (React,Angular,JS/JSP, Laravel,HTML/CSS,PHP)', level: 90, category: 'Full Stack' },
  { name: 'Java / Android (Java/XML)', level: 85, category: 'Mobile' },
  { name: 'C/C# & Unity (Video Games)', level: 85, category: 'Game Dev' },
  { name: 'Databases (MySQL, SQLite, NoSQL:MongoDB)', level: 80, category: 'Data Storage' },
  { name: 'Outils (Git, Kafka, Embedded systems)', level: 75, category: 'DevOps & Systems' },
];

const highlights = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 6v6l4 2" /></svg>
    ),
    title: 'AI Integration & Computer Vision',
    desc: 'YOLO, MediaPipe, OpenCV & DeepFace models, Pytorch, TensorFlow,Flask....'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
    ),
    title: 'Android & Web Dev',
    desc: 'Native Java, SQLite, PHP, Laravel & Modern Web'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    ),
    title: 'Game & Systems',
    desc: 'Unity 2D/C# & Embedded IoT Architectures'
  }
];

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="about__header">
        <p className="section-label">About Me & Expertise</p>
        <h2 className="section-title">
          Passionate about <span className="gradient-text">great software</span> & AI
        </h2>
      </div>

      <div className="about__grid">
        {/* Left Column: Bio & Core Highlights */}
        <motion.div
          className="about__left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="about__bio-card">
            <p className="about__text">
              I'm a computer engineering developer based in Tunisia, specializing in <strong>Artificial Intelligence, Mobile Apps, and Full-Stack Web Development</strong>.
            </p>
            <p className="about__text">
              I turn complex real-world problems into high-performance, elegant software solutions — ranging from real-time computer vision mouse controllers to native Android platforms and 2D procedural games.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="about__highlights">
            {highlights.map((item, idx) => (
              <div key={idx} className="highlight-card">
                <div className="highlight-icon">{item.icon}</div>
                <div className="highlight-content">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </motion.div>

        {/* Right Column: Framed Tech Stack Card */}
        <motion.div
          className="about__right"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="tech-stack-card">
            <div className="tech-stack-header">
              <h3>Technical Competencies</h3>
              <span className="tech-badge">Proficiency</span>
            </div>

            <div className="skills__list">
              {skills.map((skill, i) => (
                <div key={skill.name} className="skill">
                  <div className="skill__header">
                    <div className="skill__title-group">
                      <span className="skill__name">{skill.name}</span>
                    </div>
                    <span className="skill__percent">{skill.level}%</span>
                  </div>
                  <div className="skill__bar-bg">
                    <motion.div
                      className="skill__bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Massive Animated Social Grid (Full Width Horizontal) */}
      <div className="about__socials-massive">
        <span className="socials-label-large">
          <span className="socials-pulse-dot"></span> Let's Connect
        </span>

        <motion.div
          className="socials-grid-horizontal"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {[
            { name: 'GitHub', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>, href: 'https://github.com/NawyesHi', colorClass: 'github', desc: 'Code & Projects' },
            { name: 'LinkedIn', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>, href: 'https://www.linkedin.com/in/hidri-nawres/', colorClass: 'linkedin', desc: 'Professional Profile' },
            { name: 'Instagram', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>, href: 'https://www.instagram.com/nawres.hidrii/', colorClass: 'instagram', desc: 'Life & Behind Scenes' },
            { name: 'Email', icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, href: 'mailto:nawreshidri796@gmail.com', colorClass: 'mail', desc: 'Direct Contact' }
          ].map((social, idx) => (
            <motion.a
              key={social.name}
              href={social.href}
              target={social.name === 'Email' ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className={`social-massive-card ${social.colorClass}`}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: -20 },
                visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: 'spring', stiffness: 200, damping: 15 } }
              }}
              whileHover={{
                y: -8,
                scale: 1.05,
                rotateZ: idx % 2 === 0 ? 2 : -2,
                transition: { type: 'spring', stiffness: 400, damping: 12 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="massive-card-bg"></div>
              <div className="massive-icon-wrapper">
                <motion.div
                  className="massive-icon"
                  whileHover={{ scale: 1.2, rotate: 360, transition: { duration: 0.6 } }}
                >
                  {social.icon}
                </motion.div>
              </div>
              <div className="massive-card-content">
                <span className="massive-card-title">{social.name}</span>
                <span className="massive-card-desc">{social.desc}</span>
              </div>

              <div className="massive-card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
