import { StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { useQuiz } from "../providers/QuizProvider";
import { colors, radii, spacing } from "../theme/tokens";

export function ProfileScreen() {
  const quiz = useQuiz();
  const accuracy = Math.round((quiz.correctCount / quiz.answeredCount) * 100);

  return (
    <Screen>
      <SectionHeader
        eyebrow="我的"
        title="学习记录"
        description="这里先承接个人学习数据，后续可以扩展登录、云同步、会员和提醒体系。"
      />

      <View style={styles.grid}>
        <StatCard label="累计答题" value={`${quiz.answeredCount}`} />
        <StatCard label="正确率" value={`${accuracy}%`} />
      </View>
      <View style={styles.grid}>
        <StatCard label="今日答题" value={`${quiz.todayCount}`} />
        <StatCard label="最近模考" value={`${quiz.recentExamScore} 分`} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>下一阶段可扩展</Text>
        <Text style={styles.cardText}>1. 登录与云同步</Text>
        <Text style={styles.cardText}>2. 收藏题目与学习笔记</Text>
        <Text style={styles.cardText}>3. 会员强化题库与冲刺计划</Text>
        <Text style={styles.cardText}>4. 科目四与多地区题库扩展</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted
  }
});
