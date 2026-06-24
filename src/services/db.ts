import { supabase, hasRealSupabase } from '../lib/supabase/client';
import { Product, Category, Order, Profile, ShippingAddress, OrderItem, PromoCode } from '../types';

// Standard UUID v4 generation to match Supabase generic types
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Seed product metadata matching the mockup's exact prices, titles, and generated assets
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'VOID HOODIE',
    slug: 'void-hoodie',
    description: 'Cyberpunk oversized high-collar fleece-lined heavy cotton hoodie featuring matte tactical details, magnetic lock straps, and drop-shoulder ergonomic fit.',
    price: 1299.00,
    discount_price: null,
    category_id: 'cccc1111-1111-4111-8111-111111111111',
    stock: 12,
    gender: 'unisex',
    featured: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    product_images: [
      { id: '11111111-1111-4111-8111-999999999991', product_id: '11111111-1111-4111-8111-111111111111', image_url: '/images/void_hoodie_1779875252715.png' }
    ],
    product_sizes: [
      { id: '11111111-1111-4111-8111-888888888881', product_id: '11111111-1111-4111-8111-111111111111', size: 'S', quantity: 4 },
      { id: '11111111-1111-4111-8111-888888888882', product_id: '11111111-1111-4111-8111-111111111111', size: 'M', quantity: 5 },
      { id: '11111111-1111-4111-8111-888888888883', product_id: '11111111-1111-4111-8111-111111111111', size: 'L', quantity: 3 }
    ]
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'GLITCH T-SHIRT',
    slug: 'glitch-t-shirt',
    description: 'High-density techwear streetwear graphic tee on luxury combed cotton featuring luminescent soundwave glitch prints.',
    price: 899.00,
    discount_price: null,
    category_id: 'cccc2222-2222-4222-8222-222222222222',
    stock: 18,
    gender: 'unisex',
    featured: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    product_images: [
      { id: '22222222-2222-4222-8222-999999999991', product_id: '22222222-2222-4222-8222-222222222222', image_url: '/images/glitch_tshirt_1779875272702.png' }
    ],
    product_sizes: [
      { id: '22222222-2222-4222-8222-888888888881', product_id: '22222222-2222-4222-8222-222222222222', size: 'S', quantity: 6 },
      { id: '22222222-2222-4222-8222-888888888882', product_id: '22222222-2222-4222-8222-222222222222', size: 'M', quantity: 6 },
      { id: '22222222-2222-4222-8222-888888888883', product_id: '22222222-2222-4222-8222-222222222222', size: 'L', quantity: 6 }
    ]
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    title: 'SHADOW HOODIE',
    slug: 'shadow-hoodie',
    description: 'Our signature technical drop. Minimal sleek core print paired with active red neon circular light reflections and carbon-fiber panel lining.',
    price: 1499.00,
    discount_price: null,
    category_id: 'cccc1111-1111-4111-8111-111111111111',
    stock: 8,
    gender: 'unisex',
    featured: true,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    product_images: [
      { id: '33333333-3333-4333-8333-999999999991', product_id: '33333333-3333-4333-8333-333333333333', image_url: '/images/hero_hoodie_1779875229508.png' }
    ],
    product_sizes: [
      { id: '33333333-3333-4333-8333-888888888881', product_id: '33333333-3333-4333-8333-333333333333', size: 'M', quantity: 4 },
      { id: '33333333-3333-4333-8333-888888888882', product_id: '33333333-3333-4333-8333-333333333333', size: 'L', quantity: 3 },
      { id: '33333333-3333-4333-8333-888888888883', product_id: '33333333-3333-4333-8333-333333333333', size: 'XL', quantity: 1 }
    ]
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    title: 'TECH JACKET',
    slug: 'tech-jacket',
    description: 'Waterproof high-neck shell shell jacket engineered with carbon weave reinforcement, micro-crimped scarlet thermal linings, and magnetic quick-access pockets.',
    price: 1899.00,
    discount_price: null,
    category_id: 'cccc3333-3333-4333-8333-333333333333',
    stock: 6,
    gender: 'unisex',
    featured: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    product_images: [
      { id: '44444444-4444-4444-8444-999999999991', product_id: '44444444-4444-4444-8444-444444444444', image_url: '/images/tech_jacket_1779875291017.png' }
    ],
    product_sizes: [
      { id: '44444444-4444-4444-8444-888888888881', product_id: '44444444-4444-4444-8444-444444444444', size: 'S', quantity: 2 },
      { id: '44444444-4444-4444-8444-888888888882', product_id: '44444444-4444-4444-8444-444444444444', size: 'M', quantity: 2 },
      { id: '44444444-4444-4444-8444-888888888883', product_id: '44444444-4444-4444-8444-444444444444', size: 'L', quantity: 2 }
    ]
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    title: 'CARGO PANTS',
    slug: 'cargo-pants',
    description: 'Asymmetrical utility flight pants made of wear-resistant ripstop webbing with heavy buckles, crimson pull straps, and modular layout structures.',
    price: 1099.00,
    discount_price: null,
    category_id: 'cccc4444-4444-4444-8444-444444444444',
    stock: 14,
    gender: 'unisex',
    featured: true,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    product_images: [
      { id: '55555555-5555-4555-8555-999999999991', product_id: '55555555-5555-4555-8555-555555555555', image_url: '/images/cargo_pants_1779875313014.png' }
    ],
    product_sizes: [
      { id: '55555555-5555-4555-8555-888888888881', product_id: '55555555-5555-4555-8555-555555555555', size: 'M', quantity: 5 },
      { id: '55555555-5555-4555-8555-888888888882', product_id: '55555555-5555-4555-8555-555555555555', size: 'L', quantity: 6 },
      { id: '55555555-5555-4555-8555-888888888883', product_id: '55555555-5555-4555-8555-555555555555', size: 'XL', quantity: 3 }
    ]
  }
];

