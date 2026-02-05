"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ subsets: ["latin"], weight: "600" });

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
}

interface ConfirmationPopupProps {
  isOpen: boolean;
  profile: ProfileData | null;
  onConfirm: () => void;
  onDeny: () => void;
  onClose: () => void;
}

export default function ConfirmationPopup({
  isOpen,
  profile,
  onConfirm,
  onDeny,
  onClose,
}: ConfirmationPopupProps) {
  if (!profile) return null;

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(" ") || "Unknown";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* the dark overlay behind */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />

          {/* actual popup card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl"
          >
            {/* x button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-pink-300 transition-colors hover:bg-pink-50 hover:text-pink-500"
            >
              <X size={20} />
            </motion.button>

            <div className="flex flex-col items-center gap-4 text-center">
              {/* lil magnifying glass */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-3xl"
              >
                🔍
              </motion.div>

              <div>
                <h2 className={`${fredoka.className} text-2xl text-pink-500`}>
                  Is this you?
                </h2>
                <p className="mt-2 text-pink-400">
                  We found this Telegram account:
                </p>
              </div>

              {/* who they found */}
              <div className="w-full rounded-2xl bg-pink-50 p-4">
                <p className="text-lg font-semibold text-pink-600">{displayName}</p>
                {profile.username && (
                  <p className="text-sm text-pink-400">@{profile.username}</p>
                )}
              </div>

              {/* confirm or deny */}
              <div className="flex w-full gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDeny}
                  className="flex-1 rounded-xl border-2 border-pink-200 bg-white py-3 font-semibold text-pink-400 transition-colors hover:bg-pink-50"
                >
                  No, try again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="flex-1 rounded-xl bg-pink-400 py-3 font-semibold text-white transition-colors hover:bg-pink-500"
                >
                  Yes, that's me! 💖
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
