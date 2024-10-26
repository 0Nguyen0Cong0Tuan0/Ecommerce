import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const GradientCircularProgress = () => {
  return (
    <React.Fragment>
      {/* SVG for the gradient */}
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>

      {/* CircularProgress centered and enlarged */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Full viewport height to ensure true vertical centering
        }}
      >
        <CircularProgress
          size={100} // Set the size to make it larger
          sx={{
            'svg circle': { stroke: 'url(#my_gradient)' },
          }}
        />
      </div>
    </React.Fragment>
  );
};

export default GradientCircularProgress;
