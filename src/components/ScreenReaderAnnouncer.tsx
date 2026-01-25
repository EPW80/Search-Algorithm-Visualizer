import React, { useEffect, useRef } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  message,
  politeness = 'polite'
}) => {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && announcerRef.current) {
      // Clear and set the message to ensure it's announced
      announcerRef.current.textContent = '';
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    />
  );
};

// Global announcer hook for use throughout the app
let globalAnnouncerCallback: ((message: string, politeness?: 'polite' | 'assertive') => void) | null = null;

export const useScreenReaderAnnouncer = () => {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (globalAnnouncerCallback) {
      globalAnnouncerCallback(message, politeness);
    }
  };

  return { announce };
};

export const GlobalScreenReaderAnnouncer: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [politeness, setPoliteness] = React.useState<'polite' | 'assertive'>('polite');

  useEffect(() => {
    globalAnnouncerCallback = (msg: string, pol: 'polite' | 'assertive' = 'polite') => {
      setMessage(msg);
      setPoliteness(pol);
    };

    return () => {
      globalAnnouncerCallback = null;
    };
  }, []);

  return <ScreenReaderAnnouncer message={message} politeness={politeness} />;
};
