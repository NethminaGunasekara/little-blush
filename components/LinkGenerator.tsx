"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Fredoka } from "next/font/google";
import { useState } from "react";
import HeartsBackground from "./HeartsBackground";

const fredoka = Fredoka({ subsets: ["latin"], weight: "600" });

export default function LinkGenerator() {
  const [telegramId, setTelegramId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = () => {
    if (!telegramId.trim()) return;
    const link = `${window.location.origin}/?id=${telegramId.trim()}`;
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-pink-50 p-4 text-center">
      <HeartsBackground />
      
      <motion.img 
        src="/mochi.gif" 
        alt="Cute kitten" 
        className="h-40 w-auto"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex max-w-md flex-col gap-4 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm"
      >
        <div>
          <h1 className={`${fredoka.className} mb-2 text-3xl text-pink-500`}>
            Create Your Proposal 💌
          </h1>
          <p className="text-pink-400">
            Enter your Telegram Chat ID to receive their response directly!
          </p>
          <p className="mt-1 text-xs text-pink-300">
            (Don't know it? Message @Getmyid_bot on Telegram)
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            placeholder="Enter Telegram Chat ID"
            className="w-full rounded-xl border-2 border-pink-100 bg-pink-50 p-3 text-center text-pink-600 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200"
          />
          
          <button
            onClick={handleGenerate}
            disabled={!telegramId}
            className="w-full rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 py-3 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate Link ✨
          </button>
        </div>

        {generatedLink && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 flex flex-col gap-2 rounded-xl bg-pink-50 p-4"
          >
            <p className="text-sm font-medium text-pink-500">Your Unique Link:</p>
            <div className="flex items-center gap-2 rounded-lg bg-white p-2 border border-pink-100">
              <input
                readOnly
                value={generatedLink}
                className="w-full bg-transparent text-sm text-gray-600 outline-none"
              />
              <button
                onClick={handleCopy}
                className="rounded-md p-2 text-pink-400 transition hover:bg-pink-50 hover:text-pink-600"
              >
                {isCopied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
