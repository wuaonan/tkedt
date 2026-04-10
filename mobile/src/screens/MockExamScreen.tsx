import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";
import { useQuiz } from "../providers/QuizProvider";
import { colors, radii, shadows, spacing } from "../theme/tokens";
import type { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function MockExamScreen() {
  const navigation = useNavigation<NavigationProp>();
  const quiz = useQuiz();

  return (
    <Screen>
      <SectionHeader
        eyebrow="模拟考试"
        title="像真考一样完成一次完整测验"
        description="MVP 阶段先把结果页和错题导流做清楚，后面再接入正式倒计时和答题卡。"
      />

      <View style={styles.resultCard}>
        <View style={styles.ring}>
          <Text style={styles.score}>{quiz.recentExamScore}</Text>
          <Text style={styles.scoreMeta}>本次成绩</Text>
        </View>
        <Text style={styles.resultTitle}>还差一点就能稳定通过</Text>
        <Text style={styles.resultCopy}>
          标志题和处罚题仍然是主要失分点，建议优先回到错题本再做一轮有针对性的练习。
        </Text>
      </View>

      <View style={styles.metricGrid}>
        <Metric label="用时" value="27:16" />
        <Metric label="错题数" value="3 题" />
        <Metric label="建议复习" value="处罚规则" />
        <Metric label="通过概率" value="78%" />
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate("PracticeQuestion", {
            questionIds: quiz.wrongQuestionIds,
            title: "模考错题回练"
          })
        }
      >
        <Text style={styles.primaryButtonText}>进入错题回练</Text>
      </Pressable>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.md,
    ...shadows.card
  },
  ring: {
    width: 160,
    height: 160,
    borderRadius: radii.pill,
    borderWidth: 12,
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF4EC"
  },
  score: {
    fontSize: 44,
    fontWeight: "700",
    color: colors.text
  },
  scoreMeta: {
    fontSize: 14,
    color: colors.textMuted
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text
  },
  resultCopy: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: "center"
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  metricCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  metricLabel: {
    fontSize: 13,
    color: colors.textMuted
  },
  metricValue: {
    marginTop: spacing.xs,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 16,
    alignItems: "center"
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700"
  }
});
