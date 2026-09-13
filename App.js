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
];
export default function App() {
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
  useEffect(() => { const interval = setInterval(() => { const next = (bannerIndex + 1) % banners.length; setBannerIndex(next); bannerRef.current?.scrollToIndex({ index: next, animated: true }); }, 3000); return () => clearInterval(interval); }, [bannerIndex, banners.length]);
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
  const saveBanners = async (nb) => { setBanners(nb); await AsyncStorage.setItem('banners', JSON.stringify(nb)); }; const saveShops = async (ns) => { setShops(ns); await AsyncStorage.setItem('shops', JSON.stringify(ns)); }; const saveProducts = async (np) => { setProducts(np); await AsyncStorage.setItem('products', JSON.stringify(np)); }; const saveOrders = async (no) => { setOrders(no); await AsyncStorage.setItem('orders', JSON.stringify(no)); }; const saveCurrentShop = async (shop) => { setCurrentShop(shop); await AsyncStorage.setItem('currentShop', JSON.stringify(shop)); };
  const getDiscount = (price, mrp) => { if(!mrp || mrp<=price) return 0; return Math.round(((mrp-price)/mrp)*100); };
  const getDeliveryInfo = (pincode) => { if (distanceKm && parseFloat(distanceKm) > RADIUS_KM) { return { text: `15KM Bahar (${distanceKm} KM)`, sub: "Kal Delivery", color:"#FF0000", days: 1, allow: false }; } if(!pincode || pincode.startsWith('261')) return { text: "Aaj 7 ghante me", sub: locationStatus, color:"#16A34A", days: 0, allow: true }; else return { text: "Kal tak delivery", sub: "All India", color:"#ff6f00", days: 1, allow: true }; };
  const getStatusIndex = (status) => { if(status==='Cancelled') return -1; const idx = TRACK_STEPS.indexOf(status); return idx===-1?0:idx; };
  const getInvoiceText = (order) => { if(!order) return ""; const itemsText = order.items.map((it,i)=> (i+1)+". "+it.name+" | Size: "+it.selectedSize+" x "+it.qty+" = Rs "+(it.price*it.qty)).join("\n"); return "UpBazaar INVOICE\nOrder: #"+order.id.toString().slice(-6)+"\nDist: "+(distanceKm||"15KM")+"\n"+itemsText+"\nTotal Rs "+order.total; };
  const pickImage = async (setFn) => { try { const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (status!== 'granted') { Alert.alert("Permission","Allow karo"); return; } let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4,3], quality: 0.7, }); if (!result.canceled && result.assets && result.assets[0]?.uri) { setFn(result.assets[0].uri); } } catch(e) { Alert.alert("Expo Go me kholo","Web me gallery nahi khulti"); } };
  const addToCart = (p, size) => { const finalSize = size || (p.sizes && p.sizes[0]) || 'Free Size'; if (!isInRadius && distanceKm) { Alert.alert("15KM Bahar", `Aap ${distanceKm} KM door ho - Kal delivery hogi.`, [{text:"Cancel", style:"cancel"}, {text:"OK Kal", onPress: () => { setCart(prev => { const ex = prev.find(i => i.id === p.id && i.selectedSize === finalSize); if (ex) return prev.map(i => i.id === p.id && i.selectedSize === finalSize? {...i, qty: i.qty + 1 } : i); return [...prev, {...p, qty: 1, selectedSize: finalSize }]; }); }}]); return; } setCart(prev => { const ex = prev.find(i => i.id === p.id && i.selectedSize === finalSize); if (ex) return prev.map(i => i.id === p.id && i.selectedSize === finalSize? {...i, qty: i.qty + 1 } : i); return [...prev, {...p, qty: 1, selectedSize: finalSize }]; }); };
  const placeOrder = async () => { if (cart.length === 0) return; if (!customerName ||!customerMobile ||!customerAddress) return Alert.alert("Details bharo"); if (customerMobile.length!==10) return Alert.alert("10 digit mobile"); const deliveryInfo = getDeliveryInfo(customerPincode); const newOrder = { id: Date.now(), items: cart, date: new Date().toLocaleDateString(), status: 'Ordered', total: cart.reduce((s, i) => s + i.price * i.qty, 0), customer: { name: customerName, mobile: customerMobile, address: customerAddress, pincode: customerPincode }, deliveryInfo: deliveryInfo, orderTime: new Date().toLocaleTimeString(), distance: distanceKm }; await saveOrders([newOrder,...orders]); setCart([]); setShowCheckout(false); setTab('orders'); const itemsDetail = cart.map(it => it.name + " | Size:" + it.selectedSize + " x" + it.qty).join(", "); const fullMsg = "🔥 NEW ORDER - 15KM CHECK 🔥\nOrder #"+newOrder.id.toString().slice(-6)+"\nDist: "+(distanceKm||"Pincode")+" KM - "+locationStatus+"\nName: "+customerName+"\nMobile: "+customerMobile+"\nAddress: "+customerAddress+" - "+customerPincode+"\nItems: "+itemsDetail+"\nTotal Rs "+newOrder.total+"\nMap: https://maps.google.com/?q="+(userLocation? userLocation.latitude+","+userLocation.longitude : ""); setCustomerName(''); setCustomerMobile(''); setCustomerAddress(''); setCustomerPincode(''); Linking.openURL("https://wa.me/919235711539?text="+encodeURIComponent(fullMsg)); };
  const filteredProducts = products.filter(p => { const matchCat = selectedCategory === 'Popular' || p.category === selectedCategory; const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()); return matchCat && matchSearch; });
  return (
    <View style={styles.container}>
      {tab === 'home' &&!showSplash && (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}><View style={{ backgroundColor: '#ff6f00', width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Up</Text></View><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 8 }}>UpBazaar</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}><TouchableOpacity onPress={() => setTab('wishlist')} style={{ marginRight: 12 }}><Ionicons name="heart" size={24} color={wishlist.length>0?'red':'black'} />{wishlist.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{wishlist.length}</Text></View>}</TouchableOpacity><TouchableOpacity onPress={() => setTab('cart')} style={{ marginRight: 12 }}><Ionicons name="cart" size={24} color={cart.length>0?'#16A34A':'black'} />{cart.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cart.reduce((s, i) => s + i.qty, 0)}</Text></View>}</TouchableOpacity><TouchableOpacity onPress={() => setShowAdminLogin(true)} style={{ backgroundColor: '#111', padding: 6, borderRadius: 20 }}><Ionicons name="shield-checkmark" size={20} color="white" /></TouchableOpacity></View>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{paddingBottom: 90}}>
            <View style={{ padding: 12 }}><View style={[styles.searchBox, {borderColor: isInRadius? '#16A34A' : '#FF0000', borderWidth:1.5, backgroundColor: isInRadius? '#F0FFF4' : '#FFF0F0'}]}><Ionicons name="location" size={20} color={isInRadius? "#16A34A" : "red"} /><Text style={{ flex: 1, marginLeft: 8, fontSize:12, fontWeight:'bold', color: isInRadius? '#16A34A' : 'red' }}>{locationStatus}</Text></View></View>
            <View style={{ paddingHorizontal: 12 }}><View style={styles.searchBox}><Ionicons name="search" size={20} color="gray" /><TextInput placeholder="Search for Sarees, Kurtis..." style={{ flex: 1, marginLeft: 8 }} value={search} onChangeText={setSearch} /></View></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 12, marginTop:12 }}>
              {CATEGORIES_DATA.map(cat => (<TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.id)} style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}><Text style={{ fontSize: 20 }}>{cat.icon}</Text><Text style={[styles.catText, selectedCategory === cat.id && { color: '#ff6f00' }]} numberOfLines={2}>{cat.name}</Text></TouchableOpacity>))}
            </ScrollView>
            <View style={{ height: 150, marginTop: 15 }}><FlatList ref={bannerRef} data={banners} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={item => item.id.toString()} onMomentumScrollEnd={(e) => { const idx = Math.round(e.nativeEvent.contentOffset.x / width); setBannerIndex(idx); }} renderItem={({ item }) => (<View style={[styles.banner, { backgroundColor: item.color, width: width - 24, marginHorizontal: 12 }]}><View><Text style={styles.bannerTitle}>{item.emoji} {item.title}</Text><Text style={styles.bannerSub}>{item.subtitle}</Text></View><Ionicons name="chevron-forward" size={30} color="white" /></View>)} /><View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>{banners.map((_, i) => <View key={i} style={[styles.dot, bannerIndex === i && styles.dotActive]} />)}</View></View>
            <View style={styles.productGrid}>
              {filteredProducts.map(item => {
                const disc = getDiscount(item.price, item.mrp); const mainImg = item.images && item.images.length>0? item.images[0] : item.img; const isWish = wishlist.find(w=> w.id===item.id);
                return (
                <View key={item.id} style={styles.productCard}>
                  <TouchableOpacity onPress={() => { setSelectedProduct(item); setSelectedImgIndex(0); setSelectedSize(item.sizes? item.sizes[0] : 'Free Size'); }}>
                    <View style={{position:'relative'}}><Image source={{ uri: mainImg }} style={styles.productImg} />{disc>0 && <View style={{position:'absolute', top:6, left:6, backgroundColor:'#ff6f00', paddingHorizontal:6, paddingVertical:2, borderRadius:4}}><Text style={{color:'white', fontSize:10, fontWeight:'bold'}}>{disc}% OFF</Text></View>}<TouchableOpacity onPress={()=> { const ex = wishlist.find(w=> w.id===item.id); if(ex){ setWishlist(wishlist.filter(w=> w.id!==item.id)); } else { setWishlist([...wishlist, item]); } }} style={{position:'absolute', top:6, right:6, backgroundColor:'white', width:28, height:28, borderRadius:14, alignItems:'center', justifyContent:'center', elevation:3}}><Ionicons name={isWish? "heart" : "heart-outline"} size={16} color={isWish? "red" : "gray"} /></TouchableOpacity></View>
                    <View style={{flexDirection:'row', marginTop:6, alignItems:'center', gap:4}}><View style={{flexDirection:'row', backgroundColor:'#16A34A', paddingHorizontal:4, borderRadius:4, alignItems:'center'}}><Text style={{color:'white', fontSize:10, fontWeight:'bold'}}>{item.rating||"4.3"} ★</Text></View><Text style={{fontSize:10, color:'gray'}}>({item.reviewList? item.reviewList.length : 2})</Text></View>
                    <Text numberOfLines={2} style={styles.pName}>{item.name}</Text>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop:4}}><Text style={styles.pPrice}>₹{item.price}</Text><Text style={styles.pMrp}>₹{item.mrp}</Text></View>
                    <Text style={{fontSize:10, color: isInRadius? '#16A34A' : 'red', marginTop:2, fontWeight:'bold'}}>{isInRadius? '⚡ 7 ghante me delivery' : `⚡ ${distanceKm||'--'} KM - Kal`}</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection:'row', gap:6, marginTop:8}}>
                    <TouchableOpacity onPress={()=> addToCart(item, item.sizes? item.sizes[0] : 'Free Size')} style={{flex:1, backgroundColor:'#FFF7ED', borderWidth:1, borderColor:'#ff6f00', paddingVertical:6, borderRadius:6, alignItems:'center'}}><Text style={{color:'#ff6f00', fontSize:11, fontWeight:'bold'}}>Add to Cart</Text></TouchableOpacity>
                    <TouchableOpacity onPress={()=> { setSelectedProduct(item); setSelectedImgIndex(0); setSelectedSize(item.sizes? item.sizes[0] : 'Free Size'); }} style={{backgroundColor:'#111', paddingHorizontal:10, paddingVertical:6, borderRadius:6, alignItems:'center'}}><Ionicons name="eye-outline" size={14} color="white"/></TouchableOpacity>
                  </View>
                </View>
              )})}
            </View>
          </ScrollView>
        </View>
      )}      {tab === 'orders' &&!showSplash && (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.header}><Text style={{ fontWeight: 'bold', fontSize: 18 }}>My Orders - {distanceKm||'--'} KM</Text></View>
          <ScrollView style={{ padding: 12, paddingBottom: 90 }}>
            {orders.length === 0? <View style={{ alignItems: 'center', marginTop: 100 }}><Ionicons name="cube-outline" size={60} color="#ccc" /><Text style={{ color: 'gray', marginTop: 10 }}>No Orders Yet</Text></View> :
              orders.map(order => (
                <View key={order.id} style={styles.orderCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontWeight: 'bold' }}>Order #{order.id.toString().slice(-6)}</Text><Text style={{ color: order.status === 'Cancelled'? 'red' : '#16A34A', fontWeight: 'bold' }}>{order.status}</Text></View>
                  <Text style={{ color: 'gray', fontSize: 12, marginTop: 4 }}>{order.date} {order.orderTime} • ₹{order.total} • {order.distance||distanceKm||'--'} KM</Text>
                  {order.deliveryInfo && <View style={{marginTop:6, padding:8, backgroundColor: order.deliveryInfo.color+'20', borderRadius:6, borderWidth:1, borderColor: order.deliveryInfo.color}}><Text style={{fontSize:12, fontWeight:'bold', color: order.deliveryInfo.color}}>🚚 {order.deliveryInfo.text} - {order.deliveryInfo.sub}</Text></View>}
                  {order.customer && <View style={{marginTop:6, padding:8, backgroundColor:'#f9f9f9', borderRadius:6}}><Text style={{fontSize:12, fontWeight:'bold'}}>{order.customer.name} - {order.customer.mobile}</Text><Text style={{fontSize:11, color:'gray'}}>{order.customer.address} - {order.customer.pincode}</Text></View>}
                  {order.items.map((it,i)=><Text key={i} style={{fontSize:12, marginTop:4}}>• {it.name} | Size: {it.selectedSize} x {it.qty} = ₹{it.price*it.qty}</Text>)}
                  <View style={{ flexDirection: 'row', marginTop: 12, gap: 8, flexWrap:'wrap' }}>
                    <TouchableOpacity onPress={() => { setTrackOrder(order); setShowTrackModal(true); }} style={[styles.smallBtn, { backgroundColor: '#16A34A' }]}><Text style={styles.smallBtnText}>Track</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { setInvoiceOrder(order); setShowInvoiceModal(true); }} style={[styles.smallBtn, { backgroundColor: '#1E40AF' }]}><Text style={styles.smallBtnText}>🧾 Bill</Text></TouchableOpacity>
                    {order.status!== 'Cancelled' && <TouchableOpacity onPress={() => { setTrackOrder(order); setShowCancelModal(true); }} style={[styles.smallBtn, { backgroundColor: '#fee', borderWidth: 1, borderColor: 'red' }]}><Text style={[styles.smallBtnText, { color: 'red' }]}>Cancel</Text></TouchableOpacity>}
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      )}
      {tab === 'account' &&!showSplash && (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{paddingBottom: 100}}>
          <View style={[styles.header, {borderBottomWidth:0}]}><Text style={{ fontWeight: 'bold', fontSize: 20 }}>Account</Text></View>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ff6f00', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: 'white', fontSize: 32 }}>U</Text></View>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>UpBazaar User</Text>
            <Text style={{ color: 'gray', fontSize:13 }}>{isInRadius? `Sitapur, UP - ${distanceKm||''} KM - ${locationStatus}` : `Sitapur, UP - ${locationStatus}`}</Text>
          </View>

          {currentShop? (
            <View style={{marginTop:20, marginHorizontal:12, padding:14, backgroundColor:'#F0FFF4', borderRadius:16, borderWidth:1.5, borderColor:'#16A34A'}}>
              <View style={{flexDirection:'row', alignItems:'center'}}><Text style={{fontSize:20}}>🏪</Text><Text style={{fontWeight:'bold', fontSize:15, color:'#065F46', flex:1, marginLeft:6}}>Meri Dukaan - {currentShop.shopName}</Text></View>
              <Text style={{fontSize:13, marginTop:8, color:'#333'}}>Maalik: {currentShop.ownerName} | {currentShop.mobile}</Text>
              <Text style={{fontSize:12, color:'gray'}}>{currentShop.category||'All Viral Products'} - {currentShop.address}</Text>
              <View style={{flexDirection:'row', gap:10, marginTop:12}}>
                <View style={{flex:1, backgroundColor:'white', padding:12, borderRadius:10, alignItems:'center', borderWidth:1, borderColor:'#eee'}}>
                  <Text style={{fontWeight:'bold', fontSize:18, color:'#111'}}>{products.filter(p=> p.shopName===currentShop.shopName).length}</Text>
                  <Text style={{fontSize:12, color:'gray'}}>My Products</Text>
                </View>
                <View style={{flex:1, backgroundColor:'white', padding:12, borderRadius:10, alignItems:'center', borderWidth:1, borderColor:'#eee'}}>
                  <Text style={{fontWeight:'bold', fontSize:18, color:'#111'}}>{orders.length}</Text>
                  <Text style={{fontSize:12, color:'gray'}}>Orders</Text>
                </View>
              </View>
              <TouchableOpacity onPress={()=> { setSupplierStep(4); setShowSupplierFlow(true); }} style={{backgroundColor:'#ff6f00', padding:14, borderRadius:10, marginTop:12, alignItems:'center'}}>
                <Text style={{color:'white', fontWeight:'bold', fontSize:14}}>+ Naya Product Add Karo (7 Photo)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={async()=>{ Alert.alert("Dukaan Logout?","Kya aap dukaan se logout karna chahte ho?",[{text:"Cancel",style:"cancel"},{text:"Logout", onPress: async()=>{ setCurrentShop(null); await AsyncStorage.removeItem('currentShop'); Alert.alert("Logout ho gaya"); }}]); }} style={{backgroundColor:'#E5E7EB', padding:12, borderRadius:10, marginTop:10, alignItems:'center'}}>
                <Text style={{color:'#111', fontWeight:'bold', fontSize:13}}>Dukaan Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{marginTop:20, marginHorizontal:12}}>
              <TouchableOpacity onPress={() => { setSupplierStep(1); setShowSupplierFlow(true); }} style={{flexDirection:'row', alignItems:'center', padding:16, backgroundColor:'white', borderRadius:12, borderWidth:1, borderColor:'#eee', gap:12}}>
                <View style={{backgroundColor:'#FFF7ED', padding:10, borderRadius:10}}><Ionicons name="storefront" size={22} color="#ff6f00" /></View>
                <View style={{flex:1}}><Text style={{fontWeight:'bold', fontSize:14}}>Become a Supplier</Text><Text style={{fontSize:11, color:'gray'}}>0% Commission, Daily Payment</Text></View>
                <Ionicons name="chevron-forward" size={20} color="gray" />
              </TouchableOpacity>
              <View style={{marginTop:10, padding:10, backgroundColor:'#FFF7ED', borderRadius:10, borderWidth:1, borderColor:'#ff6f00', borderStyle:'dashed'}}>
                <Text style={{fontSize:11, color:'#9A3412', fontWeight:'bold', textAlign:'center'}}>Naya user? Dukaan jodo aur bechna shuru karo - Screenshot wala fayda dekho!</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.accountItem} onPress={() => setShowHelp(true)}><View style={{backgroundColor:'#F0FFF4', padding:8, borderRadius:20}}><Ionicons name="help-circle-outline" size={20} color="#16A34A" /></View><Text style={styles.accountText}>Help Center - 9235711539</Text><Ionicons name="chevron-forward" size={20} color="gray" /></TouchableOpacity>
          <TouchableOpacity style={styles.accountItem} onPress={() => Linking.openURL('https://wa.me/919235711539')}><View style={{backgroundColor:'#DCFCE7', padding:8, borderRadius:20}}><Ionicons name="logo-whatsapp" size={20} color="#16A34A" /></View><Text style={styles.accountText}>WhatsApp Support</Text><Ionicons name="chevron-forward" size={20} color="gray" /></TouchableOpacity>

          <View style={{marginTop:15, marginHorizontal:12}}>
            <TouchableOpacity style={{backgroundColor:'#111', padding:16, borderRadius:12, alignItems:'center'}} onPress={()=> Alert.alert("Logout","App se logout?")}><Text style={{color:'white', fontWeight:'bold', fontSize:14}}>Logout</Text></TouchableOpacity>
          </View>

          <View style={{marginTop:15, padding:12, backgroundColor:'#FFF7ED', borderRadius:8, marginHorizontal:12}}><Text style={{fontSize:11, color:'gray', textAlign:'center'}}>UpBazaar v2.0 - 15KM + Gallery + Meri Dukaan + No Reset ✅</Text></View>
        </ScrollView>
      )}
      {tab === 'cart' &&!showSplash && (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.header}><TouchableOpacity onPress={() => setTab('home')}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Cart ({cart.reduce((s, i) => s + i.qty, 0)}) - {distanceKm||'--'} KM</Text></View>
          <ScrollView style={{ padding: 12, paddingBottom: 90 }}>
            {cart.map((item, idx) => <View key={idx} style={styles.cartItem}><Image source={{ uri: item.img }} style={{ width: 60, height: 60, borderRadius: 8 }} /><View style={{ flex: 1, marginLeft: 10 }}><Text numberOfLines={2}>{item.name}</Text><Text style={{ fontWeight: 'bold', marginTop: 2 }}>₹{item.price} x {item.qty}</Text><Text style={{fontSize:11, color:'#ff6f00', fontWeight:'bold', marginTop:2}}>Size: {item.selectedSize} - {getDiscount(item.price,item.mrp)}% OFF</Text></View><TouchableOpacity onPress={()=>{ setCart(cart.filter((_, i)=> i!==idx)) }}><Ionicons name="trash-outline" size={20} color="red"/></TouchableOpacity></View>)}
            {cart.length > 0 && <View><View style={{padding:10, backgroundColor: isInRadius? '#F0FFF4' : '#FFF0F0', borderRadius:8, borderWidth:1, borderColor: isInRadius? '#16A34A' : 'red', marginBottom:10}}><Text style={{fontWeight:'bold', color: isInRadius? '#16A34A' : 'red'}}>{locationStatus}</Text></View><TouchableOpacity onPress={()=> setShowCheckout(true)} style={[styles.sendBtn, {backgroundColor:'#16A34A'}]}><Text style={styles.sendBtnText}>Place Order → 15KM Check</Text></TouchableOpacity></View>}
          </ScrollView>
        </View>
      )}
      {tab === 'wishlist' &&!showSplash && (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={styles.header}><TouchableOpacity onPress={() => setTab('home')}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Wishlist ❤️ {wishlist.length}</Text></View>
          <ScrollView style={{ padding: 12, paddingBottom: 90 }}>
            {wishlist.length===0? <View style={{alignItems:'center', marginTop:50}}><Ionicons name="heart-outline" size={50} color="#ccc"/><Text style={{color:'gray', marginTop:10}}>Wishlist Empty</Text></View> :
            wishlist.map(w => <View key={w.id} style={styles.cartItem}><Image source={{ uri: w.img }} style={{ width: 60, height: 60, borderRadius: 8 }} /><View style={{flex:1, marginLeft:10}}><Text numberOfLines={2}>{w.name}</Text><Text style={{fontWeight:'bold'}}>₹{w.price} - {getDiscount(w.price,w.mrp)}% OFF</Text></View><TouchableOpacity onPress={()=> setWishlist(wishlist.filter(x=> x.id!==w.id))}><Ionicons name="trash-outline" size={20} color="red"/></TouchableOpacity><TouchableOpacity onPress={()=> addToCart(w)} style={{marginLeft:10, backgroundColor:'#FFF7ED', padding:8, borderRadius:6, borderWidth:1, borderColor:'#ff6f00'}}><Text style={{color:'#ff6f00', fontSize:10, fontWeight:'bold'}}>Cart</Text></TouchableOpacity></View>)}
          </ScrollView>
        </View>
      )}
      {!showSplash && (
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setTab('home')} style={styles.navItem}><Ionicons name={tab === 'home'? "home" : "home-outline"} size={24} color={tab === 'home'? '#ff6f00' : 'gray'} /><Text style={[styles.navText, tab === 'home' && { color: '#ff6f00' }]}>Home</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('orders')} style={styles.navItem}><Ionicons name={tab === 'orders'? "cube" : "cube-outline"} size={24} color={tab === 'orders'? '#ff6f00' : 'gray'} /><Text style={[styles.navText, tab === 'orders' && { color: '#ff6f00' }]}>Orders</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('account')} style={styles.navItem}><Ionicons name={tab === 'account'? "person" : "person-outline"} size={24} color={tab === 'account'? '#ff6f00' : 'gray'} /><Text style={[styles.navText, tab === 'account' && { color: '#ff6f00' }]}>Account</Text></TouchableOpacity>
      </View>
      )}      <Modal visible={!!selectedProduct} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 12, borderBottomWidth:1, borderColor:'#eee', justifyContent:'space-between' }}>
            <View style={{flexDirection:'row', alignItems:'center'}}><TouchableOpacity onPress={() => setSelectedProduct(null)}><Ionicons name="arrow-back" size={26} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 15, marginLeft: 12 }}>Product Details - {distanceKm||''} KM</Text></View>
            <TouchableOpacity onPress={()=> { if(!selectedProduct) return; const ex = wishlist.find(w=> w.id===selectedProduct.id); if(ex){ setWishlist(wishlist.filter(w=> w.id!==selectedProduct.id)); } else { setWishlist([...wishlist, selectedProduct]); } }} style={{backgroundColor:'#FFF0F0', padding:8, borderRadius:20}}><Ionicons name={wishlist.find(w=> w.id===selectedProduct?.id)? "heart" : "heart-outline"} size={22} color="red"/></TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{paddingBottom: 150}}>
            {selectedProduct && <>
              <View style={{position:'relative'}}><Image source={{ uri: (selectedProduct.images && selectedProduct.images[selectedImgIndex]) || selectedProduct.img }} style={{ width: width, height: width*1.1, backgroundColor:'#f5f5f5' }} resizeMode="cover" /><View style={{position:'absolute', top:15, left:15, backgroundColor:'#ff6f00', paddingHorizontal:10, paddingVertical:5, borderRadius:6}}><Text style={{color:'white', fontWeight:'bold', fontSize:12}}>{getDiscount(selectedProduct.price, selectedProduct.mrp)}% OFF</Text></View><View style={{position:'absolute', top:15, right:15, backgroundColor: isInRadius? '#16A34A' : '#FF0000', paddingHorizontal:10, paddingVertical:5, borderRadius:6}}><Text style={{color:'white', fontWeight:'bold', fontSize:11}}>{locationStatus}</Text></View></View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{padding:10}}>{(selectedProduct.images||[selectedProduct.img]).map((im, idx)=>(<TouchableOpacity key={idx} onPress={()=> setSelectedImgIndex(idx)} style={{borderWidth: selectedImgIndex===idx? 2.5 : 1, borderColor: selectedImgIndex===idx? '#ff6f00' : '#eee', borderRadius:8, marginRight:8}}><Image source={{uri: im}} style={{width:70, height:70, borderRadius:6}}/></TouchableOpacity>))}</ScrollView>
              <View style={{ padding: 16 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{selectedProduct.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap:6 }}>
                  <View style={{flexDirection:'row', backgroundColor:'#16A34A', paddingHorizontal:6, borderRadius:4, alignItems:'center', paddingVertical:2}}><Text style={{color:'white', fontSize:12, fontWeight:'bold'}}>{selectedProduct.rating||"4.3"} ★</Text></View>
                  <Text style={{fontSize:12, color:'gray'}}>({selectedProduct.reviewList? selectedProduct.reviewList.length : 2} Reviews)</Text>
                  <View style={{backgroundColor:'#DBEAFE', paddingHorizontal:6, borderRadius:4, marginLeft:6}}><Text style={{fontSize:10, color:'#1E40AF', fontWeight:'bold'}}>FREE RETURN {selectedProduct.returnDays||7} Din</Text></View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ff6f00' }}>₹{selectedProduct.price}</Text>
                  <Text style={{ color: 'gray', textDecorationLine: 'line-through', fontSize: 16, marginLeft: 12 }}>₹{selectedProduct.mrp}</Text>
                  <View style={{marginLeft:10, backgroundColor:'#E8F5E9', paddingHorizontal:8, paddingVertical:3, borderRadius:4}}><Text style={{color:'#16A34A', fontWeight:'bold', fontSize:13}}>{getDiscount(selectedProduct.price, selectedProduct.mrp)}% OFF</Text></View>
                </View>
                <View style={{marginTop:12, padding:10, backgroundColor: isInRadius? '#F0FFF4' : '#FFF0F0', borderRadius:8, borderWidth:1, borderColor: isInRadius? '#16A34A' : 'red'}}>
                  <Text style={{fontSize:12, fontWeight:'bold', color: isInRadius? '#16A34A' : 'red'}}>🚚 {locationStatus}</Text>
                  <Text style={{fontSize:11, color:'gray', marginTop:2}}>✓ Cash on Delivery • ✓ Free Delivery</Text>
                </View>
                <Text style={{fontWeight:'bold', fontSize:15, marginTop:18}}>Select Size - {selectedProduct.sizeType}</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap', marginTop:10}}>{(selectedProduct.sizes || ['Free Size']).map(sz=>(<TouchableOpacity key={sz} onPress={()=> setSelectedSize(sz)} style={{paddingVertical:8, paddingHorizontal:14, borderRadius:8, borderWidth:1.5, borderColor: selectedSize===sz? '#ff6f00' : '#ddd', backgroundColor: selectedSize===sz? '#FFF7ED' : 'white', marginRight:8, marginBottom:8}}><Text style={{fontWeight:'bold', color: selectedSize===sz? '#ff6f00' : 'black', fontSize:13}}>{sz}</Text></TouchableOpacity>))}</View>
                <View style={{marginTop:18, borderTopWidth:1, borderColor:'#eee', paddingTop:12}}><Text style={{fontWeight:'bold', fontSize:16}}>Product Details</Text><Text style={{fontSize:12, color:'gray', marginTop:6}}>✓ {locationStatus}{"\n"}✓ {selectedProduct.returnDays||7} Din Free Return{"\n"}✓ Cash on Delivery{"\n"}✓ Shop: {selectedProduct.shopName||"UpBazaar Store"}</Text></View>
                <View style={{marginTop:18, borderTopWidth:1, borderColor:'#eee', paddingTop:12}}><View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}><Text style={{fontWeight:'bold', fontSize:16}}>Reviews ({selectedProduct.reviewList? selectedProduct.reviewList.length : 2})</Text><TouchableOpacity onPress={()=> { setReviewProduct(selectedProduct); setShowReviewModal(true); }} style={{backgroundColor:'#ff6f00', paddingHorizontal:10, paddingVertical:6, borderRadius:6}}><Text style={{color:'white', fontSize:11, fontWeight:'bold'}}>+ Review Likho</Text></TouchableOpacity></View>{(selectedProduct.reviewList||DEMO_REVIEWS).map(rv=>(<View key={rv.id} style={{marginTop:12, padding:10, backgroundColor:'#f9f9f9', borderRadius:8}}><View style={{flexDirection:'row', alignItems:'center', gap:6}}><Text style={{fontWeight:'bold', fontSize:12}}>{rv.name}</Text><View style={{backgroundColor:'#16A34A', paddingHorizontal:4, borderRadius:4}}><Text style={{color:'white', fontSize:10}}>{rv.rating} ★</Text></View><Text style={{fontSize:10, color:'gray'}}>{rv.date}</Text></View><Text style={{fontSize:12, marginTop:4}}>{rv.text}</Text></View>))}</View>
              </View>
            </>}
          </ScrollView>
          <View style={{position:'absolute', bottom:0, left:0, right:0, flexDirection:'row', padding:12, paddingBottom:35, backgroundColor:'white', borderTopWidth:1, borderColor:'#eee', gap:8}}>
            <TouchableOpacity onPress={()=> { if(!selectedSize) return Alert.alert("Size select karo"); const ex = wishlist.find(w=> w.id===selectedProduct.id); if(!ex){ setWishlist([...wishlist, selectedProduct]); Alert.alert("Wishlist me ❤️"); } else { Alert.alert("Already Wishlist me hai"); } }} style={{flex:1, backgroundColor:'white', borderWidth:1.5, borderColor:'red', paddingVertical:14, borderRadius:10, alignItems:'center'}}><Text style={{color:'red', fontWeight:'bold', fontSize:11}}>WISHLIST</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=> { if(!selectedSize) return Alert.alert("Size select karo"); addToCart(selectedProduct, selectedSize); Alert.alert("Cart me add ho gaya!"); }} style={{flex:1, backgroundColor:'white', borderWidth:1.5, borderColor:'#ff6f00', paddingVertical:14, borderRadius:10, alignItems:'center'}}><Text style={{color:'#ff6f00', fontWeight:'bold', fontSize:11}}>ADD TO CART</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => { if(!selectedSize) return Alert.alert("Size select karo"); addToCart(selectedProduct, selectedSize); setSelectedProduct(null); setTimeout(()=>{ setTab('cart'); setShowCheckout(true); }, 300); }} style={{flex:1.2, backgroundColor: '#16A34A', paddingVertical:14, borderRadius:10, alignItems: 'center'}}><Text style={{ color: 'white', fontWeight: 'bold', fontSize:11 }}>BUY NOW</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={showInvoiceModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'white' }}><View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><TouchableOpacity onPress={() => setShowInvoiceModal(false)}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Invoice - {distanceKm||''} KM</Text></View><ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{paddingBottom: 120}}>{invoiceOrder && (<View style={{borderWidth:1, borderColor:'#ddd', borderRadius:12, padding:15}}><Text style={{fontWeight:'bold', fontSize:20, color:'#ff6f00', textAlign:'center'}}>UpBazaar - INVOICE</Text><Text style={{fontSize:11, marginTop:8}}>Order #{invoiceOrder.id.toString().slice(-6)} | {distanceKm||''} KM</Text><View style={{marginTop:12, padding:10, backgroundColor:'#F0FFF4', borderRadius:8}}><Text style={{fontWeight:'bold', fontSize:11}}>Customer:</Text><Text style={{fontSize:12}}>{invoiceOrder.customer?.name} - {invoiceOrder.customer?.mobile}</Text><Text style={{fontSize:11}}>{invoiceOrder.customer?.address} - {invoiceOrder.customer?.pincode}</Text></View><View style={{marginTop:12}}>{invoiceOrder.items.map((it,i)=><View key={i} style={{flexDirection:'row', justifyContent:'space-between', marginTop:6}}><Text style={{fontSize:11, flex:1}}>{i+1}. {it.name} | {it.selectedSize} x{it.qty}</Text><Text style={{fontSize:11, fontWeight:'bold'}}>Rs {it.price*it.qty}</Text></View>)}</View><View style={{marginTop:15, padding:12, backgroundColor:'#f9f9f9', borderRadius:8}}><View style={{flexDirection:'row', justifyContent:'space-between'}}><Text style={{fontWeight:'bold', fontSize:16}}>Payable:</Text><Text style={{fontWeight:'bold', fontSize:16}}>Rs {invoiceOrder.total}</Text></View></View></View>)}</ScrollView><View style={{padding:15, borderTopWidth:1, borderColor:'#eee', flexDirection:'row', gap:10, paddingBottom:35}}><TouchableOpacity onPress={()=> setShowInvoiceModal(false)} style={{flex:1, padding:14, borderRadius:8, backgroundColor:'#eee', alignItems:'center'}}><Text style={{fontWeight:'bold'}}>Close</Text></TouchableOpacity><TouchableOpacity onPress={()=> { const txt = getInvoiceText(invoiceOrder); Share.share({message: txt}); }} style={{flex:1, padding:14, borderRadius:8, backgroundColor:'#16A34A', alignItems:'center'}}><Text style={{color:'white', fontWeight:'bold'}}>Share Bill</Text></TouchableOpacity></View></View>
      </Modal>      <Modal visible={showTrackModal} transparent animationType="slide"><View style={{ flex: 1, backgroundColor: 'white' }}><View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><TouchableOpacity onPress={() => setShowTrackModal(false)}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Order Tracking - {distanceKm||''} KM</Text></View><ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{paddingBottom: 120}}>{trackOrder && (<View><View style={{padding:12, backgroundColor:'#f9f9f9', borderRadius:10}}><Text style={{fontWeight:'bold'}}>Order #{trackOrder.id.toString().slice(-6)} • ₹{trackOrder.total}</Text><Text style={{fontSize:11}}>{trackOrder.customer?.name} - {trackOrder.customer?.mobile}</Text></View><View style={{marginTop:20}}>{TRACK_STEPS.map((step, idx)=>{ const currentIdx = getStatusIndex(trackOrder.status); const isDone = idx <= currentIdx; return (<View key={step} style={{flexDirection:'row'}}><View style={{alignItems:'center', width:30}}><View style={{width:26, height:26, borderRadius:13, backgroundColor: isDone? '#16A34A' : '#eee', alignItems:'center', justifyContent:'center'}}><Ionicons name={isDone? "checkmark" : "time-outline"} size={14} color={isDone? "white" : "gray"}/></View>{idx!== TRACK_STEPS.length-1 && <View style={{width:2, height:50, backgroundColor: idx < currentIdx? '#16A34A' : '#eee', marginTop:4}}/>}</View><View style={{flex:1, marginLeft:10, paddingBottom:30}}><Text style={{fontWeight:'bold', fontSize:14, color: isDone? 'black' : 'gray'}}>{step}</Text></View></View>)})}</View></View>)}</ScrollView></View></Modal>
      <Modal visible={showReviewModal} transparent animationType="slide"><View style={styles.modalBg}><View style={styles.modalBox}><Text style={{fontWeight:'bold'}}>⭐ Review Likho</Text><View style={{flexDirection:'row', marginTop:8, gap:6}}>{[1,2,3,4,5].map(st=><TouchableOpacity key={st} onPress={()=> setNewReviewRating(st)} style={{padding:8, backgroundColor: newReviewRating>=st? '#ff6f00' : '#eee', borderRadius:6}}><Ionicons name="star" size={20} color={newReviewRating>=st? 'white' : 'gray'}/></TouchableOpacity>)}</View><TextInput placeholder="Apna Naam" style={styles.sellerInput} value={reviewerName} onChangeText={setReviewerName}/><TextInput placeholder="Review likho" style={[styles.sellerInput, {height:80}]} multiline value={newReviewText} onChangeText={setNewReviewText}/><View style={{flexDirection:'row', gap:10, marginTop:15}}><TouchableOpacity onPress={()=> setShowReviewModal(false)} style={[styles.smallBtn, {flex:1, backgroundColor:'#eee'}]}><Text style={[styles.smallBtnText, {color:'black'}]}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={()=> { if(!reviewerName ||!newReviewText) return Alert.alert("Naam aur Review bharo"); const newRev = { id: Date.now(), name: reviewerName, rating: newReviewRating, text: newReviewText, date: "Abhi" }; const updated = products.map(p=> p.id===reviewProduct.id? {...p, reviewList: [newRev,...(p.reviewList||[])] } : p); saveProducts(updated); setSelectedProduct({...reviewProduct, reviewList: [newRev,...(reviewProduct.reviewList||[])] }); setShowReviewModal(false); setReviewerName(''); setNewReviewText(''); }} style={[styles.smallBtn, {flex:1, backgroundColor:'#16A34A'}]}><Text style={styles.smallBtnText}>Submit</Text></TouchableOpacity></View></View></View></Modal>
      <Modal visible={showHelp} transparent animationType="slide"><View style={styles.modalBg}><View style={styles.modalBox}><Text style={{ fontWeight: 'bold', fontSize: 18 }}>Help Center - {locationStatus} ✅</Text><Text style={{marginTop:8, fontSize:12, color:'gray'}}>{distanceKm||'--'} KM - Radius {RADIUS_KM} KM</Text><TouchableOpacity onPress={() => Linking.openURL('https://wa.me/919235711539')} style={[styles.sendBtn, { backgroundColor: '#16A34A' }]}><Text style={styles.sendBtnText}>WhatsApp - 9235711539</Text></TouchableOpacity><TouchableOpacity onPress={() => setShowHelp(false)} style={{ marginTop: 15, alignItems: 'center' }}><Text>Close</Text></TouchableOpacity></View></View></Modal>
      <Modal visible={showCancelModal} transparent animationType="fade"><View style={styles.modalBg}><View style={styles.modalBox}><Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cancel Order?</Text><View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}><TouchableOpacity onPress={() => setShowCancelModal(false)} style={[styles.smallBtn, { flex: 1, backgroundColor: '#eee' }]}><Text style={[styles.smallBtnText, { color: 'black' }]}>Nahi</Text></TouchableOpacity><TouchableOpacity onPress={async () => { const no = orders.map(o => o.id === trackOrder.id? {...o, status: 'Cancelled' } : o); await saveOrders(no); setShowCancelModal(false); }} style={[styles.smallBtn, { flex: 1, backgroundColor: 'red' }]}><Text style={styles.smallBtnText}>Haan Cancel</Text></TouchableOpacity></View></View></View></Modal>
      <Modal visible={showAdminLogin} transparent animationType="fade"><View style={styles.modalBg}><View style={styles.modalBox}><Text style={{ fontWeight: 'bold', fontSize: 18 }}>Admin Login</Text><TextInput placeholder="Password" secureTextEntry style={styles.sellerInput} value={adminPassInput} onChangeText={setAdminPassInput} /><View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}><TouchableOpacity onPress={() => setShowAdminLogin(false)} style={[styles.smallBtn, { flex: 1, backgroundColor: '#eee' }]}><Text style={[styles.smallBtnText, { color: 'black' }]}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={() => { if (adminPassInput === ADMIN_PASS) { setShowAdminLogin(false); setShowAdminPanel(true); setAdminPassInput(''); } else Alert.alert("Galat Password"); }} style={[styles.smallBtn, { flex: 1, backgroundColor: '#111' }]}><Text style={styles.smallBtnText}>Login</Text></TouchableOpacity></View></View></View></Modal>
      <Modal visible={showAdminPanel} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 45 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><TouchableOpacity onPress={() => setShowAdminPanel(false)}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Admin - 15KM - {distanceKm||''} KM</Text></View>
          <View style={{flexDirection:'row', padding:10, gap:4}}>{['banner','shop','product','order','users'].map(t=>(<TouchableOpacity key={t} onPress={()=> setAdminTab(t)} style={{flex:1, padding:8, borderRadius:8, backgroundColor: adminTab===t? '#111' : '#eee', alignItems:'center'}}><Text style={{color: adminTab===t? 'white' : 'black', fontSize:9, fontWeight:'bold'}}>{t.toUpperCase()}</Text></TouchableOpacity>))}</View>
          <ScrollView style={{ padding: 15, flex:1 }} contentContainerStyle={{paddingBottom: 120}}>
            {adminTab==='banner' && (<View><Text style={{fontWeight:'bold', fontSize:16}}>Banner - {locationStatus}</Text><View style={{marginTop:10, padding:12, backgroundColor:'#FFF7ED', borderRadius:10, borderWidth:1, borderColor:'#ff6f00'}}><TextInput placeholder="Title" style={styles.sellerInput} value={newBannerTitle} onChangeText={setNewBannerTitle}/><TextInput placeholder="Subtitle" style={styles.sellerInput} value={newBannerSub} onChangeText={setNewBannerSub}/><TouchableOpacity onPress={()=>{ if(!newBannerTitle) return Alert.alert("Title bharo"); const nb = { id: Date.now(), title: newBannerTitle, subtitle: newBannerSub || "Offer", color: newBannerColor || "#ff6f00", emoji: newBannerEmoji || "🔥" }; saveBanners([...banners, nb]); setNewBannerTitle(''); setNewBannerSub(''); Alert.alert("Banner Add!"); }} style={{backgroundColor:'#16A34A', padding:12, borderRadius:8, marginTop:10, alignItems:'center'}}><Text style={{color:'white', fontWeight:'bold'}}>Banner Add +</Text></TouchableOpacity></View>{banners.map(b => <View key={b.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8, marginTop: 10 }}><View><Text style={{fontWeight:'bold'}}>{b.emoji} {b.title}</Text><Text style={{fontSize:10, color:'gray'}}>{b.subtitle}</Text></View><View style={{flexDirection:'row', gap:6}}><TouchableOpacity onPress={() => { setEditBanner(b); setShowBannerEdit(true); }} style={{ backgroundColor: '#ff6f00', padding: 8, borderRadius: 6 }}><Text style={{ color: 'white', fontSize: 11 }}>Edit</Text></TouchableOpacity><TouchableOpacity onPress={() => { const nb = banners.filter(x => x.id!== b.id); saveBanners(nb); }} style={{ backgroundColor: 'red', padding: 8, borderRadius: 6 }}><Text style={{ color: 'white', fontSize: 11 }}>Delete</Text></TouchableOpacity></View></View>)}</View>)}{adminTab==='product' && (<View><Text style={{fontWeight:'bold'}}>Products - {products.length}</Text>{products.map(p => <View key={p.id} style={{ padding: 12, backgroundColor: '#f9f9f9', borderRadius: 10, marginTop: 10 }}><View style={{flexDirection:'row', justifyContent:'space-between'}}><Text style={{fontWeight:'bold', fontSize:12, flex:1}}>{p.name} - {getDiscount(p.price,p.mrp)}% OFF</Text><TouchableOpacity onPress={() => { const np = products.filter(x => x.id!== p.id); saveProducts(np); }} style={{ backgroundColor: 'red', padding: 6, borderRadius: 6 }}><Text style={{ color: 'white', fontSize: 11 }}>Delete</Text></TouchableOpacity></View></View>)}</View>)}{adminTab==='order' && (<View><Text style={{fontWeight:'bold'}}>Orders - {orders.length} - {locationStatus}</Text>{orders.map(o=> <View key={o.id} style={{padding:12, backgroundColor:'white', borderRadius:10, marginTop:10, borderWidth:1, borderColor: o.status==='Cancelled'? 'red' : '#16A34A'}}><Text style={{fontWeight:'bold', fontSize:12}}>Order #{o.id.toString().slice(-6)} - {o.status} - Rs {o.total} - {o.distance||''} KM</Text><Text style={{fontSize:11, marginTop:4, fontWeight:'bold'}}>{o.customer?.name} - {o.customer?.mobile}</Text><View style={{flexDirection:'row', flexWrap:'wrap', gap:6, marginTop:10}}>{['Ordered','Packed','Shipped','Out for Delivery','Delivered','Cancelled'].map(st=>{ const isActive = o.status===st; return <TouchableOpacity key={st} onPress={async()=>{ const no = orders.map(ord=> ord.id===o.id? {...ord, status: st} : ord); await saveOrders(no); }} style={{paddingHorizontal:8, paddingVertical:5, borderRadius:6, backgroundColor: isActive? '#16A34A' : '#eee'}}><Text style={{fontSize:10, color: isActive? 'white' : 'black'}}>{st}</Text></TouchableOpacity>})}</View></View>)}</View>)}{adminTab==='shop' && <View><Text style={{fontWeight:'bold'}}>Shops - {shops.length}</Text>{shops.map(s => <View key={s.id} style={{ padding: 12, backgroundColor: '#F0FFF4', borderRadius: 8, marginTop: 10 }}><Text style={{fontWeight:'bold'}}>{s.shopName} - {s.mobile}</Text><Text style={{fontSize:11}}>{s.address}</Text></View>)}</View>}{adminTab==='users' && <View><Text style={{fontWeight:'bold'}}>Sale: Rs {orders.reduce((s,o)=> s+o.total,0)} - {locationStatus}</Text><Text style={{marginTop:10, fontSize:12}}>Orders: {orders.length} - Safe ✅ - {distanceKm||''} KM</Text><Text style={{fontSize:12}}>Radius: {RADIUS_KM} KM</Text></View>}</ScrollView>
        </View>
      </Modal>
      <Modal visible={showBannerEdit} transparent animationType="fade"><View style={styles.modalBg}><View style={styles.modalBox}><Text style={{ fontWeight: 'bold' }}>Banner Edit ✅</Text><TextInput placeholder="Title" style={styles.sellerInput} value={editBanner?.title} onChangeText={t => setEditBanner({...editBanner, title: t })} /><TextInput placeholder="Subtitle" style={styles.sellerInput} value={editBanner?.subtitle} onChangeText={t => setEditBanner({...editBanner, subtitle: t })} /><View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}><TouchableOpacity onPress={() => setShowBannerEdit(false)} style={[styles.smallBtn, { flex: 1, backgroundColor: '#eee' }]}><Text style={[styles.smallBtnText, { color: 'black' }]}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={() => { const nb = banners.map(b => b.id === editBanner.id? editBanner : b); saveBanners(nb); setShowBannerEdit(false); }} style={[styles.smallBtn, { flex: 1, backgroundColor: '#16A34A' }]}><Text style={styles.smallBtnText}>Save Edit</Text></TouchableOpacity></View></View></View></Modal>      {showSupplierFlow && (
        <View style={{ flex: 1, backgroundColor: 'white', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}><TouchableOpacity onPress={() => { if (supplierStep === 1) { setShowSupplierFlow(false); } else { setSupplierStep(supplierStep - 1); } }}><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 12 }}>{supplierStep === 1? 'Become Supplier' : supplierStep === 2? 'Dukaan Jodo' : supplierStep === 3? 'Mubarak Ho!' : `Gallery 7 Photo - ${distanceKm||''} KM`}</Text></View>

          {supplierStep===1 && (
            <ScrollView style={{flex:1, padding:20}} contentContainerStyle={{paddingBottom:100}}>
              <View style={{alignItems:'center', marginTop:10}}>
                <View style={{width:80, height:80, borderRadius:40, backgroundColor:'#ff6f00', alignItems:'center', justifyContent:'center'}}><Text style={{color:'white', fontSize:28, fontWeight:'bold'}}>Up</Text></View>
                <Text style={{fontSize:22, fontWeight:'bold', textAlign:'center', marginTop:15, lineHeight:28}}>UpBazaar Par Bechna Shuru Karo</Text>
              </View>
              <View style={{marginTop:25, gap:12}}>
                {SUPPLIER_BENEFITS.map((b,i)=>(
                  <View key={i} style={{flexDirection:'row', alignItems:'center', backgroundColor:b.color, padding:14, borderRadius:12}}>
                    <View style={{width:22, height:22, borderRadius:11, backgroundColor:b.dot, marginRight:10}}/>
                    <Text style={{fontSize:14, fontWeight:'500', flex:1}}>{b.text}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity onPress={() => setSupplierStep(2)} style={{ backgroundColor: '#16A34A', padding: 18, borderRadius: 12, marginTop: 30, alignItems:'center' }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize:16 }}>Start Selling →</Text>
              </TouchableOpacity>
              <Text style={{fontSize:11, color:'gray', textAlign:'center', marginTop:10}}>{locationStatus} - {distanceKm||''} KM - 15KM Zone me fast selling</Text>
            </ScrollView>
          )}

          {supplierStep === 4 && (
            <View style={{flex:1, backgroundColor:'white'}}>
              <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{paddingBottom: 20}}>
                <Text style={{ fontWeight:'bold', fontSize:18 }}>🛍️ Gallery se 7 Photo - 15KM</Text>
                <Text style={{fontSize:11, color: isInRadius? '#16A34A' : 'red', fontWeight:'bold'}}>{locationStatus}</Text>
                <TextInput placeholder="Product Ka Naam *" style={styles.sellerInput} value={newProdName} onChangeText={setNewProdName} />
                <TextInput placeholder="Category * (Ex: Watches)" style={styles.sellerInput} value={newProdCat} onChangeText={setNewProdCat} />
                <TextInput placeholder="Price * (Ex: 277)" keyboardType="number-pad" style={styles.sellerInput} value={newProdPrice} onChangeText={setNewProdPrice} />
                <TextInput placeholder="MRP (Ex: 1099)" keyboardType="number-pad" style={styles.sellerInput} value={newProdMrp} onChangeText={setNewProdMrp} />
                <Text style={{fontWeight:'bold', marginTop:15}}>📏 Size Type</Text>
                {Object.keys(SIZE_OPTIONS).map(type=>(
                  <TouchableOpacity key={type} onPress={()=> setNewProdSizeType(type)} style={{flexDirection:'row', alignItems:'center', padding:12, borderWidth:1, borderColor: newProdSizeType===type? '#ff6f00' : '#ddd', backgroundColor: newProdSizeType===type? '#FFF7ED' : 'white', borderRadius:8, marginTop:8}}>
                    <View style={{width:18, height:18, borderRadius:9, borderWidth:1.5, borderColor: newProdSizeType===type? '#ff6f00' : 'gray', alignItems:'center', justifyContent:'center'}}>{newProdSizeType===type && <View style={{width:10, height:10, borderRadius:5, backgroundColor:'#ff6f00'}}/>}</View>
                    <Text style={{marginLeft:10, flex:1, fontSize:12}}>{type} - {SIZE_OPTIONS[type].join(', ')}</Text>
                  </TouchableOpacity>
                ))}
                <Text style={{fontWeight:'bold', marginTop:15}}>📸 Gallery se 7 Photo 📸</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap', marginTop:10}}>
                  {[
                    {label:'Photo 1 * Main', val:newProdImg1, set:setNewProdImg1},
                    {label:'Photo 2', val:newProdImg2, set:setNewProdImg2},
                    {label:'Photo 3', val:newProdImg3, set:setNewProdImg3},
                    {label:'Photo 4', val:newProdImg4, set:setNewProdImg4},
                    {label:'Photo 5', val:newProdImg5, set:setNewProdImg5},
                    {label:'Photo 6', val:newProdImg6, set:setNewProdImg6},
                    {label:'Photo 7', val:newProdImg7, set:setNewProdImg7},
                  ].map((it,i)=>(
                    <TouchableOpacity key={i} onPress={()=> pickImage(it.set)} style={{width:(width-70)/3, height:110, borderWidth:1.5, borderColor: it.val? '#16A34A' : '#ddd', borderStyle: it.val? 'solid' : 'dashed', borderRadius:10, margin:5, alignItems:'center', justifyContent:'center', backgroundColor: it.val? 'white' : '#f9f9f9'}}>
                      {it.val? <Image source={{uri: it.val}} style={{width:'100%', height:'100%', borderRadius:9}}/> : <View style={{alignItems:'center'}}><Ionicons name="camera" size={26} color="#999"/><Text style={{fontSize:9, fontWeight:'bold', marginTop:2}}>{it.label}</Text><Text style={{fontSize:8, color:'#ff6f00', fontWeight:'bold'}}>+ Gallery</Text></View>}
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={{marginTop:10, color:'#16A34A', fontWeight:'bold'}}>{[newProdImg1,newProdImg2,newProdImg3,newProdImg4,newProdImg5,newProdImg6,newProdImg7].filter(Boolean).length} Photo Selected ✓ - {getDiscount(parseInt(newProdPrice||0), parseInt(newProdMrp||0))}% OFF Auto</Text>
              </ScrollView>
              <View style={{padding: 15, backgroundColor:'white', borderTopWidth:1, borderColor:'#eee', paddingBottom: 45}}>
                <TouchableOpacity onPress={() => {
                  const allImgs = [newProdImg1, newProdImg2, newProdImg3, newProdImg4, newProdImg5, newProdImg6, newProdImg7].filter(i=> i && i.length>5);
                  if(!newProdName ||!newProdPrice || allImgs.length===0 ||!newProdCat) return Alert.alert("Naam, Category, Price, 1 Photo chuno");
                  const sizes = SIZE_OPTIONS[newProdSizeType];
                  const shopToUse = currentShop? currentShop.shopName : shopName;
                  const newP = { id: Date.now(), name: newProdName, price: parseInt(newProdPrice), mrp: newProdMrp? parseInt(newProdMrp) : parseInt(newProdPrice)+400, category: newProdCat, img: allImgs[0], images: allImgs, sizes: sizes, sizeType: newProdSizeType, rating: "4.3", reviews: "1", delivery: "Free Delivery", shopName: shopToUse, returnDays: 7, reviewList: [] };
                  saveProducts([newP,...products]);
                  setNewProdName(''); setNewProdPrice(''); setNewProdMrp(''); setNewProdCat(''); setNewProdImg1(''); setNewProdImg2(''); setNewProdImg3(''); setNewProdImg4(''); setNewProdImg5(''); setNewProdImg6(''); setNewProdImg7('');
                  Alert.alert("Product Add! "+allImgs.length+" Photos - "+getDiscount(newP.price,newP.mrp)+"% OFF");
                  setShowSupplierFlow(false); setTab('home');
                }} style={{ backgroundColor: '#16A34A', padding: 18, borderRadius: 12, alignItems:'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize:16 }}>✅ Add Karo - {[newProdImg1,newProdImg2,newProdImg3,newProdImg4,newProdImg5,newProdImg6,newProdImg7].filter(Boolean).length} Photos</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {supplierStep!==4 && supplierStep!==1 && (
            <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{paddingBottom: 120}}>
              {supplierStep===2 && <View><Text style={{fontWeight:'bold', fontSize:16, textAlign:'center', marginBottom:10}}>Dukaan Details - {locationStatus}</Text><TextInput placeholder="Dukaan Ka Naam - Ex: Rajvanshi All Trending" style={styles.sellerInput} value={shopName} onChangeText={setShopName} /><TextInput placeholder="Maalik Ka Naam - Ex: Akshay Raj" style={styles.sellerInput} value={ownerName} onChangeText={setOwnerName} /><TextInput placeholder="Mobile - Ex: 9118250717" keyboardType="phone-pad" maxLength={10} style={styles.sellerInput} value={shopMobile} onChangeText={setShopMobile} /><TextInput placeholder="Pata - Ex: All Viral Products" style={styles.sellerInput} value={shopAddress} onChangeText={setShopAddress} /><TextInput placeholder="Category - Ex: Watches, Kurtis" style={styles.sellerInput} value={shopCategoryCustom} onChangeText={setShopCategoryCustom} /><TextInput placeholder="Aadhar 12 digit" keyboardType="number-pad" maxLength={12} style={styles.sellerInput} value={aadhar} onChangeText={setAadhar} /><TextInput placeholder="PAN" style={styles.sellerInput} value={pan} onChangeText={setPan} /><TouchableOpacity onPress={() => { if (!shopName ||!ownerName ||!shopMobile ||!shopAddress ||!shopCategoryCustom ||!aadhar ||!pan) return Alert.alert("Sab bharo"); if (aadhar.length!== 12) return Alert.alert("Aadhar 12 digit"); const newShop = { id: Date.now(), shopName, ownerName, mobile: shopMobile, address: shopAddress, category: shopCategoryCustom, aadhar, pan, lat: userLocation?.latitude, lon: userLocation?.longitude, dist: distanceKm }; const fullSellerMsg = "NEW SELLER 15KM: "+shopName+" | "+ownerName+" | "+shopMobile+" | "+shopAddress+" | Cat:"+shopCategoryCustom+" | Dist:"+distanceKm+" KM | "+locationStatus+" | GPS:"+ (userLocation? userLocation.latitude+","+userLocation.longitude : ""); Linking.openURL("https://wa.me/919235711539?text="+encodeURIComponent(fullSellerMsg)); saveShops([...shops, newShop]); saveCurrentShop(newShop); setSupplierStep(3); }} style={{ backgroundColor: '#16A34A', padding: 16, borderRadius: 10, marginTop: 25 }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>OTP Bhejo → Start Selling</Text></TouchableOpacity></View>}
              {supplierStep===3 && <View style={{alignItems:'center'}}><View style={{ backgroundColor: '#16A34A', width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginTop: 30 }}><Ionicons name="checkmark" size={40} color="white" /></View><Text style={{ fontSize: 26, fontWeight: 'bold', color: '#065F46', marginTop: 15 }}>Mubarak Ho! 🎉</Text><Text style={{fontSize:13, fontWeight:'bold', marginTop:5}}>Meri Dukaan - {shopName}</Text><Text style={{fontSize:12, color:'gray', marginTop:5, textAlign:'center'}}>{locationStatus} - Ab aap bech sakte ho{"\n"}Account me jaake dekho - Meri Dukaan card aa gaya hai!</Text><TouchableOpacity onPress={() => setSupplierStep(4)} style={{ backgroundColor: '#ff6f00', padding: 16, borderRadius: 10, marginTop: 20, width: '100%' }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>+ Naya Product Add Karo (7 Photo) →</Text></TouchableOpacity><TouchableOpacity onPress={()=> { setShowSupplierFlow(false); setTab('account'); }} style={{ backgroundColor: '#111', padding: 14, borderRadius: 10, marginTop: 12, width: '100%' }}><Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Account Me Meri Dukaan Dekho →</Text></TouchableOpacity></View>}
            </ScrollView>
          )}
        </View>
      )}
      <Modal visible={showCheckout} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 45, padding: 15, borderBottomWidth:1, borderColor:'#eee' }}>
            <TouchableOpacity onPress={() => setShowCheckout(false)}><Ionicons name="arrow-back" size={26} color="black" /></TouchableOpacity><Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 12 }}>Delivery - 15KM - {distanceKm||'--'} KM</Text>
          </View>
          <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{paddingBottom: 120}}>
            <View style={{padding:10, backgroundColor: isInRadius? '#F0FFF4' : '#FFF0F0', borderRadius:8, borderWidth:1, borderColor: isInRadius? '#16A34A' : 'red', marginBottom:12}}><Text style={{fontWeight:'bold', color: isInRadius? '#16A34A' : 'red'}}>{locationStatus}</Text><Text style={{fontSize:11, color:'gray'}}>Radius: {RADIUS_KM} KM - Sitapur Center - Discount Auto</Text></View>
            <TextInput placeholder="Apna Naam *" style={styles.sellerInput} value={customerName} onChangeText={setCustomerName} />
            <TextInput placeholder="Mobile 10 digit *" keyboardType="phone-pad" maxLength={10} style={styles.sellerInput} value={customerMobile} onChangeText={setCustomerMobile} />
            <TextInput placeholder="Pura Address *" style={[styles.sellerInput, { height: 90, textAlignVertical:'top' }]} multiline value={customerAddress} onChangeText={setCustomerAddress} />
            <TextInput placeholder="Pincode - 261001" keyboardType="number-pad" maxLength={6} style={styles.sellerInput} value={customerPincode} onChangeText={setCustomerPincode} />
            {customerPincode.length===6 && (()=>{ const info=getDeliveryInfo(customerPincode); return <View style={{marginTop:10, padding:12, backgroundColor: info.color+'20', borderRadius:8, borderWidth:1, borderColor: info.color}}><Text style={{fontWeight:'bold', color: info.color}}>🚚 {info.text} - {info.sub}</Text></View> })()}
            <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10 }}>
              <Text style={{fontWeight:'bold'}}>Items - Discount ke saath:</Text>
              {cart.map((c,i)=><Text key={i} style={{fontSize:11, marginTop:4}}>• {c.name} | Size:{c.selectedSize} x{c.qty} = Rs{c.price*c.qty} ({getDiscount(c.price,c.mrp)}% OFF)</Text>)}
              <Text style={{fontWeight:'bold', marginTop:10}}>Payable: Rs {cart.reduce((s,i)=> s+i.price*i.qty,0)} | {distanceKm||'--'} KM</Text>
            </View>
            <TouchableOpacity onPress={placeOrder} style={[styles.sendBtn, {backgroundColor:'#16A34A', marginTop:20}]}><Text style={styles.sendBtnText}>Confirm Order - {distanceKm||''} KM - WhatsApp ✓</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      {showSplash && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: width, height: height, zIndex: 10000, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={{ uri: LOGO_URL }} style={{ width: 260, height: 260 }} resizeMode="contain" />
          <Text style={{ marginTop: 15, fontSize: 32, fontWeight: 'bold', color: '#ff6f00' }}>UpBazaar</Text>
          <Text style={{ marginTop: 8, fontSize: 12, color: 'gray' }}>15KM + Meri Dukaan + Gallery + No Reset ✅</Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 45, paddingBottom: 12, paddingHorizontal: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  catChip: { alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 10, marginRight: 10, width: 80, borderWidth: 1, borderColor: '#eee' },
  catChipActive: { borderColor: '#ff6f00', backgroundColor: '#FFF7ED' },
  catText: { fontSize: 10, textAlign: 'center', marginTop: 4 },
  banner: { height: 120, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  bannerSub: { color: 'white', fontSize: 12, marginTop: 4, opacity: 0.9 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ccc', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#ff6f00', width: 20 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 6, paddingBottom: 20 },
  productCard: { width: (width - 24) / 2, backgroundColor: 'white', borderRadius: 10, padding: 8, margin: 6, borderWidth: 1, borderColor: '#eee' },
  productImg: { width: '100%', height: 160, borderRadius: 8, backgroundColor: '#f0f0f0' },
  pName: { fontSize: 12, marginTop: 6, height: 32 },
  pPrice: { fontWeight: 'bold', fontSize: 14 },
  pMrp: { color: 'gray', fontWeight: 'normal', textDecorationLine: 'line-through', fontSize: 11, marginLeft: 6 },
  orderCard: { backgroundColor: 'white', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
  smallBtnText: { color: 'white', fontWeight: 'bold', fontSize: 11 },
  sendBtn: { backgroundColor: '#ff6f00', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  sendBtnText: { color: 'white', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, paddingBottom: 30, height: 75, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 },
  navItem: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 11, marginTop: 3, color: 'gray', fontWeight: '600' },
  badge: { position: 'absolute', top: -6, right: -8, backgroundColor: 'red', borderRadius: 10, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  accountItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', gap: 12, marginHorizontal:12, backgroundColor:'white' },
  accountText: { flex: 1, fontSize: 14 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: 'white', borderRadius: 12, padding: 20 },
  sellerInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginTop: 12, backgroundColor: 'white' },
  cartItem: { flexDirection: 'row', backgroundColor: 'white', padding: 10, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
});
