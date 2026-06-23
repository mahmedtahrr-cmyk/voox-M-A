import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchOrders } from '../../services/db';
import { Order } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToShop: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onGoToShop
}) => {
  const { profile, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && profile) {
      loadUserOrders();
    }
  }, [isOpen, profile]);

  const loadUserOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await fetchOrders();
      // Filter orders belonging to the user
      // Supporting mock logins (id: mock-admin-id or admin-mahmed) as well
      const userOrders = allOrders.filter(
        (o) => o.user_id === profile?.id
      );
      setOrders(userOrders);
    } catch (err) {
      console.warn('Failed retrieving orders history:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400',
          dot: 'bg-emerald-500'
        };
      case 'shipping':
        return {
          bg: 'bg-blue-950/40 border-blue-500/50 text-blue-400',
          dot: 'bg-blue-500'
        };
      case 'confirmed':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50 text-amber-400',
          dot: 'bg-amber-500'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-950/40 border-red-500/50 text-red-400',
          dot: 'bg-red-500'
        };
      default: // pending
        return {
          bg: 'bg-zinc-900 border-zinc-700 text-zinc-300',
          dot: 'bg-zinc-400 animate-pulse'
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-red-650 selection:text-white">
          
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal body */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl bg-zinc-950 border-2 border-red-500/60 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)] z-10 flex flex-col pointer-events-auto max-h-[90vh]"
          >
            {/* Corner Bracket decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-500 pointer-events-none" />

            {/* Close button top-right */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Scrollable Container */}
            <div className="p-6 sm:p-10 space-y-6 overflow-y-auto max-h-[calc(90vh-10px)] scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-zinc-950">
              
              {/* Header telemetry and title */}
              <div className="flex justify-between items-center font-mono text-[8px] text-red-500/75 tracking-[0.25em] border-b border-red-950/30 pb-3 uppercase">
                <span>SECTOR: NOMAD_USER_PROFILE</span>
                <span className="animate-pulse">ONLINE_SECURE</span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start pb-6 border-b border-zinc-900">
                {/* Profile big avatar glow */}
                <div className="p-4 bg-zinc-90 w-16 h-16 rounded-2xl border border-red-900/50 flex items-center justify-center bg-zinc-900/40 relative">
                  <User className="w-8 h-8 text-red-500" />
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-black" />
                </div>

                <div className="space-y-1 group flex-1">
                  <span className="px-2.5 py-0.5 bg-red-900/20 border border-red-900/50 text-[9px] font-mono tracking-[0.2em] text-red-400 rounded-full uppercase">
                    {profile.role === 'admin' ? 'OPERATOR_ADMIN' : 'NOMAD_MEMBER'}
                  </span>
                  <h2 className="font-sans font-black text-2xl tracking-wider text-white uppercase mt-1">
                    {profile.full_name || 'VOOX NOMAD'}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1"><Database className="w-3 h-3 text-red-500" /> ID: {profile.id.slice(0, 10)}</span>
                    <span className="flex items-center gap-1">• SIGN_DATE: 2026/05/27</span>
                  </div>
                </div>

                <div className="w-full md:w-auto self-stretch md:self-auto flex items-end">
                  <button
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    className="w-full md:w-auto px-4 py-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 hover:border-red-905 rounded-xl font-mono text-[10px] text-red-400 hover:text-red-500 tracking-widest uppercase transition-all cursor-pointer font-bold"
                  >
                    DISCONNECT_GATE
                  </button>
                </div>
              </div>

              {/* Order history & operation parameters title */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-red-500" />
                    <h3 className="font-sans font-black text-sm tracking-widest text-white uppercase">
                      OPERATION ARCHIVES ({orders.length})
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500 uppercase">SYS_LOGGING: ON</span>
                </div>

                {loading ? (
                  <div className="py-12 text-center space-y-3 bg-zinc-900/10 border border-zinc-900 rounded-2xl">
                    <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase">DECRYPTING PURCHASED DATASTREAMS...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-16 text-center space-y-4 bg-zinc-900/10 border border-zinc-900 rounded-2xl">
                    <p className="font-mono text-[10px] text-zinc-505 tracking-widest uppercase">
                      NO DEPLOYED STREETWEAR DROPS CORRESPOND TO THIS ID.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onGoToShop();
                      }}
                      className="px-4 py-2 bg-red-650 hover:bg-red-500 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    >
                      BROWSE_ACTIVE_ARCHIVES
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {orders.map((order) => {
                      const isExpanded = !!expandedOrders[order.id];
                      const statusConfig = getStatusColor(order.status);
                      return (
                        <div 
                          key={order.id} 
                          className="border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/40 rounded-xl overflow-hidden transition-all"
                        >
                          {/* Row Header summary card */}
                          <div 
                            onClick={() => toggleOrderExpand(order.id)}
                            className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer select-none"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-900 text-zinc-400 font-mono text-[9px] tracking-wider uppercase font-extrabold text-red-500">
                                {order.id.toUpperCase()}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-400">
                                {order.order_items?.length || 1} ITEMS
                              </span>
                              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                              <span className="font-sans font-black text-sm text-white tracking-widest">
                                {order.total_price.toLocaleString()} EGP
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[9px] font-bold tracking-wider uppercase ${statusConfig.bg}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                  {order.status}
                                </span>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500 hover:text-white" /> : <ChevronDown className="w-4 h-4 text-zinc-500 hover:text-white" />}
                              </div>
                            </div>
                          </div>

                          {/* Expanded contents details table */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden border-t border-zinc-950 bg-zinc-950/40"
                              >
                                <div className="p-4 sm:p-5 space-y-4">
                                  
                                  {/* Items sequence */}
                                  <div className="space-y-3">
                                    <p className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">Apparel specifications</p>
                                    {(order.order_items || []).map((item, idx) => (
                                      <div key={idx} className="flex gap-3 items-center justify-between border-b border-zinc-900/30 pb-2 bg-black/10 p-2 rounded-lg">
                                        <div className="flex items-center gap-2.5">
                                          {item.product?.product_images?.[0] ? (
                                            <img 
                                              src={item.product?.product_images?.[0]?.image_url} 
                                              alt={item.product?.name} 
                                              className="w-10 h-10 object-cover rounded border border-zinc-900 bg-zinc-900" 
                                              referrerPolicy="no-referrer"
                                            />
                                          ) : (
                                            <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-[10px] font-mono border border-zinc-800 text-red-500 font-bold">VX</div>
                                          )}
                                          <div>
                                            <h4 className="font-sans font-black text-xs text-white tracking-wider uppercase">
                                              {item.product?.name || 'VOOX SPECIAL APPAREL'}
                                            </h4>
                                            <span className="font-mono text-[9px] text-zinc-500 tracking-wider">
                                              SIZE: <strong className="text-zinc-300 font-bold uppercase">{item.size}</strong> | QUANTITY: <strong className="text-zinc-300 font-bold">{item.quantity}</strong>
                                            </span>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <span className="font-sans font-bold text-xs text-white">
                                            {(item.price * item.quantity).toLocaleString()} EGP
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Logistics details and coordinates */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px] text-zinc-400 bg-zinc-950 p-4 rounded-xl border border-zinc-900 leading-relaxed uppercase">
                                    <div className="space-y-1.5">
                                      <p className="text-red-505 font-bold tracking-widest text-[9px] text-red-500">SHIPPING DESTINATION</p>
                                      <div className="space-y-1">
                                        <p className="text-white font-bold">{order.shipping_address?.full_name}</p>
                                        <p className="flex items-center gap-1.5 text-zinc-500"><Phone className="w-3.5 h-3.5 text-red-500" /> {order.shipping_address?.phone} {order.shipping_address?.phone2 ? `/ ${order.shipping_address?.phone2}` : ''}</p>
                                        <p className="flex items-center gap-1.5 text-zinc-500"><MapPin className="w-3.5 h-3.5 text-red-500" /> {order.shipping_address?.governorate}, {order.shipping_address?.city}</p>
                                        <p className="text-zinc-500">{order.shipping_address?.address}</p>
                                        {order.shipping_address?.landmark && <p className="text-zinc-650">LANDMARK: {order.shipping_address?.landmark}</p>}
                                      </div>
                                    </div>

                                    <div className="space-y-1.5 flex flex-col justify-between">
                                      <div className="space-y-1">
                                        <p className="text-red-505 font-bold tracking-widest text-[9px] text-red-500">PAYMENT & LOGISTICS</p>
                                        <p className="text-zinc-500">METHOD: <span className="text-zinc-300 font-bold">{order.payment_method === 'cod' ? 'CASH ON DELIVERY' : 'SECURE DIGITAL GATE'}</span></p>
                                        <p className="text-zinc-500">SHIPPING COST: <span className="text-zinc-300">{order.shipping_price} EGP</span></p>
                                      </div>
                                      <div className="border-t border-zinc-900/60 pt-2 flex justify-between items-center text-[9px] text-zinc-600 tracking-wider">
                                        <span>STATUS_LOGS: SUCCESSFILE</span>
                                        <span className="text-red-500/80">AUTHENTIC REPLICA</span>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Secure pathway indicator */}
              <div className="border-t border-zinc-900/80 pt-4 flex justify-between items-center text-[9px] font-mono text-zinc-600 tracking-wider">
                <span>PROTOCOL_ID: V_M_T_400</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-red-500" /> END-TO-END ENVELOPI STABILIZED</span>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
