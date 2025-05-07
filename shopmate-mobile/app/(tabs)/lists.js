import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { API_URL } from '@/constants/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Colors from '@/constants/Colors.ts'
import useFetch from '@/hooks/useFetch.hook';
import { Link } from 'expo-router';

const ListsScreen = () => {
  let { data: userData, loading: userDataLoading, error: userDataError, refetch: userDataRefetch  } = useFetch(`${API_URL}/api/users/me`);
  const { data: listsData, loading: listsDataLoading, error: listsDataError, refetch: listsDataRefetch  } = useFetch(`${API_URL}/api/shopping-lists/${userData?.user?.householdId?._id}`);

  // useEffect(()=>{
  console.log(listsData)
  // },[userData])
  return(
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>House Shopping lists</Text>
        <TouchableOpacity style={styles.Button}>
          <Text style={styles.ButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.listContainer}>
          {listsDataLoading && (<Text style={styles.listCardParagraph}>Loading</Text>)}
          {(!listsDataLoading && listsData?.length > 0) ? 
            (listsData?.map((list) => {
              return (
                <Link href={`/(modals)/list?listId=${list?._id}`} asChild key={list?._id}>
                  <Pressable>
                    <View style={styles.listCard}>
                      <View style={styles.row}>
                        <Text style={styles.listCardTitle}>{list?.name}</Text>
                        <Text style={styles.listCardParagraph}>{list?.items?.length } items</Text>
                      </View>
                      <Text style={styles.listCardSubHeading}>{list?.description}</Text>
                      <Text style={styles.listCardParagraph}>Created: {list?.createdAt}</Text>            
                      <Text style={styles.listCardParagraph}>Last updated: {list?.updatedAt}</Text>            
                    </View>
                  </Pressable>
                </Link>
              );
            })) 
            : 
            (<Text style={styles.listCardParagraph}>No lists found</Text>)
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

export default ListsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.base,
  },
  header: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer:{
    display: 'flex',
    flexDirection: 'column',
    padding: 16
  },
  listCard: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 10,
    borderColor: Colors.light.base,
    backgroundColor: Colors.light.white,
    color: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listCardTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  listCardSubHeading: {
    fontSize: 16,
    marginVertical: 4
  },
  listCardParagraph: {
    fontSize: 12,
    marginVertical: 4
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  ButtonText: {
    color: Colors.light.secondary,
    fontSize: 12,
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
  },
});