import React, { Component, ErrorInfo, ReactNode } from 'react';
import '../styles/ErrorBoundary.css';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('🚨 Error Boundary caught an error:', error);
        console.error('📍 Error Info:', errorInfo);

        // Call optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Store error info for display
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <div className="error-icon">⚠️</div>
                        <h2 className="error-title">Oops! Something went wrong</h2>
                        <p className="error-message">
                            The Search Algorithm Visualizer encountered an unexpected error.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development Mode)</summary>
                                <div className="error-stack">
                                    <strong>Error:</strong> {this.state.error.message}
                                    <br />
                                    <strong>Stack:</strong>
                                    <pre>{this.state.error.stack}</pre>
                                    {this.state.errorInfo && (
                                        <>
                                            <strong>Component Stack:</strong>
                                            <pre>{this.state.errorInfo.componentStack}</pre>
                                        </>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="error-actions">
                            <button
                                className="error-button error-button-primary"
                                onClick={this.handleReset}
                            >
                                🔄 Try Again
                            </button>
                            <button
                                className="error-button error-button-secondary"
                                onClick={this.handleReload}
                            >
                                🔃 Reload Page
                            </button>
                        </div>

                        <div className="error-help">
                            <p>If this problem persists, please:</p>
                            <ul>
                                <li>Check the browser console for more details</li>
                                <li>Try refreshing the page</li>
                                <li>Clear your browser cache</li>
                                <li>Report the issue if it continues</li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
