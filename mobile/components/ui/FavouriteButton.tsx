import { useUserStore } from "@/data/UserStore";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function FavouriteButton(item: any) {
  const user = useUserStore((state) => state.user);
  const [isFavourite, setIsFavourite] = useState(user?.favourites?.includes(item.data.id));
  const handleFavourite = (id: number) => {
    if (user?.favourites?.includes(id)) {
      // Remove from favourites
      useUserStore.getState().removeItem(id);
      setIsFavourite(false);
    } else {
      // Add to favourites
      useUserStore.getState().addItem(id);
      setIsFavourite(true);
    }
  };
  return (
    <TouchableOpacity
    onPress={() => handleFavourite(item.data.id)}>
      <Ionicons
        name={user?.favourites?.includes(item.data.id) ? 'heart' : 'heart-outline'}
        size={20}
        color={user?.favourites?.includes(item.data.id) ? 'red' : undefined}
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});