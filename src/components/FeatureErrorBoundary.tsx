import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    featureName: string;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Granular error boundary for specific features.
 * Prevents errors in one feature from crashing the entire app.
 */
export class FeatureErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const { featureName, onError } = this.props;

        console.error(`🚨 Error in ${featureName}:`, error);
        console.error('📍 Component Stack:', errorInfo.componentStack);

        // Call optional error handler
        if (onError) {
            onError(error, errorInfo);
        }

        // Log to analytics/monitoring service
        this.logFeatureError(error, errorInfo);
    }

    logFeatureError = (error: Error, errorInfo: ErrorInfo) => {
        try {
            const errorReport = {
                feature: this.props.featureName,
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString()
            };

            if (process.env.NODE_ENV === 'development') {
                console.log(`📝 Feature Error Report [${this.props.featureName}]:`, errorReport);
            }
        } catch (loggingError) {
            console.error('Failed to log feature error:', loggingError);
        }
    };

    handleReset = () => {
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default feature error UI
            return (
                <div className="
                    p-6 m-4
                    bg-red-500/10 border-2 border-red-500/30
                    rounded-xl backdrop-blur-[10px]
                ">
                    <div className="
                        flex flex-col items-center gap-4 text-center
                    ">
                        <div className="
                            text-[2.5rem] animate-[shake_0.5s_ease-in-out]
                        ">
                            ⚠️
                        </div>
                        <h3 className="
                            m-0 text-[1.3rem] text-red-400 font-semibold
                        ">
                            {this.props.featureName} Error
                        </h3>
                        <p className="
                            m-0 text-[0.95rem] text-white/80 max-w-100
                        ">
                            This feature encountered an error, but the rest of the app is still working.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="
                                w-full max-w-125 my-2 text-left
                            ">
                                <summary className="
                                    cursor-pointer text-primary-500 font-medium p-2
                                    hover:text-blockchain-accent select-none
                                ">
                                    Error Details
                                </summary>
                                <pre className="
                                    bg-black/40 p-4 rounded-md
                                    text-[0.85rem] text-red-400
                                    overflow-x-auto my-2
                                    whitespace-pre-wrap wrap-break-word
                                ">
                                    {this.state.error.message}
                                </pre>
                            </details>
                        )}

                        <button
                            className="
                                px-6 py-3 text-base font-semibold text-white
                                bg-linear-to-br from-purple-600 to-purple-800
                                border-none rounded-lg cursor-pointer
                                transition-all duration-300
                                shadow-[0_4px_15px_rgba(102,126,234,0.3)]
                                hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(102,126,234,0.4)]
                                active:translate-y-0
                            "
                            onClick={this.handleReset}
                        >
                            🔄 Retry {this.props.featureName}
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default FeatureErrorBoundary;
