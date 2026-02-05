"use client";

import HeartsBackground from "@/components/HeartsBackground";
import LinkGenerator from "@/components/LinkGenerator";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Fredoka } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const fredoka = Fredoka({ subsets: ["latin"], weight: "600" });

const NO_MESSAGES = [
  "No (bold choice)",
  "Are you sure? 🥺",
  "Please change your mind!",
  "I'll be sad...",
  "Don't do this!",
  "Last chance!",
  "You're breaking my heart 💔",
  "Think about the kitten!",
  "Really really sure?",
];

function ValentineContent() {
  const searchParams = useSearchParams();
  const targetChatId = searchParams.get("id");
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); 
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(true); 
  const audioRef = useRef<HTMLAudioElement>(null);
  const yesControls = useAnimation();

  // If no ID is present, show the Generator
  if (!targetChatId) {
    return <LinkGenerator />;
  }

  // Helper to send telegram notifications
  const sendTelegramNotification = async (type: "yes_click" | "message_sent", text?: string) => {
    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message: text, targetChatId }),
      });
    } catch (error) {
      console.error("Failed to send notification", error);
    }
  };

  // music player shenanigans
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && hasStarted) {
        audioRef.current.play().catch((err) => {
          console.log("Playback failed:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasStarted]);

  const handleStart = () => {
    setHasStarted(true);
    setIsPlaying(true);
    // browsers block autoplay so we gotta do this on user click
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleYesClick = () => {
    setIsSuccess(true);
    // let her know she made someone very happy
    sendTelegramNotification("yes_click");
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setIsSent(true);
    // yeet the message to telegram
    sendTelegramNotification("message_sent", message.trim());
    setTimeout(() => {
      setMessage("");
      setIsSent(false);
    }, 2000);
  };

  // the no button is scared of commitment
  const handleNoHover = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      // Pulse the Yes button
      yesControls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.4 },
      });
  
      const buttonRect = e.currentTarget.getBoundingClientRect();
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonCenterY = buttonRect.top + buttonRect.height / 2;
  
      let mouseX = 0;
      let mouseY = 0;
  
      if ("clientX" in e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      } else if ("touches" in e) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
  
      // Calculate vector from mouse to button center
      let deltaX = buttonCenterX - mouseX;
      let deltaY = buttonCenterY - mouseY;
  
      // If mouse is right on center (rare), pick random direction
      if (deltaX === 0 && deltaY === 0) {
        deltaX = Math.random() - 0.5;
        deltaY = Math.random() - 0.5;
      }
  
      // Normalize and scale (push distance)
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const pushDistance = 250; 
      const scale = pushDistance / (distance || 1); 
  
      let newX = buttonRect.left + deltaX * scale;
      let newY = buttonRect.top + deltaY * scale;
  
      // Boundary checks 
      const padding = 20;
      const maxX = window.innerWidth - buttonRect.width - padding;
      const maxY = window.innerHeight - buttonRect.height - padding;
  
      newX = Math.min(Math.max(padding, newX), maxX);
      newY = Math.min(Math.max(padding, newY), maxY);
  
      setNoPosition({ x: newX, y: newY });
      setNoCount((prev) => (prev + 1) % NO_MESSAGES.length);
  };



  return (
    <div className="relative min-h-screen overflow-hidden font-geist-sans">
      <button 
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-60 rounded-full bg-white/80 p-3 text-pink-500 shadow-md backdrop-blur-sm transition hover:scale-110 hover:bg-white"
        aria-label="Toggle music"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
      <audio ref={audioRef} src="/music.mp3" loop />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div 
            key="overlay"
            className="flex min-h-screen *:z-50 bg-white w-full cursor-pointer flex-col items-center justify-center gap-6 text-center"
            onClick={handleStart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeartsBackground transparent />
            <img src="/mochi.gif" alt="Cute kitten" className="h-40 w-auto" />
            
            <div className="flex flex-col gap-2">
                <h1 className={`${fredoka.className} flex items-center justify-center gap-1.5 text-4xl text-pink-500`}>
                  Hey cutie
                  <motion.span
                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                    className="inline-block origin-bottom-right"
                  >
                    👋
                  </motion.span>
                </h1>
                <p className="text-lg text-pink-400">I have a very important question for you...</p>
            </div>
            <motion.button 
              className="rounded-full bg-linear-to-r from-pink-400 to-rose-400 px-8 py-3 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-pink-500 hover:to-rose-500 hover:shadow-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Open Message 💌
            </motion.button>
          </motion.div>
        ) : isSuccess ? (
          <motion.div 
            key="success"
            className="flex min-h-screen *:z-50 bg-white w-full flex-col items-center justify-center gap-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HeartsBackground transparent />
            <motion.img 
              src="/mochi-kissing.gif" 
              alt="Happy kitten" 
              className="h-40 w-auto"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            />
            
            <motion.div 
              className="flex flex-col gap-2 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className={`${fredoka.className} text-4xl text-pink-500`}>
                Yay! I knew you'd say that! 🥰
              </h1>
              <p className="text-lg text-pink-400">You've made me the happiest person!</p>
            </motion.div>

            <motion.div 
              className="flex w-full max-w-sm flex-col gap-3 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {!isSent ? (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send me a cute message..."
                    className="w-full rounded-2xl border-2 border-pink-200 bg-pink-50 p-4 text-pink-600 focus:border-pink-400 focus:outline-none placeholder:text-pink-300 transition-all focus:ring-2 focus:ring-pink-200"
                    rows={3}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="rounded-full bg-pink-400 py-3 font-bold text-white shadow-md transition hover:bg-pink-500 disabled:bg-pink-200 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    Send Message 💌
                  </button>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                  className="rounded-2xl bg-pink-100 p-6 text-pink-600"
                >
                  <p className="font-bold text-xl">Message Sent! 💌</p>
                  <p className="text-sm">I can't wait to read it!</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.main 
            key="main"
            className="flex min-h-screen flex-col items-center justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HeartsBackground />
            
            <h1 className={`${fredoka.className} text-5xl text-[#8b5e83]`}>
              Will you be my <span className="text-[#e86ea9]">Valentine?</span>
            </h1>
            <img src="/kitten.gif" alt="Cute kitten" className="h-64 w-auto drop-shadow-lg" />
            <div className="flex flex-col items-center gap-4">
              <motion.button 
                className="transform rounded-full border-b-4 border-pink-600 bg-pink-400 px-16 py-3 text-xl font-bold text-white transition hover:scale-105 hover:bg-pink-500 active:translate-y-1 active:border-none"
                onClick={handleYesClick}
                animate={yesControls}
                transition={{ duration: 0.1 }}
              >
                Yes (obviously)
              </motion.button>
              <motion.button 
                className="rounded-full border-b-4 border-gray-300 bg-white px-16 py-3 text-xl font-bold text-gray-400 whitespace-nowrap"
                style={{ 
                  position: noPosition ? "fixed" : "static", 
                  zIndex: 50
                }}
                animate={noPosition ? { left: noPosition.x, top: noPosition.y } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={handleNoHover}
                onMouseMove={handleNoHover}
                onTouchStart={handleNoHover}
                onClick={handleNoHover}
              >
                {noCount === 0 ? "No (bold choice)" : NO_MESSAGES[noCount]}
              </motion.button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-pink-50 text-pink-300">Loading...</div>}>
      <ValentineContent />
    </Suspense>
  );
}
