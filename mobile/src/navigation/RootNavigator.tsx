import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";

import { ChaptersScreen } from "../screens/ChaptersScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { MockExamScreen } from "../screens/MockExamScreen";
import { PracticeScreen } from "../screens/PracticeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { WrongBookScreen } from "../screens/WrongBookScreen";
import { colors } from "../theme/tokens";
import type { MainTabParamList, RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();
const JsTab = createBottomTabNavigator<MainTabParamList>();
const NativeTab = createNativeBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return Platform.OS === "web" ? <WebTabs /> : <MobileNativeTabs />;
}

function WebTabs() {
  return (
    <JsTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#7A756C",
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.surface
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600" as const
        }
      }}
    >
      <JsTab.Screen name="Home" component={HomeScreen} options={{ title: "首页" }} />
      <JsTab.Screen name="Chapters" component={ChaptersScreen} options={{ title: "章节" }} />
      <JsTab.Screen name="MockExam" component={MockExamScreen} options={{ title: "模考" }} />
      <JsTab.Screen name="WrongBook" component={WrongBookScreen} options={{ title: "错题" }} />
      <JsTab.Screen name="Profile" component={ProfileScreen} options={{ title: "我的" }} />
    </JsTab.Navigator>
  );
}

function MobileNativeTabs() {
  return (
    <NativeTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#7A756C",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600" as const
        },
        tabBarStyle: {
          backgroundColor: colors.surface
        },
        tabBarBlurEffect: "systemDefault" as const,
        tabBarIcon: getNativeTabBarIcon(route.name)
      })}
    >
      <NativeTab.Screen name="Home" component={HomeScreen} options={{ title: "首页" }} />
      <NativeTab.Screen name="Chapters" component={ChaptersScreen} options={{ title: "章节" }} />
      <NativeTab.Screen name="MockExam" component={MockExamScreen} options={{ title: "模考" }} />
      <NativeTab.Screen name="WrongBook" component={WrongBookScreen} options={{ title: "错题" }} />
      <NativeTab.Screen name="Profile" component={ProfileScreen} options={{ title: "我的" }} />
    </NativeTab.Navigator>
  );
}

function getNativeTabBarIcon(routeName: keyof MainTabParamList): any {
  const iconMap = {
    Home: {
      ios: "house",
      android: "home"
    },
    Chapters: {
      ios: "square.grid.2x2",
      android: "grid_view"
    },
    MockExam: {
      ios: "doc.text",
      android: "article"
    },
    WrongBook: {
      ios: "exclamationmark.circle",
      android: "error"
    },
    Profile: {
      ios: "person",
      android: "person"
    }
  } as const;

  if (Platform.OS === "ios") {
    return ({ focused }: { focused: boolean }) => ({
      type: "sfSymbol" as const,
      name: focused ? `${iconMap[routeName].ios}.fill` : iconMap[routeName].ios
    });
  }

  return {
    type: "materialSymbol" as const,
    name: iconMap[routeName].android
  };
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "fade_from_bottom",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "700"
        },
        contentStyle: {
          backgroundColor: colors.background
        }
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="PracticeQuestion"
        component={PracticeScreen}
        options={({ route }) => ({
          title: route.params?.title || "顺序练习"
        })}
      />
    </Stack.Navigator>
  );
}
