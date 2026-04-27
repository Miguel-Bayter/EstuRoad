import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="state-center">
          <h2>Algo salió mal</h2>
          <p>
            Ocurrió un error inesperado. Intenta volver al inicio.
          </p>
          <button
            type="button"
            className="btn lime"
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
          >
            Volver al inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
