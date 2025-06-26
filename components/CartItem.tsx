import { CartItem as Item } from "@/lib/types";
import { useCartStore } from "@/data/CartStore";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Button } from 'react-native';

export default function CartItem({ item }: { item: Item }) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();
  return (
    <View className="flex justify-between items-center gap-x-5 border-b-[1px] py-2">
      <Text>{item.product.name}</Text>
      <View className="flex items-center gap-x-2">
        <Button
          onPress={() => decreaseQuantity(item.product.id)}
          title={item.quantity <= 1 ? 'borrar' : '-'}>
        </Button>
        <Text>{item.quantity}</Text>
        <Button
          onPress={() => increaseQuantity(item.product.id)}
          title="add">
        </Button>
        <Text>${(item.quantity * item.product.price).toFixed(2)}</Text>
      </View>
    </View>

  )
}