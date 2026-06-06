import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
      <div>
        <h2>Something went wrong</h2>
        <pre>
          {this.state.errorInfo?.componentStack || 'No stack trace'}
        </pre>
      </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
