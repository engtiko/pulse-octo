import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  declare readonly props: Readonly<ErrorBoundaryProps>;
  declare state: ErrorBoundaryState;
  declare setState: (
    nextState:
      | ErrorBoundaryState
      | ((prevState: ErrorBoundaryState) => ErrorBoundaryState)
  ) => void;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (typeof console !== 'undefined' && console.error) {
      console.error('[Pulse OCTO] Boundary caught error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      const isAr =
        typeof document !== 'undefined'
          ? document.documentElement.lang !== 'en'
          : true;

      return (
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="min-h-screen bg-[#030108] text-slate-100 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="max-w-md rounded-2xl bg-[#090612] border border-purple-500/30 p-8 shadow-2xl space-y-4">
            <h1 className="text-xl font-bold text-white">
              {isAr ? 'حدث خطأ غير متوقع في العرض' : 'Something went wrong'}
            </h1>
            <p className="text-sm text-zinc-400">
              {isAr
                ? 'يمكنك إعادة تحميل الصفحة لاستعادة التجربة الكاملة.'
                : 'Please reload the page to restore the full experience.'}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                if (typeof window !== 'undefined') {
                  window.location.reload();
                }
              }}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-bold transition-colors cursor-pointer"
            >
              {isAr ? 'إعادة تحميل الصفحة' : 'Reload Page'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
