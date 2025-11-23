import React from 'react';

const Logo = ({ size = 40 }) => {
  return (
    <div className="flex items-center gap-2">
      {/* The Icon: A Simple AI Spark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The Spark Shape */}
        <path
          d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
          fill="url(#spark_gradient)"
        />
        
        {/* The Gradient Definition */}
        <defs>
          <linearGradient
            id="spark_gradient"
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A855F7" /> {/* Purple */}
            <stop offset="1" stopColor="#EC4899" /> {/* Pink */}
          </linearGradient>
        </defs>
      </svg>
      
      {/* The Text */}
      <span 
        className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 tracking-tight"
        style={{ fontSize: size * 0.7 }} // Auto-scales text based on icon size
      >
        MindFlow<span className="text-white font-light">AI</span>
      </span>
    </div>
  );
};

export default Logo;