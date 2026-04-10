import { DefaultTheme } from "@react-navigation/native";

import { colors } from "./tokens";

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accentStrong,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.accent
  }
};
