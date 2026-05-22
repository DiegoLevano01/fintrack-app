import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://46d71ccbcf3b9170c292d9dbd0f20c26@o4511431830470656.ingest.us.sentry.io/4511431830667264",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
  tracesSampleRate: 1.0,
});

const GREEN = "#009B4E";
const LIGHT_GREEN = "#EAF8F0";
const RED = "#DC263D";
const TEXT = "#151515";
const MUTED = "#777";

const movements = [
  {
    id: 1,
    icon: "🍔",
    title: "Comida",
    time: "Hoy, 12:30 pm",
    amount: "- S/ 25.00",
    type: "expense",
  },
  {
    id: 2,
    icon: "🚌",
    title: "Transporte",
    time: "Hoy, 8:15 am",
    amount: "- S/ 8.00",
    type: "expense",
  },
  {
    id: 3,
    icon: "💰",
    title: "Sueldo",
    time: "Ayer, 6:00 pm",
    amount: "+ S/ 1,200.00",
    type: "income",
  },
];

function App() {
  const [screen, setScreen] = useState("login");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  Sentry.setUser({
    id: "201912025",
    email: "201912025@urp.edu.pe",
    username: "Diego Levano",
  });

  const login = () => {
    Sentry.captureMessage("LAB-04 FinTrack: Usuario inició sesión");
    setScreen("home");
  };

  const simulateError = () => {
    try {
      throw new Error("LAB-04 FinTrack: Error simulado desde la app");
    } catch (error) {
      Sentry.captureException(error);
      Alert.alert("Error enviado", "El error simulado fue enviado a Sentry.");
    }
  };

  const sendLog = () => {
    Sentry.captureMessage("LAB-04 FinTrack: Log personalizado enviado");

    if (Sentry.logger && Sentry.logger.info) {
      Sentry.logger.info("LAB-04 FinTrack: Usuario interactuó con la app", {
        screen,
        lab: "lab04",
      });
    }

    Alert.alert("Log enviado", "El log fue enviado a Sentry.");
  };

  const sendMetric = () => {
    if (Sentry.metrics && Sentry.metrics.count) {
      Sentry.metrics.count("fintrack.movimiento_creado", 1, {
        tags: {
          lab: "lab04",
          feature: "transactions",
        },
      });
    } else {
      Sentry.captureMessage("LAB-04 FinTrack: Métrica simulada registrada");
    }

    Alert.alert("Métrica enviada", "La métrica fue registrada en Sentry.");
  };

  const sendTrace = () => {
    Sentry.startSpan(
      {
        name: "LAB-04 FinTrack: Carga de dashboard financiero",
        op: "fintrack.dashboard.load",
      },
      () => {
        let total = 0;

        for (let i = 0; i < 500000; i++) {
          total += i;
        }

        Sentry.captureMessage(
          `LAB-04 FinTrack: Traza ejecutada correctamente ${total}`
        );
      }
    );

    Alert.alert("Traza enviada", "La traza fue enviada a Sentry.");
  };

  const SentryPanel = () => (
    <View style={styles.sentryCard}>
      <Text style={styles.sentryTitle}>Pruebas Sentry - Lab 04</Text>

      <TouchableOpacity style={styles.errorButton} onPress={simulateError}>
        <Text style={styles.sentryButtonText}>Simular error</Text>
      </TouchableOpacity>

      <View style={styles.sentryRow}>
        <TouchableOpacity style={styles.sentryButton} onPress={sendLog}>
          <Text style={styles.sentryButtonText}>Log</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sentryButton} onPress={sendMetric}>
          <Text style={styles.sentryButtonText}>Métrica</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sentryButton} onPress={sendTrace}>
          <Text style={styles.sentryButtonText}>Traza</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (screen === "login") {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar style="dark" />

        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />

        <View style={styles.authContent}>
          <Text style={styles.logo}>FinTrack</Text>

          <Text style={styles.authTitle}>Hola de nuevo 👋</Text>
          <Text style={styles.authSubtitle}>Inicia sesión para continuar</Text>

          <Input label="Correo electrónico:" placeholder="ejemplo@correo.com" />
          <Input label="Contraseña:" placeholder="************" secure />

          <TouchableOpacity>
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={login}>
            <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <Text style={styles.dividerText}>¿Aún no tienes cuenta?</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen("register")}
          >
            <Text style={styles.primaryButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "register") {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar style="dark" />

        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />

        <ScrollView contentContainerStyle={styles.authContent}>
          <Text style={styles.logo}>FinTrack</Text>

          <Text style={styles.authTitle}>CREAR CUENTA</Text>
          <Text style={styles.authSubtitle}>Registra tus datos personales</Text>

          <Input label="Primer nombre:" placeholder="Diego" />
          <Input label="Primer apellido:" placeholder="Levano" />
          <Input label="Correo electrónico:" placeholder="201912025@urp.edu.pe" />
          <Input label="Número de teléfono:" placeholder="999 999 999" />
          <Input label="Contraseña:" placeholder="************" secure />
          <Input label="Confirmar contraseña:" placeholder="************" secure />

          <TouchableOpacity style={styles.primaryButton} onPress={login}>
            <Text style={styles.primaryButtonText}>Crear cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScreen("login")}>
            <Text style={styles.backLogin}>Ya tengo cuenta</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar style="dark" />

      {screen === "home" && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hola, Diego 👋</Text>
              <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>D</Text>
            </View>
          </View>

          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo total</Text>
            <Text style={styles.balance}>S/ 2,450.00</Text>
            <Text style={styles.balanceLink}>Ver detalle &gt;</Text>
          </View>

          <View style={styles.summaryRow}>
            <SummaryCard
              title="Ingresos"
              value="S/ 3,200.00"
              color={GREEN}
              icon="💵"
              detail="+12% vs mes anterior"
            />

            <SummaryCard
              title="Gastos"
              value="S/ 750.00"
              color={RED}
              icon="🧾"
              detail="-8% vs mes anterior"
            />
          </View>

          <View style={styles.budgetCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>Presupuesto mensual</Text>
              <Text style={styles.percent}>60%</Text>
            </View>

            <Text style={styles.budgetText}>S/ 1,200.00 de S/ 2,000.00</Text>

            <View style={styles.progressBg}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <SectionHeader title="Categorías rápidas" action="Ver todas" />

          <View style={styles.categoryRow}>
            <Category icon="🍔" label="Comida" />
            <Category icon="🚌" label="Transporte" />
            <Category icon="⚡" label="Servicios" />
            <Category icon="🎮" label="Ocio" />
            <Category icon="•••" label="Más" />
          </View>

          <SectionHeader title="Últimos movimientos" action="Ver todos" />

          {movements.map((item) => (
            <Transaction key={item.id} item={item} />
          ))}

          <SentryPanel />
        </ScrollView>
      )}

      {screen === "add" && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Agregar movimiento</Text>

          <View style={styles.toggleRow}>
            <TouchableOpacity style={styles.expenseToggle}>
              <Text style={styles.toggleSelectedText}>Gasto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.incomeToggle}>
              <Text style={styles.toggleText}>Ingreso</Text>
            </TouchableOpacity>
          </View>

          <Input label="Monto" placeholder="S/ 0.00" />
          <Selector label="Categoría" value="Selecciona una categoría" />
          <Selector label="Fecha" value="20 de mayo de 2026" />
          <Input label="Descripción (opcional)" placeholder="Ej. Almuerzo" />
          <Selector label="Método de pago" value="Efectivo" />

          <TouchableOpacity style={styles.primaryButton} onPress={sendMetric}>
            <Text style={styles.primaryButtonText}>Guardar movimiento</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {screen === "history" && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitleLeft}>Historial</Text>

          <TextInput
            style={styles.search}
            placeholder="Buscar movimiento..."
            placeholderTextColor="#999"
          />

          <View style={styles.filterRow}>
            <FilterChip label="Hoy" active />
            <FilterChip label="Semana" />
            <FilterChip label="Mes" />
            <FilterChip label="Categorías" />
          </View>

          <Text style={styles.dateTitle}>Hoy - 20 de mayo</Text>
          <Transaction item={movements[0]} />
          <Transaction item={movements[1]} />

          <Text style={styles.dateTitle}>Ayer - 19 de mayo</Text>
          <Transaction item={movements[2]} />
          <Transaction
            item={{
              icon: "🏠",
              title: "Alquiler",
              time: "10:00 am",
              amount: "- S/ 600.00",
              type: "expense",
            }}
          />
          <Transaction
            item={{
              icon: "⚡",
              title: "Luz",
              time: "9:00 am",
              amount: "- S/ 120.00",
              type: "expense",
            }}
          />
        </ScrollView>
      )}

      {screen === "stats" && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Estadísticas</Text>

          <View style={styles.monthSelector}>
            <Text style={styles.monthText}>Mayo 2026 ▼</Text>
          </View>

          <View style={styles.summaryRow}>
            <SummaryCard title="Ingresos" value="S/ 3,200.00" color={GREEN} />
            <SummaryCard title="Gastos" value="S/ 750.00" color={RED} />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Gastos por categoría</Text>

            <View style={styles.donutFake}>
              <Text style={styles.donutText}>Total{"\n"}S/ 750.00</Text>
            </View>

            <StatsRow label="Comida 40%" value="S/ 300.00" />
            <StatsRow label="Transporte 20%" value="S/ 150.00" />
            <StatsRow label="Servicios 16%" value="S/ 120.00" />
            <StatsRow label="Ocio 12%" value="S/ 90.00" />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Evolución de gastos</Text>
            <View style={styles.lineChartFake}>
              <Text style={styles.chartText}>S/ 750</Text>
            </View>
          </View>
        </ScrollView>
      )}

      {screen === "profile" && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.pageTitle}>Perfil</Text>

          <View style={styles.profileCard}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>D</Text>
            </View>

            <View>
              <Text style={styles.profileName}>Diego Levano</Text>
              <Text style={styles.profileEmail}>diego.levano@gmail.com</Text>
              <Text style={styles.badge}>Usuario estándar</Text>
            </View>
          </View>

          <SettingRow icon="💱" label="Moneda" value="PEN - Soles" />
          <SettingRow
            icon="🔔"
            label="Notificaciones"
            switchValue={notifications}
            setSwitchValue={setNotifications}
          />
          <SettingRow
            icon="🌙"
            label="Modo oscuro"
            switchValue={darkMode}
            setSwitchValue={setDarkMode}
          />
          <SettingRow
            icon="⚠️"
            label="Alertas de presupuesto"
            switchValue={budgetAlerts}
            setSwitchValue={setBudgetAlerts}
          />
          <SettingRow icon="📤" label="Exportar datos" value="›" />
          <SettingRow icon="🛡️" label="Seguridad" value="›" />
          <SettingRow icon="❔" label="Ayuda y soporte" value="›" />

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setScreen("login")}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <SentryPanel />
        </ScrollView>
      )}

      <BottomNav active={screen} setScreen={setScreen} />
    </SafeAreaView>
  );
}

