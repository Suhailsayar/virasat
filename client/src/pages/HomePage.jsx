import { Link } from 'react-router-dom';
import { Leaf, Shield, QrCode, Heart, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Digital Birth Certificate',
    desc: 'Every handmade product gets a unique certificate proving its authenticity and origin.',
  },
  {
    icon: QrCode,
    title: 'QR Code Provenance',
    desc: 'Scan once to reveal the full story — who made it, where, how long, and why.',
  },
  {
    icon: Heart,
    title: 'Fair-Trade Pricing',
    desc: 'Our built-in calculator ensures artisans earn a living wage for their labour.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-weave min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-earth">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-28 text-center">
          <p className="section-label text-gold mb-4">Heritage × Technology</p>
          <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight mb-6">
            Every craft tells<br />
            <em className="text-saffron-light">a story.</em>
          </h1>
          <p className="font-body text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Virasat Connect gives India's artisans a digital identity — a verified birth certificate 
            for every handmade product, bridging ancient craft with modern trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
              Register as Artisan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-outline border-cream text-cream hover:bg-cream hover:text-earth
                                         flex items-center justify-center gap-2">
              Artisan Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <p className="section-label text-center mb-2">What we offer</p>
        <h2 className="font-display text-3xl md:text-4xl text-earth text-center mb-12">
          Authenticity, Transparency, Dignity
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="card hover:shadow-warm-lg transition-shadow duration-300 text-center group">
              <div className="w-14 h-14 bg-saffron/10 rounded-full flex items-center justify-center
                              mx-auto mb-4 group-hover:bg-saffron/20 transition-colors">
                <Icon className="w-7 h-7 text-saffron" />
              </div>
              <h3 className="font-display text-xl text-earth mb-2">{title}</h3>
              <p className="font-body text-earth/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-saffron/10 border-y border-saffron/20 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <Leaf className="w-10 h-10 text-saffron mx-auto mb-4" />
          <h2 className="font-display text-3xl text-earth mb-4">
            Are you a weaver, woodworker, or potter?
          </h2>
          <p className="font-body text-earth/70 mb-8">
            Join thousands of artisans protecting their craft with a digital identity.
            It takes 5 minutes to register your first product.
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Get Started — It's Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
