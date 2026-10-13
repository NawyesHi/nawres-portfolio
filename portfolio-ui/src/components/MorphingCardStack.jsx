import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Layers,
  Grid3X3,
  LayoutList,
  Lock,
  MousePointer2,
  MessageCircle,
  ScanFace,
  Gamepad2,
  BookOpen,
} from 'lucide-react';
import './MorphingCardStack.css';

const SWIPE_THRESHOLD = 50;

const layoutIcons = {
  stack: Layers,
  grid:  Grid3X3,
  list:  LayoutList,
};

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function MorphingCardStack({
  cards = [],
  defaultLayout = 'stack',
  onCardClick,
}) {
  const [layout,       setLayout]       = useState(defaultLayout);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [isDragging,   setIsDragging]   = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  if (!cards || cards.length === 0) return null;

  /* ── Drag/swipe ── */
  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;
    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((p) => (p + 1) % cards.length);
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((p) => (p - 1 + cards.length) % cards.length);
    }
    setIsDragging(false);
  };

  /* ── Build stack order: top card rendered last (highest z-index) ── */
  const getStackOrder = () => {
    const result = [];
    for (let i = 0; i < Math.min(cards.length, 4); i++) {
      const idx = (activeIndex + i) % cards.length;
      result.push({ ...cards[idx], stackPosition: i });
    }
    return result.reverse(); // top card last
  };

  /* ── Stack positioning per depth level ── */
  const stackStyle = (pos) => ({
    position: 'absolute',
    top:    pos * 8,
    left:   pos * 6,
    zIndex: 10 - pos,
    rotate: (pos - 1) * 2,
    scale:  1 - pos * 0.025,
  });

  const displayCards =
    layout === 'stack'
      ? getStackOrder()
      : cards.map((c, i) => ({ ...c, stackPosition: i }));

  return (
    <div className="mcs">

      {/* ── Toggle bar ── */}
      <div className="mcs__toggle" role="toolbar" aria-label="Card layout">
        {Object.entries(layoutIcons).map(([mode, Icon]) => (
          <button
            key={mode}
            className={cx('mcs__toggle-btn', layout === mode && 'mcs__toggle-btn--active')}
            onClick={() => { setLayout(mode); setExpandedCard(null); }}
            aria-label={`${mode} view`}
            aria-pressed={layout === mode}
          >
            <Icon size={17} strokeWidth={1.8} />
          </button>
        ))}
      </div>

      {/* ── Cards area ── */}
      <LayoutGroup>
        <motion.div
          layout
          className={cx(
            'mcs__cards',
            `mcs__cards--${layout}`,
          )}
        >
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const isTop      = layout === 'stack' && card.stackPosition === 0;
              const isExpanded = expandedCard === card.id;

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{
                    opacity: 1,
                    scale:   isExpanded ? 1.03 : 1,
                    ...(layout === 'stack' ? stackStyle(card.stackPosition) : { rotate: 0 }),
                  }}
                  exit={{ opacity: 0, scale: 0.85, x: -180 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}

                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.65}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: 'grabbing' }}

                  onClick={() => {
                    if (isDragging) return;
                    setExpandedCard(isExpanded ? null : card.id);
                    onCardClick?.(card);
                  }}

                  className={cx(
                    'mcs__card',
                    `mcs__card--${layout}`,
                    isTop       && 'mcs__card--top',
                    isExpanded  && 'mcs__card--expanded',
                  )}
                >

                  {/* Content */}
                  <div className="mcs__card-body">

                    {/* Icon */}
                    {card.icon && (
                      <div className="mcs__icon">{card.icon}</div>
                    )}

                    {/* Text */}
                    <div className="mcs__text">
                      <p className="mcs__id">{card.id}</p>
                      <h3 className="mcs__title">{card.title}</h3>
                      <p className="mcs__desc">{card.description}</p>

                      {/* Tags — always visible */}
                      {card.tags && (
                        <div className="mcs__tags">
                          {card.tags.map((t) => (
                            <span key={t} className="mcs__tag">{t}</span>
                          ))}
                        </div>
                      )}

                      {/* Link or Confidential notice — always visible */}
                      {card.isConfidential ? (
                        <div
                          className="mcs__link mcs__link--confidential"
                          title={card.confidentialTooltip || 'Source code and game assets are confidential to the company I worked with'}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Lock size={13} className="mcs__lock-icon" />
                          <span>{card.confidentialText || 'Confidential • Company Code & Game'}</span>
                        </div>
                      ) : card.link ? (
                        <a
                          href={card.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mcs__link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View on GitHub →
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Swipe hint — top stack card only */}
                  {isTop && <p className="mcs__hint">Swipe to navigate</p>}

                  {/* Subtle image accent (low opacity) */}
                  {card.image && layout !== 'list' && (
                    <div
                      className="mcs__img-accent"
                      style={{ backgroundImage: `url(${card.image})` }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* ── Dot navigation (stack only) ── */}
      {layout === 'stack' && cards.length > 1 && (
        <div className="mcs__dots" role="tablist" aria-label="Card navigation">
          {cards.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              className={cx('mcs__dot', i === activeIndex && 'mcs__dot--active')}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
