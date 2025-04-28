"use client"

import { motion } from "framer-motion"
import type { Assignment } from "@/types"

interface WeekSelectionProps {
  weeks: Assignment[]
  onSelectWeek: (weekId: string) => void
}

export default function WeekSelection({ weeks, onSelectWeek }: WeekSelectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={container} initial="hidden" animate="show">
      {weeks.map((week) => (
        <motion.div
          key={week.id}
          className="neomorphic-card p-8 rounded-3xl cursor-pointer hover:shadow-lg transition-shadow duration-300"
          onClick={() => onSelectWeek(week.id)}
          variants={item}
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">{week.title.split(":")[0]}</h2>
          <p className="text-gray-600 text-sm mb-4">{week.title.split(":")[1] || ""}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">{week.questions.length} Questions</span>
            <motion.span
              className="neomorphic-button-small px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50"
              whileHover={{
                scale: 1.1,
                background: "linear-gradient(to right, #dbeafe, #ede9fe)",
              }}
            >
              Start Quiz
            </motion.span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
