import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Package, CheckCircle2, Loader2, AlertCircle, Sparkles, Edit2, X, DollarSign, Image as ImageIcon, Video, Trash, ArrowRight, UploadCloud, Link as LinkIcon, Clock, Infinity } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageUploading, setImageUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AI & Writing',
    price: '',
    price_1m: '',
    price_3m: '',
    price_6m: '',
    price_1y: '',
    price_lifetime: '',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000',
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
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const payload: any = { ...formData };
      delete payload.ctaText;

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
    setImageTab('upload');
    setFormData({
      title: '',
      description: '',
      category: 'AI & Writing',
      price: '',
      price_1m: '',
      price_3m: '',
      price_6m: '',
      price_1y: '',
      price_lifetime: '',
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000',
      videoUrl: '',
      url: '',
      ctaText: 'Deploy Now',
      features: ['Infinite scaling', 'Real-time sync', 'Multi-tenant'],
      benefits: ['Accelerate growth', 'Simplify operations', 'Maximize revenue']
    });
  };

  // Upload image to Supabase Storage bucket 'product-images'
  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload a valid image file.'); return; }
    setImageUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { upsert: false, contentType: file.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
    } catch (err: any) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setImageUploading(false);
    }
  }, []);

  const startEdit = (product: any) => {
    setEditingId(product.id);
    const presets = ['AI & Writing', 'Graphic Design', 'Video Editing', 'SEO & Marketing', 'Learning', 'Stock & Media', 'Entertainment'];
    const isCustom = !presets.includes(product.category);
    setUseCustomCategory(isCustom);
    // If product has an existing image URL, switch to URL tab for editing
    setImageTab(product.image ? 'url' : 'upload');
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price || '',
      price_1m: product.price_1m || '',
      price_3m: product.price_3m || '',
      price_6m: product.price_6m || '',
      price_1y: product.price_1y || '',
      price_lifetime: product.price_lifetime || '',
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

        {/* Active Inventory Grid - Full Width */}
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

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <form id="product-form" onSubmit={handleSaveProduct} className="space-y-10">
                  {/* Base Info */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Solution Identity</label>
                      <input
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Product Title"
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Matrix Category</label>
                      {!useCustomCategory ? (
                        <select
                          value={formData.category}
                          onChange={e => {
                            if (e.target.value === '__custom__') {
                              setUseCustomCategory(true);
                              setFormData({ ...formData, category: '' });
                            } else {
                              setFormData({ ...formData, category: e.target.value });
                            }
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold cursor-pointer"
                        >
                          {['AI & Writing', 'Graphic Design', 'Video Editing', 'SEO & Marketing', 'Learning', 'Stock & Media', 'Entertainment'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="__custom__">✏️ Custom...</option>
                        </select>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            required
                            autoFocus
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Type custom category..."
                            className="flex-1 bg-gray-50 border border-blue-400 rounded-2xl py-4 px-5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-bold placeholder:text-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => { setUseCustomCategory(false); setFormData({ ...formData, category: 'AI & Writing' }); }}
                            className="px-4 rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 hover:text-gray-700 text-xs font-bold transition-all"
                            title="Back to presets"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Intelligence Abstract</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief architectural overview..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium resize-none placeholder:text-gray-300"
                    />
                  </div>

                  {/* Pricing & Media */}
                  <div className="grid md:grid-cols-2 gap-8 p-6 bg-gray-50/50 rounded-[32px] border border-gray-100">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price Unit (₹)</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number"
                          required
                          value={formData.price}
                          onChange={e => setFormData({ ...formData, price: e.target.value })}
                          placeholder="999"
                          className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 transition-all font-bold"
                        />
                      </div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mt-6 block">Logo (Domain or Image URL)</label>
                      <div className="relative">
                        <ArrowRight className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                           type="text"
                           value={formData.url}
                           onChange={e => setFormData({ ...formData, url: e.target.value })}
                           placeholder="Domain (e.g. meta.com)"
                           className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
                        />
                      </div>
                      <label className="flex items-center gap-3 mt-4 cursor-pointer p-4 border border-gray-200 rounded-2xl bg-white hover:border-blue-500 transition-all">
                        <input
                          type="checkbox"
                          checked={formData.is_trending || false}
                          onChange={e => setFormData({ ...formData, is_trending: e.target.checked })}
                          className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[12px] font-bold text-gray-700 uppercase tracking-widest">Mark as Trending</span>
                      </label>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Media Assets</label>
                       <div className="space-y-3">
                         {/* Image upload — dual mode tabs */}
                         <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                           {/* Tab switcher */}
                           <div className="flex border-b border-gray-100">
                             <button type="button" onClick={() => setImageTab('upload')}
                               className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors ${
                                 imageTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-700'}`}>
                               <UploadCloud size={12} /> Drag & Drop
                             </button>
                             <button type="button" onClick={() => setImageTab('url')}
                               className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors ${
                                 imageTab === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-gray-700'}`}>
                               <LinkIcon size={12} /> Paste URL
                             </button>
                           </div>

                           {imageTab === 'upload' ? (
                             <div
                               onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                               onDragLeave={() => setDragOver(false)}
                               onDrop={e => {
                                 e.preventDefault(); setDragOver(false);
                                 const file = e.dataTransfer.files[0];
                                 if (file) handleImageUpload(file);
                               }}
                               onClick={() => fileInputRef.current?.click()}
                               className={`relative flex flex-col items-center justify-center gap-2 p-5 cursor-pointer transition-all min-h-[110px] ${
                                 dragOver ? 'bg-blue-50 border-blue-400' : 'bg-gray-50/60 hover:bg-gray-50'}`}
                             >
                               <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                                 onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                               {imageUploading ? (
                                 <><Loader2 size={22} className="animate-spin text-blue-500" />
                                 <span className="text-[11px] text-blue-500 font-bold">Uploading to Supabase...</span></>
                               ) : formData.image && formData.image.includes('supabase') ? (
                                 <><img src={formData.image} className="h-16 w-full object-cover rounded-xl" alt="preview" />
                                 <span className="text-[10px] text-emerald-600 font-bold">✓ Uploaded! Click to change.</span></>
                               ) : (
                                 <><UploadCloud size={22} className={dragOver ? 'text-blue-500' : 'text-gray-300'} />
                                 <span className="text-[11px] text-gray-400 font-semibold text-center">Drop image here or <span className="text-blue-500 font-bold">click to browse</span></span>
                                 <span className="text-[9px] text-gray-300 font-medium">PNG, JPG, WEBP — uploaded to Supabase Storage</span></>
                               )}
                             </div>
                           ) : (
                             <div className="p-3">
                               <div className="relative">
                                 <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                                 <input type="text" value={formData.image}
                                   onChange={e => setFormData({ ...formData, image: e.target.value })}
                                   placeholder="https://example.com/image.jpg"
                                   className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 text-xs focus:outline-none focus:border-blue-500 transition-all font-mono" />
                               </div>
                               {formData.image && (
                                 <img src={formData.image} className="mt-2 h-14 w-full object-cover rounded-xl border border-gray-100" alt="preview"
                                   onError={e => (e.currentTarget.style.display = 'none')} />
                               )}
                             </div>
                           )}
                         </div>

                         <div className="relative">
                           <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                           <input
                             type="text"
                             value={formData.videoUrl}
                             onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                             placeholder="YouTube Video URL (Optional)"
                             className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-5 text-gray-900 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
                           />
                         </div>
                       </div>
                     </div>
                  </div>

                   {/* Validity Pricing */}
                   <div className="space-y-4 p-6 bg-gray-50/50 rounded-[28px] border border-gray-100">
                     <div className="flex items-center gap-2 mb-1">
                       <Clock size={14} className="text-blue-500" />
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Validity Pricing (₹) — Leave blank to hide</label>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                       {[
                         { key: 'price_1m', label: '1 Month' },
                         { key: 'price_3m', label: '3 Months' },
                         { key: 'price_6m', label: '6 Months' },
                         { key: 'price_1y', label: '1 Year' },
                         { key: 'price_lifetime', label: 'Lifetime', icon: true },
                       ].map(({ key, label, icon }) => (
                         <div key={key} className="space-y-1.5">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                             {icon ? <Infinity size={9} className="text-emerald-500" /> : null}{label}
                           </label>
                           <div className="relative">
                             <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                             <input
                               type="number"
                               value={(formData as any)[key]}
                               onChange={e => setFormData({ ...formData, [key]: e.target.value } as any)}
                               placeholder="—"
                               className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-7 pr-3 text-gray-900 text-sm focus:outline-none focus:border-blue-500 transition-all font-bold"
                             />
                           </div>
                         </div>
                       ))}
                     </div>
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
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-[.2em] hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      {editingId ? 'Push Updates' : 'Establish Solution'}
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
