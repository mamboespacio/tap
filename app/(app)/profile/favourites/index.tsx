
import { getFavouriteVendors } from "@/lib/loaders";
import { Vendor } from "@/lib/types";
import { useUserStore } from "@/data/UserStore";
import VendorItem from "@/components/VendorItem";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Stack } from 'expo-router';
import { Screen } from '@/components/Screen';
import { useEffect, useState } from "react";

const FavouritesPage = () => {
  const user = useUserStore((state) => state.user);
  const [favourites, setFavourites] = useState<Vendor[] | null>(null);
  useEffect(() => {
    const fetchFavourites = async () => {
      if (user.favourites && user.favourites.length > 0) {
        const vendors = await getFavouriteVendors(user.favourites);
        setFavourites(vendors.data);
      } else {
        setFavourites([]);
      }
    };
    fetchFavourites();
  }, []);

return (
  <Screen>
    <Stack.Screen
      options={{
        headerTintColor: "black",
        title: "Mis Favoritos",
      }}
    />
    <View className='p-4 gap-4'>
      {favourites === null ? (
        <ActivityIndicator color={"#fff"} size={"large"} />
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }: { item: Vendor; index: number }) => (
            <VendorItem item={item} index={index} />
          )}
        />
      )}
    </View>
    </Screen>
  );
}

export default FavouritesPage;