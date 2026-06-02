"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Save, X, Loader2, LayoutGrid
} from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/app/actions/category';

export default function CategoriesManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const data = await getCategories();
    setCategories(data);
    setIsLoading(false);
  };

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let res;
    if (editingCategory) {
      res = await updateCategory(editingCategory.id, formData);
    } else {
      res = await createCategory(formData);
    }

    if (res.success) {
      await fetchCategories();
      handleCloseModal();
    } else {
      alert('Error saving category: ' + res.error);
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const res = await deleteCategory(id);
      if (res.success) {
        await fetchCategories();
      } else {
        alert('Error deleting category: ' + res.error);
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Product Categories</h1>
          <p className="text-neutral-400 mt-1">Manage categories for your products.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neon-purple hover:bg-violet text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 bg-[#0a0a0a]">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-purple transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] text-neutral-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-neon-purple animate-spin mx-auto" />
                    <p className="text-neutral-500 mt-2 text-sm">Loading categories...</p>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <LayoutGrid className="w-6 h-6 text-neutral-700" />
                    </div>
                    <p className="text-neutral-400 font-medium">No categories found</p>
                    <p className="text-neutral-500 text-sm">Try a different search or add a new category.</p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-400">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(category)}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={handleCloseModal} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                    setFormData({ ...formData, name, slug });
                  }}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-all"
                  placeholder="e.g. Legendary Cues"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Slug</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-[#111] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-purple transition-all"
                  placeholder="e.g. legendary-cues"
                />
                <p className="text-[11px] text-neutral-500">Used in URLs. Should be lowercase with hyphens.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neon-purple hover:bg-violet text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(157,78,221,0.3)] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
