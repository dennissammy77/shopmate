import { StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Button,ScrollView, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { API_URL } from '@/constants/config';
import ModalPopup from '@/components/ModalPopup';
import { postData, putData, fetchData, deleteData, patchData } from '@/constants/apiInstance.js';
import { useAuth } from '@/contexts/AuthContext';

const mockStoreOptions = [
  {
    name: 'Kessler, Wuckert and Wunsch',
    location: 'israel',
    distanceto: 1,
    basketTotal: 4500,
    image: "https://m.media-amazon.com/images/I/91zN7bvgG+L._AC_UL960_FMwebp_QL65_.jpg"
  },
  {
    name: 'B0DRTFWL4L',
    location: 'israel',
    distanceto: 1.5,
    basketTotal: 5000,
    image: "https://m.media-amazon.com/images/I/71L4GipPANL._AC_UL960_FMwebp_QL65_.jpg"
  },
  {
    name: 'Kessler, Wuckert and Wunsch',
    location: 'israel',
    distanceto: 1.6,
    basketTotal: 8000,
    image: 'https://m.media-amazon.com/images/I/815Aquze3SL._AC_UL960_FMwebp_QL65_.jpg'
  },
  {
    name: 'Kessler, Wuckert and Wunsch',
    location: 'israel',
    distanceto: 2.0,
    basketTotal: 9000,
    image: 'https://m.media-amazon.com/images/I/815Aquze3SL._AC_UL960_FMwebp_QL65_.jpg'
  },
  {
    name: 'Kessler, Wuckert and Wunsch',
    location: 'israel',
    distanceto: 3.0,
    basketTotal: 4000,
    image: 'https://m.media-amazon.com/images/I/815Aquze3SL._AC_UL960_FMwebp_QL65_.jpg'
  },
]

export default function ModalScreen() {
    const { listId } = useLocalSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [shoppingList, setShoppingList] = useState({});
    const [filteredItems, setFilteredItems] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visibleItem, setVisibleItem] = useState(null);
    const [mockPriceOptions, setmockPriceOptions] = useState([]);
    const [mockStore, setmockStore] = useState({
        name: 'Kessler, Wuckert and Wunsch',
        location: 'israel',
        distanceto: 1,
        basketTotal: 4500,
        image: 'https://m.media-amazon.com/images/I/815Aquze3SL._AC_UL960_FMwebp_QL65_.jpg'
      });
    const { token } = useAuth();

    const [storevisibleModal, setstoreVisibleModal] = useState(false);

    const openPopup = (item) => {
        setVisible(true);
        setVisibleItem(item)
        priceFetcherApi(item?.name)
    }

    const closePopup = () => {
        setVisible(false);
        setVisibleItem(null)
        setmockPriceOptions([])
    }

    const openStorePopup = () => {
      setstoreVisibleModal(true);
    }

    const closeStorePopup = () => {
      setstoreVisibleModal(false);
    }

    useEffect(()=>{
        handleFetchList()
    },[searchQuery]);

    const [showItemForm, setshowItemForm] = useState(false);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleFetchList = async()=>{
        const result = await fetchData(`${API_URL}/api/shopping-lists/list/${listId}`,token);
        console.log(result)
        if(result.status){
            setShoppingList(result?.result);
            console.log('items',result?.result?.items)
            if (searchQuery.trim() === '') {
                setFilteredItems(result?.result?.items || []);
            } else {
                const query = searchQuery.toLowerCase();
                const filtered = result?.result?.items.filter(item =>
                    item?.name?.toLowerCase().includes(query)
                );
                setFilteredItems(filtered);
            }
        }else{
            console.log(result?.result?.error);
            Alert.alert("Items could not be retrieved", result?.result?.error || "Try again");
        };
    };

    const handleDeleteList = async()=>{
        if (!listId) {
            Alert.alert('Error Deleting List', '');
            return;
        };
        const result = await deleteData(`${API_URL}/api/shopping-lists/list/${listId}`,token);
        if(result.status){
            Alert.alert("List deleted",);
            router.replace(`/(tabs)/lists`)
        }else{
            console.log(result?.result?.error);
            Alert.alert("List could not be deleted", result?.result?.error || "Try again");
        };
    };

    const handleAddItem = async() => {
        if (!name || !quantity) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        const quantityNum = parseInt(quantity);
        if (isNaN(quantityNum) || quantityNum <= 0) {
            Alert.alert('Invalid Quantity', 'Quantity must be a positive number.');
            return;
        };
        const result = await postData(`${API_URL}/api/shopping-lists/list/${listId}/item/add`,{ name, quantity: quantityNum },token);
        if(result.status){
            setName('');
            setQuantity('');
            setshowItemForm(false);
            await handleFetchList();
        }else{
            console.log(result?.result?.error);
            Alert.alert("Item could not be added", result?.result?.error || "Try again");
        };
    };

    const handleDeleteItem = async(itemId)=>{
        if (!itemId) {
            Alert.alert('Error Deleting Item', '');
            return;
        };
        const result = await deleteData(`${API_URL}/api/shopping-lists/list/${listId}/item/${itemId}`,token);
        if(result.status){
            await handleFetchList();
        }else{
            console.log(result?.result?.error);
            Alert.alert("Item could not be deleted", result?.result?.error || "Try again");
        };
    };

    const handleUpdateItem = async (itemId,quantity)=>{
        try {
            const quantityNum = parseInt(quantity);
            if (!itemId) {
              Alert.alert("Error", "Item Id missing");
              return;
            }
            if (quantityNum <= 0) {
              Alert.alert("Error", "Quantity can not be zero");
              return;
            }
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

    const priceFetcherApi=async(itemName)=>{
        const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${itemName}&page=1&country=US&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '8bb0b33c9fmsh5db3bc8c9645717p107dfdjsna5195e6d6c9e',
                'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            let result = await response.text();
            result = JSON.parse(result);
            // console.log('products',result?.data?.products);
            result = result?.data?.products?.map((product)=>{
                let price = product?.product_price?.split('')
                price?.splice(0, 1);
                console.log(price)
                price = price?.join('');
                console.log(price)
                return({
                    name: product?.product_title || itemName,
                    price: price || 0,
                    currency: "ILS",
                    storeName: product?.asin || "Trader Joe's",
                    image: product?.product_photo || "https://via.placeholder.com/50?text=TraderJoes",
                })
            });
            console.log(result);
            setmockPriceOptions(result);
        } catch (error) {
            console.log(error);
        }
    }
  
    const handleUpdateItemPrice = async(itemId,storeName,price,currency='ILS')=>{
        if(!itemId) return console.log('No Item Id found',itemId,storeName,price)
        console.log('Item Id found',itemId,storeName,price);
        try {
            if (!itemId) {
              Alert.alert("Error", "Item Id missing");
              return;
            };
            const result = await patchData(`${API_URL}/api/shopping-lists/list/${listId}/item/${itemId}/price`,{ itemId, storeName, price, currency },token)
            if(result?.status){
                await handleFetchList()
                closePopup()
            }else{
              console.log(result?.result?.error);
              Alert.alert("Quantity update", "Failed, Try again");
            };
        } catch (err) {
          console.log(err)
          Alert.alert("Quantity update", err || "Try again");
        }
    };

    const handleUpdateBasketStore = (store)=>{
      setmockStore(store)
      closeStorePopup()
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{shoppingList?.name}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.removeButtonIcon} onPress={()=>handleDeleteList()}>
            <Text style={styles.removeButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.StartShoppingButton} onPress={()=> router.replace(`/(tabs)/cart?listId=${listId}`)}>
            <Text style={styles.StartShoppingButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.description}>{shoppingList?.description}</Text>
      <View style={styles.storeContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>@ {mockStore?.name}</Text>
          <Text style={styles.basketTotalPrice}> ILS {mockStore?.basketTotal} </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.description}>Location</Text>
          <Text style={styles.description}>{mockStore?.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.description}>Distance to store</Text>
          <Text style={styles.description}>{mockStore?.distanceto} mil</Text>
        </View>
        <Text style={styles.actionText} onPress={()=>openStorePopup()}>Compare stores</Text>
      </View>

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
                  {item.priceInfo?.currency || 'ILS'} {item.priceInfo?.price * item?.quantity || 0}
                </Text>
              </View>

              {/* Store */}
              <Text style={styles.itemStore}>
                @ {item.priceInfo?.storeName || 'no store'}
              </Text>
              <Text style={styles.itemStore}>
                price ILS {item.priceInfo?.price || 'no store'} / item
              </Text>

              {/* Added by / Modified by */}
              <Text style={styles.itemDetails}>
                Added by: {item.history?.[0]?.userId?.name || 'Unknown'}
              </Text>

              <Text style={styles.itemDetails}>
                Last Modified by: {item.lastModifiedBy?.name || 'Unknown'}
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
                {/* <TouchableOpacity style={styles.compareButton} onPress={()=>openPopup(item)}>
                  <Text style={styles.compareButtonText}>compare prices</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        )}
      />
      <ModalPopup
        isVisible={visible}
        transparent={true}
        dismiss={closePopup}
        title={`Compare ${visibleItem?.name} Prices`}
      >
        <ScrollView contentContainerStyle={styles.priceList}>
          {mockPriceOptions?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.priceCard}
              onPress={() => handleUpdateItemPrice(visibleItem?._id,option.storeName,parseInt(option.price))} // This would apply the selected price to the item
            >
              <Image
                source={{ uri: option.image || 'https://via.placeholder.com/50' }}
                style={styles.itemImage}
              />
              <View style={styles.priceInfo}>
                <Text style={styles.itemName}>{visibleItem?.name}</Text>
                <Text style={styles.itemPrice}>
                  {option.currency} {option.price}
                </Text>
                <Text style={styles.storeName}>@ {option.storeName}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalPopup>
      <ModalPopup
        isVisible={storevisibleModal}
        transparent={true}
        dismiss={closeStorePopup}
        title={`Compare stores`}
      >
        <ScrollView contentContainerStyle={styles.priceList}>
          {mockStoreOptions?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.priceCard}
              onPress={() => handleUpdateBasketStore(option)}
            >
              <Image
                source={{ uri: option.image || 'https://via.placeholder.com/50' }}
                style={styles.itemImage}
              />
              <View style={styles.priceInfo}>
                <Text style={styles.itemName}>{option?.name}</Text>
                <Text style={styles.itemPrice}>
                  ILS {option.basketTotal}
                </Text>
                <Text style={styles.storeName}>@ {option.location} - {option.distanceto} miles</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ModalPopup>
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
  actionText: {
    color: Colors.light.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  compareButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  compareButtonText: {
    color: Colors.light.secondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceList:{
    padding: 20,
    height: '250',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  priceList: {
    padding: 10,
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: Colors.light.secondary,
    color: Colors.light.primary,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  priceInfo: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  storeName: {
    fontSize: 12,
    color: '#777',
  },
  StartShoppingButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 8,
    padding: 6,
    marginLeft: 10,
  },
  StartShoppingButtonText: {
    color: Colors.light.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  storeContainer:{
    marginVertical: 10,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    borderColor: Colors.light.secondary
  },
  basketTotalPrice: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: '500'
  },
});
