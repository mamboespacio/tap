import { Address as Item } from "@/lib/types";
import { useAddressStore } from "@/data/AddressStore";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AddressItem({ item, index }: { item: Item, index: number }) {
  const router = useRouter();
  const addressStore = useAddressStore();

  const deleteAddress = (id: string) => {
    // do something
  };

  const changeAddress = (item: Item) => {
    if (inUse(item.id)) {
      return;
    } else {
      addressStore.setAddress(item);
    }
    router.replace('/');
  };

  const inUse = (id: string) => {
    return Array.isArray(addressStore.address)
      ? addressStore.address.some((addr: Item) => addr.id === id)
      : (addressStore.address as Item).id === id;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => changeAddress(item)}
        >
          <Text style={[styles.name, inUse(item.id) ? styles.inUse : styles.primary]}>
            {item.name}
          </Text>
          <Text>{item.longitude}, {item.latitude}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteAddress(item.id)}
          style={styles.iconButton}
        >
          <Ionicons name='trash-outline' size={20} />
        </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  iconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});