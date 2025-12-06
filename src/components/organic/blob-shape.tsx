'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface BlobShapeProps {
  className?: string;
  color?: string;
  animate?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 1 | 2 | 3 | 4 | 5;
}

// Different organic blob paths
const blobPaths = {
  1: 'M44.5,-76.3C57.5,-69.1,67.8,-56.9,75.2,-43.1C82.6,-29.3,87.1,-14.7,86.4,-0.4C85.7,13.9,79.8,27.7,71.5,39.8C63.2,51.9,52.5,62.2,39.8,69.5C27.1,76.8,12.5,81.1,-2.3,84.8C-17.1,88.5,-34.2,91.6,-47.8,85.1C-61.4,78.6,-71.5,62.5,-78.1,45.7C-84.7,28.9,-87.8,11.4,-85.9,-5.1C-84,-21.6,-77.1,-37.2,-66.5,-49.4C-55.9,-61.6,-41.6,-70.4,-26.8,-76.3C-12,-82.2,3.3,-85.2,18.3,-82.8C33.3,-80.4,48,-83.6,44.5,-76.3Z',
  2: 'M39.3,-67.5C50.9,-60.5,60.2,-49.7,67.3,-37.3C74.4,-24.9,79.3,-10.9,79.1,3.1C78.9,17.1,73.6,31.1,65.1,43.1C56.6,55.1,44.9,65.1,31.5,71.5C18.1,77.9,3,80.7,-12.8,79.8C-28.6,78.9,-45.1,74.3,-57.3,64.4C-69.5,54.5,-77.4,39.3,-81.1,23.1C-84.8,6.9,-84.3,-10.3,-78.5,-25.3C-72.7,-40.3,-61.6,-53.1,-48.2,-59.4C-34.8,-65.7,-19.1,-65.5,-3.3,-60.5C12.5,-55.5,27.7,-45.7,39.3,-67.5Z',
  3: 'M45.2,-77.8C58.1,-70.4,67.8,-57.5,74.8,-43.3C81.8,-29.1,86.1,-13.6,85.3,1.5C84.5,16.6,78.6,31.3,69.9,44.1C61.2,56.9,49.7,67.8,36.1,74.5C22.5,81.2,6.8,83.7,-8.4,82.1C-23.6,80.5,-38.3,74.8,-50.8,66C-63.3,57.2,-73.6,45.3,-79.4,31.5C-85.2,17.7,-86.5,2,-83.2,-12.5C-79.9,-27,-72,-40.3,-61.1,-50.3C-50.2,-60.3,-36.3,-67,-22.3,-73.6C-8.3,-80.2,5.8,-86.7,19.9,-85.4C34,-84.1,48.1,-75.1,45.2,-77.8Z',
  4: 'M42.7,-73.4C55.3,-66.8,65.4,-55.2,72.5,-42.1C79.6,-29,83.7,-14.5,83.5,-0.1C83.3,14.3,78.8,28.5,71.3,41.1C63.8,53.7,53.3,64.7,40.6,71.8C27.9,78.9,13.1,82.1,-1.7,84.9C-16.5,87.7,-33,90.1,-46.3,84.1C-59.6,78.1,-69.7,63.7,-76.4,48.3C-83.1,32.9,-86.4,16.4,-85.3,0.6C-84.2,-15.2,-78.7,-30.5,-70.1,-43.4C-61.5,-56.3,-49.8,-66.8,-36.6,-73C-23.4,-79.2,-8.7,-81.1,3.5,-77.1C15.7,-73.1,30.1,-63.2,42.7,-73.4Z',
  5: 'M38.9,-67.3C50.1,-60.2,58.7,-49.2,65.5,-37C72.3,-24.8,77.3,-11.4,77.4,2C77.5,15.4,72.7,28.8,65.1,40.7C57.5,52.6,47.1,63,34.6,69.8C22.1,76.6,7.5,79.8,-6.9,79.4C-21.3,79,-35.5,75,-47.4,67C-59.3,59,-68.9,47,-74.5,33.3C-80.1,19.6,-81.7,4.2,-79.1,-10.3C-76.5,-24.8,-69.7,-38.4,-59.5,-48.8C-49.3,-59.2,-35.7,-66.4,-22,-70.9C-8.3,-75.4,5.5,-77.2,18.7,-75.1C31.9,-73,47.5,-67,38.9,-67.3Z',
};

const sizes = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-96 h-96',
};

export function BlobShape({
  className,
  color = 'fill-red-200/30',
  animate = true,
  size = 'lg',
  variant = 1,
}: BlobShapeProps): ReactElement {
  return (
    <motion.div
      className={cn('absolute pointer-events-none', sizes[size], className)}
      animate={animate ? {
        scale: [1, 1.05, 0.95, 1],
        rotate: [0, 5, -5, 0],
      } : undefined}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d={blobPaths[variant]}
          transform="translate(100 100)"
          className={color}
        />
      </svg>
    </motion.div>
  );
}

// Multiple floating blobs for backgrounds
interface FloatingBlobsProps {
  className?: string;
}

export function FloatingBlobs({ className }: FloatingBlobsProps): ReactElement {
  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <BlobShape
        variant={1}
        size="xl"
        color="fill-red-200/20"
        className="-top-20 -left-20"
      />
      <BlobShape
        variant={2}
        size="lg"
        color="fill-green-200/20"
        className="top-1/4 -right-10"
      />
      <BlobShape
        variant={3}
        size="md"
        color="fill-amber-200/20"
        className="bottom-1/3 left-1/4"
      />
      <BlobShape
        variant={4}
        size="lg"
        color="fill-blue-200/15"
        className="-bottom-10 right-1/4"
      />
    </div>
  );
}
