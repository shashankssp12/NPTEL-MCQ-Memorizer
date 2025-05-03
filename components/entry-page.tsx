"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { NPTELScene } from "@/components/nptel-scene"
import { useRouter } from "next/navigation"

export function EntryPage() {
  const [showQuiz, setShowQuiz] = useState(false)
const router = useRouter()  
  if (showQuiz) {
    router.push("/quiz")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#e0e5ec] overflow-hidden">
      <div className="w-full h-screen">
        <Canvas camera={{ position: [10.047021, -0.127436, -11.137374], fov: 50 }}>
          <NPTELScene onStartQuiz={() => setShowQuiz(true)} />
        </Canvas>
      </div>
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-xl md:text-2xl font-light tracking-wide text-white drop-shadow-lg">
          <span className="font-mono">NPTEL</span> <span className="font-serif italic">Learning</span>{" "}
          <span className="font-sans font-bold">max.</span>
        </p>
        <p className="text-white mt-4 text-sm md:text-base animate-pulse">Click on NPTEL to start</p>
      </div>
    </div>
  )
}
