'use client';

import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';

interface SnowDriftProps {
  className?: string;
  variant?: 'top' | 'bottom' | 'both';
  color?: string;
  flip?: boolean;
}

export function SnowDrift({
  className,
  variant = 'bottom',
  color = 'fill-white',
  flip = false,
}: SnowDriftProps): ReactElement {
  const driftPath = flip
    ? 'M0,64 C80,20 160,100 320,50 C480,0 560,80 640,40 C720,0 800,60 960,30 C1120,0 1200,50 1280,20 C1360,-10 1440,40 1440,40 L1440,128 L0,128 Z'
    : 'M0,64 C120,100 200,20 320,60 C440,100 520,30 640,70 C760,110 880,40 960,80 C1040,120 1160,50 1280,90 C1400,130 1440,80 1440,80 L1440,128 L0,128 Z';

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {(variant === 'top' || variant === 'both') && (
        <svg
          viewBox="0 0 1440 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 w-full h-auto transform rotate-180"
          preserveAspectRatio="none"
        >
          <path d={driftPath} className={color} />
        </svg>
      )}
      {(variant === 'bottom' || variant === 'both') && (
        <svg
          viewBox="0 0 1440 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full h-auto"
          preserveAspectRatio="none"
        >
          <path d={driftPath} className={color} />
        </svg>
      )}
    </div>
  );
}

// Wavy section divider
interface WavyDividerProps {
  className?: string;
  color?: string;
  height?: number;
}

export function WavyDivider({
  className,
  color = 'fill-white',
  height = 80,
}: WavyDividerProps): ReactElement {
  return (
    <div className={cn('relative w-full', className)} style={{ height }}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Multiple layered waves for depth */}
        <path
          d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z"
          className={cn(color, 'opacity-30')}
        />
        <path
          d="M0,90 C180,50 360,110 540,70 C720,30 900,100 1080,60 C1260,20 1440,90 1440,90 L1440,120 L0,120 Z"
          className={cn(color, 'opacity-50')}
        />
        <path
          d="M0,100 C160,70 320,110 480,85 C640,60 800,105 960,80 C1120,55 1280,95 1440,70 L1440,120 L0,120 Z"
          className={color}
        />
      </svg>
    </div>
  );
}

// Torn paper edge effect
interface TornEdgeProps {
  className?: string;
  color?: string;
  position?: 'top' | 'bottom';
}

export function TornEdge({
  className,
  color = 'fill-white',
  position = 'bottom',
}: TornEdgeProps): ReactElement {
  // Irregular torn paper path
  const tornPath = 'M0,0 L20,15 L35,5 L50,20 L70,8 L90,18 L110,3 L130,22 L150,10 L170,25 L190,12 L210,20 L230,5 L250,18 L270,8 L290,22 L310,15 L330,25 L350,10 L370,20 L390,5 L410,18 L430,12 L450,22 L470,8 L490,20 L510,15 L530,25 L550,10 L570,18 L590,5 L610,22 L630,12 L650,20 L670,8 L690,18 L710,15 L730,25 L750,10 L770,20 L790,5 L810,22 L830,12 L850,18 L870,8 L890,20 L910,15 L930,25 L950,10 L970,18 L990,5 L1010,22 L1030,12 L1050,20 L1070,8 L1090,18 L1110,15 L1130,25 L1150,10 L1170,20 L1190,5 L1210,22 L1230,12 L1250,18 L1270,8 L1290,20 L1310,15 L1330,25 L1350,10 L1370,18 L1390,5 L1410,22 L1430,12 L1440,20 L1440,40 L0,40 Z';

  return (
    <div className={cn('relative w-full h-10', className)}>
      <svg
        viewBox="0 0 1440 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'absolute left-0 w-full h-full',
          position === 'top' ? 'top-0 rotate-180' : 'bottom-0'
        )}
        preserveAspectRatio="none"
      >
        <path d={tornPath} className={color} />
      </svg>
    </div>
  );
}
