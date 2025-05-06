import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import useFetch from '@/hooks/useFetch.hook.js';
import usePatch from '@/hooks/usePatch.hook.js';
import usePut from '@/hooks/usePut.hook.js';
import { API_URL } from '@/constants/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Colors from '@/constants/Colors.ts'
import { useAuth } from '@/contexts/AuthContext';

const ProfileScreen = () => {
  // const [user, setUser] = useState(null);
  let { data, loading, error, refetch  } = useFetch(`${API_URL}/api/users/me`);
  const { data: patchedData, patchData } = usePatch(`${API_URL}/api/users/me`);
  const { data: putedData, putData } = usePut(`${API_URL}/api/users/me`);

  useEffect(()=>{
    setName(data?.user?.name);
    setEmail(data?.user?.email);
  },[data])
  
  const [name, setName] = useState(data?.user?.name);
  const [email, setEmail] = useState(data?.user?.email);
  const [password, setPassword] = useState('********');
  const [household, setHousehold] = useState('shopmate');
  const { logout } = useAuth();


  const handleUpdate = async() => {
    if (!name) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      putData({
        name,
      });
      console.log('putedData',putedData)
      refetch();
    } catch (err) {
      console.log(error)
      Alert.alert("Update failed", error.response?.data?.message || "Try again");
    }
  };

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  
  if (!data) return <Text style={styles.error}>Could not load profile</Text>;

  return(
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>E-mail address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={true}
            />
          </View>
          <Text style={styles.label}>Household</Text>
          {data?.user?.household && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>household</Text>
              <TextInput
                style={styles.input}
                value={household}
                onChangeText={setHousehold}
                placeholder="Enter household"
              />
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={()=>handleUpdate()}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.heading}>My Profile</Text>
  //     <Text style={styles.label}>Name: <Text style={styles.value}>{user?.name}</Text></Text>
  //     <Text style={styles.label}>Email: <Text style={styles.value}>{user?.email}</Text></Text>
  //     <Text style={styles.label}>Joined: <Text style={styles.value}>{new Date(user?.createdAt).toDateString()}</Text></Text>
  //     {user?.household && (
  //       <Text style={styles.label}>Household: <Text style={styles.value}>{user?.household?.name || user?.household}</Text></Text>
  //     )}
  //   </View>
  // );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.base,
    justifyContent: "center",
  },
  scrollContainer: {
    paddingBottom: 20,
    flex: 1
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
    justifyContent: "center",
    flex: 1

  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.light.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: Colors.light.secondary,
    borderColor: '#007AFF',
    borderStyle: 'solid',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});