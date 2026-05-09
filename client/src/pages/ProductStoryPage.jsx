import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  MapPin, Clock, Scissors, Award, Printer,
  Leaf, AlertTriangle, ShieldCheck
} from 'lucide-react';
import api from '../api';
import ShareBar from '../components/ShareBar';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ─── Certificate Component (for print view) ───────────────────────
function CertificateView({ product, productUrl }) {
  return (
    <div id="certificate" className="print-only hidden">
      {/* Outer gold border */}
      <div style={{
        width: '210mm', minHeight: '297mm',
        margin: '0 auto',
        padding: '12mm',
        background: '#FDF6EC',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}>
        <div style={{
          border: '3px solid #C9963B',
          padding: '10mm',
          minHeight: '270mm',
          position: 'relative',
          boxShadow: '0 0 0 1px #C9963B inset',
        }}>
          {/* Corner ornaments */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', [pos.split(' ')[0].replace('0','-2mm')]: '-2mm',
              [pos.split(' ')[1].replace('0','-2mm')]: '-2mm',
              width: '12mm', height: '12mm',
              background: '#C9963B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FDF6EC', fontSize: '8pt', fontWeight: 'bold',
            }}>✦</div>
          ))}

          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '1px solid #C9963B', paddingBottom: '8mm', marginBottom: '8mm' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '7pt', letterSpacing: '4px', color: '#C9963B', textTransform: 'uppercase', margin: 0 }}>
              Virasat Connect
            </p>
            <h1 style={{ fontSize: '24pt', color: '#4A2D18', margin: '3mm 0 1mm', fontWeight: 700 }}>
              Certificate of Authenticity
            </h1>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '8pt', color: '#8B5E3C', margin: 0 }}>
              Digital Birth Certificate for Handcrafted Heritage
            </p>
          </div>

          {/* Body */}
          <div style={{ textAlign: 'center', marginBottom: '8mm' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '9pt', color: '#6B4226', marginBottom: '4mm' }}>
              This certifies that the following handmade product was created by
            </p>
            <h2 style={{ fontSize: '20pt', color: '#E8631A', margin: '0 0 2mm' }}>{product.artisan_name}</h2>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '9pt', color: '#8B5E3C', margin: 0 }}>
              {product.craft} · {product.village}, {product.state}
            </p>
          </div>

          {/* Product image if available */}
          {product.image_url && (
            <div style={{ textAlign: 'center', marginBottom: '6mm' }}>
              <img
                src={product.image_url}
                alt={product.product_name}
                style={{ maxHeight: '60mm', maxWidth: '100%', objectFit: 'cover', border: '1px solid #C9963B' }}
              />
            </div>
          )}

          {/* Product details box */}
          <div style={{
            border: '1px solid #C9963B',
            padding: '6mm',
            marginBottom: '8mm',
            background: 'rgba(201, 150, 59, 0.05)',
          }}>
            <h3 style={{ fontSize: '16pt', color: '#4A2D18', margin: '0 0 4mm', textAlign: 'center' }}>
              {product.product_name}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Lato, sans-serif', fontSize: '8pt', color: '#6B4226' }}>
              <span><strong>Materials:</strong> {product.material}</span>
              <span><strong>Time:</strong> {product.hours_worked} hours</span>
              <span><strong>Price:</strong> ₹{parseFloat(product.final_price).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Story */}
          <div style={{ marginBottom: '8mm', padding: '4mm', borderLeft: '3px solid #E8631A' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '8pt', color: '#4A2D18', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
              "{product.story}"
            </p>
          </div>

          {/* QR + Certificate ID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '7pt', color: '#8B5E3C', margin: '0 0 1mm', textTransform: 'uppercase', letterSpacing: '2px' }}>Certificate ID</p>
              <p style={{ fontFamily: '"Courier Prime", monospace', fontSize: '7pt', color: '#4A2D18', margin: '0 0 3mm' }}>{product.certificate_id}</p>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '7pt', color: '#8B5E3C', margin: 0 }}>
                Registered on {formatDate(product.registered_on)}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <QRCodeSVG value={productUrl} size={80} fgColor="#4A2D18" bgColor="#FDF6EC" level="H" />
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '6pt', color: '#8B5E3C', margin: '1mm 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Scan to verify
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', borderTop: '1px solid #C9963B', marginTop: '8mm', paddingTop: '4mm' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '7pt', color: '#C9963B', margin: 0, textTransform: 'uppercase', letterSpacing: '3px' }}>
              ✦  Virasat Connect — Preserving Heritage, Empowering Artisans  ✦
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Story Page ───────────────────────────────────────────────
export default function ProductStoryPage() {
  const { certificateId }   = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  const productUrl = `${window.location.origin}/product/${certificateId}`;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/products/${certificateId}`);
        setProduct(data.product);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [certificateId]);

  const handlePrint = () => {
    document.getElementById('certificate').classList.remove('hidden');
    document.getElementById('certificate').style.display = 'block';
    window.print();
    setTimeout(() => {
      document.getElementById('certificate').style.display = 'none';
    }, 1000);
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-earth/60">Loading product story...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-weave flex items-center justify-center px-4">
      <div className="card text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-saffron mx-auto mb-4" />
        <h2 className="font-display text-2xl text-earth mb-2">Product Not Found</h2>
        <p className="font-body text-earth/60 text-sm mb-6">
          This certificate ID is invalid or the product has been removed.
        </p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-weave">
      {/* Hidden certificate for print */}
      <CertificateView product={product} productUrl={productUrl} />

      {/* Hero Banner — shows product image if available, else colour block */}
      <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>
        {product.image_url ? (
          <>
            <img
              src={product.image_url}
              alt={product.product_name}
              className="w-full object-cover"
              style={{ maxHeight: '480px', width: '100%' }}
            />
            {/* Dark gradient overlay so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-earth/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-earth">
            <div className="absolute inset-0 bg-gradient-to-br from-earth-dark to-earth opacity-90" />
          </div>
        )}

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 py-10 text-center">
          <p className="section-label text-gold mb-3 animate-fade-in">{product.craft}</p>
          <h1 className="font-display text-4xl md:text-5xl text-cream mb-4 animate-slide-up">
            {product.product_name}
          </h1>
          <p className="font-body text-cream/80 text-sm mb-6">
            by <span className="text-gold font-bold">{product.artisan_name}</span>
            {' '}· {product.village}, {product.state}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-saffron/20 border border-saffron/40 text-saffron-light px-4 py-1.5 rounded-full font-body text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Authentic
            </span>
            <span className="bg-gold/20 border border-gold/40 text-gold px-4 py-1.5 rounded-full font-body text-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Digital Birth Certificate
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* The Story */}
        <div className="card shadow-warm-lg">
          <p className="section-label mb-3">The Story</p>
          <blockquote className="font-display text-xl md:text-2xl text-earth leading-relaxed italic border-l-4 border-saffron pl-6">
            "{product.story}"
          </blockquote>
        </div>

        {/* Share Bar */}
        <ShareBar
          url={productUrl}
          productName={product.product_name}
          artisanName={product.artisan_name}
        />

        {/* Meet the Maker */}
        <div className="card shadow-warm-lg">
          <p className="section-label mb-4">Meet the Maker</p>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-earth flex items-center justify-center shrink-0 text-2xl font-display text-cream">
              {product.artisan_name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-2xl text-earth mb-1">{product.artisan_name}</h2>
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="flex items-center gap-1 font-body text-sm text-earth/70">
                  <Scissors className="w-4 h-4 text-saffron" /> {product.craft}
                </span>
                <span className="flex items-center gap-1 font-body text-sm text-earth/70">
                  <MapPin className="w-4 h-4 text-saffron" /> {product.village}, {product.state}
                </span>
              </div>
              {product.artisan_bio && (
                <p className="font-body text-earth/70 text-sm leading-relaxed">{product.artisan_bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Details + QR Side by Side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Details */}
          <div className="card shadow-warm">
            <p className="section-label mb-4">Product Credentials</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-saffron/10 rounded-sm flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4 text-saffron" />
                </div>
                <div>
                  <p className="font-mono text-xs text-earth/50 uppercase tracking-wider">Materials</p>
                  <p className="font-body text-earth">{product.material}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-saffron/10 rounded-sm flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-saffron" />
                </div>
                <div>
                  <p className="font-mono text-xs text-earth/50 uppercase tracking-wider">Time Invested</p>
                  <p className="font-body text-earth">{product.hours_worked} hours of skilled craftsmanship</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest/10 rounded-sm flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-forest" />
                </div>
                <div>
                  <p className="font-mono text-xs text-earth/50 uppercase tracking-wider">Fair Price</p>
                  <p className="font-display text-2xl text-saffron font-bold">
                    ₹{parseFloat(product.final_price).toLocaleString('en-IN')}
                  </p>
                  {product.suggested_price && parseFloat(product.final_price) < parseFloat(product.suggested_price) && (
                    <p className="font-body text-xs text-earth/50">
                      Fair-trade suggested: ₹{parseFloat(product.suggested_price).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-t border-earth/10 pt-4">
                <p className="font-mono text-xs text-earth/50 uppercase tracking-wider mb-1">Registered On</p>
                <p className="font-body text-earth text-sm">{formatDate(product.registered_on)}</p>
              </div>
            </div>
          </div>

          {/* QR Certificate */}
          <div className="card shadow-warm text-center flex flex-col items-center justify-center">
            <p className="section-label mb-3">Digital Birth Certificate</p>
            <div className="p-4 border-2 border-gold rounded-sm mb-4 shadow-certificate">
              <QRCodeSVG
                value={productUrl}
                size={160}
                fgColor="#4A2D18"
                bgColor="#FDF6EC"
                level="H"
                includeMargin
              />
            </div>
            <p className="font-mono text-xs text-earth/40 mb-1 break-all px-4">
              {product.certificate_id}
            </p>
            <p className="font-body text-xs text-earth/50 mb-5">
              Scan to verify authenticity
            </p>
            <button
              onClick={handlePrint}
              className="btn-outline flex items-center gap-2 text-sm no-print"
            >
              <Printer className="w-4 h-4" /> Print Certificate
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center py-6">
          <p className="font-body text-earth/40 text-xs tracking-wide">
            Powered by <Link to="/" className="text-saffron hover:text-saffron-dark transition-colors font-bold">Virasat Connect</Link>
            {' '}· Preserving Heritage, Empowering Artisans
          </p>
        </div>
      </div>
    </div>
  );
}
