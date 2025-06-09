import React from "react";
import { Tabs } from "expo-router";
import {   MaterialCommunityIcons, 
  FontAwesome, 
  Feather, 
  Entypo, 
  Ionicons } from "@expo/vector-icons";

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
  { name: "index", title: "Home", icon: (props: any) => <Feather name="home" {...props} /> },
  { name: "location", title: "Location", icon: (props: any) => <Feather name="map-pin" {...props} /> },
  { name: "contacts", title: "Contacts", icon: (props: any) => <Feather name="users" {...props} /> },
  { name: "settings", title: "Settings", icon: (props: any) => <Feather name="settings" {...props} /> },
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
      {tabScreens.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }: { color: string }) => icon({ size: 24, color }),
          }}
        />
      ))}
    </Tabs>
  );
}
