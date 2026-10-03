import { useRef, useState } from 'react';
import { cn } from '../../../utils/cn';
import { assetUrl } from '../../../utils/media';

export default function ImageUploader({ onChange, label = 'Upload image', existingUrl, className }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(assetUrl(existingUrl) || null);

  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange?.(file);
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 px-4 py-6 text-center transition-colors hover:border-gold-400 hover:bg-gold-50/30"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="h-28 w-28 rounded-md object-cover" />
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-400">
              <path d="M12 16V4m0 0-4 4m4-4 4 4" />
              <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
            <span className="text-sm font-medium text-charcoal-light">{label}</span>
            <span className="text-xs text-stone-400">Click or drag an image here</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
