import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";
import { getQuestionsByIds } from "../data/questions";
import { useQuiz } from "../providers/QuizProvider";
import { colors, radii, shadows, spacing } from "../theme/tokens";
import type { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function WrongBookScreen() {
  const navigation = useNavigation<NavigationProp>();
  const quiz = useQuiz();
  const wrongQuestions = getQuestionsByIds(quiz.wrongQuestionIds);

  return (
    <Screen>
      <SectionHeader
        eyebrow="错题本"
        title={`${wrongQuestions.length} 题待复习`}
        description="自动归集近阶段做错的题目，帮助用户重复强化而不是无差别刷整套题。"
      />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryValue}>{wrongQuestions.length}</Text>
        <Text style={styles.summaryText}>建议先完成一轮错题回练，再回到模考验证修正效果。</Text>
        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("PracticeQuestion", {
              questionIds: quiz.wrongQuestionIds,
              title: "错题回练"
            })
          }
        >
          <Text style={styles.primaryButtonText}>开始错题回练</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {wrongQuestions.slice(0, 8).map((question) => (
          <View key={question.id} style={styles.itemCard}>
            <Text style={styles.itemTitle}>{question.question}</Text>
            <Text style={styles.itemMeta}>
              第 {question.displayOrder} 题 · 章节 {question.chapter}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.text
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted
  },
  primaryButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 15,
    alignItems: "center"
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700"
  },
  list: {
    gap: spacing.sm
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    fontWeight: "600"
  },
  itemMeta: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textMuted
  }
});
