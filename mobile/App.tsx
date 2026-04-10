import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { QuizProvider } from "./src/providers/QuizProvider";
import { navigationTheme } from "./src/theme/theme";

export default function App() {
  return (
    <SafeAreaProvider>
      <QuizProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </QuizProvider>
    </SafeAreaProvider>
  );
}
