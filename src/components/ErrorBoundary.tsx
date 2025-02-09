import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    
    if (hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "8px" }}>
          <h2>Oops! Something went wrong.</h2>
          <p>{error ? error.message : "An unexpected error occurred"}</p>
          <p>We apologize for the inconvenience. Please try again later.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
