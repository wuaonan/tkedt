export type RootStackParamList = {
  MainTabs: undefined;
  PracticeQuestion:
    | {
        startIndex?: number;
        chapter?: number;
        questionIds?: number[];
        title?: string;
      }
    | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Chapters: undefined;
  MockExam: undefined;
  WrongBook: undefined;
  Profile: undefined;
};
