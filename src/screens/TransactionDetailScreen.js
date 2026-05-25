import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";
import { useAppTheme } from "../theme/ThemeContext";
import { formatCurrency } from "../utils/formatCurrency";

function DetailRow({ icon, label, value, theme }) {
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: theme.primaryLight }]}>
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>

      <View style={styles.detailInfo}>
        <Text style={[styles.detailLabel, { color: theme.textMuted }]}>
          {label}
        </Text>

        <Text style={[styles.detailValue, { color: theme.text }]}>
          {value || "No especificado"}
        </Text>
      </View>
    </View>
  );
}

export default function TransactionDetailScreen({ navigation, route }) {
  const { theme, isDarkMode } = useAppTheme();

  const transaction = route?.params?.transaction || {
    title: "Comida",
    amount: -25,
    time: "Hoy, 12:30 pm",
    category: "Comida",
    icon: "fast-food-outline",
    color: "#EF6C45",
    bg: "#FDE9E3",
    description: "Almuerzo con amigos",
    paymentMethod: "Efectivo",
  };

  const isIncome = transaction.amount > 0;

  const typeLabel = isIncome ? "Ingreso" : "Gasto";
  const amountColor = isIncome ? theme.primary : colors.expense;

  const description =
    transaction.description ||
    transaction.detail ||
    `Movimiento registrado en la categoría ${
      transaction.category || transaction.title
    }.`;

  const paymentMethod =
    transaction.paymentMethod ||
    transaction.method ||
    (isIncome ? "No aplica" : "No especificado");

  const dateValue = transaction.date || transaction.fullDate || "20 de mayo de 2026";

  const timeValue = transaction.time || "No especificado";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerSide}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color={theme.primary} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.primary }]}>
          Detalle
        </Text>

        <View style={styles.headerSide} />
      </View>

      <View style={[styles.mainCard, { backgroundColor: theme.card }]}>
        <View
          style={[
            styles.mainIcon,
            {
              backgroundColor: isDarkMode
                ? "#24313A"
                : transaction.bg || "#E8F7EF",
            },
          ]}
        >
          <Ionicons
            name={transaction.icon || "receipt-outline"}
            size={38}
            color={transaction.color || theme.primary}
          />
        </View>

        <Text style={[styles.transactionTitle, { color: theme.text }]}>
          {transaction.title || transaction.category || "Movimiento"}
        </Text>

        <Text style={[styles.transactionType, { color: theme.textMuted }]}>
          {typeLabel}
        </Text>

        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncome ? "+ " : "- "}
          {formatCurrency(Math.abs(transaction.amount || 0))}
        </Text>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Información del movimiento
        </Text>

        <DetailRow
          icon="calendar-outline"
          label="Fecha"
          value={dateValue}
          theme={theme}
        />

        <DetailRow
          icon="time-outline"
          label="Hora"
          value={timeValue}
          theme={theme}
        />

        <DetailRow
          icon="pricetag-outline"
          label="Categoría"
          value={transaction.category || transaction.title}
          theme={theme}
        />

        <DetailRow
          icon={isIncome ? "trending-up-outline" : "trending-down-outline"}
          label="Tipo"
          value={typeLabel}
          theme={theme}
        />

        {!isIncome && (
          <DetailRow
            icon="wallet-outline"
            label="Método de pago"
            value={paymentMethod}
            theme={theme}
          />
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Descripción
        </Text>

        <Text style={[styles.description, { color: theme.textMuted }]}>
          {description}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-outline" size={18} color="#FFFFFF" />

        <Text style={styles.backButtonText}>Volver</Text>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  headerSide: {
    width: 42,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
  },
  mainCard: {
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  mainIcon: {
    width: 86,
    height: 86,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  transactionTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  transactionType: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
  },
  amount: {
    marginTop: 14,
    fontSize: 32,
    fontWeight: "900",
  },
  sectionCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  backButton: {
    height: 52,
    borderRadius: 16,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },
});