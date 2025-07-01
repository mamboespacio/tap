
import { getAddresses } from "@/lib/loaders";
import { Address } from "@/lib/types";
import AddressItem from "@/components/AddressItem";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Stack } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useEffect, useState } from "react";
import LinkedButton from "@/components/ui/LinkedButton";
import { useUserStore } from '@/data/UserStore';

const AddressesPage = () => {
  const userStore = useUserStore();
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  useEffect(() => {
    if (!userStore.user?.id) {
      console.warn("No user ID found, cannot fetch addresses.");
      return;
    }
    getAddresses(userStore.user.id).then((addresses) => {
      setAddresses(addresses.data);
    });
  }, [userStore.user?.id]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTintColor: "black",
          title: "Mis direcciones",
        }}
      />
      <View className='p-4 gap-4'>
        {addresses === null ? (
          <ActivityIndicator color={"#fff"} size={"large"} />
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }: { item: Address; index: number }) => (
              <AddressItem item={item} index={index} />
            )}
          />
        )}
        <LinkedButton
          href="/geolocation"
          text="+ Nueva dirección"
          color="white"
          textColor="green"
          borderColor="green"
        />
      </View>
    </Screen>
  );
}

export default AddressesPage;