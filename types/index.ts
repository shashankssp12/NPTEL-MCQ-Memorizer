export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
}

export interface Assignment {
  id: string
  title: string
  questions: Question[]
}
