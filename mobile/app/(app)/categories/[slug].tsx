import { Link, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, Image, FlatList, Text, View, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getVendorsByProductCategory } from "@/lib/loaders";
import { formatTime } from "@/lib/utils";
import { Screen } from "@/components/Screen";
import { Vendor } from "@/lib/types";

export default function Detail() {
  const params = useLocalSearchParams<{ slug: string }>();
  const [vendors, setVendors] = useState<Vendor[] | null>(null);

  useEffect(() => {
    if (params.slug) {
      getVendorsByProductCategory(params.slug).then((vendors) => {
        setVendors(vendors);
      });
    }
  }, []);


  return (
    <Screen>
      <Stack.Screen
        options={{
          headerTintColor: "black",
          title: params.slug,
        }}
      />
      <View style={styles.container}>
        {vendors === null ? (
          <ActivityIndicator color="#000" size="large" />
        ) : (
          <FlatList
            data={vendors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <VendorCard vendor={item} index={index} />
            )}
            contentContainerStyle={{ gap: 16 }}
          />
        )}
      </View>
    </Screen>
  );
}

function VendorCard({ vendor }: { vendor: Vendor; index: number }) {
  return (
    <Link href={`/vendors/${vendor.id}`} asChild>
      <Pressable style={styles.card} android_ripple={{ color: '#ccc' }}>
        <Image
          source={require('@/assets/images/veggie3.png')}
          style={styles.image}
        />
        <Text style={styles.name}>{vendor.name}</Text>
        <Text style={styles.hours}>
          {formatTime(vendor.openingHours)} a {formatTime(vendor.closingHours)}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    padding: 12,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  hours: {
    fontSize: 14,
    color: '#555',
  },
});
