import { StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { API_URL } from '@/constants/config';
import useFetch from '@/hooks/useFetch.hook';
import usePost from '@/hooks/usePost.hook';
import useDelete from '@/hooks/useDelete.hook';
import usePut from '@/hooks/usePut.hook';

export default function CartScreen() {
  const params = useLocalSearchParams();
  const [listId, setlistId] = useState(params.listId);
  const [searchQuery, setSearchQuery] = useState('');
  const [shoppingList, setShoppingList] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  
  //console.log(listId)
  let { data: shoppingListFetched, loading: shoppingListLoading, error: shoppingListError, refetch: shoppingListRefetch } = useFetch(`${API_URL}/api/shopping-lists/list/${listId}`);
  const { data: putedData, putData } = usePut(`${API_URL}/api/shopping-lists/list/${listId}/item/update`);
  const { data: purchaseData, putData: putPurchaseData } = usePut(`${API_URL}/api/shopping-lists/list/${listId}/item/purchase`);
  const { data: recommendshoppingList, loading: recommendshoppingListLoading, error: recommendshoppingListError, postData: recommendShoppingListPosted} = usePost(`${API_URL}/api/households/recommend/list`);

  useEffect(()=>{
    setShoppingList(shoppingListFetched);
    console.log('items',shoppingListFetched?.items)
    if (searchQuery.trim() === '') {
      setFilteredItems(shoppingListFetched?.items || []);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = shoppingListFetched?.items.filter(item =>
        item?.name?.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
  },[searchQuery,shoppingListFetched,recommendshoppingList,listId]);

  const handlePurchaseItem = (itemId)=>{
    putPurchaseData({
      itemId,
    }).then((res)=>{
      shoppingListRefetch()
    });
  };

  const handleUpdateItem = (itemId,quantity)=>{
    putData({
      itemId,
      quantity,
    }).then((res)=>{
      shoppingListRefetch()
    });
  }
  const handleRecommendList = ()=>{
    recommendShoppingListPosted().then((res)=>{
      console.log('res',res)
      if(res){
        console.log('recommendshoppingList',res)
        setShoppingList(res)
        // attach listId after the data is created
        setlistId(res?._id)
        router.push(`/(tabs)/cart?listId=${res?._id}`);
        return;
      }else{
        return Alert.alert("Error", "We could not recommend your list");
      }
    });
  };
  const handleClearCart = ()=>{
    setlistId('')
  };

  if(!listId) {
    return(
      <SafeAreaView style={styles.centeredPage}>
        <Text style={styles.title}>Select a list to start shopping</Text>
        {/* <Link href='/(tabs)/lists'>Go to your shopping lists</Link> */}
        <TouchableOpacity style={styles.secondaryButtonIcon} onPress={()=>router.push(`/(tabs)/lists`)}>
          <Text style={styles.secondaryButtonText}>Go to your shopping lists</Text>
        </TouchableOpacity>
        <Text style={styles.title}>or</Text>
        <TouchableOpacity style={styles.purchaseButtonIcon} onPress={()=>handleRecommendList()}>
          <Text style={styles.purchaseButtonText}>Recommend me a list</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Cart</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.removeButtonIcon} onPress={()=>handleClearCart()}>
            <Text style={styles.removeButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
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
      </View>
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
                  {item.priceInfo?.currency || 'ILS'} {item.priceInfo?.price * item?.quantity || 0}
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
                <TouchableOpacity style={styles.purchaseButtonIcon} onPress={()=>handlePurchaseItem(item?._id)}>
                  <Text style={styles.purchaseButtonText}>purchase</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.base,
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
  purchaseButtonIcon: {
    padding: 6,
    backgroundColor: Colors.light.primary,
    borderRadius: 6,
    marginLeft: 8,
    marginTop: 4,
  },
  purchaseButtonText: {
    color: Colors.light.secondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  secondaryButtonIcon: {
    padding: 6,
    backgroundColor: Colors.light.secondary,
    borderRadius: 6,
    marginLeft: 8,
    marginTop: 4,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
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
  centeredPage:{
    flex: 1,
    justifyContent: "center",
    textAlign: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light.base,
  },
});