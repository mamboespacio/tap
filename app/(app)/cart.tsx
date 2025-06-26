import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Button, ActivityIndicator, Platform } from 'react-native';
import { useCartStore } from "@/data/CartStore";
import { useUserStore } from "@/data/UserStore";
import CartItem from "@/components/CartItem";
import { mutateData, createPreference } from "@/lib/loaders";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { authAxios } from "@/lib/authAxios";
import { router, useNavigation } from "expo-router";
import * as Linking from 'expo-linking';

initMercadoPago('TEST-a8cef775-7dae-43d3-b850-f2e50f6a0130', { locale: 'es-AR' });

const CartPage = () => {
  const api = authAxios();
  const user = useUserStore();
  const { products: cartProducts, removeAll } = useCartStore();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const totalPrice = cartProducts.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const createOrder = async () => {
    const vendorId = cartProducts?.[0]?.product?.vendors?.[0]?.id;
    if (!vendorId) return console.warn("Vendor ID faltante.");

    setLoading(true);

    try {
      const formattedProducts = cartProducts.map(p => ({
        product: p.product.id,
        quantity: p.quantity,
      }));

      const response = await mutateData('POST', 'orders', {
        data: {
          vendor: vendorId,
          condition: 'pending',
          products: formattedProducts,
          price: totalPrice.toString(),
        },
      });

      const orderId = response.data?.data?.id;

      const res = await api.post("http://localhost:1337/api/orders/start-payment", {
        orderId: orderId,
      });

      const mpUrl = res.data.mp_url;
      if (Platform.OS === 'web') {
        window.location.href = mpUrl;
      } else {
        Linking.openURL(mpUrl);
      }


      setPreferenceId(mpUrl);
      removeAll();
    } catch (error) {
      console.log("Error creando orden:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalles del pedido</Text>

      {cartProducts.length > 0 ? (
        cartProducts.map(p => (
          <CartItem key={p.product.id} item={p} />
        ))
      ) : (
        <Text>El carrito está vacío.</Text>
      )}

      <View style={styles.row}>
        <Text>Retiro:</Text>
        <Text style={styles.bold}>Gratis</Text>
      </View>
      <View style={styles.row}>
        <Text>Total:</Text>
        <Text style={styles.bold}>${totalPrice}</Text>
      </View>

      <Text style={styles.subtitle}>Información importante</Text>
      <View style={styles.infoBox}>
        <View>
          <Text>Horario de retiro</Text>
          <Text style={styles.bold}>4 a 6</Text>
        </View>
        <View>
          <Text>Dirección de retiro</Text>
          <Text style={styles.bold}>Av. Música 1234</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <Button title="Confirmar pedido" onPress={createOrder} disabled={loading} />
        )}
      </View>

      {preferenceId && (
        <View style={{ marginTop: 20 }}>
          <Wallet initialization={{ preferenceId }} />
        </View>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  subtitle: {
    marginTop: 20,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bold: {
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 10,
    backgroundColor: '#f3f3f3',
    padding: 10,
    borderRadius: 8,
  },
});

export default CartPage;
