import React, { useState, useEffect } from 'react';
import { psychologyQuotes } from '../../data/Quotes'

const QuoteLoader = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * psychologyQuotes.length);
    setQuote(psychologyQuotes[randomIndex]);
  }, []);

 

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-3xl mx-auto p-8 text-center">
        <blockquote className="text-xl md:text-xl lg:text-xl moon-dance-regular italic leading-relaxed">
          "{quote}"
        </blockquote>
      </div>
    </div>
  );
};

export default QuoteLoader;
