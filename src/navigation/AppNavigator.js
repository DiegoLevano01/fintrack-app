import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}