import { Vendor as Item } from "@/lib/types";
import FavouriteButton from "@/components/ui/FavouriteButton";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function VendorItem({ item, index }: { item: Item, index: number }) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.vendorCard}>
        <Image
          source={require('@/assets/images/veggie3.png')}
          style={styles.image}
          className="aspect-square"
        />
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => router.push(`/vendors/${item.id}`)}
        >
          <Text style={[styles.name]}>
            {item.name}
          </Text>
          <Text>{item.longitude}, {item.latitude}</Text>
        </TouchableOpacity>
        <FavouriteButton data={item} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    width: '100%',
    gap: 10,
    borderColor: '#e5e7eb', // Tailwind border-gray-200
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  inUse: {
    color: '#22c55e', // Tailwind green-500
  },
  primary: {
    color: '#2563eb', // Tailwind primary (blue-600)
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
});