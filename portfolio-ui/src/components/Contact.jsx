import { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // FormSubmit sends real emails directly to your address via AJAX!
      const response = await fetch('https://formsubmit.co/ajax/nawreshidri796@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`,
          _template: 'table',
        }),
      });

      const data = await response.json();
      if (response.ok || data.success === 'true') {
        setStatus('sent');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section contact">
      {/* Background decoration */}
      <div className="contact__bg-deco" aria-hidden="true">
        <div className="contact__bg-circle contact__bg-circle--1" />
        <div className="contact__bg-circle contact__bg-circle--2" />
      </div>

      <div className="contact__inner">
        {/* Left info column */}
        <motion.div
          className="contact__info"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">
            Let's build something<br />
            <span className="gradient-text">remarkable.</span>
          </h2>
          <p className="contact__desc">
            Have a project in mind or want to collaborate? Send me a message directly using the form, and I will receive it directly in my Gmail inbox!
          </p>

          <div className="contact__details">
            <a href="mailto:nawreshidri796@gmail.com" className="contact__detail-item">
              <div className="contact__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <span className="contact__detail-label">Email</span>
                <span className="contact__detail-value">nawreshidri796@gmail.com</span>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/hidri-nawres/" target="_blank" rel="noopener noreferrer" className="contact__detail-item">
              <div className="contact__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
              <div>
                <span className="contact__detail-label">LinkedIn</span>
                <span className="contact__detail-value">hidri-nawres</span>
              </div>
            </a>
            <a href="https://github.com/NawyesHi" target="_blank" rel="noopener noreferrer" className="contact__detail-item">
              <div className="contact__detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </div>
              <div>
                <span className="contact__detail-label">GitHub</span>
                <span className="contact__detail-value">NawyesHi</span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Right form column */}
        <motion.div
          className="contact__card"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {status === 'sent' ? (
            <div className="contact__success">
              <div className="contact__success-icon">✓</div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out! Your message has been sent directly to nawreshidri796@gmail.com. I will reply soon.</p>
              <button className="contact__submit" style={{ marginTop: '1.5rem' }} onClick={() => setStatus('idle')}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__form-header">
                <h3>Send a Message</h3>
                <p>Direct email delivery to nawreshidri796@gmail.com</p>
              </div>
              <div className="contact__row">
                <div className="contact__field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact__field">
                  <label htmlFor="email">Your Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="contact__field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {status === 'error' && (
                <p className="contact__error">
                  ⚠ Could not send automatically. Please email directly to nawreshidri796@gmail.com
                </p>
              )}

              <button type="submit" className="contact__submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>Sending Email... <span className="contact__spinner" /></>
                ) : (
                  <>
                    Send Message
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
