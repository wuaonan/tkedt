import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "../components/Screen";
import { SectionHeader } from "../components/SectionHeader";
import { chapterSummaries } from "../data/questions";
import { colors, radii, shadows, spacing } from "../theme/tokens";
import type { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ChaptersScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Screen>
      <SectionHeader
        eyebrow="专项练习"
        title="按章节突破薄弱点"
        description="适合用户在碎片时间内做针对性刷题，把高频易错题拆成更好消化的训练单元。"
      />

      <View style={styles.list}>
        {chapterSummaries.map((chapter, index) => (
          <Pressable
            key={chapter.chapter}
            style={styles.card}
            onPress={() =>
              navigation.navigate("PracticeQuestion", {
                startIndex: chapter.firstIndex,
                chapter: chapter.chapter,
                title: chapter.title
              })
            }
          >
            <View style={styles.left}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={index % 2 === 0 ? "book-outline" : "analytics-outline"}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.textWrap}>
                <Text style={styles.title}>{chapter.title}</Text>
                <Text style={styles.meta}>{chapter.total} 题 · 推荐训练时长 10-15 分钟</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.card
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  textWrap: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted
  }
});
