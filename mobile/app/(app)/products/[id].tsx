import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { getProductById } from '@/lib/loaders';
import { formatTime } from '@/lib/utils';
import { Screen } from '@/components/Screen';
import { Product } from '@/lib/types';
import { CartButton } from '@/components/ui/CartButton';
import { useCartStore } from '@/data/CartStore';

export default function ProductPage() {
  const { addItem } = useCartStore();
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const numericId = Number(id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(Math.max(1, quantity - 1));

  useEffect(() => {
    if (!isNaN(numericId)) {
      getProductById(numericId)
        .then(setProduct)
        .catch(() => setError('Error fetching product'))
        .finally(() => setLoading(false));
    } else {
      setError('ID inválido');
      setLoading(false);
    }
  }, [numericId]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTintColor: 'black',
          title: product?.name ?? id,
          headerRight: () => <CartButton />,
        }}
      />

      {loading ? (
        <ActivityIndicator className="mt-10" color="#000" size="large" />
      ) : error ? (
        <Text className="text-center text-red-500 mt-4">{error}</Text>
      ) : (
        <ScrollView>
          {/* Imagen con superposición */}
          <View className="relative">
            <Image
              source={require('@/assets/images/veggie3.png')}
              style={{ width: '100%', height: 300 }}
            />
            <View className="absolute inset-0 justify-center items-center">
              <View className="bg-white/80 px-6 py-3 rounded-lg">
                <Text className="text-center font-semibold">
                  {product?.vendor.name}
                </Text>
                <Text className="text-center">{product?.vendor.address}</Text>
                <Text className="text-center">
                  Horario: {formatTime(product?.vendor.openingHours)} a {formatTime(product?.vendor.closingHours)}
                </Text>
              </View>
            </View>
          </View>

          {/* Info y acciones */}
          <View className="p-4 space-y-4">
            <View>
              <Text className="text-lg font-semibold">{product.name}</Text>
              <Text className="text-base mt-1">${product.price}</Text>
              <Text className="text-sm text-gray-700 mt-2">{product.description}</Text>
            </View>

            <View className="flex-row justify-between items-center mt-4">
              {/* Selector de cantidad */}
              <View className="flex-row items-center border border-black rounded-lg px-3 py-2 space-x-3">
                <Pressable onPress={decreaseQuantity}>
                  <Text className="text-lg font-medium">-</Text>
                </Pressable>
                <Text className="text-base font-medium">{quantity}</Text>
                <Pressable onPress={increaseQuantity}>
                  <Text className="text-lg font-medium">+</Text>
                </Pressable>
                <Text className="text-xs text-gray-500 ml-2">
                  {typeof product.stock === 'number'
                    ? product.stock > 0
                      ? `${product.stock} disponibles`
                      : 'No disponible'
                    : '...'}
                </Text>
              </View>

              {/* Botón salvar */}
              <Pressable
                onPress={() => addItem({ product, quantity })}
                disabled={product?.stock === 0}
                className={`px-6 py-3 rounded-full ${product?.stock === 0 ? 'bg-gray-400' : 'bg-green-700'}`}
              >
                <Text className="text-white font-medium">
                  {product?.stock === 0 ? 'Sin stock' : 'Salvar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
