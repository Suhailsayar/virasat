import { useState } from 'react';
import { Calculator, TrendingUp, Info } from 'lucide-react';

const LIVING_WAGE = 350; // INR/hr — mirrors backend constant

export default function FairTradeCalculator({ onApplyPrice }) {
  const [hours, setHours]    = useState('');
  const [matCost, setMatCost] = useState('');
  const [result, setResult]  = useState(null);

  const calculate = () => {
    const h = parseFloat(hours);
    const m = parseFloat(matCost);
    if (!h || !m || h <= 0 || m <= 0) return;

    const labour   = h * LIVING_WAGE;
    const raw      = labour + m;
    const overhead = Math.ceil(raw * 0.20);
    const fair     = Math.ceil(raw * 1.20);
    setResult({ labour, overhead, fair, raw });
  };

  return (
    <div className="card border-l-4 border-l-forest">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-forest" />
        <h3 className="font-display text-lg text-earth">Fair-Trade Calculator</h3>
      </div>

      <div className="flex items-start gap-2 bg-forest/5 rounded-sm p-3 mb-4">
        <Info className="w-4 h-4 text-forest mt-0.5 shrink-0" />
        <p className="font-body text-xs text-forest/80 leading-relaxed">
          Based on India's urban living wage of <strong>₹350/hour</strong> + material cost + 20% overhead.
          Your craft deserves a fair price.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="section-label text-[10px] block mb-1">Hours Worked</label>
          <input
            type="number" min="0" step="0.5"
            value={hours}
            onChange={e => setHours(e.target.value)}
            placeholder="e.g. 24"
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="section-label text-[10px] block mb-1">Material Cost (₹)</label>
          <input
            type="number" min="0"
            value={matCost}
            onChange={e => setMatCost(e.target.value)}
            placeholder="e.g. 800"
            className="input-field text-sm"
          />
        </div>
      </div>

      <button onClick={calculate} className="btn-primary w-full text-sm py-2 mb-4">
        Calculate Fair Price
      </button>

      {result && (
        <div className="animate-fade-in bg-cream-dark rounded-sm p-4 space-y-2">
          <div className="flex justify-between font-body text-sm">
            <span className="text-earth/70">Labour ({hours}h × ₹{LIVING_WAGE})</span>
            <span className="text-earth font-bold">₹{result.labour.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-earth/70">Materials</span>
            <span className="text-earth font-bold">₹{parseFloat(matCost).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-earth/70">Overhead (20%)</span>
            <span className="text-earth font-bold">₹{result.overhead.toLocaleString('en-IN')}</span>
          </div>
          <div className="border-t border-earth/20 pt-2 flex justify-between">
            <span className="font-display text-earth font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-forest" /> Suggested Fair Price
            </span>
            <span className="font-display text-saffron text-xl font-bold">
              ₹{result.fair.toLocaleString('en-IN')}
            </span>
          </div>
          {onApplyPrice && (
            <button
              onClick={() => onApplyPrice(result.fair)}
              className="btn-outline w-full text-sm py-2 mt-2"
            >
              Apply This Price to Form ↑
            </button>
          )}
        </div>
      )}
    </div>
  );
}
