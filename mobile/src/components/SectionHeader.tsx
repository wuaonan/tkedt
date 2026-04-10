import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme/tokens";

export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: colors.textMuted,
    fontWeight: "600"
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: colors.text,
    fontWeight: "700"
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted
  }
});