const SAMPLE_CATEGORIES: Category[] = [
  { id: 'cccc1111-1111-4111-8111-111111111111', name: 'HOODIES', slug: 'hoodies', image_url: null, created_at: '' },
  { id: 'cccc2222-2222-4222-8222-222222222222', name: 'T-SHIRTS', slug: 't-shirts', image_url: null, created_at: '' },
  { id: 'cccc3333-3333-4333-8333-333333333333', name: 'JACKETS', slug: 'jackets', image_url: null, created_at: '' },
  { id: 'cccc4444-4444-4444-8444-444444444444', name: 'PANTS', slug: 'pants', image_url: null, created_at: '' },
  { id: 'cccc5555-5555-4555-8555-555555555555', name: 'ACCESSORIES', slug: 'accessories', image_url: null, created_at: '' }
];

export const SAMPLE_PROMO_CODES: PromoCode[] = [
  { id: 'ab111111-1111-4111-8111-111111111111', code: 'VOOX20', type: 'percentage', value: 20, min_order_value: 0, active: true, created_at: new Date().toISOString() },
  { id: 'ab222222-2222-4222-8222-222222222222', code: 'VOOX100', type: 'fixed', value: 100, min_order_value: 500, active: true, created_at: new Date().toISOString() }
];

// Initialize local storage database structure for zero-downtime mocking
export function getLocalStorageDB() {
  const currentProd = localStorage.getItem('voox_products');
  const currentCats = localStorage.getItem('voox_categories');
  const currentOrders = localStorage.getItem('voox_orders');
  const currentPromos = localStorage.getItem('voox_promo_codes');

  if (!currentProd) {
    localStorage.setItem('voox_products', JSON.stringify(SAMPLE_PRODUCTS));
  }
  if (!currentCats) {
    localStorage.setItem('voox_categories', JSON.stringify(SAMPLE_CATEGORIES));
  }
  if (!currentOrders) {
    localStorage.setItem('voox_orders', JSON.stringify([]));
  }
  if (!currentPromos) {
    localStorage.setItem('voox_promo_codes', JSON.stringify(SAMPLE_PROMO_CODES));
  }

  const productsRaw: Product[] = currentProd ? JSON.parse(currentProd) : SAMPLE_PRODUCTS;
  const categories: Category[] = currentCats ? JSON.parse(currentCats) : SAMPLE_CATEGORIES;
  const ordersRaw: Order[] = currentOrders ? JSON.parse(currentOrders) : [];

  // Add name fallback support to product
  const products = productsRaw.map((p: any) => ({
    ...p,
    name: p.title || p.name
  })) as Product[];

  // Hydrate orders dynamically to keep them extremely small in localStorage
  const orders = ordersRaw.map((ord: any) => {
    const order_items = (ord.order_items || []).map((oi: any) => {
      const prod = products.find(p => p.id === oi.product_id);
      const mappedProduct = prod ? {
        ...prod,
        name: prod.title || (prod as any).name
      } : null;

      return {
        ...oi,
        product: mappedProduct, // singular mapping for legacy profile/dashboard UI compatibility
        products: mappedProduct // plural mapping
      };
    });

    return {
      ...ord,
      order_items
    };
  }) as Order[];

  return {
    products,
    categories,
    orders
  };
}

