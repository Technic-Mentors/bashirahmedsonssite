import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center sm:px-6">
      <h1 className="font-serif text-6xl text-gold-300">404</h1>
      <p className="mt-4 text-charcoal-light">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
