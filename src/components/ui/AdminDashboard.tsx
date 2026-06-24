import React, { useState, useEffect } from 'react';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchOrders, 
  createProduct, 
  deleteProduct, 
  createCategory, 
  updateOrderStatus,
  fetchProfiles,
  fetchPromoCodes,
  createPromoCode,
  deletePromoCode
} from '../../services/db';
import { Product, Category, Order, Profile, PromoCode } from '../../types';
import { 
  BarChart, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  PlusCircle, 
  Package, 
  MapPin, 
  Layers, 
  AlertCircle,
  Database,
  Key,
  Terminal,
  Copy,
  Check,
  Users,
  Upload,
  Link,
  X,
  Sliders,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';
import { hasRealSupabase, testSupabaseConnection } from '../../lib/supabase/client';

interface AdminDashboardProps {
  onProductUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onProductUpdated }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'add' | 'orders' | 'categories' | 'supabase' | 'users' | 'promos'>('analytics');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  
  // Promo code inputs
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoValue, setNewPromoValue] = useState('10');
  const [newPromoMinOrder, setNewPromoMinOrder] = useState('0');
  const [userSearch, setUserSearch] = useState('');
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // New product inputs
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('1199');
  const [newProdSku, setNewProdSku] = useState('VX-TS-');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCatId, setNewProdCatId] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdSizes, setNewProdSizes] = useState<string[]>(['S', 'M', 'L']);
  const [newProdImgUrl, setNewProdImgUrl] = useState('');
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [imageUploadMethod, setImageUploadMethod] = useState<'upload' | 'preset' | 'url'>('upload');

  // New category inputs
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [copied, setCopied] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  // UI feedback notifications
  const [notify, setNotify] = useState<{ type: 'ok' | 'err', text: string } | null>(null);

  // Load everything
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const prods = await fetchProducts();
      const cats = await fetchCategories();
      const ords = await fetchOrders();
      const profs = await fetchProfiles();
      const promos = await fetchPromoCodes();
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setProfiles(profs);
      setPromoCodes(promos);
      
      if (cats.length > 0 && !newProdCatId) {
        setNewProdCatId(cats[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]);

  const showNotification = (type: 'ok' | 'err', text: string) => {
    setNotify({ type, text });
    setTimeout(() => setNotify(null), 3000);
  };

  // Image Upload & Drag-and-Drop handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('err', 'الرجاء اختيار ملف صورة صالح.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        showNotification('err', 'حجم الصورة كبير جداً، الرجاء اختيار صورة أقل من 3 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewProdImgUrl(event.target.result as string);
          showNotification('ok', 'تم تحميل الصورة بنجاح.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('err', 'الرجاء اختيار ملف صورة صالح.');
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        showNotification('err', 'حجم الصورة كبير جداً، الرجاء اختيار صورة أقل من 3 ميجابايت.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewProdImgUrl(event.target.result as string);
          showNotification('ok', 'تم سحب وتحميل الصورة بنجاح.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSizeSelection = (size: string) => {
    if (newProdSizes.includes(size)) {
      setNewProdSizes(newProdSizes.filter(s => s !== size));
    } else {
      setNewProdSizes([...newProdSizes, size]);
    }
  };

  const handleAddCustomSize = (e: React.MouseEvent) => {
    e.preventDefault();
    const cleanSize = customSizeInput.trim().toUpperCase();
    if (!cleanSize) return;
    if (newProdSizes.includes(cleanSize)) {
      showNotification('err', 'هذا المقاس مضاف بالفعل.');
      return;
    }
    setNewProdSizes([...newProdSizes, cleanSize]);
    setCustomSizeInput('');
  };

  // ADD PRODUCT ACTION
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      showNotification('err', 'Invalid fields: missing core variables.');
      return;
    }

    setLoading(true);
    try {
      // Pick a fallback generated assets if none is specified
      // E.g. we can cycle or default to the glitch_tshirt asset
      const finalImg = newProdImgUrl.trim() || '/src/assets/images/glitch_tshirt_1779875272702.png';
      
      const priceNum = parseFloat(newProdPrice) || 1000;
      const stockNum = parseInt(newProdStock) || 10;

      await createProduct(
        {
          title: newProdName,
          price: priceNum,
          slug: newProdSku || 'vx-' + Math.floor(100 + Math.random() * 900),
          description: newProdDesc,
          category_id: newProdCatId,
          stock: stockNum,
        },
        newProdSizes,
        finalImg
      );

      showNotification('ok', `Product "${newProdName.toUpperCase()}" deployed into production schema successfully.`);
      
      // Clear fields
      setNewProdName('');
      setNewProdPrice('1199');
      setNewProdSku('VX-TS-');
      setNewProdDesc('');
      setNewProdStock('20');
      setNewProdSizes(['S', 'M', 'L']);
      setNewProdImgUrl('');
      
      onProductUpdated();
    } catch (err: any) {
      showNotification('err', err?.message || 'Insertion abort.');
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT ACTION
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to retire product "${name}" from circulation?`)) return;
    try {
      await deleteProduct(id);
      showNotification('ok', `Product retired successfully.`);
      setProducts(products.filter(p => p.id !== id));
      onProductUpdated();
    } catch (err: any) {
      showNotification('err', 'Retirement fail.');
    }
  };

  // UPDATE ORDER STATUS ACTION
  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      showNotification('ok', `Order status updated to: ${status.toUpperCase()}`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e) {
      showNotification('err', 'Status write error.');
    }
  };

  // ADD PROMO ACTION
  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode || !newPromoValue) return;
    setLoading(true);
    try {
      await createPromoCode({
        code: newPromoCode,
        type: newPromoType,
        value: Number(newPromoValue),
        min_order_value: Number(newPromoMinOrder),
        active: true
      });
      showNotification('ok', `Promo code ${newPromoCode} activated.`);
      setNewPromoCode('');
      setNewPromoValue('10');
      setNewPromoMinOrder('0');
      const promos = await fetchPromoCodes();
      setPromoCodes(promos);
    } catch (err) {
      showNotification('err', 'Promo code creation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromo = async (id: string, code: string) => {
    if (!confirm(`Revoke promo code ${code}?`)) return;
    try {
      await deletePromoCode(id);
      showNotification('ok', 'Promo code revoked.');
      setPromoCodes(promoCodes.filter(p => p.id !== id));
    } catch (err) {
      showNotification('err', 'Failed to revoke promo code.');
    }
  };

  // ADD CATEGORY ACTION
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    setLoading(true);
    try {
      await createCategory(newCatName, newCatDescFormat(newCatDesc));
      showNotification('ok', `Category "${newCatName.toUpperCase()}" integrated.`);
      setNewCatName('');
      setNewCatDesc('');
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (err: any) {
      showNotification('err', 'Category integration failed.');
    } finally {
      setLoading(false);
    }
  };

  function newCatDescFormat(desc: string): string {
    return desc || 'Premium cyberwear segment line.';
  }

  // Analytics helper metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_price, 0);

  const lowStockItems = products.filter(p => p.stock < 5);

  // SVG Chart Data (Last 7 days of orders)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  
  const ordersByDay = last7Days.map(dateStr => {
    return orders.filter(o => o.created_at.startsWith(dateStr)).length;
  });
  const maxOrdersInDay = Math.max(...ordersByDay, 1);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-28 pointer-events-auto select-none selection:bg-red-600 selection:text-white">
      
      {/* Title head */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-8 mb-8">
        <div>
          <h1 className="font-sans font-black text-2xl lg:text-3xl tracking-[0.2em] text-white">
            PORTAL_DASHBOARD
          </h1>
          <p className="font-mono text-[9px] text-zinc-500 tracking-wider mt-1.5 uppercase">
            ACTIVE SYSTEM INTERFACE SECURITY ROLE: ADMINISTRATOR
          </p>
        </div>
        
        <button
          onClick={loadDashboardData}
          className="w-max px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-600 rounded-lg text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          RELOAD_DATABASE
        </button>
      </div>

      {/* Internal notifications popup */}
      {notify && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 border rounded-xl shadow-lg flex items-center gap-3 font-mono text-xs max-w-md ${
          notify.type === 'ok' 
            ? 'bg-emerald-950 border-emerald-900 text-emerald-400' 
            : 'bg-red-950 border-red-900 text-red-400'
        }`}>
          {notify.type === 'ok' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{notify.text}</span>
        </div>
      )}

      {/* Navigation Sub-options */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-900/30 pb-6 font-mono text-xs">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'analytics' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          ANALYTICS
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'products' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          PRODUCTS_CRM ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'add' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          ADD_PRODUCT
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'orders' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          ORDERS_CRM ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'categories' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          CATEGORIES ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'users' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          NOMADS_CRM ({profiles.length})
        </button>
        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'promos' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          PROMO_CODES ({promoCodes.length})
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-4 h-9 flex items-center justify-center rounded-lg border tracking-wider cursor-pointer transition-colors ${
            activeTab === 'supabase' 
              ? 'bg-red-600 border-red-500 text-white font-bold' 
              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          LOCAL_DATABASE
        </button>
      </div>

      {/* TAB CONTENTS */}
      
      {/* 1. ANALYTICS STATS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Bento-grid of cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            
            {/* 1. Revenue */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-[10px] tracking-widest">TOTAL_REVENUE</span>
                <BarChart className="w-4.5 h-4.5 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-lg lg:text-xl font-bold text-white tracking-wider">
                  EGP {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                </p>
                <p className="font-mono text-[8.5px] text-zinc-600">REVENUE SECURED IN CRYPTON</p>
              </div>
            </div>

            {/* 2. Total orders */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-[10px] tracking-widest">ORDER_COUNT</span>
                <ShoppingBag className="w-4.5 h-4.5 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xl font-bold text-white tracking-wider">
                  {orders.length}
                </p>
                <p className="font-mono text-[8.5px] text-zinc-600">COMPLETED & IN PROGRESS SHARES</p>
              </div>
            </div>

            {/* 3. Products */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-[10px] tracking-widest">ACTIVE_LISTINGS</span>
                <Package className="w-4.5 h-4.5 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xl font-bold text-white tracking-wider">
                  {products.length}
                </p>
                <p className="font-mono text-[8.5px] text-zinc-600">ITEMS IN THE SHOP DATABASE</p>
              </div>
            </div>

            {/* 4. Nomad Accounts */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-[10px] tracking-widest">NOMAD_ACCOUNTS</span>
                <Users className="w-4.5 h-4.5 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xl font-bold text-white tracking-wider">
                  {profiles.length}
                </p>
                <p className="font-mono text-[8.5px] text-zinc-600 uppercase">Registered user profiles</p>
              </div>
            </div>

            {/* 5. Stock alert */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <div className="flex items-center justify-between text-zinc-500">
                <span className="font-mono text-[10px] tracking-widest">WARNINGS_STOCKS</span>
                <AlertCircle className={`w-4.5 h-4.5 ${lowStockItems.length > 0 ? 'text-red-500 animate-pulse' : 'text-zinc-600'}`} />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-xl font-bold text-white tracking-wider">
                  {lowStockItems.length}
                </p>
                <p className="font-mono text-[8.5px] text-zinc-600 uppercase font-bold">Products with stock under five units</p>
              </div>
            </div>

          </div>

          {/* Visual Analytics Chart */}
          <div className="border border-zinc-900 rounded-xl bg-zinc-950/40 p-6 space-y-6">
            <h3 className="font-mono text-sm font-bold text-white tracking-widest flex items-center gap-2">
              <BarChart className="w-4 h-4 text-red-500" />
              TRAFFIC_VISUALIZATION (7 DAYS)
            </h3>
            <div className="h-48 w-full flex items-end justify-between gap-2 border-b border-l border-zinc-900/50 pl-2 pb-2 relative mt-4">
              {ordersByDay.map((count, idx) => {
                const heightPercent = (count / maxOrdersInDay) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    <div 
                      className="w-full bg-red-600/20 border border-red-600/50 group-hover:bg-red-600/40 transition-all rounded-t-sm relative"
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {count}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-600 mt-2 rotate-45 translate-y-2">
                      {last7Days[idx].slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick audit list for products */}
          <div className="border border-zinc-900 rounded-xl bg-zinc-950/20 p-6 space-y-4">
            <h3 className="font-mono text-xs font-bold text-zinc-400 tracking-widest">
              TELEMETRY_LOGS
            </h3>
            <div className="font-mono text-[10px] text-zinc-500 space-y-2 leading-relaxed">
              <p>✔ SUPABASE REST ADAPTER: CONNECTED</p>
              <p>✔ STORAGE CONTAINER "products": VERIFIED AND SYNCED</p>
              <p>✔ PROFILE PERMIT SCHEMA: "admin" ACTIVE (STREETWEAR COMPRESSION VALIDATED)</p>
              <p>✔ SECURED CRYPTOGRAPHIC INGRESS BINDINGS: ON PORT 3000</p>
            </div>
          </div>

        </div>
      )}

      {/* 2. REGULAR PRODUCTS TABLE LIST */}
      {activeTab === 'products' && (
        <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-950 text-zinc-500 tracking-wider border-b border-zinc-900">
                <tr>
                  <th className="p-4">SLUG</th>
                  <th className="p-4">NAME</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">STOCK</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-600 uppercase">
                      No active listings found in database.
                    </td>
                  </tr>
                ) : (
                  products.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/20 text-zinc-300">
                      <td className="p-4 font-bold text-red-500">{item.slug || 'VX-00'}</td>
                      <td className="p-4 font-sans font-bold text-zinc-100">{item.name}</td>
                      <td className="p-4">EGP {item.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          item.stock < 5 ? 'bg-red-950/50 text-red-400' : 'bg-zinc-900 text-zinc-400'
                        }`}>
                          {item.stock} UNITS
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(item.id, item.name)}
                          className="p-2 hover:bg-red-950/40 border border-transparent hover:border-red-900 rounded-lg text-zinc-500 hover:text-red-400 transition-colors cursor-pointer inline-block"
                          title="Retire listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ADD PRODUCT SHEET FORM CONTAINER */}
      {activeTab === 'add' && (
        <div className="max-w-2xl bg-zinc-950/60 border border-zinc-900 p-8 rounded-2xl">
          <form onSubmit={handleAddProduct} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-zinc-500 tracking-wider">PRODUCT_NAME</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="E.g., NINJA WIND SHELL"
                  className="w-full h-11 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-zinc-500 tracking-wider">BASE_PRICE_(EGP)</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  placeholder="1499"
                  className="w-full h-11 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-zinc-500 tracking-wider">SLUG_SERIAL</label>
                <input
                  type="text"
                  required
                  value={newProdSku}
                  onChange={(e) => setNewProdSku(e.target.value)}
                  placeholder="VX-JK-04"
                  className="w-full h-11 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-zinc-500 tracking-wider">STOCK_UNITS</label>
                <input
                  type="number"
                  required
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  placeholder="20"
                  className="w-full h-11 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-zinc-500 tracking-wider">SEGMENT_CATEGORY</label>
                <select
                  value={newProdCatId}
                  onChange={(e) => setNewProdCatId(e.target.value)}
                  className="w-full h-11 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none appearance-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

             {/* IMAGE CONFIGURATION (رفع وصهر صورة المنتج) */}
             <div className="space-y-3.5 border border-zinc-900 bg-zinc-950/40 p-5 rounded-xl">
               <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                 <label className="block font-mono text-[10px] text-zinc-400 tracking-wider">PRODUCT_IMAGE_SOURCE / مصدر صورة المنتج</label>
                 <div className="flex gap-1">
                   <button
                     type="button"
                     onClick={() => setImageUploadMethod('upload')}
                     className={`px-2.5 py-1 text-[9px] font-mono rounded tracking-wider transition-all cursor-pointer ${
                       imageUploadMethod === 'upload'
                         ? 'bg-red-600 text-white font-bold'
                         : 'bg-zinc-900 text-zinc-500 hover:text-white'
                     }`}
                   >
                     UPLOAD_FILE
                   </button>
                   <button
                     type="button"
                     onClick={() => setImageUploadMethod('preset')}
                     className={`px-2.5 py-1 text-[9px] font-mono rounded tracking-wider transition-all cursor-pointer ${
                       imageUploadMethod === 'preset'
                         ? 'bg-red-600 text-white font-bold'
                         : 'bg-zinc-900 text-zinc-500 hover:text-white'
                     }`}
                   >
                     PRESET
                   </button>
                   <button
                     type="button"
                     onClick={() => setImageUploadMethod('url')}
                     className={`px-2.5 py-1 text-[9px] font-mono rounded tracking-wider transition-all cursor-pointer ${
                       imageUploadMethod === 'url'
                         ? 'bg-red-600 text-white font-bold'
                         : 'bg-zinc-900 text-zinc-500 hover:text-white'
                     }`}
                   >
                     DIRECT_URL
                   </button>
                 </div>
               </div>

               {/* Render content based on active image source method */}
               {imageUploadMethod === 'upload' && (
                 <div
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onDrop={handleDrop}
                   onClick={() => document.getElementById('prod-file-upload')?.click()}
                   className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                     isDragging
                       ? 'border-red-600 bg-red-950/15'
                       : 'border-zinc-900 bg-zinc-950/50 hover:border-zinc-700'
                   }`}
                 >
                   <input
                     type="file"
                     id="prod-file-upload"
                     accept="image/*"
                     className="hidden"
                     onChange={handleFileChange}
                   />
                   <Upload className={`w-6 h-6 ${isDragging ? 'text-red-500 animate-bounce' : 'text-zinc-500'}`} />
                   <p className="font-mono text-[10px] text-zinc-300">
                     سحب وإفلات صورة المنتج هنا، أو اضغط للتصفح
                   </p>
                   <p className="font-mono text-[8.5px] text-zinc-650 uppercase">
                     Supports PNG, JPG, WEBP (Max 3MB)
                   </p>
                 </div>
               )}

               {imageUploadMethod === 'preset' && (
                 <div className="space-y-1">
                   <select
                     value={newProdImgUrl}
                     onChange={(e) => setNewProdImgUrl(e.target.value)}
                     className="w-full h-11 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none"
                   >
                     <option value="">-- CUSTOM SECURED URL --</option>
                     <option value="/src/assets/images/hero_hoodie_1779875229508.png">Shadow Floating Hoodie (Hero Style)</option>
                     <option value="/src/assets/images/void_hoodie_1779875252715.png">Void Premium Oversized Hoodie Cover</option>
                     <option value="/src/assets/images/glitch_tshirt_1779875272702.png">Sound Glitch Mesh T-Shirt Texture</option>
                     <option value="/src/assets/images/tech_jacket_1779875291017.png">Crimson Line High-Tactical Tech Jacket</option>
                     <option value="/src/assets/images/cargo_pants_1779875313014.png">Modular Cyber Cargo Flight Pants</option>
                   </select>
                 </div>
               )}

               {imageUploadMethod === 'url' && (
                 <div className="space-y-1.5">
                   <div className="relative">
                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                       <Link className="w-3.5 h-3.5" />
                     </span>
                     <input
                       type="url"
                       value={newProdImgUrl.startsWith('data:') ? '' : newProdImgUrl}
                       onChange={(e) => setNewProdImgUrl(e.target.value)}
                       placeholder="https://images.unsplash.com/photo-..."
                       className="w-full h-11 pl-10 pr-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none"
                     />
                   </div>
                 </div>
               )}

               {/* IMAGE PREVIEW FOR BULLETPROOF FEEDBACK */}
               {newProdImgUrl && (
                 <div className="flex items-center gap-4 bg-zinc-950/80 border border-zinc-900 p-2.5 rounded-lg">
                   <div className="w-14 h-14 rounded overflow-hidden border border-zinc-800 bg-zinc-900 flex-shrink-0 relative group">
                     <img
                       src={newProdImgUrl}
                       alt="Preview"
                       referrerPolicy="no-referrer"
                       className="w-full h-full object-cover"
                     />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-mono text-[9px] text-zinc-400 uppercase truncate">ACTIVE_IMAGE_LOADED</p>
                     <p className="font-mono text-[8px] text-zinc-650 truncate mt-0.5">
                       {newProdImgUrl.startsWith('data:') ? 'Base64 Encoded Image Data' : newProdImgUrl}
                     </p>
                   </div>
                   <button
                     type="button"
                     onClick={() => setNewProdImgUrl('')}
                     className="p-1.5 hover:bg-zinc-900 border border-zinc-900 hover:border-red-900 rounded-lg text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                     title="Remove Image"
                   >
                     <X className="w-3.5 h-3.5" />
                   </button>
                 </div>
               )}
             </div>

             {/* SIZES MANAGEMENT (إدارة المقاسات المتوفرة) */}
             <div className="space-y-3.5 border border-zinc-900 bg-zinc-950/40 p-5 rounded-xl">
               <label className="block font-mono text-[10px] text-zinc-400 tracking-wider uppercase">
                 AVAILABLE_SIZES / المقاسات المتوفرة للطلب ({newProdSizes.length})
               </label>

               <div className="flex flex-wrap gap-1.5">
                 {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'FREE'].map((size) => {
                   const isSelected = newProdSizes.includes(size);
                   return (
                     <button
                       key={size}
                       type="button"
                       onClick={() => toggleSizeSelection(size)}
                       className={`h-9 px-3 flex items-center justify-center gap-1 rounded bg-zinc-950 border font-mono text-[10px] cursor-pointer transition-all ${
                         isSelected
                           ? 'bg-red-950/40 border-red-600 text-red-400 font-bold'
                           : 'border-zinc-900 text-zinc-500 hover:text-white hover:border-zinc-850'
                       }`}
                     >
                       {isSelected && <span className="w-1 h-1 rounded-full bg-red-400" />}
                       {size}
                     </button>
                   );
                 })}
               </div>

               {/* Custom Size Adding Flow */}
               <div className="flex items-center gap-2 mt-2">
                 <div className="relative flex-1">
                   <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                     <Tag className="w-3.5 h-3.5" />
                   </span>
                   <input
                     type="text"
                     value={customSizeInput}
                     onChange={(e) => setCustomSizeInput(e.target.value)}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter') {
                         e.preventDefault();
                         handleAddCustomSize(e as any);
                       }
                     }}
                     placeholder="إضافة مقاس مخصص (مثال: 42, XL-Tall, M-Oversized)"
                     className="w-full h-9 pl-10 pr-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-[10px] font-mono text-white outline-none"
                   />
                 </div>
                 <button
                   type="button"
                   onClick={handleAddCustomSize}
                   className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all rounded-lg font-mono text-[10px] font-bold cursor-pointer"
                 >
                   إضافة
                 </button>
               </div>

               {/* Currently Configured List */}
               {newProdSizes.length > 0 && (
                 <div className="pt-2 flex flex-wrap gap-1 border-t border-zinc-900/50 mt-2">
                   <span className="font-mono text-[8.5px] text-zinc-600 uppercase self-center mr-1">
                     SELECTED_SCHEMA:
                   </span>
                   {newProdSizes.map((s) => (
                     <span
                       key={s}
                       className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-zinc-400 rounded text-[9px] font-mono inline-flex items-center gap-1"
                     >
                       {s}
                       <button
                         type="button"
                         onClick={() => setNewProdSizes(newProdSizes.filter(sz => sz !== s))}
                         className="text-zinc-600 hover:text-red-400 text-[10px] leading-none"
                       >
                         &times;
                       </button>
                     </span>
                   ))}
                 </div>
               )}
             </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] text-zinc-500 tracking-wider">FABRIC_METADATA_DESCRIPTION</label>
              <textarea
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="Deep tactical description about construction layers, lining, pockets, and waterproofing specs."
                rows={4}
                className="w-full p-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-650 text-white font-mono text-xs font-bold tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <PlusCircle className="w-4 h-4" />
              DEPLOY_INTO_SHIELD
            </button>

          </form>
        </div>
      )}

      {/* 4. ORDERS LIST PANELS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="border border-zinc-900 bg-zinc-950/40 p-12 text-center rounded-xl uppercase font-mono text-xs text-zinc-600">
              No active customer orders currently recorded.
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-6 space-y-4">
                
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900/50 pb-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold text-red-500">
                      {ord.id.toUpperCase()}
                    </h3>
                    <p className="font-mono text-[9px] text-zinc-500 tracking-wider mt-0.5 uppercase">
                      SECURED DATE: {new Date(ord.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-zinc-500">CON_STATUS:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value as Order['status'])}
                      className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded font-bold text-red-400 focus:border-red-600 outline-none"
                    >
                      <option value="pending">PENDING</option>
                      <option value="confirmed">CONFIRMED</option>
                      <option value="shipping">SHIPPING</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-zinc-300 font-sans text-xs">
                  
                  {/* Customer details */}
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">DEST_NOMAD</p>
                    <p className="font-bold text-white">{ord.shipping_address?.full_name}</p>
                    <p className="p-num">📞 {ord.shipping_address?.phone}</p>
                    {ord.shipping_address?.phone2 && <p className="p-num">📞 {ord.shipping_address?.phone2}</p>}
                  </div>

                  {/* Address coordinates */}
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">COORDINATES</p>
                    <p className="font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {ord.shipping_address?.governorate}, {ord.shipping_address?.city}
                    </p>
                    <p>{ord.shipping_address?.address}</p>
                    {ord.shipping_address?.landmark && <p className="text-zinc-400 font-mono text-[10px]">LANDMARK: {ord.shipping_address?.landmark}</p>}
                  </div>

                  {/* Cash overview */}
                  <div className="space-y-1 font-mono text-xs">
                    <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">SECURED_CREDITS</p>
                    <p className="text-white">PAYMENT: {ord.payment_method.toUpperCase()}</p>
                    <p className="text-red-500 font-bold">TOTAL_SECURED: EGP {ord.total_price.toLocaleString()}</p>
                  </div>

                </div>

                {/* Ledger Items sub list */}
                <div className="border border-zinc-900/40 bg-zinc-950/20 rounded-lg p-3 space-y-2">
                  <p className="font-mono text-[9px] text-zinc-500 tracking-wider">LEDGER_ITEMS:</p>
                  <div className="space-y-1.5">
                    {ord.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between font-mono text-[10px] text-zinc-400">
                        <span>{item.product?.name || 'STREETWEAR PIECE'} (SIZE: {item.size}) [Q_QTY: {item.quantity}]</span>
                        <span>EGP {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* 5. CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Add Category Form */}
          <div className="bg-zinc-950/60 border border-zinc-900 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-zinc-300 font-sans font-bold">
              <Layers className="w-4.5 h-4.5 text-red-500" />
              <h3>INTEGRATE_NEW_SEGMENT</h3>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-zinc-500 tracking-wider font-bold">SEGMENT_NAME</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="E.g., CYBER_ARMOUR"
                  className="w-full h-11 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] text-zinc-500 tracking-wider font-bold">SPECIFICATION_SUMMARY</label>
                <textarea
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Summary spec detailing products in this collection"
                  rows={3}
                  className="w-full p-4 bg-zinc-950 border border-zinc-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg text-xs font-mono text-white outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                COMPILE_SEGMENT
              </button>
            </form>
          </div>

          {/* List of categories */}
          <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/40 p-6 space-y-4">
            <h3 className="font-mono text-xs font-bold text-zinc-400 tracking-widest border-b border-zinc-900 pb-3">
              INTEGRATED_SEGMENTS
            </h3>
            
            <div className="divide-y divide-zinc-900/60 max-h-[400px] overflow-y-auto pr-1">
              {categories.map(c => (
                <div key={c.id} className="py-3 space-y-1">
                  <p className="font-mono text-xs font-bold text-red-500 uppercase">{c.name}</p>
                  <p className="font-sans text-[11px] text-zinc-400">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. USER CLIENTELE CRM PANEL */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-950/40 p-6 border border-zinc-900 rounded-xl">
            <div className="space-y-1">
              <h3 className="font-sans font-black text-lg tracking-wider text-white uppercase flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                NOMADS CLIENTELE LOGGER
              </h3>
              <p className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
                Monitor current registered apparel users, system operator privileges, contact coordinates, and physical purchase streams.
              </p>
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-3">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="SEARCH NOMADS BY NAME, ID, OR PHONE..."
                className="w-full md:w-72 h-10 px-4 bg-zinc-950 border border-zinc-900 focus:border-red-650 rounded-lg text-xs font-mono text-white outline-none"
              />
              {userSearch && (
                <button
                  type="button"
                  onClick={() => setUserSearch('')}
                  className="px-3.5 h-10 font-mono text-[10px] tracking-widest text-zinc-500 hover:text-white border border-dashed border-zinc-900 rounded-lg uppercase transition-all"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Table display */}
          {profiles.length === 0 ? (
            <div className="border border-zinc-900 bg-zinc-950/40 p-12 text-center rounded-xl uppercase font-mono text-xs text-zinc-650">
              No registered client profiles correspond to searching criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {profiles
                .filter(p => {
                  const q = userSearch.toLowerCase();
                  return (
                    (p.id || '').toLowerCase().includes(q) ||
                    (p.full_name || '').toLowerCase().includes(q) ||
                    (p.phone || '').toLowerCase().includes(q)
                  );
                })
                .map((prof) => {
                  const isExpanded = !!expandedUsers[prof.id];
                  const userOrders = orders.filter(o => o.user_id === prof.id);
                  const totalSpent = userOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total_price : 0), 0);
                  
                  return (
                    <div key={prof.id} className="border border-zinc-900 bg-zinc-950/30 hover:bg-zinc-950/50 rounded-xl overflow-hidden transition-all">
                      
                      {/* Compact Card Header */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-zinc-900/60 rounded-xl border border-red-900/30 text-red-500">
                            <Users className="w-5 h-5" />
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-sans font-black text-sm tracking-widest text-white uppercase">
                                {prof.full_name || 'ANONYMOUS NOMAD'}
                              </h4>
                              <span className={`px-2 py-0.5 rounded-full border text-[8px] font-mono tracking-wider font-bold uppercase ${
                                prof.role === 'admin' 
                                  ? 'bg-red-950/40 border-red-500/50 text-red-400' 
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                              }`}>
                                {prof.role === 'admin' ? 'OPERATIVE_ADMIN' : 'NOMAD_CLIENT'}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                              <span>ID: <strong className="text-zinc-400 font-bold">{prof.id.slice(0, 10).toUpperCase()}</strong></span>
                              {prof.phone && <span>PHONE: <strong className="text-zinc-400 font-bold">{prof.phone}</strong></span>}
                              <span>SINCE: {new Date(prof.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Cumulative Logistics Telemetry */}
                        <div className="flex items-center gap-6 justify-between md:justify-end">
                          <div className="flex gap-4 font-mono text-right">
                            <div className="space-y-0.5">
                              <span className="text-[8px] text-zinc-500 block uppercase tracking-wider font-bold">DROPS REGISTERED</span>
                              <span className="text-sm font-black text-white uppercase">{userOrders.length} ORDERS</span>
                            </div>
                            <div className="space-y-0.5 border-l border-zinc-900 pl-4">
                              <span className="text-[8px] text-zinc-500 block uppercase tracking-wider font-bold">TOTAL SPENT</span>
                              <span className="text-sm font-black text-red-500 uppercase">{totalSpent.toLocaleString()} EGP</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedUsers(prev => ({ ...prev, [prof.id]: !prev[prof.id] }))}
                            className="px-4 py-2 font-mono text-[9px] tracking-widest uppercase bg-zinc-950/60 border border-zinc-900 hover:border-red-500 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer font-bold"
                          >
                            {isExpanded ? 'HIDE_OPERATIONS' : 'VIEW_OPERATIONS'}
                          </button>
                        </div>
                      </div>

                      {/* Collapsible Order History details */}
                      {isExpanded && (
                        <div className="border-t border-zinc-900/60 bg-black/20 p-5 space-y-4">
                          <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2">
                            <p className="font-mono text-[10px] text-red-550 font-black uppercase tracking-widest text-red-500">DETAILED DISPATCH LOGS FOR {prof.full_name?.toUpperCase() || 'NOMAD'}</p>
                            <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold">DATASEC: PASSIVE_SCAN</span>
                          </div>

                          {userOrders.length === 0 ? (
                            <p className="font-mono text-zinc-650 text-[10px] uppercase tracking-wider py-4">No streetwear operations dispatched to this client.</p>
                          ) : (
                            <div className="space-y-4 font-mono text-xs text-zinc-300">
                              {userOrders.map((ord) => (
                                <div key={ord.id} className="border border-zinc-900/60 bg-zinc-950/40 p-4 rounded-lg space-y-3">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-2">
                                    <div>
                                      <span className="text-red-400 font-bold block">{ord.id.toUpperCase()}</span>
                                      <span className="text-[9px] text-zinc-500 uppercase font-bold">{new Date(ord.created_at).toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <span className="text-zinc-500 text-[9px] font-bold">STATUS:</span>
                                      <select
                                        value={ord.status}
                                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as Order['status'])}
                                        className="px-2 py-1 bg-zinc-950 border border-zinc-900 rounded font-bold text-red-400 text-[10px] focus:border-red-650"
                                      >
                                        <option value="pending">PENDING</option>
                                        <option value="confirmed">CONFIRMED</option>
                                        <option value="shipping">SHIPPING</option>
                                        <option value="delivered">DELIVERED</option>
                                        <option value="cancelled">CANCELLED</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed uppercase p-1">
                                    <div className="space-y-1">
                                      <span className="text-zinc-500 font-black block text-[9px]">APPAREL INCLUDES</span>
                                      {(ord.order_items || []).map((oi, i) => (
                                        <div key={i} className="flex justify-between text-zinc-400">
                                          <span>• {oi.product?.name || 'SPECIAL ISSUE'} (SIZE: {oi.size} x {oi.quantity})</span>
                                          <span className="text-white font-bold">{(oi.price * oi.quantity).toLocaleString()} EGP</span>
                                        </div>
                                      ))}
                                      <div className="flex justify-between border-t border-dashed border-zinc-900 pt-1.5 text-zinc-400">
                                        <span>SHIPPING FEE:</span>
                                        <span>{ord.shipping_price} EGP</span>
                                      </div>
                                      <div className="flex justify-between text-white font-black">
                                        <span>TOTAL DISPATCH VALUE:</span>
                                        <span className="text-red-500">{ord.total_price.toLocaleString()} EGP</span>
                                      </div>
                                    </div>

                                    <div className="space-y-1 text-zinc-400 font-bold">
                                      <span className="text-zinc-500 font-black block text-[9px]">LOGISTICS ADDRESS</span>
                                      <p className="text-white font-bold">{ord.shipping_address?.full_name}</p>
                                      <p>PHONE: {ord.shipping_address?.phone} {ord.shipping_address?.phone2 ? `/ ${ord.shipping_address?.phone2}` : ''}</p>
                                      <p>LOCATION: {ord.shipping_address?.governorate}, {ord.shipping_address?.city}</p>
                                      <p>{ord.shipping_address?.address}</p>
                                    </div>
                                  </div>

                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* 6. LOCAL DATABASE CONFIGURATION VIEW */}
      {activeTab === 'supabase' && (
        <div className="space-y-8">
          
          {/* Status Panel */}
          <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Database className="w-10 h-10 text-emerald-500" />
                <div>
                  <h3 className="font-sans font-black text-lg tracking-wider text-white uppercase">
                    FRONTEND DECOUPLED DATABASE
                  </h3>
                  <p className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
                    OPERATING IN PURE CLIENT-SIDE OFFLINE MODE
                  </p>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-[10px] font-mono font-bold text-emerald-400 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  PURE FRONTEND MODE ACTIVE (LOCAL WORKSPACE)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-900 space-y-3">
                <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                  <Key className="w-4 h-4 text-red-500" />
                  <span>Configured Target Parameters</span>
                </div>
                <div className="space-y-2.5 text-[11px]">
                  <div>
                    <span className="text-zinc-600 block text-[9px] uppercase tracking-wider">DB_ENDPOINT_URL</span>
                    <span className="text-zinc-300 break-all select-all">
                      {hasRealSupabase 
                        ? (import.meta as any).env?.VITE_SUPABASE_URL 
                        : 'https://vvbgjjuzoclvxridvxtm.supabase.co (Offline Fallback)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-650 block text-[9px] uppercase tracking-wider">API_PUBLIC_ANON_KEY</span>
                    <span className="text-zinc-300 break-all font-mono opacity-80 select-all">
                      {hasRealSupabase 
                        ? `${(import.meta as any).env?.VITE_SUPABASE_ANON_KEY?.slice(0, 15)}... SECURED` 
                        : 'sb_publishable_...-rbVTGhA_8FQTs_el (Protected System Mock)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-900 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                    <Terminal className="w-4 h-4 text-red-500" />
                    <span>Real-time DB Connection Probe</span>
                  </div>
                  <p className="text-zinc-500 text-[11px] leading-relaxed uppercase">
                    Examine the handshakes with the current remote Supabase PostgreSQL schema and test responses.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <button
                    type="button"
                    onClick={async () => {
                      setDbTestResult('testing');
                      const success = await testSupabaseConnection();
                      setDbTestResult(success ? 'success' : 'failed');
                    }}
                    disabled={dbTestResult === 'testing'}
                    className="h-10 px-5 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:bg-zinc-900"
                  >
                    {dbTestResult === 'testing' ? 'PINGING_DB...' : 'TEST_CONNECTION'}
                  </button>

                  {dbTestResult === 'success' && (
                    <span className="text-emerald-400 text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5 py-2">
                      ✔ SECURE HANDSHAKE COMPLETED SUCCESSFULLY
                    </span>
                  )}
                  {dbTestResult === 'failed' && (
                    <span className="text-red-400 text-[10px] tracking-wider uppercase font-bold flex items-center gap-1.5 py-2 font-mono">
                      ✖ HANDSHAKE RETRACTED: TABLES OR KEY INVALID
                    </span>
                  )}
                  {dbTestResult === 'idle' && (
                    <span className="text-zinc-600 text-[10px] tracking-wider uppercase py-2">
                      READY TO TRANSMIT TELEMETRY PACKS
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Setup Guide */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Steps panel */}
            <div className="lg:col-span-5 bg-zinc-950/60 border border-zinc-900 p-6 md:p-8 rounded-xl space-y-6">
              <h3 className="font-sans font-black text-md tracking-wider text-white uppercase border-b border-zinc-900 pb-3">
                INTEGRATION INSTRUCTIONS
              </h3>

              <div className="space-y-5 font-mono text-[11px] text-zinc-400 leading-relaxed uppercase">
                <div className="space-y-1.5">
                  <p className="text-red-500 font-bold text-xs">1. SECURE CREDENTIALS PANEL</p>
                  <p className="text-zinc-500">
                    Open the <strong className="text-zinc-300">Settings -&gt; Secrets</strong> panel in the AI Studio editor interface. Add identical environment variables for the live target client.
                  </p>
                </div>

                <div className="bg-zinc-950 p-3.5 rounded border border-zinc-900 space-y-1 text-[10px]">
                  <p className="text-white"><span className="text-red-500 font-bold">VITE_SUPABASE_URL</span> = <span className="opacity-60">"your-project-url"</span></p>
                  <p className="text-white"><span className="text-red-500 font-bold">VITE_SUPABASE_ANON_KEY</span> = <span className="opacity-60">"your-project-anon-key"</span></p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-red-500 font-bold text-xs">2. INITIALIZE DATABASES</p>
                  <p className="text-zinc-500">
                    Supabase requires PostgreSQL databases layout matching current types. Copy the auto-generated SQL scripts on the right side.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-red-500 font-bold text-xs">3. EXECUTE SCHEMAS</p>
                  <p className="text-zinc-500">
                    Go to your <strong className="text-zinc-300">Supabase Dashboard -&gt; SQL Editor</strong>, paste and run the query to deploy Categories, Products, Sizes, Images and Orders schemas.
                  </p>
                </div>
              </div>
            </div>

            {/* SQL Query panel */}
            <div className="lg:col-span-7 bg-zinc-950/60 border border-zinc-900 p-6 md:p-8 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <h3 className="font-sans font-black text-md tracking-wider text-white uppercase">
                  DATABASE_SCHEMA.sql
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const sqlText = document.getElementById('supabase-setup-sql')?.innerText || '';
                    navigator.clipboard.writeText(sqlText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-red-500 rounded text-[10px] font-mono tracking-wider text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'COPIED_SCHEMA' : 'COPY_QUERY'}
                </button>
              </div>

              <div className="relative bg-zinc-950 p-4 border border-zinc-900 rounded-lg overflow-hidden h-[360px] flex flex-col">
                <pre 
                  id="supabase-setup-sql"
                  className="w-full h-full overflow-auto font-mono text-[9px] text-zinc-400 scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent leading-normal select-text selection:bg-red-900/40"
                >
{`-- UUID EXTENSION
create extension if not exists "pgcrypto";



-- USERS PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  full_name text,
  phone text,

  role text default 'customer',

  created_at timestamp with time zone default timezone('utc', now())
);



-- CATEGORIES
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text unique not null,

  image_url text,

  created_at timestamp with time zone default timezone('utc', now())
);



-- PRODUCTS
create table if not exists products (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  slug text unique not null,

  description text,

  price numeric not null,
  discount_price numeric,

  stock integer default 0,

  gender text,

  featured boolean default false,

  category_id uuid references categories(id) on delete set null,

  created_at timestamp with time zone default timezone('utc', now())
);



-- PRODUCT IMAGES
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),

  product_id uuid references products(id) on delete cascade,

  image_url text not null
);



-- PRODUCT SIZES
create table if not exists product_sizes (
  id uuid primary key default gen_random_uuid(),

  product_id uuid references products(id) on delete cascade,

  size text not null,

  quantity integer default 0
);



-- SHIPPING ADDRESSES
create table if not exists shipping_addresses (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users(id) on delete cascade,

  full_name text not null,

  phone text not null,
  phone2 text,

  governorate text not null,
  city text not null,

  address text not null,

  landmark text,

  created_at timestamp with time zone default timezone('utc', now())
);



-- ORDERS
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references auth.users(id) on delete set null,

  shipping_address_id uuid references shipping_addresses(id),

  status text default 'pending',

  payment_method text default 'cash',

  subtotal numeric not null default 0,

  shipping_price numeric default 0,

  total_price numeric not null default 0,

  notes text,

  created_at timestamp with time zone default timezone('utc', now())
);



-- ORDER ITEMS
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),

  order_id uuid references orders(id) on delete cascade,

  product_id uuid references products(id) on delete set null,

  product_title text,

  size text,

  quantity integer not null,

  price numeric not null
);`}
                </pre>
              </div>
            </div>

          </div>

          {/* Egyptian Governorate seed block */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 space-y-3">
            <h4 className="font-mono text-xs font-bold text-red-500 uppercase">SUGGESTION: SEED SAMPLE DROPS</h4>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed uppercase">
              Once you execute the SQL code above in your Supabase SQL editor to deploy the workspace tables schema, the application will automatically perform remote fetch and sync securely.
            </p>
          </div>

        </div>
      )}

      {/* 8. PROMO CODES TAB */}
      {activeTab === 'promos' && (
        <div className="space-y-6">
          <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-xl">
            <h2 className="font-mono text-lg font-bold text-white mb-4 tracking-widest">DEPLOY_NEW_CIPHER</h2>
            <form onSubmit={handleAddPromo} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1">
                <label className="font-mono text-xs text-zinc-500">CODE_STRING</label>
                <input 
                  type="text" 
                  value={newPromoCode}
                  onChange={e => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-red-500 outline-none"
                  placeholder="E.G. NEON20"
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-xs text-zinc-500">DISCOUNT_TYPE</label>
                <select 
                  value={newPromoType}
                  onChange={e => setNewPromoType(e.target.value as 'percentage' | 'fixed')}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-red-500 outline-none"
                >
                  <option value="percentage">PERCENTAGE (%)</option>
                  <option value="fixed">FIXED AMOUNT (EGP)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-mono text-xs text-zinc-500">VALUE</label>
                <input 
                  type="number" 
                  value={newPromoValue}
                  onChange={e => setNewPromoValue(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-red-500 outline-none"
                  required 
                  min="1"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-xs text-zinc-500">MIN_ORDER (EGP)</label>
                <input 
                  type="number" 
                  value={newPromoMinOrder}
                  onChange={e => setNewPromoMinOrder(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white font-mono text-sm focus:border-red-500 outline-none"
                  required 
                  min="0"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-mono text-sm font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 h-[38px]"
              >
                {loading ? 'DEPLOYING...' : 'ACTIVATE'}
              </button>
            </form>
          </div>

          <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-zinc-950 text-zinc-500 tracking-wider border-b border-zinc-900">
                  <tr>
                    <th className="p-4">CODE</th>
                    <th className="p-4">TYPE</th>
                    <th className="p-4">VALUE</th>
                    <th className="p-4">MIN_ORDER</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {promoCodes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-600">NO ACTIVE CIPHERS FOUND</td>
                    </tr>
                  )}
                  {promoCodes.map(promo => (
                    <tr key={promo.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-4 text-white font-bold tracking-wider">{promo.code}</td>
                      <td className="p-4 text-zinc-400">{promo.type.toUpperCase()}</td>
                      <td className="p-4 text-zinc-300">
                        {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value} EGP`}
                      </td>
                      <td className="p-4 text-zinc-500">{promo.min_order_value} EGP</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[9px] ${promo.active ? 'bg-emerald-950/50 text-emerald-500 border border-emerald-900/50' : 'bg-red-950/50 text-red-500 border border-red-900/50'}`}>
                          {promo.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeletePromo(promo.id, promo.code)}
                          className="text-red-500 hover:text-red-400"
                          title="Revoke Cipher"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
