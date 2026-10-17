/**
 * NotFoundPage View
 * 404 handler strictly adhering to DESIGN-renault.md:
 * - High-contrast stark presentation
 * - Single Sunlight Yellow CTA returning to directory
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { Button } from './components/Button.jsx';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 bg-surface-dark text-on-dark min-h-[600px] flex items-center justify-center py-20 px-4 sm:px-6 md:px-8 border-b border-divider-dark">
      <div className="max-w-md text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-xs border border-white/20 bg-surface-deep flex items-center justify-center text-primary mb-6">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-[12px] font-bold uppercase tracking-wider text-primary block mb-2">
          HTTP 404 Error
        </span>

        <h1 className="text-[48px] md:text-[56px] font-bold text-white leading-display tracking-tight mb-4">
          PAGE NOT FOUND
        </h1>

        <p className="text-[16px] text-on-dark-mute leading-relaxed mb-8">
          The requested service directory route or administrative panel does not exist or has been relocated.
        </p>

        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={() => navigate('/')}>
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="outline-light" size="md" onClick={() => navigate('/discover')}>
            <span>Browse Directory</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
