"use client";

import React from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface MuteButtonProps {
  isMuted: boolean;
  onToggleMute: () => void;
  className?: string;
}

export default function MuteButton({
  isMuted,
  onToggleMute,
  className,
}: MuteButtonProps) {
  return (
    <motion.button
      className={cn(
        "neomorphic-button-small p-2 rounded-full flex items-center justify-center",
        className
      )}
      onClick={onToggleMute}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      title={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-500" />
      ) : (
        <Volume2 className="w-5 h-5 text-gray-600" />
      )}
    </motion.button>
  );
}
