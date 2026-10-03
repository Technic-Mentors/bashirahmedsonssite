import { Component } from 'react';
import Button from './ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
          <h1 className="font-serif text-2xl text-charcoal">Something went wrong</h1>
          <p className="max-w-sm text-sm text-charcoal-light">
            This page ran into an unexpected error. Please try reloading, or head back home.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => (window.location.href = '/')}>
              Go Home
            </Button>
            <Button variant="gold" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
