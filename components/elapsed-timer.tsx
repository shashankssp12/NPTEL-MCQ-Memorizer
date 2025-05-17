"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ElapsedTimerProps {
  startTime: number;
  className?: string;
}

export default function ElapsedTimer({
  startTime,
  className = "",
}: ElapsedTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Format the time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Update the elapsed time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // Convert to seconds
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className={`flex items-center gap-1 text-gray-600 ${className}`}>
      <Clock className="h-4 w-4" />
      <span className="text-sm font-medium">{formatTime(elapsedTime)}</span>
    </div>
  );
}
