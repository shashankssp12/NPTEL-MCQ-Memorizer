"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface QuizStopwatchProps {
  totalTime: number; // in seconds
  averageTime: number; // in seconds
}

export default function QuizStopwatch({
  totalTime,
  averageTime,
}: QuizStopwatchProps) {
  // Format the time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Format average time to show with only one decimal place
  const formatAverage = (timeInSeconds: number): string => {
    return timeInSeconds.toFixed(1);
  };

  return (
    <motion.div
      className="flex flex-col space-y-2 text-center mb-6 p-4 bg-white/30 rounded-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.9 }}
    >
      <div className="flex items-center justify-center gap-2 text-gray-700">
        <Clock className="w-4 h-4" />
        <h4 className="font-medium">Quiz Statistics</h4>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-600 text-xs">Total Time</span>
          <span className="font-bold text-base">{formatTime(totalTime)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-600 text-xs">Average Per Question</span>
          <span className="font-bold text-base">
            {formatAverage(averageTime)}s
          </span>
        </div>
      </div>
    </motion.div>
  );
}
