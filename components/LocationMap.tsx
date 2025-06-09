import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Button, View, Text, Alert, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationSender = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  interface Coords {
    latitude: number;
    longitude: number;
  }

  interface LocationObject {
    coords: Coords;
    // Add other properties from expo-location LocationObject if needed
  }

  const sendLocationToServer = async (coords: Coords): Promise<void> => {
    try {
      const response = await fetch('http://192.168.1.11:5000/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords),
      });

      const data = await response.json();
      console.log('Location sent:', data);
      Alert.alert('Success', 'Location sent successfully!');
    } catch (error) {
      console.error('Error sending location:', error);
      Alert.alert('Error', 'Failed to send location');
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission denied');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
    sendLocationToServer({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Send My Location" onPress={getLocation} />
      {errorMsg && <Text>{errorMsg}</Text>}
      {location && (
        <>
          <Text>
            Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
          </Text>
          <MapView
            style={styles.map}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            />
          </MapView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginTop: 20,
  },
});

export default LocationSender;
