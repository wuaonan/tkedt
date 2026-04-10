import { StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing } from "../theme/tokens";

export function StatCard({
  label,
  value,
  tone = "light"
}: {
  label: string;
  value: string;
  tone?: "light" | "accent";
}) {
  return (
    <View style={[styles.card, tone === "accent" ? styles.accentCard : null]}>
      <Text style={[styles.value, tone === "accent" ? styles.accentText : null]}>{value}</Text>
      <Text style={[styles.label, tone === "accent" ? styles.accentTextMuted : null]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card
  },
  accentCard: {
    backgroundColor: "#EEF0FF",
    borderColor: "#C7CCFF"
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text
  },
  label: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textMuted
  },
  accentText: {
    color: colors.primary
  },
  accentTextMuted: {
    color: colors.textMuted
  }
});
