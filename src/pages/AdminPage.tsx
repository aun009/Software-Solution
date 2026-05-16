import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useProductStore } from '../store/useProductStore';
import { Plus, Trash2, Package, CheckCircle2, Loader2, AlertCircle, Sparkles, Edit2, X, DollarSign, Image as ImageIcon, Video, Trash, ArrowRight, UploadCloud, Link as LinkIcon, Clock, Infinity, GripVertical, LayoutGrid, ArrowUpDown, Save, CheckCheck } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ── Sortable row used in the Reorder tab ─────────────────────────────────────
const SortableProductRow = ({ product, index }: { product: any; index: number; key?: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-white border rounded-2xl shadow-sm transition-shadow ${isDragging ? 'shadow-2xl border-blue-400' : 'border-gray-100 hover:border-gray-200'}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-2 text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none transition-colors rounded-xl hover:bg-gray-50"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      {/* Position badge */}
      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-black text-blue-600">{index + 1}</span>
      </div>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
        <img src={product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer"
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-gray-900 tracking-tight truncate">{product.title}</p>
        <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">{product.category}</p>
      </div>

      {/* Price */}
      <div className="text-xs font-black text-gray-400 shrink-0">₹{product.price || '—'}</div>
    </div>
  );
};

export const AdminPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { fetchProducts: refreshGlobalStore } = useProductStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'reorder'>('inventory');
  const [reorderItems, setReorderItems] = useState<any[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AI & Writing',
    price: '',
    price_usd: '',
    price_1m: '',
    price_1m_usd: '',
    price_3m: '',
    price_3m_usd: '',
    price_6m: '',
    price_6m_usd: '',
    price_1y: '',
    price_1y_usd: '',
    price_lifetime: '',
    price_lifetime_usd: '',
    image: '',
    videoUrl: '',
    url: '',
    is_trending: false,
    ctaText: 'Deploy Now',
    features: ['Infinite scaling', 'Real-time sync', 'Multi-tenant'],
    benefits: ['Accelerate growth', 'Simplify operations', 'Maximize revenue']
  });

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      // Try sort_order first so Reorder Hub and Inventory both reflect saved order
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (data && !error) {
        setProducts(data);
        setReorderItems(data);
      } else {
        // Fallback if sort_order column doesn't exist yet
        const { data: fallback, error: fbErr } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (fbErr) throw fbErr;
        const loaded = fallback || [];
        setProducts(loaded);
        setReorderItems(loaded);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setReorderItems((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    setOrderSaved(false);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    setError('');
    try {
      const results = await Promise.all(
        reorderItems.map((item, index) =>
          supabase.from('products').update({ sort_order: index + 1 }).eq('id', item.id)
        )
      );
      // Supabase returns errors in response objects, doesn't throw
      const firstError = results.find(r => r.error)?.error;
      if (firstError) {
        const msg = firstError.message || '';
        if (msg.toLowerCase().includes('sort_order') || msg.toLowerCase().includes('column')) {
          setError('⚠️ Column missing — run in Supabase SQL Editor: ALTER TABLE products ADD COLUMN sort_order integer;');
        } else {
          setError(msg);
        }
        return;
      }
      setOrderSaved(true);
      setTimeout(() => setOrderSaved(false), 3000);
      // Refresh global store (StorePage) AND local admin list (Reorder Hub) in parallel
      await Promise.all([refreshGlobalStore(), fetchProducts()]);
    } catch (err: any) {
      setError(err?.message || 'Failed to save order');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const payload: any = { ...formData };
      delete payload.ctaText;

      // Convert empty pricing fields to null so they are truly unset in the DB
      const pricingKeys = ['price_usd', 'price_1m', 'price_1m_usd', 'price_3m', 'price_3m_usd', 'price_6m', 'price_6m_usd', 'price_1y', 'price_1y_usd', 'price_lifetime', 'price_lifetime_usd'];
      pricingKeys.forEach(key => {
        if (payload[key] === '' || payload[key] === undefined) {
          payload[key] = null;
        }
      });

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }

      handleResetForm();
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setUseCustomCategory(false);
    setFormData({
      title: '',
      description: '',
      category: 'AI & Writing',
      price: '',
      price_usd: '',
      price_1m: '',
      price_1m_usd: '',
      price_3m: '',
      price_3m_usd: '',
      price_6m: '',
      price_6m_usd: '',
      price_1y: '',
      price_1y_usd: '',
      price_lifetime: '',
      price_lifetime_usd: '',
      image: '',
      videoUrl: '',
      url: '',
      is_trending: false,
      ctaText: 'Deploy Now',
      features: ['Infinite scaling', 'Real-time sync', 'Multi-tenant'],
      benefits: ['Accelerate growth', 'Simplify operations', 'Maximize revenue']
    });
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    const presets = ['AI & Writing', 'Graphic Design', 'Video Editing', 'SEO & Marketing', 'Learning', 'Stock & Media', 'Entertainment'];
    const isCustom = !presets.includes(product.category);
    setUseCustomCategory(isCustom);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price || '',
      price_usd: product.price_usd || '',
      price_1m: product.price_1m || '',
      price_1m_usd: product.price_1m_usd || '',
      price_3m: product.price_3m || '',
      price_3m_usd: product.price_3m_usd || '',
      price_6m: product.price_6m || '',
      price_6m_usd: product.price_6m_usd || '',
      price_1y: product.price_1y || '',
      price_1y_usd: product.price_1y_usd || '',
      price_lifetime: product.price_lifetime || '',
      price_lifetime_usd: product.price_lifetime_usd || '',
      image: product.image,
      videoUrl: product.videoUrl || product.video_url || '',
      url: product.url || '',
      ctaText: product.ctaText || product.cta_text || 'Deploy Now',
      features: product.features || ['Infinite scaling', 'Real-time sync', 'Multi-tenant'],
      benefits: product.benefits || ['Accelerate growth', 'Simplify operations', 'Maximize revenue']
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setDeletingId(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-gray-900" /></div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(37,99,235,0.06)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-24 relative z-10 w-full">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-6 p-10 bg-white border border-gray-200 rounded-[40px] relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-blue-600" size={20} />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Administrative Terminal</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter">Inventory Control</h1>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <button
              onClick={() => {
                 setEditingId(null);
                 setIsModalOpen(true);
              }}
              className="px-8 py-4 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> New Deployment
            </button>
            <div className="hidden md:flex px-5 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              Level 1 Auth
            </div>
          </div>
        </div>

        {/* Top Level Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm flex items-center justify-between hover:border-gray-300 transition-colors">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Deployments</p>
                 <h3 className="text-4xl font-black text-gray-900">{products.length}</h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 ring-4 ring-blue-50/50">
                 <Package size={24} />
              </div>
           </div>
           <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm flex items-center justify-between hover:border-gray-300 transition-colors">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Health</p>
                 <h3 className="text-4xl font-black text-emerald-600">99.9%</h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 ring-4 ring-emerald-50/50">
                 <CheckCircle2 size={24} />
              </div>
           </div>
           <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm flex items-center justify-between hover:border-gray-300 transition-colors">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Queries</p>
                 <h3 className="text-4xl font-black text-purple-600">4,281</h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 ring-4 ring-purple-50/50">
                 <Sparkles size={24} />
              </div>
           </div>
        </div>

        {/* ── Tab Switcher ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === 'inventory'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            <LayoutGrid size={14} /> Inventory
          </button>
          <button
            onClick={() => { setActiveTab('reorder'); setReorderItems([...products]); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === 'reorder'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            <ArrowUpDown size={14} /> Reorder Hub
          </button>
        </div>

        {/* ── Reorder Hub Tab ─────────────────────────────────────────────── */}
        {activeTab === 'reorder' && (
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase flex items-center gap-3">
                  <ArrowUpDown size={18} className="text-blue-600" /> Reorder Hub
                </h2>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">Drag rows to set display order. Hit Save to push changes live.</p>
              </div>
              <button
                onClick={saveOrder}
                disabled={savingOrder}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:opacity-60 ${
                  orderSaved
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30'
                }`}
              >
                {savingOrder ? (
                  <><Loader2 size={14} className="animate-spin" /> Saving...</>
                ) : orderSaved ? (
                  <><CheckCheck size={14} /> Saved!</>
                ) : (
                  <><Save size={14} /> Save Order</>
                )}
              </button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
                  ))}
                </div>
              ) : reorderItems.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={reorderItems.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {reorderItems.map((product, index) => (
                        <SortableProductRow key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="py-24 text-center flex flex-col items-center">
                  <Package size={40} className="text-gray-300 mb-4" />
                  <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">No products to reorder</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Inventory Tab ────────────────────────────────────────────────── */}
        {activeTab === 'inventory' && (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
           <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase flex items-center gap-4">
                Active Deployments
                {products.length > 0 && <span className="text-[10px] text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{products.length}</span>}
              </h2>
           </div>
           <div className="p-8">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-28 bg-gray-50/50 animate-pulse rounded-[24px] border border-gray-100" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="p-6 bg-white border border-gray-100 rounded-[32px] flex flex-col gap-6 group hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img src={product.image} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" referrerPolicy="no-referrer" alt="" />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em]">{product.category}</span>
                            <span className="text-[8px] font-mono text-gray-400">#{product.id.slice(0, 4)}</span>
                          </div>
                          <h3 className="text-lg font-black text-gray-900 tracking-tighter truncate">{product.title}</h3>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        {deletingId === product.id ? (
                          <div className="flex items-center gap-2 w-full animate-in fade-in">
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-[9px] hover:bg-red-700 transition-all shadow-md active:scale-95"
                            >
                              Purge!
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 flex items-center justify-center hover:text-gray-900 transition-all active:scale-95"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="text-[10px] font-black text-gray-500">₹{product.price || '0'}</div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEdit(product)}
                                className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                                title="Edit Blueprint"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeletingId(product.id)}
                                className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                title="Purge Solution"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center flex flex-col items-center justify-center">
                  <Package size={48} className="text-gray-300 mb-6" />
                  <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">NO REMOTE DEPLOYMENTS DETECTED</p>
                </div>
              )}
           </div>
        </div>
        )} {/* end inventory tab */}
      </div>

      {/* Stunning Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleResetForm}
              className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl my-auto bg-white border border-gray-200 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="sticky top-0 z-20 flex items-center justify-between p-8 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  {editingId ? 'Edit Solution' : 'New Deployment'}
                </h2>
                <button
                  onClick={handleResetForm}
                  className="w-12 h-12 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto">
                <form id="product-form" onSubmit={handleSaveProduct} className="space-y-8">

                  {/* ─── Section 1: Product Info ─── */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600">1</div>
                      <h3 className="text-sm font-bold text-gray-800">Product Information</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Product Name *</label>
                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. ChatGPT Plus"
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Category</label>
                          {!useCustomCategory ? (
                            <select value={formData.category}
                              onChange={e => { if (e.target.value === '__custom__') { setUseCustomCategory(true); setFormData({ ...formData, category: '' }); } else { setFormData({ ...formData, category: e.target.value }); } }}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
                              {['AI & Writing', 'Graphic Design', 'Video Editing', 'SEO & Marketing', 'Learning', 'Stock & Media', 'Entertainment'].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="__custom__">✏️ Custom...</option>
                            </select>
                          ) : (
                            <div className="flex gap-2">
                              <input required autoFocus value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Type custom category..."
                                className="flex-1 bg-white border border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                              <button type="button" onClick={() => { setUseCustomCategory(false); setFormData({ ...formData, category: 'AI & Writing' }); }}
                                className="px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-700 text-xs font-semibold transition-all">✕</button>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Logo / Domain</label>
                          <input type="text" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="e.g. openai.com"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-mono placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Description *</label>
                        <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief product description..."
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
                      </div>
                    </div>
                  </div>

                  {/* ─── Section 2: Media ─── */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">2</div>
                      <h3 className="text-sm font-bold text-gray-800">Media</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Cover Image URL</label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                          <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..."
                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 font-mono placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                        {formData.image && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <img src={formData.image} className="w-full h-28 object-cover" alt="preview" onError={e => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">YouTube URL <span className="text-gray-400">(optional)</span></label>
                        <div className="relative">
                          <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                          <input type="text" value={formData.videoUrl} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} placeholder="https://youtube.com/..."
                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 font-mono placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─── Section 3: Pricing ─── */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-600">3</div>
                      <h3 className="text-sm font-bold text-gray-800">Pricing</h3>
                    </div>
                    <p className="text-[11px] text-gray-400 mb-5 ml-[34px]">Set INR for Indian customers, USD for international. Leave blank to hide a plan.</p>

                    {/* Base price row */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Base Price — 🇮🇳 INR *</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                          <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="999"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Base Price — 🌍 USD</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                          <input type="number" value={formData.price_usd} onChange={e => setFormData({ ...formData, price_usd: e.target.value })} placeholder="9.99"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Validity pricing table */}
                    <div className="rounded-2xl border border-gray-200 overflow-hidden">
                      {/* Header */}
                      <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-gray-50 border-b border-gray-200">
                        <div className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Validity Plan</div>
                        <div className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">🇮🇳 INR (₹)</div>
                        <div className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">🌍 USD ($)</div>
                      </div>
                      {/* Rows */}
                      {[
                        { key: 'price_1m', label: '1 Month' },
                        { key: 'price_3m', label: '3 Months' },
                        { key: 'price_6m', label: '6 Months' },
                        { key: 'price_1y', label: '1 Year' },
                        { key: 'price_lifetime', label: 'Lifetime ∞', isLifetime: true },
                      ].map(({ key, label, isLifetime }) => (
                        <div key={key} className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-gray-100 last:border-0 items-center">
                          <div className={`px-4 py-3 text-sm font-semibold ${isLifetime ? 'text-emerald-700' : 'text-gray-700'}`}>{label}</div>
                          <div className="px-3 py-2">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">₹</span>
                              <input type="number" value={(formData as any)[key]} onChange={e => setFormData({ ...formData, [key]: e.target.value } as any)} placeholder="—"
                                className="w-full bg-white border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                            </div>
                          </div>
                          <div className="px-3 py-2">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">$</span>
                              <input type="number" value={(formData as any)[`${key}_usd`]} onChange={e => setFormData({ ...formData, [`${key}_usd`]: e.target.value } as any)} placeholder="—"
                                className="w-full bg-white border border-gray-200 rounded-lg pl-6 pr-2 py-2 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Trending toggle */}
                    <label className="flex items-center gap-3 mt-5 cursor-pointer p-3.5 border border-gray-200 rounded-xl bg-white hover:border-blue-400 transition-all">
                      <input type="checkbox" checked={formData.is_trending || false} onChange={e => setFormData({ ...formData, is_trending: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Mark as Trending</span>
                    </label>
                  </div>

                  {/* ─── Section 4: Features & Benefits ─── */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600">4</div>
                      <h3 className="text-sm font-bold text-gray-800">Features & Benefits</h3>
                    </div>

                  {/* Arrays */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Features</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                          className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                      {formData.features.map((f, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={f}
                            onChange={e => {
                              const newF = [...formData.features];
                              newF[i] = e.target.value;
                              setFormData({ ...formData, features: newF });
                            }}
                            className="flex-grow bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, features: formData.features.filter((_, idx) => idx !== i) })}
                            className="p-3 text-red-400 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100 rounded-xl"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Benefits</label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, benefits: [...formData.benefits, ''] })}
                          className="text-[9px] font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest flex items-center gap-1"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                      {formData.benefits.map((b, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={b}
                            onChange={e => {
                              const newB = [...formData.benefits];
                              newB[i] = e.target.value;
                              setFormData({ ...formData, benefits: newB });
                            }}
                            className="flex-grow bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-gray-900 text-xs focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, benefits: formData.benefits.filter((_, idx) => idx !== i) })}
                            className="p-3 text-red-400 hover:text-red-600 transition-colors bg-red-50 hover:bg-red-100 rounded-xl"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-600 text-[10px] font-black uppercase tracking-widest">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                </form>
              </div>

              <div className="sticky bottom-0 z-20 p-6 md:p-8 border-t border-gray-100 bg-white/90 backdrop-blur-xl">
                <button
                  type="submit"
                  form="product-form"
                  disabled={submitting}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm tracking-wide hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      {editingId ? 'Save Changes' : 'Add Product'}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
