import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";

import colors from "../theme/colors";
import ButtonPrimary from "../components/ButtonPrimary";
import { allCategories } from "../data/mockData";

const quickCategories = allCategories.filter((category) =>
  ["Comida", "Transporte", "Servicios", "Ocio"].includes(category.name)
);

const paymentMethods = ["Efectivo", "Tarjeta", "Yape", "Plin", "Transferencia"];

const dates = [
  "20 de mayo de 2026",
  "21 de mayo de 2026",
  "22 de mayo de 2026",
  "23 de mayo de 2026",
  "24 de mayo de 2026",
];

export default function AddTransactionScreen({ navigation }) {
  const [type, setType] = useState("Gasto");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [selectedDate, setSelectedDate] = useState("20 de mayo de 2026");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const [errors, setErrors] = useState({});

  const isIncome = type === "Ingreso";

  const handleSave = () => {
    const newErrors = {};

    if (!amount.trim()) {
      newErrors.amount = "Ingresa un monto válido.";
    }

    if (!category) {
      newErrors.category = "Selecciona una categoría.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Sentry.captureMessage("Intento incompleto al agregar movimiento");
      return;
    }

    Sentry.captureMessage(`Movimiento agregado: ${type} - ${category.name}`);
    Sentry.logger.info("Movimiento guardado desde pantalla Agregar", {
      type,
      amount,
      category: category.name,
      paymentMethod,
      selectedDate,
    });

    Alert.alert(
      "Movimiento guardado",
      `${type} de S/ ${amount} registrado correctamente.`,
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Inicio"),
        },
      ]
    );
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Inicio")}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Agregar movimiento</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "Gasto" && styles.expenseButtonActive,
            ]}
            onPress={() => setType("Gasto")}
          >
            <Ionicons
              name="arrow-up-outline"
              size={17}
              color={type === "Gasto" ? "#FFFFFF" : "#C1121F"}
              style={styles.typeIcon}
            />

            <Text
              style={[
                styles.typeText,
                type === "Gasto" && styles.typeTextActive,
              ]}
            >
              Gasto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "Ingreso" && styles.incomeButtonActive,
            ]}
            onPress={() => setType("Ingreso")}
          >
            <Ionicons
              name="arrow-down-outline"
              size={17}
              color={type === "Ingreso" ? "#FFFFFF" : colors.primary}
              style={styles.typeIcon}
            />

            <Text
              style={[
                styles.typeText,
                type === "Ingreso" && styles.typeTextActive,
              ]}
            >
              Ingreso
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountBox}>
          <Text style={[styles.currency, isIncome && styles.incomeAmountText]}>
            S/
          </Text>

          <TextInput
            style={[styles.amountInput, isIncome && styles.incomeAmountText]}
            placeholder="0.00"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        {!!errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

        <TouchableOpacity
          style={styles.selectorBox}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text
            style={[
              styles.selectorText,
              category && styles.selectorTextSelected,
            ]}
          >
            {category ? category.name : "Selecciona una categoría"}
          </Text>

          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
        {!!errors.category && (
          <Text style={styles.error}>{errors.category}</Text>
        )}

        <Text style={styles.sectionTitle}>Categorías rápidas</Text>

        <View style={styles.quickCategories}>
          {quickCategories.map((item) => {
            const selected = category?.name === item.name;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.quickItem}
                onPress={() => setCategory(item)}
              >
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: item.bg },
                    selected && styles.quickIconSelected,
                  ]}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>

                <Text
                  style={[
                    styles.quickText,
                    selected && styles.quickTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.detailsCard}>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => setShowDateModal(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color={colors.textMuted}
            />

            <Text style={styles.detailText}>{selectedDate}</Text>

            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Ionicons
              name="reorder-three-outline"
              size={24}
              color={colors.textMuted}
            />

            <TextInput
              style={styles.descriptionInput}
              placeholder="Ej. Almuerzo con amigos"
              placeholderTextColor="#B8C2BD"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => setShowPaymentModal(true)}
          >
            <Ionicons
              name="wallet-outline"
              size={21}
              color={colors.textMuted}
            />

            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>MÉTODO DE PAGO</Text>
              <Text style={styles.paymentValue}>{paymentMethod}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <ButtonPrimary
          title="Guardar movimiento"
          onPress={handleSave}
          style={[
            styles.saveButton,
            isIncome && styles.saveButtonIncome,
          ]}
        />

        <View style={{ height: 115 }} />
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona una categoría</Text>

              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalGrid}>
              {allCategories.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalCategory}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <View
                    style={[
                      styles.modalIconCircle,
                      { backgroundColor: item.bg },
                    ]}
                  >
                    <Ionicons name={item.icon} size={22} color={item.color} />
                  </View>

                  <Text style={styles.modalCategoryText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.paymentModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Método de pago</Text>

              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {paymentMethods.map((method) => {
              const selected = paymentMethod === method;

              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentOption,
                    selected && styles.paymentOptionActive,
                  ]}
                  onPress={() => {
                    setPaymentMethod(method);
                    setShowPaymentModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      selected && styles.paymentOptionTextActive,
                    ]}
                  >
                    {method}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.paymentModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona fecha</Text>

              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {dates.map((date) => {
              const selected = selectedDate === date;

              return (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.paymentOption,
                    selected && styles.paymentOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedDate(date);
                    setShowDateModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      selected && styles.paymentOptionTextActive,
                    ]}
                  >
                    {date}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.primary}
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
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 52,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  backButton: {
    width: 36,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
    color: colors.primary,
  },
  headerSpace: {
    width: 36,
  },
  typeSelector: {
    height: 52,
    flexDirection: "row",
    backgroundColor: "#F1F5F3",
    borderRadius: 14,
    marginBottom: 34,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  expenseButtonActive: {
    backgroundColor: "#C1121F",
    shadowColor: "#C1121F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  incomeButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  typeIcon: {
    marginRight: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.primary,
  },
  typeTextActive: {
    color: "#FFFFFF",
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  currency: {
    fontSize: 26,
    fontWeight: "900",
    color: "#8A8A8A",
    marginRight: 30,
  },
  amountInput: {
    minWidth: 130,
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
  },
  incomeAmountText: {
    color: colors.primary,
  },
  selectorBox: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    color: colors.textMuted,
  },
  selectorTextSelected: {
    color: colors.text,
    fontWeight: "800",
  },
  error: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 16,
  },
  quickCategories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  quickItem: {
    alignItems: "center",
    width: "23%",
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDF5E7",
  },
  quickIconSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  quickText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  quickTextSelected: {
    color: colors.primary,
    fontWeight: "900",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    flex: 1,
    marginLeft: 12,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  descriptionInput: {
    flex: 1,
    marginLeft: 12,
    color: colors.text,
    fontSize: 14,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "900",
    letterSpacing: 1,
  },
  paymentValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F3F5",
  },
  saveButton: {
    height: 52,
    borderRadius: 9,
    backgroundColor: colors.primaryDark,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonIncome: {
    backgroundColor: colors.primary,
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
  paymentModal: {
    backgroundColor: "#FFFFFF",
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
    color: colors.text,
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
    color: colors.text,
    textAlign: "center",
  },
  paymentOption: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "#F6F8F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  paymentOptionTextActive: {
    color: colors.primary,
  },
});