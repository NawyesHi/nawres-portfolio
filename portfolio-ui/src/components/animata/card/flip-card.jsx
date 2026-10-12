import React from 'react';
import './FlipCard.css';

export default function FlipCard({ frontContent, backContent }) {
    return (
        <div className="flip-card-container">
            <div className="flip-card-inner">

                {/* Face Avant (Image + Titre) */}
                <div className="flip-card-front">
                    {frontContent}
                </div>

                {/* Face Arrière (Description + Bouton) */}
                <div className="flip-card-back">
                    {backContent}
                </div>

            </div>
        </div>
    );
}