import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../theme/ThemeContext";

import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const icons = {
  Inicio: {
    focused: "home",
    unfocused: "home-outline",
  },
  Historial: {
    focused: "time",
    unfocused: "time-outline",
  },
  Estadísticas: {
    focused: "bar-chart",
    unfocused: "bar-chart-outline",
  },
  Perfil: {
    focused: "person",
    unfocused: "person-outline",
  },
};

function EmptyScreen() {
  return null;
}

export default function MainTabs() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.tabBar,
          },
        ],
        tabBarLabel: route.name === "Agregar" ? "" : undefined,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Agregar") {
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.addButton,
                  {
                    backgroundColor: theme.primary,
                  },
                ]}
                onPress={() => navigation.getParent()?.navigate("AddTransaction")}
              >
                <Ionicons name="add" size={34} color="#FFFFFF" />
              </TouchableOpacity>
            );
          }

          const iconSet = icons[route.name];
          const iconName = focused ? iconSet.focused : iconSet.unfocused;

          return <Ionicons name={iconName} size={size + 4} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />

      <Tab.Screen name="Historial" component={HistoryScreen} />

      <Tab.Screen
        name="Agregar"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.getParent()?.navigate("AddTransaction");
          },
        })}
      />

      <Tab.Screen name="Estadísticas" component={StatisticsScreen} />

      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 82,
    paddingTop: 8,
    paddingBottom: 14,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});