import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../theme/tokens";

export function QuestionOption({
  index,
  text,
  selected,
  correct,
  incorrect,
  disabled,
  onPress
}: {
  index: number;
  text: string;
  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.option,
        selected ? styles.selected : null,
        correct ? styles.correct : null,
        incorrect ? styles.incorrect : null,
        pressed && !disabled ? styles.pressed : null
      ]}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{String.fromCharCode(65 + index)}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: radii.md
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: "#FBF5E3"
  },
  correct: {
    borderColor: "#A6D6B4",
    backgroundColor: colors.successSoft
  },
  incorrect: {
    borderColor: "#E8B7A8",
    backgroundColor: colors.dangerSoft
  },
  pressed: {
    opacity: 0.88
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: {
    fontWeight: "700",
    color: colors.text
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 23,
    color: colors.text
  }
});
