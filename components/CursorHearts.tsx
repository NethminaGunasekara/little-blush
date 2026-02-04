"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#ff6b6b", "#f06595", "#cc5de8", "#845ef7", "#5c7cfa", "#339af0", "#22b8cf", "#20c997", "#51cf66", "#94d82d", "#fcc419", "#ff922b"];

export default function CursorHearts() {
  const requestRef = useRef<number>(0);
  const heartsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      createHeart(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
       if (e.touches[0]) {
         createHeart(e.touches[0].clientX, e.touches[0].clientY);
       }
    };

    const createHeart = (x: number, y: number) => {
      const heart = document.createElement("span");
      heart.innerHTML = "❤";
      heart.style.position = "fixed";
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      heart.style.fontSize = `${Math.random() * 20 + 10}px`;
      heart.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      heart.style.pointerEvents = "none";
      heart.style.zIndex = "9999";
      heart.style.transform = "translate(-50%, -50%)"; // Center on cursor
      heart.style.transition = "transform 1s ease-out, opacity 1s ease-out";
      
      document.body.appendChild(heart);
      heartsRef.current.push(heart);

      // do the floaty thing
      requestAnimationFrame(() => {
        heart.style.transform = `translate(-50%, -150%) scale(0)`;
        heart.style.opacity = "0";
      });

      // bye bye little heart
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
        heartsRef.current = heartsRef.current.filter((h) => h !== heart);
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      // tidy up any leftover hearts
      heartsRef.current.forEach((h) => {
        if (h.parentNode) h.parentNode.removeChild(h);
      });
    };
  }, []);

  return null; // this component is invisible it just spawns hearts on the body
}
