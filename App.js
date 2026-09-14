import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet, ScrollView, Modal, Alert, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
const { width } = Dimensions.get('window');
const LOGO_URL = "https://i.postimg.cc/SRnbwx8q/file-000000007a98820887b7f176e5d5470c.png";
const SITAPUR_LAT = 27.569; const SITAPUR_LON = 80.683; const RADIUS_KM = 15;
const CATEGORIES = [
  { id: 'Popular', name: 'Popular', icon: '⭐' },
  { id: 'Kurti, Saree & Lehenga', name: 'Kurti, Saree', icon: '👗' },
  { id: 'Women Western', name: 'Women Western', icon: '👚' },
  { id: 'Men', name: 'Men', icon: '👕' },
  { id: 'Kids & Toys', name: 'Kids & Toys', icon: '🧸' },
  { id: 'Home & Kitchen', name: 'Home & Kitchen', icon: '🏠' },
  { id: 'Beauty & Health', name: 'Beauty & Health', icon: '💄' },
  { id: 'Electronics', name: 'Electronics', icon: '🎧' },
];
const PRODUCTS = [
  { id: 1, name: "Red Check Top - Designer Top", price: 339, mrp: 599, category: "Women Western", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800" },
  { id: 2, name: "Men Stylish T-Shirt", price: 299, mrp: 499, category: "Men", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" },
];const BENEFITS = [
  { color: '#FFF7ED', dot: '#FF8C00', text: '0% Commission for 1 Month' },
  { color: '#F0FFF4', dot: '#16A34A', text: 'Roz Paisa Haath Me - Daily Payment' },
  { color: '#EFF6FF', dot: '#1E90FF', text: 'Free Delivery Partner Support' },
];
export default function App() {
  const [tab, setTab] = useState('home');
  const [category, setCategory] = useState('Popular');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(PRODUCTS);
  const [currentShop, setCurrentShop] = useState(null);
  const [showSupplier, setShowSupplier] = useState(false);
  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [custName, setCustName] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [locationStatus, setLocationStatus] = useState('Checking Location...');
  useEffect(() => { const t = setTimeout(() => setShowSplash(false), 2500); return () => clearTimeout(t); }, []);  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status!== 'granted') { setLocationStatus('Location Off'); return; }
        let loc = await Location.getCurrentPositionAsync({});
        const R = 6371;
        const dLat = (loc.coords.latitude - SITAPUR_LAT) * Math.PI / 180;
        const dLon = (loc.coords.longitude - SITAPUR_LON) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(SITAPUR_LAT * Math.PI / 180) * Math.cos(loc.coords.latitude * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const dist = R * c;
        setLocationStatus(dist <= RADIUS_KM? `✅ ${dist.toFixed(1)} KM - 7 Ghante Delivery` : `❌ ${dist.toFixed(1)} KM - Bahar`);
      } catch (e) { setLocationStatus('GPS Off'); }
    })();
  }, []);
  const pickImage = async (setFn) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status!== 'granted') { Alert.alert("Permission Do"); return; }
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled) { setFn(result.assets[0].uri); }
  };
  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id? {...i, qty: i.qty + 1 } : i);
      return [...prev, {...p, qty: 1 }];
    });
  };  const placeOrder = () => {
    if (!custName ||!custMobile ||!custAddress) { Alert.alert("Details Bharo"); return; }
    const newOrder = { id: Date.now(), items: cart, total: cart.reduce((s, i) => s + i.price * i.qty, 0) };
    setOrders([newOrder,...orders]); setCart([]); setShowCheckout(false); setTab('orders');
    const msg = `NEW ORDER #${newOrder.id.toString().slice(-6)}\nName:${custName}\nMobile:${custMobile}\nTotal:${newOrder.total}`;
    Linking.openURL("https://wa.me/919235711539?text=" + encodeURIComponent(msg));
    setCustName(''); setCustMobile(''); setCustAddress('');
  };
  const filtered = products.filter(p => {
    const matchCat = category === 'Popular' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  return (
    <View style={styles.container}>
      {showSplash? (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={{ uri: LOGO_URL }} style={{ width: 260, height: 260 }} resizeMode="contain" />
          <Text style={{ marginTop: 15, fontSize: 32, fontWeight: 'bold', color: '#ff6f00' }}>UpBazaar</Text>
        </View>
      ) : (
        <>
          {tab === 'home' && (
            <View style={{ flex: 1 }}>
              <View style={styles.header}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>UpBazaar</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => setTab('cart')} style={{ marginRight: 15 }}><Ionicons name="cart" size={24} color={cart.length > 0? '#16A34A' : 'black'} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => setTab('account')}><Ionicons name="person" size={24} color="black" /></TouchableOpacity>
                </View>
              </View>              <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
                <View style={{ padding: 12 }}><View style={styles.searchBox}><Ionicons name="location" size={18} color="#16A34A" /><Text style={{ marginLeft: 8, fontSize: 12, fontWeight: 'bold' }}>{locationStatus}</Text></View></View>
                <View style={{ paddingHorizontal: 12 }}><View style={styles.searchBox}><Ionicons name="search" size={18} color="gray" /><TextInput placeholder="Search..." style={{ flex: 1, marginLeft: 8 }} value={search} onChangeText={setSearch} /></View></View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 12, marginTop: 12 }}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity key={cat.id} onPress={() => setCategory(cat.id)} style={[styles.catChip, category === cat.id && styles.catChipActive]}>
                      <Text>{cat.icon}</Text><Text style={styles.catText}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.productGrid}>
                  {filtered.map(item => (
                    <View key={item.id} style={styles.productCard}>
                      <Image source={{ uri: item.img }} style={styles.productImg} />
                      <Text numberOfLines={2} style={styles.pName}>{item.name}</Text>
                      <Text style={styles.pPrice}>₹{item.price}</Text>
                      <TouchableOpacity onPress={() => addToCart(item)} style={{ backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#ff6f00', padding: 6, borderRadius: 6, alignItems: 'center', marginTop: 8 }}>
                        <Text style={{ color: '#ff6f00', fontSize: 11, fontWeight: 'bold' }}>Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
          {tab === 'cart' && (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
              <View style={styles.header}><TouchableOpacity onPress={() => setTab('home')}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', marginLeft: 12 }}>Cart</Text></View>
              <ScrollView style={{ padding: 12 }}>
                {cart.map((it, idx) => <View key={idx} style={styles.cartItem}><Text style={{ flex: 1 }}>{it.name} x {it.qty}</Text><Text>₹{it.price * it.qty}</Text></View>)}
                {cart.length > 0 && <TouchableOpacity onPress={() => setShowCheckout(true)} style={[styles.sendBtn, { backgroundColor: '#16A34A', marginTop: 20 }]}><Text style={styles.sendBtnText}>Place Order</Text></TouchableOpacity>}
              </ScrollView>
            </View>
          )}          {tab === 'account' && (
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ paddingBottom: 100 }}>
              <View style={styles.header}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Account</Text></View>
              {currentShop? (
                <View style={{ margin: 12, padding: 14, backgroundColor: '#F0FFF4', borderRadius: 12, borderWidth: 1, borderColor: '#16A34A' }}>
                  <Text style={{ fontWeight: 'bold' }}>Meri Dukaan - {currentShop.shopName}</Text>
                  <TouchableOpacity onPress={() => { setStep(4); setShowSupplier(true); }} style={{ backgroundColor: '#ff6f00', padding: 14, borderRadius: 10, marginTop: 12, alignItems: 'center' }}><Text style={{ color: 'white', fontWeight: 'bold' }}>+ Product Add Karo</Text></TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => { setStep(1); setShowSupplier(true); }} style={{ margin: 12, padding: 16, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#eee' }}><Text style={{ fontWeight: 'bold' }}>Become a Supplier</Text></TouchableOpacity>
              )}
            </ScrollView>
          )}
          {tab === 'orders' && (
            <View style={{ flex: 1, backgroundColor: 'white' }}><View style={styles.header}><Text style={{ fontWeight: 'bold' }}>My Orders</Text></View><ScrollView style={{ padding: 12 }}>{orders.map(o => <View key={o.id} style={styles.orderCard}><Text>Order #{o.id.toString().slice(-6)} - ₹{o.total}</Text></View>)}</ScrollView></View>
          )}
          <View style={styles.bottomNav}>
            <TouchableOpacity onPress={() => setTab('home')} style={styles.navItem}><Ionicons name={tab === 'home'? "home" : "home-outline"} size={24} color={tab === 'home'? '#ff6f00' : 'gray'} /><Text style={styles.navText}>Home</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('orders')} style={styles.navItem}><Ionicons name={tab === 'orders'? "cube" : "cube-outline"} size={24} color={tab === 'orders'? '#ff6f00' : 'gray'} /><Text style={styles.navText}>Orders</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('account')} style={styles.navItem}><Ionicons name={tab === 'account'? "person" : "person-outline"} size={24} color={tab === 'account'? '#ff6f00' : 'gray'} /><Text style={styles.navText}>Account</Text></TouchableOpacity>
          </View>
        </>
      )}
      {showSupplier && (
        <View style={{ flex: 1, backgroundColor: 'white', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><TouchableOpacity onPress={() => { if (step === 1) setShowSupplier(false); else setStep(step - 1); }}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', marginLeft: 12 }}>Supplier</Text></View>
          {step === 1 && (<ScrollView style={{ padding: 20 }}>{BENEFITS.map((b, i) => <View key={i} style={{ flexDirection: 'row', backgroundColor: b.color, padding: 14, borderRadius: 12, marginBottom: 10 }}><View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: b.dot, marginRight: 10 }} /><Text>{b.text}</Text></View>)}<TouchableOpacity onPress={() => setStep(2)} style={{ backgroundColor: '#16A34A', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Start Selling →</Text></TouchableOpacity></ScrollView>)}
          {step === 2 && (<ScrollView style={{ padding: 20 }}><TextInput placeholder="Dukaan Naam" style={styles.sellerInput} value={shopName} onChangeText={setShopName} /><TextInput placeholder="Maalik Naam" style={styles.sellerInput} value={ownerName} onChangeText={setOwnerName} /><TextInput placeholder="Mobile" style={styles.sellerInput} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" /><TextInput placeholder="Pata" style={styles.sellerInput} value={address} onChangeText={setAddress} /><TouchableOpacity onPress={() => { if (!shopName ||!ownerName ||!mobile ||!address) { Alert.alert("Sab Bharo"); return; } setCurrentShop({ shopName, ownerName }); setStep(3); }} style={{ backgroundColor: '#16A34A', padding: 16, borderRadius: 10, marginTop: 20, alignItems: 'center' }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text></TouchableOpacity></ScrollView>)}
          {step === 3 && (<View style={{ alignItems: 'center', padding: 40 }}><Text style={{ fontSize: 24, fontWeight: 'bold' }}>Mubarak Ho! 🎉</Text><TouchableOpacity onPress={() => setStep(4)} style={{ backgroundColor: '#ff6f00', padding: 16, borderRadius: 10, marginTop: 20, width: '100%', alignItems: 'center' }}><Text style={{ color: 'white', fontWeight: 'bold' }}>+ Product Add Karo</Text></TouchableOpacity></View>)}
          {step === 4 && (<View style={{ flex: 1 }}><ScrollView style={{ padding: 20 }}><TextInput placeholder="Product Naam" style={styles.sellerInput} value={prodName} onChangeText={setProdName} /><TextInput placeholder="Price" style={styles.sellerInput} value={prodPrice} onChangeText={setProdPrice} keyboardType="number-pad" /><TouchableOpacity onPress={() => pickImage(setProdImg)} style={{ width: 100, height: 100, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginTop: 15, alignItems: 'center', justifyContent: 'center' }}>{prodImg? <Image source={{ uri: prodImg }} style={{ width: '100%', height: '100%', borderRadius: 8 }} /> : <Text>+ Photo</Text>}</TouchableOpacity></ScrollView><TouchableOpacity onPress={() => { if (!prodName ||!prodPrice ||!prodImg) { Alert.alert("Naam, Price, Photo"); return; } const np = { id: Date.now(), name: prodName, price: parseInt(prodPrice), category: 'Popular', img: prodImg }; setProducts([np,...products]); setShowSupplier(false); setTab('home'); }} style={{ backgroundColor: '#16A34A', padding: 18, margin: 15, borderRadius: 12, alignItems: 'center' }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Add Karo</Text></TouchableOpacity></View>)}
        </View>
      )}
      <Modal visible={showCheckout} transparent animationType="slide"><View style={{ flex: 1, backgroundColor: 'white' }}><View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15 }}><TouchableOpacity onPress={() => setShowCheckout(false)}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', marginLeft: 12 }}>Delivery</Text></View><ScrollView style={{ padding: 20 }}><TextInput placeholder="Naam" style={styles.sellerInput} value={custName} onChangeText={setCustName} /><TextInput placeholder="Mobile" style={styles.sellerInput} value={custMobile} onChangeText={setCustMobile} keyboardType="phone-pad" /><TextInput placeholder="Address" style={[styles.sellerInput, { height: 80 }]} multiline value={custAddress} onChangeText={setCustAddress} /><TouchableOpacity onPress={placeOrder} style={[styles.sendBtn, { backgroundColor: '#16A34A', marginTop: 20 }]}><Text style={styles.sendBtnText}>Confirm Order</Text></TouchableOpacity></ScrollView></View></Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 45, paddingBottom: 12, paddingHorizontal: 12, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  catChip: { alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 10, marginRight: 10, width: 80, borderWidth: 1, borderColor: '#eee' },
  catChipActive: { borderColor: '#ff6f00', backgroundColor: '#FFF7ED' },
  catText: { fontSize: 10, textAlign: 'center', marginTop: 4 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 6, justifyContent: 'space-between' },
  productCard: { width: (width / 2) - 12, backgroundColor: 'white', borderRadius: 12, padding: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  productImg: { width: '100%', height: 160, borderRadius: 8, backgroundColor: '#f5f5f5' },
  pName: { fontSize: 12, fontWeight: '500', marginTop: 6 },
  pPrice: { fontWeight: 'bold', fontSize: 14 },
  orderCard: { backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  cartItem: { flexDirection: 'row', backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee', paddingVertical: 8, paddingBottom: 20 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 10, color: 'gray' },
  sellerInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 12, backgroundColor: 'white' },
  sendBtn: { padding: 14, borderRadius: 10, alignItems: 'center' },
  sendBtnText: { color: 'white', fontWeight: 'bold' },
});
