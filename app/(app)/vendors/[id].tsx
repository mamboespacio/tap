import { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { getVendors } from "@/lib/loaders"
import { formatTime } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Vendor, Product } from '@/lib/types';

export default function VendorPage() {
  const params = useLocalSearchParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);

  useEffect(() => {
  if (params?.id) {
    getVendors({
      filters: {
        id: {
          $eq: params.id
        }
      },
      populate: '*'
    }).then((result) => {
      setVendor(result.data?.[0] ?? null);
    });
  }
}, [params?.id]);


  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTintColor: "black",
          title: Array.isArray(params.id) ? params.id[0] : params.id,
        }}
      />
      <View>
        {vendor === null ? (
          <ActivityIndicator color={"#fff"} size={"large"} />
        ) : (
          <ScrollView>
            <View>
              <Image style={styles.image} source={require('@/assets/images/veggie3.png')} />
              <View style={styles.overlay}>
                <View
                  style={styles.overlayContent}
                  className="px-8 py-4 rounded-lg"
                >
                  <Text className='text-center font-semibold'>{vendor.name}</Text>
                  <Text className='text-center'>{vendor.address}</Text>
                  <Text className='text-center'>
                    Horario de retiro: {formatTime(vendor.openingHours)} a {formatTime(vendor.closingHours)}
                  </Text>
                </View>
              </View>
            </View>
            <View className='p-4 gap-4'>
              <Text className="font-semibold">Packs Disponibles</Text>
              <FlatList
                data={vendor.products}
                keyExtractor={(item) => item.documentId}
                renderItem={({ item, index }: { item: Product; index: number }) => (
                  <ProductCard item={item} index={index} />
                )}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </Screen >
  );
};

function ProductCard({ item, index }: { item: Product; index: number }){
  return(
    <Link href={`/products/${item.id}`} asChild>
      <Pressable className="active:opacity-70">
        <View style={styles.productCard} key={index}>   
          <View className="col-span-2">
            <Image
              source={require('@/assets/images/veggie3.png')}
              style={styles.productImage}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </Text>
            <Text>3 Disponibles</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 200 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  overlayContent: { backgroundColor: 'rgba(255, 255, 255, 0.8)' },
  productImage: { width: 100, height: 100 },
  productCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, backgroundColor: '#fff', marginBottom: 10, overflow: 'hidden'},
  productInfo: { marginLeft: 10 },
  productName: { fontSize: 16 },
  productPrice: { fontSize: 14, fontWeight: 'bold' },
  productStock: { fontSize: 12, color: '#888' },
});
