'use client';

import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getChristmasCountdown(): CountdownTime {
  const now = new Date();
  const christmas = new Date(now.getFullYear(), 11, 25); // December 25

  // If Christmas has passed this year, use next year
  if (now > christmas) {
    christmas.setFullYear(christmas.getFullYear() + 1);
  }

  const diff = christmas.getTime() - now.getTime();

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

interface CountdownUnitProps {
  value: number;
  label: string;
}

function CountdownUnit({ value, label }: CountdownUnitProps): ReactElement {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div
        key={value}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg"
      >
        <span className="text-2xl md:text-3xl font-bold text-white">
          {value.toString().padStart(2, '0')}
        </span>
      </motion.div>
      <span className="text-xs md:text-sm font-medium text-white/80 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}

interface ChristmasCountdownProps {
  className?: string;
}

export function ChristmasCountdown({
  className = '',
}: ChristmasCountdownProps): ReactElement {
  // Initialize with current countdown value
  const [countdown, setCountdown] = useState<CountdownTime>(() => getChristmasCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getChristmasCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!countdown) {
    return <div className={`h-24 ${className}`} />;
  }

  return (
    <div className={`text-center ${className}`}>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg md:text-xl font-semibold text-white mb-4"
      >
        Christmas Countdown
      </motion.p>
      <div className="flex gap-3 md:gap-4 justify-center">
        <CountdownUnit value={countdown.days} label="Days" />
        <div className="flex items-center text-white/60 text-2xl font-bold">:</div>
        <CountdownUnit value={countdown.hours} label="Hours" />
        <div className="flex items-center text-white/60 text-2xl font-bold">:</div>
        <CountdownUnit value={countdown.minutes} label="Mins" />
        <div className="flex items-center text-white/60 text-2xl font-bold">:</div>
        <CountdownUnit value={countdown.seconds} label="Secs" />
      </div>
    </div>
  );
}
