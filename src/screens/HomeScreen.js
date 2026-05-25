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

import colors from "../theme/colors";
import { useAppTheme } from "../theme/ThemeContext";
import { transactions, categories, allCategories } from "../data/mockData";
import { formatCurrency } from "../utils/formatCurrency";

function HomeCard({ children, style, theme }) {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }, style]}>
      {children}
    </View>
  );
}

function SummaryBox({ icon, label, amount, color, subtitle, theme, isDarkMode }) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
      <View
        style={[
          styles.summaryIcon,
          {
            backgroundColor: isDarkMode ? "#203029" : `${color}18`,
          },
        ]}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>

      <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>
        {label}
      </Text>

      <Text style={[styles.summaryAmount, { color }]}>{amount}</Text>

      <Text style={[styles.summarySubtitle, { color: theme.textMuted }]}>
        {subtitle}
      </Text>
    </View>
  );
}

function TransactionRow({ item, theme, isDarkMode, onPress }) {
  const isIncome = item.amount > 0;

  return (
    <TouchableOpacity
      style={[styles.transactionRow, { backgroundColor: theme.card }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.transactionIcon,
          {
            backgroundColor: isDarkMode ? "#24313A" : item.bg,
          },
        ]}
      >
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>

      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionTitle, { color: theme.text }]}>
          {item.title}
        </Text>

        <Text style={[styles.transactionTime, { color: theme.textMuted }]}>
          {item.time}
        </Text>
      </View>

      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            {
              color: isIncome ? theme.primary : colors.expense,
            },
          ]}
        >
          {isIncome ? "+ " : "- "}
          {formatCurrency(Math.abs(item.amount))}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={16}
          color={theme.textMuted}
          style={styles.transactionChevron}
        />
      </View>
    </TouchableOpacity>
  );
}

