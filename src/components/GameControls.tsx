'use client';

import React from 'react';

interface GameControlsProps {
  isVisible: boolean;
}

export default function GameControls({ isVisible }: GameControlsProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute z-30 space-y-4" style={{ 
      bottom: '200px', 
      left: 'calc(50% - 480px - 30px)' 
    }}>
      {/* Movement Controls */}
      <div className="glassmorphic-panel">
        <h3 className="text-white/90 text-sm font-medium mb-3 uppercase tracking-wider">
          Movement
        </h3>
        <div className="flex justify-center gap-2">
          {/* Arrow Keys */}
          <div className="flex flex-col items-center gap-1">
            {/* Up Arrow */}
            <div className="key key-arrow-up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18,15 12,9 6,15"></polyline>
              </svg>
            </div>
            {/* Left and Right Arrows */}
            <div className="flex gap-1">
              <div className="key key-arrow-left">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </div>
              <div className="key key-arrow-right">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </div>
            </div>
            {/* Down Arrow */}
            <div className="key key-arrow-down">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Jump Control */}
      <div className="glassmorphic-panel">
        <h3 className="text-white/90 text-sm font-medium mb-3 uppercase tracking-wider text-center">
          Jump
        </h3>
        <div className="flex justify-center">
          <div className="key key-spacebar">
            <span className="text-xs font-mono">SPACE</span>
          </div>
        </div>
      </div>

      {/* Life Control */}
      <div className="glassmorphic-panel">
        <h3 className="text-white/90 text-sm font-medium mb-3 uppercase tracking-wider text-center">
          Add Life
        </h3>
        <div className="flex justify-center">
          <div className="key key-letter">
            <span className="text-sm font-bold">T</span>
          </div>
        </div>
      </div>

      {/* Subtract Life Control */}
      <div className="glassmorphic-panel">
        <h3 className="text-white/90 text-sm font-medium mb-3 uppercase tracking-wider text-center">
          Subtract Life
        </h3>
        <div className="flex justify-center">
          <div className="key key-letter">
            <span className="text-sm font-bold">E</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glassmorphic-panel {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .key {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .key:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .key:active {
          transform: translateY(0);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }

        .key-arrow-up {
          width: 32px;
          height: 20px;
          margin: 0 auto 2px;
        }

        .key-arrow-left,
        .key-arrow-right {
          width: 32px;
          height: 20px;
        }

        .key-arrow-down {
          width: 32px;
          height: 20px;
          margin: 2px auto 0;
        }

        .key-spacebar {
          width: 80px;
          height: 24px;
        }

        .key-letter {
          width: 32px;
          height: 32px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
