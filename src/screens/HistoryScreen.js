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
import TransactionItem from "../components/TransactionItem";
import ButtonPrimary from "../components/ButtonPrimary";
import { transactions, allCategories } from "../data/mockData";

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

export default function HistoryScreen() {
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
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowAdvancedModal(true)}>
            <Ionicons name="menu" size={22} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Historial</Text>

          <TouchableOpacity>
            <Ionicons name="search-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar movimiento..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />

          <TouchableOpacity onPress={() => setShowAmountModal(true)}>
            <Ionicons name="options-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {hasActiveFilters && (
          <View style={styles.activeFiltersBox}>
            <TouchableOpacity
              style={styles.clearFiltersFloating}
              onPress={clearAllFilters}
            >
              <Ionicons name="close" size={14} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.activeFiltersTitle}>Filtros activos:</Text>

            <Text style={styles.activeFiltersText}>
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
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[styles.filterText, active && styles.filterTextActive]}
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
              <Text style={styles.dateTitle}>{group.date}</Text>

              {group.items.map((item) => (
                <TransactionItem key={item.id} item={item} />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons
              name="file-tray-outline"
              size={32}
              color={colors.textMuted}
            />
            <Text style={styles.emptyText}>No se encontraron movimientos.</Text>
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros del historial</Text>

              <TouchableOpacity onPress={() => setShowAdvancedModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Organiza tus movimientos por tipo, categoría u orden.
            </Text>

            <Text style={styles.modalSectionTitle}>Tipo de movimiento</Text>
            <View style={styles.chipRow}>
              {movementTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.modalChip,
                    movementType === type && styles.modalChipActive,
                  ]}
                  onPress={() => setMovementType(type)}
                >
                  <Text
                    style={[
                      styles.modalChipText,
                      movementType === type && styles.modalChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionTitle}>Categorías</Text>
            <View style={styles.chipRowWrap}>
              <TouchableOpacity
                style={[
                  styles.modalChip,
                  selectedCategory === "Todas" && styles.modalChipActive,
                ]}
                onPress={() => setSelectedCategory("Todas")}
              >
                <Text
                  style={[
                    styles.modalChipText,
                    selectedCategory === "Todas" && styles.modalChipTextActive,
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>

              {allCategories.slice(0, 8).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.modalChip,
                    selectedCategory === category.name && styles.modalChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Text
                    style={[
                      styles.modalChipText,
                      selectedCategory === category.name &&
                        styles.modalChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionTitle}>Ordenar por</Text>
            <View style={styles.chipRowWrap}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.modalChip,
                    sortBy === option && styles.modalChipActive,
                  ]}
                  onPress={() => setSortBy(option)}
                >
                  <Text
                    style={[
                      styles.modalChipText,
                      sortBy === option && styles.modalChipTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ButtonPrimary
              title="Aplicar filtros"
              onPress={() => setShowAdvancedModal(false)}
              style={styles.applyButton}
            />

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAdvancedFilters}
            >
              <Text style={styles.clearButtonText}>Limpiar filtros</Text>
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
          <View style={styles.amountModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rango de monto</Text>

              <TouchableOpacity onPress={() => setShowAmountModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Filtra movimientos por monto mínimo y máximo.
            </Text>

            <Text style={styles.modalSectionTitle}>Monto mínimo</Text>
            <View style={styles.amountInputBox}>
              <Text style={styles.currencyLabel}>S/</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="numeric"
                value={minAmount}
                onChangeText={setMinAmount}
              />
            </View>

            <Text style={styles.modalSectionTitle}>Monto máximo</Text>
            <View style={styles.amountInputBox}>
              <Text style={styles.currencyLabel}>S/</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="1000.00"
                keyboardType="numeric"
                value={maxAmount}
                onChangeText={setMaxAmount}
              />
            </View>

            <ButtonPrimary
              title="Aplicar rango"
              onPress={() => setShowAmountModal(false)}
              style={styles.applyButton}
            />

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAmountFilters}
            >
              <Text style={styles.clearButtonText}>Limpiar rango</Text>
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
    backgroundColor: colors.backgroundSoft,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 52,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  headerTitle: {
    marginLeft: 12,
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: colors.primary,
  },
  searchBox: {
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
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
    color: colors.text,
  },
  activeFiltersBox: {
    position: "relative",
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 12,
    paddingRight: 38,
    marginBottom: 14,
  },
  activeFiltersTitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 4,
  },
  activeFiltersText: {
    color: colors.primary,
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
    backgroundColor: colors.primary,
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
    backgroundColor: "#E5E5E5",
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  group: {
    marginBottom: 8,
  },
  dateTitle: {
    marginBottom: 12,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#4B5563",
  },
  emptyBox: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    color: colors.textMuted,
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
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  amountModal: {
    backgroundColor: "#FFFFFF",
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
    color: colors.text,
  },
  modalSubtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
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
    backgroundColor: "#F1F3F5",
    marginRight: 8,
    marginBottom: 8,
  },
  modalChipActive: {
    backgroundColor: colors.primary,
  },
  modalChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "800",
  },
  modalChipTextActive: {
    color: "#FFFFFF",
  },
  amountInputBox: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  currencyLabel: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: "800",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  applyButton: {
    marginTop: 14,
  },
  clearButton: {
    marginTop: 14,
    alignItems: "center",
  },
  clearButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
});