function saveLocalStorageDB(db: { products: Product[]; categories: Category[]; orders: Order[] }) {
  // Save products and categories as is
  localStorage.setItem('voox_products', JSON.stringify(db.products));
  localStorage.setItem('voox_categories', JSON.stringify(db.categories));

  // IMPORTANT: Strip heavy nested 'product' or 'products' objects inside 'order_items'
  // before saving orders to localStorage. This completely avoids exceeding storage quotas (e.g. from base64 images)!
  // On next load, they will be elegantly hydrated dynamically back in getLocalStorageDB().
  const minifiedOrders = db.orders.map((ord: any) => {
    const order_items = (ord.order_items || []).map((oi: any) => {
      const { product, products, ...rest } = oi;
      return rest;
    });

    return {
      ...ord,
      order_items
    };
  });

  localStorage.setItem('voox_orders', JSON.stringify(minifiedOrders));
}

// DATABASE INTERACTION METHODS (REAL SUPABASE + HYBRID DEGRADATION)

export const fetchCategories = async (): Promise<Category[]> => {
  if (!hasRealSupabase) {
    return getLocalStorageDB().categories;
  }
  try {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    if (data && data.length >= 5) {
      return data;
    }
    // Fallback to local if Supabase has incomplete data
    return getLocalStorageDB().categories;
  } catch (err) {
    console.warn('Categories from micro-service unavailable; using cache:', err);
  }
  return getLocalStorageDB().categories;
};

export const fetchProducts = async (): Promise<Product[]> => {
  if (!hasRealSupabase) {
    return getLocalStorageDB().products;
  }
  try {
    // Attempt join fetch
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), product_sizes(*), categories(*)');
    
    if (error) throw error;
    if (data && data.length >= 5) {
      return data.map((item: any) => ({
        ...item,
        name: item.title,
        category: item.categories,
        product_images: item.product_images || [],
        product_sizes: item.product_sizes || []
      })) as Product[];
    }
    // If DB has some but not all seed products, merge local fallback + remote
    if (data && data.length > 0) {
      const remoteIds = new Set(data.map((p: any) => p.id));
      const local = getLocalStorageDB().products;
      const merged = [...data.map((item: any) => ({
        ...item,
        name: item.title,
        category: item.categories,
        product_images: item.product_images || [],
        product_sizes: item.product_sizes || []
      })), ...local.filter(p => !remoteIds.has(p.id))] as Product[];
      return merged;
    }
    // DB is empty — use local storage fallback
    return getLocalStorageDB().products;
  } catch (err) {
    console.warn('Database Products query fallen back:', err);
  }
  return getLocalStorageDB().products;
};

