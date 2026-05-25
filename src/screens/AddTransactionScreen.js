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
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Sentry from "@sentry/react-native";

import colors from "../theme/colors";
import ButtonPrimary from "../components/ButtonPrimary";
import { allCategories } from "../data/mockData";
import { useAppTheme } from "../theme/ThemeContext";

const expenseQuickCategories = allCategories.filter((category) =>
  ["Comida", "Transporte", "Servicios", "Ocio"].includes(category.name)
);

const incomeCategories = [
  {
    id: "income-1",
    name: "Sueldo",
    icon: "cash-outline",
    color: "#00924B",
    bg: "#E8F7EF",
  },
  {
    id: "income-2",
    name: "Propina",
    icon: "gift-outline",
    color: "#2563EB",
    bg: "#E7F0FF",
  },
  {
    id: "income-3",
    name: "Freelance",
    icon: "laptop-outline",
    color: "#7C3AED",
    bg: "#F0E7FF",
  },
  {
    id: "income-4",
    name: "Venta",
    icon: "storefront-outline",
    color: "#F59E0B",
    bg: "#FFF4CC",
  },
  {
    id: "income-5",
    name: "Reembolso",
    icon: "return-up-back-outline",
    color: "#0EA5E9",
    bg: "#E0F2FE",
  },
  {
    id: "income-6",
    name: "Otros",
    icon: "ellipsis-horizontal-outline",
    color: "#6B7280",
    bg: "#F1F3F5",
  },
];

const paymentMethods = [
  "Seleccionar método",
  "Efectivo",
  "Tarjeta",
  "Yape",
  "Plin",
  "Transferencia",
];

const knownCompanies = {
  "10218680319": "Restaurante La Esquina",
  "20601234567": "Minimarket San José",
  "20123456789": "Cafetería Central",
};

const dates = [
  "20 de mayo de 2026",
  "21 de mayo de 2026",
  "22 de mayo de 2026",
  "23 de mayo de 2026",
  "24 de mayo de 2026",
];

function formatDateFromQR(dateText) {
  if (!dateText) return "20 de mayo de 2026";

  const [year, month, day] = dateText.split("-");

  const months = {
    "01": "enero",
    "02": "febrero",
    "03": "marzo",
    "04": "abril",
    "05": "mayo",
    "06": "junio",
    "07": "julio",
    "08": "agosto",
    "09": "septiembre",
    "10": "octubre",
    "11": "noviembre",
    "12": "diciembre",
  };

  if (!year || !month || !day) return dateText;

  return `${Number(day)} de ${months[month] || month} de ${year}`;
}

function parseReceiptQR(qrText) {
  const cleanText = String(qrText || "").trim();
  const parts = cleanText.split("|");

  if (parts.length >= 7) {
    const ruc = parts[0];
    const tipoComprobante = parts[1];
    const serie = parts[2];
    const numero = parts[3];
    const igv = parts[4];
    const total = parts[5];
    const fecha = parts[6];

    const isValidRuc = /^\d{11}$/.test(ruc);
    const isValidAmount = !Number.isNaN(Number(total));

    if (isValidRuc && isValidAmount) {
      const companyName = knownCompanies[ruc];

      return {
        valid: true,
        amount: total,
        date: formatDateFromQR(fecha),
        description: companyName
          ? `${companyName} - ${serie}-${numero}`
          : `Comprobante ${serie}-${numero}`,
        raw: cleanText,
        data: {
          ruc,
          tipoComprobante,
          serie,
          numero,
          igv,
          total,
          fecha,
          companyName: companyName || null,
        },
      };
    }
  }

  return {
    valid: false,
    raw: cleanText,
  };
}

