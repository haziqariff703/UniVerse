import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen pt-24 px-8 text-white flex flex-col items-center justify-center text-center">
          <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-2xl max-w-2xl">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-300 mb-6">
              The dashboard crashed due to a runtime error. Please take a
              screenshot of this and send it to support.
            </p>

            <div className="bg-black/50 p-4 rounded-lg text-left overflow-auto max-h-64 font-mono text-sm border border-white/10">
              <p className="text-red-400 font-bold mb-2">
                {this.state.error && this.state.error.toString()}
              </p>
              <pre className="text-gray-500 whitespace-pre-wrap">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
