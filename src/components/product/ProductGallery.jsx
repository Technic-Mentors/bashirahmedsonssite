import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { assetUrl } from '../../utils/media';

export default function ProductGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const active = images[activeIndex];

  if (images.length === 0) {
    return <div className="aspect-square w-full rounded-md bg-stone-100" />;
  }

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  return (
    <div>
      <div
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-md bg-stone-100"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active.id}
            src={assetUrl(active.image_path)}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ transformOrigin: zoomOrigin }}
            className={cn(
              'h-full w-full object-contain p-4 transition-transform duration-200 ease-out',
              zooming && 'scale-[2.2]',
            )}
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-stone-100 transition-colors',
                i === activeIndex ? 'border-gold-500' : 'border-transparent',
              )}
            >
              <img src={assetUrl(img.image_path)} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
