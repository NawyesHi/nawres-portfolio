import { useState, useEffect } from 'react';
import './Footer.css';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const tunisiaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Tunis',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date());

      setTime(tunisiaTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__logo">
          <span className="footer__logo-accent">+</span>
          <span>Nawres Hidri</span>
        </div>

        <div className="footer__status-pill">
          <div className="footer__location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Tunisia</span>
          </div>
          <div className="footer__divider"></div>
          <div className="footer__clock">
            <span className="live-indicator"></span>
            <span className="time-text">{time ? `${time} (GMT+1)` : 'Loading time...'}</span>
          </div>
        </div>

        <div className="footer__links">
          <a href="https://github.com/NawyesHi" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/hidri-nawres/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://www.instagram.com/nawres.hidrii/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
