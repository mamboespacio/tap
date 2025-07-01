import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { registerUser } from "@/lib/loaders";
import { useUserStore } from "@/data/UserStore";
import LinkedButton from "@/components/ui/LinkedButton";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupMessage, setSignupMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const userStore = useUserStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let valid = true;

    if (!fullName) {
      newErrors.fullName = "El nombre completo es requerido.";
      valid = false;
    }

    if (!dni) {
      newErrors.dni = "El DNI es requerido.";
      valid = false;
    } else if (dni.length < 8) {
      newErrors.dni = "El DNI debe tener al menos 8 caracteres.";
      valid = false;
    }

    if (!email) {
      newErrors.email = "El email es requerido.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El email no es válido.";
      valid = false;
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    setSignupMessage(null);
    try {
      const response = await registerUser(email, password, fullName, dni);
      if (!response || response.error) {
        setSignupMessage(response?.error || "Ops! Algo salió mal.");
        return;
      }
      userStore.setUser(response.user); // debe incluir el jwt internamente
      router.push("/");
    } catch (error) {
      setSignupMessage("Error de red. Intenta de nuevo.");
    }
  };

  const handleValidatedSignup = () => {
    if (validate()) handleSignup();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Registrarse", headerTintColor: "black" }} />

      <Text style={styles.headline}>SignUp</Text>

      <Input label="Nombre completo" value={fullName} onChange={setFullName} error={errors.fullName} />
      <Input label="DNI" value={dni} onChange={setDni} error={errors.dni} keyboardType="number-pad" />
      <Input label="Email" value={email} onChange={setEmail} error={errors.email} keyboardType="email-address" />
      <Input label="Contraseña" value={password} onChange={setPassword} error={errors.password} secureTextEntry />
      <Input label="Confirmar Contraseña" value={confirmPassword} onChange={setConfirmPassword} error={errors.confirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleValidatedSignup}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>

      <LinkedButton
        href="/signin"
        text="Ya tengo cuenta"
        color="white"
        textColor="green"
        borderColor="green"
      />

      {signupMessage && (
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {signupMessage}
        </Text>
      )}
    </View>
  );
}

const Input = ({
  label,
  value,
  onChange,
  error,
  keyboardType = "default",
  secureTextEntry = false,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  keyboardType?: "default" | "email-address" | "number-pad";
  secureTextEntry?: boolean;
}) => (
  <>
    <Text>{label}:</Text>
    <TextInput
      style={styles.input}
      placeholder={`Ingresa tu ${label.toLowerCase()}`}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={label === "Email" ? "none" : "words"}
    />
    {error && <Text style={{ color: "red", marginBottom: 5 }}>{error}</Text>}
  </>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  headline: {
    textAlign: "center",
    marginTop: -100,
    marginBottom: 50,
    fontWeight: "700",
    fontStyle: "italic",
    fontSize: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    borderColor: "grey",
  },
  button: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
