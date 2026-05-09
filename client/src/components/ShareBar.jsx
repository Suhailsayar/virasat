import { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

// WhatsApp SVG icon (brand accurate)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Twitter/X SVG icon
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

/**
 * ShareBar
 * Props:
 *   url          — full URL to share (the product story page)
 *   productName  — used in pre-filled share text
 *   artisanName  — used in pre-filled share text
 *   compact      — if true, renders as a small inline button row (for dashboard cards)
 */
export default function ShareBar({ url, productName, artisanName, compact = false }) {
  const [copied, setCopied] = useState(false);

  const shareText = `✨ Meet this handcrafted piece by ${artisanName}: "${productName}" — made with love and certified authentic on Virasat Connect.`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl  = encodeURIComponent(url);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: productName, text: shareText, url });
      } catch {
        // User cancelled — do nothing
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  // ── Compact mode (dashboard cards) ───────────────────────
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
          className="w-8 h-8 rounded-sm bg-[#25D366]/10 hover:bg-[#25D366]/20
                     text-[#128C7E] flex items-center justify-center transition-colors"
        >
          <WhatsAppIcon />
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          title="Copy link"
          className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors
                      ${copied
                        ? 'bg-forest/10 text-forest'
                        : 'bg-earth/8 hover:bg-earth/15 text-earth/60 hover:text-earth'
                      }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* Native share (mobile only) */}
        {hasNativeShare && (
          <button
            onClick={handleNativeShare}
            title="Share"
            className="w-8 h-8 rounded-sm bg-earth/8 hover:bg-earth/15
                       text-earth/60 hover:text-earth flex items-center justify-center transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // ── Full mode (product story page) ───────────────────────
  return (
    <div className="bg-white border border-earth/10 rounded-sm shadow-warm px-5 py-4 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Label */}
        <div className="shrink-0">
          <p className="section-label text-[10px] mb-0.5">Share this piece</p>
          <p className="font-body text-xs text-earth/50">Help the artisan reach more buyers</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm font-bold
                       bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E]
                       border border-[#25D366]/20 transition-colors"
          >
            <WhatsAppIcon /> WhatsApp
          </a>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm font-bold
                       bg-black/5 hover:bg-black/10 text-earth
                       border border-earth/15 transition-colors"
          >
            <XIcon /> Post
          </a>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm font-bold
                        border transition-all duration-200
                        ${copied
                          ? 'bg-forest/10 border-forest/30 text-forest'
                          : 'bg-earth/5 border-earth/15 text-earth hover:bg-earth/10'
                        }`}
          >
            {copied
              ? <><Check className="w-4 h-4" /> Copied!</>
              : <><Copy className="w-4 h-4" /> Copy Link</>
            }
          </button>

          {/* Native share — mobile only */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm font-bold
                         bg-saffron/10 border border-saffron/20 text-saffron
                         hover:bg-saffron/20 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          )}
        </div>
      </div>

      {/* URL preview */}
      <div className="mt-3 pt-3 border-t border-earth/8 flex items-center gap-2">
        <span className="font-mono text-[10px] text-earth/40 truncate flex-1">{url}</span>
        <button
          onClick={handleCopy}
          className="text-[10px] font-body font-bold text-saffron hover:text-saffron-dark
                     transition-colors shrink-0"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
