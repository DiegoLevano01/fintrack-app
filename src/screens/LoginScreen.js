import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";

import colors from "../theme/colors";
import ButtonPrimary from "../components/ButtonPrimary";

const VALID_EMAIL = "201912025@urp.edu.pe";
const VALID_PASSWORD = "dl2001";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = () => {
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Correo electrónico incompleto o inválido*");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Contraseña incorrecta o incompleta*");
      valid = false;
    }

    if (!valid) return;

    if (email.trim() !== VALID_EMAIL || password !== VALID_PASSWORD) {
      setEmailError("Correo electrónico incompleto o inválido*");
      setPasswordError("Contraseña incorrecta o incompleta*");

      Sentry.captureMessage("Intento de inicio de sesión fallido en FinTrack");
      return;
    }

    Sentry.setUser({
      id: "201912025",
      username: "Diego Levano",
      email: "201912025@urp.edu.pe",
    });

    Sentry.captureMessage("Usuario inició sesión correctamente en FinTrack");

    navigation.replace("MainTabs");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.circleRight} />
      <View style={styles.circleBottomOne} />
      <View style={styles.circleBottomTwo} />
      <View style={styles.circleBottomThree} />

      <View style={styles.content}>
        <Text style={styles.logo}>
          Fin<Text style={styles.logoGreen}>Track</Text>
        </Text>

        <Text style={styles.title}>Hola de nuevo 👋</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <Text style={styles.label}>Correo electrónico:</Text>
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {!!emailError && <Text style={styles.error}>{emailError}</Text>}

        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            placeholder="***************"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordRow}>
          {!!passwordError && <Text style={styles.error}>{passwordError}</Text>}

          <TouchableOpacity>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <ButtonPrimary
          title="Iniciar sesión"
          onPress={handleLogin}
          style={styles.loginButton}
        />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>¿Aún no tienes cuenta?</Text>
          <View style={styles.divider} />
        </View>

        <ButtonPrimary
          title="Crear cuenta"
          onPress={() => navigation.navigate("Register")}
          style={styles.createButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  logo: {
  fontSize: 42,
  fontWeight: "900",
  color: colors.text,
  marginBottom: 28,
  textAlign: "center",
  },
  logoGreen: {
    color: colors.primary,
  },
  title: {
  fontSize: 23,
  fontWeight: "900",
  color: colors.text,
  textAlign: "center",
  },
  subtitle: {
  marginTop: 8,
  marginBottom: 28,
  color: colors.textMuted,
  fontSize: 14,
  textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  inputBox: {
    height: 46,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  error: {
    color: "#DC2626",
    fontSize: 10,
    marginTop: 4,
  },
  passwordRow: {
    minHeight: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  forgotText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  loginButton: {
    marginTop: 18,
  },
  dividerRow: {
    marginVertical: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#9CA3AF",
    fontSize: 12,
  },
  createButton: {
    backgroundColor: colors.primary,
  },
  circleRight: {
    position: "absolute",
    right: -42,
    top: 145,
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#DDF8E8",
    opacity: 0.6,
  },
  circleBottomOne: {
    position: "absolute",
    left: -70,
    bottom: -10,
    width: 135,
    height: 135,
    borderRadius: 70,
    backgroundColor: "#DDF8E8",
    opacity: 0.8,
  },
  circleBottomTwo: {
    position: "absolute",
    left: 32,
    bottom: -52,
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: "#DDF8E8",
    opacity: 0.65,
  },
  circleBottomThree: {
    position: "absolute",
    left: 125,
    bottom: -58,
    width: 125,
    height: 125,
    borderRadius: 65,
    backgroundColor: "#DDF8E8",
    opacity: 0.65,
  },
});