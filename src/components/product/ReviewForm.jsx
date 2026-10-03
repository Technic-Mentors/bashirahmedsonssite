import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Stars from '../ui/Stars';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { submitReview } from '../../api/reviews.api';

const schema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().trim().max(150).optional(),
  comment: z.string().trim().max(2000).optional(),
});

export default function ReviewForm({ orderItemId, onSubmitted }) {
  const [loading, setLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { rating: 0, title: '', comment: '' } });

  async function onSubmit(values) {
    setLoading(true);
    try {
      await submitReview({ orderItemId, ...values });
      toast.success('Review submitted for approval.');
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Could not submit review.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <div>
            <p className="mb-1.5 text-sm font-medium text-charcoal-light">Your rating</p>
            <Stars value={field.value} interactive onChange={field.onChange} size="lg" />
            {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating.message}</p>}
          </div>
        )}
      />
      <Input label="Title (optional)" {...register('title')} error={errors.title?.message} />
      <Textarea label="Your review (optional)" rows={4} {...register('comment')} error={errors.comment?.message} />
      <Button type="submit" loading={loading} className="w-full">
        Submit Review
      </Button>
    </form>
  );
}
