import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";

import colors from "../theme/colors";
import { useAppTheme } from "../theme/ThemeContext";

function SettingRow({
  icon,
  title,
  subtitle,
  right,
  onPress,
  iconBg,
  iconColor,
  theme,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.settingRow,
        {
          backgroundColor: theme.card,
          borderBottomColor: theme.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>

      <View style={styles.settingTextBox}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>
          {title}
        </Text>

        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContent}>
        {right || (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.textMuted}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const { theme, isDarkMode, toggleDarkMode } = useAppTheme();

  const handleLogout = () => {
    Sentry.captureMessage("Usuario cerró sesión en FinTrack");
    navigation.replace("Login");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Inicio")}>
          <Ionicons name="chevron-back" size={26} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.primary }]}>
          Perfil
        </Text>

        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDarkMode ? "#2A3139" : "#EEF1F5",
                borderColor: theme.primary,
              },
            ]}
          >
            <Ionicons name="person" size={42} color={theme.textMuted} />
          </View>

          <TouchableOpacity style={styles.addBadge}>
            <Ionicons name="add" size={17} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.editBadge, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="pencil" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.name, { color: theme.text }]}>Diego Levano</Text>

        <Text style={[styles.email, { color: theme.textMuted }]}>
          diego.levano@gmail.com
        </Text>

        <View style={[styles.userBadge, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="checkmark-circle" size={14} color={theme.primary} />

          <Text style={[styles.userBadgeText, { color: theme.primary }]}>
            Usuario estándar
          </Text>
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <SettingRow
          icon="notifications-outline"
          title="Notificaciones"
          iconBg={isDarkMode ? "#123322" : "#E8F7EF"}
          iconColor={theme.primary}
          theme={theme}
          right={
            <Switch
              value={true}
              style={styles.switchControl}
              trackColor={{ false: "#D1D5DB", true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SettingRow
          icon="moon-outline"
          title="Modo oscuro"
          iconBg={isDarkMode ? "#2A3139" : "#EEEEEE"}
          iconColor={isDarkMode ? "#FACC15" : "#666666"}
          theme={theme}
          right={
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              style={styles.switchControl}
              trackColor={{ false: "#D1D5DB", true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SettingRow
          icon="alert-circle-outline"
          title="Alertas de presupuesto"
          iconBg={isDarkMode ? "#123322" : "#E8F7EF"}
          iconColor={theme.primary}
          theme={theme}
          right={
            <Switch
              value={true}
              style={styles.switchControl}
              trackColor={{ false: "#D1D5DB", true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </View>

      <View style={styles.settingsGroup}>
        <SettingRow
          icon="download-outline"
          title="Exportar datos"
          iconBg={isDarkMode ? "#2A3139" : "#F1F3F5"}
          iconColor={theme.textMuted}
          theme={theme}
        />

        <SettingRow
          icon="shield-checkmark-outline"
          title="Seguridad"
          iconBg={isDarkMode ? "#2A3139" : "#F1F3F5"}
          iconColor={theme.textMuted}
          theme={theme}
        />

        <SettingRow
          icon="help-circle-outline"
          title="Ayuda y soporte"
          iconBg={isDarkMode ? "#2A3139" : "#F1F3F5"}
          iconColor={theme.textMuted}
          theme={theme}
        />

        <SettingRow
          icon="information-circle-outline"
          title="Acerca de FinTrack"
          iconBg={isDarkMode ? "#2A3139" : "#F1F3F5"}
          iconColor={theme.textMuted}
          theme={theme}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            backgroundColor: isDarkMode ? "#3A1E1E" : colors.dangerSoft,
          },
        ]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={18} color={theme.danger} />

        <Text style={[styles.logoutText, { color: theme.danger }]}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>

      <View style={{ height: 120 }} />
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
    justifyContent: "space-between",
    marginBottom: 26,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  profileCard: {
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
  },
  addBadge: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 21,
    fontWeight: "900",
  },
  email: {
    fontSize: 14,
    marginTop: 3,
    marginBottom: 14,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userBadgeText: {
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 6,
  },
  settingsGroup: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
  },
  settingRow: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  settingTextBox: {
    flex: 1,
    justifyContent: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  rightContent: {
    height: 44,
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  switchControl: {
    transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }],
  },
  logoutButton: {
    height: 60,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
  },
});