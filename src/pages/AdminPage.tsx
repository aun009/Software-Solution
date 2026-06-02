import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useProductStore } from '../store/useProductStore';
import { Plus, Trash2, Package, CheckCircle2, Loader2, AlertCircle, Sparkles, Edit2, X, Image as ImageIcon, Video, Trash, ArrowRight, GripVertical, LayoutGrid, ArrowUpDown, Save, CheckCheck, WandSparkles } from 'lucide-react';
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

const CATEGORY_OPTIONS = ['AI & Writing', 'Graphic Design', 'Video Editing', 'Marketing', 'Learning', 'Entertainment', 'Productivity'];

const DEFAULT_FORM_DATA = {
  title: '',
  description: '',
  category: 'AI & Writing',
  subcategory: '',
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
};

type Subcategory = {
  id: string;
  name: string;
  parent_category: string;
};

const normalizeDomain = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(withProtocol).hostname.replace(/^www\./, '');
  } catch {
    return trimmed.replace(/^https?:\/\//i, '').replace(/^www\./, '').split('/')[0];
  }
};

const avatarUrl = (title: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(title || 'SP')}&background=2563eb&color=fff&bold=true&size=256&format=svg`;

const logoUrlFromDomain = (domain: string) => {
  const normalized = normalizeDomain(domain);
  if (!normalized) return '';
  const token = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;
  return token
    ? `https://img.logo.dev/${normalized}?token=${token}&size=256&format=png`
    : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(normalized)}&sz=256`;
};

const productImageUrl = (product: any) => {
  if (product.image) return product.image;
  if (product.url) return logoUrlFromDomain(product.url);
  return avatarUrl(product.title);
};

const isMissingSchema = (err: any) => {
  const message = `${err?.message || ''} ${err?.details || ''} ${err?.hint || ''}`.toLowerCase();
  return err?.code === 'PGRST204' || err?.code === 'PGRST205' || message.includes('schema cache') || message.includes('could not find the table') || message.includes('could not find the');
};

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
        <img
          src={productImageUrl(product)}
          alt=""
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = avatarUrl(product.title);
          }}
        />
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
  const [notice, setNotice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'reorder' | 'subcategories'>('inventory');
  const [reorderItems, setReorderItems] = useState<any[]>([]);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [managerParentCategory, setManagerParentCategory] = useState('AI & Writing');
  const [managerSubcategoryName, setManagerSubcategoryName] = useState('');
  const [modalSubcategoryName, setModalSubcategoryName] = useState('');
  const [isCreatingSubcategory, setIsCreatingSubcategory] = useState(false);
  const [subcategoriesReady, setSubcategoriesReady] = useState(true);
  const [imagePreviewBroken, setImagePreviewBroken] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Form state
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const subcategoriesForCategory = (category: string) =>
    subcategories.filter(s => s.parent_category === category);

  const changeProductCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: subcategoriesForCategory(category).some(s => s.name === prev.subcategory) ? prev.subcategory : ''
    }));
  };

  const formChecks = [
    { label: 'Name', done: formData.title.trim().length > 1 },
    { label: 'Category', done: formData.category.trim().length > 0 },
    { label: 'Price', done: formData.price.toString().trim().length > 0 },
    { label: 'Image', done: !!formData.image.trim() || !!formData.url.trim() },
  ];

  const applyLogoFromDomain = () => {
    const generated = logoUrlFromDomain(formData.url);
    if (!generated) {
      setNotice('Enter a product domain first, then use the logo helper.');
      return;
    }
    setImagePreviewBroken(false);
    setFormData(prev => ({ ...prev, image: generated }));
    setNotice('Logo URL generated from the product domain.');
  };

  const applyFallbackImage = () => {
    setImagePreviewBroken(false);
    setFormData(prev => ({ ...prev, image: avatarUrl(prev.title) }));
    setNotice('Fallback initials image added.');
  };

  const fetchSubcategories = async () => {
    setLoadingSubcategories(true);
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setSubcategories(data || []);
      setSubcategoriesReady(true);
    } catch (err) {
      if (isMissingSchema(err)) {
        setSubcategories([]);
        setSubcategoriesReady(false);
        setNotice('Subcategory setup is not installed in Supabase yet. Products can still be saved without subcategories.');
      } else {
        console.error('Error fetching subcategories:', err);
        setError('Could not load subcategories. Check the Supabase subcategories table and policies.');
      }
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleCreateSubcategory = async (parentCategory: string, rawName: string, selectInForm = false) => {
    const name = rawName.trim().replace(/\s+/g, ' ');
    const parent = parentCategory.trim();
    if (!name || !parent) return;
    if (!subcategoriesReady) {
      setNotice('Subcategories are disabled until the Supabase schema migration is applied.');
      return;
    }

    const existing = subcategories.find(
      sub => sub.parent_category === parent && sub.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      if (selectInForm) {
        setFormData(prev => ({ ...prev, subcategory: existing.name }));
        setModalSubcategoryName('');
      } else {
        setManagerSubcategoryName('');
      }
      setError('');
      return;
    }

    try {
      setIsCreatingSubcategory(true);
      const { data, error } = await supabase
        .from('subcategories')
        .insert([{ name, parent_category: parent }])
        .select();

      if (error) throw error;

      if (selectInForm) {
        setModalSubcategoryName('');
      } else {
        setManagerSubcategoryName('');
      }
      await fetchSubcategories();
      
      if (data && data[0]) {
        if (selectInForm) {
          setFormData(prev => ({ ...prev, subcategory: data[0].name }));
        }
      }
    } catch (err: any) {
      if (isMissingSchema(err)) {
        setSubcategoriesReady(false);
        setNotice('Subcategories are not installed in Supabase yet. Apply the schema migration, then refresh.');
      } else {
        setError(err.message || 'Failed to create subcategory');
      }
    } finally {
      setIsCreatingSubcategory(false);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!subcategoriesReady) {
      setNotice('Subcategories are disabled until the Supabase schema migration is applied.');
      return;
    }
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      const deleted = subcategories.find(sub => sub.id === id);
      if (deleted?.name === formData.subcategory) {
        setFormData(prev => ({ ...prev, subcategory: '' }));
      }
      await fetchSubcategories();
    } catch (err: any) {
      if (isMissingSchema(err)) {
        setSubcategoriesReady(false);
        setNotice('Subcategories are not installed in Supabase yet. Apply the schema migration, then refresh.');
      } else {
        setError(err.message || 'Failed to delete subcategory');
      }
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchSubcategories();
    }
  }, [isAdmin]);

  useEffect(() => {
    setImagePreviewBroken(false);
  }, [formData.image]);

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
      if (oldIndex < 0 || newIndex < 0) return items;
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
    setNotice('');
    
    try {
      const payload: any = { ...formData };
      delete payload.ctaText;

      payload.title = payload.title.trim();
      payload.description = payload.description.trim();
      payload.category = payload.category.trim();
      payload.subcategory = payload.subcategory.trim() || null;
      payload.image = payload.image.trim();
      payload.videoUrl = payload.videoUrl.trim() || null;
      payload.url = payload.url.trim();
      payload.features = payload.features.map((item: string) => item.trim()).filter(Boolean);
      payload.benefits = payload.benefits.map((item: string) => item.trim()).filter(Boolean);

      if (!payload.category) {
        throw new Error('Please choose or enter a category.');
      }
      if (!payload.image || imagePreviewBroken) {
        payload.image = logoUrlFromDomain(payload.url) || avatarUrl(payload.title);
      }
      if (payload.features.length === 0) {
        payload.features = ['Easy setup'];
      }
      if (payload.benefits.length === 0) {
        payload.benefits = ['Simple to use'];
      }

      // Convert empty pricing fields to null so they are truly unset in the DB
      const pricingKeys = ['price_usd', 'price_1m', 'price_1m_usd', 'price_3m', 'price_3m_usd', 'price_6m', 'price_6m_usd', 'price_1y', 'price_1y_usd', 'price_lifetime', 'price_lifetime_usd'];
      pricingKeys.forEach(key => {
        if (payload[key] === '' || payload[key] === undefined) {
          payload[key] = null;
        }
      });

      const savePayload = { ...payload };
      if (!subcategoriesReady) delete savePayload.subcategory;

      const saveProduct = async (dataToSave: any) => {
        if (editingId) {
          return supabase.from('products').update(dataToSave).eq('id', editingId);
        }
        return supabase.from('products').insert([dataToSave]);
      };

      let { error } = await saveProduct(savePayload);
      if (error && isMissingSchema(error) && 'subcategory' in savePayload) {
        const retryPayload = { ...savePayload };
        delete retryPayload.subcategory;
        setSubcategoriesReady(false);
        setNotice('Product saved without subcategory because the Supabase column is not installed yet.');
        const retry = await saveProduct(retryPayload);
        error = retry.error;
      }
      if (error) throw error;

      handleResetForm();
      await Promise.all([fetchProducts(), refreshGlobalStore()]);
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
    setModalSubcategoryName('');
    setImagePreviewBroken(false);
    setError('');
    setFormData(DEFAULT_FORM_DATA);
  };

  const startCreate = () => {
    setEditingId(null);
    setUseCustomCategory(false);
    setModalSubcategoryName('');
    setImagePreviewBroken(false);
    setError('');
    setNotice('');
    setFormData(DEFAULT_FORM_DATA);
    setIsModalOpen(true);
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    const isCustom = !CATEGORY_OPTIONS.includes(product.category);
    setUseCustomCategory(isCustom);
    setModalSubcategoryName('');
    setImagePreviewBroken(false);
    setError('');
    setNotice('');
    setFormData({
      title: product.title || '',
      description: product.description || '',
      category: product.category || 'AI & Writing',
      subcategory: product.subcategory || '',
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
      image: product.image || '',
      videoUrl: product.videoUrl || product.video_url || '',
      url: product.url || '',
      ctaText: product.ctaText || product.cta_text || 'Deploy Now',
      is_trending: !!product.is_trending,
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
      await Promise.all([fetchProducts(), refreshGlobalStore()]);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 md:pt-36 pb-24 relative z-10 w-full">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 p-6 md:p-8 bg-white border border-gray-200 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="text-blue-600" size={20} />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Admin Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Product Manager</h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">Add products, set prices, choose categories, and control the store order.</p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={startCreate}
              className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Add Product
            </button>
            <div className="hidden md:flex px-4 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest">
              Admin Access
            </div>
          </div>
        </div>

        {/* Top Level Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
           <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between hover:border-gray-300 transition-colors">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Products</p>
                 <h3 className="text-4xl font-black text-gray-900">{products.length}</h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 ring-4 ring-blue-50/50">
                 <Package size={24} />
              </div>
           </div>
           <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between hover:border-gray-300 transition-colors">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trending</p>
                 <h3 className="text-4xl font-black text-emerald-600">{products.filter(product => product.is_trending).length}</h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 ring-4 ring-emerald-50/50">
                 <CheckCircle2 size={24} />
              </div>
           </div>
           <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-between hover:border-gray-300 transition-colors">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subcategories</p>
                 <h3 className="text-4xl font-black text-purple-600">{subcategories.length}</h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 ring-4 ring-purple-50/50">
                 <Sparkles size={24} />
              </div>
           </div>
        </div>

        {/* ── Tab Switcher ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === 'inventory'
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            <LayoutGrid size={14} /> Products
          </button>
          <button
            onClick={() => { setActiveTab('reorder'); setReorderItems([...products]); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === 'reorder'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            <ArrowUpDown size={14} /> Sort Order
          </button>
          <button
            onClick={() => setActiveTab('subcategories')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
              activeTab === 'subcategories'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            <Plus size={14} /> Subcategories
          </button>
        </div>

        {/* ── Reorder Hub Tab ─────────────────────────────────────────────── */}
        {activeTab === 'reorder' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase flex items-center gap-3">
                  <ArrowUpDown size={18} className="text-blue-600" /> Product Order
                </h2>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">Drag products into the order customers should see, then save.</p>
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
           <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase flex items-center gap-4">
                Products
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
                    <div key={product.id} className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-6 group hover:border-blue-500/30 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img
                            src={productImageUrl(product)}
                            className="w-full h-full object-contain p-2 transition-all duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                            alt=""
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = avatarUrl(product.title);
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em]">{product.category === 'SEO & Marketing' ? 'Marketing' : product.category}</span>
                            {product.subcategory && (
                              <>
                                <span className="text-[8px] text-gray-300 font-semibold select-none">/</span>
                                <span className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.2em]">{product.subcategory}</span>
                              </>
                            )}
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
                              Delete
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
                                title="Edit product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => setDeletingId(product.id)}
                                className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
                                title="Delete product"
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
                  <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">No products yet</p>
                </div>
              )}
           </div>
        </div>
        )} {/* end inventory tab */}

        {/* ── Subcategories Tab ────────────────────────────────────────────── */}
        {activeTab === 'subcategories' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-widest uppercase flex items-center gap-3">
                  <Package size={18} className="text-purple-600" /> Subcategories
                </h2>
                <p className="text-[11px] text-gray-400 mt-1 font-medium">Pick a main category, then add the subcategory admins can choose from the product form.</p>
              </div>
            </div>
            
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Creator Form */}
              <div className="lg:col-span-1 space-y-6">
                {!subcategoriesReady && (
                  <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800">
                    <p className="text-xs font-black uppercase tracking-wider mb-1">Database setup needed</p>
                    <p className="text-xs font-semibold leading-relaxed">Run supabase_schema.sql in Supabase SQL Editor to enable subcategories and product ordering.</p>
                  </div>
                )}
                <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100/80">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 mb-4">Add Subcategory</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Main Category</label>
                      <select 
                        value={managerParentCategory} 
                        onChange={e => setManagerParentCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                      >
                        {CATEGORY_OPTIONS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Subcategory Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Email Marketing"
                        value={managerSubcategoryName} 
                        onChange={e => setManagerSubcategoryName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => handleCreateSubcategory(managerParentCategory, managerSubcategoryName)}
                      disabled={isCreatingSubcategory || !managerSubcategoryName.trim() || !subcategoriesReady}
                      className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-purple-600/10 active:scale-[0.98]"
                    >
                      {isCreatingSubcategory ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Plus size={12} />
                      )}
                      Create Subcategory
                    </button>
                  </div>
                </div>
              </div>

              {/* Subcategories List grouped by Parent Category */}
              <div className="lg:col-span-2 space-y-6">
                {loadingSubcategories ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {CATEGORY_OPTIONS.map(parentCat => {
                      const subs = subcategories.filter(s => s.parent_category === parentCat);
                      return (
                        <div key={parentCat} className="p-5 bg-white border border-gray-100 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest">{parentCat}</h4>
                            <span className="text-[10px] font-bold text-gray-400">{subs.length}</span>
                          </div>
                          {subs.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {subs.map(sub => (
                                <div key={sub.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200/50 transition-colors group">
                                  <span>{sub.name}</span>
                                  <button 
                                    onClick={() => handleDeleteSubcategory(sub.id)}
                                    className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer select-none text-[10px]"
                                    aria-label={`Delete ${sub.name}`}
                                  >
                                    x
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 font-medium">No subcategories yet.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
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
              className="relative w-full max-w-5xl my-auto bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="sticky top-0 z-20 flex items-center justify-between gap-4 p-5 md:p-7 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                  </div>
                  {editingId ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={handleResetForm}
                  className="w-11 h-11 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 md:p-7 max-h-[72vh] overflow-y-auto">
                <form id="product-form" onSubmit={handleSaveProduct} className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50/80 border border-gray-100 rounded-2xl">
                    {formChecks.map(check => (
                      <div key={check.label} className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${check.done ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-300 border border-gray-200'}`}>
                          <CheckCircle2 size={12} />
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider truncate ${check.done ? 'text-gray-700' : 'text-gray-400'}`}>{check.label}</span>
                      </div>
                    ))}
                  </div>

                  {notice && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700 text-xs font-bold">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{notice}</span>
                    </div>
                  )}

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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.25fr_1fr] gap-4">
                        <div className="min-w-0">
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Category</label>
                          {!useCustomCategory ? (
                            <select value={formData.category}
                              onChange={e => {
                                if (e.target.value === '__custom__') {
                                  setUseCustomCategory(true);
                                  changeProductCategory('');
                                } else {
                                  changeProductCategory(e.target.value);
                                }
                              }}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
                              {CATEGORY_OPTIONS.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                              <option value="__custom__">Custom category...</option>
                            </select>
                          ) : (
                            <div className="flex gap-2">
                              <input required autoFocus value={formData.category} onChange={e => changeProductCategory(e.target.value)} placeholder="Type custom category..."
                                className="flex-1 bg-white border border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                              <button type="button" onClick={() => { setUseCustomCategory(false); changeProductCategory('AI & Writing'); }}
                                className="px-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-700 text-xs font-semibold transition-all">x</button>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1.5 ml-0.5">
                            <label className="block text-[11px] font-semibold text-gray-500">Subcategory</label>
                            {!subcategoriesReady && (
                              <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">Setup needed</span>
                            )}
                          </div>
                          <div className="space-y-2">
                            <select value={formData.subcategory}
                              onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                              disabled={!formData.category || !subcategoriesReady}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer disabled:bg-gray-50 disabled:text-gray-400">
                              <option value="">No subcategory</option>
                              {subcategoriesForCategory(formData.category).map(sub => (
                                <option key={sub.id} value={sub.name}>{sub.name}</option>
                              ))}
                            </select>
                            
                            {/* Quick Add Inline */}
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                              <input 
                                type="text"
                                placeholder={subcategoriesReady ? (formData.category ? 'Add one for this category' : 'Choose category first') : 'Apply schema first'}
                                value={modalSubcategoryName}
                                onChange={e => setModalSubcategoryName(e.target.value)}
                                disabled={!formData.category || !subcategoriesReady}
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 transition-all disabled:bg-gray-50"
                              />
                              <button
                                type="button"
                                onClick={() => handleCreateSubcategory(formData.category, modalSubcategoryName, true)}
                                disabled={isCreatingSubcategory || !modalSubcategoryName.trim() || !formData.category || !subcategoriesReady}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-1 whitespace-nowrap"
                              >
                                {isCreatingSubcategory ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0">
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Logo / Domain</label>
                          <input type="text" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} onBlur={() => {
                            if (!formData.image.trim() && formData.url.trim()) setFormData(prev => ({ ...prev, image: logoUrlFromDomain(prev.url) || prev.image }));
                          }} placeholder="e.g. openai.com"
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
                        <div className="flex items-center justify-between gap-3 mb-1.5 ml-0.5">
                          <label className="block text-[11px] font-semibold text-gray-500">Cover Image URL</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={applyLogoFromDomain}
                              className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700"
                            >
                              <WandSparkles size={11} /> Use Logo
                            </button>
                            <button
                              type="button"
                              onClick={applyFallbackImage}
                              className="text-[9px] font-black uppercase tracking-wider text-gray-500 hover:text-gray-800"
                            >
                              Use Initials
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                          <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..."
                            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 font-mono placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                        {(formData.image || formData.url || formData.title) && (
                          <div className={`mt-3 rounded-xl overflow-hidden border shadow-sm bg-gray-50 ${imagePreviewBroken ? 'border-amber-200' : 'border-gray-100'}`}>
                            <div className="h-32 flex items-center justify-center p-4">
                              <img
                                src={formData.image || logoUrlFromDomain(formData.url) || avatarUrl(formData.title)}
                                className="max-h-full max-w-full object-contain"
                                alt="preview"
                                referrerPolicy="no-referrer"
                                onLoad={() => setImagePreviewBroken(false)}
                                onError={e => {
                                  e.currentTarget.onerror = null;
                                  setImagePreviewBroken(true);
                                  e.currentTarget.src = avatarUrl(formData.title);
                                }}
                              />
                            </div>
                            {imagePreviewBroken && (
                              <div className="px-3 py-2 bg-amber-50 border-t border-amber-100 text-[10px] font-bold text-amber-700">
                                Image URL did not load. A safe fallback will be saved.
                              </div>
                            )}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Base Price - INR *</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">₹</span>
                          <input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="999"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1.5 ml-0.5">Base Price - USD</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
                          <input type="number" value={formData.price_usd} onChange={e => setFormData({ ...formData, price_usd: e.target.value })} placeholder="9.99"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                    </div>

                    {/* Validity pricing table */}
                    <div className="rounded-2xl border border-gray-200 overflow-x-auto">
                      <div className="min-w-[560px]">
                      {/* Header */}
                      <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-gray-50 border-b border-gray-200">
                        <div className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Validity Plan</div>
                        <div className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">INR (₹)</div>
                        <div className="px-4 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">USD ($)</div>
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
