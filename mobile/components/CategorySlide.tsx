import { getAllCategories } from "@/lib/loaders";
import { useState, useEffect } from 'react';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Link } from "expo-router";
import { Category } from "@/lib/types";

export function CategorySlide() {
  
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    getAllCategories().then((categories) => {
      setCategories(categories);
    });
  }, []);

  return (
    <View>
      {categories === null ? (
        <ActivityIndicator color={"#fff"} size={"large"} />
      ) : (
      <SwiperFlatList
        data={categories}
        renderItem={({ item }) => (
          <View key={item.slug} className="mr-4">
            <Link href={`/categories/${item.slug}`} asChild>
              <View>
                <Text className="text-sm text-center">{item.name}</Text>
                  {/* <Image
                    source={{ uri: item.cover }}
                    style={styles.image}
                    className="aspect-square"
                  /> */}
                  <Image
                    source={require('@/assets/images/veggie3.png')}
                    style={styles.image}
                    className="aspect-square"
                  />
              </View>
            </Link>
          </View>
        )}
      />
    )}
    </View>  
  )
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});