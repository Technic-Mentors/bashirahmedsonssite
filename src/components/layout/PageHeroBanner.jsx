import { motion } from 'framer-motion';
import { assetUrl } from '../../utils/media';

/** Consistent-height page header banner. Shows `imageUrl` as a background when provided
 *  (e.g. an admin-uploaded category banner), otherwise falls back to a plain charcoal panel. */
export default function PageHeroBanner({ title, subtitle, imageUrl }) {
  return (
    <section className="relative overflow-hidden bg-charcoal py-16 text-center">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={assetUrl(imageUrl)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/55" />
        </div>
      )}
      <div className="relative px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-4xl capitalize text-cream"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-lg text-stone-300"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
