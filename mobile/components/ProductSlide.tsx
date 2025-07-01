import { getAllProducts } from "@/lib/loaders";
import { useState, useEffect } from 'react';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Link } from "expo-router";
import { Product } from "@/lib/types";

export function ProductSlide() {
  
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);
  
  return (
    <View>
      <View className='py-4'>
        <Text className='font-semibold'>Promociones de hoy</Text>
      </View>
      {products === null ? (
        <ActivityIndicator color={"#fff"} size={"large"} />
      ) : (
      <SwiperFlatList
        // autoplay
        // autoplayDelay={2}
        // autoplayLoop
        style={styles.slider}
        index={1}
        data={products}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.item}>
            <Link href={`/products/${item.id}` as any} asChild>
              <View>
                <Text className="text-sm">{item.name}</Text>
                  {/* <Image
                    source={{ uri: item.cover }}
                    style={styles.image}
                    className="aspect-square"
                  /> */}
                  <Image
                    source={require('@/assets/images/veggie3.png')}
                    style={styles.image}
                    className="aspect-4/3 object-cover"
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
    width: 216,
    height: 120,
    borderRadius: 10,
  },
  slider:{
    display: 'flex',
    flexDirection: 'row',
    columnGap: 10,
  },
  item: {
    display: 'flex',
    gap: 10,
  }
});