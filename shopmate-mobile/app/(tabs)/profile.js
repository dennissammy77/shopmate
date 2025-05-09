import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import useFetch from '@/hooks/useFetch.hook.js';
import usePatch from '@/hooks/usePatch.hook.js';
import usePut from '@/hooks/usePut.hook.js';
import usePost from '@/hooks/usePost.hook.js';
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
  const { data: postedData, postData } = usePost(`${API_URL}/api/households`);

  useEffect(()=>{
    setName(data?.user?.name);
    setEmail(data?.user?.email);
    setHousehold(data?.user?.householdId?.name);
  },[data])
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('********');
  const [newhousehold, setNewHousehold] = useState(false);
  const [household, setHousehold] = useState('');
  const { logout } = useAuth();

  // console.log(data)

  const handleUpdate = async() => {
    if (!name) {
      Alert.alert("Error", "Please enter required inputs");
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

  const handleCreateHouse = async()=>{
    if (!household) {
      Alert.alert("Error", "Please enter required inputs");
      return;
    }
    try {
      postData({
        name: household,
      });
      console.log('postedData',postedData)
      refetch();
    } catch (err) {
      console.log(error)
      Alert.alert("Creation failed", error.response?.data?.message || "Try again");
    }
  }

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  
  // if (!data) return <Text style={styles.error}>Could not load profile</Text>;

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
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={true}
              readOnly={true}
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
          <View style={styles.householdHeader}>
            <Text style={styles.label}>Household</Text>
            {!data?.user?.householdId && (
              <TouchableOpacity onPress={()=>setNewHousehold(true)}>
                <Text style={styles.saveButtonText}>add</Text>
              </TouchableOpacity>
            )}
          </View>
          {!data?.user?.householdId && (
            <Text style={styles.label}>Your account is not linked to a household.</Text>
          )}
          {(!data?.user?.householdId && newhousehold) && (
            <View>
              <Text style={styles.label}>Household Name</Text>
              <TextInput
                style={styles.input}
                value={household}
                onChangeText={setHousehold}
                placeholder="House of Grace"
              />
              <TouchableOpacity onPress={()=>handleCreateHouse()}>
                <Text style={styles.saveButtonText}>save</Text>
              </TouchableOpacity>
            </View>
          )}
          {data?.user?.householdId && (
            <View style={styles.fieldContainer}>
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
  householdHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});