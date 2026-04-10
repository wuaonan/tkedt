export const colors = {
  primary: "#4F46E5",
  secondary: "#818CF8",
  accent: "#F97316",
  accentStrong: "#EA580C",
  background: "#EEF2FF",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF2FF",
  border: "#D9DEF8",
  text: "#1E1B4B",
  textMuted: "#5B5F8A",
  successSoft: "#E9F8EE",
  successText: "#20744A",
  dangerSoft: "#FFF1EA",
  dangerText: "#B45309",
  overlay: "rgba(79, 70, 229, 0.08)"
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999
} as const;

export const shadows = {
  card: {
    shadowColor: "#8B93F8",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  }
};
