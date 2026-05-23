import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sentry from "@sentry/react-native";

import colors from "../theme/colors";
import ButtonPrimary from "../components/ButtonPrimary";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("Diego");
  const [lastname, setLastname] = useState("Levano");
  const [email, setEmail] = useState("201912025@urp.edu.pe");
  const [phone, setPhone] = useState("989762304");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Nombre obligatorio*";
    if (!lastname.trim()) newErrors.lastname = "Apellido obligatorio*";
    if (!email.trim()) newErrors.email = "Correo electrónico incompleto o inválido*";
    if (!phone.trim()) newErrors.phone = "Número de teléfono incompleto o inválido*";
    if (!password.trim()) newErrors.password = "Contraseña incompleta o inválida*";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Confirma tu contraseña*";

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Contraseña no coincide*";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Sentry.captureMessage("Registro incompleto en FinTrack");
      return;
    }

    Sentry.setUser({
      id: "201912025",
      username: "Diego Levano",
      email: "201912025@urp.edu.pe",
    });

    Sentry.captureMessage("Usuario creó cuenta correctamente en FinTrack");

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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>
          Fin<Text style={styles.logoGreen}>Track</Text>
        </Text>

        <Text style={styles.title}>CREAR CUENTA</Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Primer nombre:</Text>
            <TextInput
              style={styles.inputSimple}
              value={name}
              onChangeText={setName}
              placeholder="Diego"
            />
            {!!errors.name && <Text style={styles.error}>{errors.name}</Text>}
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Primer apellido:</Text>
            <TextInput
              style={styles.inputSimple}
              value={lastname}
              onChangeText={setLastname}
              placeholder="Levano"
            />
            {!!errors.lastname && (
              <Text style={styles.error}>{errors.lastname}</Text>
            )}
          </View>
        </View>

        <Text style={styles.label}>Correo electrónico:</Text>
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="201912025@urp.edu.pe"
          />
        </View>
        {!!errors.email && <Text style={styles.error}>{errors.email}</Text>}

        <Text style={styles.label}>Numero de teléfono: (opcional)</Text>
        <View style={styles.inputBox}>
          <Ionicons name="call" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="989762304"
          />
        </View>
        {!!errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="***************"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {!!errors.password && (
          <Text style={styles.error}>{errors.password}</Text>
        )}

        <Text style={styles.label}>Confirmar contraseña:</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            placeholder="***************"
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {!!errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        )}

        <ButtonPrimary
          title="Crear cuenta"
          onPress={handleRegister}
          style={styles.createButton}
        />

        <TouchableOpacity
          style={styles.backLogin}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backLoginText}>Volver al login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 95,
    paddingBottom: 45,
  },
  logo: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 34,
  },
  logoGreen: {
    color: colors.primary,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 28,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 6,
  },
  inputSimple: {
    height: 43,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    borderRadius: 9,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: "#FFFFFF",
  },
  inputBox: {
    height: 43,
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
    marginBottom: 8,
  },
  createButton: {
    marginTop: 22,
  },
  backLogin: {
    marginTop: 16,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  backLoginText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
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