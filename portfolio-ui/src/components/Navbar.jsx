import { useState, useEffect } from 'react';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOnHero, setIsOnHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);

      // Detect if we're over the dark hero section
      const heroEl = document.getElementById('home');
      if (heroEl) {
        const heroHeight = heroEl.offsetHeight;
        setIsOnHero(scrollY < heroHeight - 80);
      }

      // Accurate section tracking using viewport bounds
      const sections = [
        { id: 'home', link: 'home' },
        { id: 'about', link: 'about' },
        { id: 'projects', link: 'projects' },
        { id: 'contact', link: 'contact' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If section top is within upper viewport area (e.g. top <= 300)
          if (rect.top <= 300) {
            setActiveSection(sections[i].link);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navClasses = [
    'navbar',
    scrolled ? 'navbar--scrolled' : '',
    isOnHero && !scrolled ? 'navbar--hero' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <nav className={navClasses}>
        <div className="navbar__left">
          <a href="#home" className="navbar__logo" onClick={(e) => handleNavClick(e, '#home')}>
            <img src="/NH.png" alt="NH Logo" className="navbar__logo-image" />
            <span className="navbar__logo-name">Nawres Hidri</span>
            <span className="navbar__logo-divider">/</span>
            <span className="navbar__logo-title">DEVELOPER</span>
          </a>
        </div>

        <div className="navbar__center">
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={activeSection === link.href.replace('#', '') ? 'navbar__link--active' : ''}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar__right">


          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul>
          {navLinks.map((link, i) => (
            <li key={link.label} style={{ transitionDelay: menuOpen ? `${i * 80 + 150}ms` : '0ms' }}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                <span className="navbar__mobile-num">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="navbar__mobile-footer">
          <a href="https://github.com/NawyesHi" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/hidri-nawres/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/nawres.hidrii/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </>
  );
}
