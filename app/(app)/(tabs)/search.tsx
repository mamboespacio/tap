import { Vendor } from "@/lib/types";
import { getVendors } from "@/lib/loaders";
import VendorItem from "@/components/VendorItem";
import { Screen } from "@/components/Screen";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Image, Text, View, ScrollView, FlatList, ActivityIndicator, Pressable } from "react-native";

export default function Search() {
  const [results, setResults] = useState<Vendor[] | null>(null);
  const [filteredResults, setFilteredResults] = useState<Vendor[] | null>(null);

  useEffect(() => {
    getVendors().then((result: { data: Vendor[] }) => {
      setResults(result.data);
    });
  }, []);

  const handleSearch = (text: string) => {
    if (text && results){
      const tempResults = results.filter((p: Vendor) => p.name.toLowerCase().includes(text.toLowerCase()));
      setFilteredResults(tempResults);
      // console.log(tempResults);
    }
    else {
      setFilteredResults([]);
    }
  };

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: 'Buscar',
          headerTintColor: "black",
          headerSearchBarOptions: {
            placeholder: 'Busca tu comercio preferido',
            onChangeText(ev){
              handleSearch(ev.nativeEvent.text);
            }
          }
        }}
      />
      <View className="p-4">
        {filteredResults === null ? (
          <ActivityIndicator color={"#fff"} size={"large"} />
        ) : (
          <ScrollView>
            <FlatList
              data={filteredResults && filteredResults.length > 0 ? filteredResults : results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }: { item: Vendor; index: number }) => (
                <VendorItem item={item} index={index} />
              )}
            />
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

function VendorCard({ vendor, index }: { vendor: Vendor; index: number }){
  return(
    <Link href={`/vendors/${vendor.id}`} asChild>
      <Pressable className="active:opacity-70">
        <View key={index}>
          <div className="rounded-lg overflow-hidden">
            <Image
              source={require('@/assets/images/veggie3.png')}
              style={styles.image}
              className="aspect-video"
            />
          </div>
          <Text className="text-sm text-left font-semibold">{vendor.name}</Text>
        </View>
      </Pressable>
    </Link>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
});