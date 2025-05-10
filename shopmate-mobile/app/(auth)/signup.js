import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import usePost from '@/hooks/usePost.hook.js';
import { API_URL } from '@/constants/config.js'
import { TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';

export default function SignUp() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: response, error, postData } = usePost(`${API_URL}/api/auth/signup`);

  const handleSignUp = async() => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please enter both required fields.");
      return;
    }
    try {
      postData({
        name,
        email,
        password,
      });
      const { token, user } = response;
      login(token, JSON.stringify(user)); // You can pass this data to AuthContext
    } catch (err) {
      console.log(error)
      console.error("SignUp failed:", error.response?.data || error.message);
      Alert.alert("SignUp failed", error.response?.data?.message || "Try again");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ShopMate</Text>
      <Text style={styles.subHeading}>Create an account</Text>
      <TextInput
        placeholder="John Doe"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="johndoe@gmail.com"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* <Button title="Create Account" style={styles.saveButton} onPress={handleSignUp}>

      </Button> */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSignUp}>
        <Text style={styles.saveButtonText}>Create Account</Text>
      </TouchableOpacity>
      <Text style={styles.title}>or</Text>      
      <Text style={styles.small} onPress={()=> router.replace('/login')}>Login</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
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