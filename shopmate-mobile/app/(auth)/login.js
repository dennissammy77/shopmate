import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import usePost from '@/hooks/usePost.hook.js';
import { API_URL } from '@/constants/config.js'
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: response, error, postData } = usePost(`${API_URL}/api/auth/login`);

  const handleLogin = async() => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!re.test(email)) return Alert.alert("Login failed", "Please enter a valid email.");
    try {
      postData({
        email,
        password,
      });
      const { token, user } = response;
      console.log('token',token)
      console.log('user',user)
      login(token, JSON.stringify(user)); // You can pass this data to AuthContext
    } catch (err) {
      console.log(err)
      // console.error("Login failed:", error?.response?.data || error?.message);
      Alert.alert("Login failed", error?.response?.data?.message || "Try again");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to ShopMate</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Password"
        value={password}rd
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* <Button title="Login" onPress={handleLogin} /> */}
      <TouchableOpacity style={styles.saveButton} onPress={handleLogin}>
        <Text style={styles.saveButtonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.title}>or</Text>
      <Text style={styles.small} onPress={()=> router.replace('/signup')}>create an account</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.light.base,
  },
  title: {
    fontSize: 24,
    marginVertical: 8,
    textAlign: "center",
    fontWeight: "regular",
  },
  small: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "regular",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.white,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.light.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  small: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "regular",
  },
});