export const createProduct = async (productData: Partial<Product>, sizes: string[], imageUrl: string | null): Promise<Product> => {
  // Use UUID instead of custom string to ensure compatibility with Supabase 'uuid' type constraints
  const newId = productData.id || generateUUID();
  const nowStr = new Date().toISOString();

  const finalImages = imageUrl ? [{ id: generateUUID(), product_id: newId, image_url: imageUrl }] : [];
  const finalSizes = sizes.map((s) => ({ id: generateUUID(), product_id: newId, size: s, quantity: 10 }));

  const newProduct: Product = {
    id: newId,
    title: productData.title?.toUpperCase() || 'NEW STREETWEAR DROP',
    slug: productData.slug || 'new-streetwear-drop-' + Math.floor(Math.random() * 1000),
    description: productData.description || 'Premium hyper-detailed architectural techwear drops.',
    price: productData.price || 1199.00,
    discount_price: productData.discount_price || null,
    category_id: productData.category_id || 'cccc1111-1111-4111-8111-111111111111',
    stock: productData.stock || 45,
    gender: productData.gender || 'unisex',
    featured: productData.featured ?? true,
    created_at: nowStr,
    product_images: finalImages,
    product_sizes: finalSizes
  };

  // Sync to local
  const db = getLocalStorageDB();
  db.products = [newProduct, ...db.products];
  saveLocalStorageDB(db);

  // Sync to database if reachable
  if (hasRealSupabase) {
    try {
      const productPayload = {
        id: newProduct.id,
        title: newProduct.title,
        slug: newProduct.slug,
        description: newProduct.description,
        price: newProduct.price,
        discount_price: newProduct.discount_price,
        category_id: newProduct.category_id,
        stock: newProduct.stock,
        gender: newProduct.gender,
        featured: newProduct.featured
      };
      
      console.log('INSERT DATA (products):', productPayload);
      const { error: errProd } = await supabase
        .from('products')
        .insert(productPayload);

      if (errProd) {
        console.error('SUPABASE ERROR (products):', errProd);
      }

      if (imageUrl) {
        const imagePayload = { id: finalImages[0]?.id || generateUUID(), product_id: newProduct.id, image_url: imageUrl };
        console.log('INSERT DATA (product_images):', imagePayload);
        const { error: errImg } = await supabase.from('product_images').insert(imagePayload);
        if (errImg) console.warn('SUPABASE ERROR (product_images):', errImg.message);
      }
      for (const sizeObj of finalSizes) {
        const sizePayload = { id: sizeObj.id, product_id: newProduct.id, size: sizeObj.size, quantity: sizeObj.quantity };
        console.log('INSERT DATA (product_sizes):', sizePayload);
        const { error: errSize } = await supabase.from('product_sizes').insert(sizePayload);
        if (errSize) console.warn('SUPABASE ERROR (product_sizes):', errSize.message);
      }
    } catch (err: any) {
      console.warn('Real time remote insert deferred (likely offline):', err);
    }
  }

  return newProduct;
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  const db = getLocalStorageDB();
  db.products = db.products.filter(p => p.id !== productId);
  saveLocalStorageDB(db);

  if (hasRealSupabase) {
    try {
      await supabase.from('product_sizes').delete().eq('product_id', productId);
      await supabase.from('product_images').delete().eq('product_id', productId);
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) return true;
    } catch (err) {
      console.warn('Remote deletion error:', err);
    }
  }
  return true;
};

export const createCategory = async (name: string, description: string): Promise<Category> => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cat: Category = {
    id: generateUUID(),
    name: name.toUpperCase(),
    slug,
    image_url: null,
    created_at: new Date().toISOString()
  };

  const db = getLocalStorageDB();
  db.categories.push(cat);
  saveLocalStorageDB(db);

  if (hasRealSupabase) {
    try {
      const payload = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image_url
      };
      console.log('INSERT DATA (categories):', payload);
      let { error: errCat } = await supabase.from('categories').insert(payload);

      if (errCat) {
        console.error('SUPABASE ERROR (categories):', errCat);
      }
    } catch (err) {
      console.warn('Remote category insert error:', err);
    }
  }
  return cat;
};

// ORDERING ACTIONS

export interface ShippingDetails {
  fullName: string;
  phone: string;
  phone2?: string;
  governorate: string;
  city: string;
  address: string;
  landmark?: string;
  paymentMethod: string;
}

