import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCartStore } from "@/data/CartStore";


export function CartButton() {
  const {products: cartProducts} = useCartStore();
  let totalProducts = cartProducts.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.quantity;
  }, 0);

  return (
    <Link href='/cart' asChild>
      <Pressable className="active:opacity-70 p-4">
        <Text className="flex items-center"><Ionicons name='bag-outline' size={16} />{totalProducts}</Text>
      </Pressable>
    </Link>
  )
}