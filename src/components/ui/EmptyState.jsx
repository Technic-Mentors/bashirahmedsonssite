export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon && <div className="text-4xl text-stone-300">{icon}</div>}
      <h3 className="font-serif text-xl text-charcoal">{title}</h3>
      {description && <p className="max-w-sm text-sm text-charcoal-light">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
