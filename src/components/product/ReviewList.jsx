import { formatDate } from '../../utils/format';
import Stars from '../ui/Stars';
import EmptyState from '../ui/EmptyState';

export default function ReviewList({ reviews = [], summary }) {
  return (
    <div>
      {summary && summary.count > 0 && (
        <div className="mb-6 flex items-center gap-3">
          <Stars value={summary.average} />
          <span className="text-sm text-charcoal-light">
            {summary.average.toFixed(1)} out of 5 ({summary.count} review{summary.count === 1 ? '' : 's'})
          </span>
        </div>
      )}

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Be the first to review this product." />
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-stone-100 pb-6">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-charcoal">{review.customer_name}</span>
                <span className="text-xs text-stone-400">{formatDate(review.created_at)}</span>
              </div>
              <Stars value={review.rating} size="sm" />
              {review.title && <p className="mt-2 text-sm font-medium text-charcoal">{review.title}</p>}
              {review.comment && <p className="mt-1 text-sm text-charcoal-light">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
