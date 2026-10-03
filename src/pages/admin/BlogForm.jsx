import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  listBlogCategories,
  createBlogCategory,
  uploadBlogPostImage,
} from '../../api/admin/blog.api';
import { useAsync } from '../../hooks/useAsync';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import ImageUploader from '../../components/admin/form/ImageUploader';
import { assetUrl } from '../../utils/media';

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: categories, refetch: refetchCategories } = useAsync(() => listBlogCategories(), []);
  const {
    data: post,
    loading: loadingPost,
    error: loadError,
    refetch: refetchPost,
  } = useAsync(() => (isEdit ? getBlogPost(id) : Promise.resolve(null)), [id]);

  const [submitting, setSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryId: '',
      title: '',
      excerpt: '',
      content: '',
      status: 'draft',
      tags: '',
      metaTitle: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    if (isEdit && post) {
      reset({
        categoryId: String(post.category_id ?? post.categoryId ?? ''),
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        status: post.status || 'draft',
        tags: (post.tags || []).join(', '),
        metaTitle: post.meta_title || post.metaTitle || '',
        metaDescription: post.meta_description || post.metaDescription || '',
      });
    }
  }, [isEdit, post, reset]);

  if (isEdit && loadingPost) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isEdit && loadError) {
    return <ErrorState message="Could not load this post." onRetry={refetchPost} />;
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      await createBlogCategory({ name: newCategoryName.trim() });
      toast.success('Category created.');
      setNewCategoryName('');
      refetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setCreatingCategory(false);
    }
  }

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const payload = {
        categoryId: values.categoryId ? Number(values.categoryId) : undefined,
        title: values.title,
        excerpt: values.excerpt || undefined,
        content: values.content,
        status: values.status,
        metaTitle: values.metaTitle || undefined,
        metaDescription: values.metaDescription || undefined,
        tags: values.tags
          ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      if (isEdit) {
        await updateBlogPost(id, payload);
        toast.success('Post updated.');
        refetchPost();
      } else {
        const created = await createBlogPost(payload);
        toast.success('Post created.');
        navigate(`/admin/blog/${created.id}/edit`, { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFeaturedImage(file) {
    try {
      await uploadBlogPostImage(id, file);
      toast.success('Featured image uploaded.');
      refetchPost();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-charcoal">{isEdit ? 'Edit Post' : 'New Post'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-charcoal">Content</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Title" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
            <Select label="Category" {...register('categoryId')}>
              <option value="">No category</option>
              {(categories || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select label="Status" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
            <Input label="Tags (comma-separated)" {...register('tags')} />
          </div>
          <div className="mt-3 flex items-end gap-2">
            <Input
              label="Add a new category"
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button type="button" variant="outline" loading={creatingCategory} onClick={handleCreateCategory}>
              Add
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <Textarea label="Excerpt" rows={2} {...register('excerpt')} />
            <Textarea
              label="Content"
              rows={12}
              error={errors.content?.message}
              {...register('content', { required: 'Content is required' })}
            />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-charcoal">SEO</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Meta Title" {...register('metaTitle')} />
            <Input label="Meta Description" {...register('metaDescription')} />
          </div>
        </div>

        {isEdit && (
          <div className="rounded-lg border border-stone-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-charcoal">Featured Image</h3>
            {post?.featured_image ? (
              <img
                src={assetUrl(post.featured_image)}
                alt=""
                className="mb-4 h-40 w-full max-w-sm rounded-md object-cover"
              />
            ) : null}
            <ImageUploader label="Upload featured image" onChange={handleFeaturedImage} />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/blog')}>
            Cancel
          </Button>
          <Button type="submit" variant="gold" loading={submitting}>
            {isEdit ? 'Save Changes' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
