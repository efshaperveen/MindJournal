import { useEffect, useState } from "react";
import { psychologyQuotes } from "../../data/Quotes";
import { FiRefreshCw, FiHeart } from "react-icons/fi";

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

  const refreshQuote = () => {
    setIsRefreshing(true);
    const newQuote = getRandomAffirmation(quote);
    setQuote(newQuote);
    
    // Reset refreshing state after animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    refreshQuote(); // Load once on mount
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl border-gradient hover:shadow-glow transition-all duration-500 scale-in-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <FiHeart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold gradient-text">Daily Affirmation</h3>
          </div>
          
          <blockquote className="relative">
            <div className="absolute -left-2 top-0 text-4xl text-primary-300 dark:text-primary-600">"</div>
            <p className="text-lg font-medium text-neutral-700 dark:text-neutral-200 pl-6 leading-relaxed">
              {quote}
            </p>
            <div className="absolute -right-2 bottom-0 text-4xl text-primary-300 dark:text-primary-600">"</div>
          </blockquote>
        </div>
        
        <button
          onClick={refreshQuote}
          className={`ml-4 p-3 rounded-xl bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-110 hover:shadow-glow ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          title="Get new affirmation"
        >
          <FiRefreshCw className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </button>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            Click refresh for new inspiration
          </span>
        </div>
        
        <div className="text-xs text-neutral-400 dark:text-neutral-500">
          MindJournal
        </div>
      </div>
    </div>
  );
};

export default AffirmationBanner;
