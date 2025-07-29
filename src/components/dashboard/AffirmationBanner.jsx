import { useEffect, useState } from "react";

const affirmations = [
  "You are doing the best you can. That is enough.",
  "Take it one step at a time.",
  "It’s okay to not be okay.",
  "You are not alone.",
  "Your feelings are valid.",
  "Healing is not linear.",
  "You are stronger than your struggles.",
  "You are worthy of love and kindness.",
  "It’s okay to rest.",
  "Small steps lead to big progress.",
];

const getRandomAffirmation = (exclude) => {
  let newQuote;
  do {
    newQuote = affirmations[Math.floor(Math.random() * affirmations.length)];
  } while (newQuote === exclude);
  return newQuote;
};

const AffirmationBanner = () => {
  const [quote, setQuote] = useState("");

  const refreshQuote = () => {
    const newQuote = getRandomAffirmation(quote);
    setQuote(newQuote);
  };

  useEffect(() => {
    refreshQuote(); // Load once on mount
  }, []);

  return (
    <div
      onClick={refreshQuote}
      className="bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-100 rounded-md p-4 text-center shadow-sm cursor-pointer select-none hover:opacity-90 transition"
      title="Click to refresh affirmation"
    >
      <p className="italic font-playwrite-au font-extralight">“{quote}”</p>
    </div>
  );
};

export default AffirmationBanner;
