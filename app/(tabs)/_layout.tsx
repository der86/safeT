import React from "react";
import { Tabs } from "expo-router";
import { Home, MapPin, Users, Settings } from "lucide-react-native";

const Colors = {
  dark: {
    primary: "#007AFF",
    inactive: "#8E8E93",
    background: "#1C1C1E",
    border: "#3A3A3C",
    text: "#FFFFFF",
  },
};

const tabScreens = [
  { name: "index", title: "Home", icon: Home },
  { name: "location", title: "Location", icon: MapPin },
  { name: "contacts", title: "Contacts", icon: Users },
  { name: "settings", title: "Settings", icon: Settings },
];

const screenOptions = {
  tabBarActiveTintColor: Colors.dark.primary,
  tabBarInactiveTintColor: Colors.dark.inactive,
  tabBarStyle: {
    backgroundColor: Colors.dark.background,
    borderTopColor: Colors.dark.border,
  },
  tabBarLabelStyle: {
    fontSize: 12,
  },
  headerStyle: {
    backgroundColor: Colors.dark.background,
  },
  headerTintColor: Colors.dark.text,
  headerTitleStyle: {
    fontWeight: "bold" as "bold",
  },
};

export default function TabLayout() {
  return (
    <Tabs screenOptions={screenOptions}>
      {tabScreens.map(({ name, title, icon: Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }: { color: string }) => <Icon size={24} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
