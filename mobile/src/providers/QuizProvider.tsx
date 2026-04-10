import { createContext, useContext, useState } from "react";

import { questions } from "../data/questions";

type QuizContextValue = {
  answeredCount: number;
  correctCount: number;
  todayCount: number;
  streakDays: number;
  wrongQuestionIds: number[];
  bookmarkedIds: number[];
  recentExamScore: number;
  continueIndex: number;
  toggleBookmark: (questionId: number) => void;
  submitAnswer: (questionId: number, isCorrect: boolean) => void;
};

const seedWrongIds = questions
  .filter((_, index) => [15, 28, 66, 104, 163, 207, 268, 322].includes(index))
  .map((item) => item.id);

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [answeredCount, setAnsweredCount] = useState(428);
  const [correctCount, setCorrectCount] = useState(347);
  const [todayCount, setTodayCount] = useState(17);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<number[]>(seedWrongIds);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([questions[1]?.id, questions[8]?.id].filter(Boolean));

  const value = {
    answeredCount,
    correctCount,
    todayCount,
    streakDays: 8,
    wrongQuestionIds,
    bookmarkedIds,
    recentExamScore: 94,
    continueIndex: 286,
    toggleBookmark(questionId: number) {
      setBookmarkedIds((current) =>
        current.includes(questionId)
          ? current.filter((item) => item !== questionId)
          : [...current, questionId]
      );
    },
    submitAnswer(questionId: number, isCorrect: boolean) {
      setAnsweredCount((current) => current + 1);
      setTodayCount((current) => current + 1);
      if (isCorrect) {
        setCorrectCount((current) => current + 1);
        return;
      }
      setWrongQuestionIds((current) =>
        current.includes(questionId) ? current : [questionId, ...current]
      );
    }
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
}
