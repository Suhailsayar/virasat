import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../api';

/**
 * ImageUploader
 * Props:
 *   onUpload(url)  — called with the server path when upload succeeds
 *   onClear()      — called when image is removed
 *   existingUrl    — pre-fill with an existing image URL (for edit mode)
 */
export default function ImageUploader({ onUpload, onClear, existingUrl = null }) {
  const [preview,   setPreview]   = useState(existingUrl);
  const [status,    setStatus]    = useState('idle'); // idle | uploading | success | error
  const [errorMsg,  setErrorMsg]  = useState('');
  const [dragging,  setDragging]  = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setPreview(null);
    setStatus('idle');
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  const uploadFile = useCallback(async (file) => {
    // Client-side validation
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setStatus('error');
      setErrorMsg('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus('error');
      setErrorMsg('Image must be under 5MB.');
      return;
    }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setStatus('uploading');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('success');
      setPreview(data.url); // switch to server URL
      onUpload?.(data.url);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Upload failed. Please try again.');
      setPreview(null);
    }
  }, [onUpload]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  // ── Render: image preview ─────────────────────────────────
  if (preview && status !== 'error') {
    return (
      <div className="relative group rounded-sm overflow-hidden border border-earth/20 shadow-warm">
        <img
          src={preview}
          alt="Product preview"
          className="w-full h-56 object-cover"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-earth/40 opacity-0 group-hover:opacity-100
                        transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="bg-white text-earth font-body text-xs font-bold px-4 py-2
                       rounded-sm hover:bg-cream transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" /> Replace
          </button>
          <button
            type="button"
            onClick={reset}
            className="bg-red-600 text-white font-body text-xs font-bold px-4 py-2
                       rounded-sm hover:bg-red-700 transition-colors flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Remove
          </button>
        </div>

        {/* Success badge */}
        {status === 'success' && (
          <div className="absolute bottom-2 right-2 bg-forest text-cream text-[10px]
                          font-body font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Uploaded
          </div>
        )}

        {/* Uploading spinner overlay */}
        {status === 'uploading' && (
          <div className="absolute inset-0 bg-earth/60 flex items-center justify-center">
            <Loader className="w-8 h-8 text-cream animate-spin" />
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  // ── Render: drop zone ─────────────────────────────────────
  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-sm cursor-pointer
                    flex flex-col items-center justify-center py-10 px-6
                    transition-all duration-200
                    ${dragging
                      ? 'border-saffron bg-saffron/5 scale-[1.01]'
                      : 'border-earth/25 bg-white/60 hover:border-saffron/60 hover:bg-saffron/5'
                    }
                    ${status === 'error' ? 'border-red-400 bg-red-50' : ''}`}
      >
        {status === 'uploading' ? (
          <>
            <Loader className="w-10 h-10 text-saffron animate-spin mb-3" />
            <p className="font-body text-sm text-earth/70">Uploading image...</p>
          </>
        ) : (
          <>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3
                            ${dragging ? 'bg-saffron/20' : 'bg-earth/8'}`}>
              {status === 'error'
                ? <AlertCircle className="w-7 h-7 text-red-500" />
                : <Image className="w-7 h-7 text-earth/40" />
              }
            </div>
            <p className="font-body text-sm text-earth font-bold mb-1">
              {dragging ? 'Drop it here' : 'Upload product photo'}
            </p>
            <p className="font-body text-xs text-earth/50 text-center">
              Drag & drop or <span className="text-saffron font-bold">click to browse</span>
            </p>
            <p className="font-body text-[10px] text-earth/40 mt-1">
              JPEG, PNG, WebP · max 5MB
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {status === 'error' && (
        <p className="font-body text-xs text-red-600 mt-1.5 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errorMsg}
        </p>
      )}
    </div>
  );
}
