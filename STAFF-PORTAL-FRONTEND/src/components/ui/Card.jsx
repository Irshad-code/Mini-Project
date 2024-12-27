import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`group relative p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-[var(--color-border-primary)] overflow-hidden bg-[var(--color-bg-primary)] ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-primary)] opacity-50 group-hover:animate-parallax z-0"></div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[var(--color-primary-500)] group-hover:shadow-[0_0_15px_var(--color-bg-primary)] transition-all duration-300"></div>

      {/* Content Wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Card;
