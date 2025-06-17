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
import { postData, putData, fetchData, deleteData, patchData } from '@/constants/apiInstance.js';
import { useAuth } from '@/contexts/AuthContext';

export default function CartScreen() {
  const params = useLocalSearchParams();
  const [listId, setlistId] = useState(params.listId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setfilterQuery] = useState('pending');
  const [shoppingList, setShoppingList] = useState({});
  const [filteredItems, setFilteredItems] = useState([]);
  const { token } = useAuth();
  
  let { data: shoppingListFetched, loading: shoppingListLoading, error: shoppingListError, refetch: shoppingListRefetch } = useFetch(`${API_URL}/api/shopping-lists/list/${listId}`);
  const { data: recommendshoppingList, loading: recommendshoppingListLoading, error: recommendshoppingListError, postData: recommendShoppingListPosted} = usePost(`${API_URL}/api/households/recommend/list`);

    useEffect(()=>{
      handleFetchList()
    },[searchQuery,listId,filterQuery]);

    const handleFetchList = async()=>{
        if (!listId) return;
        const result = await fetchData(`${API_URL}/api/shopping-lists/list/${listId}?status=${filterQuery}`,token);
        console.log(result)
        if(result.status){
            setShoppingList(result?.result);
            console.log('items',result?.result?.items)
            if (searchQuery.trim() === '') {
                setFilteredItems(result?.result?.items.filter(item => item?.status.includes(filterQuery)) || []);
            } else {
                const query = searchQuery.toLowerCase();
                const filtered = result?.result?.items.filter(item =>
                    item?.name?.toLowerCase().includes(query)
                );
                setFilteredItems(filtered.filter(item => item?.status.includes(filterQuery)));
            }
        }else{
            console.log(result?.result?.error);
            Alert.alert("Items could not be retrieved", result?.result?.error || "Try again");
        };
    };
    const handleFilterByStatus=()=>{
      if(filterQuery == 'pending'){
        setfilterQuery('purchased')
      }else{
        setfilterQuery('pending')
      }
    };

    const handlePurchaseItem = async(itemId)=>{
        try {
          if (!itemId) {
            Alert.alert("Error", "Item Id missing");
            return;
          }
          const result = await putData(`${API_URL}/api/shopping-lists/list/${listId}/item/purchase`,{ itemId },token)
          if(result?.status){
              await handleFetchList()
          }else{
            console.log(result?.result?.error);
          };
      } catch (err) {
        console.log(err)
      }
    };
    const handleReturnItem = async(itemId)=>{
        try {
          if (!itemId) {
            Alert.alert("Error", "Item Id missing");
            return;
          }
          const result = await putData(`${API_URL}/api/shopping-lists/list/${listId}/item/update`,{ itemId, status: 'pending' },token)
          if(result?.status){
              await handleFetchList()
          }else{
            console.log(result?.result?.error);
          };
      } catch (err) {
        console.log(err)
      }
    };
    const handleUpdateItem = async (itemId,quantity,status)=>{
        console.log(status)
        try {
            const quantityNum = parseInt(quantity);
            if (!itemId) {
                Alert.alert("Error", "Item Id missing");
                return;
            }
            if (status === 'purchased') {
                Alert.alert("Warning", "Item is already purchased");
                return;
            }
            if (quantityNum <= 0) {
                Alert.alert("Error", "Quantity can not be zero");
                return;
            };
            const result = await putData(`${API_URL}/api/shopping-lists/list/${listId}/item/update`,{ itemId, quantity: quantityNum },token)
            if(result?.status){
                await handleFetchList()
            }else{
                console.log(result?.result?.error);
                Alert.alert("Quantity update", "Failed, Try again");
            };
        } catch (err) {
            console.log(err)
            Alert.alert("Quantity update", err || "Try again");
        }
    };


    const handleRecommendList = async()=>{
        const result = await postData(`${API_URL}/api/households/recommend/list`,{},token);
        if(result.status){
            setlistId(result?.result?._id);
            await handleFetchList();
        }else{
            console.log(result?.result?.error);
            Alert.alert("We could not recommend your list", result?.result?.error || result?.result?.message || "Try again");
        };
//        recommendShoppingListPosted().then((res)=>{
//            console.log('res',res)
//            if(res){
//                console.log('recommendshoppingList',res)
//                setShoppingList(res)
//                // attach listId after the data is created
//                setlistId(res?._id)
//                router.push(`/(tabs)/cart?listId=${res?._id}`);
//                return;
//            }else{
//                return Alert.alert("Error", "We could not recommend your list");
//            }
//        });
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
          <TouchableOpacity style={styles.filterButtonIcon} onPress={()=>handleFilterByStatus()}>
            <Text style={styles.removeButtonText}>view {filterQuery == 'pending' ? 'purchased': 'pending'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButtonIcon} onPress={()=>handleClearCart()}>
            <Text style={styles.removeButtonText}>Close</Text>
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
                <TouchableOpacity style={styles.controlButton} onPress={()=>{handleUpdateItem(item?._id, item?.quantity - 1,item.status)}}>
                  <Text style={styles.controlText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.controlButton} onPress={()=>{handleUpdateItem(item?._id, item?.quantity + 1,item.status)}}>
                  <Text style={styles.controlText}>+</Text>
                </TouchableOpacity>
                {item.status === 'purchased'?
                    <TouchableOpacity style={styles.returnButtonIcon} onPress={()=>handleReturnItem(item?._id)}>
                      <Text style={styles.returnButtonText}>Return</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.purchaseButtonIcon} onPress={()=>handlePurchaseItem(item?._id)}>
                      <Text style={styles.purchaseButtonText}>purchase</Text>
                    </TouchableOpacity>
                }
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
  returnButtonIcon: {
    padding: 6,
    backgroundColor: Colors.light.secondary,
    borderRadius: 6,
    marginLeft: 8,
    marginTop: 4,
  },
  purchaseButtonText: {
    color: Colors.light.secondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  returnButtonText: {
    color: Colors.light.primary,
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
  filterButtonIcon: {
    backgroundColor: Colors.light.secondary,
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 2,
    color: Colors.light.primary
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