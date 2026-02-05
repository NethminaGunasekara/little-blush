"use client";

import { motion } from "framer-motion";
import { Copy, Check, Clipboard as ClipboardIcon } from "lucide-react";
import { Fredoka } from "next/font/google";
import { useState, useRef } from "react";
import HeartsBackground from "./HeartsBackground";
import ConfirmationPopup from "./ConfirmationPopup";

const fredoka = Fredoka({ subsets: ["latin"], weight: "600" });

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
}

export default function LinkGenerator() {
  const [telegramId, setTelegramId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!telegramId.trim()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/telegram?chatId=${encodeURIComponent(telegramId.trim())}`);
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Invalid Telegram ID");
        setIsLoading(false);
        return;
      }
      
      setProfile(data.profile);
      setShowPopup(true);
    } catch (err) {
      setError("Failed to verify Telegram ID");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    const link = `${window.location.origin}/?id=${telegramId.trim()}`;
    setGeneratedLink(link);
    setShowPopup(false);
    setProfile(null);
  };

  const handleDeny = () => {
    setShowPopup(false);
    setProfile(null);
    setTelegramId("");
    inputRef.current?.focus();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setProfile(null);
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

      <ConfirmationPopup
        isOpen={showPopup}
        profile={profile}
        onConfirm={handleConfirm}
        onDeny={handleDeny}
        onClose={handleClosePopup}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex max-w-md flex-col gap-4 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm"
      >
        <motion.img 
          src="/mochi.gif" 
          alt="Cute kitten" 
          className="h-40 w-auto self-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <div>
          <h1 className={`${fredoka.className} mb-2 text-3xl text-pink-500`}>
            Create Your Proposal 💌
          </h1>
          <p className="text-pink-400">
            Enter your Telegram Chat ID to receive their response directly!
          </p>
          <p className="mt-1 text-xs text-pink-300">
            (Don't know it? Message <a href="https://t.me/Getmyid_bot" target="_blank" rel="noopener noreferrer" className="underline hover:text-pink-500">@Getmyid_bot</a> on Telegram)
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={telegramId}
              onChange={(e) => {
                setTelegramId(e.target.value);
                setError("");
              }}
              placeholder="Enter Telegram Chat ID"
              className="w-full rounded-xl border-2 border-pink-100 bg-pink-50 p-3 text-center text-pink-600 outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-200 placeholder:text-pink-300 placeholder:focus:text-transparent"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  setTelegramId(text);
                  setError("");
                } catch (err) {
                  console.error('Failed to paste:', err);
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-pink-400 hover:bg-pink-100 hover:text-pink-600 transition-colors"
              title="Paste from clipboard"
            >
              <ClipboardIcon size={18} />
            </motion.button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={!telegramId || isLoading}
            className="w-full rounded-xl bg-linear-to-r from-pink-400 to-rose-400 py-3 font-bold text-white shadow-md transition hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Generate Link ✨"}
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
