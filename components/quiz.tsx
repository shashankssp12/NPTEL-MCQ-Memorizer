"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Assignment, Question } from "@/types";
import QuizQuestion from "@/components/quiz-question";
import QuizResults from "@/components/quiz-results";
import ProgressBar from "@/components/progress-bar";
import Timer from "@/components/timer";
import MuteButton from "@/components/mute-button";
import ElapsedTimer from "@/components/elapsed-timer";

interface QuizProps {
  weekData: Assignment;
  onBackToWeeks: () => void;
}

export default function Quiz({ weekData, onBackToWeeks }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds per question
  const [timerActive, setTimerActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Timing data for quiz statistics
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [quizEndTime, setQuizEndTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [questionTimes, setQuestionTimes] = useState<number[]>([]);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement | null>(null);

  const totalQuestions = weekData.questions.length;

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize with shuffled questions and start the quiz timer
  useEffect(() => {
    setShuffledQuestions(shuffleArray(weekData.questions));
    correctAudioRef.current = new Audio("/correct.mp3");
    incorrectAudioRef.current = new Audio("/incorrect.mp3");

    // Start the quiz timer
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());

    return () => {
      if (correctAudioRef.current) {
        correctAudioRef.current.pause();
        correctAudioRef.current = null;
      }
      if (incorrectAudioRef.current) {
        incorrectAudioRef.current.pause();
        incorrectAudioRef.current = null;
      }
      // Reset body class when component unmounts
      document.body.classList.remove("correct-answer", "incorrect-answer");
    };
  }, [weekData.questions]);

  // Current question
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (!timerActive || !currentQuestion || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time's up - mark as incorrect
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, timerActive, isAnswered, currentQuestion]);

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(20);
    setTimerActive(true);

    // If not the first question, record the time taken for the previous question
    if (currentQuestionIndex > 0 || questionTimes.length > 0) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);

  const recordQuestionTime = () => {
    const timeSpent = (Date.now() - questionStartTime) / 1000; // Convert to seconds
    setQuestionTimes((prev) => [...prev, timeSpent]);
  };

  const handleTimeUp = () => {
    if (isAnswered) return;

    setIsAnswered(true);
    setIsCorrect(false);
    document.body.classList.add("incorrect-answer");

    // Record the time spent on this question
    recordQuestionTime();

    if (!isMuted) {
      incorrectAudioRef.current?.play();
    }

    // Update user answers with -1 to indicate timeout
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = -1;
    setUserAnswers(newUserAnswers);

    // Move to next question after delay
    setTimeout(() => {
      document.body.classList.remove("incorrect-answer");
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setQuizEndTime(Date.now());
        setShowResults(true);
      }
    }, 1500);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;

    setTimerActive(false);
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    // Record the time spent on this question
    recordQuestionTime();

    const correct = optionIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    // Add body class for background color change
    if (correct) {
      document.body.classList.add("correct-answer");
      if (!isMuted) {
        correctAudioRef.current?.play();
      }
    } else {
      document.body.classList.add("incorrect-answer");
      if (!isMuted) {
        incorrectAudioRef.current?.play();
      }
    }

    // Update user answers
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newUserAnswers);

    // Move to next question after delay
    setTimeout(() => {
      // Remove body class
      document.body.classList.remove("correct-answer", "incorrect-answer");

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        // Record the end time of the quiz
        setQuizEndTime(Date.now());
        setShowResults(true);
      }
    }, 1500);
  };

  const handleRetry = () => {
    // Reshuffle questions for retry
    setShuffledQuestions(shuffleArray(weekData.questions));
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(20);
    setTimerActive(true);
    document.body.classList.remove("correct-answer", "incorrect-answer");

    // Reset timing data
    setQuizStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setQuizEndTime(0);
    setQuestionTimes([]);
  };

  const calculateScore = () => {
    let correctCount = 0;
    shuffledQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);

    // Mute/unmute audio elements
    if (correctAudioRef.current) {
      correctAudioRef.current.muted = !isMuted;
    }
    if (incorrectAudioRef.current) {
      incorrectAudioRef.current.muted = !isMuted;
    }
  };

  const score = calculateScore();
  const percentage = Math.round((score / totalQuestions) * 100);

  // Calculate total quiz time in seconds
  const totalQuizTime = quizEndTime ? (quizEndTime - quizStartTime) / 1000 : 0;

  // Calculate average time per question
  const averageQuestionTime =
    questionTimes.length > 0
      ? questionTimes.reduce((sum, time) => sum + time, 0) /
        questionTimes.length
      : 0;

  if (!currentQuestion && !showResults) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-3xl neomorphic-card relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {weekData.title}
        </h2>
        <div className="flex items-center gap-4 absolute top-6 right-6">
          {!showResults && <ElapsedTimer startTime={quizStartTime} />}
          <MuteButton isMuted={isMuted} onToggleMute={handleToggleMute} />
        </div>
      </div>

      {!showResults ? (
        <>
          <div className="mb-4">
            <Timer timeLeft={timeLeft} totalTime={20} />
          </div>

          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <ProgressBar
              current={currentQuestionIndex + 1}
              total={totalQuestions}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion && (
                <QuizQuestion
                  question={currentQuestion}
                  selectedOption={selectedOption}
                  isAnswered={isAnswered}
                  isCorrect={isCorrect}
                  onSelectOption={handleOptionSelect}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <QuizResults
          score={score}
          totalQuestions={totalQuestions}
          percentage={percentage}
          onRetry={handleRetry}
          onBackToWeeks={onBackToWeeks}
          isMuted={isMuted}
          totalTime={totalQuizTime}
          averageTime={averageQuestionTime}
        />
      )}
    </div>
  );
}
