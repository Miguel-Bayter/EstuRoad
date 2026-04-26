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
        <div className="state-center" style={{ flexDirection: 'column', gap: 16, textAlign: 'center' }}>
          <h2>Algo salió mal</h2>
          <p style={{ color: 'var(--ink-2)', maxWidth: '40ch' }}>
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