export const createOrder = async (
  items: Array<{ product: Product; selectedSize: string; quantity: number }>,
  details: ShippingDetails,
  userId: string | null,
  promoCode: string | null = null,
  discountAmount: number = 0
): Promise<Order> => {
  const orderId = generateUUID();
  const shippingAddressId = generateUUID();
  const nowStr = new Date().toISOString();
  const shippingCost = 150.00; // Flat EGP delivery premium
  const subTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalAmount = subTotal - discountAmount + shippingCost;

  const validUserId = () => {
    if (!userId) return null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(userId) ? userId : null;
  };
  const parsedUserId = validUserId();

  const orderItems: OrderItem[] = items.map((it) => ({
    id: generateUUID(),
    order_id: orderId,
    product_id: it.product.id,
    product_title: it.product.title,
    size: it.selectedSize,
    quantity: it.quantity,
    price: it.product.price,
    products: it.product
  }));

  const shippingAddress: ShippingAddress = {
    id: shippingAddressId,
    user_id: parsedUserId,
    full_name: details.fullName,
    phone: details.phone,
    phone2: details.phone2 || null,
    governorate: details.governorate,
    city: details.city,
    address: details.address,
    landmark: details.landmark || null,
    created_at: nowStr
  };

  const newOrder: Order = {
    id: orderId,
    user_id: parsedUserId,
    shipping_address_id: shippingAddressId,
    status: 'pending',
    subtotal: subTotal,
    shipping_price: shippingCost,
    discount_amount: discountAmount,
    promo_code: promoCode,
    total_price: totalAmount,
    payment_method: details.paymentMethod,
    created_at: nowStr,
    notes: null,
    shipping_address: shippingAddress,
    order_items: orderItems
  };

  // Cache locally to guarantee that the customer sees their order even if the remote DB network lags or throws errors
  const db = getLocalStorageDB();
  db.orders = [newOrder, ...db.orders];
  saveLocalStorageDB(db);

  // Sync with Supabase remote backend tables in background
  const DEBUG_SUPABASE = true;

  // 1. Timeout Safety system
  async function withTimeout<T>(promise: Promise<T> | any, ms = 8000): Promise<any> {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_ERROR')), ms)
    );
    return Promise.race([promise, timeout]);
  }

  // UUID Validation Helper
  const isUUID = (uuid: string | null | undefined): boolean => {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const handleLoggedError = (stepName: string, error: any) => {
    if (!error) return;
    const msg = error.message || "";
    if (/uuid|invalid input syntax|row-level security/i.test(msg)) {
      console.error("SUPABASE BLOCKED:", msg);
    } else {
      console.error(`${stepName} ERROR (error details):`, error);
    }
  };

  if (DEBUG_SUPABASE) {
    console.log("hasRealSupabase =", hasRealSupabase);
  }

  if (hasRealSupabase) {
    // --- 🧪 STEP 0: TEST MINIMAL PAYLOAD FOR SCHEMA VALIDITY ---
    if (DEBUG_SUPABASE) {
      console.log('🧪 TEST: shipping_addresses INSERT START');
    }
    try {
      const testId = generateUUID();
      const testPayload = {
        id: testId,
        full_name: "TEST USER",
        phone: "0123456789"
      };
      
      if (DEBUG_SUPABASE) {
        console.log('PAYLOAD TEST:', testPayload);
      }
      
      const testResult = await withTimeout(
        supabase
          .from('shipping_addresses')
          .insert(testPayload)
          .select()
      );
      
      if (DEBUG_SUPABASE) {
        console.log('TEST RESULT Response:', testResult);
        if (testResult.data) console.log('DATA TEST:', testResult.data);
        if (testResult.error) console.log('ERROR TEST:', testResult.error);
      }

      if (testResult.error) {
        handleLoggedError("TEST STEP", testResult.error);
      } else {
        if (DEBUG_SUPABASE) console.log('🧪 TEST: SUCCESSFUL ROW CREATED:', testResult.data);
        await supabase.from('shipping_addresses').delete().eq('id', testId);
      }
    } catch (testErr: any) {
      if (testErr.message === 'TIMEOUT_ERROR') {
        console.error('🧪 TEST ERROR: TIMEOUT reason - Operation timed out while running Schema Test');
      } else {
        console.error('🧪 TEST Exception thrown:', testErr?.message || testErr);
      }
      console.warn("FALLBACK TO LOCAL STORAGE");
    }

    // --- STEP 1: shipping_addresses ---
    const shippingPayload = {
      id: shippingAddressId,
      user_id: parsedUserId,
      full_name: details.fullName,
      phone: details.phone,
      phone2: details.phone2 || null,
      governorate: details.governorate,
      city: details.city,
      address: details.address,
      landmark: details.landmark || null
    };

    if (DEBUG_SUPABASE) {
      console.log("STEP 1 START shipping_addresses");
      console.log("STEP 1 PAYLOAD (shipping_addresses):", shippingPayload);
    }

    let step1Success = false;
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('shipping_addresses')
          .insert(shippingPayload)
          .select()
      );

      if (DEBUG_SUPABASE) {
        console.log("STEP 1 RESULT STATUS:", { data, error });
      }

      if (error) {
        console.error("STEP 1 ERROR:", error);
        handleLoggedError("STEP 1", error);
      } else {
        if (DEBUG_SUPABASE) {
          console.log("STEP 1 SUCCESS RESPONSE:", data);
        }
        step1Success = true;
      }
    } catch (shippingErr: any) {
      if (shippingErr.message === 'TIMEOUT_ERROR') {
        console.error("STEP 1 ERROR: TIMEOUT reason - shipping_addresses insert timed out");
      } else {
        console.error("Exception in STEP 1:", shippingErr?.message || shippingErr);
      }
    }

    if (!step1Success) {
      console.warn("FALLBACK TO LOCAL STORAGE (Step 1 failed, aborting rest of the sync steps!)");
      return newOrder;
    }

    // --- STEP 2: orders ---
    const orderPayload = {
      id: orderId,
      user_id: parsedUserId,
      shipping_address_id: shippingAddressId,
      status: 'pending',
      payment_method: details.paymentMethod,
      subtotal: subTotal,
      shipping_price: shippingCost,
      discount_amount: discountAmount,
      promo_code: promoCode,
      total_price: totalAmount,
      notes: null
    };

    if (DEBUG_SUPABASE) {
      console.log("STEP 2 START orders");
      console.log("STEP 2 PAYLOAD (orders):", orderPayload);
    }

    let step2Success = false;
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('orders')
          .insert(orderPayload)
          .select()
      );

      if (DEBUG_SUPABASE) {
        console.log("STEP 2 RESULT STATUS:", { data, error });
      }

      if (error) {
        console.error("STEP 2 ERROR:", error);
        handleLoggedError("STEP 2", error);
      } else {
        if (DEBUG_SUPABASE) {
          console.log("STEP 2 SUCCESS RESPONSE:", data);
        }
        step2Success = true;
      }
    } catch (orderErr: any) {
      if (orderErr.message === 'TIMEOUT_ERROR') {
        console.error("STEP 2 ERROR: TIMEOUT reason - orders insert timed out");
      } else {
        console.error("Exception in STEP 2:", orderErr?.message || orderErr);
      }
    }

    if (!step2Success) {
      console.warn("FALLBACK TO LOCAL STORAGE (Step 2 failed, aborting rest of the sync steps!)");
      return newOrder;
    }

    // --- STEP 3: order_items ---
    if (DEBUG_SUPABASE) {
      console.log("STEP 3 START order_items (loop)");
    }

    let step3Success = true;
    for (const item of orderItems) {
      const validatedProductId = isUUID(item.product_id) ? item.product_id : null;
      const itemPayload = {
        id: item.id,
        order_id: orderId,
        product_id: validatedProductId,
        product_title: item.product_title,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      };

      if (DEBUG_SUPABASE) {
        console.log("STEP 3 PAYLOAD (order_items item):", itemPayload);
      }

      try {
        const { data, error } = await withTimeout(
          supabase
            .from('order_items')
            .insert(itemPayload)
            .select()
        );

        if (DEBUG_SUPABASE) {
          console.log("STEP 3 ITEM RESULT STATUS:", { data, error });
        }

        if (error) {
          console.error("STEP 3 ERROR:", error);
          handleLoggedError("STEP 3", error);
          step3Success = false;
          break; // Stop loop and abort immediately
        } else {
          if (DEBUG_SUPABASE) {
            console.log("STEP 3 SUCCESS RESPONSE (item):", data);
          }
        }
      } catch (itemErr: any) {
        if (itemErr.message === 'TIMEOUT_ERROR') {
          console.error("STEP 3 ERROR: TIMEOUT reason - order_items insert timed out");
        } else {
          console.error("Exception in STEP 3:", itemErr?.message || itemErr);
        }
        step3Success = false;
        break; // Stop loop and abort immediately
      }
    }

    if (!step3Success) {
      console.warn("FALLBACK TO LOCAL STORAGE (Step 3 failed, aborting rest of the loop!)");
      return newOrder;
    }

    if (DEBUG_SUPABASE) {
      console.log("🎉 ALL SYNC STEPS DONE SUCCESSFULLY (STEP 1, STEP 2, STEP 3 fully completed!)");
    }
  }

  return newOrder;
};

