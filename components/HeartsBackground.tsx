"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const colors = [
  "#ff99c8", // pink
  "#fcf6bd", // pastel yellow
  "#d0f4de", // pastel green
  "#a9def9", // pastel blue
  "#e4c1f9", // pastel purple
];

export default function HeartsBackground({ transparent = false }: { transparent?: boolean }) {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // spawn a bunch of floaty hearts
    const newHearts: FloatingHeart[] = Array.from({ length: 50 }).map((_, i) => {
      const duration = Math.random() * 20 + 10;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 30 + 10,
        duration: duration,
        delay: -Math.random() * duration,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    setHearts(newHearts);
  }, []);

  return (
    <div 
      className={`fixed inset-0 overflow-hidden min-h-screen min-w-full ${
        transparent ? "z-0 pointer-events-none" : "-z-10 bg-linear-to-br from-pink-100 via-purple-100 to-indigo-100"
      }`}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute opacity-60"
          initial={{
            x: `${heart.x}vw`,
            y: "110vh",
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: "linear",
          }}
          style={{
            color: heart.color,
          }}
        >
          <Heart fill={heart.color} size={heart.size} />
        </motion.div>
      ))}
    </div>
  );
}
