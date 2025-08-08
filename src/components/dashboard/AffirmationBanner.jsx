import { useEffect, useState } from "react";
import { psychologyQuotes } from "../../data/Quotes";

const affirmations = psychologyQuotes;

const getRandomAffirmation = (exclude) => {
  let newQuote;
  do {
    newQuote = affirmations[Math.floor(Math.random() * affirmations.length)];
  } while (newQuote === exclude);
  return newQuote;
};

const AffirmationBanner = () => {
  const [quote, setQuote] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshQuote = async () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      const newQuote = getRandomAffirmation(quote);
      setQuote(newQuote);
    }, 200);
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    const initialQuote = affirmations[Math.floor(Math.random() * affirmations.length)];
    setQuote(initialQuote);
  }, []);

  return (
    <div 
      onClick={refreshQuote}
      className={`
        relative overflow-hidden cursor-pointer select-none
        bg-gradient-to-br from-primary-50/80 via-primary-100 to-primary-150/80
        dark:from-primary-900/80 dark:via-primary-800 dark:to-primary-750/80
        text-primary-900 dark:text-primary-100
        rounded-xl p-4
        shadow-sm hover:shadow-lg
        border border-primary-200/40 dark:border-primary-600/20
        backdrop-blur-sm
        transform transition-all duration-300 ease-out
        hover:scale-[1.01] hover:-translate-y-0.5
        group
        ${isRefreshing ? 'animate-pulse' : ''}
      `}
      title="Click to refresh affirmation"
    >
      {/* Subtle glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-black/5 dark:to-black/2 backdrop-blur-sm rounded-xl" />
      
      {/* Animated background shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-primary-200/20 dark:via-primary-600/15 to-transparent animate-shimmer rounded-xl" />
      
      {/* Small refresh icon in top-right corner */}
      <div className={`
        absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-300
        ${isRefreshing ? 'opacity-100 animate-spin' : ''}
      `}>
        <svg 
          className="w-4 h-4 text-primary-500 dark:text-primary-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      
      {/* Quote content */}
      <div className="relative z-10 text-center">
        <p className={`
          font-libre-baskerville font-extralight text-base
          leading-relaxed
          transform transition-all duration-400
          ${isRefreshing ? 'scale-98 opacity-70' : 'scale-100 opacity-100'}
          bg-gradient-to-r from-primary-800 via-primary-900 to-primary-800
          dark:from-primary-100 dark:via-primary-50 dark:to-primary-100
          bg-clip-text text-transparent
        `}>
          "{quote}"
        </p>
      </div>
      
      {/* Subtle bottom border accent */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-600 to-transparent w-0 group-hover:w-1/3 transition-all duration-500" />
      
      {/* Corner accent dots */}
      <div className="absolute top-1 left-1 w-1 h-1 bg-primary-300/50 dark:bg-primary-600/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-1 right-1 w-1 h-1 bg-primary-300/50 dark:bg-primary-600/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
    </div>
  );
};

export default AffirmationBanner;

/* 
Add this to your global CSS for the shimmer effect:

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

.scale-98 {
  transform: scale(0.98);
}
*/