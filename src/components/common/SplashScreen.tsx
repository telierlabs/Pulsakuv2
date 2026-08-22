import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 1800,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    // Start blur transition to sharp after a moment
    const blurTimer = setTimeout(() => {
      setIsBlurred(false);
    }, 150);

    // Start fade out before duration ends
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, durationMs - 400);

    // Completely finish after duration
    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, durationMs);

    return () => {
      clearTimeout(blurTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [durationMs, onFinish]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      id="app-splash-screen"
    >
      {/* Center Minimal Typography with Blur-in Animation */}
      <div className="flex flex-col items-center justify-center text-center px-4 select-none">
        <h1 
          className={`text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 transition-all duration-700 ease-out transform ${
            isBlurred 
              ? 'blur-md opacity-20 scale-95' 
              : 'blur-0 opacity-100 scale-100'
          }`}
        >
          pulsaku
        </h1>
      </div>
    </div>
  );
};

