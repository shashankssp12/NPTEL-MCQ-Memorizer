"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import type { Question } from "@/types"

interface QuizQuestionProps {
  question: Question
  selectedOption: number | null
  isAnswered: boolean
  isCorrect: boolean | null
  onSelectOption: (optionIndex: number) => void
}

export default function QuizQuestion({
  question,
  selectedOption,
  isAnswered,
  isCorrect,
  onSelectOption,
}: QuizQuestionProps) {
  // Shuffle options for each question
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; originalIndex: number }[]>([])

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled options
  useEffect(() => {
    const options = question.options.map((text, originalIndex) => ({ text, originalIndex }))
    setShuffledOptions(shuffleArray(options))
  }, [question])

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 mb-4">{question.text}</h3>

      <div className="space-y-3">
        {shuffledOptions.map((option, displayIndex) => {
          const isSelected = selectedOption === option.originalIndex
          const isCorrectOption = question.correctAnswer === option.originalIndex

          let optionClass = "neomorphic-button p-4 rounded-xl w-full text-left transition-all duration-300"

          if (isAnswered) {
            if (isSelected) {
              optionClass += isCorrect ? " option-correct" : " option-incorrect"
            } else if (isCorrectOption) {
              optionClass += " option-correct"
            }
          } else {
            optionClass += " hover:shadow-lg"
          }

          return (
            <motion.button
              key={displayIndex}
              className={optionClass}
              onClick={() => onSelectOption(option.originalIndex)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.03 } : {}}
              whileTap={!isAnswered ? { scale: 0.97 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isAnswered && isSelected ? (isCorrect ? 1.05 : 0.98) : 1,
              }}
              transition={{
                duration: 0.3,
                delay: displayIndex * 0.1,
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              <div className="flex items-start">
                <span className="neomorphic-circle w-8 h-8 flex items-center justify-center rounded-full mr-3 flex-shrink-0 text-sm font-bold">
                  {String.fromCharCode(65 + displayIndex)}
                </span>
                <span>{option.text}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