export const fetchOrders = async (): Promise<Order[]> => {
  if (!hasRealSupabase) {
    return getLocalStorageDB().orders;
  }
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, shipping_addresses(*), order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        shipping_address_id: item.shipping_address_id,
        status: item.status,
        subtotal: item.subtotal,
        shipping_price: item.shipping_price,
        discount_amount: item.discount_amount || 0,
        promo_code: item.promo_code || null,
        total_price: item.total_price,
        payment_method: item.payment_method,
        created_at: item.created_at,
        notes: item.notes,
        shipping_address: item.shipping_addresses?.[0] || item.shipping_addresses || null,
        order_items: (item.order_items || []).map((oi: any) => {
          const rawProd = oi.products;
          const mappedProduct = rawProd ? {
            ...rawProd,
            name: rawProd.title || rawProd.name
          } : null;

          return {
            ...oi,
            product: mappedProduct,  // singular mapping for UI template code compatibility
            products: mappedProduct  // plural mapping
          };
        })
      })) as Order[];
    }
  } catch (err) {
    console.warn('Real time orders remote query bypassed:', err);
  }
  return getLocalStorageDB().orders;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  const db = getLocalStorageDB();
  const order = db.orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveLocalStorageDB(db);
  }

  if (hasRealSupabase) {
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (!error) return true;
    } catch (err) {
      console.warn('Remote status update postponed:', err);
    }
  }
  return true;
};

