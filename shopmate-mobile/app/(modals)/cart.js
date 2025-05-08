import { StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { API_URL } from '@/constants/config';
import useFetch from '@/hooks/useFetch.hook';
import usePost from '@/hooks/usePost.hook';
import useDelete from '@/hooks/useDelete.hook';
import usePut from '@/hooks/usePut.hook';

// Sample list to mock schema structure
// const shoppingList = {
//   name: "Weekly Groceries",
//   description: "Items needed for the week",
//   items: [
//     {
//       _id: '1',
//       name: 'Milk',
//       quantity: 2,
//       status: 'pending',
//       lastModifiedBy: { name: 'Alice' },
//       priceInfo: {
//         storeName: 'SuperMart',
//         price: 120,
//         currency: 'USD',
//         lastChecked: new Date().toISOString(),
//       },
//     },
//     {
//       _id: '2',
//       name: 'Bread',
//       quantity: 1,
//       status: 'purchased',
//       lastModifiedBy: { name: 'Bob' },
//       priceInfo: {
//         storeName: 'QuickShop',
//         price: 80,
//         currency: 'USD',
//         lastChecked: new Date().toISOString(),
//       },
//     },
//   ],
// };

export default function ModalScreen() {
  const { listId } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingList, setShoppingList] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  
  //console.log(listId)
  let { data: shoppingListFetched, loading: shoppingListLoading, error: shoppingListError, refetch: shoppingListRefetch } = useFetch(`${API_URL}/api/shopping-lists/list/${listId}`);
  const { data: postedItemToListData, error, postData: postItemToList } = usePost(`${API_URL}/api/shopping-lists/list/${listId}/item/add`);
  const { deleteData: deleteItemFromList } = useDelete();
  const { data: putedData, putData } = usePut(`${API_URL}/api/shopping-lists/list/${listId}/item/update`);
  
  useEffect(()=>{
    if (searchQuery.trim() === '') {
      setFilteredItems(shoppingList?.items || []);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = shoppingList?.items.filter(item =>
        item.name.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  },[searchQuery]);

  useEffect(()=>{
    setShoppingList(shoppingListFetched);
    setFilteredItems(shoppingListFetched?.items || []);
  },[shoppingListFetched,putedData,postedItemToListData]);

  //console.log(shoppingList);
  const [showItemForm, setshowItemForm] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddItem = () => {
    if (!name || !quantity) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Invalid Quantity', 'Quantity must be a positive number.');
      return;
    }

    postItemToList({ name, quantity: quantityNum });
    setName('');
    setQuantity('');
    shoppingListRefetch();
    setshowItemForm(false)
  };

  const handleDeleteItem = (itemId)=>{
    deleteItemFromList(`${API_URL}/api/shopping-lists/list/${listId}/item/${itemId}`)
  };

  const handleUpdateItem = (itemId,quantity)=>{
    putData({
      itemId,
      quantity,
    })
    //console.log('putedData',putedData)
    shoppingListRefetch();
    // setShoppingList(putedData)
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{shoppingList?.name}</Text>
      <Text style={styles.description}>{shoppingList?.description}</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.addButton} onPress={()=>setshowItemForm(!showItemForm)}>
          <Text style={styles.addButtonText}>{!showItemForm ? "Add Item" : "Close"}</Text>
        </TouchableOpacity>
      </View>
      {/* Create a simple form with two inputs, name and quantity and a save button */}
      {showItemForm && (
        <View style={styles.form}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Milk"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.itemsContainer}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {/* <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.itemImage}
            /> */}
            
            <View style={styles.itemInfo}>
              {/* Title and Price */}
              <View style={styles.row}>
                <Text style={styles.itemName}>
                  {item.name}
                </Text>
                <Text style={styles.itemTotal}>
                  {item.priceInfo?.currency || 'USD'} {item.priceInfo?.price * item?.quantity || 0}
                </Text>
              </View>

              {/* Store */}
              <Text style={styles.itemStore}>
                @ {item.priceInfo?.storeName || 'no store'}
              </Text>

              {/* Added by / Modified by */}
              <Text style={styles.itemDetails}>
                Added by: {item.history?.[0]?.userId?.name || 'Unknown'}
              </Text>
              <Text style={styles.itemDetails}>
                Modified by: {item.lastModifiedBy?.name || 'Unknown'}
              </Text>

              {/* Status */}
              <Text style={styles.itemDetails}>
                Status: {item.status}
              </Text>

              {/* Controls: -, quantity, +, remove */}
              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton} onPress={()=>{handleUpdateItem(item?._id, item?.quantity - 1)}}>
                  <Text style={styles.controlText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.controlButton} onPress={()=>{handleUpdateItem(item?._id, item?.quantity + 1)}}>
                  <Text style={styles.controlText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButtonIcon} onPress={()=>handleDeleteItem(item?._id)}>
                  <Text style={styles.removeButtonText}>remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.base,
  },
  row:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    color: '#666',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: Colors.light.base,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.light.white,
    borderColor: Colors.light.secondary,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    color: Colors.light.secondary,
    fontWeight: '600',
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: Colors.light.white,
    color: Colors.light.primary,
    borderRadius: 10,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 6,
  },
  itemInfo: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.secondary,
  },
  itemStore: {
    fontSize: 12,
  },
  itemDetails: {
    fontSize: 12,
    color: '#555',
  },
  removeButton: {
    padding: 6,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    marginLeft: 8,
    marginTop: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.light.white,
  },
  controlButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  controlText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 6,
  },
  removeButtonIcon: {
    backgroundColor: '#ef4444',
    padding: 6,
    borderRadius: 6,
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.light.secondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});