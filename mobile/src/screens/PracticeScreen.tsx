import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

import { QuestionOption } from "../components/QuestionOption";
import { getQuestionsByIds, questions } from "../data/questions";
import { useQuiz } from "../providers/QuizProvider";
import { colors, radii, shadows, spacing } from "../theme/tokens";
import type { RootStackParamList } from "../types/navigation";

type PracticeRoute = RouteProp<RootStackParamList, "PracticeQuestion">;

type AnswerState = {
  selectedIndex: number | null;
  revealed: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const PAGE_WIDTH = SCREEN_WIDTH;

export function PracticeScreen() {
  const navigation = useNavigation();
  const route = useRoute<PracticeRoute>();
  const quiz = useQuiz();
  const listRef = useRef<FlatList>(null);

  const questionPool = useMemo(() => {
    if (route.params?.questionIds) {
      return getQuestionsByIds(route.params.questionIds);
    }
    if (route.params?.chapter) {
      return questions.filter((item) => item.chapter === route.params?.chapter);
    }
    return questions;
  }, [route.params?.chapter, route.params?.questionIds]);

  const initialPointer =
    route.params?.questionIds
      ? 0
      : typeof route.params?.startIndex === "number" && route.params.startIndex < questionPool.length
        ? route.params.startIndex
        : 0;

  const [pointer, setPointer] = useState(initialPointer);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});

  const currentQuestion = questionPool[pointer] || questionPool[0];
  const progress = questionPool.length ? ((pointer + 1) / questionPool.length) * 100 : 0;
  const currentAnswerState = answers[currentQuestion?.id] || { selectedIndex: null, revealed: false };

  function updateAnswer(questionId: number, patch: Partial<AnswerState>) {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        selectedIndex: current[questionId]?.selectedIndex ?? null,
        revealed: current[questionId]?.revealed ?? false,
        ...patch
      }
    }));
  }

  function submitAnswer() {
    if (!currentQuestion || currentAnswerState.selectedIndex === null || currentAnswerState.revealed) {
      return;
    }

    const isCorrect = currentAnswerState.selectedIndex === currentQuestion.correctIndex;
    updateAnswer(currentQuestion.id, { revealed: true });
    quiz.submitAnswer(currentQuestion.id, isCorrect);
  }

  function goToNext() {
    if (pointer >= questionPool.length - 1) {
      navigation.goBack();
      return;
    }
    const next = pointer + 1;
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setPointer(next);
  }

  function handleMomentumEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
    if (!Number.isNaN(nextIndex)) {
      setPointer(Math.max(0, Math.min(nextIndex, questionPool.length - 1)));
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{route.params?.title || "顺序练习"}</Text>
          <Text style={styles.headerMeta}>
            {pointer + 1}/{questionPool.length}
          </Text>
        </View>
        <Pressable onPress={() => quiz.toggleBookmark(currentQuestion.id)} style={styles.headerIcon}>
          <Ionicons
            name={quiz.bookmarkedIds.includes(currentQuestion.id) ? "bookmark" : "bookmark-outline"}
            size={20}
            color={colors.primary}
          />
        </Pressable>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Animated.View entering={FadeInDown.duration(220)} style={styles.swipeHint}>
        <Ionicons name="swap-horizontal-outline" size={16} color={colors.primary} />
        <Text style={styles.swipeHintText}>左右滑动切题</Text>
      </Animated.View>

      <FlatList
        ref={listRef}
        data={questionPool}
        style={styles.list}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        disableIntervalMomentum
        bounces={false}
        overScrollMode="never"
        snapToInterval={PAGE_WIDTH}
        snapToAlignment="start"
        keyExtractor={(item) => String(item.id)}
        getItemLayout={(_, index) => ({
          length: PAGE_WIDTH,
          offset: PAGE_WIDTH * index,
          index
        })}
        initialScrollIndex={initialPointer}
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollToIndexFailed={() => {
          listRef.current?.scrollToOffset({ offset: initialPointer * PAGE_WIDTH, animated: false });
        }}
        renderItem={({ item }) => {
          const answerState = answers[item.id] || { selectedIndex: null, revealed: false };
          const isCorrect = answerState.selectedIndex === item.correctIndex;

          return (
            <View style={styles.page}>
              <ScrollView
                style={styles.pageScroll}
                contentContainerStyle={styles.pageContent}
                showsVerticalScrollIndicator={false}
              >
                <Animated.View entering={FadeInRight.duration(220)} style={styles.questionCard}>
                  <View style={styles.questionTop}>
                    <Text style={styles.questionBadge}>{item.type === "boolean" ? "判断题" : "单选题"}</Text>
                    <Text style={styles.questionOrder}>题号 {item.displayOrder}</Text>
                  </View>
                  <Text style={styles.questionTitle}>{item.question}</Text>
                </Animated.View>

                <View style={styles.optionsWrap}>
                  {item.options.map((option: string, index: number) => (
                    <QuestionOption
                      key={`${item.id}-${index}`}
                      index={index}
                      text={option}
                      selected={answerState.selectedIndex === index}
                      correct={answerState.revealed && item.correctIndex === index}
                      incorrect={
                        answerState.revealed &&
                        answerState.selectedIndex === index &&
                        item.correctIndex !== index
                      }
                      disabled={answerState.revealed}
                      onPress={() => updateAnswer(item.id, { selectedIndex: index })}
                    />
                  ))}
                </View>

                {answerState.revealed ? (
                  <Animated.View
                    entering={FadeInDown.duration(200)}
                    style={[styles.analysisCard, isCorrect ? styles.successCard : styles.dangerCard]}
                  >
                    <Text style={[styles.analysisPill, isCorrect ? styles.successPill : styles.dangerPill]}>
                      {isCorrect ? "正确" : "错误"}
                    </Text>
                    <Text style={styles.analysisLine}>正确答案：{String.fromCharCode(65 + item.correctIndex)}</Text>
                    <Text style={styles.analysisText}>{item.explanation}</Text>
                  </Animated.View>
                ) : null}
              </ScrollView>
            </View>
          );
        }}
      />

      <View style={styles.bottomBar}>
        <View style={styles.bottomStats}>
          <Stat label="收藏" value={`${quiz.bookmarkedIds.length}`} />
          <Stat label="答对" value={`${quiz.correctCount}`} />
          <Stat label="错题" value={`${quiz.wrongQuestionIds.length}`} />
        </View>
        {!currentAnswerState.revealed ? (
          <Pressable
            style={[styles.primaryButton, currentAnswerState.selectedIndex === null ? styles.disabledButton : null]}
            onPress={submitAnswer}
            disabled={currentAnswerState.selectedIndex === null}
          >
            <Text style={styles.primaryButtonText}>提交答案</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.primaryButton} onPress={goToNext}>
            <Text style={styles.primaryButtonText}>
              {pointer === questionPool.length - 1 ? "完成本轮练习" : "滑到下一题 / 点此继续"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm
  },
  headerIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill
  },
  headerCenter: {
    alignItems: "center",
    gap: 2
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text
  },
  headerMeta: {
    fontSize: 12,
    color: colors.textMuted
  },
  progressTrack: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    height: 4,
    backgroundColor: "#E8F7F3",
    borderRadius: radii.pill,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#38D5C3",
    borderRadius: radii.pill
  },
  swipeHint: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  swipeHintText: {
    fontSize: 13,
    color: colors.textMuted
  },
  list: {
    flex: 1
  },
  page: {
    width: PAGE_WIDTH,
    flex: 1
  },
  pageScroll: {
    flex: 1
  },
  pageContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "#E7EEF2",
    ...shadows.card
  },
  questionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm
  },
  questionBadge: {
    backgroundColor: "#E8FBF6",
    color: "#1BAA95",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    overflow: "hidden",
    fontWeight: "700",
    fontSize: 12
  },
  questionOrder: {
    fontSize: 12,
    color: colors.textMuted
  },
  questionTitle: {
    fontSize: 26,
    lineHeight: 38,
    color: colors.text,
    fontWeight: "700"
  },
  optionsWrap: {
    gap: spacing.sm
  },
  analysisCard: {
    borderRadius: 18,
    padding: spacing.md,
    gap: spacing.sm
  },
  successCard: {
    backgroundColor: "#ECFBF2"
  },
  dangerCard: {
    backgroundColor: "#FFF4EE"
  },
  analysisPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    overflow: "hidden",
    fontWeight: "700",
    fontSize: 12
  },
  successPill: {
    backgroundColor: "#DDF6E7",
    color: "#1F8B55"
  },
  dangerPill: {
    backgroundColor: "#FFE0D0",
    color: "#D46B2B"
  },
  analysisLine: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text
  },
  analysisText: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.text
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#EEF2F7",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    backgroundColor: "#FFFFFF"
  },
  bottomStats: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  statItem: {
    alignItems: "center",
    flex: 1
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted
  },
  primaryButton: {
    backgroundColor: "#FFCA55",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "#5B4200",
    fontSize: 16,
    fontWeight: "700"
  },
  disabledButton: {
    opacity: 0.45
  }
});
