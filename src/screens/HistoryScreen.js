import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import colors from "../theme/colors";
import ButtonPrimary from "../components/ButtonPrimary";
import { transactions, allCategories } from "../data/mockData";
import { formatCurrency } from "../utils/formatCurrency";
import { useAppTheme } from "../theme/ThemeContext";

const groupedTransactions = [
  {
    date: "HOY - 20 DE MAYO",
    items: transactions.filter((item) =>
      ["Comida", "Transporte"].includes(item.title)
    ),
  },
  {
    date: "AYER - 19 DE MAYO",
    items: transactions.filter((item) =>
      ["Sueldo", "Alquiler", "Luz"].includes(item.title)
    ),
  },
  {
    date: "18 DE MAYO",
    items: transactions.filter((item) =>
      ["Cine", "Internet", "Farmacia"].includes(item.title)
    ),
  },
];

function TransactionRow({ item, theme, isDarkMode }) {
  const isIncome = item.amount > 0;

  return (
    <View style={[styles.transactionRow, { backgroundColor: theme.card }]}>
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
    </View>
  );
}

export default function HistoryScreen() {
  const { theme, isDarkMode } = useAppTheme();

  const [selectedFilter, setSelectedFilter] = useState("Hoy");
  const [search, setSearch] = useState("");

  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [showAmountModal, setShowAmountModal] = useState(false);

  const [movementType, setMovementType] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState("Recientes");

  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const filters = ["Hoy", "Semana", "Mes"];
  const movementTypes = ["Todos", "Ingresos", "Gastos"];
  const sortOptions = ["Recientes", "Mayor monto", "Menor monto"];

  const hasActiveFilters =
    movementType !== "Todos" ||
    selectedCategory !== "Todas" ||
    sortBy !== "Recientes" ||
    minAmount ||
    maxAmount;

  const getVisibleGroups = () => {
    let groups = groupedTransactions;

    if (selectedFilter === "Hoy") {
      groups = groupedTransactions.slice(0, 1);
    }

    if (selectedFilter === "Semana") {
      groups = groupedTransactions.slice(0, 2);
    }

    if (selectedFilter === "Mes") {
      groups = groupedTransactions;
    }

    const min = minAmount ? Number(minAmount) : null;
    const max = maxAmount ? Number(maxAmount) : null;

    return groups
      .map((group) => {
        let items = [...group.items];

        if (search.trim()) {
          items = items.filter((item) =>
            item.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (movementType === "Ingresos") {
          items = items.filter((item) => item.amount > 0);
        }

        if (movementType === "Gastos") {
          items = items.filter((item) => item.amount < 0);
        }

        if (selectedCategory !== "Todas") {
          items = items.filter((item) => item.category === selectedCategory);
        }

        if (min !== null) {
          items = items.filter((item) => Math.abs(item.amount) >= min);
        }

        if (max !== null) {
          items = items.filter((item) => Math.abs(item.amount) <= max);
        }

        if (sortBy === "Mayor monto") {
          items.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        }

        if (sortBy === "Menor monto") {
          items.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        }

        return {
          ...group,
          items,
        };
      })
      .filter((group) => group.items.length > 0);
  };

  const clearAdvancedFilters = () => {
    setMovementType("Todos");
    setSelectedCategory("Todas");
    setSortBy("Recientes");
  };

  const clearAmountFilters = () => {
    setMinAmount("");
    setMaxAmount("");
  };

  const clearAllFilters = () => {
    clearAdvancedFilters();
    clearAmountFilters();
  };

  const visibleGroups = getVisibleGroups();

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
       <View style={styles.header}>
  <TouchableOpacity
    style={styles.headerSide}
    onPress={() => setShowAdvancedModal(true)}
  >
    <Ionicons name="menu" size={23} color={theme.primary} />
  </TouchableOpacity>

  <Text style={[styles.headerTitle, { color: theme.primary }]}>
    Historial
  </Text>

  <View style={styles.headerSide} />
</View>

        <View style={[styles.searchBox, { backgroundColor: theme.card }]}>
          <Ionicons name="search-outline" size={18} color={theme.textMuted} />

          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar movimiento..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity onPress={() => setShowAmountModal(true)}>
            <Ionicons name="options-outline" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {hasActiveFilters && (
          <View
            style={[
              styles.activeFiltersBox,
              {
                backgroundColor: theme.primaryLight,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.clearFiltersFloating,
                {
                  backgroundColor: theme.primary,
                },
              ]}
              onPress={clearAllFilters}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={[styles.activeFiltersTitle, { color: theme.primary }]}>
              Filtros activos:
            </Text>

            <Text style={[styles.activeFiltersText, { color: theme.primary }]}>
              {movementType !== "Todos" ? `${movementType} · ` : ""}
              {selectedCategory !== "Todas" ? `${selectedCategory} · ` : ""}
              {sortBy !== "Recientes" ? `${sortBy} · ` : ""}
              {minAmount ? `Desde S/ ${minAmount} · ` : ""}
              {maxAmount ? `Hasta S/ ${maxAmount}` : ""}
            </Text>
          </View>
        )}

        <View style={styles.filtersRow}>
          {filters.map((filter) => {
            const active = selectedFilter === filter;

            return (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? theme.primary
                      : isDarkMode
                      ? "#222A31"
                      : "#E5E5E5",
                  },
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: active ? "#FFFFFF" : theme.text,
                    },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {visibleGroups.length > 0 ? (
          visibleGroups.map((group) => (
            <View key={group.date} style={styles.group}>
              <Text style={[styles.dateTitle, { color: theme.textMuted }]}>
                {group.date}
              </Text>

              {group.items.map((item) => (
                <TransactionRow
                  key={item.id}
                  item={item}
                  theme={theme}
                  isDarkMode={isDarkMode}
                />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons
              name="file-tray-outline"
              size={32}
              color={theme.textMuted}
            />

            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No se encontraron movimientos.
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={showAdvancedModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAdvancedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Filtros del historial
              </Text>

              <TouchableOpacity onPress={() => setShowAdvancedModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
              Organiza tus movimientos por tipo, categoría u orden.
            </Text>

            <Text style={[styles.modalSectionTitle, { color: theme.text }]}>
              Tipo de movimiento
            </Text>

            <View style={styles.chipRow}>
              {movementTypes.map((type) => {
                const active = movementType === type;

                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.modalChip,
                      {
                        backgroundColor: active
                          ? theme.primary
                          : isDarkMode
                          ? "#222A31"
                          : "#F1F3F5",
                      },
                    ]}
                    onPress={() => setMovementType(type)}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        {
                          color: active ? "#FFFFFF" : theme.text,
                        },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.modalSectionTitle, { color: theme.text }]}>
              Categorías
            </Text>

            <View style={styles.chipRowWrap}>
              <TouchableOpacity
                style={[
                  styles.modalChip,
                  {
                    backgroundColor:
                      selectedCategory === "Todas"
                        ? theme.primary
                        : isDarkMode
                        ? "#222A31"
                        : "#F1F3F5",
                  },
                ]}
                onPress={() => setSelectedCategory("Todas")}
              >
                <Text
                  style={[
                    styles.modalChipText,
                    {
                      color:
                        selectedCategory === "Todas" ? "#FFFFFF" : theme.text,
                    },
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>

              {allCategories.slice(0, 8).map((category) => {
                const active = selectedCategory === category.name;

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.modalChip,
                      {
                        backgroundColor: active
                          ? theme.primary
                          : isDarkMode
                          ? "#222A31"
                          : "#F1F3F5",
                      },
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        {
                          color: active ? "#FFFFFF" : theme.text,
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.modalSectionTitle, { color: theme.text }]}>
              Ordenar por
            </Text>

            <View style={styles.chipRowWrap}>
              {sortOptions.map((option) => {
                const active = sortBy === option;

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.modalChip,
                      {
                        backgroundColor: active
                          ? theme.primary
                          : isDarkMode
                          ? "#222A31"
                          : "#F1F3F5",
                      },
                    ]}
                    onPress={() => setSortBy(option)}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        {
                          color: active ? "#FFFFFF" : theme.text,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <ButtonPrimary
              title="Aplicar filtros"
              onPress={() => setShowAdvancedModal(false)}
              style={[styles.applyButton, { backgroundColor: theme.primary }]}
            />

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAdvancedFilters}
            >
              <Text style={[styles.clearButtonText, { color: theme.primary }]}>
                Limpiar filtros
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAmountModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAmountModal(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.amountModal, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Rango de monto
              </Text>

              <TouchableOpacity onPress={() => setShowAmountModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalSubtitle, { color: theme.textMuted }]}>
              Filtra movimientos por monto mínimo y máximo.
            </Text>

            <Text style={[styles.modalSectionTitle, { color: theme.text }]}>
              Monto mínimo
            </Text>

            <View
              style={[
                styles.amountInputBox,
                {
                  borderColor: theme.border,
                  backgroundColor: isDarkMode ? "#222A31" : "#FFFFFF",
                },
              ]}
            >
              <Text style={[styles.currencyLabel, { color: theme.textMuted }]}>
                S/
              </Text>

              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={minAmount}
                onChangeText={setMinAmount}
              />
            </View>

            <Text style={[styles.modalSectionTitle, { color: theme.text }]}>
              Monto máximo
            </Text>

            <View
              style={[
                styles.amountInputBox,
                {
                  borderColor: theme.border,
                  backgroundColor: isDarkMode ? "#222A31" : "#FFFFFF",
                },
              ]}
            >
              <Text style={[styles.currencyLabel, { color: theme.textMuted }]}>
                S/
              </Text>

              <TextInput
                style={[styles.amountInput, { color: theme.text }]}
                placeholder="1000.00"
                placeholderTextColor={theme.textMuted}
                keyboardType="numeric"
                value={maxAmount}
                onChangeText={setMaxAmount}
              />
            </View>

            <ButtonPrimary
              title="Aplicar rango"
              onPress={() => setShowAmountModal(false)}
              style={[styles.applyButton, { backgroundColor: theme.primary }]}
            />

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAmountFilters}
            >
              <Text style={[styles.clearButtonText, { color: theme.primary }]}>
                Limpiar rango
              </Text>
            </TouchableOpacity>
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
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 28,
},
headerSide: {
  width: 32,
  alignItems: "center",
  justifyContent: "center",
},
headerTitle: {
  flex: 1,
  textAlign: "center",
  fontSize: 20,
  fontWeight: "900",
},
  searchBox: {
    height: 46,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  activeFiltersBox: {
    position: "relative",
    borderRadius: 14,
    padding: 12,
    paddingRight: 38,
    marginBottom: 14,
  },
  activeFiltersTitle: {
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },
  activeFiltersText: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  clearFiltersFloating: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  filtersRow: {
    flexDirection: "row",
    marginBottom: 18,
  },
  filterChip: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 22,
    marginRight: 12,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "800",
  },
  group: {
    marginBottom: 8,
  },
  dateTitle: {
    marginBottom: 12,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
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
  emptyBox: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  amountModal: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 26,
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
    lineHeight: 18,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  chipRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  modalChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
  },
  modalChipText: {
    fontSize: 12,
    fontWeight: "800",
  },
  amountInputBox: {
    height: 46,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  currencyLabel: {
    fontSize: 15,
    fontWeight: "800",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
  },
  applyButton: {
    marginTop: 14,
  },
  clearButton: {
    marginTop: 14,
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "900",
  },
});