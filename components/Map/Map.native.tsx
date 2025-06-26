// src/components/Map/Map.native.tsx
import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const location = {
  latitude: -34.6037,
  longitude: -58.3816
};

const region: Region = {
  ...location,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01
};

export default function Map(): JSX.Element {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={location} title="Buenos Aires" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
