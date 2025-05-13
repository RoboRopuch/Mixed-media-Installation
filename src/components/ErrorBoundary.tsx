import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="error-boundary" role="alert">
                    <h2>Something went wrong</h2>
                    <p>Please try refreshing the page</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="error-boundary-button"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
} 