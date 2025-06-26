import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { Link, Redirect, Stack } from "expo-router";
import { loginUser } from "@/lib/loaders";
import { useUserStore } from '@/data/UserStore';
import { useSessionStore } from '@/data/SessionStore';
import { useRouter } from 'expo-router';
import LinkedButton from "@/components/ui/LinkedButton";

const signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const userStore = useUserStore();
  const sessionStore = useSessionStore();

  const handleLogin = async () => {
  setLoginMessage(null);

  try {
    const response = await loginUser(email, password);

    if (!response || response.error) {
      setLoginMessage('Email o contraseña incorrectos.');
      return;
    }

    userStore.setUser({
      ...response.user,
      fullName: response.user.fullName || response.user.username,
      jwt: response.jwt,
      favourites: [], // opcional: podrías fetcharlos después
    });

    router.replace('/');
  } catch (error) {
    setLoginMessage('Error de red. Intenta de nuevo.');
  }
};


  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const validate = () => {
    let valid = true;
    let newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return valid;
  };

  const handleValidatedLogin = async () => {
    if (!validate()) return;
    await handleLogin();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTintColor: "black",
          title: "Iniciar Sesión",
        }}
      />
      <View>
        <Text style={styles.headline}>
          SignIn
        </Text>

        <Text>Email:</Text>
        <TextInput
          placeholder="Ingresa tu email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email ? (
          <Text style={{ color: "red", marginBottom: 5 }}>{errors.email}</Text>
        ) : null}

        <Text>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        {errors.password ? (
          <Text style={{ color: "red", marginBottom: 5 }}>{errors.password}</Text>
        ) : null}
        <Link href="./forgot-password" style={{ textAlign: "center" }}>
          <Text style={{ color: "black", textDecorationLine: "underline" }}>Olvidé mi contraseña</Text>
        </Link>
        <TouchableOpacity style={styles.button} onPress={handleValidatedLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <LinkedButton
          href="/signup"
          text="Registrarme"
          color="white"
          textColor="green"
          borderColor="green"
        />
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {loginMessage}
        </Text>
      </View>
    </View>
  );
};

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
    fontWeight: 700,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,

    marginTop: 10,
    marginBottom: 10,
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
  },
});

export default signin;