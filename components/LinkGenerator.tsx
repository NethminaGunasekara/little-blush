"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import { Fredoka } from "next/font/google";
import { useState, useEffect, useCallback } from "react";
import HeartsBackground from "./HeartsBackground";

const fredoka = Fredoka({ subsets: ["latin"], weight: "600" });

type Step = "welcome" | "connecting" | "success";

export default function LinkGenerator() {
  const [step, setStep] = useState<Step>("welcome");
  const [sessionId, setSessionId] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");

  const BOT_USERNAME = "mochidispachbot";

  // Poll for session status
  const checkSession = useCallback(async () => {
    if (!sessionId) return false;

    try {
      const response = await fetch(`/api/session?id=${sessionId}`);
      const data = await response.json();

      if (data.linked && data.chatId) {
        setFirstName(data.firstName || "");
        const link = `${window.location.origin}/?id=${data.chatId}`;
        setGeneratedLink(link);
        setStep("success");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [sessionId]);

  // Start polling when in connecting state
  useEffect(() => {
    if (step !== "connecting" || !sessionId) return;

    const interval = setInterval(async () => {
      const linked = await checkSession();
      if (linked) {
        clearInterval(interval);
      }
    }, 2000);

    // Timeout after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setError("Connection timed out. Please try again.");
      setStep("welcome");
    }, 300000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step, sessionId, checkSession]);

  const handleConnect = async () => {
    setError("");
    
    try {
      // Create a new session
      const response = await fetch("/api/session", { method: "POST" });
      const data = await response.json();

      if (!data.sessionId) {
        setError("Failed to create session. Please try again.");
        return;
      }

      setSessionId(data.sessionId);
      setStep("connecting");

      // Open Telegram with deep link
      const telegramUrl = `https://t.me/${BOT_USERNAME}?start=${data.sessionId}`;
      window.open(telegramUrl, "_blank");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStartOver = () => {
    setStep("welcome");
    setSessionId("");
    setGeneratedLink("");
    setFirstName("");
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-pink-50 p-4 text-center">
      <HeartsBackground />

      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex max-w-md flex-col items-center gap-6 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm"
          >
            <motion.img
              src="/mochi.gif"
              alt="Cute kitten"
              className="h-40 w-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />

            <div>
              <h1 className={`${fredoka.className} mb-2 text-3xl text-pink-500`}>
                Create Your Proposal 💌
              </h1>
              <p className="text-pink-400">
                Connect your Telegram to receive their sweet responses!
              </p>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnect}
              className="flex items-center gap-2 rounded-full bg-linear-to-r from-pink-400 to-rose-400 px-8 py-4 text-lg font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <ExternalLink size={20} />
              Connect Telegram
            </motion.button>

            <p className="text-xs text-pink-300">
              You'll be redirected to Telegram to connect
            </p>
          </motion.div>
        )}

        {step === "connecting" && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex max-w-md flex-col items-center gap-6 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-pink-100"
            >
              <Sparkles size={40} className="text-pink-400" />
            </motion.div>

            <div>
              <h2 className={`${fredoka.className} mb-2 text-2xl text-pink-500`}>
                Waiting for you... 💕
              </h2>
              <p className="text-pink-400">
                Press <strong>Start</strong> in Telegram to connect!
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2 text-sm text-pink-300"
              >
                <div className="h-2 w-2 rounded-full bg-pink-300" />
                Listening for connection...
              </motion.div>
            </div>

            <button
              onClick={handleStartOver}
              className="text-sm text-pink-400 underline hover:text-pink-500"
            >
              Cancel and start over
            </button>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex max-w-md flex-col items-center gap-6 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm"
          >
            <motion.img
              src="/mochi-kissing.gif"
              alt="Happy kitten"
              className="h-40 w-auto"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />

            <div>
              <motion.h2
                className={`${fredoka.className} mb-2 text-2xl text-pink-500`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {firstName ? `Yay ${firstName}! 🎉` : "Yay! 🎉"}
              </motion.h2>
              <p className="text-pink-400">
                Your proposal link is ready!
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full rounded-xl bg-pink-50 p-4"
            >
              <p className="mb-2 text-sm font-medium text-pink-500">
                Share this link with your special someone 💝
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-pink-100 bg-white p-3">
                <input
                  readOnly
                  value={generatedLink}
                  className="w-full bg-transparent text-sm text-gray-600 outline-none"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="rounded-md p-2 text-pink-400 transition hover:bg-pink-50 hover:text-pink-600"
                >
                  {isCopied ? <Check size={18} /> : <Copy size={18} />}
                </motion.button>
              </div>
            </motion.div>

            <button
              onClick={handleStartOver}
              className="text-sm text-pink-400 underline hover:text-pink-500"
            >
              Create another link
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
