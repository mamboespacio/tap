// screens/LocationMap.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Alert, Modal, TextInput, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import Map from '@/components/Map';
import { useAddressStore } from '@/data/AddressStore';
import { useUserStore } from '@/data/UserStore';
import { mutateData } from '@/lib/loaders';
import { useRouter } from 'expo-router';
import { Button } from 'react-native';

interface Coordinate {
  latitude: number;
  longitude: number;
}

export default function LocationMap() {
  const [location, setLocation] = useState<Coordinate | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressName, setAddressName] = useState('');

  const addressStore = useAddressStore();
  const userStore = useUserStore();
  const router = useRouter();
  const presentToast = (message: string) => Alert.alert(message);

  // Obtener la ubicación al cargar
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permiso de ubicación denegado');
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude
      };

      setLocation(coords);
      fetchAddress(coords);
      setLoading(false);
    })();
  }, []);

  const fetchAddress = async ({ latitude, longitude }: Coordinate) => {
    try {
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (place) {
        const fullAddress = `${place.name || ''} ${place.street || ''}, ${place.city || place.region || ''}`;
        setAddress(fullAddress.trim());
      }
    } catch (err) {
      console.warn('Error al obtener dirección:', err);
    }
  };

  const handleLocationChange = (coords: Coordinate) => {
    setLocation(coords);
    fetchAddress(coords);
  };

  const saveAddress = async () => {
    if (!location) return;
    try {
      const response = await mutateData('POST', 'addresses', {
        data: {
          name: addressName,
          latitude: location.latitude,
          longitude: location.longitude,
          users_permissions_user: userStore.user.id,
        },
      });
      console.log('Saved address response:', response);
      addressStore.setAddress(response.data);
      setIsModalOpen(false);
      router.push('/');
      presentToast('Dirección guardada correctamente');
    } catch (err) {
      presentToast('Error al guardar: ' + err);
    }
  };

  if (loading || !location) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Map
        coordinate={location}
        onCoordinateChange={handleLocationChange}
      />
      {address && (
        <View style={{ padding: 16 }}>
          <Text>Dirección actual:</Text>
          <Text>{address}</Text>
        </View>
      )}

      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Guardar Dirección</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Casa, Trabajo..."
              value={addressName}
              onChangeText={setAddressName}
            />
            <Button title="Guardar" onPress={saveAddress} />
            <Button title="Cancelar" color="gray" onPress={() => setIsModalOpen(false)} />
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Button
          title="Confirmar Dirección"
          onPress={() => setIsModalOpen(true)}
          color="green"
          disabled={!location}
        />
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
});