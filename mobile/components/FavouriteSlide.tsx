import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Link } from "expo-router";
import { getStrapiURL } from '@/lib/utils';


import { useUserStore } from "@/data/UserStore";
import { getVendors } from "@/lib/loaders";
import { Vendor } from "@/lib/types";

export function FavouriteSlide() {
  const user = useUserStore((state) => state.user);
  const [favourites, setFavourites] = useState<Vendor[] | null>(null);

  useEffect(() => {
    if (user.favourites.length === 0) {
      setFavourites([]); // evitar fetch innecesario
      return;
    }

    getVendors({
      filters: {
        id: { $in: user.favourites },
      },
    }).then((res) => {
      setFavourites(res.data);
    }).catch(() => {
      setFavourites([]);
    });
  }, [user.favourites]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus favoritos</Text>

      {favourites === null ? (
        <ActivityIndicator color={"#000"} size="large" />
      ) : favourites.length === 0 ? (
        <Text style={styles.empty}>No tenés favoritos todavía.</Text>
      ) : (
        <SwiperFlatList
          autoplay
          autoplayDelay={2}
          autoplayLoop
          index={0}
          data={favourites}
          renderItem={({ item }) => (
            <View key={item.id} style={styles.card}>
              <Link href={`/vendors/${item.id}`} asChild>
                <View>
                  <Image
                    source={{
                      uri: item.cover?.formats?.thumbnail?.url
                        ? getStrapiURL() + item.cover.formats.thumbnail.url
                        : 'https://via.placeholder.com/120x120.png?text=Sin+imagen',
                    }}
                    style={styles.image}
                  />
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </Link>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    marginRight: 12,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#eee', // por si tarda en cargar
  },
  empty: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
});
