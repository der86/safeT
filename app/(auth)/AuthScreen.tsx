import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.17:5000/api/auth'; // Change to your backend URL if needed

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, phone: form.phone };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        await AsyncStorage.setItem('authToken', data.token); // Save token
        setToken(data.token); // Update context/state
        Alert.alert('Success', `Welcome, ${data.user?.name || data.user?.email || 'user'}!`);
        await AsyncStorage.setItem('authToken', data.token);

      } else {
        Alert.alert('Error', data.error || 'Something went wrong');
      }
    } catch (err) {
      Alert.alert('Error', 'Network error');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      {!isLogin && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={text => handleChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={form.phone}
            onChangeText={text => handleChange('phone', text)}
            keyboardType="phone-pad"
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={text => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={text => handleChange('password', text)}
        secureTextEntry
      />
      <Button title={loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'} onPress={handleSubmit} disabled={loading} />
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switch}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  switch: { marginTop: 16, alignItems: 'center' },
  switchText: { color: '#007bff' },
});