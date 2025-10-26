// src/components/ui/sticky-scroll.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const StickyScroll = ({ content }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useEffect(() => {
    const handleScroll = () => {
      const progress = scrollYProgress.get();
      const cardIndex = Math.min(
        Math.floor(progress * cardLength),
        cardLength - 1
      );
      setActiveCard(cardIndex);
    };

    scrollYProgress.on("change", handleScroll);
    return () => scrollYProgress.clearListeners();
  }, [scrollYProgress, cardLength]);

  const backgroundColors = [
    "rgba(0, 255, 170, 0.05)",
    "rgba(0, 221, 187, 0.05)",
    "rgba(0, 187, 153, 0.05)",
  ];

  const linearGradients = [
    "linear-gradient(to bottom right, rgba(0, 255, 170, 0.1), rgba(0, 221, 187, 0.1))",
    "linear-gradient(to bottom right, rgba(0, 221, 187, 0.1), rgba(0, 187, 153, 0.1))",
    "linear-gradient(to bottom right, rgba(0, 187, 153, 0.1), rgba(0, 255, 170, 0.1))",
  ];

  return (
    <motion.div
      style={{
        backgroundColor: useTransform(
          scrollYProgress,
          content.map((_, i) => i / cardLength),
          backgroundColors
        ),
      }}
      ref={ref}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-hidden p-10"
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-green-400"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-kg mt-10 max-w-sm text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <motion.div
        style={{
          background: useTransform(
            scrollYProgress,
            content.map((_, i) => i / cardLength),
            linearGradients
          ),
        }}
        className="sticky top-10 hidden h-60 w-80 overflow-hidden rounded-md bg-white lg:block"
      >
        {content[activeCard]?.content ?? null}
      </motion.div>
    </motion.div>
  );
};
