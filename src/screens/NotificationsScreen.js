import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";
import Card from "../components/Card";

const notifications = [
  {
    id: "1",
    icon: "wallet-outline",
    title: "Presupuesto al 50%",
    message: "Ya utilizaste el 50% de tu presupuesto mensual.",
    time: "Hace 10 min",
    color: "#00924B",
    bg: "#E8F7EF",
  },
  {
    id: "2",
    icon: "alert-circle-outline",
    title: "Gasto elevado detectado",
    message: "Tus gastos en comida aumentaron esta semana.",
    time: "Hoy, 9:30 am",
    color: "#D62828",
    bg: "#FDE2E2",
  },
  {
    id: "3",
    icon: "trending-up-outline",
    title: "Buen avance de ahorro",
    message: "Vas por buen camino para cumplir tu meta mensual.",
    time: "Ayer",
    color: "#2563EB",
    bg: "#E7F0FF",
  },
];

export default function NotificationsScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Notificaciones</Text>

        <View style={styles.placeholder} />
      </View>

      <Text style={styles.subtitle}>
        Alertas importantes sobre tus gastos, presupuesto y movimientos.
      </Text>

      {notifications.map((item) => (
        <Card key={item.id} style={styles.notificationCard}>
          <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
            <Ionicons name={item.icon} size={22} color={item.color} />
          </View>

          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSoft,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 42,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  notificationMessage: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  notificationTime: {
    marginTop: 6,
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
  },
});