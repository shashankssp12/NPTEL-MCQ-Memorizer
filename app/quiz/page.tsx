"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import WeekSelection from "@/components/week-selection"
import Quiz from "@/components/quiz"
import { quizData } from "@/data/quiz-data"

export default function Home() {
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null)

  const handleWeekSelect = (weekId: string) => {
    setSelectedWeek(weekId)
  }

  const handleBackToWeeks = () => {
    setSelectedWeek(null)
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            NPTEL Assignment Memorizer
          </motion.h1>
          <motion.div
            className="h-1 w-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4"
            initial={{ width: 0 }}
            animate={{ width: "10rem" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.p
            className="text-center text-gray-600 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Master your NPTEL course assignments with interactive quizzes. Test your knowledge and improve your scores!
          </motion.p>
        </header>

        {!selectedWeek ? (
          <WeekSelection weeks={quizData} onSelectWeek={handleWeekSelect} />
        ) : (
          <>
            <motion.button
              className="flex items-center mb-4 text-gray-600 hover:text-gray-800 transition-colors duration-200 neomorphic-button-small px-4 py-2 rounded-full"
              onClick={handleBackToWeeks}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
              Back to Weeks
            </motion.button>
            <Quiz weekData={quizData.find((week) => week.id === selectedWeek)!} onBackToWeeks={handleBackToWeeks} />
          </>
        )}
      </div>
    </main>
  )
}
