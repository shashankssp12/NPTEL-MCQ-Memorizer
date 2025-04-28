"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

interface QuizResultsProps {
  score: number
  totalQuestions: number
  percentage: number
  onRetry: () => void
  onBackToWeeks: () => void
}

export default function QuizResults({ score, totalQuestions, percentage, onRetry, onBackToWeeks }: QuizResultsProps) {
  const confettiRef = useRef<HTMLDivElement>(null)
  const [battleComplete, setBattleComplete] = useState(false)

  useEffect(() => {
    // Start with battle animation
    setTimeout(() => {
      setBattleComplete(true)

      // If good score, trigger confetti
      if (percentage >= 70 && confettiRef.current) {
        const rect = confettiRef.current.getBoundingClientRect()
        const x = rect.left + rect.width / 2
        const y = rect.top + rect.height / 2

        confetti({
          particleCount: 150,
          spread: 90,
          origin: {
            x: x / window.innerWidth,
            y: y / window.innerHeight,
          },
          colors: ["#4ade80", "#22c55e", "#16a34a"],
          startVelocity: 45,
        })
      }
    }, 3000)
  }, [percentage])

  const getResultMessage = () => {
    if (percentage >= 90) return "Excellent!"
    if (percentage >= 70) return "Great job!"
    if (percentage >= 50) return "Good effort!"
    return "Keep practicing!"
  }

  const getResultColor = () => {
    if (percentage >= 70) return "#4ade80" // green
    if (percentage >= 50) return "#facc15" // yellow
    return "#f87171" // red
  }

  // Background color based on score
  const getBackgroundColor = () => {
    if (percentage >= 70) return "bg-gradient-to-br from-green-100 to-green-50"
    if (percentage < 40) return "bg-gradient-to-br from-red-100 to-red-50"
    return "bg-gradient-to-br from-yellow-100 to-yellow-50"
  }

  return (
    <motion.div
      className={`flex flex-col items-center py-6 relative rounded-3xl ${battleComplete ? getBackgroundColor() : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Battle Animation */}
      <div className="battle-container">
        {/* Red side */}
        <motion.div
          className="battle-red"
          initial={{
            x: "-50%",
            y: "50%",
            width: "100px",
            height: "100px",
            backgroundColor: "rgba(239, 68, 68, 0.3)",
          }}
          animate={
            battleComplete
              ? percentage < 40
                ? { x: "0%", y: "0%", width: "200vw", height: "200vh", backgroundColor: "rgba(239, 68, 68, 0.15)" }
                : { x: "-100%", y: "100%", width: "10px", height: "10px", backgroundColor: "rgba(239, 68, 68, 0)" }
              : { x: "0%", y: "0%", width: "50vw", height: "100%", backgroundColor: "rgba(239, 68, 68, 0.3)" }
          }
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Green side */}
        <motion.div
          className="battle-green"
          initial={{
            x: "150%",
            y: "50%",
            width: "100px",
            height: "100px",
            backgroundColor: "rgba(34, 197, 94, 0.3)",
          }}
          animate={
            battleComplete
              ? percentage >= 70
                ? { x: "0%", y: "0%", width: "200vw", height: "200vh", backgroundColor: "rgba(34, 197, 94, 0.15)" }
                : { x: "200%", y: "100%", width: "10px", height: "10px", backgroundColor: "rgba(34, 197, 94, 0)" }
              : { x: "50%", y: "0%", width: "50vw", height: "100%", backgroundColor: "rgba(34, 197, 94, 0.3)" }
          }
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </div>

      <div ref={confettiRef} className="w-48 h-48 mb-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1.5,
          }}
        >
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: getResultColor(),
              textColor: "#374151",
              trailColor: "#e5e7eb",
              pathTransition: "stroke-dashoffset 1.5s ease 0.5s",
            })}
          />
        </motion.div>
      </div>

      <motion.h3
        className="text-2xl font-bold text-gray-800 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
      >
        {getResultMessage()}
      </motion.h3>

      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7 }}
      >
        You scored {score} out of {totalQuestions} questions correctly.
      </motion.p>

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          className="neomorphic-button px-6 py-3 rounded-xl font-medium text-gray-700"
          onClick={onRetry}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
        >
          Try Again
        </motion.button>
        <motion.button
          className="neomorphic-button px-6 py-3 rounded-xl font-medium text-gray-700"
          onClick={onBackToWeeks}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2 }}
        >
          Back to Weeks
        </motion.button>
      </div>
    </motion.div>
  )
}
