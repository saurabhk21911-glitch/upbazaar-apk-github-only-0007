import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet, ScrollView, FlatList, Modal, Alert, Image, Dimensions, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
const { width, height } = Dimensions.get('window');
const ADMIN_PASS = "DishuRajvanshi7740";
const LOGO_URL = "https://i.postimg.cc/SRnbwx8q/file-000000007a98820887b7f176e5d5470c.png";
const TRACK_STEPS = ['Ordered','Packed','Shipped','Out for Delivery','Delivered'];
const SITAPUR_LAT = 27.569; const SITAPUR_LON = 80.683; const RADIUS_KM = 15;
const CATEGORIES_DATA = [
  { id: 'Popular', name: 'Popular', icon: '⭐' },
  { id: 'Kurti, Saree & Lehenga', name: 'Kurti, Saree & Lehenga', icon: '👗' },
  { id: 'Women Western', name: 'Women Western', icon: '👚' },
  { id: 'Lingerie', name: 'Lingerie', icon: '👙' },
  { id: 'Men', name: 'Men', icon: '👕' },
  { id: 'Kids & Toys', name: 'Kids & Toys', icon: '🧸' },
  { id: 'Home & Kitchen', name: 'Home & Kitchen', icon: '🏠' },
  { id: 'Beauty & Health', name: 'Beauty & Health', icon: '💄' },
  { id: 'Jewellery & Accessories', name: 'Jewellery & Accessories', icon: '💍' },
  { id: 'Bags & Footwear', name: 'Bags & Footwear', icon: '👜' },
  { id: 'Electronics', name: 'Electronics', icon: '🎧' },
  { id: 'Watches', name: 'Watches', icon: '⌚' },
  { id: 'Sports & Fitness', name: 'Sports & Fitness', icon: '🏋️' },
  { id: 'Car & Motorbike', name: 'Car & Motorbike', icon: '🏍️' },
  { id: 'Office Supplies & Stationery', name: 'Office Supplies & Stationery', icon: '🎨' },
  { id: 'Grocery', name: 'Grocery', icon: '🛒' },
];
const SIZE_OPTIONS = {
  'Free Size': ['Free Size'],
  'Clothing S/M/L/XL/XXL': ['S','M','L','XL','XXL'],
  'Footwear 1-9': ['1','2','3','4','5','6','7','8','9'],
  'Kids 1-16 Years': ['1 Year','2 Years','3 Years','4 Years','5 Years','6 Years','7 Years','8 Years','9 Years','10 Years','11 Years','12 Years','13 Years','14 Years','15 Years','16 Years'],
};
const DEFAULT_BANNERS = [
  { id: 1, title: "Free Delivery", subtitle: "On Orders Above ₹199", color: "#ff6f00", emoji: "🚚" },
  { id: 2, title: "Mega Fashion Sale", subtitle: "50% OFF on Kurtis", color: "#e91e63", emoji: "🔥" },
  { id: 3, title: "UpBazaar Special", subtitle: "Lowest Price Guarantee", color: "#9c27b0", emoji: "💰" },
];
const DEMO_REVIEWS = [
  { id:1, name:"Priya S.", rating:5, text:"Quality bahut achi hai, Sitapur me 5 ghante me aa gaya!", date:"2 din pehle" },
  { id:2, name:"Anjali M.", rating:4, text:"Watch bilkul photo jaisi hai, free return bhi hai", date:"1 hafta pehle" },
];
const DEMO_PRODUCTS = [
  { id: 1, name: "Red Check Top - Designer Top", price: 339, mrp: 599, category: "Women Western", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800", images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"], sizes: ['S','M','L','XL','XXL'], sizeType: 'Clothing S/M/L/XL/XXL', rating: "4.3", reviews: "1,234", delivery: "Free Delivery", returnDays: 7, reviewList: DEMO_REVIEWS },
];
const SUPPLIER_BENEFITS = [
  { color: '#FFF7ED', dot:'#FF8C00', text:'0% Commission for 1 Month' },
  { color: '#F0FFF4', dot:'#16A34A', text:'Roz Paisa Haath Me - Daily Payment' },
  { color: '#EFF6FF', dot:'#1E90FF', text:'Free Delivery Partner Support' },
  { color: '#FEF9C3', dot:'#EAB308', text:'24x7 Seller Support' },
  { color: '#F5F3FF', dot:'#7C3AED', text:'App Me Top Pe Dikhoge' },
  { color: '#FFE4E6', dot:'#DC2626', text:'Low Return - Trust Wale Grahak' },
];export default function App() {
  const [tab, setTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [shops, setShops] = useState([]);
  const [currentShop, setCurrentShop] = useState(null);
  const [showSupplierFlow, setShowSupplierFlow] = useState(false);
  const [supplierStep, setSupplierStep] = useState(1);
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [shopMobile, setShopMobile] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopCategoryCustom, setShopCategoryCustom] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [showBannerEdit, setShowBannerEdit] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [trackOrder, setTrackOrder] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdMrp, setNewProdMrp] = useState('');
  const [newProdCat, setNewProdCat] = useState('');
  const [newProdImg1, setNewProdImg1] = useState('');
  const [newProdImg2, setNewProdImg2] = useState('');
  const [newProdImg3, setNewProdImg3] = useState('');
  const [newProdImg4, setNewProdImg4] = useState('');
  const [newProdImg5, setNewProdImg5] = useState('');
  const [newProdImg6, setNewProdImg6] = useState('');
  const [newProdImg7, setNewProdImg7] = useState('');
  const [newProdSizeType, setNewProdSizeType] = useState('Free Size');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [adminTab, setAdminTab] = useState('banner');
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSub, setNewBannerSub] = useState('');
  const [newBannerColor, setNewBannerColor] = useState('#ff6f00');
  const [newBannerEmoji, setNewBannerEmoji] = useState('🚚');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [isInRadius, setIsInRadius] = useState(true);
  const [locationStatus, setLocationStatus] = useState('Checking Location...');
  const bannerRef = useRef(null);  useEffect(() => { const t = setTimeout(() => setShowSplash(false), 3000); return () => clearTimeout(t); }, []);
  useEffect(() => {
    (async () => {
      try {
        const savedBanners = await AsyncStorage.getItem('banners'); if (savedBanners) { const b = JSON.parse(savedBanners); if(b && b.length>0) setBanners(b); }
        const savedOrders = await AsyncStorage.getItem('orders'); if (savedOrders) { const o = JSON.parse(savedOrders); if(o && o.length>0) setOrders(o); }
        const savedShops = await AsyncStorage.getItem('shops'); if (savedShops) { const s = JSON.parse(savedShops); if(s) setShops(s); }
        const savedProducts = await AsyncStorage.getItem('products'); if (savedProducts) { const p = JSON.parse(savedProducts); if(p && p.length>0) setProducts(p); }
        const savedCurrentShop = await AsyncStorage.getItem('currentShop'); if (savedCurrentShop) setCurrentShop(JSON.parse(savedCurrentShop));
      } catch(e) { console.log("Safe", e); }
    })();
  }, []);
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => { const R = 6371; const dLat = (lat2-lat1) * Math.PI / 180; const dLon = (lon2-lon1) * Math.PI / 180; const a = Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2); const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); return R*c; };
  useEffect(() => { (async () => { try { let { status } = await Location.requestForegroundPermissionsAsync(); if (status!== 'granted') { setLocationStatus('Location Off - Pincode se check'); setIsInRadius(true); return; } let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }); setUserLocation(loc.coords); const dist = getDistanceFromLatLonInKm(loc.coords.latitude, loc.coords.longitude, SITAPUR_LAT, SITAPUR_LON); setDistanceKm(dist.toFixed(1)); if (dist <= RADIUS_KM) { setIsInRadius(true); setLocationStatus(`✅ ${dist.toFixed(1)} KM - 7 Ghante Delivery`); } else { setIsInRadius(false); setLocationStatus(`❌ ${dist.toFixed(1)} KM - 15KM Se Bahar`); } } catch(e) { setLocationStatus('GPS Off - Pincode se check'); setIsInRadius(true); } })(); }, []);
  const saveBanners = async (nb) => { setBanners(nb); await AsyncStorage.setItem('banners', JSON.stringify(nb)); };
  const saveShops = async (ns) => { setShops(ns); await AsyncStorage.setItem('shops', JSON.stringify(ns)); };
  const saveProducts = async (np) => { setProducts(np); await AsyncStorage.setItem('products', JSON.stringify(np)); };
  const saveOrders = async (no) => { setOrders(no); await AsyncStorage.setItem('orders', JSON.stringify(no)); };
  const saveCurrentShop = async (shop) => { setCurrentShop(shop); await AsyncStorage.setItem('currentShop', JSON.stringify(shop)); };
  const getDiscount = (price, mrp) => { if(!mrp || mrp<=price) return 0; return Math.round(((mrp-price)/mrp)*100); };
  const getInvoiceText = (order) => { if(!order) return ""; const itemsText = order.items.map((it,i)=> (i+1)+". "+it.name+" | Size: "+it.selectedSize+" x "+it.qty+" = Rs "+(it.price*it.qty)).join("\n"); return "UpBazaar INVOICE\nOrder: #"+order.id.toString().slice(-6)+"\nDist: "+(distanceKm||"15KM")+"\n"+itemsText+"\nTotal Rs "+order.total; };
  const pickImage = async (setFn) => { try { const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (status!== 'granted') { Alert.alert("Permission","Allow karo"); return; } let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4,3], quality: 0.7, }); if (!result.canceled && result.assets && result.assets[0]?.uri) { setFn(result.assets[0].uri); } } catch(e) { Alert.alert("Expo Go me kholo","Web me gallery nahi khulti"); } };
  const addToCart = (p, size) => { const finalSize = size || (p.sizes && p.sizes[0]) || 'Free Size'; setCart(prev => { const ex = prev.find(i => i.id === p.id && i.selectedSize === finalSize); if (ex) return prev.map(i => i.id === p.id && i.selectedSize === finalSize? {...i, qty: i.qty + 1 } : i); return [...prev, {...p, qty: 1, selectedSize: finalSize }]; }); };
  const placeOrder = async () => { if (cart.length === 0) return; if (!customerName ||!customerMobile ||!customerAddress) return Alert.alert("Details bharo"); const newOrder = { id: Date.now(), items: cart, date: new Date().toLocaleDateString(), status: 'Ordered', total: cart.reduce((s, i) => s + i.price * i.qty, 0), customer: { name: customerName, mobile: customerMobile, address: customerAddress, pincode: customerPincode }, orderTime: new Date().toLocaleTimeString(), distance: distanceKm }; await saveOrders([newOrder,...orders]); setCart([]); setShowCheckout(false); setTab('orders'); const itemsDetail = cart.map(it => it.name + " | Size:" + it.selectedSize + " x" + it.qty).join(", "); const fullMsg = "NEW ORDER\nOrder #"+newOrder.id.toString().slice(-6)+"\nName: "+customerName+"\nMobile: "+customerMobile+"\nItems: "+itemsDetail+"\nTotal Rs "+newOrder.total; setCustomerName(''); setCustomerMobile(''); setCustomerAddress(''); setCustomerPincode(''); Linking.openURL("https://wa.me/919235711539?text="+encodeURIComponent(fullMsg)); };
  const filteredProducts = products.filter(p => { const matchCat = selectedCategory === 'Popular' || p.category === selectedCategory; const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()); return matchCat && matchSearch; });  return (
    <View style={styles.container}>
      {tab === 'home' &&!showSplash && (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ backgroundColor: '#ff6f00', width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Up</Text></View><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>UpBazaar</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}><TouchableOpacity onPress={() => setTab('wishlist')} style={{ marginRight: 12 }}><Ionicons name="heart" size={24} color={wishlist.length>0?'red':'black'} /></TouchableOpacity><TouchableOpacity onPress={() => setTab('cart')} style={{ marginRight: 12 }}><Ionicons name="cart" size={24} color={cart.length>0?'#16A34A':'black'} /></TouchableOpacity><TouchableOpacity onPress={() => setShowAdminLogin(true)} style={{ backgroundColor: '#111', padding: 6, borderRadius: 20 }}><Ionicons name="shield-checkmark" size={20} color="white" /></TouchableOpacity></View>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{paddingBottom: 90}}>
            <View style={{ padding: 12 }}><View style={styles.searchBox}><Ionicons name="location" size={20} color="#16A34A" /><Text style={{ flex: 1, marginLeft: 8, fontSize:12, fontWeight:'bold' }}>{locationStatus}</Text></View></View>
            <View style={{ paddingHorizontal: 12 }}><View style={styles.searchBox}><Ionicons name="search" size={20} color="gray" /><TextInput placeholder="Search..." style={{ flex: 1, marginLeft: 8 }} value={search} onChangeText={setSearch} /></View></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 12, marginTop:12 }}>
              {CATEGORIES_DATA.map(cat => (<TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.id)} style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}><Text style={{ fontSize: 20 }}>{cat.icon}</Text><Text style={[styles.catText, selectedCategory === cat.id && { color: '#ff6f00' }]} numberOfLines={2}>{cat.name}</Text></TouchableOpacity>))}
            </ScrollView>
            <View style={styles.productGrid}>
              {filteredProducts.map(item => {
                const disc = getDiscount(item.price, item.mrp); const mainImg = item.images && item.images.length>0? item.images[0] : item.img;
                return (
                <View key={item.id} style={styles.productCard}>
                  <TouchableOpacity onPress={() => { setSelectedProduct(item); setSelectedImgIndex(0); setSelectedSize(item.sizes? item.sizes[0] : 'Free Size'); }}>
                    <Image source={{ uri: mainImg }} style={styles.productImg} />
                    <Text numberOfLines={2} style={styles.pName}>{item.name}</Text>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop:4}}><Text style={styles.pPrice}>₹{item.price}</Text><Text style={styles.pMrp}>₹{item.mrp}</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> addToCart(item)} style={{flex:1, backgroundColor:'#FFF7ED', borderWidth:1, borderColor:'#ff6f00', paddingVertical:6, borderRadius:6, alignItems:'center', marginTop:8}}><Text style={{color:'#ff6f00', fontSize:11, fontWeight:'bold'}}>Add to Cart</Text></TouchableOpacity>
                </View>
              )})}
            </View>
          </ScrollView>
        </View>
      )}      {tab === 'orders' &&!showSplash && (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.header}><Text style={{ fontWeight: 'bold', fontSize: 18 }}>My Orders</Text></View>
          <ScrollView style={{ padding: 12 }}>{orders.map(order => (<View key={order.id} style={styles.orderCard}><Text style={{ fontWeight: 'bold' }}>Order #{order.id.toString().slice(-6)}</Text><Text>₹{order.total} - {order.status}</Text></View>))}</ScrollView>
        </View>
      )}
      {tab === 'account' &&!showSplash && (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{paddingBottom: 100}}>
          <View style={[styles.header, {borderBottomWidth:0}]}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Account</Text></View>
          {currentShop? (
            <View style={{marginTop:20, marginHorizontal:12, padding:14, backgroundColor:'#F0FFF4', borderRadius:16, borderWidth:1.5, borderColor:'#16A34A'}}>
              <Text style={{fontWeight:'bold'}}>Meri Dukaan - {currentShop.shopName}</Text>
              <TouchableOpacity onPress={()=> { setSupplierStep(4); setShowSupplierFlow(true); }} style={{backgroundColor:'#ff6f00', padding:14, borderRadius:10, marginTop:12, alignItems:'center'}}><Text style={{color:'white', fontWeight:'bold'}}>+ Product Add Karo</Text></TouchableOpacity>
            </View>
          ) : (
            <View style={{marginTop:20, marginHorizontal:12}}>
              <TouchableOpacity onPress={() => { setSupplierStep(1); setShowSupplierFlow(true); }} style={{flexDirection:'row', alignItems:'center', padding:16, backgroundColor:'white', borderRadius:12, borderWidth:1, borderColor:'#eee'}}><Text style={{fontWeight:'bold'}}>Become a Supplier</Text></TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
      {tab === 'cart' &&!showSplash && (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.header}><TouchableOpacity onPress={() => setTab('home')}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Cart</Text></View>
          <ScrollView style={{ padding: 12 }}>
            {cart.map((item, idx) => <View key={idx} style={styles.cartItem}><Image source={{ uri: item.img }} style={{ width: 60, height: 60, borderRadius: 8 }} /><View style={{ flex: 1, marginLeft: 10 }}><Text numberOfLines={2}>{item.name}</Text><Text style={{ fontWeight: 'bold' }}>₹{item.price} x {item.qty}</Text></View><TouchableOpacity onPress={()=>{ setCart(cart.filter((_, i)=> i!==idx)) }}><Ionicons name="trash-outline" size={20} color="red"/></TouchableOpacity></View>)}
            {cart.length > 0 && <TouchableOpacity onPress={()=> setShowCheckout(true)} style={[styles.sendBtn, {backgroundColor:'#16A34A'}]}><Text style={styles.sendBtnText}>Place Order</Text></TouchableOpacity>}
          </ScrollView>
        </View>
      )}
      {tab === 'wishlist' &&!showSplash && (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.header}><TouchableOpacity onPress={() => setTab('home')}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Wishlist ❤️</Text></View>
          <ScrollView style={{ padding: 12 }}><Text>Items: {wishlist.length}</Text></ScrollView>
        </View>
      )}
      {!showSplash && (
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setTab('home')} style={styles.navItem}><Ionicons name={tab === 'home'? "home" : "home-outline"} size={24} color={tab === 'home'? '#ff6f00' : 'gray'} /><Text style={[styles.navText, tab === 'home' && { color: '#ff6f00' }]}>Home</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('orders')} style={styles.navItem}><Ionicons name={tab === 'orders'? "cube" : "cube-outline"} size={24} color={tab === 'orders'? '#ff6f00' : 'gray'} /><Text style={[styles.navText, tab === 'orders' && { color: '#ff6f00' }]}>Orders</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('account')} style={styles.navItem}><Ionicons name={tab === 'account'? "person" : "person-outline"} size={24} color={tab === 'account'? '#ff6f00' : 'gray'} /><Text style={[styles.navText, tab === 'account' && { color: '#ff6f00' }]}>Account</Text></TouchableOpacity>
      </View>
      )}
      {showSplash && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: width, height: height, zIndex: 10000, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={{ uri: LOGO_URL }} style={{ width: 260, height: 260 }} resizeMode="contain" />
          <Text style={{ marginTop: 15, fontSize: 32, fontWeight: 'bold', color: '#ff6f00' }}>UpBazaar</Text>
        </View>
      )}      {showSupplierFlow && (
        <View style={{ flex: 1, backgroundColor: 'white', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><TouchableOpacity onPress={() => { if (supplierStep === 1) { setShowSupplierFlow(false); } else { setSupplierStep(supplierStep - 1); } }}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 12 }}>Supplier</Text></View>
          {supplierStep===1 && (
            <ScrollView style={{flex:1, padding:20}}><View style={{marginTop:25, gap:12}}>{SUPPLIER_BENEFITS.map((b,i)=>(<View key={i} style={{flexDirection:'row', alignItems:'center', backgroundColor:b.color, padding:14, borderRadius:12}}><View style={{width:22, height:22, borderRadius:11, backgroundColor:b.dot, marginRight:10}}/><Text style={{fontSize:14, fontWeight:'500', flex:1}}>{b.text}</Text></View>))}</View><TouchableOpacity onPress={() => setSupplierStep(2)} style={{ backgroundColor: '#16A34A', padding: 18, borderRadius: 12, marginTop: 30, alignItems:'center' }}><Text style={{ color: 'white', fontWeight: 'bold', fontSize:16 }}>Start Selling →</Text></TouchableOpacity></ScrollView>
          )}
          {supplierStep===2 && (
            <ScrollView style={{ flex: 1, padding: 20 }}><TextInput placeholder="Dukaan Ka Naam" style={styles.sellerInput} value={shopName} onChangeText={setShopName} /><TextInput placeholder="Maalik Ka Naam" style={styles.sellerInput} value={ownerName} onChangeText={setOwnerName} /><TextInput placeholder="Mobile" keyboardType="phone-pad" maxLength={10} style={styles.sellerInput} value={shopMobile} onChangeText={setShopMobile} /><TextInput placeholder="Pata" style={styles.sellerInput} value={shopAddress} onChangeText={setShopAddress} /><TouchableOpacity onPress={() => { if (!shopName ||!ownerName ||!shopMobile ||!shopAddress) return Alert.alert("Sab bharo"); const newShop = { id: Date.now(), shopName, ownerName, mobile: shopMobile, address: shopAddress }; saveShops([...shops, newShop]); saveCurrentShop(newShop); setSupplierStep(3); }} style={{ backgroundColor: '#16A34A', padding: 16, borderRadius: 10, marginTop: 25 }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Start Selling</Text></TouchableOpacity></ScrollView>
          )}
          {supplierStep===3 && <View style={{alignItems:'center', padding:20}}><Text style={{ fontSize: 26, fontWeight: 'bold', color: '#065F46', marginTop: 15 }}>Mubarak Ho! 🎉</Text><TouchableOpacity onPress={() => setSupplierStep(4)} style={{ backgroundColor: '#ff6f00', padding: 16, borderRadius: 10, marginTop: 20, width: '100%' }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>+ Product Add Karo</Text></TouchableOpacity></View>}
          {supplierStep===4 && (
            <View style={{flex:1}}><ScrollView style={{ flex: 1, padding: 20 }}><TextInput placeholder="Product Naam" style={styles.sellerInput} value={newProdName} onChangeText={setNewProdName} /><TextInput placeholder="Price" keyboardType="number-pad" style={styles.sellerInput} value={newProdPrice} onChangeText={setNewProdPrice} /><View style={{flexDirection:'row', flexWrap:'wrap', marginTop:10}}>{[{val:newProdImg1, set:setNewProdImg1},{val:newProdImg2, set:setNewProdImg2},{val:newProdImg3, set:setNewProdImg3},{val:newProdImg4, set:setNewProdImg4},{val:newProdImg5, set:setNewProdImg5},{val:newProdImg6, set:setNewProdImg6},{val:newProdImg7, set:setNewProdImg7}].map((it,i)=>(<TouchableOpacity key={i} onPress={()=> pickImage(it.set)} style={{width:(width-70)/3, height:110, borderWidth:1.5, borderColor: it.val? '#16A34A' : '#ddd', borderRadius:10, margin:5, alignItems:'center', justifyContent:'center'}}>{it.val? <Image source={{uri: it.val}} style={{width:'100%', height:'100%', borderRadius:9}}/> : <Text>+ Photo {i+1}</Text>}</TouchableOpacity>))}</View></ScrollView><TouchableOpacity onPress={() => { const allImgs = [newProdImg1,newProdImg2,newProdImg3,newProdImg4,newProdImg5,newProdImg6,newProdImg7].filter(i=> i); if(!newProdName ||!newProdPrice || allImgs.length===0) return Alert.alert("Naam, Price, 1 Photo"); const newP = { id: Date.now(), name: newProdName, price: parseInt(newProdPrice), mrp: parseInt(newProdPrice)+400, category: "Popular", img: allImgs[0], images: allImgs, sizes: ['Free Size'], sizeType: 'Free Size', rating: "4.3", reviews: "1", delivery: "Free Delivery", shopName: currentShop?.shopName, returnDays: 7, reviewList: [] }; saveProducts([newP,...products]); setShowSupplierFlow(false); setTab('home'); }} style={{ backgroundColor: '#16A34A', padding: 18, margin:15, borderRadius: 12, alignItems:'center' }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Add Karo</Text></TouchableOpacity></View>
          )}
        </View>
      )}
      <Modal visible={showCheckout} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'white' }}><View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15 }}><TouchableOpacity onPress={() => setShowCheckout(false)}><Ionicons name="arrow-back" size={26} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Delivery</Text></View>
          <ScrollView style={{ flex: 1, padding: 20 }}><TextInput placeholder="Naam" style={styles.sellerInput} value={customerName} onChangeText={setCustomerName} /><TextInput placeholder="Mobile" keyboardType="phone-pad" maxLength={10} style={styles.sellerInput} value={customerMobile} onChangeText={setCustomerMobile} /><TextInput placeholder="Address" style={[styles.sellerInput, { height: 90 }]} multiline value={customerAddress} onChangeText={setCustomerAddress} /><TouchableOpacity onPress={placeOrder} style={[styles.sendBtn, {backgroundColor:'#16A34A', marginTop:20}]}><Text style={styles.sendBtnText}>Confirm Order</Text></TouchableOpacity></ScrollView>
        </View>
      </Modal>
    </View>
  );
        }const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 45, paddingBottom: 12, paddingHorizontal: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  catChip: { alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 10, marginRight: 10, width: 80, borderWidth: 1, borderColor: '#eee' },
  catChipActive: { borderColor: '#ff6f00', backgroundColor: '#FFF7ED' },
  catText: { fontSize: 10, textAlign: 'center', marginTop: 4, fontWeight: '500' },
  banner: { height: 120, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  bannerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  bannerSub: { color: 'white', fontSize: 12, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ddd', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#ff6f00', width: 18 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 6, justifyContent: 'space-between' },
  productCard: { width: (width/2)-12, backgroundColor: 'white', borderRadius: 12, padding: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  productImg: { width: '100%', height: 160, borderRadius: 8, backgroundColor: '#f5f5f5' },
  pName: { fontSize: 12, fontWeight: '500', marginTop: 6 },
  pPrice: { fontWeight: 'bold', fontSize: 14, color: '#111' },
  pMrp: { fontSize: 11, color: 'gray', textDecorationLine: 'line-through', marginLeft: 6 },
  badge: { position: 'absolute', top: -6, right: -6, backgroundColor: 'red', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  orderCard: { backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  accountItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#eee', gap: 10 },
  accountText: { flex: 1, fontWeight: '500' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee', paddingVertical: 8, paddingBottom: 20 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 10, marginTop: 2, color: 'gray' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: 'white', width: '100%', borderRadius: 16, padding: 20 },
  sellerInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 12, backgroundColor: 'white' },
  smallBtn: { padding: 10, borderRadius: 8, alignItems: 'center' },
  smallBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  sendBtn: { padding: 14, borderRadius: 10, alignItems: 'center' },
  sendBtnText: { color: 'white', fontWeight: 'bold' },
});
