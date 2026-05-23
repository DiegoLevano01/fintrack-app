import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../theme/colors";
import { formatCurrency } from "../utils/formatCurrency";

export default function TransactionItem({ item }) {
  const isIncome = item.amount > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon} size={18} color={item.color} />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? "+ " : "- "}
        {formatCurrency(Math.abs(item.amount))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  time: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 12,
  },
  amount: {
    fontSize: 14,
    fontWeight: "800",
  },
});