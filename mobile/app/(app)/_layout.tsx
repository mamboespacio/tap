import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useUserStore } from "@/data/UserStore";

export default function AppLayout() {
  const { user, loadUserFromStorage } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await loadUserFromStorage(); // carga desde AsyncStorage
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return null;

  if (!user?.jwt) {
    return <Redirect href="/signin" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
