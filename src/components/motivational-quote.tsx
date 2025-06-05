import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { quotes } from "../data/quotes";

interface MotivationalQuoteProps {
  cycleCompleted: boolean;
}

export const MotivationalQuote: React.FC<MotivationalQuoteProps> = ({ cycleCompleted }) => {
  const [quote, setQuote] = React.useState<{ text: string; author: string }>(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  // Change quote when cycle completes
  React.useEffect(() => {
    if (cycleCompleted) {
      const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(newQuote);
    }
  }, [cycleCompleted]);

  // Change quote manually
  const changeQuote = () => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote.text === quote.text);
    setQuote(newQuote);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-md border-none overflow-hidden bg-gradient-to-br from-amber-500/10 to-pink-500/10">
        <CardHeader className="flex justify-between items-center pb-0">
          <h2 className="text-xl font-semibold">Motivational Quote</h2>
          <button
            onClick={changeQuote}
            className="text-gray-500 hover:text-primary transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <Icon icon="lucide:refresh-cw" width={18} />
          </button>
        </CardHeader>
        <CardBody>
          <AnimatePresence mode="wait">
            <motion.div
              key={quote.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <div className="text-4xl text-gray-300">
                <Icon icon="lucide:quote" />
              </div>
              <p className="text-lg italic text-gray-700">{quote.text}</p>
              <p className="text-right text-sm text-gray-500 mt-2">— {quote.author}</p>
            </motion.div>
          </AnimatePresence>
        </CardBody>
      </Card>
    </motion.div>
  );
};