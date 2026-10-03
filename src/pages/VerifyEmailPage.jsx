import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/auth.api';
import Spinner from '../components/ui/Spinner';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const requested = useRef(null);

  useEffect(() => {
    if (requested.current === token) return;
    requested.current = token;
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
      {status === 'loading' && <Spinner />}
      {status === 'success' && (
        <>
          <h1 className="font-serif text-2xl text-charcoal">Email Verified!</h1>
          <p className="mt-2 text-charcoal-light">Your email has been verified successfully.</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="font-serif text-2xl text-charcoal">Verification Failed</h1>
          <p className="mt-2 text-charcoal-light">This link is invalid or has expired.</p>
        </>
      )}
      <Link to="/" className="mt-6 inline-block text-gold-600 hover:text-gold-700">
        Return Home
      </Link>
    </div>
  );
}
