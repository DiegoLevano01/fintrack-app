import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";
import { useAppTheme } from "../theme/ThemeContext";

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
  {
    id: "4",
    icon: "calendar-outline",
    title: "Revisión mensual pendiente",
    message: "Recuerda revisar tus gastos antes de cerrar el mes.",
    time: "18 mayo",
    color: "#F59E0B",
    bg: "#FFF4CC",
  },
];

export default function NotificationsScreen({ navigation }) {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.primary }]}>
          Notificaciones
        </Text>

        <View style={styles.placeholder} />
      </View>

      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Alertas importantes sobre tus gastos, presupuesto y movimientos.
      </Text>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: theme.primaryLight,
          },
        ]}
      >
        <View
          style={[
            styles.summaryIcon,
            {
              backgroundColor: isDarkMode ? "#24313A" : "#FFFFFF",
            },
          ]}
        >
          <Ionicons name="notifications" size={22} color={theme.primary} />
        </View>

        <View style={styles.summaryInfo}>
          <Text style={[styles.summaryTitle, { color: theme.primary }]}>
            4 alertas recientes
          </Text>

          <Text style={[styles.summaryText, { color: theme.text }]}>
            Revisa tus avisos financieros para mantener mejor control de tu
            presupuesto.
          </Text>
        </View>
      </View>

      {notifications.map((item) => (
        <View
          key={item.id}
          style={[
            styles.notificationCard,
            {
              backgroundColor: theme.card,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isDarkMode ? "#24313A" : item.bg,
              },
            ]}
          >
            <Ionicons name={item.icon} size={22} color={item.color} />
          </View>

          <View style={styles.notificationInfo}>
            <Text style={[styles.notificationTitle, { color: theme.text }]}>
              {item.title}
            </Text>

            <Text
              style={[
                styles.notificationMessage,
                {
                  color: theme.textMuted,
                },
              ]}
            >
              {item.message}
            </Text>

            <Text style={[styles.notificationTime, { color: theme.primary }]}>
              {item.time}
            </Text>
          </View>

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item.id === "1" || item.id === "2"
                    ? theme.primary
                    : isDarkMode
                    ? "#3A424C"
                    : "#D1D5DB",
              },
            ]}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.markAllButton,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="checkmark-done-outline" size={18} color={theme.primary} />

        <Text style={[styles.markAllText, { color: theme.primary }]}>
          Marcar todas como leídas
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 30,
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
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  placeholder: {
    width: 42,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  summaryCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  notificationCard: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  notificationInfo: {
    flex: 1,
    paddingRight: 10,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "900",
  },
  notificationMessage: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  notificationTime: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "900",
  },
  statusDot: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  markAllButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  markAllText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "900",
  },
});