import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, validatePromoCode } from '../../services/db';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Tag,
  X,
  Loader2
} from 'lucide-react';

interface CheckoutViewProps {
  onOrderCompleted: () => void;
  onGoHome: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderCompleted, onGoHome }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [phone2, setPhone2] = useState('');
  const [governorate, setGovernorate] = useState('Cairo');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [notes, setNotes] = useState('');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const SHIPPING_COST = cart.length > 0 ? 150 : 0;
  const subtotal = cartTotal;
  const total = subtotal - discountAmount + SHIPPING_COST;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const result = await validatePromoCode(promoInput.trim().toUpperCase(), subtotal);
      if (result && result.isValid) {
        setPromoCode(promoInput.trim().toUpperCase());
        setPromoApplied(true);
        setDiscountPercent(result.discountPercent || 0);
        setDiscountAmount(result.discountAmount || 0);
      } else {
        setPromoError('Invalid code or minimum order not met.');
      }
    } catch {
      setPromoError('Failed to validate code. Try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoInput('');
    setPromoApplied(false);
    setDiscountPercent(0);
    setDiscountAmount(0);
    setPromoError('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const details = {
        fullName: fullName,
        phone,
        phone2: phone2 || undefined,
        governorate,
        city,
        address,
        landmark: landmark || undefined,
        paymentMethod
      };

      const ordItems = cart.map((it) => ({
        product: it.product,
        selectedSize: it.selectedSize,
        quantity: it.quantity
      }));

      const newOrd = await createOrder(
        ordItems,
        details,
        user?.id || null,
        discountPercent > 0 ? promoCode : null,
        discountAmount
      );

      setOrderSuccess(newOrd.id);
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Operational failure during order compiling. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const EgyptGovernorates = [
    'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Dakahlia', 'Sharqia',
    'Gharbia', 'Monufia', 'Beheira', 'Fayoum', 'Beni Suef', 'Minya',
    'Assiut', 'Sohag', 'Qena', 'Luxor', 'Aswan', 'Red Sea', 'Suez',
    'Ismailia', 'Port Said', 'Damietta', 'Matrouh_Coast'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-28 pointer-events-auto selection:bg-red-600 selection:text-white select-none">

      {/* Confirmation modal upon order success */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-md bg-black border border-zinc-900 rounded-2xl p-8 text-center space-y-6 z-10"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-900 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-[bounce_1.5s_infinite]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-sans font-black text-xl tracking-[0.2em] text-white uppercase">
                  ORDER_SECURED
                </h3>
                <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
                  YOUR SECURITY CODE: {orderSuccess}
                </p>
              </div>

              <p className="text-zinc-400 text-xs font-sans leading-relaxed px-2">
                We have received your coordinates. Pack is entering our dispatch chamber. Your shipment details have been logged in the real-time databases securely.
              </p>

              <div className="pt-2">
                <button
                  onClick={onGoHome}
                  className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-widest rounded-lg transition-all"
                >
                  RETURN_TO_SHOWROOM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-baseline gap-2 border-b border-zinc-900 pb-8 mb-8">
        <h1 className="font-sans font-black text-2xl lg:text-3xl tracking-[0.2em] text-white">
          COORDINATES_CHECKOUT
        </h1>
        <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
          [PORT_SHEET_04-OUT]
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <p className="font-mono text-xs text-zinc-500 uppercase">NO PHYSICAL THREADS COMMITTED TO DISPATCH SHEETS.</p>
          <button onClick={onGoHome} className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-xs text-white font-mono font-bold tracking-widest rounded-lg">
            RETURN_TO_HOME
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Form left col: 7 sections */}
          <div className="lg:col-span-7 bg-black/60 border border-zinc-900 p-6 sm:p-8 rounded-2xl">
            <form onSubmit={handlePlaceOrder} className="space-y-6">

              <div className="font-sans font-black text-xs tracking-widest text-zinc-200 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-white" />
                DELIVERY_INFORMATION
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">RECIPIENT_FULL_NAME *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="E.g., Adam Drake"
                  className="w-full h-11 px-4 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white placeholder-zinc-800 outline-none transition-colors"
                />
              </div>

              {/* Phones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">PRIMARY_PHONE *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 100 000 0000"
                    className="w-full h-11 px-4 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white placeholder-zinc-800 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">SECONDARY_PHONE (OPTIONAL)</label>
                  <input
                    type="tel"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                    placeholder="+20 111 000 0000"
                    className="w-full h-11 px-4 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white placeholder-zinc-800 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Geography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">GOVERNORATE *</label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full h-11 px-4 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white outline-none appearance-none cursor-pointer"
                  >
                    {EgyptGovernorates.map(gov => (
                      <option key={gov} value={gov}>{gov.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">CITY / SECTOR *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="E.g., Nasr City"
                    className="w-full h-11 px-4 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white placeholder-zinc-800 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">STREET_ADDRESS *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building, Street, Area"
                  className="w-full h-11 px-4 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white placeholder-zinc-800 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">LANDMARK (OPTIONAL)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near mosque, beside school..."
                  className="w-full h-11 px-4 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white placeholder-zinc-800 outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">NOTES (OPTIONAL)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any specific instructions..."
                  className="w-full px-4 py-3 bg-black border border-zinc-800 hover:border-zinc-700 focus:border-white focus:ring-1 focus:ring-white rounded-lg text-xs font-mono text-white placeholder-zinc-800 outline-none transition-colors resize-none"
                />
              </div>

              {/* Payment method */}
              <div className="space-y-2.5">
                <label className="block font-mono text-[9px] text-zinc-500 tracking-wider font-bold">PAYMENT_METHOD</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-lg font-mono text-xs transition-all border cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-white border-white text-black font-bold'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    CASH_ON_DELIVERY
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-lg font-mono text-xs transition-all border cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-white border-white text-black font-bold'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    CARD_ONLINE
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-mono text-xs font-bold tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    PROCESSING_ORDER...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    PLACE_ORDER_NOW
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right col: Order summary */}
          <div className="lg:col-span-5 space-y-4">

            {/* Order items */}
            <div className="bg-black/60 border border-zinc-900 rounded-2xl p-6 space-y-4">
              <div className="font-sans font-black text-xs tracking-widest text-zinc-200 border-b border-zinc-900 pb-3">
                ORDER_SUMMARY
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => {
                  const img = item.product.product_images?.[0]?.image_url || '/placeholder.png';
                  return (
                    <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 p-1.5">
                        <img src={img} alt={item.product.title} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-bold text-xs text-white truncate">{item.product.title}</p>
                        <p className="font-mono text-[9px] text-zinc-500">SIZE: {item.selectedSize} × {item.quantity}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-200 flex-shrink-0">
                        EGP {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promo code */}
            <div className="bg-black/60 border border-zinc-900 rounded-2xl p-6 space-y-3">
              <div className="font-sans font-black text-xs tracking-widest text-zinc-200 border-b border-zinc-900 pb-3 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-red-500" />
                PROMO_CODE
              </div>

              {promoApplied ? (
                <div className="flex items-center justify-between p-3 bg-emerald-950/30 border border-emerald-900/60 rounded-lg">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-400">{promoCode}</span>
                    <p className="font-mono text-[9px] text-emerald-600 mt-0.5">
                      {discountPercent > 0 ? `${discountPercent}% OFF` : `EGP ${discountAmount.toFixed(2)} OFF`}
                    </p>
                  </div>
                  <button onClick={handleRemovePromo} className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 h-10 px-3 bg-black border border-zinc-800 focus:border-white rounded-lg text-xs font-mono text-white placeholder-zinc-700 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoInput.trim()}
                      className="px-4 h-10 bg-white hover:bg-zinc-100 disabled:bg-zinc-900 disabled:text-zinc-600 text-black font-mono text-[10px] font-bold tracking-widest rounded-lg transition-all cursor-pointer"
                    >
                      {promoLoading ? '...' : 'APPLY'}
                    </button>
                  </div>
                  {promoError && (
                    <p className="font-mono text-[9px] text-red-400">{promoError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="bg-black/60 border border-zinc-900 rounded-2xl p-6 space-y-3">
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>SUBTOTAL:</span>
                  <span className="text-zinc-300">EGP {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-zinc-500">
                    <span>DISCOUNT:</span>
                    <span className="text-red-400">- EGP {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-500">
                  <span>SHIPPING:</span>
                  <span className="text-zinc-300">EGP {SHIPPING_COST.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-dashed border-zinc-800 pt-2 flex justify-between font-bold text-sm">
                  <span className="text-white">TOTAL:</span>
                  <span className="text-red-500 tracking-wide">EGP {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 justify-center text-[9px] font-mono text-zinc-600 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                <span>CYBER_SECURED PAYMENT SYSTEMS</span>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={onGoHome}
              className="w-full h-10 flex items-center justify-center gap-2 font-mono text-[10px] text-zinc-500 hover:text-white border border-zinc-900 hover:border-zinc-700 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              RETURN_TO_SHOP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
