import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Zap, Heart, Brain } from 'lucide-react';

const WelcomeSplash = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let innerTimer = null;
    const outerTimer = setTimeout(() => {
      setIsAnimating(true);
      innerTimer = setTimeout(() => {
        setIsVisible(false); // completely removes splash, no black screen left
        if (onComplete) onComplete();
      }, 500); // matches smoother exit animation
    }, 3000);

    return () => {
      clearTimeout(outerTimer);
      if (innerTimer) clearTimeout(innerTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-15px) translateX(8px) rotate(120deg); }
          66% { transform: translateY(10px) translateX(-5px) rotate(240deg); }
        }
        @keyframes fadeInTitle {
          0% { opacity: 0; transform: translateY(-30px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmerText {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes hologramEffect {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes energyPulse {
          0% { r: 2; opacity: 1; }
          100% { r: 8; opacity: 0; }
        }
        @keyframes slideUpAndFade {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .animate-float-particle { animation: floatParticle 6s ease-in-out infinite; }
        .animate-fade-in-title { animation: fadeInTitle 1.2s ease-out; }
        .animate-shimmer-text { background-size: 200% 200%; animation: shimmerText 3s ease infinite; }
        .animate-pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }
        .animate-hologram { animation: hologramEffect 2s ease-in-out infinite; }
        .animate-energy-pulse { animation: energyPulse 2s ease-out infinite; }
        .animate-slide-up-fade { animation: slideUpAndFade 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
      `}</style>

      <div
        className={`fixed inset-0 z-50 ${
          isAnimating ? 'animate-slide-up-fade' : ''
        }`}
        style={{
          background: `linear-gradient(135deg, #433751, #2F576E, #748B9C, #F0E3E3)`
        }}
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${4 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              {i % 3 === 0 && <Sparkles className="w-3 h-3 text-[#F0E3E3] opacity-70" />}
              {i % 3 === 1 && <Activity className="w-2 h-2 text-[#748B9C] opacity-70" />}
              {i % 3 === 2 && <div className="w-2 h-2 bg-[#2F576E] rounded-full opacity-50" />}
            </div>
          ))}
        </div>

        {/* Decorative Icons */}
        <div className="absolute top-10 sm:top-16 left-6 sm:left-12 animate-pulse">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-[#F0E3E3]" />
        </div>
        <div className="absolute top-8 sm:top-12 right-8 sm:right-16 animate-pulse" style={{ animationDelay: '1s' }}>
          <Brain className="w-5 h-5 sm:w-7 sm:h-7 text-[#748B9C]" />
        </div>
        <div className="absolute bottom-16 sm:bottom-24 left-12 sm:left-20 animate-pulse" style={{ animationDelay: '2s' }}>
          <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-[#433751]" />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Title Section */}
          <div className="text-center mb-6 sm:mb-12 mt-8 sm:mt-16 animate-fade-in-title">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#F0E3E3] mb-2 sm:mb-4 tracking-tight leading-tight">
              Welcome to
            </h1>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-[#1a1124] via-[#433751] to-[#2F576E] bg-clip-text text-transparent mb-3 sm:mb-6 animate-shimmer-text">
              VirtuaTwin
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#F0E3E3] font-light max-w-xl lg:max-w-2xl mx-auto px-2">
              Your Intelligent Digital Health Companion
            </p>
          </div>

          {/* Main Virtual Character */}
          <div className="relative w-full max-w-md sm:max-w-xl lg:max-w-2xl h-40 sm:h-56 md:h-64 lg:h-72 flex items-center justify-center mb-6 sm:mb-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-[#748B9C]/30 rounded-full blur-3xl animate-pulse-glow" />
            </div>

            <svg className="w-32 h-32 animate-hologram" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="30" stroke="#2F576E" strokeWidth="3" fill="rgba(47,87,110,0.3)" />
              <circle cx="50" cy="50" r="20" stroke="#748B9C" strokeWidth="2" fill="rgba(116,139,156,0.3)" />
              <circle cx="50" cy="50" r="10" fill="#F0E3E3" />
              {[0, 1, 2, 3].map(i => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="2"
                  className="animate-energy-pulse"
                  fill="#433751"
                  opacity="0.8"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </svg>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4">
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#433751]/40 backdrop-blur-sm rounded-full text-[#F0E3E3] text-xs sm:text-sm font-medium border border-[#433751]/50 shadow-lg">
              Real-Time Analysis
            </span>
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#2F576E]/40 backdrop-blur-sm rounded-full text-[#F0E3E3] text-xs sm:text-sm font-medium border border-[#2F576E]/50 shadow-lg">
              Smart Insights
            </span>
            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-[#748B9C]/40 backdrop-blur-sm rounded-full text-[#F0E3E3] text-xs sm:text-sm font-medium border border-[#748B9C]/50 shadow-lg">
              Personalized Care
            </span>
          </div>

          {/* Loading Bar */}
          <div className="w-48 sm:w-64 md:w-80 h-1 sm:h-1.5 bg-[#433751]/40 rounded-full overflow-hidden border border-[#2F576E]/40 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#433751] via-[#748B9C] to-[#2F576E] rounded-full shadow-lg"
              style={{
                animation: 'loadingBar 3.5s ease-in-out forwards'
              }}
            />
          </div>

          <p className="text-[#F0E3E3] text-xs sm:text-sm mt-3 sm:mt-4 animate-pulse">
            Initializing your digital health companion...
          </p>
        </div>
      </div>
    </>
  );
};

export default WelcomeSplash;
