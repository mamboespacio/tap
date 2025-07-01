import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { getVendorById } from '@/lib/loaders';
import { formatTime } from '@/lib/utils';
import { useLocalSearchParams, Link, Stack } from 'expo-router';
import { Vendor, Product } from '@/lib/types';
import { Screen } from '@/components/Screen';

export default function VendorPage() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const numericId = Number(id);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNaN(numericId)) {
      getVendorById(numericId)
        .then(setVendor)
        .catch(() => setError('Error fetching vendor'))
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
          title: vendor ? vendor.name : 'Cargando comercio',
        }}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-4">Cargando comercio...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : (
        <ScrollView>
          <View className="relative">
            <Image
              source={require('@/assets/images/veggie3.png')}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
            <View className="absolute inset-0 items-center justify-center">
              <View className="rounded-lg px-8 py-4 bg-white/80">
                <Text className="text-center font-semibold text-lg">{vendor?.name}</Text>
                <Text className="text-center text-gray-700">{vendor?.address}</Text>
                <Text className="text-center text-gray-500">
                  Horario: {formatTime(vendor!.openingHours)} a {formatTime(vendor!.closingHours)}
                </Text>
              </View>
            </View>
          </View>

          <View className="p-4 space-y-4">
            <Text className="font-semibold text-lg">Packs Disponibles</Text>
            <FlatList
              data={vendor?.products}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={false}
              renderItem={({ item, index }) => <ProductCard item={item} index={index} />}
            />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

function ProductCard({ item }: { item: Product; index: number }) {
  return (
    <Link href={`/products/${item.id}`} asChild>
      <Pressable className="flex-row items-center bg-white rounded-xl overflow-hidden mb-3 active:opacity-70 shadow-xs shadow-black/10">
        <Image
          source={require('@/assets/images/veggie3.png')}
          style={{ width: 96, height: 96 }} // w-24 = 96px
          className="mr-4"
        />
        <View className="flex-1">
          <Text className="text-base font-semibold">{item.name}</Text>
          <Text className="text-sm font-bold text-green-600">${item.price}</Text>
          <Text className="text-xs text-gray-500">3 Disponibles</Text>
        </View>
      </Pressable>
    </Link>
  );
}
