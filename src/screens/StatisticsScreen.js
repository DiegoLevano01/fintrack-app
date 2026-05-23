import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import * as Sentry from "@sentry/react-native";

import colors from "../theme/colors";
import { useAppTheme } from "../theme/ThemeContext";

const months = ["Mayo 2026", "Junio 2026", "Julio 2026"];

const categoryStats = [
  {
    name: "Comida",
    amount: 300,
    percent: 40,
    color: "#00924B",
  },
  {
    name: "Transporte",
    amount: 150,
    percent: 20,
    color: "#2563EB",
  },
  {
    name: "Servicios",
    amount: 120,
    percent: 16,
    color: "#22C55E",
  },
  {
    name: "Ocio",
    amount: 90,
    percent: 12,
    color: "#EF4444",
  },
  {
    name: "Otros",
    amount: 90,
    percent: 12,
    color: "#6B7280",
  },
];

function StatCard({ children, style, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }, style]}>
      {children}
    </View>
  );
}

function DonutChart({ theme, isDarkMode }) {
  const size = 150;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <View style={styles.chartWrapper}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDarkMode ? "#2A3139" : "#EEF1F5"}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {categoryStats.map((item) => {
          const strokeDasharray = `${
            (item.percent / 100) * circumference
          } ${circumference}`;

          const strokeDashoffset = -accumulatedPercent * circumference;

          accumulatedPercent += item.percent / 100;

          return (
            <Circle
              key={item.name}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={item.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          );
        })}
      </Svg>

      <View style={styles.chartCenter}>
        <Text style={[styles.chartCenterLabel, { color: theme.textMuted }]}>
          Total
        </Text>

        <Text style={[styles.chartCenterAmount, { color: theme.text }]}>
          S/ 750.00
        </Text>
      </View>
    </View>
  );
}

export default function StatisticsScreen() {
  const { theme, isDarkMode } = useAppTheme();

  const [selectedMonth, setSelectedMonth] = useState("Mayo 2026");
  const [showMonthModal, setShowMonthModal] = useState(false);

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setShowMonthModal(false);

    Sentry.captureMessage(`Mes seleccionado en estadísticas: ${month}`);
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.primary }]}>
            Estadísticas
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.monthSelector,
            {
              backgroundColor: theme.card,
            },
          ]}
          onPress={() => setShowMonthModal(true)}
        >
          <View style={styles.monthLeft}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.primary}
            />

            <Text style={[styles.monthText, { color: theme.text }]}>
              {selectedMonth}
            </Text>
          </View>

          <Ionicons name="chevron-down" size={18} color={theme.textMuted} />
        </TouchableOpacity>

        <View style={styles.summaryRow}>
          <StatCard theme={theme} style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>
              Ingresos
            </Text>

            <Text style={[styles.incomeAmount, { color: theme.primary }]}>
              S/ 3,200.00
            </Text>
          </StatCard>

          <View style={{ width: 12 }} />

          <StatCard theme={theme} style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>
              Gastos
            </Text>

            <Text style={styles.expenseAmount}>S/ 750.00</Text>
          </StatCard>
        </View>

        <StatCard theme={theme} style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            GASTOS POR CATEGORÍA
          </Text>

          <DonutChart theme={theme} isDarkMode={isDarkMode} />

          <View style={styles.legend}>
            {categoryStats.map((item) => (
              <View key={item.name} style={styles.legendRow}>
                <View style={styles.legendLeft}>
                  <View
                    style={[
                      styles.legendDot,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  />

                  <Text style={[styles.legendName, { color: theme.text }]}>
                    {item.name}
                  </Text>
                </View>

                <View style={styles.legendRight}>
                  <Text style={[styles.legendAmount, { color: theme.text }]}>
                    S/ {item.amount.toFixed(2)}
                  </Text>

                  <Text
                    style={[styles.legendPercent, { color: theme.textMuted }]}
                  >
                    {item.percent}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </StatCard>

        <StatCard
          theme={theme}
          style={[
            styles.insightCard,
            {
              backgroundColor: theme.primaryLight,
            },
          ]}
        >
          <View
            style={[
              styles.insightIcon,
              {
                backgroundColor: isDarkMode ? "#24313A" : "#FFFFFF",
              },
            ]}
          >
            <Ionicons name="bulb-outline" size={22} color={theme.primary} />
          </View>

          <View style={styles.insightInfo}>
            <Text style={[styles.insightTitle, { color: theme.primary }]}>
              Análisis del mes
            </Text>

            <Text style={[styles.insightText, { color: theme.text }]}>
              Tu mayor gasto fue en comida. Puedes reducirlo planificando tus
              compras semanales.
            </Text>
          </View>
        </StatCard>

        <View style={{ height: 105 }} />
      </ScrollView>

      <Modal
        visible={showMonthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.monthModal, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Seleccionar mes
              </Text>

              <TouchableOpacity onPress={() => setShowMonthModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {months.map((month) => {
              const selected = selectedMonth === month;

              return (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthOption,
                    {
                      backgroundColor: selected
                        ? theme.primaryLight
                        : isDarkMode
                        ? "#222A31"
                        : "#F6F8F7",
                    },
                  ]}
                  onPress={() => handleSelectMonth(month)}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      {
                        color: selected ? theme.primary : theme.text,
                      },
                    ]}
                  >
                    {month}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={theme.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
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
    alignItems: "center",
    marginBottom: 26,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  monthSelector: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  monthLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  incomeAmount: {
    fontSize: 17,
    fontWeight: "900",
  },
  expenseAmount: {
    color: colors.expense,
    fontSize: 17,
    fontWeight: "900",
  },
  statsCard: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 18,
  },
  chartWrapper: {
    alignSelf: "center",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  chartCenter: {
    position: "absolute",
    alignItems: "center",
  },
  chartCenterLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  chartCenterAmount: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "900",
  },
  legend: {
    marginTop: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendName: {
    fontSize: 13,
    fontWeight: "700",
  },
  legendRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: "800",
    marginRight: 8,
  },
  legendPercent: {
    fontSize: 12,
    fontWeight: "700",
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  monthModal: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 22,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  monthOption: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthOptionText: {
    fontSize: 14,
    fontWeight: "800",
  },
});