function CategoryShortcut({ item, onPress, theme, isDarkMode }) {
  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View
        style={[
          styles.categoryIcon,
          {
            backgroundColor: isDarkMode ? "#24313A" : item.bg,
          },
        ]}
      >
        <Ionicons name={item.icon} size={22} color={item.color} />
      </View>

      <Text style={[styles.categoryText, { color: theme.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { theme, isDarkMode } = useAppTheme();

  const [showBalance, setShowBalance] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const visibleTransactions = selectedCategory
    ? transactions.filter((item) => item.category === selectedCategory)
    : transactions.slice(0, 3);

  const handleCategoryPress = (category) => {
    if (category.name === "Otros") {
      setShowCategoriesModal(true);
      return;
    }

    setSelectedCategory((current) =>
      current === category.name ? null : category.name
    );
  };

  const handleModalCategoryPress = (category) => {
    setSelectedCategory(category.name);
    setShowCategoriesModal(false);
  };

  const openTransactionDetail = (item) => {
    navigation.navigate("TransactionDetail", {
      transaction: {
        ...item,
        description:
          item.description ||
          `Movimiento registrado desde el dashboard de FinTrack.`,
        paymentMethod: item.paymentMethod || "No especificado",
        reference: item.reference || "Sin comprobante asociado",
        date: item.date || "20 de mayo de 2026",
      },
    });
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hola, Diego 👋
            </Text>

            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Bienvenido de nuevo
            </Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={[
                styles.notification,
                {
                  backgroundColor: theme.card,
                },
              ]}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={theme.text}
              />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.avatar, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate("Perfil")}
            >
              <Text style={styles.avatarText}>DL</Text>
            </TouchableOpacity>
          </View>
        </View>

        <HomeCard
          theme={theme}
          style={[
            styles.balanceCard,
            {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <View style={styles.balanceTop}>
            <Text style={styles.balanceLabel}>Saldo total</Text>

            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Ionicons
                name={showBalance ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceAmount}>
            {showBalance ? "S/ 2,450.00" : "S/ *****"}
          </Text>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigation.navigate("Historial")}
          >
            <Text style={styles.detailText}>Ver detalle</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </HomeCard>

        <View style={styles.summaryRow}>
          <SummaryBox
            icon="arrow-down-outline"
            label="Ingresos"
            amount="S/ 3,200.00"
            color={theme.primary}
            subtitle="+12% vs mes anterior"
            theme={theme}
            isDarkMode={isDarkMode}
          />

          <View style={{ width: 12 }} />

          <SummaryBox
            icon="arrow-up-outline"
            label="Gastos"
            amount="S/ 750.00"
            color={colors.expense}
            subtitle="-8% vs mes anterior"
            theme={theme}
            isDarkMode={isDarkMode}
          />
        </View>

        <HomeCard theme={theme} style={styles.budgetCard}>
          <View style={styles.sectionBetween}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Presupuesto mensual
            </Text>

            <Text style={[styles.percent, { color: theme.primary }]}>60%</Text>
          </View>

          <Text style={[styles.budgetText, { color: theme.textMuted }]}>
            S/ 1,200.00 de S/ 2,000.00
          </Text>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: isDarkMode ? "#2B3A32" : "#DDEFE5",
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: "60%",
                },
              ]}
            />
          </View>
        </HomeCard>

        <View style={styles.sectionBetween}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Últimos movimientos
            </Text>

            {selectedCategory && (
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: theme.primaryLight,
                  },
                ]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[styles.filterText, { color: theme.primary }]}>
                  {selectedCategory}
                </Text>

                <Ionicons name="close" size={14} color={theme.primary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Historial")}>
            <Text style={[styles.link, { color: theme.primary }]}>
              Ver todos
            </Text>
          </TouchableOpacity>
        </View>

        {visibleTransactions.length > 0 ? (
          visibleTransactions.map((item) => (
            <TransactionRow
              key={item.id}
              item={item}
              theme={theme}
              isDarkMode={isDarkMode}
              onPress={() => openTransactionDetail(item)}
            />
          ))
        ) : (
          <HomeCard theme={theme} style={styles.emptyCard}>
            <Ionicons
              name="file-tray-outline"
              size={28}
              color={theme.textMuted}
            />

            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No hay movimientos para esta categoría.
            </Text>
          </HomeCard>
        )}

        <View style={styles.sectionHeaderOnly}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Categorías rápidas
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
        >
          {categories.map((item) => (
            <CategoryShortcut
              key={item.id}
              item={item}
              theme={theme}
              isDarkMode={isDarkMode}
              onPress={() => handleCategoryPress(item)}
            />
          ))}
        </ScrollView>

        <View style={{ height: 105 }} />
      </ScrollView>

      <Modal
        visible={showCategoriesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoriesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.card,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Todas las categorías
              </Text>

              <TouchableOpacity onPress={() => setShowCategoriesModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
              Selecciona una categoría para filtrar tus movimientos.
            </Text>

            <View style={styles.modalGrid}>
              {allCategories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalCategory}
                  onPress={() => handleModalCategoryPress(item)}
                >
                  <View
                    style={[
                      styles.modalIconCircle,
                      {
                        backgroundColor: isDarkMode ? "#24313A" : item.bg,
                      },
                    ]}
                  >
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>

                  <Text
                    style={[styles.modalCategoryText, { color: theme.text }]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
    paddingTop: 50,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  notification: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#EF4444",
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  balanceCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 22,
  },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    color: "#E8FFF2",
    fontSize: 14,
    fontWeight: "700",
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 14,
  },
  detailButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginRight: 4,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: "900",
  },
  summarySubtitle: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "600",
  },
  budgetCard: {
    marginBottom: 22,
  },
  sectionBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sectionHeaderOnly: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
  },
  link: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  percent: {
    fontSize: 14,
    fontWeight: "900",
  },
  budgetText: {
    fontSize: 13,
    marginBottom: 12,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 20,
  },
  transactionRow: {
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
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "900",
  },
  transactionTime: {
    marginTop: 3,
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "900",
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  transactionChevron: {
    marginTop: 4,
  },
  categories: {
    marginTop: 2,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 18,
  },
  categoryIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
  },
  filterPill: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "800",
    marginRight: 4,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 12,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  modalSubtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 13,
  },
  modalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  modalCategory: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
});