function Input({ label, placeholder, secure }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secure}
      />
      <Text style={styles.errorText}>Campo requerido o inválido</Text>
    </View>
  );
}

function Selector({ label, value }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.selector}>
        <Text style={styles.selectorText}>{value}</Text>
        <Text>›</Text>
      </View>
    </View>
  );
}

function SummaryCard({ title, value, color, icon, detail }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryIcon}>{icon}</Text>
      <Text style={styles.summaryLabel}>{title}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      {detail && <Text style={styles.summaryDetail}>{detail}</Text>}
    </View>
  );
}

function Category({ icon, label }) {
  return (
    <View style={styles.categoryItem}>
      <View style={styles.categoryIcon}>
        <Text>{icon}</Text>
      </View>
      <Text style={styles.categoryLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionAction}>{action}</Text>
    </View>
  );
}

function Transaction({ item }) {
  return (
    <View style={styles.transaction}>
      <View style={styles.transactionIcon}>
        <Text>{item.icon}</Text>
      </View>

      <View style={styles.transactionText}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
      </View>

      <Text
        style={[
          styles.transactionAmount,
          item.type === "income" ? styles.income : styles.expense,
        ]}
      >
        {item.amount}
      </Text>
    </View>
  );
}

function FilterChip({ label, active }) {
  return (
    <View style={[styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </View>
  );
}

function StatsRow({ label, value }) {
  return (
    <View style={styles.statsRow}>
      <Text style={styles.statsLabel}>● {label}</Text>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  );
}

function SettingRow({ icon, label, value, switchValue, setSwitchValue }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={styles.settingLabel}>{label}</Text>

      {setSwitchValue ? (
        <Switch value={switchValue} onValueChange={setSwitchValue} />
      ) : (
        <Text style={styles.settingValue}>{value}</Text>
      )}
    </View>
  );
}

function BottomNav({ active, setScreen }) {
  const items = [
    { key: "home", label: "Inicio", icon: "⌂" },
    { key: "history", label: "Historial", icon: "▣" },
    { key: "add", label: "Agregar", icon: "+" },
    { key: "stats", label: "Estadísticas", icon: "▥" },
    { key: "profile", label: "Perfil", icon: "♙" },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.navItem}
          onPress={() => setScreen(item.key)}
        >
          <Text style={[styles.navIcon, active === item.key && styles.navActive]}>
            {item.icon}
          </Text>
          <Text style={[styles.navText, active === item.key && styles.navActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Sentry.wrap(App);

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  authContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 34,
    paddingBottom: 40,
  },
  circleTop: {
    position: "absolute",
    right: -35,
    top: 120,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: LIGHT_GREEN,
  },
  circleBottom: {
    position: "absolute",
    left: -40,
    bottom: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: LIGHT_GREEN,
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: GREEN,
    textAlign: "center",
    marginBottom: 30,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    color: TEXT,
  },
  authSubtitle: {
    fontSize: 13,
    textAlign: "center",
    color: MUTED,
    marginTop: 8,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    color: TEXT,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  errorText: {
    fontSize: 9,
    color: RED,
    marginTop: 4,
  },
  forgot: {
    color: GREEN,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: GREEN,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
  dividerText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 24,
  },
  backLogin: {
    textAlign: "center",
    marginTop: 18,
    color: GREEN,
    fontWeight: "700",
  },
  appContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 105,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "900",
    color: TEXT,
  },
  subtitle: {
    color: MUTED,
    marginTop: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "900",
  },
  balanceCard: {
    backgroundColor: GREEN,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#EAF8F0",
    fontSize: 14,
  },
  balance: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "900",
    marginVertical: 8,
  },
  balanceLink: {
    color: "#FFF",
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryIcon: {
    fontSize: 18,
  },
  summaryLabel: {
    color: MUTED,
    fontSize: 13,
    marginTop: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  summaryDetail: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },
  budgetCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT,
  },
  percent: {
    fontWeight: "900",
  },
  budgetText: {
    color: MUTED,
    marginVertical: 8,
  },
  progressBg: {
    height: 10,
    borderRadius: 8,
    backgroundColor: "#E4EEE8",
  },
  progressFill: {
    width: "60%",
    height: 10,
    borderRadius: 8,
    backgroundColor: GREEN,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 12,
  },
  sectionAction: {
    color: GREEN,
    fontWeight: "800",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F4F6F7",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    fontSize: 11,
    marginTop: 6,
    color: TEXT,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionText: {
    flex: 1,
  },
  transactionTitle: {
    fontWeight: "900",
    color: TEXT,
  },
  transactionTime: {
    color: MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: "900",
  },
  income: {
    color: GREEN,
  },
  expense: {
    color: RED,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: TEXT,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 22,
  },
  pageTitleLeft: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  expenseToggle: {
    flex: 1,
    backgroundColor: RED,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
  },
  incomeToggle: {
    flex: 1,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: "center",
  },
  toggleSelectedText: {
    color: "#FFF",
    fontWeight: "900",
  },
  toggleText: {
    color: GREEN,
    fontWeight: "900",
  },
  selector: {
    height: 46,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    color: MUTED,
  },
  cancelText: {
    textAlign: "center",
    color: GREEN,
    fontWeight: "900",
    marginTop: 18,
  },
  search: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#F7F7F7",
  },
  filterChipActive: {
    backgroundColor: GREEN,
  },
  filterChipText: {
    fontWeight: "800",
    color: TEXT,
  },
  filterChipTextActive: {
    color: "#FFF",
  },
  dateTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginVertical: 14,
  },
  monthSelector: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  monthText: {
    fontWeight: "900",
  },
  chartCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  donutFake: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#DFF5E8",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
    borderWidth: 24,
    borderColor: GREEN,
  },
  donutText: {
    textAlign: "center",
    fontWeight: "900",
    color: TEXT,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statsLabel: {
    color: MUTED,
  },
  statsValue: {
    fontWeight: "900",
  },
  lineChartFake: {
    height: 160,
    backgroundColor: "#F1FAF5",
    borderRadius: 14,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
  chartText: {
    backgroundColor: GREEN,
    color: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: "900",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileAvatarText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "900",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "900",
  },
  profileEmail: {
    color: MUTED,
    marginTop: 4,
  },
  badge: {
    color: GREEN,
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
    overflow: "hidden",
    fontWeight: "900",
    alignSelf: "flex-start",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIcon: {
    width: 32,
  },
  settingLabel: {
    flex: 1,
    fontWeight: "800",
    color: TEXT,
  },
  settingValue: {
    color: MUTED,
  },
  logoutButton: {
    backgroundColor: "#FFD6D6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
  },
  logoutText: {
    color: RED,
    fontWeight: "900",
  },
  sentryCard: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },
  sentryTitle: {
    color: "#FFF",
    fontWeight: "900",
    marginBottom: 12,
  },
  errorButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  sentryRow: {
    flexDirection: "row",
    gap: 8,
  },
  sentryButton: {
    flex: 1,
    backgroundColor: GREEN,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  sentryButtonText: {
    color: "#FFF",
    fontWeight: "900",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 76,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navIcon: {
    fontSize: 21,
    color: "#555",
  },
  navText: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
  },
  navActive: {
    color: GREEN,
    fontWeight: "900",
  },
});