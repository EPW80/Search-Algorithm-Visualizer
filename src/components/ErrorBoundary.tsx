import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
    retryCount: number;
    errorTimestamp?: number;
}

const MAX_RETRY_COUNT = 3;

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, retryCount: 0 };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
            errorTimestamp: Date.now()
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('🚨 Error Boundary caught an error:', error);
        console.error('📍 Error Info:', errorInfo);
        console.error('📊 Component Stack:', errorInfo.componentStack);

        // Call optional error handler
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log error for analytics/monitoring
        this.logError(error, errorInfo);

        // Store error info for display
        this.setState({ errorInfo });
    }

    logError = async (error: Error, errorInfo: ErrorInfo) => {
        try {
            const errorReport = {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                retryCount: this.state.retryCount
            };

            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.log('📝 Error Report:', errorReport);
            }

            // In production, you could send to an error tracking service
            // await fetch(ERROR_REPORT_ENDPOINT, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(errorReport)
            // });
        } catch (loggingError) {
            console.error('Failed to log error:', loggingError);
        }
    };

    handleReset = () => {
        const newRetryCount = this.state.retryCount + 1;

        if (newRetryCount >= MAX_RETRY_COUNT) {
            console.warn(`⚠️ Maximum retry count (${MAX_RETRY_COUNT}) reached`);
            // Still allow reset, but show reload button
            this.setState({ hasError: false, retryCount: newRetryCount });
        } else {
            console.log(`🔄 Retrying... (Attempt ${newRetryCount}/${MAX_RETRY_COUNT})`);
            this.setState({
                hasError: false,
                retryCount: newRetryCount
            });
        }
    };

    handleReload = () => {
        window.location.reload();
    };

    handleClearError = () => {
        this.setState({
            hasError: false,
            retryCount: 0
        });
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="
                    min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-gray-100 to-gray-300
                    dark:from-slate-800 dark:to-slate-900
                    p-5 max-md:p-[15px]
                ">
                    <div className="
                        bg-white dark:bg-gray-800
                        rounded-xl p-10 max-md:p-7 max-md:px-5
                        shadow-[0_10px_25px_rgba(0,0,0,0.1)]
                        max-w-[600px] w-full text-center
                    ">
                        <div className="text-6xl mb-5 opacity-80">⚠️</div>
                        <h2 className="
                            text-red-600 text-3xl max-md:text-2xl
                            font-semibold mb-4 mt-0
                        ">
                            Oops! Something went wrong
                        </h2>
                        <p className="
                            text-gray-600 dark:text-gray-300
                            text-lg leading-relaxed mb-7
                        ">
                            The Search Algorithm Visualizer encountered an unexpected error.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="
                                text-left my-5
                                bg-gray-50 dark:bg-gray-700
                                border border-gray-200 dark:border-gray-600
                                rounded-lg p-4
                            ">
                                <summary className="
                                    cursor-pointer font-semibold
                                    text-red-600 dark:text-red-400
                                    mb-2.5 outline-none
                                    hover:text-red-700 dark:hover:text-red-300
                                ">
                                    Error Details (Development Mode)
                                </summary>
                                <div className="
                                    font-mono text-[0.85rem] leading-snug
                                    text-gray-700 dark:text-gray-300
                                ">
                                    <strong>Error:</strong> {this.state.error.message}
                                    <br />
                                    <strong>Stack:</strong>
                                    <pre className="
                                        bg-white dark:bg-gray-900
                                        border border-gray-300 dark:border-gray-700
                                        rounded p-2.5 overflow-x-auto my-2
                                        whitespace-pre-wrap break-words
                                    ">{this.state.error.stack}</pre>
                                    {this.state.errorInfo && (
                                        <>
                                            <strong>Component Stack:</strong>
                                            <pre className="
                                                bg-white dark:bg-gray-900
                                                border border-gray-300 dark:border-gray-700
                                                rounded p-2.5 overflow-x-auto my-2
                                                whitespace-pre-wrap break-words
                                            ">{this.state.errorInfo.componentStack}</pre>
                                        </>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="
                            flex gap-3 justify-center mb-7 flex-wrap
                            max-md:flex-col max-md:items-center
                        ">
                            {this.state.retryCount < MAX_RETRY_COUNT ? (
                                <button
                                    className="
                                        px-6 py-3 border-none rounded-lg
                                        text-base font-medium cursor-pointer
                                        transition-all duration-200
                                        inline-flex items-center gap-2
                                        bg-blue-600 text-white
                                        hover:bg-blue-700 hover:-translate-y-0.5
                                        max-md:w-full max-md:max-w-[250px]
                                    "
                                    onClick={this.handleReset}
                                >
                                    🔄 Try Again {this.state.retryCount > 0 && `(${this.state.retryCount}/${MAX_RETRY_COUNT})`}
                                </button>
                            ) : (
                                <button
                                    className="
                                        px-6 py-3 border-none rounded-lg
                                        text-base font-medium cursor-pointer
                                        transition-all duration-200
                                        inline-flex items-center gap-2
                                        bg-blue-600 text-white
                                        hover:bg-blue-700 hover:-translate-y-0.5
                                        max-md:w-full max-md:max-w-[250px]
                                    "
                                    onClick={this.handleReload}
                                >
                                    🔃 Reload Page
                                </button>
                            )}
                            {this.state.retryCount > 0 && this.state.retryCount < MAX_RETRY_COUNT && (
                                <button
                                    className="
                                        px-6 py-3 border-none rounded-lg
                                        text-base font-medium cursor-pointer
                                        transition-all duration-200
                                        inline-flex items-center gap-2
                                        bg-gray-600 text-white
                                        hover:bg-gray-700 hover:-translate-y-0.5
                                        max-md:w-full max-md:max-w-[250px]
                                    "
                                    onClick={this.handleReload}
                                >
                                    🔃 Reload Page
                                </button>
                            )}
                            {this.state.retryCount >= MAX_RETRY_COUNT && (
                                <button
                                    className="
                                        px-6 py-3 border-none rounded-lg
                                        text-base font-medium cursor-pointer
                                        transition-all duration-200
                                        inline-flex items-center gap-2
                                        bg-gray-600 text-white
                                        hover:bg-gray-700 hover:-translate-y-0.5
                                        max-md:w-full max-md:max-w-[250px]
                                    "
                                    onClick={this.handleClearError}
                                >
                                    ✖️ Clear Error
                                </button>
                            )}
                        </div>

                        <div className="
                            text-left
                            bg-gray-50 dark:bg-gray-700
                            border-l-4 border-cyan-500
                            p-5 rounded-r-lg mt-5
                        ">
                            <p className="
                                m-0 mb-4 font-semibold
                                text-gray-700 dark:text-gray-300
                            ">
                                If this problem persists, please:
                            </p>
                            <ul className="
                                m-0 pl-5
                                text-gray-600 dark:text-gray-400
                            ">
                                <li className="mb-2 leading-snug">Check the browser console for more details</li>
                                <li className="mb-2 leading-snug">Try refreshing the page</li>
                                <li className="mb-2 leading-snug">Clear your browser cache</li>
                                <li className="mb-2 leading-snug">Report the issue if it continues</li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
