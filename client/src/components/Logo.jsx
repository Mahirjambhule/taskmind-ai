import React from 'react';

const Logo = ({ size = 40 }) => {
  const gradientId = "taskmind_gradient";

  return (
    <div className="flex items-center gap-2">
      {/* THE ICON: Book + Spark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="2"
            y1="22"
            x2="22"
            y2="2"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A855F7" /> {/* Purple */}
            <stop offset="1" stopColor="#EC4899" /> {/* Pink */}
          </linearGradient>
        </defs>

        {/* 1. The Closed Book */}
        {/* Main cover body */}
        <rect 
          x="5" 
          y="6" 
          width="12" 
          height="16" 
          rx="2" 
          fill={`url(#${gradientId})`} 
        />
        {/* The Spine Indentation (Visual Detail) */}
        <path 
          d="M8 6V22" 
          stroke="white" 
          strokeOpacity="0.3" 
          strokeWidth="1.5" 
        />
        
        {/* 2. The Spark (Emitting from top-right corner) */}
        {/* A 4-pointed star representing AI intelligence */}
        <path
          d="M19 0L20.5 3.5L24 5L20.5 6.5L19 10L17.5 6.5L14 5L17.5 3.5L19 0Z"
          fill={`url(#${gradientId})`}
        />
        
        {/* Optional: Small particle to show 'magic' */}
        <circle cx="22" cy="2" r="1" fill={`url(#${gradientId})`} opacity="0.6" />

      </svg>
      
      {/* THE TEXT */}
      <span 
        className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 tracking-tight leading-none"
        style={{ fontSize: size * 0.7 }}
      >
        TaskMind<span className="text-white font-light">AI</span>
      </span>
    </div>
  );
};

export default Logo;