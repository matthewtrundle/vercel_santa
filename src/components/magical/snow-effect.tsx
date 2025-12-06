'use client';

import type { ReactElement } from 'react';
import Snowfall from 'react-snowfall';

interface SnowEffectProps {
  snowflakeCount?: number;
  className?: string;
}

export function SnowEffect({
  snowflakeCount = 100,
  className = '',
}: SnowEffectProps): ReactElement {
  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      <Snowfall
        snowflakeCount={snowflakeCount}
        speed={[0.5, 2]}
        wind={[-0.5, 1]}
        radius={[1, 4]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
        }}
      />
    </div>
  );
}
