export type QuizQuestionType = "single" | "boolean";

export type QuizQuestion = {
  id: number;
  displayOrder: number;
  question: string;
  type: QuizQuestionType;
  options: string[];
  correctIndex: number;
  chapter: number;
  explanation: string;
  imageUrl: string | null;
};

export type ChapterSummary = {
  chapter: number;
  title: string;
  total: number;
  firstIndex: number;
};
