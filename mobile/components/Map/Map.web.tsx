import React from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api';

interface Props {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  onCoordinateChange: (coord: { latitude: number; longitude: number }) => void;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh'
};

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function Map({ coordinate, onCoordinateChange }: Props): JSX.Element {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: coordinate.latitude,
        lng: coordinate.longitude
      }}
      zoom={14}
      onClick={(e) => {
        if (e.latLng) {
          onCoordinateChange({
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
          });
        }
      }}
    >
      <Marker
        position={{
          lat: coordinate.latitude,
          lng: coordinate.longitude
        }}
        draggable
        onDragEnd={(e) => {
          if (e.latLng) {
            onCoordinateChange({
              latitude: e.latLng.lat(),
              longitude: e.latLng.lng()
            });
          }
        }}
      />
    </GoogleMap>
  );
}
