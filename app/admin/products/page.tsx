"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Search, Plus, Edit2, Trash2, Eye, EyeOff, MoreVertical, X, Check, Loader2, Upload
} from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/app/actions/product';
import { getCategories } from '@/app/actions/category';

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    description: '',
    imageUrl: '',
    stockStatus: 'In Stock',
    featured: false
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setDbCategories(data);
  };

  const categories = ['All', ...dbCategories.map(c => c.name)];

  const getSafeImageSrc = (src?: string | null) => {
    const value = (src ?? '').trim();

    if (!value) return '/hero-cues.png';
    if (value.startsWith('/')) return value;
    if (value.startsWith('http://') || value.startsWith('https://')) return value;

    return `/${value.replace(/^\.?\//, '')}`;
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      stockStatus: product.stockStatus || 'In Stock',
      featured: product.featured || false
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: dbCategories[0]?.name || '',
      price: '',
      originalPrice: '',
      description: '',
      imageUrl: '',
      stockStatus: 'In Stock',
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleUploadImage = async (file: File | null) => {
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const response = await fetch('/api/upload/product-image', {
        method: 'POST',
        body
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || 'Gagal upload gambar.');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: result.url
      }));
    } catch (error: any) {
      alert(error.message || 'Gagal upload gambar produk.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      description: formData.description,
      imageUrl: formData.imageUrl,
      stockStatus: formData.stockStatus,
      featured: formData.featured
    };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload);
      if (res.success) {
        await fetchProducts();
        setIsModalOpen(false);
      } else {
        alert("Failed to update product");
      }
    } else {
      const res = await createProduct({ id: `PROD-${Date.now()}`, ...payload });
      if (res.success) {
        await fetchProducts();
        setIsModalOpen(false);
      } else {
        alert("Failed to create product");
      }
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Products Management</h1>
          <p className="text-neutral-400 mt-1">Add, edit, or remove products from your store.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-neon-purple hover:bg-violet text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-neutral-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-400 uppercase bg-[#111] border-b border-neutral-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#1a1a1a] border border-neutral-800 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                          {product.imageUrl ? (
                            <Image src={getSafeImageSrc(product.imageUrl)} alt={product.name} fill style={{ objectFit: 'contain' }} className="p-1" />
                          ) : (
                            <span className="text-xs text-neutral-600 font-bold">{product.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white line-clamp-1">{product.name}</div>
                          {product.featured && <span className="text-[10px] text-neon-purple font-bold">FEATURED</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-xs font-medium text-neutral-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">Rp {product.price.toLocaleString('id-ID')}</div>
                      {product.originalPrice && (
                        <div className="text-xs text-neutral-500 line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                        ${product.stockStatus === 'In Stock' ? 'bg-emerald-500/10 text-emerald-500' : 
                          product.stockStatus === 'Low Stock' ? 'bg-orange-500/10 text-orange-500' : 
                          'bg-red-500/10 text-red-500'}
                      `}>
                        {product.stockStatus || 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-1.5 text-neutral-400 hover:text-blue-400 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#0a0a0a] border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10">
              <h2 className="text-xl font-bold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple" placeholder="e.g. 100M Coins" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple">
                    {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Selling Price (Rp)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple" placeholder="e.g. 50000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Original Price (Optional)</label>
                  <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple" placeholder="e.g. 75000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple" placeholder="Product details..." />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Product Image</label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-center gap-2 w-full bg-[#111] border border-dashed border-neutral-700 rounded-lg px-4 py-3 text-sm text-neutral-300 hover:border-neon-purple hover:text-white transition-colors cursor-pointer">
                      {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isUploadingImage ? 'Uploading gambar...' : 'Upload gambar produk'}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => handleUploadImage(e.target.files?.[0] || null)}
                      />
                    </label>

                    {formData.imageUrl && (
                      <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-[#111] px-3 py-2">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-neutral-700 bg-[#1a1a1a]">
                          <Image src={getSafeImageSrc(formData.imageUrl)} alt="Preview" fill style={{ objectFit: 'contain' }} className="p-1" />
                        </div>
                        <p className="text-[11px] text-neutral-400 break-all">{formData.imageUrl}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-300">Stock Status</label>
                  <select required value={formData.stockStatus} onChange={e => setFormData({...formData, stockStatus: e.target.value as any})} className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setFormData({...formData, featured: !formData.featured})} className={`w-12 h-6 rounded-full transition-colors relative ${formData.featured ? 'bg-neon-purple' : 'bg-neutral-800'}`}>
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <span className="text-sm text-neutral-300">Mark as Featured Product</span>
              </div>

              <div className="pt-6 border-t border-neutral-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white bg-transparent hover:bg-neutral-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving || isUploadingImage} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-neon-purple hover:bg-violet rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)] disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
