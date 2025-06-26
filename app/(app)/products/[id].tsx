import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { getProductById } from '@/lib/loaders';
import { formatTime } from '@/lib/utils';
import { Screen } from '@/components/Screen';
import { Product } from '@/lib/types';
import { CartButton } from '@/components/ui/CartButton';
import { useCartStore } from '@/data/CartStore';

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(Math.max(1, quantity - 1));

  useEffect(() => {
    if (id) {
      getProductById(id).then((result) => {
        setProduct(result.data?.[0] ?? null);
      });
    }
  }, [id]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTintColor: 'black',
          title: product?.name ?? id,
          headerRight: () => <CartButton />,
        }}
      />

      <View>
        {product === null ? (
          <ActivityIndicator color={'#000'} size={'large'} />
        ) : (
          <ScrollView>
            <View>
              <Image
                style={styles.image}
                source={require('@/assets/images/veggie3.png')}
              />
              <View style={styles.overlay}>
                <View style={styles.overlayContent}>
                  <Text style={styles.textCenterBold}>
                    {product?.vendors?.[0]?.name}
                  </Text>
                  <Text style={styles.textCenter}>
                    {product?.vendors?.[0]?.address}
                  </Text>
                  <Text style={styles.textCenter}>
                    Horario de retiro:{' '}
                    {formatTime(product?.vendors?.[0]?.openingHours)} a{' '}
                    {formatTime(product?.vendors?.[0]?.closingHours)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.content}>
              <View>
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>${product.price}</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>

              <View style={styles.bottomRow}>
                <View style={styles.quantityBlock}>
                  <Pressable onPress={decreaseQuantity}>
                    <Text style={styles.qtyButton}>-</Text>
                  </Pressable>
                  <Text style={styles.qtyText}>{quantity}</Text>
                  <Pressable onPress={increaseQuantity}>
                    <Text style={styles.qtyButton}>+</Text>
                  </Pressable>
                  <Text style={styles.stockText}>
                    {typeof product?.stock === 'number'
                      ? product.stock > 0
                        ? `${product.stock} disponibles`
                        : 'No disponible'
                      : '...'}
                  </Text>
                </View>

                <Pressable
                  onPress={() => addItem({ product, quantity })}
                  disabled={product?.stock === 0}
                >
                  <View
                    style={[
                      styles.saveButton,
                      product?.stock === 0 && { backgroundColor: '#ccc' },
                    ]}
                  >
                    <Text style={styles.saveButtonText}>
                      {product?.stock === 0 ? 'Sin stock' : 'Salvar'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textCenter: {
    textAlign: 'center',
    marginBottom: 4,
  },
  textCenterBold: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontWeight: '600',
    fontSize: 18,
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  quantityBlock: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyButton: {
    fontWeight: '500',
    fontSize: 18,
  },
  qtyText: {
    fontWeight: '500',
    fontSize: 16,
    marginHorizontal: 6,
  },
  stockText: {
    fontSize: 12,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#15803d',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