export const fetchProfiles = async (): Promise<Profile[]> => {
  // Clear any existing stored local users that are not admin, as requested: "امسح اي بيانات غير حساب admin"
  try {
    const stored = localStorage.getItem('voox_profiles');
    if (stored) {
      const profiles: Profile[] = JSON.parse(stored);
      const filtered = profiles.filter(p => p.role === 'admin' || p.id === 'admin-mahmed');
      localStorage.setItem('voox_profiles', JSON.stringify(filtered));
    }
    
    const storedAccounts = localStorage.getItem('voox_simulated_accounts');
    if (storedAccounts) {
      const accounts = JSON.parse(storedAccounts);
      const filteredAccounts = accounts.filter((acc: any) => acc.role === 'admin' || acc.id === 'admin-mahmed' || acc.email === 'mahmedtahrr@gmail.com');
      localStorage.setItem('voox_simulated_accounts', JSON.stringify(filteredAccounts));
    }
  } catch (err) {
    console.warn('Local storage profiles cleanup error:', err);
  }

  if (!hasRealSupabase) {
    // Generate simulated user base containing ONLY the admin account for active visual representation
    const defaultProfiles: Profile[] = [
      {
        id: 'admin-mahmed',
        full_name: 'ENG. Mohamed Taher',
        phone: '01276812022',
        role: 'admin',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const stored = localStorage.getItem('voox_profiles');
    if (!stored || JSON.parse(stored).length === 0) {
      localStorage.setItem('voox_profiles', JSON.stringify(defaultProfiles));
      return defaultProfiles;
    }
    const currentList: Profile[] = JSON.parse(stored);
    const filteredList = currentList.filter(p => p.role === 'admin' || p.id === 'admin-mahmed');
    return filteredList.length > 0 ? filteredList : defaultProfiles;
  }

  try {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    
    const stored = localStorage.getItem('voox_profiles');
    let profilesList: Profile[] = stored ? JSON.parse(stored) : [];

    if (!error && data) {
      data.forEach((dbProf: any) => {
        const index = profilesList.findIndex((p: any) => p.id === dbProf.id);
        if (index > -1) {
          profilesList[index] = {
            ...profilesList[index],
            ...dbProf
          };
        } else {
          profilesList.push(dbProf);
        }
      });
      const filtered = profilesList.filter(p => p.role === 'admin' || p.id === 'admin-mahmed');
      localStorage.setItem('voox_profiles', JSON.stringify(filtered));
      return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      console.warn('Supabase profiles select was empty or errored. Error details:', error?.message);
    }
  } catch (err) {
    console.warn('Profiles remote query failed:', err);
  }

  const stored = localStorage.getItem('voox_profiles') || '[]';
  const profiles: Profile[] = JSON.parse(stored);
  return profiles.filter(p => p.role === 'admin' || p.id === 'admin-mahmed');
};

export const fetchPromoCodes = async (): Promise<PromoCode[]> => {
  if (!localStorage.getItem('voox_promo_codes')) {
    localStorage.setItem('voox_promo_codes', JSON.stringify(SAMPLE_PROMO_CODES));
  }
  
  if (!hasRealSupabase) {
    return JSON.parse(localStorage.getItem('voox_promo_codes') || '[]');
  }

  try {
    const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      if (data.length > 0) {
        // Remote has data - use it and sync to local
        localStorage.setItem('voox_promo_codes', JSON.stringify(data));
        return data;
      }
      // Remote table is empty - return local sample data (admin can add via dashboard)
      return JSON.parse(localStorage.getItem('voox_promo_codes') || '[]');
    }
  } catch (err) {
    console.warn('Remote promo codes query failed, using local storage cache:', err);
  }
  
  return JSON.parse(localStorage.getItem('voox_promo_codes') || '[]');
};

export const createPromoCode = async (promoCodeData: Partial<PromoCode>): Promise<PromoCode> => {
  const newPromo: PromoCode = {
    id: promoCodeData.id || generateUUID(),
    code: (promoCodeData.code || 'NEWCODE').toUpperCase().trim(),
    type: (promoCodeData.type || 'percentage') as 'percentage' | 'fixed',
    value: Number(promoCodeData.value) || 10,
    min_order_value: Number(promoCodeData.min_order_value) || 0,
    active: promoCodeData.active ?? true,
    created_at: new Date().toISOString()
  };

  // Sync to local
  const currentList = JSON.parse(localStorage.getItem('voox_promo_codes') || '[]');
  currentList.unshift(newPromo);
  localStorage.setItem('voox_promo_codes', JSON.stringify(currentList));

  // Sync to remote Supabase
  if (hasRealSupabase) {
    try {
      const { error } = await supabase.from('promo_codes').insert(newPromo);
      if (error) console.error('Supabase error inserting promo code:', error);
    } catch (err) {
      console.warn('Failed to insert promo code to remote database:', err);
    }
  }

  return newPromo;
};

export const deletePromoCode = async (id: string): Promise<boolean> => {
  const currentList = JSON.parse(localStorage.getItem('voox_promo_codes') || '[]');
  const filtered = currentList.filter((p: any) => p.id !== id);
  localStorage.setItem('voox_promo_codes', JSON.stringify(filtered));

  if (hasRealSupabase) {
    try {
      const { error } = await supabase.from('promo_codes').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Failed to delete promo code from remote database:', err);
    }
  }
  return true;
};

export const validatePromoCode = async (codeText: string, subtotal: number): Promise<{ isValid: boolean; discountPercent?: number; discountAmount?: number; message: string }> => {
  const codeFormatted = codeText.toUpperCase().trim();
  const codes = await fetchPromoCodes();
  const found = codes.find(c => c.code === codeFormatted);

  if (!found) {
    return { isValid: false, message: 'كود غير صحيح' };
  }
  if (!found.active) {
    return { isValid: false, message: 'الكود غير نشط حالياً' };
  }
  if (subtotal < found.min_order_value) {
    return { isValid: false, message: `الحد الأدنى للطلب لاستخدام هذا الكود هو ${found.min_order_value} ج.م` };
  }

  let discountAmount = 0;
  let discountPercent = 0;

  if (found.type === 'percentage') {
    discountPercent = found.value;
    discountAmount = subtotal * (found.value / 100);
  } else {
    discountAmount = found.value;
    discountPercent = Math.round((found.value / subtotal) * 100);
  }

  return {
    isValid: true,
    discountPercent,
    discountAmount: Math.min(discountAmount, subtotal),
    message: `تم تطبيق كود الخصم: خصم ${found.type === 'percentage' ? found.value + '%' : found.value + ' ج.م'}`
  };
};

