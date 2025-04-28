"use client"

import { motion } from "framer-motion"

interface TimerProps {
  timeLeft: number
  totalTime: number
}

export default function Timer({ timeLeft, totalTime }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100

  // Determine color based on time left
  const getColor = () => {
    if (percentage > 60) return "bg-gradient-to-r from-green-400 to-blue-500"
    if (percentage > 30) return "bg-gradient-to-r from-yellow-400 to-orange-500"
    return "bg-gradient-to-r from-red-500 to-pink-500"
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-600">Time Remaining</span>
        <span className="text-sm font-bold">{timeLeft}s</span>
      </div>
      <div className="timer-container">
        <motion.div
          className={`timer-bar ${getColor()}`}
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