export default function AddTransactionScreen({ navigation }) {
  const { theme, isDarkMode } = useAppTheme();

  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);

  const [type, setType] = useState("Gasto");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Seleccionar método");
  const [selectedDate, setSelectedDate] = useState("20 de mayo de 2026");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const [errors, setErrors] = useState({});

  const isIncome = type === "Ingreso";
  const currentQuickCategories = isIncome
    ? incomeCategories.slice(0, 4)
    : expenseQuickCategories;
  const currentAllCategories = isIncome ? incomeCategories : allCategories;

  const inputBackground = isDarkMode ? "#222A31" : "#FFFFFF";
  const softBackground = isDarkMode ? "#151A20" : "#F1F5F3";

  const handleChangeType = (newType) => {
    setType(newType);
    setCategory(null);
    setErrors({});

    if (newType === "Ingreso") {
      setPaymentMethod("Seleccionar método");
    }
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();

      if (!response.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a la cámara para escanear el QR de la boleta."
        );
        return;
      }
    }

    setScanned(false);
    setTorchEnabled(false);
    setShowScanner(true);
  };

  const closeScanner = () => {
    setTorchEnabled(false);
    setShowScanner(false);
  };

  const handleQRCodeScanned = ({ data }) => {
    if (scanned) return;

    setScanned(true);

    const result = parseReceiptQR(data);

    if (result.valid) {
      setType("Gasto");
      setAmount(result.amount);
      setSelectedDate(result.date);
      setDescription(result.description);
      setPaymentMethod("Seleccionar método");

      const defaultCategory = allCategories.find(
        (item) => item.name === "Otros"
      );

      if (defaultCategory) {
        setCategory(defaultCategory);
      }

      setTorchEnabled(false);
      setShowScanner(false);

      Sentry.captureMessage("QR de comprobante escaneado correctamente");
      return;
    }

    setTorchEnabled(false);
    setShowScanner(false);

    Sentry.captureMessage("QR escaneado sin formato de comprobante compatible");

    setTimeout(() => {
      Alert.alert(
        "QR no compatible",
        "El QR fue leído, pero no contiene datos claros de una boleta electrónica. Puedes registrar el movimiento manualmente."
      );
    }, 300);
  };

  const handleSave = () => {
    const newErrors = {};

    if (!amount.trim()) {
      newErrors.amount = "Ingresa un monto válido.";
    }

    if (!category) {
      newErrors.category = "Selecciona una categoría.";
    }

    if (!isIncome && paymentMethod === "Seleccionar método") {
      newErrors.paymentMethod = "Selecciona un método de pago.";
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
      paymentMethod: isIncome ? "No aplica" : paymentMethod,
      selectedDate,
      description,
    });

    Alert.alert(
      "Movimiento guardado",
      `${type} de S/ ${amount} registrado correctamente.`,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={24} color={theme.primary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: theme.primary }]}>
            Agregar movimiento
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={[styles.typeSelector, { backgroundColor: softBackground }]}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "Gasto" && styles.expenseButtonActive,
            ]}
            onPress={() => handleChangeType("Gasto")}
          >
            <Ionicons
              name="arrow-up-outline"
              size={17}
              color={type === "Gasto" ? "#FFFFFF" : colors.expense}
              style={styles.typeIcon}
            />

            <Text
              style={[
                styles.typeText,
                { color: type === "Gasto" ? "#FFFFFF" : colors.expense },
              ]}
            >
              Gasto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              type === "Ingreso" && {
                backgroundColor: theme.primary,
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.22,
                shadowRadius: 8,
                elevation: 4,
              },
            ]}
            onPress={() => handleChangeType("Ingreso")}
          >
            <Ionicons
              name="arrow-down-outline"
              size={17}
              color={type === "Ingreso" ? "#FFFFFF" : theme.primary}
              style={styles.typeIcon}
            />

            <Text
              style={[
                styles.typeText,
                { color: type === "Ingreso" ? "#FFFFFF" : theme.primary },
              ]}
            >
              Ingreso
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountBox}>
          <Text
            style={[
              styles.currency,
              {
                color: isIncome ? theme.primary : theme.textMuted,
              },
            ]}
          >
            S/
          </Text>

          <TextInput
            style={[
              styles.amountInput,
              {
                color: isIncome ? theme.primary : theme.text,
              },
            ]}
            placeholder="0.00"
            placeholderTextColor={theme.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {!!errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

        <TouchableOpacity
          style={[
            styles.selectorBox,
            {
              backgroundColor: inputBackground,
              borderColor: theme.border,
            },
          ]}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text
            style={[
              styles.selectorText,
              {
                color: category ? theme.text : theme.textMuted,
              },
            ]}
          >
            {category ? category.name : "Selecciona una categoría"}
          </Text>

          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </TouchableOpacity>

        {!!errors.category && (
          <Text style={styles.error}>{errors.category}</Text>
        )}

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {isIncome ? "Categorías de ingreso" : "Categorías rápidas"}
        </Text>

        <View style={styles.quickCategories}>
          {currentQuickCategories.map((item) => {
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
                    {
                      backgroundColor: isDarkMode ? "#24313A" : item.bg,
                      borderColor: selected ? theme.primary : theme.border,
                    },
                    selected && styles.quickIconSelected,
                  ]}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>

                <Text
                  style={[
                    styles.quickText,
                    {
                      color: selected ? theme.primary : theme.text,
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.detailsCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.detailRow}
            onPress={() => setShowDateModal(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={22}
              color={theme.textMuted}
            />

            <Text style={[styles.detailText, { color: theme.text }]}>
              {selectedDate}
            </Text>

            <Ionicons name="create-outline" size={20} color={theme.primary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.detailRow}>
            <Ionicons
              name="reorder-three-outline"
              size={24}
              color={theme.textMuted}
            />

            <TextInput
              style={[styles.descriptionInput, { color: theme.text }]}
              placeholder={
                isIncome
                  ? "Ej. Pago mensual, propina, venta..."
                  : "Ej. Almuerzo con amigos"
              }
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {!isIncome && (
            <>
              <View
                style={[styles.divider, { backgroundColor: theme.border }]}
              />

              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => setShowPaymentModal(true)}
              >
                <Ionicons
                  name="wallet-outline"
                  size={21}
                  color={theme.textMuted}
                />

                <View style={styles.paymentInfo}>
                  <Text
                    style={[styles.paymentLabel, { color: theme.textMuted }]}
                  >
                    MÉTODO DE PAGO
                  </Text>

                  <Text
                    style={[
                      styles.paymentValue,
                      {
                        color:
                          paymentMethod === "Seleccionar método"
                            ? theme.textMuted
                            : theme.text,
                      },
                    ]}
                  >
                    {paymentMethod}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>

              {!!errors.paymentMethod && (
                <Text style={styles.paymentError}>{errors.paymentMethod}</Text>
              )}
            </>
          )}
        </View>

        <ButtonPrimary
          title="Guardar movimiento"
          onPress={handleSave}
          style={[
            styles.saveButton,
            {
              backgroundColor: isIncome ? theme.primary : colors.primaryDark,
            },
          ]}
        />

        {!isIncome && (
          <TouchableOpacity
            style={[
              styles.scanButton,
              {
                backgroundColor: isDarkMode ? "#222A31" : "#E8F7EF",
                borderColor: theme.primary,
              },
            ]}
            onPress={openScanner}
          >
            <Ionicons name="qr-code-outline" size={20} color={theme.primary} />

            <Text style={[styles.scanButtonText, { color: theme.primary }]}>
              Escanear QR de boleta
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 115 }} />
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {isIncome
                  ? "Selecciona categoría de ingreso"
                  : "Selecciona una categoría"}
              </Text>

              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalGrid}>
              {currentAllCategories.map((item) => (
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

      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.paymentModal, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Método de pago
              </Text>

              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {paymentMethods.map((method) => {
              const selected = paymentMethod === method;

              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: selected
                        ? theme.primaryLight
                        : isDarkMode
                        ? "#222A31"
                        : "#F6F8F7",
                    },
                  ]}
                  onPress={() => {
                    setPaymentMethod(method);
                    setShowPaymentModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      {
                        color: selected ? theme.primary : theme.text,
                      },
                    ]}
                  >
                    {method}
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

      <Modal
        visible={showDateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.paymentModal, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Selecciona fecha
              </Text>

              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            {dates.map((date) => {
              const selected = selectedDate === date;

              return (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: selected
                        ? theme.primaryLight
                        : isDarkMode
                        ? "#222A31"
                        : "#F6F8F7",
                    },
                  ]}
                  onPress={() => {
                    setSelectedDate(date);
                    setShowDateModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.paymentOptionText,
                      {
                        color: selected ? theme.primary : theme.text,
                      },
                    ]}
                  >
                    {date}
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

      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={closeScanner}
      >
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            enableTorch={torchEnabled}
            onBarcodeScanned={scanned ? undefined : handleQRCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />

          <View style={styles.scannerOverlay}>
            <View style={styles.scannerHeader}>
              <TouchableOpacity
                style={styles.scannerCloseButton}
                onPress={closeScanner}
              >
                <Ionicons name="close" size={26} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.scannerTitle}>Escanear boleta</Text>

              <View style={{ width: 42 }} />
            </View>

            <View style={styles.scannerCenter}>
              <View style={styles.scanFrame}>
                <View style={styles.scanCornerTopLeft} />
                <View style={styles.scanCornerTopRight} />
                <View style={styles.scanCornerBottomLeft} />
                <View style={styles.scanCornerBottomRight} />
              </View>

              <TouchableOpacity
                style={[
                  styles.flashBelowFrameButton,
                  torchEnabled && styles.flashBelowFrameButtonActive,
                ]}
                onPress={() => setTorchEnabled((current) => !current)}
              >
                <Ionicons
                  name={torchEnabled ? "flash" : "flash-outline"}
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.flashBelowFrameText}>
                  {torchEnabled ? "Linterna encendida" : "Encender linterna"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.scannerHelp}>
              Apunta la cámara al QR del comprobante. Si contiene monto y fecha,
              se completará el formulario automáticamente.
            </Text>
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
  },
  headerSpace: {
    width: 36,
  },
  typeSelector: {
    height: 52,
    flexDirection: "row",
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
  typeIcon: {
    marginRight: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "900",
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
    marginRight: 30,
  },
  amountInput: {
    minWidth: 130,
    fontSize: 32,
    fontWeight: "900",
  },
  selectorBox: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  error: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
  },
  paymentError: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 10,
    marginLeft: 46,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
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
  },
  quickIconSelected: {
    borderWidth: 2,
  },
  quickText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  detailsCard: {
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
    fontSize: 14,
    fontWeight: "800",
  },
  descriptionInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  paymentValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "800",
  },
  divider: {
    height: 1,
  },
  saveButton: {
    height: 52,
    borderRadius: 9,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 8,
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
  paymentModal: {
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
  paymentOption: {
    minHeight: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentOptionText: {
    fontSize: 14,
    fontWeight: "800",
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerOverlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scannerCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  scannerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  scannerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    alignSelf: "center",
    width: 250,
    height: 250,
    position: "relative",
  },
  scanCornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: "#FFFFFF",
    borderTopLeftRadius: 16,
  },
  scanCornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: "#FFFFFF",
    borderTopRightRadius: 16,
  },
  scanCornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: "#FFFFFF",
    borderBottomLeftRadius: 16,
  },
  scanCornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: "#FFFFFF",
    borderBottomRightRadius: 16,
  },
  flashBelowFrameButton: {
    height: 48,
    borderRadius: 24,
    marginTop: 24,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flashBelowFrameButtonActive: {
    backgroundColor: "rgba(34,197,94,0.85)",
  },
  flashBelowFrameText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 8,
  },
  scannerHelp: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 45,
  },
});