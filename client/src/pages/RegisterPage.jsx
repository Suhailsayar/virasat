import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CRAFTS = [
  'Pashmina Weaver', 'Silk Weaver', 'Woodworker', 'Pottery / Ceramics',
  'Leather Craft', 'Block Printing', 'Embroidery', 'Jewellery Maker',
  'Bamboo Craft', 'Stone Carving', 'Metalwork', 'Carpet Weaver', 'Other',
];

export default function RegisterPage() {
  const { register }  = useAuth();
  const navigate      = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', craft: '', village: '', state: '', bio: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-weave flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <div className="card shadow-warm-lg">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-earth rounded-sm flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-cream" />
            </div>
            <h1 className="font-display text-3xl text-earth mb-1">Join Virasat Connect</h1>
            <p className="font-body text-earth/60 text-sm">Create your artisan identity</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-sm p-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="font-body text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="section-label text-[10px] block mb-1">Full Name *</label>
                <input type="text" name="name" required value={form.name}
                  onChange={handleChange} placeholder="Razia Begum"
                  className="input-field" />
              </div>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-1">Email Address *</label>
              <input type="email" name="email" required value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                className="input-field" />
            </div>

            <div>
              <label className="section-label text-[10px] block mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" required value={form.password}
                  onChange={handleChange} placeholder="Min. 8 characters"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earth/40 hover:text-earth transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-1">Craft / Specialization *</label>
              <select name="craft" required value={form.craft}
                onChange={handleChange} className="input-field">
                <option value="">Select your craft</option>
                {CRAFTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="section-label text-[10px] block mb-1">Village / Town *</label>
                <input type="text" name="village" required value={form.village}
                  onChange={handleChange} placeholder="Kanihama"
                  className="input-field" />
              </div>
              <div>
                <label className="section-label text-[10px] block mb-1">State *</label>
                <input type="text" name="state" required value={form.state}
                  onChange={handleChange} placeholder="Jammu & Kashmir"
                  className="input-field" />
              </div>
            </div>

            <div>
              <label className="section-label text-[10px] block mb-1">Your Story (optional)</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                placeholder="Tell buyers a little about yourself and your craft tradition..."
                className="input-field resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
              ) : 'Create Artisan Account'}
            </button>
          </form>

          <p className="font-body text-center text-earth/60 text-sm mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-saffron hover:text-saffron-dark font-bold transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
