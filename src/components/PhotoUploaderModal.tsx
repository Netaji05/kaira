import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Check, RefreshCw, Plus, Sparkles, Trash2, Camera, ShieldCheck, Info } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { formatPrice } from '../utils/whatsapp';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProductImage: (productId: string, mainImage: string, hoverImage?: string) => void;
  onAddCustomProduct: (newProduct: Product) => void;
  onResetAllImages: () => void;
}

export const PhotoUploaderModal: React.FC<PhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProductImage,
  onAddCustomProduct,
  onResetAllImages,
}) => {
  const [activeTab, setActiveTab] = useState<'update' | 'add' | 'guide'>('update');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  
  // Update state
  const [imageUrl, setImageUrl] = useState<string>('');
  const [hoverImageUrl, setHoverImageUrl] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add new product state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('necklaces');
  const [newPrice, setNewPrice] = useState('399');
  const [newMrp, setNewMrp] = useState('999');
  const [newImage, setNewImage] = useState('');
  const [newHoverImage, setNewHoverImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // File Upload Handler (Converts file to Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'hover' | 'newMain' | 'newHover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (warn if > 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size is over 5MB. Please choose a slightly smaller photo for best performance.');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (target === 'main') setImageUrl(result);
        if (target === 'hover') setHoverImageUrl(result);
        if (target === 'newMain') setNewImage(result);
        if (target === 'newHover') setNewHoverImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    const finalMain = imageUrl.trim() || currentProduct.image;
    const finalHover = hoverImageUrl.trim() || currentProduct.hoverImage;

    onUpdateProductImage(currentProduct.id, finalMain, finalHover);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newImage.trim()) {
      alert('Please provide at least a Product Name and a Photo!');
      return;
    }

    const created: Product = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      price: parseFloat(newPrice) || 399,
      mrp: parseFloat(newMrp) || 999,
      rating: 5.0,
      reviewCount: 1,
      image: newImage,
      hoverImage: newHoverImage || newImage,
      description: newDesc.trim() || `${newName} - Real 18k Gold Plated Anti-Tarnish Jewelry.`,
      tags: ['18k Gold Plated', 'Real Photo', 'Waterproof', 'New Arrival'],
      specs: {
        material: '316L Stainless Steel',
        plating: '18k Real Gold Plating',
        warranty: '1 Year Anti-Tarnish Guarantee',
        waterproof: true,
      },
      isNew: true,
      inStock: true,
    };

    onAddCustomProduct(created);
    setAddSuccess(true);
    setNewName('');
    setNewImage('');
    setNewHoverImage('');
    setNewDesc('');
    setTimeout(() => setAddSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-[#FAF7F2] border border-[#E0D3B5] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FAF7F2]/95 backdrop-blur-md p-5 border-b border-[#E0D3B5] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F3EBDA] rounded-xl border border-[#C59B27]/40 text-[#C59B27]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">Upload Real Jewellery Pictures</h2>
                <span className="text-[10px] bg-[#2C241D] text-[#DFBA53] px-2 py-0.5 rounded-full font-semibold border border-[#C59B27]/30">
                  kairajewelry.in Manager
                </span>
              </div>
              <p className="text-xs text-stone-500">Add your actual studio product photos directly to the store catalog</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EBDA] text-stone-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-4 flex border-b border-[#E0D3B5] gap-2">
          <button
            onClick={() => setActiveTab('update')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'update'
                ? 'border-[#C59B27] text-[#8C6418]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Update Existing Item Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-[#C59B27] text-[#8C6418]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand New Jewellery Item</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-[#C59B27] text-[#8C6418]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Upload Tips</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {activeTab === 'update' && (
            <form onSubmit={handleApplyUpdate} className="space-y-5">
              {/* Product Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
                  1. Select Jewellery Item to Change Photo
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setImageUrl('');
                    setHoverImageUrl('');
                  }}
                  className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current vs New Image Preview */}
              {currentProduct && (
                <div className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#E0D3B5] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>Selected Item Preview:</span>
                    <span className="text-[#8C6418] font-serif">{currentProduct.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Active Main Image */}
                    <div className="space-y-1.5 text-center">
                      <span className="text-[10px] text-stone-500 font-bold uppercase">Main Display Photo</span>
                      <div className="aspect-square bg-white rounded-xl overflow-hidden border border-[#E0D3B5] shadow-inner relative group">
                        <img
                          src={imageUrl || currentProduct.image}
                          alt={currentProduct.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {imageUrl && (
                          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            New Upload
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active Hover Image */}
                    <div className="space-y-1.5 text-center">
                      <span className="text-[10px] text-stone-500 font-bold uppercase">Hover / Angle Photo</span>
                      <div className="aspect-square bg-white rounded-xl overflow-hidden border border-[#E0D3B5] shadow-inner relative group">
                        <img
                          src={hoverImageUrl || currentProduct.hoverImage || currentProduct.image}
                          alt={`${currentProduct.name} Hover`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {hoverImageUrl && (
                          <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            New Upload
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload controls */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                  2. Choose Real Photo Source
                </label>

                {/* Option A: Device File Upload */}
                <div className="border-2 border-dashed border-[#C59B27]/40 rounded-2xl p-4 bg-[#FAF7F2] text-center space-y-2 hover:bg-[#F3EBDA]/50 transition-colors">
                  <Upload className="w-6 h-6 text-[#C59B27] mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-stone-900">Upload Photo File from Device</p>
                    <p className="text-[11px] text-stone-500">Pick picture from your camera gallery, phone, or laptop</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <label className="cursor-pointer bg-[#2C241D] hover:bg-black text-[#DFBA53] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#C59B27]/30 transition-all inline-flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Select Main Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'main')}
                      />
                    </label>

                    <label className="cursor-pointer bg-[#F3EBDA] hover:bg-[#EAE0CA] text-[#7A5712] px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#D8C7A5] transition-all inline-flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Select Hover Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'hover')}
                      />
                    </label>
                  </div>
                </div>

                {/* Option B: Direct URL Input */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Or Paste Direct Image Link (URL)</span>
                  </p>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. https://my-cdn.com/my-jewellery-real-photo.jpg"
                    className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#B88E3E] via-[#A0772C] to-[#825C19] hover:brightness-110 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-[#DFBA53]/30 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Photo to {currentProduct?.name}</span>
                </button>

                <button
                  type="button"
                  onClick={onResetAllImages}
                  className="px-3 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Reset all images back to default"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="bg-emerald-900/90 text-emerald-100 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Real Jewellery Photo updated successfully on kairajewelry.in!</span>
                </div>
              )}
            </form>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleAddNewProduct} className="space-y-4">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider font-serif">
                Add New Real Item to Catalog
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Royal Butterfly 18k Gold Plated Choker"
                    className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  >
                    <option value="necklaces">Necklaces & Pendants</option>
                    <option value="earrings">Earrings & Studs</option>
                    <option value="bracelets">Bracelets & Cuffs</option>
                    <option value="rings">Rings & Bands</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>
              </div>

              {/* Photo Upload for New Item */}
              <div className="space-y-2 border-t border-[#E0D3B5] pt-3">
                <label className="block text-[11px] font-bold text-stone-800">
                  Real Jewellery Photo (Upload File or Paste Link) *
                </label>

                {newImage && (
                  <div className="w-24 h-24 bg-white rounded-xl overflow-hidden border border-[#E0D3B5] shadow-xs mx-auto">
                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex gap-2">
                  <label className="cursor-pointer bg-[#F3EBDA] hover:bg-[#EAE0CA] text-[#7A5712] px-3 py-2 rounded-xl text-xs font-bold border border-[#D8C7A5] flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'newMain')}
                    />
                  </label>

                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="or paste image URL link"
                    className="flex-1 bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Real 18k Gold Plated Anti-Tarnish Butterfly Choker necklace with 1 year guarantee."
                  className="w-full bg-[#F5F0E6] border border-[#E0D3B5] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#C59B27]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2C241D] hover:bg-black text-[#DFBA53] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-[#C59B27]/40 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Real Jewellery Item to kairajewelry.in</span>
              </button>

              {addSuccess && (
                <div className="bg-emerald-900/90 text-emerald-100 p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>New Real Item added to store!</span>
                </div>
              )}
            </form>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="bg-[#F3EBDA] border border-[#D8C7A5] p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-stone-900 flex items-center gap-1.5 font-serif text-sm">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  <span>How Real Photo Management Works</span>
                </h4>
                <p>
                  Any picture file you select from your phone or desktop is instantly saved locally inside your browser storage for <strong>kairajewelry.in</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-stone-900">Tips for Best Real Jewellery Pictures:</p>
                <ul className="list-disc pl-5 space-y-1 text-stone-600">
                  <li><strong>Lighting:</strong> Natural sunlight or warm ring light brings out the 18k real gold luster best.</li>
                  <li><strong>Background:</strong> Velvet trays, silk, beige satin, or clean white marble elevate the luxury feel.</li>
                  <li><strong>Aspect Ratio:</strong> Square photos (1:1 aspect ratio) work best for store grid cards.</li>
                  <li><strong>Hover Angles:</strong> Adding a second photo showing close-up details or on-model neck wear improves customer trust!</li>
                </ul>
              </div>

              <div className="p-3 bg-stone-200/60 rounded-xl text-[11px] text-stone-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>All photos updated via this modal reflect immediately across Product Cards, Cart, and Quick View!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F0E6] border-t border-[#E0D3B5] rounded-b-3xl flex items-center justify-between text-[11px] text-stone-600">
          <span>Official Store: <strong>kairajewelry.in</strong></span>
          <span className="text-[#8C6418] font-bold">18k Anti-Tarnish Collection</span>
        </div>
      </div>
    </div>
  );
};
