import React, { useState, useEffect } from "react";
import { psychologyQuotes } from "../../data/Quotes";
import { FiLoader } from "react-icons/fi";

const QuoteLoader = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * psychologyQuotes.length);
    setQuote(psychologyQuotes[randomIndex]);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary-200/30 dark:bg-primary-800/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-secondary-200/30 dark:bg-secondary-800/30 rounded-full blur-3xl animate-float-delay-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-accent-200/30 dark:bg-accent-800/30 rounded-full blur-2xl animate-float-delay-3"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-8 text-center">
        {/* Logo and Loading Animation */}
        <div className="mb-8 slide-in-down">
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">MindJournal</h1>
          <p className="text-neutral-600 dark:text-neutral-300">Loading your mindful space...</p>
        </div>

        {/* Loading Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="loading-spinner"></div>
        </div>

        {/* Quote Display */}
        {quote && (
          <div className="glass-card p-8 rounded-2xl border-gradient slide-in-up">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center mr-3">
                <FiLoader className="w-4 h-4 text-white animate-spin" />
              </div>
              <h3 className="text-lg font-bold gradient-text">Loading Inspiration</h3>
            </div>
            
            <blockquote className="relative">
              <div className="absolute -left-4 top-0 text-5xl text-primary-300 dark:text-primary-600">"</div>
              <p className="text-xl md:text-2xl font-medium text-neutral-700 dark:text-neutral-200 pl-8 pr-8 leading-relaxed">
                {quote}
              </p>
              <div className="absolute -right-4 bottom-0 text-5xl text-primary-300 dark:text-primary-600">"</div>
            </blockquote>
            
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div className="progress-bar rounded-full h-2" style={{ width: '75%' }}></div>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Preparing your journal experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteLoader;
