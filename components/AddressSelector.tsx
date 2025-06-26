import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { useUserStore } from "@/data/UserStore";
import { useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';


export function AddressSelector() {
  const {loadUserFromStorage, user} = useUserStore();
  useEffect(() => {
    loadUserFromStorage();
  }, []);
  
  return (
    <View className="pb-4 flex flex-row items-center justify-between">
      <Link href='/profile' asChild>
        <Pressable className="flex-row justify-between active:opacity-70">
          <Text className="font-semibold">{user.fullName}, al rescate!</Text>
        </Pressable>
      </Link>
      <Link href='/profile/addresses' asChild>
        <Pressable>
          <Text className="flex items-center"><Ionicons name='location-sharp' size={16} /> Casa</Text>
        </Pressable>
      </Link>
    </View>
  )
}