import { Text, View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router'; 
import {CategorySlide} from '@/components/CategorySlide';
import { ProductSlide } from '@/components/ProductSlide';
import { AddressSelector } from '@/components/AddressSelector';
import { FavouriteSlide } from '@/components/FavouriteSlide';

export default function Index() {
  return (
    <View className="p-4">
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <AddressSelector/>
      <CategorySlide/>
      <ProductSlide/>
      <FavouriteSlide/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
