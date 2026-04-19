import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Package, CheckCircle2, Loader2, AlertCircle, Sparkles, Edit2, X, DollarSign, Image as ImageIcon, Video, Trash } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export const AdminPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Development',
    price: '',
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000',
    videoUrl: '',
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
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setProducts(items.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
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
      if (editingId) {
        // Update existing
        const docRef = doc(db, 'products', editingId);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
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
    setFormData({
      title: '',
      description: '',
      category: 'Development',
      price: '',
      image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=1000',
      videoUrl: '',
      ctaText: 'Deploy Now',
      features: ['Infinite scaling', 'Real-time sync', 'Multi-tenant'],
      benefits: ['Accelerate growth', 'Simplify operations', 'Maximize revenue']
    });
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price || '',
      image: product.image,
      videoUrl: product.videoUrl || '',
      ctaText: product.ctaText || 'Deploy Now',
      features: product.features || ['Infinite scaling', 'Real-time sync', 'Multi-tenant'],
      benefits: product.benefits || ['Accelerate growth', 'Simplify operations', 'Maximize revenue']
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setDeletingId(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-white" /></div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(37,99,235,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(147,51,234,0.08)_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-24 relative z-10">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 md:mb-24 gap-6 p-10 bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-[40px] relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-blue-600 dark:text-blue-500" size={20} />
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.4em]">Administrative Terminal</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter">Inventory Control</h1>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
               Level 1 Authorized
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
          {/* Product Creation Form */}
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-[48px] p-8 md:p-12 sticky top-32 shadow-xl dark:shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500">
                     {editingId ? <Edit2 size={24} /> : <Plus size={24} />}
                   </div>
                   {editingId ? 'Edit Solution' : 'New Deployment'}
                </h2>
                {editingId && (
                  <button 
                    onClick={handleResetForm}
                    className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white transition-all"
                    title="Cancel Edit"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Solution Identity</label>
                  <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Product Title"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl py-5 px-6 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all font-bold placeholder:text-gray-400 dark:placeholder:text-gray-800"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Intelligence Abstract</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief architectural overview..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl py-5 px-6 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all font-medium resize-none placeholder:text-gray-400 dark:placeholder:text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Matrix Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/5 rounded-2xl py-5 px-6 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all font-bold appearance-none cursor-pointer"
                    >
                      {['AI Writing', 'Generative Art', 'Development', 'Data Science', 'Productivity'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price Unit ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={18} />
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        placeholder="999"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl py-5 pl-14 pr-6 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset Configuration</label>
                  <div className="grid gap-4">
                    <div className="relative">
                      <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input
                        type="text"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Image URL"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-[11px] focus:outline-none focus:border-white/20 transition-all font-mono"
                      />
                    </div>
                    <div className="relative">
                      <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="Video Embed URL (optional)"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white text-[11px] focus:outline-none focus:border-white/20 transition-all font-mono"
                      />
                    </div>
                    <input
                      value={formData.ctaText}
                      onChange={e => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder="CTA Label (e.g., Get Started)"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:border-white/20 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Technical Features</label>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, features: [...formData.features, '']})}
                        className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                      >
                        Add Feature
                      </button>
                    </div>
                    {formData.features.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={f}
                          onChange={e => {
                            const newF = [...formData.features];
                            newF[i] = e.target.value;
                            setFormData({...formData, features: newF});
                          }}
                          className="flex-grow bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-white/20 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, features: formData.features.filter((_, idx) => idx !== i)})}
                          className="p-3 text-red-500/50 hover:text-red-500 transition-colors"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Strategic Benefits</label>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, benefits: [...formData.benefits, '']})}
                        className="text-[9px] font-black text-purple-500 hover:text-purple-400 uppercase tracking-widest"
                      >
                        Add Benefit
                      </button>
                    </div>
                    {formData.benefits.map((b, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={b}
                          onChange={e => {
                            const newB = [...formData.benefits];
                            newB[i] = e.target.value;
                            setFormData({...formData, benefits: newB});
                          }}
                          className="flex-grow bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-white/20 transition-all"
                        />
                        <button 
                          type="button" 
                          onClick={() => setFormData({...formData, benefits: formData.benefits.filter((_, idx) => idx !== i)})}
                          className="p-3 text-red-500/50 hover:text-red-500 transition-colors"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-xs font-black uppercase tracking-widest">
                    <AlertCircle size={20} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-6 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[.2em] hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-white/5 active:scale-95"
                >
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      {editingId ? 'Push Updates' : 'Establish Solution'} 
                      <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Active Inventory Grid */}
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="space-y-8">
              <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-4 mb-10">
                 Active Deployments
                 {products.length > 0 && <span className="text-xs text-gray-700 bg-white/5 px-3 py-1 rounded-full">{products.length}</span>}
              </h2>
              
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 bg-white/5 animate-pulse rounded-[40px] border border-white/5" />
                ))
              ) : products.length > 0 ? (
                <div className="grid gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white/[0.04] hover:border-white/10 transition-all">
                      <div className="flex items-center gap-8 w-full">
                        <div className="w-24 h-24 rounded-3xl overflow-hidden bg-black border border-white/5 shrink-0 grayscale group-hover:grayscale-0 transition-all">
                          <img src={product.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{product.category}</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">{product.id.slice(0, 8)}</span>
                          </div>
                          <h3 className="text-2xl font-black text-white tracking-tighter truncate">{product.title}</h3>
                          <p className="text-gray-500 text-sm font-medium line-clamp-1 mt-1">{product.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0">
                        {deletingId === product.id ? (
                          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2">
                             <button
                               onClick={() => handleDeleteProduct(product.id)}
                               className="px-6 h-14 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95"
                             >
                               Confirm Purge
                             </button>
                             <button
                               onClick={() => setDeletingId(null)}
                               className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-gray-500 flex items-center justify-center hover:text-white transition-all active:scale-95"
                             >
                               <X size={20} />
                             </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(product)}
                              className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95"
                              title="Edit Blueprint"
                            >
                              <Edit2 size={24} />
                            </button>
                            <button
                              onClick={() => setDeletingId(product.id)}
                              className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                              title="Purge Solution"
                            >
                              <Trash2 size={24} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-48 text-center border border-dashed border-white/5 rounded-[48px] bg-white/[0.01]">
                  <Package size={64} className="text-gray-800 mx-auto mb-8 opacity-20" />
                  <p className="text-gray-700 font-black uppercase tracking-[0.4em] text-sm">NO REMOTE DEPLOYMENTS DETECTED</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
