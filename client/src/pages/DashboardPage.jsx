import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { PlusCircle, Package, ExternalLink, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FairTradeCalculator from '../components/FairTradeCalculator';
import ImageUploader from '../components/ImageUploader';
import ShareBar from '../components/ShareBar';
import api from '../api';

const MATERIALS_SUGGESTIONS = [
  'Pashmina wool', 'Silk thread', 'Teak wood', 'Rosewood', 'Terracotta clay',
  'Brass', 'Silver', 'Bamboo', 'Jute', 'Cotton', 'Indigo dye', 'Natural lac',
];

const emptyForm = {
  name: '', material: '', hours_worked: '', material_cost: '', final_price: '', story: '', image_url: '',
};

export default function DashboardPage() {
  const { artisan }   = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm]         = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]       = useState(null); // { type, message }
  const [qrProduct, setQrProduct] = useState(null); // product to show in QR modal
  const [activeTab, setActiveTab]  = useState('form'); // 'form' | 'products'
  const formRef = useRef(null);

  // Fetch my products on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/products/mine');
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApplyPrice = (price) => {
    setForm(prev => ({ ...prev, final_price: price }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    showToast('info', `Suggested fair price ₹${price.toLocaleString('en-IN')} applied to the form.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/products', form);
      setQrProduct(data.product);
      setForm(emptyForm);
      // Refresh product list
      const { data: listData } = await api.get('/products/mine');
      setProducts(listData.products || []);
      setActiveTab('products');
      showToast('success', `"${data.product.name}" has been registered with a Digital Birth Certificate!`);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to register product.');
    } finally {
      setSubmitting(false);
    }
  };

  const productUrl = (certId) =>
    `${window.location.origin}/product/${certId}`;

  return (
    <div className="min-h-screen bg-weave">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-start gap-3 px-4 py-3 rounded-sm shadow-warm-lg
                         animate-slide-up max-w-sm
                         ${toast.type === 'success' ? 'bg-forest text-cream' :
                           toast.type === 'error'   ? 'bg-red-700 text-cream' : 'bg-earth text-cream'}`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          <p className="font-body text-sm">{toast.message}</p>
        </div>
      )}

      {/* QR Modal */}
      {qrProduct && (
        <div className="fixed inset-0 bg-earth/60 z-50 flex items-center justify-center px-4"
             onClick={() => setQrProduct(null)}>
          <div className="bg-white rounded-sm shadow-warm-lg p-8 max-w-sm w-full text-center relative animate-slide-up"
               onClick={e => e.stopPropagation()}>
            <button onClick={() => setQrProduct(null)}
              className="absolute top-4 right-4 text-earth/40 hover:text-earth transition-colors">
              <X className="w-5 h-5" />
            </button>
            <p className="section-label mb-2">Digital Birth Certificate</p>
            <h3 className="font-display text-xl text-earth mb-4">{qrProduct.name}</h3>
            <div className="flex justify-center mb-4 p-4 border-2 border-gold rounded-sm inline-block">
              <QRCodeSVG
                value={productUrl(qrProduct.certificate_id)}
                size={180}
                fgColor="#4A2D18"
                bgColor="#FDF6EC"
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="font-mono text-xs text-earth/50 mb-4 break-all">
              {qrProduct.certificate_id}
            </p>
            <Link
              to={`/product/${qrProduct.certificate_id}`}
              target="_blank"
              className="btn-primary inline-flex items-center gap-2 text-sm mb-4"
            >
              View Story <ExternalLink className="w-4 h-4" />
            </Link>
            <div className="border-t border-earth/10 pt-4 w-full">
              <p className="section-label text-[10px] text-center mb-3">Share this product</p>
              <div className="flex justify-center">
                <ShareBar
                  compact
                  url={productUrl(qrProduct.certificate_id)}
                  productName={qrProduct.name}
                  artisanName={artisan?.name}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-earth text-cream py-10">
        <div className="max-w-6xl mx-auto px-4">
          <p className="section-label text-gold mb-1">Artisan Workspace</p>
          <h1 className="font-display text-3xl md:text-4xl mb-1">
            Namaste, {artisan?.name.split(' ')[0]} 🙏
          </h1>
          <p className="font-body text-cream/60 text-sm">
            {artisan?.craft} · {artisan?.village}, {artisan?.state}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab switcher */}
        <div className="flex gap-1 bg-earth/10 rounded-sm p-1 w-fit mb-8">
          {[['form', 'Register New Product'], ['products', `My Products (${products.length})`]].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-sm font-body text-sm font-bold transition-all ${
                activeTab === tab
                  ? 'bg-earth text-cream shadow-sm'
                  : 'text-earth/60 hover:text-earth'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* ─── TAB: Register Product ─── */}
        {activeTab === 'form' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2" ref={formRef}>
              <div className="card shadow-warm-lg">
                <div className="flex items-center gap-3 mb-6">
                  <PlusCircle className="w-6 h-6 text-saffron" />
                  <div>
                    <h2 className="font-display text-2xl text-earth">Register a Product</h2>
                    <p className="font-body text-earth/60 text-xs">
                      This creates a permanent Digital Birth Certificate for your craft.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="section-label text-[10px] block mb-1">Product Name *</label>
                    <input type="text" name="name" required value={form.name}
                      onChange={handleChange} placeholder="e.g. Hand-woven Pashmina Shawl"
                      className="input-field" />
                  </div>

                  <div>
                    <label className="section-label text-[10px] block mb-1">Materials Used *</label>
                    <input type="text" name="material" required value={form.material}
                      onChange={handleChange}
                      placeholder="e.g. 100% Pashmina wool, natural indigo dye"
                      className="input-field" />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {MATERIALS_SUGGESTIONS.map(m => (
                        <button key={m} type="button"
                          onClick={() => setForm(p => ({
                            ...p,
                            material: p.material ? `${p.material}, ${m}` : m
                          }))}
                          className="text-[10px] px-2 py-0.5 bg-earth/10 hover:bg-earth/20
                                     text-earth rounded-full font-body transition-colors">
                          + {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="section-label text-[10px] block mb-1">Time Taken (hours) *</label>
                      <input type="number" name="hours_worked" required min="0.5" step="0.5"
                        value={form.hours_worked} onChange={handleChange}
                        placeholder="e.g. 72"
                        className="input-field" />
                    </div>
                    <div>
                      <label className="section-label text-[10px] block mb-1">Material Cost (₹) *</label>
                      <input type="number" name="material_cost" required min="1"
                        value={form.material_cost} onChange={handleChange}
                        placeholder="e.g. 1200"
                        className="input-field" />
                    </div>
                  </div>

                  <div>
                    <label className="section-label text-[10px] block mb-1">Your Selling Price (₹) *</label>
                    <input type="number" name="final_price" required min="1"
                      value={form.final_price} onChange={handleChange}
                      placeholder="Use the calculator → to get a fair price"
                      className="input-field" />
                  </div>

                  <div>
                    <label className="section-label text-[10px] block mb-1">Product Photo</label>
                    <ImageUploader
                      onUpload={(url) => setForm(prev => ({ ...prev, image_url: url }))}
                      onClear={() => setForm(prev => ({ ...prev, image_url: '' }))}
                    />
                    <p className="font-body text-[10px] text-earth/40 mt-1">
                      A clear photo dramatically increases buyer trust. Recommended: natural daylight.
                    </p>
                  </div>

                  <div>
                    <label className="section-label text-[10px] block mb-1">The Story Behind This Piece *</label>
                    <textarea name="story" required rows={5} value={form.story}
                      onChange={handleChange}
                      placeholder="Tell the world about this product — what inspired you, how long your family has done this craft, what makes this piece special..."
                      className="input-field resize-none" />
                  </div>

                  <button type="submit" disabled={submitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Certificate...</>
                    ) : <>
                      <Package className="w-4 h-4" /> Register & Generate QR Certificate
                    </>}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FairTradeCalculator onApplyPrice={handleApplyPrice} />
              <div className="card bg-saffron/5 border-saffron/20">
                <p className="section-label text-[10px] mb-2">Pro Tip</p>
                <p className="font-body text-sm text-earth/70 leading-relaxed">
                  Use the calculator first, then click "Apply This Price" to auto-fill the form.
                  Your story is the most important field — buyers connect with it.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: My Products ─── */}
        {activeTab === 'products' && (
          <div>
            {products.length === 0 ? (
              <div className="card text-center py-16">
                <Package className="w-12 h-12 text-earth/20 mx-auto mb-4" />
                <h3 className="font-display text-xl text-earth mb-2">No products yet</h3>
                <p className="font-body text-earth/60 text-sm mb-6">
                  Register your first product to get a Digital Birth Certificate.
                </p>
                <button onClick={() => setActiveTab('form')} className="btn-primary">
                  Register First Product
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map(product => (
                  <div key={product.id} className="card hover:shadow-warm-lg transition-shadow group overflow-hidden p-0">
                    {/* Product image thumbnail */}
                    {product.image_url ? (
                      <div className="h-36 overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-24 bg-earth/5 flex items-center justify-center border-b border-earth/10">
                        <Package className="w-8 h-8 text-earth/15" />
                      </div>
                    )}
                    <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="section-label text-[10px] mb-0.5">{product.material.split(',')[0]}</p>
                        <h3 className="font-display text-lg text-earth leading-tight">{product.name}</h3>
                      </div>
                      <span className={`text-[10px] font-body font-bold px-2 py-1 rounded-full ${
                        product.is_sold ? 'bg-earth/20 text-earth' : 'bg-forest/10 text-forest'
                      }`}>
                        {product.is_sold ? 'Sold' : 'Available'}
                      </span>
                    </div>

                    <p className="font-body text-earth/60 text-sm line-clamp-2 mb-4">{product.story}</p>

                    <div className="grid grid-cols-2 gap-2 text-center mb-4">
                      <div className="bg-cream-dark rounded-sm p-2">
                        <p className="font-mono text-xs text-earth/50">Hours</p>
                        <p className="font-display text-earth font-semibold">{product.hours_worked}h</p>
                      </div>
                      <div className="bg-cream-dark rounded-sm p-2">
                        <p className="font-mono text-xs text-earth/50">Price</p>
                        <p className="font-display text-saffron font-semibold">
                          ₹{parseFloat(product.final_price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <ShareBar
                        compact
                        url={`${window.location.origin}/product/${product.certificate_id}`}
                        productName={product.name}
                        artisanName={artisan?.name}
                      />
                      <button
                        onClick={() => setQrProduct({
                          name: product.name,
                          certificate_id: product.certificate_id,
                        })}
                        className="btn-outline flex-1 text-xs py-2 flex items-center justify-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
                        </svg>
                        QR
                      </button>
                      <Link to={`/product/${product.certificate_id}`} target="_blank"
                        className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" /> Story
                      </Link>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
